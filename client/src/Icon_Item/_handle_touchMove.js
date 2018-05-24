function _handle_move(evt){
    
    evt.preventDefault();

    this._isMove = true;

    if(!this._isActive)
        return;

    if(!this._touch_screenPos)
        return this._touch_screenPos = [evt.touches[0].clientX,evt.touches[0].clientY];

    let nowPos = [evt.touches[0].clientX,evt.touches[0].clientY],
        dis = [nowPos[0] - this._touch_screenPos[0],nowPos[1] - this._touch_screenPos[1]];

    if(evt.target === this._dom){
        this._move(dis);
    }else if(evt.target === this._closeBtn){

    }else if(evt.target === this._scaleBtn){
        this._scale(dis);
    }else if(evt.target === this._rotateBtn){
        this._rotate(nowPos,dis);
    }

    this._touch_screenPos = [evt.touches[0].clientX,evt.touches[0].clientY]; 
};

module.exports = _handle_move;