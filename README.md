# Ampflick — Operations Dashboard

A modern, responsive React + Tailwind operations dashboard for monitoring orders, deliveries, courier performance, and payments — built to replace a Google Sheets workflow.

## Tech stack

- **React 18** + **Vite** (fast dev server & build)
- **Tailwind CSS** for styling (blue / white / gray SaaS palette)
- **Recharts** for the pie, bar, and area charts
- **lucide-react** for icons

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview   # preview the production build locally
```

## Project structure

```
src/
  components/
    Sidebar.jsx              Left navigation
    Topbar.jsx                Search, notifications, profile
    KpiCards.jsx               Total/Delivered/Pending/Returned/Cancelled/Revenue/Payments KPI cards
    StatusPieChart.jsx        Order status distribution donut chart
    CourierPerformanceChart.jsx  On-time % bar chart per courier
    RevenueLineChart.jsx      Monthly revenue area/line chart
    WeeklyOrdersChart.jsx     Daily/weekly orders bar chart
    Filters.jsx                Date range, status, courier, payment, customer filters
    OrdersTable.jsx            Recent orders table with colored status badges
    PaymentOverview.jsx        Received / pending / refunded + payment method breakdown
    RecentActivity.jsx         Activity timeline
    QuickActions.jsx           Add order / update status / update payment / export / analytics
    StatusBadge.jsx             Shared colored badge helper
  data/
    mockData.js                All mock data in one place — swap with real API calls
  App.jsx                      Page layout/composition
  main.jsx                     React entry point
  index.css                    Tailwind directives + small utility classes
```

## Wiring up real data

Everything currently reads from `src/data/mockData.js`. To connect a real backend:

1. Replace the static arrays/objects in `mockData.js` with `fetch`/`axios` calls (e.g. inside `useEffect` + `useState`, or a data-fetching library like React Query).
2. Keep the shape of each object the same (see the exported constants) and the components will keep working unchanged.
3. For the KPI cards, wire `kpiCards` values to your live totals endpoint.
4. For the orders table, point `orders` to a paginated `/api/orders` endpoint and add pagination controls.

## Customizing the look

- Brand color scale lives in `tailwind.config.js` under `theme.extend.colors.brand`. Change `brand.600` to re-theme the primary blue everywhere.
- Card radius/shadow tokens are also in `tailwind.config.js` (`borderRadius`, `boxShadow`).

## Responsiveness

- Sidebar collapses into a slide-over drawer below the `lg` breakpoint (hamburger menu in the top bar).
- KPI cards reflow from 4 → 2 → 1 columns.
- Charts and tables scroll horizontally on small screens where needed.
