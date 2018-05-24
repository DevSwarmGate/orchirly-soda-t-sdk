const   glMatrix = require('gl-matrix');

function _scale(dis){
    let vec = glMatrix.vec2.fromValues(dis[0],dis[1]),
        distance = glMatrix.vec2.length(vec);

    if(     (this._rotation >= 0 && this._rotation < 45)
        ||  (this._rotation >= 225 && this._rotation < 315)
        ||  (this._rotation >= 315 && this._rotation < 360)
    ){
        if(dis[0]> 0){
            this._size[0] += distance * 2;
            this._size[1] += distance * 2;
        }else{
            this._size[0] -= distance * 2;
            this._size[1] -= distance * 2;
        }
    }else if(       (this._rotation >= 45 && this._rotation < 135)
                ||  (this._rotation >= 135 && this._rotation < 225)
    ){
        if(dis[0]> 0){
            this._size[0] -= distance * 2;
            this._size[1] -= distance * 2;
        }else{
            this._size[0] += distance * 2;
            this._size[1] += distance * 2;
        }
    } 

    if(this._size[0] < this._iconStyle.width)
        this._size = [this._iconStyle.width,this._iconStyle.height];

    if(this._size[0] > this._maxSize)
        this._size = [this._maxSize,this._maxSize];
    
    this._dom.style.width = this._size[0]+'px';
    this._dom.style.height= this._size[1]+'px';
    this._init_btn(this._size[0],this._size[1]);
};

module.exports = _scale;