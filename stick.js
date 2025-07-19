// Fixed collision detection methods for the Stick prototype
const STICK_ORIGIN = new Vector2(970,11);
const STICK_SHOT_ORIGIN = new Vector2(950, 11);
const MAX_POWER = 8000;

function Stick(position, onShoot){
    this.position = position;
    this.rotation = 0;
    this.origin = STICK_ORIGIN.copy();
    this.power = 0;
    this.onShoot = onShoot;
    this.shot = false;
}

Stick.prototype.update = function(){
    if(Mouse.left.down){
        this.increasePower();
    }
    else if(this.power > 0){
        this.shoot();
    }

    this.updateRotation();
}

Stick.prototype.draw = function(){
    Canvas.drawImage(sprites.stick, this.position, this.origin, this.rotation);
    this.drawLine();
}

Stick.prototype.updateRotation = function(){
    let opposite = Mouse.position.y - this.position.y;
    let adjacent = Mouse.position.x - this.position.x;

    this.rotation = Math.atan2(opposite, adjacent);
}

Stick.prototype.increasePower = function(){
    if(this.power >= MAX_POWER){
        this.power = 0;
        this.origin.x = 970;
        return;
    }
    this.power += 50;
    this.origin.x += 2.5;
}

Stick.prototype.shoot = function(){
    this.onShoot(this.power,this.rotation);
    this.power = 0;
    this.origin = STICK_SHOT_ORIGIN.copy();
    this.shot = true;
}

Stick.prototype.reposition = function(position){
    this.position = position.copy();
    this.position.y += 7;
    this.origin = STICK_ORIGIN.copy();
    this.shot = false;  
}

Stick.prototype.calculateCollisionPoint = function(startX, startY, angle) {
    const stepSize = 1; // Slightly larger step size for better performance
    const maxDistance = 1800; // Maximum line length
    
    let currentX = startX;
    let currentY = startY;
    
    const deltaX = Math.cos(angle) * stepSize;
    const deltaY = Math.sin(angle) * stepSize;
    
    // Get reference to GameWorld
    const gameWorld = (typeof GameWorld !== 'undefined') ? GameWorld : window.GameWorld;
    
    if (!gameWorld) {
        console.error("GameWorld not found!");
        return { x: startX + Math.cos(angle) * maxDistance, y: startY + Math.sin(angle) * maxDistance };
    }
    
    // Step along the line checking for collisions
    for (let distance = 0; distance < maxDistance; distance += stepSize) {
        currentX += deltaX;
        currentY += deltaY;
        
        // Debug: Log ball positions occasionally
        if (distance % 50 === 0 && gameWorld.balls) {
            console.log(`Checking collision at (${currentX.toFixed(1)}, ${currentY.toFixed(1)}), balls count: ${gameWorld.balls.length}`);
        }
        
        // Check collision with balls FIRST (excluding the white ball we're shooting from)
        if (gameWorld.balls && Array.isArray(gameWorld.balls) && gameWorld.balls.length > 0) {
            for (let i = 0; i < gameWorld.balls.length; i++) {
                const ball = gameWorld.balls[i];
                
                // Skip if it's the white ball, ball doesn't exist, or ball is not visible
                if (!ball || !ball.position || ball === gameWorld.whiteBall) {
                    continue;
                }
                
                // Additional check: make sure ball is actually on the table (not pocketed)
                if (ball.visible === false || ball.inPocket === true) {
                    continue;
                }
                
                if (this.isPointCollidingWithBall(currentX, currentY, ball)) {
                    console.log(`Ball collision detected with ball at (${ball.position.x}, ${ball.position.y})`);
                    // Return the point just before collision
                    return { 
                        x: currentX - deltaX * 2, 
                        y: currentY - deltaY * 2 
                    };
                }
            }
        }
        
        // Check collision with table boundaries/cushions
        if (this.isPointCollidingWithTable(currentX, currentY)) {
            return { x: currentX - deltaX, y: currentY - deltaY };
        }
        
        // Check collision with pockets (optional)
        if (gameWorld.pockets && Array.isArray(gameWorld.pockets)) {
            for (let pocket of gameWorld.pockets) {
                if (pocket && this.isPointCollidingWithPocket(currentX, currentY, pocket)) {
                    return { x: currentX, y: currentY };
                }
            }
        }
    }
    
    // No collision found, return max distance point
    return {
        x: startX + Math.cos(angle) * maxDistance,
        y: startY + Math.sin(angle) * maxDistance
    };
}

