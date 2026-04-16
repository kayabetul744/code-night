# BiletCell — Turkcell CodeNight 2026 Hackathon

## Overview

Full-stack etkinlik biletleme platformu. pnpm monorepo, TypeScript, Express + SQLite, React + Vite.

## Architecture

- **Backend**: `artifacts/api-server` — Express 5, @libsql/client SQLite, Drizzle ORM, JWT auth
- **Frontend**: `artifacts/biletcell` — React 18, Vite, Tailwind CSS, Wouter routing, React Query
- **API Proxy**: API server served at `/api` path; frontend at `/`

## Stack

- **Monorepo**: pnpm workspaces
- **API framework**: Express 5 + @libsql/client (SQLite via libsql)
- **API codegen**: Orval (OpenAPI → React Query hooks in `lib/api-client-react`)
- **Frontend**: React 18 + Vite + Tailwind (custom dark theme: #06090F bg, #FFD100 yellow, #00B4C8 teal)
- **Auth**: GSM + OTP (always "1234"), JWT access+refresh tokens
- **Payment**: Paycell simulation (4242...=success, 4000...=fail)
- **QR tickets**: `qrcode` library, generated on order confirmation

## Key Features

- GSM+OTP authentication flow (register → OTP → JWT)
- Turkcell subscriber 10% discount (auto-applied at checkout)
- Interactive SVG seat map (max 4 seats, 5-min lock TTL)
- Paycell payment simulation
- QR ticket generation + verification
- Organizer dashboard with Recharts bar chart
- 27 seed users (phone: 05301234567=admin, 05309999999=organizer, all OTP: 1234)
- All error messages in Turkish

## Routes

- `/` — Ana sayfa (hero carousel, event grid, stats)
- `/events` — Etkinlik listesi (search, category/city filter, pagination)
- `/events/:id` — Etkinlik detay + koltuk haritası
- `/login` — GSM + OTP giriş
- `/register` — Kayıt ol (+ Turkcell subscriber flag)
- `/checkout` — Paycell ödeme simülasyonu
- `/orders` — Siparişlerim + QR biletler
- `/orders/:id` — Sipariş detay
- `/organizer` — Organizatör paneli (dashboard, events, QR verify)

## Key Commands

- `pnpm --filter @workspace/api-server run dev` — API server (port 8080)
- `pnpm --filter @workspace/biletcell run dev` — Frontend (port 22820)
- `pnpm --filter @workspace/api-spec run codegen` — Regenerate API hooks from OpenAPI spec

## Important Notes

- `setAuthTokenGetter` called in App.tsx — API client auto-attaches JWT Bearer token
- API client routes already include `/api/v1/...` prefix (no setBaseUrl needed)
- Custom `apiFetch` in `lib/api.ts` uses `/api` base URL for non-generated calls
- `trust proxy = 1` set in Express for express-rate-limit
- LoginPage uses uncontrolled ref-based inputs (data-testid attrs) to avoid React controlled-input test issues
- CheckoutPage uses `useRef` for sessionStorage values to prevent re-read after payment clears storage
- Tickets are generated in `payments.ts` (success branch) using randomUUID ticketCode
- Correct API endpoints: `/v1/payments/process`, DELETE `/v1/orders/:id`, `/v1/tickets/:code/verify`
