function _convert(){
    let containerClientRect = this._container.getBoundingClientRect();

    this._canvas.width = containerClientRect.width * this._ratio;
    this._canvas.height = containerClientRect.height * this._ratio;
    this._canvas.style.width = '100%';
    
    this._drawCanvas();

    return this._canvas.toDataURL();
};

module.exports = _convert;