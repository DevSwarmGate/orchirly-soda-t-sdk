function _init(){
    let img = new Image(
        (+this._iconStyle.width)+'px',
        (+this._iconStyle.height)+'px'
    );

    img.onload =()=>{
        this._imgEle = img;
        
        this._init_style();

        this._init_event();
        
        this._container.appendChild(this._dom);
    };

    img.src = this._imgSrc;
}

module.exports = _init;