function _create(url,src,headImgSrc,cb){
    let check =()=>{
        if(!this._bg_img)
            return console.log('bg img error');

        if(!this._submission_img || !this._qr_img || !this._head_img)
            return;

        this._drawCanvas(cb);
    };

    this._loadImg(src,(img)=>{
        this._submission_img = img;
        check();
    });

    this._loadImg(headImgSrc,(img)=>{
        this._head_img = img;
        check();
    });

    this._genQRCode(url,check.bind(this));
};

module.exports = _create;