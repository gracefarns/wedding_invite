import { ArtImage } from './ArtImage'

/** A tied ribbon laid across its parent: band, two tails and the bow. All four are images. */
export function RibbonTie({ className }: { className?: string }) {
  return (
    <span className={`tie${className ? ` ${className}` : ''}`} aria-hidden="true">
      <span className="tie__band">
        <ArtImage slot="ribbonBand" quiet natural={false} sizes="(min-width: 640px) 420px, 90vw" />
      </span>
      <span className="tie__tail tie__tail--left">
        <ArtImage slot="ribbonTailLeft" quiet sizes="120px" />
      </span>
      <span className="tie__tail tie__tail--right">
        <ArtImage slot="ribbonTailRight" quiet sizes="120px" />
      </span>
      <span className="tie__knot">
        <ArtImage slot="ribbonKnot" quiet sizes="240px" />
      </span>
    </span>
  )
}
