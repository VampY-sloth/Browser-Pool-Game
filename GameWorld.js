const DELTA = 1/177;

function GameWorld() {    
    this.balls = [
        [new Vector2(860 - 57, 348), COLOR.YELLOW],        
        [new Vector2(860 - 36, 348 - 19), COLOR.YELLOW],   
        [new Vector2(860 - 36, 348 + 19), COLOR.RED],      
        [new Vector2(860, 348 - 38), COLOR.RED],      
        [new Vector2(860, 348), COLOR.BLACK],       
        [new Vector2(860, 348 + 38), COLOR.YELLOW],   
        [new Vector2(860 + 36, 348 - 57), COLOR.RED],
        [new Vector2(860 + 36, 348 - 19), COLOR.YELLOW],
        [new Vector2(860 + 36, 348 + 19), COLOR.RED],
        [new Vector2(860 + 36, 348 + 57), COLOR.YELLOW],
        [new Vector2(860 + 57, 348 - 74), COLOR.RED],     
        [new Vector2(860 + 57, 348 - 38), COLOR.RED],
        [new Vector2(860 + 57, 348), COLOR.YELLOW],
        [new Vector2(860 + 57, 348 + 38), COLOR.RED],
        [new Vector2(860 + 57, 348 + 74), COLOR.YELLOW],
        [new Vector2(300, 348), COLOR.WHITE]   
    ].map(params => new Ball(params[0], params[1], this));

    this.whiteBall = this.balls[this.balls.length - 1];

    this.stick = new Stick(
        new Vector2(300,352), 
        this.whiteBall.shoot.bind(this.whiteBall)
    );

    const EDGE = BALL_RADIUS * 2.0; 
    this.table = {
        TopY: EDGE,
        RightX: 1200 - EDGE,
        BottomY: 700 - EDGE,
        LeftX: EDGE
    }

    this.pockets = [
        { x: this.table.LeftX, y: this.table.TopY },      
        { x: this.table.RightX, y: this.table.TopY },     
        { x: this.table.LeftX, y: this.table.BottomY },   
        { x: this.table.RightX, y: this.table.BottomY },  
        { x: (this.table.LeftX + this.table.RightX) / 2, y: this.table.TopY },
        { x: (this.table.LeftX + this.table.RightX) / 2, y: this.table.BottomY } 
    ];
    this.pocketRadius = 39;
    this.currentPlayer = 1; // 1 or 2
    this.player1Balls = [];
    this.player2Balls = [];
    this.gamePhase = "open"; 
    this.foulOccurred = false;
    this.pottedBallThisTurn = false;

    this.firstBallHit = null;
    this.ballsHitThisTurn = [];

    this.playerScores = {
        player1: 0,   // Player 1 score (yellow balls)
        player2: 0    // Player 2 score (red balls)
    };
    
    // Player 1 gets yellow balls, Player 2 gets red balls
    this.playerBallTypes = {
        1: COLOR.YELLOW,
        2: COLOR.RED
    };          
}


GameWorld.prototype.handleCollisions = function(){
    for(let i=0; i<this.balls.length; i++){
        this.balls[i].collideWith(this.table);
        for(let j= i+1; j<this.balls.length; j++){
            const firstBall = this.balls[i];
            const secondBall = this.balls[j];
            firstBall.collideWith(secondBall);
        }
    }
}

GameWorld.prototype.update = function() {
    this.handleCollisions();
    this.handlePocketCollisions();
    this.stick.update();

    for(let i=0; i<this.balls.length; i++){
        this.balls[i].update(DELTA);
    }
    
    if(!this.ballsMoving() && this.stick.shot){
        if (this.foulOccurred) {
            this.foulOccurred = false; 
            this.stick.reposition(this.whiteBall.position);
            this.resetTurnTracking();
            this.pottedBallThisTurn = false;
            return; 
        }

        if (!this.checkValidFirstHit()) {
            this.handleFoul('NO BALL HIT');
        } else {
            if (!this.pottedBallThisTurn) {
                this.switchTurn();
            }
        } 
        this.stick.reposition(this.whiteBall.position);
        this.resetTurnTracking();
        this.pottedBallThisTurn = false;
    }
}

GameWorld.prototype.draw = function() {
    Canvas.clear();
    
    if (sprites.background && sprites.background.complete) {
        Canvas._canvasContext.drawImage(
            sprites.background,
            0, 0, Canvas._canvas.width, Canvas._canvas.height
        );
    }
    
    for(let i = 0; i < this.balls.length; i++){
        this.balls[i].draw();
    }
    this.stick.draw();
};

GameWorld.prototype.ballsMoving = function(){
    let ballsMoving = false;

    for(let i=0; i<this.balls.length; i++){
        if(this.balls[i].moving){
            ballsMoving = true;
            break;
        }
    }

    return ballsMoving;
}

