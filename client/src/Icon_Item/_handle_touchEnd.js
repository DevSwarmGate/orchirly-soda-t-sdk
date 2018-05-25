function _handle_touch(evt){
    let btnList = [this._rotateBtn,this._closeBtn,this._scaleBtn];

    if(evt.target === this._closeBtn)
        return this._delete();

    if(this._isActive && !this._isMove){
        this._isActive = false;
        
        btnList.forEach(btn=>{
            btn.style.display='none';
        });
    }else if(!this._isActive && !this._isMove){
        this._isActive = true;
        btnList.forEach(btn=>{
            btn.style.display='block';
        });
    }

    this._isMove = false;
    this._touch_screenPos = null;
};

module.exports = _handle_touch;