# Entropi Frontend

> JUNIOR FULLSTACK ENGINEER — Ent-JFE-20/05/26

A financial operations dashboard built with **Next.js 14 (App Router) + TypeScript**, consuming the Entropi Backend API. Displays real-time order tracking, double-entry ledger audit trails, and daily settlement processing.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Browser (Next.js App)                 │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  /orders     │  │  /orders/:id │  │  /settlement │   │
│  │  (list view) │  │ (detail view)│  │  (daily ops) │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                 │                  │          │
│  ┌──────▼─────────────────▼──────────────────▼───────┐  │
│  │                 Custom Hooks                      │  │
│  │  useOrders  │  useOrderPolling  │  useSettlement  │  │ 
│  │             │  useLedger        │                 │  │
│  └─────────────────────┬─────────────────────────────┘  │
│                        │                                │
│  ┌─────────────────────▼──────────────────────────────┐ │
│  │                  lib/api-client.ts                 │ │
│  │         Typed fetch wrapper for all API calls      │ │
│  └─────────────────────┬──────────────────────────────┘ │
└────────────────────────┼────────────────────────────────┘
                         │ HTTP (NEXT_PUBLIC_API_URL)
                         ▼
              Entropi Backend API (Fastify)
```

---

## Project Structure

```
frontend-entropi/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (sidebar, nav, global styles)
│   ├── page.tsx                  # Root redirect → /orders
│   ├── globals.css               # Design system tokens + Tailwind base
│   ├── orders/
│   │   ├── page.tsx              # Order list with pagination + status filter
│   │   └── [id]/
│   │       └── page.tsx          # Order detail: status card, ledger audit trail
│   └── settlement/
│       └── page.tsx              # Daily settlement panel
│
├── components/                   # Reusable UI components
│   ├── orders/
│   │   ├── OrderList.tsx         # Table view for paginated order list
│   │   └── OrderStatusCard.tsx   # Order state machine card with action buttons
│   ├── ledger/
│   │   └── LedgerAuditTrail.tsx  # Double-entry ledger table with running balance
│   ├── settlement/
│   │   └── SettlementPanel.tsx   # Date picker + run/check settlement + results
│   └── ui/                       # Primitive shared components
│       ├── AmountDisplay.tsx     # Formatted currency display (decimal-safe)
│       ├── Skeleton.tsx          # Loading skeleton placeholders
│       └── StatusBadge.tsx       # Color-coded order status badge
│
├── hooks/                        # Data-fetching custom hooks
│   ├── useOrders.ts              # Paginated order list with status filter
│   ├── useOrderPolling.ts        # Auto-polling single order detail + ledger
│   ├── useLedger.ts              # Ledger audit trail for an order
│   └── useSettlement.ts          # Settlement run/check with idempotency feedback
│
├── lib/                          # Utilities and API layer
│   ├── api-client.ts             # Typed fetch wrapper (all endpoints, error handling)
│   ├── decimal.ts                # formatCurrency helper using decimal.js
│   └── formatters.ts             # Date, status, and amount formatting utilities
│
└── types/
    ├── api.types.ts              # TypeScript types for all API responses
    └── general.ts                # Shared utility types
```

---

## Key Design Decisions

### Hooks-Based Data Fetching (No Redux / React Query)

Each page delegates data fetching to a dedicated custom hook:

```
useOrders         → GET /orders (list, pagination, filter)
useOrderPolling   → GET /orders/:id (auto-poll every 3s for live status)
useLedger         → GET /orders/:id/ledger (audit trail)
useSettlement     → POST /settlement + GET /settlement/:date
```

This keeps pages thin, logic testable, and concerns separated.

### Polling vs WebSocket

Order detail uses `useOrderPolling` — a lightweight `setInterval` every 3 seconds. This is intentional:
- The backend is stateless and serverless (Vercel)
- WebSocket requires persistent connections, incompatible with serverless
- Financial state changes are infrequent enough that polling is acceptable

### Decimal-Safe Currency Display

All amounts from the API are **strings** (e.g., `"97.0000"`). The `AmountDisplay` component uses `formatCurrency` from `lib/decimal.ts` which wraps `decimal.js` for exact formatting — never using `parseFloat()` or `toFixed()` directly.

### Idempotency Feedback in Settlement

`useSettlement` tracks both `lastAction` (`'run'` | `'check'`) and `isIdempotent` (whether the result was from a pre-existing settlement). `SettlementPanel` renders distinct feedback banners so the user knows whether a settlement was newly created or previously processed.

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Set the backend API URL
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env

# 3. Start development server
npm run dev
# → http://localhost:3000
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the Entropi Backend API |

---

## Pages

| Route | Description |
|-------|-------------|
| `/orders` | Paginated order list, filterable by status |
| `/orders/:id` | Order detail with status actions and ledger audit trail |
| `/settlement` | Daily settlement — run or check by date |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + custom design tokens |
| State | React hooks (no external state library) |
| HTTP | Native `fetch` wrapped in `api-client.ts` |
| Decimal | decimal.js (consistent with backend) |
| Hosting | Vercel |
