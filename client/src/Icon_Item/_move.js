function _move(dis){
    this._dom.style.left = `${this._dom.offsetLeft + dis[0]}px`;
    this._dom.style.top = `${this._dom.offsetTop + dis[1]}px`;
    this._moveCb(this);
};

module.exports = _move;