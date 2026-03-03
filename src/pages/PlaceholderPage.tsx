interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-glean-text-primary mb-3">{title}</h1>
      <div className="card flex items-center justify-center h-64">
        <p className="text-glean-text-tertiary">Coming soon</p>
      </div>
    </div>
  )
}
