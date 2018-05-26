function _convert(cb){
    let containerClientRect = this._container.getBoundingClientRect();
    
    this._canvas.width = containerClientRect.width * this._ratio;
    this._canvas.height = containerClientRect.height * this._ratio;
    this._canvas.style.width = '100%';
    
    let check =()=>{
        if(this._icons.length !== this._icon_imgs.length)
            return;

        this._drawCanvas(()=>{
            cb(this._canvas.toDataURL());
        });
    };

    this._icons.forEach(icon=>{
        let img = new Image();
        
        img.onload=()=>{
            this._icon_imgs.push(img);
            check();
        };
        img.src = icon.convert();       
    }); 
};

module.exports = _convert;