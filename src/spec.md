# Specification

## Summary
**Goal:** Persist Transactions per authenticated user in the Motoko backend and wire the frontend Transactions + Dashboard analytics to use backend data instead of localStorage.

**Planned changes:**
- Add a Motoko `Transaction` record type and per-user storage keyed by caller Principal in `backend/main.mo`.
- Implement authenticated CRUD methods for transactions (create, update, delete, list) plus a bulk-create method for CSV imports, including server-side ID generation.
- Update `frontend/src/hooks/useTransactions.ts` to fetch/mutate via the authenticated backend actor and use React Query invalidation so UI updates automatically.
- Switch CSV import workflow to call the backend bulk-create method while keeping the current wizard UX and toast behavior.
- Ensure Dashboard analytics and reward/points estimates use the same backend-backed transactions query source and preserve correct empty states.

**User-visible outcome:** Transactions (including CSV imports) are saved to the backend per Internet Identity user; switching users shows only that user’s transactions, and both the Transactions page and Dashboard analytics stay in sync without manual refresh.
