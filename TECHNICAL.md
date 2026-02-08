# Technical Documentation

Deep dive into the implementation details of Browser Pool Game.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   index.html                     │
│  (Entry Point, UI Structure, Event Listeners)   │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│                  game.js                         │
│        (Main Game Loop, Initialization)          │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│               GameWorld.js                       │
│  (Game State, Rules, Collision Handling)         │
└──┬─────┬─────┬─────┬─────┬─────┬──────────────┘
   │     │     │     │     │     │
   ▼     ▼     ▼     ▼     ▼     ▼
Ball.js stick.js canvas.js Vector2.js Color.js content.js
(Physics) (Input) (Render) (Math) (Constants) (Assets)
```

---

## 🧮 Physics Engine

### Elastic Collision Formula

When two balls collide:

```
Given:
- Ball A at position Pa with velocity Va
- Ball B at position Pb with velocity Vb

Step 1: Normal Vector
n = Pa - Pb
d = |n|  (distance between centers)

Step 2: Check Overlap
if d > 2*radius: no collision

Step 3: Minimum Translation Distance (MTD)
mtd = n * ((2*radius - d) / d)

Step 4: Separate Balls
Pa' = Pa + mtd/2
Pb' = Pb - mtd/2

Step 5: Unit Normal & Tangent
un = n / |n|
ut = (-un.y, un.x)

Step 6: Project Velocities
v1n = un · Va  (dot product)
v1t = ut · Va
v2n = un · Vb
v2t = ut · Vb

Step 7: Exchange Normal Components (elastic collision)
v1n' = v2n
v2n' = v1n

Step 8: Reconstruct Velocities
Va' = v1n' * un + v1t * ut
Vb' = v2n' * un + v2t * ut
```

**Why this works:**
- Normal component: Transfers momentum (elastic collision)
- Tangent component: Preserved (no tangential force)
- Result: Realistic bounce with momentum conservation

### Code Implementation

```javascript
Ball.prototype.collideWithBall = function(ball) {
    // Normal vector
    const n = this.position.subtract(ball.position);
    const dist = n.length();
    
    if (dist > BALL_DIAMETER) return; // No collision
    
    // MTD calculation
    const mtd = n.mult((BALL_DIAMETER - dist) / dist);
    
    // Separate balls
    this.position = this.position.add(mtd.mult(0.5));
    ball.position = ball.position.subtract(mtd.mult(0.5));
    
    // Unit vectors
    const un = n.mult(1 / n.length());
    const ut = new Vector2(-un.y, un.x);
    
    // Project velocities
    const v1n = un.dot(this.velocity);
    const v1t = ut.dot(this.velocity);
    const v2n = un.dot(ball.velocity);
    const v2t = ut.dot(ball.velocity);
    
    // Exchange normal components
    let v1nDash = v2n;
    let v2nDash = v1n;
    
    // Reconstruct
    this.velocity = un.mult(v1nDash).add(ut.mult(v1t));
    ball.velocity = un.mult(v2nDash).add(ut.mult(v2t));
    
    this.moving = true;
    ball.moving = true;
};
```

---

## 🎯 Ray Casting Algorithm

Used for predictive aiming line.

### Algorithm

```
function calculateCollisionPoint(start, angle):
    currentPoint = start
    stepSize = 1 pixel
    maxDistance = 1800 pixels
    
    for distance = 0 to maxDistance step stepSize:
        currentPoint += (cos(angle), sin(angle)) * stepSize
        
        // Check ball collisions
        for each ball:
            if distance(currentPoint, ball.position) < ballRadius:
                return currentPoint - stepSize  // Back up one step
        
        // Check table boundaries
        if currentPoint hits cushion:
            return currentPoint
        
        // Check pockets
        for each pocket:
            if distance(currentPoint, pocket) < pocketRadius:
                return currentPoint
    
    return maxDistance point
```

### Optimization Strategies

1. **Early Exit:** Stop at first collision
2. **Step Size Trade-off:** 
   - Smaller = More accurate, slower
   - Larger = Faster, less accurate
   - Sweet spot: 1 pixel
3. **Limit Distance:** Cap at 1800px (table diagonal)

### Collision Detection Helpers

```javascript
// Circle-Circle Collision
function isPointCollidingWithBall(x, y, ball) {
    const dx = x - ball.position.x;
    const dy = y - ball.position.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    return distance <= BALL_RADIUS;
}

// Point-Rectangle Collision (Cushions)
function isPointCollidingWithTable(x, y) {
    return x <= table.LeftX || 
           x >= table.RightX || 
           y <= table.TopY || 
           y >= table.BottomY;
}
```

---

## 🔄 Game Loop Architecture

### Main Loop Structure

```
┌─────────────────────┐
│   requestAnimFrame  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Canvas.clear()    │  Clear previous frame
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ GameWorld.update()  │  Physics & Logic
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  GameWorld.draw()   │  Render frame
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Mouse.reset()     │  Clear input states
└──────────┬──────────┘
           │
           └───────> Loop back to requestAnimFrame
