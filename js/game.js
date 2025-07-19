function Game() {
    this.playerScores = {
        yellow: 0,
        red: 0
    };
}

Game.prototype.init = function() {
    this.gameWorld = new GameWorld();
};

Game.prototype.start = function() {
    this.mainLoop = this.mainLoop.bind(this); 
    this.mainLoop();
};

Game.prototype.mainLoop = function() {
    Canvas.clear();
    PoolGame.gameWorld.update();
    PoolGame.gameWorld.draw();
    Mouse.reset();
    
    requestAnimationFrame(this.mainLoop);

};

Game.prototype.showWinScreen = function(winner) {
    const winMessage = `Player ${winner} wins!`;
    document.getElementById("win-message").textContent = winMessage;
    document.getElementById("win-screen").style.display = "flex";

    document.getElementById("left-meme").style.display = "block";
    document.getElementById("right-meme").style.display = "block";
};


let PoolGame = new Game();
