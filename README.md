# Personal Portfolio Website in React

This project is a React front end with an Express backend for sending contact form emails.

Built using:

- Front-end library: React
- CSS framework: React-bootstrap
- CSS animations library: Animate.css
- Backend: Express + Nodemailer

## Local setup

1. Install dependencies:

```bash
npm install
```

2. For front-end development only:

```bash
npm run start:client
```

Open http://localhost:3000 to view the client app.

3. For production-style serving with the Express backend:

```bash
npm run build
npm run start:server
```

Open http://localhost:5000.

## Environment variables

Copy `.env.example` to `.env` and set your credentials before using the contact form:

```bash
cp .env.example .env
```

The `.env` file is ignored by Git.

## Available scripts

- `npm run start:client` — run the React development server
- `npm run build` — build the React app into `build/`
- `npm run start:server` — serve the production build with Express
- `npm start` — same as `npm run start:server`
- `npm test` — run the test suite

## Deployment

This repository can be deployed to any Node.js hosting platform. Typical deploy steps:

1. Push your repo to a Git provider (GitHub/GitLab/Bitbucket).
2. Configure your host to run:
   - Build command: `npm install && npm run build`
   - Start command: `npm run start:server`
3. Add environment variables on the host:
   - `EMAIL_ADDRESS`
   - `EMAIL_PASS`

The Express server reads `process.env.PORT` (falls back to `5000` locally). Do not commit secrets; set them in the host's dashboard.