```

### Frame-Independent Physics

```javascript
const DELTA = 1/177;  // Target 177 FPS physics updates

Ball.prototype.update = function(delta) {
    // Move ball: position += velocity * time
    this.position.addTo(this.velocity.mult(delta));
    
    // Apply friction: velocity *= coefficient
    this.velocity = this.velocity.mult(0.98);
    
    // Stop if below threshold
    if (this.velocity.length() < 5) {
        this.velocity = new Vector2();
        this.moving = false;
    }
}
```

**Why fixed delta?**
- Consistent physics regardless of frame rate
- Prevents slow-motion on low-end devices
- Ensures reproducible gameplay

---

## 🎮 Input System

### Mouse Handler Architecture

```
Mouse Events → MouseHandler → Game Actions
   ↓              ↓               ↓
mousemove    updatePosition   aimStick
mousedown    setButtonDown    chargePower
mouseup      setButtonUp      shootBall
```

### Button State Machine

```
ButtonState:
  down: false      → Mouse button currently pressed
  pressed: false   → Just pressed this frame
  released: false  → Just released this frame

Transitions:
  Initial: all false
  Press: down=true, pressed=true
  Hold: down=true, pressed=false
  Release: down=false, released=true
  Next frame: released=false (via reset())
```

### Canvas Coordinate Transformation

Challenge: Canvas may be scaled in CSS

```javascript
handleMouseMove(event) {
    const canvas = Canvas._canvas;
    const rect = canvas.getBoundingClientRect();
    
    // Scale factors
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Transform to canvas coordinates
    this.position.x = (event.clientX - rect.left) * scaleX;
    this.position.y = (event.clientY - rect.top) * scaleY;
}
```

---

## 📊 State Management

### Game States

```
┌──────────────┐
│  START       │ → User clicks "Start Game"
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  PLAYING     │ ← Main game loop
└──────┬───────┘   ↕ (turn switching)
       │
       ├──────────→ FOUL → Reset cue ball → PLAYING
       │
       └──────────→ WIN → Show victory screen
                           ↓
                    ┌──────────────┐
                    │  Play Again  │ → PLAYING
                    │  Main Menu   │ → START
                    └──────────────┘
```

### Turn Management

```javascript
currentPlayer: 1 or 2
playerBallTypes: {1: YELLOW, 2: RED}
playerScores: {player1: 0, player2: 0}

Turn Sequence:
1. Player shoots
2. Balls move (wait for all balls to stop)
3. Check fouls:
   - Cue ball potted?
   - No ball hit?
   - Wrong ball potted?
4. If foul: Switch turn
   Else if scored: Keep turn
   Else: Switch turn
5. Update UI
6. Repeat
```

---

## 🎨 Rendering System

### Canvas Rendering Pipeline

```
draw() sequence:
  1. Clear canvas
  2. Draw background image (table)
  3. Draw all balls (loop through balls array)
  4. Draw cue stick (if not shot)
  5. Draw aiming line (if not shot)
```

### Image Rendering with Transform

```javascript
Canvas.drawImage = function(image, position, origin, rotation) {
    context.save();                        // Save state
    context.translate(position.x, position.y);  // Move to position
    context.rotate(rotation);              // Rotate
    context.drawImage(image, -origin.x, -origin.y);  // Draw centered
    context.restore();                     // Restore state
}
```

**Why this pattern?**
- Origin point defines rotation center
- Translation + rotation = positioned, angled sprite
- Save/restore prevents state leak

---

## 💾 Asset Loading

### Loading State Machine

```
contentStillLoading = 0

For each sprite:
  contentStillLoading++
  image = new Image()
  image.src = path
  image.onload = () => contentStillLoading--

While contentStillLoading > 0:
  requestAnimationFrame(checkAgain)

When contentStillLoading == 0:
  startGame()
```

**Benefits:**
- All assets loaded before game starts
- No missing sprites during gameplay
- Simple counter-based tracking

---

## 🔍 Collision Detection Optimization

### Current: O(n²) Brute Force

```javascript
for (let i = 0; i < balls.length; i++) {
    for (let j = i+1; j < balls.length; j++) {
        checkCollision(balls[i], balls[j]);
    }
}
```

**Complexity:** O(n²) where n = number of balls

**Optimization opportunities:**

### 1. Spatial Partitioning (Grid)

```
Divide table into grid cells
Each ball in one cell

Check collisions only with:
- Balls in same cell
- Balls in adjacent cells

Reduces checks from O(n²) to O(n)
```

### 2. Sweep and Prune

```
Sort balls by x-coordinate
For each ball:
  Check only balls with x within collision distance
  (Exploit sorted order for early exit)
