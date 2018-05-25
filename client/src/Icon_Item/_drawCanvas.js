function _drawCanvas(){
    let ctx = this._canvas.getContext("2d"),
        width = this._size[0] * this._ratio,
        height = this._size[1] * this._ratio,
        x = this._dom.offsetLeft * this._ratio +width/2,
        y = this._dom.offsetTop * this._ratio +height/2,
        rad = this._rotation * (Math.PI / 180);

    ctx.translate(x, y);
    ctx.rotate(rad);
    ctx.drawImage(this._imgEle, -width / 2, -height / 2, width, height);
    ctx.rotate(-rad);
    ctx.translate(-x, -y);
};

module.exports = _drawCanvas;