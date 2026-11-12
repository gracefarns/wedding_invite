# RSVP setup

Until an endpoint is set, the RSVP page shows a polite "Opening soon" card. To preview the form
before then, open `/rsvp?preview=1` (nothing is sent in preview).

There are two ways to collect replies. Pick one.

## Option A: Google Sheet (recommended, free)

Each reply becomes a row in a Google Sheet you own.

1. Create a new Google Sheet. Name it something like "Wedding RSVPs".
2. In the sheet, open **Extensions → Apps Script**.
3. Delete whatever is in the editor and paste the script below.
4. Click **Deploy → New deployment**. Choose type **Web app**, then set:
   - **Execute as**: Me
   - **Who has access**: Anyone
5. Click **Deploy**, approve the permissions when asked, and copy the **Web app URL**. It ends in `/exec`.
6. Open [`src/content/site.config.ts`](src/content/site.config.ts) and set:

   ```ts
   rsvp: {
     provider: 'google-apps-script',
     endpoint: 'https://script.google.com/macros/s/XXXXXXXX/exec',
     ...
   }
   ```

7. Commit and deploy. Send yourself a test reply and check that the row appears.

If you change the script later, use **Deploy → Manage deployments → Edit → Version: New version**.
The URL stays the same.

### The script

```js
/**
 * Clara & Clark · RSVP collector.
 * Appends each reply to the first sheet of this spreadsheet.
 */
const COLUMNS = [
  'submittedAt',
  'name',
  'email',
  'attending',
  'guests',
  'guestNames',
  'meals',
  'dietary',
  'song',
  'note',
]
const HEADINGS = [
  'Received',
  'Name',
  'Email',
  'Attending',
  'Guests',
  'Guest names',
  'Meals',
  'Dietary needs',
  'Song request',
  'Note',
]

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.waitLock(20000)
  try {
    const data = JSON.parse(e.postData.contents)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADINGS)
      sheet.setFrozenRows(1)
    }
    // Stop a value that begins with =, +, - or @ from being read as a formula.
    const safe = (value) => {
      const text = value === undefined || value === null ? '' : String(value)
      return /^[=+\-@]/.test(text) ? "'" + text : text
    }
    sheet.appendRow(COLUMNS.map((key) => safe(data[key])))
    return reply({ result: 'success' })
  } catch (err) {
    return reply({ result: 'error', error: String(err) })
  } finally {
    lock.releaseLock()
  }
}

function doGet() {
  return reply({ result: 'ready' })
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON)
}
```

Optional: to get an email for each reply, add this line just before `return reply({ result: 'success' })`:

```js
MailApp.sendEmail('you@example.com', 'RSVP from ' + data.name, JSON.stringify(data, null, 2))
```

### How it talks to the site

The form posts the reply as JSON with a `text/plain` content type. That keeps it a "simple"
request, which matters because Apps Script web apps cannot answer the browser's CORS preflight.
The script answers `{"result":"success"}`, and the site only shows the thank-you card when it sees
exactly that. Anything else shows the error message with your contact email.

## Option B: Formspree

Replies arrive by email and in the Formspree dashboard. The free plan has a monthly cap.

1. Create a form at [formspree.io](https://formspree.io) and copy its endpoint, which looks like
   `https://formspree.io/f/abcdwxyz`.
2. In `src/content/site.config.ts` set:

   ```ts
   rsvp: {
     provider: 'formspree',
     endpoint: 'https://formspree.io/f/abcdwxyz',
     ...
   }
   ```

3. Commit and deploy, then send a test reply.

## What is collected

| Field | Notes |
|---|---|
| `submittedAt` | ISO timestamp from the guest's browser |
| `name`, `email` | The person replying |
| `attending` | `yes` or `no` |
| `guests` | Party size, `0` when declining |
| `guestNames` | Everyone in the party, separated by `;` |
| `meals` | `Name: choice` for each guest, separated by `;` |
| `dietary`, `song`, `note` | Free text, may be empty |

Meal options, the largest party size and the contact email shown in messages are all in the
`rsvp` block of `site.config.ts`.

## Good to know

- The form has a hidden honeypot field. Bots that fill it get the thank-you card and nothing is sent.
- The endpoint URL is public in the site's code. That is normal for both options; it can only add rows.
- Replies are not de-duplicated. If someone replies twice, the later row is their current answer.
