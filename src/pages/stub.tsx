import { PageHeader } from '../components/PageHeader'
export const stub = (title: string) => () => (
  <div className="page">
    <PageHeader title={title} intro="Coming together." />
  </div>
)