```

### 3. AABB Culling

```
if |ball1.x - ball2.x| > diameter: skip
if |ball1.y - ball2.y| > diameter: skip
else: checkCircleCollision()
```

**Trade-off:** Current O(n²) is fine for 16 balls. Optimization needed if scaling to 100+ objects.

---

## 🧪 Testing Strategies

### Physics Tests

```javascript
// Test 1: Conservation of Momentum
ball1.velocity = (10, 0)
ball2.velocity = (0, 0)
collide(ball1, ball2)
assert(ball1.velocity.x + ball2.velocity.x ≈ 10)

// Test 2: Energy Conservation (elastic)
initialEnergy = 0.5 * m * (v1² + v2²)
collide()
finalEnergy = 0.5 * m * (v1'² + v2'²)
assert(initialEnergy ≈ finalEnergy)

// Test 3: Perpendicular Glance
// Ball hits edge of another
// Should preserve perpendicular component
```

### Gameplay Tests

```
Test Case: Foul Detection
1. Shoot cue ball
2. Hit no balls
3. Assert: Foul banner shown
4. Assert: Turn switched
5. Assert: Cue ball repositioned

Test Case: Win Condition
1. Player 1 pots all yellow balls
2. Player 1 pots 8-ball
3. Assert: Victory screen shows "Player 1 wins"
4. Assert: Memes displayed
```

---

## 📈 Performance Metrics

### Target Performance

- **Frame Rate:** 60 FPS
- **Physics Updates:** 177 Hz (DELTA = 1/177)
- **Input Latency:** < 16ms
- **Load Time:** < 2s
- **Memory:** < 50MB

### Bottlenecks

1. **Collision Detection:** O(n²) → Most expensive
2. **Ray Casting:** O(n*m) → Only when aiming
3. **Rendering:** O(n) → Minimal impact

### Profiling

```javascript
// Chrome DevTools
// 1. F12 → Performance tab
// 2. Record gameplay for 5 seconds
// 3. Check function call times
// 4. Identify slow functions

// Expected results:
// - handleCollisions: ~30% CPU
// - draw: ~20% CPU
// - update loops: ~10% CPU each
```

---

## 🛠️ Debug Tools

### Console Logging

```javascript
// Ball collision tracking
console.log("Collision:", this.color, "vs", ball.color);

// First ball hit
console.log("First ball hit:", otherBall.color);

// Physics values
console.log("Velocity:", this.velocity.length());
console.log("Position:", this.position.x, this.position.y);
```

### Visual Debugging

```javascript
// Draw collision boxes
context.strokeRect(ball.x - radius, ball.y - radius, 
                   diameter, diameter);

// Draw velocity vectors
context.beginPath();
context.moveTo(ball.x, ball.y);
context.lineTo(ball.x + ball.velocity.x * 10, 
               ball.y + ball.velocity.y * 10);
context.stroke();

// Highlight collision points
context.fillStyle = 'red';
context.fillRect(collisionX - 5, collisionY - 5, 10, 10);
```

---

## 📚 Mathematical Foundations

### Vector Operations

```javascript
// Addition
v1 + v2 = (v1.x + v2.x, v1.y + v2.y)

// Subtraction
v1 - v2 = (v1.x - v2.x, v1.y - v2.y)

// Scalar Multiplication
k * v = (k * v.x, k * v.y)

// Dot Product
v1 · v2 = v1.x * v2.x + v1.y * v2.y

// Length (Magnitude)
|v| = √(v.x² + v.y²)

// Unit Vector (Normalization)
û = v / |v|

// Distance Between Points
d = |p1 - p2|
```

### Trigonometry

```javascript
// Angle from vector
angle = atan2(v.y, v.x)

// Vector from angle and magnitude
v.x = magnitude * cos(angle)
v.y = magnitude * sin(angle)

// Rotation
x' = x * cos(θ) - y * sin(θ)
y' = x * sin(θ) + y * cos(θ)
```

---

## 🔗 Dependencies

**Zero external dependencies!**

Everything built from scratch:
- ✅ Vector mathematics
- ✅ Physics engine
- ✅ Rendering system
- ✅ Input handling
- ✅ Game logic

**Why no libraries?**
- Learning experience
- Full control
- Lightweight (~1800 lines total)
- No build tools needed
- Demonstrates fundamental skills

---

## 🚀 Future Technical Enhancements

### 1. Web Workers
```javascript
// Offload physics to worker thread
const physicsWorker = new Worker('physics-worker.js');

physicsWorker.postMessage({ balls, table, delta });
physicsWorker.onmessage = (e) => {
    balls = e.data.updatedBalls;
};
```

### 2. WebGL Rendering
```javascript
// Upgrade from Canvas 2D to WebGL
// Benefits:
// - Hardware acceleration
// - Particle effects
// - Lighting/shadows
// - 60 FPS with 100+ balls
```

### 3. Predictive Server Reconciliation
```javascript
// For online multiplayer
// 1. Client predicts physics
// 2. Server validates
// 3. Client reconciles differences
```

---

This technical documentation provides the foundation for understanding, maintaining, and extending the Browser Pool Game. For specific implementation questions, refer to inline code comments in the respective source files.
