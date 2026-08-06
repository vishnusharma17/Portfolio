# Vishnu Sharma - Portfolio

A modern, responsive portfolio website built with React, featuring smooth animations, project showcases, and a contact form.

## 🚀 Features

- **Modern React Architecture**: Built with React 18 and React Router
- **Smooth Animations**: Powered by Framer Motion
- **Responsive Design**: Works seamlessly on all devices
- **Project Showcase**: Filterable project gallery
- **Contact Form**: Validated contact form with error handling
- **Custom Cursor**: Interactive cursor animation
- **Performance Optimized**: Fast loading and smooth interactions

## 📦 Installation

1. Install frontend + API dependencies:
```bash
npm install
npm --prefix server install
```

2. Run frontend + backend together (local):
```bash
npm run dev
```
- Site: `http://localhost:5173/`
- API: `http://localhost:4000` (proxied via `/api`)
- Admin: `http://localhost:5173/admin`
- Default admin key: `vishnu-admin-2026`

3. Build for GitHub Pages (`docs/`, base `/Portfolio/`):
```bash
npm run build
```

4. Preview the GitHub Pages build locally:
```bash
npm run preview
```
Open `http://localhost:4173/Portfolio/`

5. Live full-stack server (API + built site):
```bash
npm start
```
Open `http://localhost:4000/Portfolio/`

Content lives in `server/data/content.json`, with fallbacks in `public/content.json` and `docs/content.json`.

## 🛠️ Tech Stack

- **React 18** - UI library
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Vite** - Build tool
- **CSS3** - Styling

## 📁 Project Structure

```
porfolio/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── ContactForm.jsx
│   │   └── Cursor.jsx
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   └── Projects.jsx
│   ├── data/           # Data files
│   │   └── projects.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/
│   └── images/         # Image assets
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Features Breakdown

### Home Page
- Hero section with introduction
- Featured projects (3 projects)
- Contact form with validation
- Smooth scroll navigation

### Projects Page
- All projects displayed
- Filter by tags
- Project cards with links
- Responsive grid layout

### Components
- **Header**: Sticky navigation with mobile menu
- **Footer**: Contact information and quick links
- **ProjectCard**: Reusable project display component
- **ContactForm**: Validated form with error handling
- **Cursor**: Custom animated cursor

## 🔧 Configuration

### Adding Projects
Edit `src/data/projects.js` to add or modify projects.

### Styling
- Global styles: `src/index.css`
- Component styles: Individual CSS files in `components/` and `pages/` folders

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

The app can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Build the project and deploy the `dist` folder.

## 📝 License

© 2025 Vishnu Sharma. All rights reserved.

