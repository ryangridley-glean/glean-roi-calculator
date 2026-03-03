interface BadgeProps {
  label: string
  variant?: 'new' | 'blue' | 'green' | 'orange' | 'teal' | 'rose'
}

const styles: Record<string, string> = {
  new:    'bg-purple-100 text-purple-700',
  blue:   'bg-blue-100 text-blue-700',
  green:  'bg-green-100 text-green-700',
  orange: 'bg-orange-100 text-orange-700',
  teal:   'bg-teal-100 text-teal-700',
  rose:   'bg-rose-100 text-rose-700',
}

export function Badge({ label, variant = 'new' }: BadgeProps) {
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${styles[variant]} uppercase tracking-wide`}>
      {label}
    </span>
  )
}
