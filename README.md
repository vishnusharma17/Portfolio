# Vishnu Sharma — Portfolio

Personal portfolio site (React + Vite), with an optional Express API for editing content.

**Live:** https://vishnusharma17.github.io/Portfolio/

## Run locally

```bash
npm install
npm --prefix server install
npm run dev
```

| | URL |
|---|---|
| Site | http://localhost:5173/ |
| API | http://localhost:4000 |
| Admin | http://localhost:5173/admin |

Admin opens only after OTP verification on the registered phone (`ADMIN_PHONE` in `server/.env`).

## Build (GitHub Pages)

```bash
npm run build
```

Output goes to `docs/` (base path `/Portfolio/`). Push `docs/` to `main` for Pages.

## Content

Site copy, projects, images paths, and contact info live in:

- `server/data/content.json` (source of truth when API is running)
- `public/content.json` / `docs/content.json` (static fallback)

Edit via Admin after OTP login, or edit the JSON directly.

## Stack

React 18 · React Router · Framer Motion · Vite · Express (optional API)

## License

© Vishnu Sharma. All rights reserved.
