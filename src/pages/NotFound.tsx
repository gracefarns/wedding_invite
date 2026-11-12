import { PageHeader } from '../components/PageHeader'
import { TLink } from '../components/TLink'
import { usePageTitle } from '../lib/hooks'

export default function NotFound() {
  usePageTitle('Page not found')
  return (
    <div className="page notfound">
      <PageHeader title="Lost in the garden" intro="That page does not seem to exist. Let us walk you back." />
      <p className="center">
        <TLink to="/" className="btn">
          Home
        </TLink>
      </p>
    </div>
  )
}
