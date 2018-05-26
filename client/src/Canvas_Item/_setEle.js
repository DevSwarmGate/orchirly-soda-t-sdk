function _setEle(eleKey,src){
    if(eleKey.indexOf('_') !== 0)
        eleKey = `_${eleKey}`;

    this[`${eleKey}_ele`].style['background-image'] = this._loadingGif_src;

    this._loadImg(src,(img)=>{
        this[`${eleKey}_ele`].style['background-image'] = `url(${src})`;
        this[`${eleKey}_ele`].style.display = '';
        this[`${eleKey}_img`] = img;
    });
};  

module.exports = _setEle;