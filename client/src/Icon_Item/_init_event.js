function _init_event(){
    this._dom.addEventListener('touchend',this._handle_touchEnd.bind(this),false);
    this._dom.addEventListener('touchmove',this._handle_touchMove.bind(this),false);
};

module.exports = _init_event;