GameWorld.prototype.handlePocketCollisions = function() {
    for (let i = 0; i < this.balls.length; i++) {
        const ball = this.balls[i];
        for (const pocket of this.pockets) {
            if (ball.position.distanceTo(new Vector2(pocket.x, pocket.y)) < this.pocketRadius) {
                if (ball !== this.whiteBall) {
                    this.pottedBallThisTurn = true;
                    
                    // console.log("Potted ball object:", ball);
                    // console.log("Ball properties:", Object.keys(ball));
                    // console.log("Ball color property:", ball.color);
                    // console.log("Ball color type:", typeof ball.color);
                    
                    const currentPlayerBallColor = this.playerBallTypes[this.currentPlayer];
                    let foul = false;
                    let containerId, ballSprite;

                    if (ball.color === currentPlayerBallColor) {
                        if (this.currentPlayer === 1) {
                            this.playerScores.player1++;
                            containerId = 'player1-balls';
                            // console.log("Player 1 scored! Yellow balls:", this.playerScores.player1);
                        } else {
                            this.playerScores.player2++;
                            containerId = 'player2-balls';
                            // console.log("Player 2 scored! Red balls:", this.playerScores.player2);
                        }
                    }
                    else if(ball.color === COLOR.BLACK) {
                        const currentPlayerScore = (this.currentPlayer === 1) ? this.playerScores.player1 : this.playerScores.player2;
                        if (currentPlayerScore >= 7) {
                            containerId = (this.currentPlayer === 1) ? 'player1-balls' : 'player2-balls';
                            console.log("Legal 8-ball pot by Player", this.currentPlayer);
                            PoolGame.showWinScreen(this.currentPlayer);
                            this.balls.splice(i, 1);
                            return;
                        } else {
                            foul = true;
                            console.log("8-ball potted too early by Player", this.currentPlayer);
                            PoolGame.showWinScreen(this.currentPlayer === 1 ? 2 : 1);
                            this.balls.splice(i, 1);
                            return;
                        }


                    }
                     else {
                        foul = true;
                        if (this.currentPlayer === 1) {
                            this.playerScores.player2++;
                            containerId = 'player2-balls';
                            // console.log("Foul: Player 1 potted red ball. Player 2 score:", this.playerScores.player2);
                        } else {
                            this.playerScores.player1++;
                            containerId = 'player1-balls';
                            // console.log("Foul: Player 2 potted yellow ball. Player 1 score:", this.playerScores.player1);
                        }
                    }

                    document.getElementById('player1-score').textContent = this.playerScores.player1;
                    document.getElementById('player2-score').textContent = this.playerScores.player2;

                    ballSprite = getBallSpriteByColor(ball.color);
                    
                    // console.log("Trying to add ball to:", containerId);
                    // console.log("Ball color:", ball.color);
                    // console.log("Ball sprite:", ballSprite);
                    
                    if (containerId && ballSprite) {
                        const container = document.getElementById(containerId);
                        // console.log("Container found:", container);
                        
                        if (container) {
                            const img = document.createElement('img');
                            img.className = 'potted-ball';
                            img.src = ballSprite.src;
                            img.alt = ball.color === COLOR.YELLOW ? "Yellow Ball" : 
                                     ball.color === COLOR.RED ? "Red Ball" : "8-Ball";
                            img.style.width = "28px";
                            img.style.height = "28px";
                            img.style.margin = "3px";
                            img.style.display = "inline-block";
                            img.style.border = "1px solid white"; 
                            
                            console.log("Created img element:", img);
                            console.log("Image src:", img.src);
                            
                            container.appendChild(img);
                            console.log("Ball image added successfully!");
                        } else {
                            // console.error("Container not found:", containerId);
                        }
                    } else {
                        // console.error("Missing containerId or ballSprite:", containerId, ballSprite);
                    }

                    this.balls.splice(i, 1); 
                    i--;

                    if (foul) {
                        this.handleFoul('You potted your opponent\'s ball!');
                        console.log("idiot")
                    }

                } else {
                    this.pottedBallThisTurn = false;
                    this.handleFoul('Cue ball potted!');
                }
                break;
            }
        }
    }

};
GameWorld.prototype.handleFoul = function(reason) {
    this.foulOccurred = true;
    
    this.showFoulBanner(reason || "Foul occurred!");
    
    this.whiteBall.position = new Vector2(300, 348);
    this.whiteBall.velocity = new Vector2(0, 0);
    this.whiteBall.moving = false;
    
    this.switchTurn();
    this.stick.reposition(this.whiteBall.position);
    this.resetTurnTracking();
};

GameWorld.prototype.showFoulBanner = function(message) {
    const existingBanner = document.querySelector('.foul-banner');
    if (existingBanner) {
        existingBanner.remove();
    }
    
    const banner = document.createElement('div');
    banner.className = 'foul-banner';
    banner.textContent = `FOUL: ${message}`;
    document.body.appendChild(banner);
    
    setTimeout(() => banner.classList.add('show'), 100);
    
    setTimeout(() => {
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 300);
    }, 2500);
};

GameWorld.prototype.checkValidFirstHit = function() {
    const isValid = this.firstBallHit !== null;
    return isValid;
};

GameWorld.prototype.resetTurnTracking = function() {
    this.firstBallHit = null;
    this.ballsHitThisTurn = [];
    this.foulOccurred = false;
    
    this.stick.reposition(this.whiteBall.position);
    
    this.stick.shot = false;
    
    // console.log("Turn reset - Stick position:", this.stick.position.x, this.stick.position.y);
};

GameWorld.prototype.check8BallWin = function() {
    const playerBalls = this.currentPlayer === 1 ? this.player1Balls : this.player2Balls;
    return playerBalls.every(color => 
        !this.balls.some(ball => ball.color === color)
    );
};

GameWorld.prototype.updateTurnIndicator = function() {
    const player1Section = document.getElementById('player1-section');
    const player2Section = document.getElementById('player2-section');
    const player1Indicator = document.getElementById('player1-indicator');
    const player2Indicator = document.getElementById('player2-indicator');
    
    if (this.currentPlayer === 1) {
        // Player 1's turn
        player1Section.classList.add('active');
        player1Indicator.classList.add('active');
        player2Section.classList.remove('active');
        player2Indicator.classList.remove('active');
    } else {
        // Player 2's turn
        player1Section.classList.remove('active');
        player1Indicator.classList.remove('active');
        player2Section.classList.add('active');
        player2Indicator.classList.add('active');
    }
};

GameWorld.prototype.switchTurn = function() {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    this.updateTurnIndicator();
    console.log("Turn switched to Player", this.currentPlayer);
};
