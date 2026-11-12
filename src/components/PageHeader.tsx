import { type ReactNode } from 'react'
import { Reveal } from './Reveal'

type Props = { title: string; intro?: ReactNode; kicker?: string }

/** Every page opens the same way: script title, hairline rule, one short line. */
export function PageHeader({ title, intro, kicker }: Props) {
  return (
    <header className="page-header col center">
      {kicker && (
        <Reveal as="p" variant="fade" className="caps page-header__kicker">
          {kicker}
        </Reveal>
      )}
      <Reveal as="h1" variant="wipe" className="script page-header__title">
        {title}
      </Reveal>
      <Reveal variant="fade" delay={500}>
        <hr className="rule" />
      </Reveal>
      {intro && (
        <Reveal as="p" delay={650} className="page-header__intro">
          {intro}
        </Reveal>
      )}
    </header>
  )
}
