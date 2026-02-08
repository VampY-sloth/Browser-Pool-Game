# Quick Start Guide

Get your Browser Pool Game up and running in 5 minutes!

## ⚡ Fastest Path to Live Demo

### Step 1: Get the Code (30 seconds)
```bash
# Download and extract the project
cd browser-pool-game
```

### Step 2: Add Sprites (2 minutes)

Create folder: `content/sprites/`

Add these images (you'll need to create or find them):
- `spr_background4.png` - Pool table (1200x700px recommended)
- `spr_stick.png` - Cue stick
- `spr_ball2.png` - White cue ball (38x38px)
- `spr_redBall2.png` - Red balls (38x38px)
- `spr_yellowBall2.png` - Yellow balls (38x38px)
- `spr_blackBall2.png` - 8-ball (38x38px)
- `meme1.gif`, `meme2.gif` - Victory animations (optional)

**Don't have sprites?** Use placeholder colors:
- Table: Green rectangle
- Balls: Colored circles
- Stick: Brown rectangle

### Step 3: Test Locally (30 seconds)

**Option A: Just open the file**
```bash
# Simply open index.html in your browser
open index.html  # Mac
start index.html # Windows
```

**Option B: Use a local server (better)**
```bash
# Python 3
python -m http.server 8000

# Then visit: http://localhost:8000
```

### Step 4: Deploy to GitHub Pages (2 minutes)

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit: Browser Pool Game"

# Create GitHub repo (via GitHub.com)
# Then:
git remote add origin https://github.com/YOUR_USERNAME/browser-pool-game.git
git branch -M main
git push -u origin main

# Enable GitHub Pages
# Go to: Settings > Pages > Source: main branch > Save

# Your game will be live at:
# https://YOUR_USERNAME.github.io/browser-pool-game
```

---

## 🎯 What to Update for Your Portfolio

### 1. Update README.md
Replace placeholder links:
```markdown
- GitHub: [@yourusername](https://github.com/yourusername)
- Portfolio: [your-portfolio.com](https://your-portfolio.com)
- LinkedIn: [your-linkedin](https://linkedin.com/in/yourname)
```

### 2. Update project.mcp.json
```json
"contact": {
  "github": "https://github.com/YOUR_USERNAME/browser-pool-game",
  "live_demo": "https://YOUR_USERNAME.github.io/browser-pool-game",
  "portfolio": "https://your-portfolio.com"
}
```

### 3. Update LICENSE
```
Copyright (c) 2024-2026 [YOUR NAME]
```

### 4. Add Screenshots
Create `screenshots/` folder with:
- gameplay.png
- start-screen.png
- win-screen.png

---

## 📋 Pre-Resume Checklist

Before adding to resume:
- [ ] Game is live and accessible
- [ ] No console errors (press F12 to check)
- [ ] Works in Chrome, Firefox, Safari
- [ ] GitHub repo is public
- [ ] README has clear description
- [ ] Code is commented
- [ ] Author info is updated
- [ ] Screenshots are added

---

## 🎨 Quick Sprite Creation

**Don't have design skills?** Try these:

### Option 1: Use Emoji/Unicode
```javascript
// In Ball.js, replace sprite drawing with canvas text
Canvas._canvasContext.fillText('🔴', x, y);  // Red ball
Canvas._canvasContext.fillText('🟡', x, y);  // Yellow ball
Canvas._canvasContext.fillText('⚫', x, y);  // Black ball
Canvas._canvasContext.fillText('⚪', x, y);  // White ball
```

### Option 2: Draw Simple Shapes
```javascript
// Draw colored circles instead of images
Canvas._canvasContext.beginPath();
Canvas._canvasContext.arc(x, y, radius, 0, 2*Math.PI);
Canvas._canvasContext.fillStyle = color;
Canvas._canvasContext.fill();
```

### Option 3: AI Image Generation
Use DALL-E, Midjourney, or free alternatives:
- "Pool table felt texture green"
- "Pool cue stick wooden brown"
- "Billiard ball 8 ball black"

### Option 4: Free Resources
- OpenGameArt.org
- Kenney.nl (free game assets)
- Itch.io (free sprites)

---

## 🚨 Common Issues & Fixes

### Issue: "Images not loading"
```javascript
// Check console for 404 errors
// Fix: Verify file paths match exactly (case-sensitive!)
```

### Issue: "Mouse not working"
```javascript
// Check if canvas has id="screen"
// Verify Mouse.js is loaded (check <script> tag)
```

### Issue: "Balls going through walls"
```javascript
// Check BALL_RADIUS matches your sprite size
// In Ball.js, adjust BALL_DIAMETER if needed
```

### Issue: "Game too slow/fast"
```javascript
// In GameWorld.js, adjust:
const DELTA = 1/177;  // Lower = slower game
```

---

## 📝 Resume One-Liner

**Copy-paste ready:**
```
Browser Pool Game: Full-featured 8-ball pool game with realistic physics 
(elastic collisions, momentum conservation) built in vanilla JavaScript 
and HTML5 Canvas. Features turn-based gameplay, foul detection, and modern 
responsive UI. 1,800+ lines of custom code. [Live Demo] [GitHub]
```

---

## 🎬 Demo Video Script (30 seconds)

"Hi, I'm [Name]. I built a browser-based 8-ball pool game from scratch.

[Show gameplay]

It features realistic physics with elastic collisions, turn-based multiplayer, 
and complete 8-ball rules.

[Show aiming line]

The aiming system uses ray-casting to predict shot trajectories.

[Show scoreboard]

Built with vanilla JavaScript - no frameworks. 1,800 lines of custom code.

[Show win screen]

Check it out at [your-url.com]. Thanks!"

---

## ✅ You're Ready!

Your game is now:
- ✅ Running locally
- ✅ Documented professionally  
- ✅ Ready for deployment
- ✅ Portfolio-ready
- ✅ Resume-ready
- ✅ Interview-ready

**Next Steps:**
1. Read DEPLOYMENT.md for hosting options
2. Read RESUME_GUIDE.md for interview prep
3. Read TECHNICAL.md for deep dives
4. Check project.mcp.json for tracking

**Questions?** Check the other .md files or open an issue on GitHub!

🎱 Happy coding! 🎱
