# 🚀 Quick Start Guide

## Installation & Run (3 Steps)

```bash
# 1. Install dependencies
npm install

# 2. Move images to public folder (if not already done)
mkdir -p public && cp -r images public/ 2>/dev/null || true

# 3. Start development server
npm run dev
```

That's it! Your app will open at `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` folder.

## ⚡ Performance Optimizations Applied

✅ **Code Splitting** - Lazy loading for routes  
✅ **React.memo** - Prevents unnecessary re-renders  
✅ **useMemo/useCallback** - Optimized computations  
✅ **Image Lazy Loading** - Faster initial load  
✅ **Chunk Splitting** - Smaller bundle sizes  
✅ **Passive Event Listeners** - Smoother scrolling  
✅ **CSS Optimizations** - Hardware acceleration  

## 🎯 Key Features

- ⚡ Fast loading with code splitting
- 🎨 Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🔍 Project filtering
- ✅ Form validation
- 🎯 Custom cursor animation

## 📁 Important Files

- `src/App.jsx` - Main app component
- `src/pages/` - Page components
- `src/components/` - Reusable components
- `src/data/projects.js` - Project data
- `public/images/` - Image assets

## 🛠️ Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Module not found?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Images not loading?**
Make sure images are in `public/images/` folder and paths start with `/images/`

