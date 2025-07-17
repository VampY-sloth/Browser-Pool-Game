let sprites = {};
let contentStillLoading = 0;

function contentLoadingLoop(callback){
    if(contentStillLoading){
        requestAnimationFrame(contentLoadingLoop.bind(this, callback))
    }
    else{
        callback();
    }
}

function loadContents(callback){

    function loadSprite(fileName){
        contentStillLoading++;

        let spriteImage =  new Image();
        spriteImage.src ="./content/sprites/" + fileName;

        spriteImage.onload = function(){
            contentStillLoading--;
        }
        return spriteImage;
    }

    sprites.background = loadSprite("spr_background4.png");
    sprites.stick = loadSprite("spr_stick.png");
    sprites.whiteBall = loadSprite('spr_ball2.png')
    sprites.redBall = loadSprite('spr_redBall2.png')
    sprites.yellowBall = loadSprite('spr_yellowBall2.png')
    sprites.blackBall = loadSprite('spr_blackBall2.png')


    contentLoadingLoop(callback);
}

function getBallSpriteByColor(color){
    switch(color){
        case COLOR.RED :
            return sprites.redBall;
        case COLOR.YELLOW:
            return sprites.yellowBall;
        case COLOR.BLACK:
            return sprites.blackBall;
        case COLOR.WHITE:
            return sprites.whiteBall;
    }
}