function _create(url,src,headImgSrc,cb){
    let check =()=>{
        if(!this._submission_img || !this._qr_img || !this._head_img)
            return console.log(this._submission_img,this._qr_img,this._head_img);

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