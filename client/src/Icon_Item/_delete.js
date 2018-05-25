function _delete(){
    this._dom.remove();
    Object.keys(this).forEach(key=>{
        this[key] = null;
    });
};

module.exports = _delete;