const QRCode = require('qrcode');

function _genQRCode(url,cb){
    QRCode.toDataURL(url,{errorCorrectionLevel: 'M'},(err, dataURL)=>{
        if(err)
            console.log(err);
        
        this._qr_img = dataURL;
        cb();
    });
};

module.exports = _genQRCode;