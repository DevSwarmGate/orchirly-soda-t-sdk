function _loadImg(src,cb){
    let img = new Image(
        window.innerWidth,
        window.innerWidth / this._size_ratio
    );

    img.onload = ()=>{
        cb.call(this,img);
    };

    img.src = src;
};

module.exports = _loadImg;