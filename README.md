# glean-roi-calculator

Demo for Glean ROI Calculator.

## Connecting to real customer usage

The UI expects data in the shape defined in `src/types/api.ts` (`MetricsResponse`: usage totals, daily series, departments, contract). **`GleanDataProvider` in `src/api/glean/index.ts` is not fully implemented yet** — it outlines which endpoints to call but still throws until responses are mapped into that shape.

### 1. Turn off mock data

Copy `.env.example` to `.env.local` and set:

- `VITE_USE_MOCK=false`
- `VITE_GLEAN_BASE_URL` — your customer’s Glean instance origin (see `src/api/glean/endpoints.ts` for paths this app expects).
- `VITE_GLEAN_API_KEY` — only for local/dev if your team uses a bearer token against those APIs.

Restart `pnpm dev` / `npm run dev` after changing env.

### 2. Implement the mapping layer

You (or Glean’s internal API owners) need to:

1. Confirm the **real** admin/analytics contracts for usage, departments, and contract metadata — the paths in `endpoints.ts` are placeholders aligned with a REST-style admin API, not necessarily the public [Insights](https://developers.glean.com/api/client-api/insights/overview) / [Activity](https://developers.glean.com/api/client-api/activity/overview) APIs.
2. In `GleanDataProvider.getMetrics`, translate `MetricsRequest` (date range, optional department) into query/body params, call the usage endpoint(s), and build `UsageSummary` + `DepartmentUsage[]` + `ContractInfo`.
3. Wire `getContract` and optionally `getAgentUseCases` the same way (agent use cases may stay mock or come from a separate internal endpoint).

### 3. Security and “real-time”

- **Secrets:** `VITE_*` variables are exposed in the browser bundle. For anything customer-facing or long-lived, use a **backend proxy** or serve this inside **Glean admin** with normal session authentication instead of a static key in the client.
- **CORS:** Direct browser calls to the Glean origin may be blocked unless that origin is allowlisted; a same-origin proxy avoids that.
- **Real-time:** This app refetches when filters change; “live” usage is whatever freshness the upstream APIs provide (often near–real-time aggregates, not streaming). Add polling only if product needs it.
