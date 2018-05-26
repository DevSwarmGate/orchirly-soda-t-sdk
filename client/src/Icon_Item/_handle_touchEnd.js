function _handle_touch(evt){
    let btnList = [this._rotateBtn,this._closeBtn,this._scaleBtn];

    if(evt && evt.target === this._closeBtn)
        return this._delete();

    if(this._isActive && !this._isMove){
        this._deactive();
    }else if(!this._isActive && !this._isMove){
        this._active();
    }

    this._touchCb(this);
    this._isMove = false;
    this._touch_screenPos = null;
};

module.exports = _handle_touch;