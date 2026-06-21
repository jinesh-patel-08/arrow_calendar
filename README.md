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

## Firebase Setup (required)

Tasks and user accounts are stored in **Firebase Authentication** and **Cloud Firestore**.

### 1. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** and follow the steps

### 2. Enable Email/Password authentication

1. In your project, open **Build → Authentication**
2. Click **Get started**
3. Under **Sign-in method**, enable **Email/Password**

### 3. Create a Firestore database

1. Open **Build → Firestore Database**
2. Click **Create database**
3. Start in **production mode** (we deploy custom rules below)
4. Choose a region close to you

### 4. Add a web app and copy config

1. Project **Settings** (gear icon) → **Your apps** → **Web** (`</>`)
2. Register the app and copy the `firebaseConfig` values
3. Copy `.env.local.example` to `.env.local` and paste your keys:

```bash
cp .env.local.example .env.local
```

### 5. Deploy Firestore security rules

In Firebase Console → **Firestore → Rules**, paste the contents of `firestore.rules` from this repo, then click **Publish**.

These rules ensure each user can only read and write their own tasks under `users/{userId}/tasks/{taskId}`.

### 6. Restart the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and sign in.

---

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # then add your Firebase keys
npm run dev
```

---

## Project Structure

```
src/
├── app/                  # Next.js App Router (layout, page, styles)
├── components/
│   ├── auth/             # Login / sign-up page
│   ├── calendar/         # Linear, zoomed, and weekly views
│   ├── layout/           # Header and tab navigation
│   ├── table/            # Admin table view
│   └── ui/               # Shared UI primitives
├── context/
│   ├── AuthContext.tsx   # Firebase Authentication state
│   └── TaskContext.tsx   # Firestore task sync (real-time)
└── lib/
    ├── firebase.ts       # Firebase initialization
    ├── types.ts          # Task schema and type definitions
    ├── constants.ts      # Colors, tab config, labels
    └── date-utils.ts     # Calendar date helpers
```

## State Management

- **AuthContext** — tracks the signed-in Firebase user (email/password)
- **TaskContext** — subscribes to `users/{uid}/tasks` in Firestore with real-time sync
- All four views read from the same task state; edits in the Table view persist to Firebase and update calendars instantly

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Firebase](https://firebase.google.com/) (Auth + Firestore)
- TypeScript
