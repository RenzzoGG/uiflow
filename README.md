# UIFlow

UIFlow is a **fictional concept product**: a SaaS tool for designing admin dashboards. This repository contains its marketing landing page and a working admin dashboard demo, both built with plain HTML, CSS and JavaScript.

**Live demo:**

- Landing page: [uiflow.renzzogg.com](https://uiflow.renzzogg.com)
- Admin dashboard: [uiflow.renzzogg.com/dashboard.html](https://uiflow.renzzogg.com/dashboard.html)

## Landing page (`index.html`)

- Hero section with product preview and calls to action that open the dashboard.
- Features, showcase, "How it works", pricing plans and a FAQ with expandable answers.
- Responsive layout with in-page navigation and an accessible hamburger menu on mobile.

## Admin dashboard (`dashboard.html`)

- **Dashboard view:** KPI cards, a revenue line chart with 7D / 30D / 90D / 1Y ranges, and a users table with search, sorting by column and pagination.
- **Analytics view:** KPI cards plus revenue, users growth and device distribution charts with selectable ranges.
- **Dark mode:** toggle between light and dark themes; the choice is remembered with `localStorage` and defaults to the system preference.
- **Responsive:** on tablets and phones the sidebar becomes a top bar with Dashboard / Analytics tabs.
- Clicking the UIFlow logo in the sidebar returns to the landing page.

All data is sample data generated in the browser; there is no backend.

## Tech stack

- HTML
- CSS
- JavaScript (no frameworks, no build step)
- [Chart.js](https://www.chartjs.org/) 4.5.1 (loaded from jsDelivr)
- [Inter](https://rsms.me/inter/) variable font, self-hosted (SIL Open Font License)

## Run it locally

No installation needed. From the repository root, start any static server, for example:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> for the landing page and <http://localhost:8000/dashboard.html> for the dashboard. An internet connection is needed to load Chart.js.

## Deployment

Deployed on [Railway](https://railway.com) as a static site at [uiflow.renzzogg.com](https://uiflow.renzzogg.com). Railway's builder (Railpack) detects `index.html` in the repository root and serves the folder as static files.

## Part of my portfolio

This project is part of the portfolio of **Renzzo Gracia Gomez** — see more at [renzzogg.com](https://renzzogg.com).
