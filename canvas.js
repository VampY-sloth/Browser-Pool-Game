function Canvas2D() {
  this._canvas = document.getElementById("screen");
  if (!this._canvas) {
    throw new Error("Canvas element #screen not found.");
  }
  this._canvasContext = this._canvas.getContext("2d");
}

Canvas2D.prototype.clear = function() {
  this._canvasContext.clearRect(
    0, 0,
    this._canvas.width,
    this._canvas.height
  );
};

Canvas2D.prototype.drawImage = function(image, position, origin, rotation = 0) {
  position = position || new Vector2();
  origin   = origin   || new Vector2();
  
  this._canvasContext.save();
  this._canvasContext.translate(position.x, position.y);
  this._canvasContext.rotate(rotation);
  this._canvasContext.drawImage(image, -origin.x, -origin.y);
  this._canvasContext.restore();
};

let Canvas = new Canvas2D();

let image = new Image();
image.src = "./content/sprites/spr_background4.png";


//testing
// setTimeout(() => {
//    Canvas.drawImage(image,{x:0,y:0});
// }, 1000);

// setTimeout(() => {
//    Canvas.clear();
// }, 2000);