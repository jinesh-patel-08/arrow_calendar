# Arrow Calendar

A personal scheduling web application built with Next.js, React, and Tailwind CSS.

## Features

- **Linear Calendar (Full Year)** — Birdseye horizontal grid for High-complexity tasks
- **Zoomed Calendar (4 Months)** — Expanded view for Medium-complexity tasks
- **Weekly Calendar** — One-week grid showing all task complexities
- **Table View (Admin)** — Notion-style inline-editable task database

## Task Schema

Every task contains:

| Field | Type | Options |
|-------|------|---------|
| Name | string | — |
| Start / End Date | ISO date strings | — |
| Status | enum | Planned, In-Progress, Complete |
| Complexity | enum | High, Medium, Low |
| Tags | string[] | free text labels |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                  # Next.js App Router (layout, page, styles)
├── components/
│   ├── calendar/         # Linear, zoomed, and weekly views
│   ├── layout/           # Header and tab navigation
│   ├── table/            # Admin table view
│   └── ui/               # Shared UI primitives (Badge)
├── context/
│   └── TaskContext.tsx   # Global task state (React Context + useReducer)
└── lib/
    ├── types.ts          # Task schema and type definitions
    ├── constants.ts      # Colors, tab config, labels
    ├── date-utils.ts     # Calendar date helpers
    └── sample-data.ts    # Seed tasks for development
```

## State Management

Tasks live in a single `TaskProvider` context. All four views read from and write to the same state, so edits in the Table view sync instantly across calendar tabs.

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- TypeScript
