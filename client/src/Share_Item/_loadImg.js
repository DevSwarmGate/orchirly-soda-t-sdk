function _loadImg(src,cb){
    let img = new Image();

    img.onload = ()=>{
        cb.call(this,img);
    };

    img.src= src;
};

module.exports = _loadImg;