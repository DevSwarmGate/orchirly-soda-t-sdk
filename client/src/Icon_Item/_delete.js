function _delete(){
    this._dom.remove();
    this._deleteCb(this);
    Object.keys(this).forEach(key=>{
        this[key] = null;
    });
};

module.exports = _delete;