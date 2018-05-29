const QRCode = require('qrcode');

function _genQRCode(url,cb){
    QRCode.toDataURL(url,{errorCorrectionLevel: 'M'},(err, dataURL)=>{
        if(err)
            console.log(err);
        
        this._loadImg(dataURL,(img)=>{
            this._qr_img = img;
            cb();
        });
    });
};

module.exports = _genQRCode;