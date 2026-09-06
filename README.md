# Headroom GrowthOS — Victaulic Growth Workspace

Headroom GrowthOS is an independently owned, sector-neutral market-expansion platform. This repository contains its Victaulic Growth Workspace: a customer-specific implementation for developing mechanical piping and fire-protection opportunities. It turns early project signals into qualified opportunities, value cases and coordinated specification-to-channel plans.

## Core capabilities

- Expansion command dashboard
- Opportunity capture, scoring, filtering and CSV export
- Territory and market-entry modelling
- Project value and schedule-impact calculator
- Specifier, contractor and distributor decision mapping
- Partner-readiness and capability-gap tracking
- Printable opportunity briefs
- Responsive desktop, tablet and mobile interface

## Platform structure

- **Master platform:** Headroom GrowthOS
- **Customer implementation:** Victaulic Growth Workspace
- **Purpose:** Identify, qualify and convert new sources of profitable growth

Headroom GrowthOS is designed as an upstream market-development layer. It can complement a company's existing CRM, product-selection, BIM/VDC, technical-support and distribution systems while remaining a separately owned platform.

Headroom GrowthOS and this workspace are not affiliated with or endorsed by Victaulic Company. The opportunity, partner and project data included in this repository is illustrative. Product selection and project assumptions must be checked against current manufacturer literature and engineering requirements.

## Run locally

Requirements:

- Node.js 22.13 or newer
- npm

Install and start the development environment:

~~~bash
npm ci
npm run dev
~~~

Create a production build:

~~~bash
npm run build
~~~

## Technology

- React 19
- TypeScript
- Next.js-compatible Vinext runtime
- Tailwind CSS
- Radix UI primitives
- Cloudflare Worker-compatible output

## Ownership and licence

Copyright © 2026 Kevin Doyle. All rights reserved. See [LICENSE](LICENSE). Third-party packages and vendored components remain subject to their respective licences.
