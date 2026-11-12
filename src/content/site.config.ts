/**
 * Every word and every wedding fact on the site lives in this file.
 *
 * Lines marked `TODO confirm` are the values given so far and need a final check.
 * Blocks marked `PLACEHOLDER` are invented copy, written to be replaced.
 */

export type RsvpProvider = 'google-apps-script' | 'formspree'

export const site = {
  couple: {
    first: 'Clara', // TODO confirm
    second: 'Clark', // TODO confirm
    joiner: '&',
    /** The two initials shown in the monogram. */
    initials: ['C', 'C'] as [string, string], // TODO confirm
  },

  wedding: {
    /** ISO date, local to the venue. */
    date: '2027-04-24', // TODO confirm
    /** 24-hour local times at the venue. */
    ceremonyStart: '16:00', // TODO confirm — PLACEHOLDER time
    dayEnds: '23:30', // TODO confirm — PLACEHOLDER time
    /** IANA timezone of the venue. Used for the countdown and calendar files. */
    timezone: 'Europe/London', // TODO confirm — PLACEHOLDER timezone
    attire: 'Garden formal', // TODO confirm
  },

  venue: {
    name: 'Larkspur House', // TODO confirm
    addressLines: ['Larkspur Lane', 'Midhurst, West Sussex'], // TODO confirm — PLACEHOLDER address
    /** Short place line used on the hero, footer and metadata. */
    locality: 'West Sussex', // TODO confirm — PLACEHOLDER
    /** Leave empty to build a Google Maps search from the name and address. */
    mapUrl: '', // TODO confirm
  },

  rsvp: {
    deadline: '2027-03-01', // TODO confirm
    /**
     * Where RSVPs are sent. Leave `endpoint` empty and the page shows "RSVP opens soon".
     * See RSVP_SETUP.md for both options.
     *   provider 'google-apps-script' → the web-app URL ending in /exec
     *   provider 'formspree'          → https://formspree.io/f/xxxxxxxx
     */
    provider: 'google-apps-script' as RsvpProvider,
    endpoint: '', // TODO confirm
    maxGuests: 4, // TODO confirm
    meals: ['Spring lamb, minted peas', 'Roast sea bass, fennel', 'Garden risotto (vegetarian)', "Children's supper"], // TODO confirm — PLACEHOLDER menu
    /** Shown beneath the form if RSVPs fail, and on the "opens soon" state. */
    contactEmail: 'hello@claraandclark.example', // TODO confirm — PLACEHOLDER
  },

  meta: {
    title: 'Clara & Clark · 24 April 2027',
    description: 'Kindly join us for the wedding of Clara and Clark at Larkspur House on Saturday, 24 April 2027.',
    /** Absolute URL of the deployed site, used for Open Graph tags. */
    url: '', // TODO confirm
  },

  nav: [
    { to: '/', label: 'Home' },
    { to: '/our-story', label: 'Our Story' },
    { to: '/details', label: 'Details' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/travel', label: 'Travel & Stay' },
    { to: '/registry', label: 'Registry' },
    { to: '/rsvp', label: 'RSVP' },
    { to: '/faq', label: 'FAQ' },
  ],

  intro: {
    cardKicker: 'The wedding of',
    prompt: 'Tap to open',
    skip: 'Skip',
    scroll: 'Scroll',
  },

  home: {
    /** 'garden' uses florals/garden-blur.jpg, 'couple' uses couple/hero.jpg (falls back to the other). */
    heroImage: 'garden' as 'garden' | 'couple',
    kicker: ['Kindly join us', 'for the wedding of'],
    portraitCaption: 'Larkspur, last spring', // PLACEHOLDER
    countdownKicker: 'Counting down to',
    countdownScript: 'forever',
    countdownDone: 'Just married',
    ctaTitle: 'Will you join us?',
    ctaText:
      'It would mean the world to have you with us in the garden. Kindly let us know by the first of March.', // PLACEHOLDER
    ctaButton: 'RSVP',
    quickLinks: [
      { to: '/our-story', kicker: 'How it began', title: 'Our Story' },
      { to: '/details', kicker: 'The day', title: 'Details' },
      { to: '/gallery', kicker: 'A few favourites', title: 'Gallery' },
      { to: '/travel', kicker: 'Getting here', title: 'Travel & Stay' },
      { to: '/registry', kicker: 'With thanks', title: 'Registry' },
      { to: '/faq', kicker: 'Good to know', title: 'Questions' },
    ],
  },

  // PLACEHOLDER — the whole story is invented copy.
  story: {
    title: 'Our Story',
    intro: 'Ten years, two cities, one very patient dog, and a garden we cannot wait to share with you.',
    chapters: [
      {
        when: 'Autumn 2017',
        title: 'A borrowed umbrella',
        text: 'We met in a doorway on a wet October evening, both waiting out the rain. Clark offered his umbrella. Clara walked off with it and, as it turned out, with him.',
        image: 'couple/story-1.jpg',
        alt: 'Clara and Clark early in their relationship',
        mat: 'arch' as const,
      },
      {
        when: 'Summer 2019',
        title: 'The long way home',
        text: 'A weekend away became three weeks on back roads with a paper map and no particular plan. We learned who navigates, who drives, and that neither of us will admit to being lost.',
        image: 'couple/story-2.jpg',
        alt: 'Clara and Clark travelling together',
        mat: 'oval' as const,
      },
      {
        when: 'Spring 2022',
        title: 'A house with a garden',
        text: 'We found a small house with an overgrown garden and far too many roses. Saturdays have smelled of cut grass and coffee ever since.',
        image: 'couple/story-3.jpg',
        alt: 'Clara and Clark at home in the garden',
        mat: 'arch' as const,
      },
      {
        when: 'April 2026',
        title: 'The question',
        text: 'Under the wisteria, with tea going cold on the bench, Clark asked. Clara said yes before he had finished the sentence.',
        image: 'couple/story-4.jpg',
        alt: 'Clara and Clark just after the proposal',
        mat: 'oval' as const,
      },
    ],
    closing: 'And now, a garden full of the people we love.',
  },

  details: {
    title: 'Wedding Details',
    intro:
      'We joyfully invite you to celebrate with us in the gardens of Larkspur House, with dinner by candlelight and dancing until late.', // PLACEHOLDER
    whenLabel: 'When',
    whereLabel: 'Where',
    calendarLabel: 'Add to calendar',
    googleCalendarLabel: 'Google Calendar',
    directionsLabel: 'Get directions',
    envelopeCaption: 'Larkspur House, in watercolour',
    eventsTitle: 'Order of Events',
    // TODO confirm — PLACEHOLDER times throughout
    events: [
      { time: '3:30 pm', title: 'Guests arrive', note: 'A glass of something cold in the walled garden' },
      { time: '4:00 pm', title: 'Ceremony', note: 'Beneath the old magnolia' },
      { time: '4:45 pm', title: 'Garden reception', note: 'Champagne, canapés and croquet on the lawn' },
      { time: '6:30 pm', title: 'Dinner', note: 'By candlelight in the orangery' },
      { time: '8:30 pm', title: 'Cake and toasts', note: 'Speeches, kept mercifully short' },
      { time: '9:00 pm', title: 'Dancing', note: 'Until the carriages at half past eleven' },
    ],
    attireTitle: 'Attire',
    attireText:
      'Garden formal. Think long dresses, light suits and colour drawn from the garden. Much of the day is on lawn and gravel, so block heels or flats will serve you well, and a wrap is wise once the sun goes down.', // PLACEHOLDER
    attirePaletteNote: 'Our colours, should you care to echo them',
    parkingTitle: 'Parking & Arrival',
    parkingText:
      'Please arrive from half past three. There is parking for every guest in the meadow beside the main gate, a short, level walk from the house. Taxis are best booked ahead for half past eleven.', // PLACEHOLDER
  },

  gallery: {
    title: 'Gallery',
    intro: 'A few favourite frames from the years so far.', // PLACEHOLDER
  },

  // PLACEHOLDER — hotels, codes and travel notes are invented.
  travel: {
    title: 'Travel & Stay',
    intro: 'Larkspur House sits a little off the beaten path. Here is how to find it, and where to rest your head.',
    hotelsTitle: 'Where to stay',
    hotels: [
      {
        name: 'The Spread Eagle',
        notes: 'A fifteenth-century coaching inn, ten minutes from the house. Rooms are held for our guests until 1 February.',
        blockCode: 'CLARACLARK27',
        url: 'https://example.com/spread-eagle',
        distance: '10 minutes by car',
      },
      {
        name: 'Park House',
        notes: 'A quiet country hotel with gardens and a spa. A handful of rooms are held at a preferred rate.',
        blockCode: 'LARKSPUR',
        url: 'https://example.com/park-house',
        distance: '15 minutes by car',
      },
      {
        name: 'The Angel Inn',
        notes: 'Friendly, simple and right on the high street, with an easy walk to supper the night before.',
        blockCode: '',
        url: 'https://example.com/angel-inn',
        distance: '12 minutes by car',
      },
    ],
    airportTitle: 'Nearest airport',
    airportName: 'London Gatwick (LGW)',
    airportText: 'About fifty minutes from the house by car. London Heathrow is around seventy-five minutes.',
    gettingThereTitle: 'Getting there',
    gettingThere: [
      { mode: 'By train', text: 'Haslemere is the nearest station, an hour from London Waterloo. Taxis wait outside and the house is twenty minutes on.' },
      { mode: 'By car', text: 'Follow the A286 to Midhurst, then the signs for Larkspur Lane. The gate is on the left after the stone bridge.' },
      { mode: 'On the night', text: 'A shuttle will run between the house and the three hotels at half past eleven and at midnight.' },
    ],
  },

  // PLACEHOLDER — registry links are examples.
  registry: {
    title: 'Registry',
    intro:
      'Your presence is the greatest gift, truly. For those who have asked, we have gathered a few things for the home we are making together.',
    cards: [
      { name: 'The White Company', note: 'Linens and things for the table', url: 'https://example.com/registry-one' },
      { name: 'John Lewis', note: 'For the kitchen and the garden', url: 'https://example.com/registry-two' },
    ],
    visitLabel: 'Visit registry',
    honeymoon: {
      show: true,
      title: 'Honeymoon fund',
      text: 'We are saving for two slow weeks on the Amalfi coast. A small note toward a long lunch by the sea would be received with real delight.',
      url: 'https://example.com/honeymoon',
      label: 'Contribute',
    },
  },

  rsvpPage: {
    title: 'Will you join us?',
    intro: 'One reply per household is perfect.',
    soonTitle: 'RSVP opens soon',
    soonText: 'We are just finishing the guest list. Please check back shortly, or write to us in the meantime.',
    successTitle: 'Thank you',
    successAccept: 'Your reply is safely with us. We cannot wait to celebrate with you.',
    successDecline: 'Your reply is safely with us. You will be so missed, and we will raise a glass to you.',
    errorText: 'Something went wrong and your reply was not sent. Please try again, or write to us at',
    honeymoonNote:
      'Your presence is the greatest gift of all. For those who wish, a small note toward our honeymoon would be warmly received.',
  },

  // PLACEHOLDER — answers are invented and need checking.
  faq: {
    title: 'Questions',
    intro: 'A few things you may be wondering about.',
    items: [
      { q: 'Are children invited?', a: 'We adore your little ones, and the children of our immediate family will be with us. For everyone else, we hope a child-free evening gives you the chance to relax and stay late.' },
      { q: 'May I bring a guest?', a: 'We are keeping the day to our nearest and dearest, so we can only welcome the guests named on your invitation. If you have a question about your party, simply ask.' },
      { q: 'What should I wear?', a: 'Garden formal: long dresses, light suits and colour from the garden. The ceremony and reception are on grass, so we suggest block heels or flats, and a wrap for the evening.' },
      { q: 'What if it rains?', a: 'April likes to keep us guessing. The ceremony moves into the orangery if the weather turns, and there will be umbrellas at the door.' },
      { q: 'May I take photographs?', a: 'We would love the ceremony to be unplugged, so please keep phones and cameras tucked away until the reception. Our photographer will catch everything, and we will share the gallery with you.' },
      { q: 'Is there parking?', a: 'Yes, in the meadow beside the main gate. Cars may be left overnight and collected by eleven the next morning.' },
      { q: 'I have a dietary requirement', a: 'Please tell us on your RSVP and our caterers will look after you. They are well used to allergies and preferences of every kind.' },
      { q: 'When should I reply by?', a: 'Kindly reply by the first of March so we can give final numbers to the house.' },
    ],
  },

  footer: {
    replay: 'Replay the invitation',
    note: 'With love',
  },
}

export type Site = typeof site
