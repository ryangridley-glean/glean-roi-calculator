export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function today(): string {
  return toISODate(new Date())
}

export function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return toISODate(d)
}

export function daysBetween(start: string, end: string): string[] {
  const dates: string[] = []
  const cur = new Date(start)
  const last = new Date(end)
  while (cur <= last) {
    dates.push(toISODate(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

export function diffDays(start: string, end: string): number {
  const a = new Date(start)
  const b = new Date(end)
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}
