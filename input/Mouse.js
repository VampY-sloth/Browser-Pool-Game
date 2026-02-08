function MouseHandler() {
    this.position = new Vector2();
    this.left = new ButtonState();
    this.middle = new ButtonState();
    this.right = new ButtonState();
}

MouseHandler.prototype.reset = function() {
    this.left.pressed = false;
    this.left.released = false;
    this.middle.pressed = false;
    this.middle.released = false;
    this.right.pressed = false;
    this.right.released = false;
};

MouseHandler.prototype.handleMouseMove = function(event) {
    const canvas = Canvas._canvas;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    this.position.x = (event.clientX - rect.left) * scaleX;
    this.position.y = (event.clientY - rect.top) * scaleY;
};

MouseHandler.prototype.handleMouseDown = function(event) {
    this.handleMouseMove(event);
    
    if (event.button === 0) {
        this.left.down = true;
        this.left.pressed = true;
    } else if (event.button === 1) {
        this.middle.down = true;
        this.middle.pressed = true;
    } else if (event.button === 2) {
        this.right.down = true;
        this.right.pressed = true;
    }
};

MouseHandler.prototype.handleMouseUp = function(event) {
    this.handleMouseMove(event);
    
    if (event.button === 0) {
        this.left.down = false;
        this.left.released = true;
    } else if (event.button === 1) {
        this.middle.down = false;
        this.middle.released = true;
    } else if (event.button === 2) {
        this.right.down = false;
        this.right.released = true;
    }
};

let Mouse = new MouseHandler();

// Initialize mouse event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('screen');
    if (canvas) {
        canvas.addEventListener('mousemove', Mouse.handleMouseMove.bind(Mouse));
        canvas.addEventListener('mousedown', Mouse.handleMouseDown.bind(Mouse));
        canvas.addEventListener('mouseup', Mouse.handleMouseUp.bind(Mouse));
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
});
