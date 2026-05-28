# Local Setup & Project Overview

**1) How to launch this website locally**

- Prerequisites:
  - Node.js 18+ and npm installed, or Docker Desktop installed.
  - A terminal opened in the repository root (the folder that contains `package.json`).

- Environment variables:
  - Copy `.env.example` to `.env` and set real values if you want the contact form to work:

```env
EMAIL_ADDRESS=your-email@example.com
EMAIL_PASS=your-email-app-password
```

  - If you do not provide email credentials the server will still serve the site but the `/contact` endpoint returns `503`.

- Development (frontend only):

```bash
# install deps
npm install

# run React dev server (hot reload)
npm run start:client

# open http://localhost:3000
```

- Production-style local run (build + Express server):

```bash
# install deps (if not already installed)
npm install

# build the React app into `build/`
npm run build

# start the Express server which serves the `build/` folder (default port 5000)
npm run start:server

# open http://localhost:5000
```

- Using Docker (no Node/npm required locally):

```bash
# pull a Node image
docker pull node:24-slim

# build inside container (mounts repo into container and creates `build/`)
docker run --rm -v //c/Users/Vaibhav/Documents/Portfolio:/usr/src/app node:24-slim sh -c "cd /usr/src/app && npm install --no-audit --no-fund && npm run build"

# run the Express server container mapping port 5000
docker run --rm -p 5000:5000 -v //c/Users/Vaibhav/Documents/Portfolio:/usr/src/app -e EMAIL_ADDRESS=you@example.com -e EMAIL_PASS=pass node:24-slim sh -c "cd /usr/src/app && npm run start:server"

# open http://localhost:5000
```

**2) Project overview — what this repo contains and tools used**

- Summary:
  - This is a single-repository full-stack portfolio site: a React front end built with Create React App and an Express backend used to receive contact form submissions and send them via email (Nodemailer).

- Main components & files:
  - `package.json` — npm scripts and dependencies.
  - `server.js` — Express server that serves production build and provides `/contact` POST endpoint.
  - `src/` — React source code (components like `Banner.js`, `Projects.js`, `Contact.js`, etc.).
  - `public/` — static public assets and `index.html`.
  - `.env.example` — example environment variables for email credentials.
  - Hosting manifest files (if present) describe build/start commands for your hosting provider.

- Important libraries used:
  - Frontend: `react`, `react-dom`, `react-router-dom`, `react-bootstrap`, `react-multi-carousel`, `react-responsive-carousel`, `animate.css`.
  - Build/tooling: `react-scripts` (Create React App)
  - Backend: `express`, `cors`, `body-parser` (via express.json), `nodemailer`, `dotenv`.

- What it does:
  - Serves a responsive portfolio website showcasing projects and skills.
  - Provides a contact form that sends email to the configured `EMAIL_ADDRESS` using Gmail SMTP (via Nodemailer). If credentials are not set the contact endpoint returns `503` so the site remains usable.

- How the server works:
  - In production the React app is built into `build/` and `server.js` serves files from that folder and falls back to `index.html` for client-side routing.
  - `server.js` exposes `POST /contact` which accepts JSON payloads and forwards them via Nodemailer (when configured).
  - The server listens on `process.env.PORT || 5000` so hosting platforms can set the port.

 - Deployment notes:
  - Configure your host to run `npm install && npm run build` and `npm run start:server` on deploy.
  - Make sure to add `EMAIL_ADDRESS` and `EMAIL_PASS` as environment variables on your host — for Gmail you must use an app password or otherwise permit SMTP for the sending account. See: https://support.google.com/mail/?p=BadCredentials

- Troubleshooting & tips:
  - If the app crashes on startup with a nodemailer auth error, set valid `EMAIL_ADDRESS`/`EMAIL_PASS` in `.env` or remove them temporarily. The server has been updated to disable email verification when credentials are missing.
  - If port 5000 is in use, set `PORT` before running the server:

```bash
PORT=8080 npm run start:server
```

  - If the React build warns about `browserslist: caniuse-lite is outdated`, update DB locally (optional):

```bash
npx browserslist@latest --update-db
```

- Security note:
  - Do not commit real credentials. `.env` is ignored by git; keep secrets in your hosting provider's environment variables.

---

If you want, I can also:
- Commit this new document into the repository.
- Walk through deploying to Render step-by-step and configure environment variables there.

## Repository structure & role of each file

This section explains the layout of the repository and the purpose of the main files and folders.

- `package.json` — Declares project metadata, dependencies, and `scripts` (development, build and server start commands).
- `package-lock.json` — Locks installed package versions for reproducible installs. Keep it committed for stable builds.
- `server.js` — Express backend server. Serves the production `build/` folder, provides the `POST /contact` endpoint, and listens on `process.env.PORT || 5000`.
- `public/` — Static assets and `index.html` used by the React app at build time. Files here are copied into the `build/` output.
- `src/` — React source code. Main application components and pages live here.
  - `src/components/` — Reusable UI components. Example files in this project:
    - `Banner.js` — Header/banner with animated text and call-to-action.
    - `Contact.js` — Contact form UI that posts to the Express `/contact` endpoint.
    - `Footer.js` — Page footer with links and copyright.
    - `NavBar.js` — Top navigation component for hash-link scrolling.
    - `Newsletter.js` — Mailchimp subscription UI (uses `react-mailchimp-subscribe`).
    - `ProjectCard.js` — Card component for display of individual projects.
    - `Projects.js` — Projects section that arranges `ProjectCard` components.
    - `Skills.js` — Skills/technologies section.
  - `src/index.js`, `src/App.js` — React entry point and root application component.
- `README.md` — Project README. Short setup instructions; the new `LOCAL_SETUP_AND_OVERVIEW.md` contains a more detailed local-run + overview.
- `LOCAL_SETUP_AND_OVERVIEW.md` — (this file) Detailed local setup, Docker instructions, and project overview.
- `.env.example` — Example environment variables. Copy to `.env` and fill with real values for local testing.
- `.env` — Local environment file (should be in `.gitignore`). Stores `EMAIL_ADDRESS` and `EMAIL_PASS` for the contact form; do not commit secrets.
- `.gitignore` — Files and folders that Git will ignore (e.g., `node_modules`, `build`, `.env`).
- `render.yaml` — Render service manifest. Defines build and start commands and environment variable keys for Render deployments.
- `build/` — Generated production build output (created by `npm run build`). This folder should not be committed; hosting platforms typically run the build on deploy.
- `node_modules/` — Installed packages. Not committed; created by `npm install`.

Notes on component responsibilities
- Keep presentation logic (JSX/CSS) inside `src/components/` and routing or page composition in `src/App.js`.
- Server-specific logic (email sending, static-file serving) must remain in `server.js`. Avoid mixing server-only code into `src/`.

If you'd like, I can commit the new documentation file and push to your remote, then proceed to create a Render service and configure the required environment variables.
