function _deselectAll(evt){
    if(evt.target !== this._icon_container)
        return;
    
    this._icons.forEach(icon=>{
        icon.active = false;
    });
};

module.exports = _deselectAll;