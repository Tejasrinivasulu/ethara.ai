# Ethara.AI Workspace

Ethara.AI is a full-stack project and task management platform with role-based dashboards for Admin and Member users.
It includes authentication UI, team/member verification, task and project workflows, notifications, analytics, reports, and near real-time updates.

## Highlights

- Modern React UI with Admin and Member dashboards
- Role-based login/signup flow (Admin, Member)
- Member verification flow (email + code simulation with 24-hour expiry)
- Project and task management with status/progress automation
- Notification center with per-notification delete
- PDF report export for Admin and Member dashboards
- Near real-time updates via polling + cross-tab sync
- Netlify-ready deployment (frontend + serverless API functions)

## Tech Stack

- Frontend: React, TanStack Start, TanStack Router, Tailwind CSS, Radix UI
- State/Data sync: custom workspace store + polling + BroadcastChannel
- Charts/Reporting: Recharts, jsPDF
- Backend (deployment path): Netlify Functions
- Local backend option: Express + LowDB (`backend/server.js`)
- Build tool: Vite

## Project Structure

```text
.
├─ src/
│  ├─ routes/                     # Public + authenticated routes
│  ├─ components/                 # Reusable UI and dashboard shell
│  ├─ lib/
│  │  ├─ workspace-store.ts       # Shared app state, polling, API actions
│  │  └─ mock-data.ts             # Initial local fallback data
├─ netlify/
│  └─ functions/
│     ├─ api.mjs                  # Main serverless API routes
│     └─ socketio.mjs             # Socket placeholder for Netlify
├─ backend/
│  ├─ server.js                   # Local Express server (optional)
│  └─ db.json                     # JSON data source
├─ netlify.toml                   # Netlify build + routing config
├─ vite.config.ts                 # Vite + TanStack + Netlify plugin setup
└─ package.json
```

## Prerequisites

- Node.js 20+
- npm 10+ (recommended)

## Installation

```bash
npm install
```

## Run Locally

### 1) Frontend only

```bash
npm run dev
```

### 2) Local frontend + local Express backend

```bash
npm run dev:full
```

This starts:

- frontend on Vite dev server
- backend on `http://localhost:4000` (from `backend/server.js`)

## Build

```bash
npm run build
```

## Deployment (Netlify)

This project is configured for TanStack Start on Netlify using `@netlify/vite-plugin-tanstack-start`.

### Netlify settings

- Build command: `npm run build`
- Publish directory: `dist/client`

`netlify.toml` is already configured in the repository.

### Deploy steps

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Netlify, import the repo as a new site.
3. Confirm build settings above.
4. Deploy.
5. Run **Clear cache and deploy site** once after major config changes.

### Verify after deploy

- `/` loads landing page
- `/login` loads auth page
- `/admin` and `/member` load dashboard routes (after auth)
- `/api/health` returns JSON health response

## Environment Variables

The frontend uses:

- `VITE_BACKEND_URL` (optional)

If unset, frontend uses same-origin API (`/api/...`) which is recommended for Netlify deployment.

## Core Functional Flows

## 1) Authentication and role routing

- Signup/Login supports role selection (`admin` or `member`)
- After login:
  - Admin -> `/admin`
  - Member -> `/member`

## 2) Member onboarding + verification

- Admin adds member in Team Members
- Member signs in normally
- Member requests verification code and submits code
- Verification code expires in 24 hours
- Verified members then access full member sections and task/project visibility

## 3) Task + project automation

- Admin creates projects and assigns tasks to member email
- Member updates own task status (`pending`, `in-progress`, `completed`)
- Project progress/status auto recalculates from linked tasks
- Member active task count auto recalculates

## 4) Notifications and reports

- System pushes notifications for key events (project/task/verification activity)
- Notification delete supported per item
- Admin and Member report pages export PDF reports

## API Overview (Netlify Function)

Implemented in `netlify/functions/api.mjs`.

### Health + workspace

- `GET /api/health`
- `GET /api/workspace`

### Member verification

- `GET /api/member/status?email=...`
- `POST /api/member/send-verification`
- `POST /api/member/verify`

### Projects and tasks

- `POST /api/projects`
- `POST /api/tasks`
- `PATCH /api/tasks/:id/status` (admin context)
- `PATCH /api/my/tasks/:id/status` (member context)

### Team + notifications

- `POST /api/members`
- `DELETE /api/notifications/:id`

## Real-Time Behavior

For Netlify compatibility, updates are near real-time using:

- Polling (`/api/workspace`) every 5 seconds
- `localStorage` persistence for session continuity
- `BroadcastChannel` + storage events for cross-tab synchronization

## Scripts

- `npm run dev` - start Vite dev server
- `npm run backend` - start local Express backend
- `npm run dev:full` - run frontend + backend together
- `npm run build` - production build
- `npm run build:dev` - development mode build
- `npm run preview` - preview built frontend
- `npm run lint` - run ESLint
- `npm run format` - run Prettier write

## Troubleshooting

- **Netlify shows 404/page not found**
  - Confirm repo includes updated `vite.config.ts` with Netlify TanStack plugin
  - Confirm Netlify build command is `npm run build`
  - Confirm publish dir is `dist/client`
  - Trigger "Clear cache and deploy site"

- **API route fails**
  - Check `/api/health`
  - Check Netlify Functions tab for function build/runtime errors

- **Member cannot verify**
  - Ensure member was added by Admin first
  - Verify email entered exactly matches member email
  - Request new code if previous code expired

## Notes

- Socket.IO is intentionally not used in Netlify Functions runtime.
- The `netlify/functions/socketio.mjs` file is a placeholder and returns not implemented.
- Local Express backend remains available for local development/testing.