Stick.prototype.isPointCollidingWithBall = function(x, y, ball) {
    if (!ball || !ball.position) {
        return false;
    }
    
    const dx = x - ball.position.x;
    const dy = y - ball.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Try to get ball radius from different possible sources
    let ballRadius = 15; // Default fallback
    
    // Check various possible locations for BALL_RADIUS
    if (typeof BALL_RADIUS !== 'undefined') {
        ballRadius = BALL_RADIUS;
    } else if (typeof window !== 'undefined' && window.BALL_RADIUS) {
        ballRadius = window.BALL_RADIUS;
    } else if (ball.radius) {
        ballRadius = ball.radius;
    } else if (ball.size) {
        ballRadius = ball.size / 2;
    } else {
        // Try to estimate from the game setup
        ballRadius = 18; // Slightly larger estimate
    }
    
    // Use a collision radius that's slightly larger for reliable detection
    const collisionRadius = ballRadius + 2;
    
    // Debug logging for troubleshooting
    if (distance <= collisionRadius + 5) { // Log when we're close
        console.log(`Ball distance: ${distance.toFixed(2)}, collision radius: ${collisionRadius}, ball at (${ball.position.x}, ${ball.position.y})`);
    }
    
    return distance <= collisionRadius;
}

Stick.prototype.isPointCollidingWithPocket = function(x, y, pocket) {
    if (!pocket) return false;
    
    // Handle different pocket position formats
    let pocketX, pocketY;
    if (pocket.position) {
        pocketX = pocket.position.x;
        pocketY = pocket.position.y;
    } else {
        pocketX = pocket.x;
        pocketY = pocket.y;
    }
    
    const dx = x - pocketX;
    const dy = y - pocketY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Use GameWorld's pocketRadius
    const pocketRadius = (typeof GameWorld !== 'undefined' && GameWorld.pocketRadius) ? GameWorld.pocketRadius : 39;
    return distance <= pocketRadius;
}

Stick.prototype.isPointCollidingWithTable = function(x, y) {
    // Use GameWorld's table boundaries
    if (typeof GameWorld !== 'undefined' && GameWorld.table) {
        const table = GameWorld.table;
        
        // Add small buffer to account for ball radius
        const buffer = 15; // Approximate ball radius
        
        if (x <= (table.LeftX + buffer) || 
            x >= (table.RightX - buffer) ||
            y <= (table.TopY + buffer) || 
            y >= (table.BottomY - buffer)) {
            return true;
        }
    } else {
        // Fallback to basic boundary check
        const tableMargin = 50;
        if (x < tableMargin || x > (Canvas._canvas.width - tableMargin) ||
            y < tableMargin || y > (Canvas._canvas.height - tableMargin)) {
            return true;
        }
    }
    
    return false;
}

Stick.prototype.drawLine = function() {
    
    // Don't draw line if stick has been shot
    if (this.shot) {
        return;
    }
    
    // Calculate power percentage (0 to 1)
    const powerPercent = this.power / MAX_POWER;
    
    // Generate color based on power level
    let strokeColor;
    let lineWidth = 1;
    
    if (this.power === 0) {
        // Default white color when no power
        strokeColor = 'rgba(255,255,255,0.45)';
        lineWidth = 1;
    } else if (powerPercent <= 0.33) {
        // Green phase (0-33% power)
        const greenIntensity = Math.floor(255 * (powerPercent / 0.33));
        strokeColor = `rgba(${255 - greenIntensity}, 255, ${255 - greenIntensity}, 0.8)`;
        lineWidth = 2;
    } else if (powerPercent <= 0.66) {
        // Yellow phase (33-66% power)
        const yellowPhase = (powerPercent - 0.33) / 0.33;
        const red = Math.floor(255);
        const green = Math.floor(255);
        const blue = Math.floor(255 * (1 - yellowPhase));
        strokeColor = `rgba(${red}, ${green}, ${blue}, 0.9)`;
        lineWidth = 3;
    } else {
        // Red phase (66-100% power)
        const redPhase = (powerPercent - 0.66) / 0.34;
        const red = Math.floor(255);
        const green = Math.floor(255 * (1 - redPhase));
        const blue = 0;
        strokeColor = `rgba(${red}, ${green}, ${blue}, 1.0)`;
        lineWidth = 4;
    }
    
    // Starting point
    const beginX = this.position.x;
    const beginY = this.position.y;
    
    // Calculate collision point
    const collisionPoint = this.calculateCollisionPoint(beginX, beginY, this.rotation);
    
    // Draw the line
    Canvas._canvasContext.beginPath();
    Canvas._canvasContext.strokeStyle = strokeColor;
    Canvas._canvasContext.lineWidth = lineWidth;
    Canvas._canvasContext.moveTo(beginX, beginY);
    Canvas._canvasContext.lineTo(collisionPoint.x, collisionPoint.y);
    Canvas._canvasContext.stroke();
    
    // Optional: Draw a small dot at collision point for debugging
    if (this.power > 0) {
        Canvas._canvasContext.beginPath();
        Canvas._canvasContext.fillStyle = strokeColor;
        Canvas._canvasContext.arc(collisionPoint.x, collisionPoint.y, 3, 0, 2 * Math.PI);
        Canvas._canvasContext.fill();
    }
}
