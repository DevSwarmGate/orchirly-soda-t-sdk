function _deselectAll(){
    this._icons.forEach(icon=>{
        icon.active = false;
    });
};

module.exports = _deselectAll;