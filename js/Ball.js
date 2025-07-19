
const BALL_DIAMETER = 38;
const BALL_RADIUS = BALL_DIAMETER/2;
const BALL_ORIGIN = new Vector2(BALL_RADIUS, BALL_RADIUS);

function Ball(position, color, gameWorld){
    this.position = position;
    this.velocity = new Vector2(0);
    this.moving = false;
    this.color = color;
    this.sprite = getBallSpriteByColor(color); 
    this.gameWorld = gameWorld;
}

Ball.prototype.update = function(delta){
    this.position.addTo(this.velocity.mult(delta));

    //friction 
    this.velocity = this.velocity.mult(0.98);

    if(this.velocity.length() < 5){
        this.velocity = new Vector2();
        this.moving = false;
    }
}

Ball.prototype.draw = function(){

    Canvas.drawImage(this.sprite, this.position, BALL_ORIGIN);
}

Ball.prototype.shoot = function(power, rotation){
    
    this.velocity = new Vector2(power * Math.cos(rotation),power * Math.sin(rotation));
    this.moving = true;
}

Ball.prototype.collideWithBall = function(ball){

    //normal vetor
    const n = this.position.subtract(ball.position);

    //find distance
    const dist = n.length();

    if(dist> BALL_DIAMETER){
        return;
    }
    // find minimum translation distance
    const mtd = n.mult((BALL_DIAMETER - dist)/dist)

    //push-pull balls apart
    this.position = this.position.add(mtd.mult(1/2));
    ball.position = ball.position.subtract(mtd.mult(1/2));

    // find unit nornal vector
    const un = n.mult(1/n.length());

    //find unit tangent vector
    const ut = new Vector2(-un.y, un.x);

    //project velocities onto the unit normal and unit tangent vectors
    const v1n = un.dot(this.velocity);
    const v1t = ut.dot(this.velocity);
    const v2n = un.dot(ball.velocity);
    const v2t = ut.dot(ball.velocity);
    
    //find new normal veclotites
    let v1nDash = v2n;
    let v2nDash = v1n;

    //convert the scalar normal and tangential velocities into vector
    v1nDash = un.mult(v1nDash);
    const v1tDash = ut.mult(v1t);
    v2nDash = un.mult(v2nDash);
    const v2tDash = ut.mult(v2t);

    //update velocties
    this.velocity = v1nDash.add(v1tDash);
    ball.velocity = v2nDash.add(v2tDash);
    
    this.moving = true;
    ball.moving = true;

     if (this.gameWorld && (this === this.gameWorld.whiteBall || ball === this.gameWorld.whiteBall)) {
        const otherBall = this === this.gameWorld.whiteBall ? ball : this;
        if (!this.gameWorld.firstBallHit) {
            this.gameWorld.firstBallHit = otherBall;  
            // console.log("First ball hit:", otherBall.color);  // Debug log
        }
    }
    // console.log("Collision:", this.color, "vs", ball.color);
}

Ball.prototype.collideWithTable = function(table){
    if(!this.moving){
        return;
    }

    let collided = false;

    if(this.position.y <= table.TopY + BALL_RADIUS){
        this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
        collided = true;
    }

    if(this.position.x >= table.RightX - BALL_RADIUS){
        this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
        collided = true;
    }

    if(this.position.y >= table.BottomY- BALL_RADIUS){
        this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
        collided = true;
    }

    if(this.position.x <= table.LeftX + BALL_RADIUS){
        this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
        collided = true;
    }

    if(collided){
        this.velocity = this.velocity.mult(0.98);
    }
}
Ball.prototype.collideWith = function(object){

    if(object instanceof Ball){
        this.collideWithBall(object)
    }
    else{
        this.collideWithTable(object);
    }
}
