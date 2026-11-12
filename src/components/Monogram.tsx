import { site } from '../content/site.config'

/** The "C & C" monogram, set in the script face. Text, so it stays crisp at any size. */
export function Monogram({ className }: { className?: string }) {
  const [a, b] = site.couple.initials
  return (
    <span className={`monogram${className ? ` ${className}` : ''}`} aria-hidden="true">
      <span>{a}</span>
      <span className="monogram__amp">{site.couple.joiner}</span>
      <span>{b}</span>
    </span>
  )
}
