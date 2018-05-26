function _active(){
    let btnList = [this._rotateBtn,this._closeBtn,this._scaleBtn];
    this._isActive = true;
    btnList.forEach(btn=>{
        btn.style.display='block';
    });
};

module.exports = _active;