function _drawCanvas(cb){
    let list = [this._bg_img,this._bottomLogo_img,this._shirt_img,this._frame_img],
        ctx = this._canvas.getContext("2d"),
        width = this._bg_img.width * this._ratio,
        height = this._bg_img.height * this._ratio;

    let draw =(img,isLast)=>{
        ctx.drawImage(img, 0, 0, width, height);

        if(isLast)
            cb();
    };

    list.forEach(img=>{
        requestAnimationFrame(()=>{
            draw(img);
        });
    });

    this._icon_imgs.forEach((img,index)=>{
        let isLast = false;

        if(index === this._icon_imgs.length-1)
            isLast = true;

        requestAnimationFrame(()=>{
            draw(img,isLast);
        });
    });
};

module.exports = _drawCanvas;