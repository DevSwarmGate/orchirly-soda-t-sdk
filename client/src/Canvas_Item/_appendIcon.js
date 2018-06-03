const Icon = require('../Icon_Item/Icon_Item');

function _appendIcon(src,option){
    let icon = new Icon(src,this._icon_container,option);

    this._icons.push(icon);

    icon._dom.style.left = '42.5%';
    icon._dom.style.top = '45%';
    icon.touchCb = this._handle_icon_select.bind(this);
    icon.deleteCb = this._deleteCb.bind(this);

    icon.appendCb = (icon)=>{
        icon.active = true;
        this._handle_icon_select(icon);
    }
};

module.exports = _appendIcon;