import { site } from '../content/site.config'
import { useApp } from '../lib/app'
import { weddingDate } from '../lib/dates'
import { Monogram } from './Monogram'

export function Footer() {
  const { replayIntro } = useApp()
  const { first, joiner, second } = site.couple
  return (
    <footer className="footer paper paper--linen">
      <div className="col center footer__inner">
        <Monogram className="footer__mark" />
        <p className="caps">{weddingDate.long}</p>
        <p className="caps footer__venue">
          {site.venue.name} · {site.venue.locality}
        </p>
        <hr className="rule footer__rule" />
        <button type="button" className="link-caps" onClick={replayIntro}>
          {site.footer.replay}
        </button>
        <p className="footer__note caps">{site.footer.note}</p>
        <p className="footer__signature script">
          {first} {joiner} {second}
        </p>
      </div>
    </footer>
  )
}
