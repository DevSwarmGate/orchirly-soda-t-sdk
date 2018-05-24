function _move(dis){
    this._dom.style.left = this._dom.offsetLeft + dis[0];
    this._dom.style.top = this._dom.offsetTop + dis[1];
};

module.exports = _move;