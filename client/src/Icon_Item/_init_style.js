function _init_style(){
    
    let setStyle =(ele,style)=>{
        for(let i in style){
            ele.style[i] = style[i];
        }
    };

    setStyle(this._dom,this._iconStyle);
    setStyle(this._closeBtn,this._btnStyle);
    setStyle(this._scaleBtn,this._btnStyle);
    setStyle(this._rotateBtn,this._btnStyle);

    this._dom.appendChild(this._closeBtn);
    this._dom.appendChild(this._scaleBtn);
    this._dom.appendChild(this._rotateBtn);

    this._dom.style['background-image'] = `url(${this._imgSrc})`;
    this._dom.style['transform-origin'] = 'center';

    this._init_btn(this._iconStyle.width,this._iconStyle.height);
};

module.exports = _init_style;