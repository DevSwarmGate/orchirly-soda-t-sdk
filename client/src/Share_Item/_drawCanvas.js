const   TOP_RATIO =  0.15,
        LEFT_RATIO = 0.05;

function _drawCanvas(cb){
    let callCount = 0,
        ctx = this._canvas.getContext("2d"),
        width = this._bg_img.width,
        height = this._bg_img.height;

    let drawBg =(cb)=>{
        ctx.drawImage(this._bg_img, 0, 0, width, height);
        cb();
    };

    let drawSub = (cb)=>{
        let subWidth = 0.9 *  width,
            subHeight = subWidth / (this._submission_img.width/this._submission_img.height);
        
        ctx.drawImage(this._submission_img,LEFT_RATIO*width,TOP_RATIO*width,subWidth,subHeight);
        cb();
    };

    let drawSoda = (cb)=>{
        let subWidth = 0.9 *  width,
            subHeight = subWidth / (this._soda_img.width/this._soda_img.height);
        
        ctx.drawImage(this._soda_img,LEFT_RATIO*width,TOP_RATIO*width,subWidth,subHeight);
        cb();
    };

    let drawQR = (cb)=>{
        ctx.drawImage(this._qr_img,540,845,100,100);
        cb();
    };

    let run =()=>{
        let callList = [drawBg,drawSub,drawSoda,drawQR];

        
        callList[callCount].call(this,()=>{
            callCount+=1;

            if(callCount < callList.length){
                run();
            }else{
                cb(this._canvas.toDataURL());
            }
        });
    };
    
    run();
};

module.exports = _drawCanvas;