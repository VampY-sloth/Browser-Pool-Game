# Deployment Guide

This guide covers multiple ways to deploy your Browser Pool Game for your portfolio.

## 🚀 Quick Deploy Options

### Option 1: GitHub Pages (Recommended)

**Free, fast, and professional!**

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit: Browser Pool Game"
git branch -M main
git remote add origin https://github.com/yourusername/browser-pool-game.git
git push -u origin main
```

2. **Enable GitHub Pages:**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: Deploy from branch
   - Branch: `main` / root
   - Click Save

3. **Access your game:**
   - URL: `https://yourusername.github.io/browser-pool-game`
   - Takes 1-2 minutes to deploy

**Pro tip:** Add a custom domain in Settings > Pages > Custom domain

---

### Option 2: Netlify

**Drag-and-drop deployment with instant previews**

1. **Via Netlify Drop:**
   - Go to [netlify.com/drop](https://netlify.com/drop)
   - Drag your project folder
   - Get instant live URL

2. **Via Git (Recommended):**
   - Sign up at [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect your GitHub repository
   - Build settings: (None needed for static site)
   - Click "Deploy site"

**Features:**
- Custom domain
- HTTPS by default
- Continuous deployment
- Instant rollbacks

---

### Option 3: Vercel

**Lightning-fast deployment platform**

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
cd browser-pool-game
vercel
```

**Or via web:**
- Go to [vercel.com](https://vercel.com)
- Click "Add New Project"
- Import your GitHub repository
- Click "Deploy"

---

### Option 4: Surge

**Simple static hosting via CLI**

1. **Install:**
```bash
npm install --global surge
```

2. **Deploy:**
```bash
cd browser-pool-game
surge
```

Your site will be live at: `https://random-name.surge.sh`

---

## 📱 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All sprite files are in `content/sprites/` directory
- [ ] Paths are relative (no absolute paths like `C:/...`)
- [ ] Test in multiple browsers (Chrome, Firefox, Safari)
- [ ] Check console for errors (F12 > Console)
- [ ] Test on different screen sizes
- [ ] Update README with your live demo URL
- [ ] Add screenshots to project
- [ ] Update author information in files

---

## 🎨 Adding Screenshots

Create a `screenshots` folder and add:
- `gameplay.png` - Main game screenshot
- `start-screen.png` - Start screen
- `win-screen.png` - Victory screen
- `scoreboard.png` - Scoreboard closeup

Update README.md with actual screenshot paths:
```markdown
![Gameplay](./screenshots/gameplay.png)
```

---

## 🔧 Custom Domain Setup

### For GitHub Pages:
1. Buy domain (Namecheap, Google Domains, etc.)
2. Add CNAME record pointing to `yourusername.github.io`
3. In repo Settings > Pages, add custom domain
4. Wait for DNS propagation (5-30 minutes)

### For Netlify/Vercel:
1. Go to domain settings in dashboard
2. Follow their custom domain wizard
3. Update DNS records as instructed

---

## 🌐 SEO Optimization

Add to `<head>` in index.html:

```html
<!-- SEO Meta Tags -->
<meta name="description" content="Play 8-ball pool in your browser! Realistic physics, smooth gameplay, and polished UI.">
<meta name="keywords" content="pool game, 8-ball, browser game, JavaScript game, HTML5 Canvas">
<meta name="author" content="Your Name">

<!-- Open Graph (for social sharing) -->
<meta property="og:title" content="Browser Pool Game">
<meta property="og:description" content="Realistic 8-ball pool game built with JavaScript">
<meta property="og:image" content="https://your-url.com/screenshots/gameplay.png">
<meta property="og:url" content="https://your-url.com">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Browser Pool Game">
<meta name="twitter:description" content="Play 8-ball pool in your browser">
<meta name="twitter:image" content="https://your-url.com/screenshots/gameplay.png">

<!-- Favicon -->
<link rel="icon" type="image/png" href="./content/sprites/spr_ball2.png">
```

---

## 📊 Analytics Setup (Optional)

### Google Analytics

Add before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🐛 Common Deployment Issues

### Issue: Game doesn't load
**Solution:** Check browser console (F12) for errors. Usually missing sprite files.

### Issue: Images not showing
**Solution:** Verify `content/sprites/` folder exists and paths are correct.

### Issue: Mouse not working
**Solution:** Check if canvas element has correct ID (`#screen`).

### Issue: Blank page on mobile
**Solution:** Test viewport meta tag: `<meta name="viewport" content="width=device-width,initial-scale=1.0">`

---

## 📝 Post-Deployment Tasks

1. **Test the live site thoroughly**
2. **Update your resume with live URL**
3. **Add to LinkedIn projects section**
4. **Share on social media**
5. **Add to portfolio website**
6. **Consider writing a blog post about development**

---

## 🎯 Portfolio Integration

### Link Format for Resume:
```
Browser Pool Game | Live Demo: https://your-url.com | Code: https://github.com/yourusername/browser-pool-game
```

### Project Description for Portfolio:
```
Full-featured 8-ball pool game built with vanilla JavaScript and HTML5 Canvas. 
Features realistic physics engine, turn-based gameplay, and modern UI. 
Demonstrates expertise in 2D game development, collision detection algorithms, 
and object-oriented programming.
```

---

## 🚀 Continuous Deployment

With GitHub + (Netlify or Vercel):
- Every push to `main` branch auto-deploys
- Preview deployments for pull requests
- Instant rollback if issues occur

**Workflow:**
1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Automatic deployment in 30-60 seconds
5. Check live site

---

## 📞 Support

If deployment issues persist:
1. Check platform status pages
2. Review platform documentation
3. Check community forums
4. Contact platform support

---

**Ready to deploy? Pick your preferred option above and go live in minutes!** 🎱
