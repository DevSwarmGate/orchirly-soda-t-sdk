function _deactive(){
    let btnList = [this._rotateBtn,this._closeBtn,this._scaleBtn];
    this._isActive = false;
        
    btnList.forEach(btn=>{
        btn.style.display='none';
    });
};

module.exports = _deactive;