# FaceType

A mobile-first dating personality web app. Scan your face, answer green/red flag questions, and get your dating style powered by Claude.

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and set your Anthropic API key:

```
REACT_APP_ANTHROPIC_API_KEY=sk-ant-...
```

## Development

```bash
npm run dev
```

Open on your phone or use browser dev tools mobile view (max width 430px).

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add environment variable `REACT_APP_ANTHROPIC_API_KEY` in Project Settings → Environment Variables.
4. Deploy.

**Note:** Calling the Anthropic API from the browser exposes your key to users. For production, prefer a serverless API route that holds the key server-side. This project uses direct browser access per spec (`anthropic-dangerous-direct-browser-access: true`).

## Stack

- React + Vite
- Tailwind CSS v4
- Web Camera API, Web Audio API, Canvas share cards
