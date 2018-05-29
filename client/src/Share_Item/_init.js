function _init(){
    let init_soda=(img)=>{
        this._soda_img = img;
    };

    let init_size =(img)=>{
        this._bg_img = img;
        this._canvas.width = img.width;
        this._canvas.height = img.height;
    };
 
    this._loadImg(this._bg_src,init_size);
    this._loadImg(this._soda_src,init_soda)
};

module.exports = _init;