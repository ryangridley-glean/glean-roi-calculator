export class GleanClient {
  constructor(
    private apiKey: string,
    private baseUrl: string,
  ) {}

  async get<T>(endpoint: string, params?: Record<string, string | undefined>): Promise<T> {
    const url = new URL(this.baseUrl + endpoint)
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) url.searchParams.set(k, v)
      })
    }
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) throw new Error(`Glean API error: ${res.status} ${res.statusText}`)
    return res.json() as Promise<T>
  }
}
