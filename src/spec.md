# Specification

## Summary
**Goal:** Provide an authenticated, per-user credit card spending tracker with analytics plus a reward points redemption advisor based on user-entered data.

**Planned changes:**
- Add Internet Identity sign-in, a marketing/intro screen for unauthenticated users, and per-user data isolation for all stored records.
- Implement a Motoko backend Transactions model with CRUD methods, basic date-range filtering, stable persistence, and per-user enforcement.
- Build a Transactions UI with manual entry form, editable table, and filters (date range, merchant, category, card label).
- Add client-side CSV import with column mapping, preview, and persistence of imported rows as transactions.
- Create analytics dashboards: total spend for range, monthly totals chart, category breakdown chart, top merchants, and computed insights (biggest category, month-over-month change, average monthly spend).
- Implement a Reward Points module to manage reward program profiles, balances, and multiple redemption options; compute and display cents-per-point (CPP) and net value after fees.
- Provide redemption recommendations by ranking options by CPP, showing plain-English explanations, and flagging low-value options using a user-configurable CPP threshold.
- Connect spend to rewards via user-defined earning rates by category (optionally by card label) and display estimated points earned summaries over the selected range.
- Add an onboarding/help section explaining workflows (including CSV expectations and CPP calculation) and an educational/not-financial-advice disclaimer.
- Apply a coherent, non-default visual theme suitable for personal finance (avoid blue/purple as the primary palette) across Dashboard, Transactions, and Rewards screens.
- Add generated static assets (logo + simple dashboard illustration) stored under `frontend/public/assets/generated`, used in the app shell and landing/empty states.

**User-visible outcome:** Users can sign in, enter or import transactions, filter and analyze spending with charts and insights, manage reward programs and redemption options with CPP-based recommendations, estimate points earned from spend, and access a help/disclaimer section—all with a consistent visual theme and custom app imagery.
