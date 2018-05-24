const   glMatrix = require('gl-matrix');
const   TAG = [
    'transform',
    '-ms-transform',
    '-webkit-transform'
];

function _rotate(nowPos,dis){
    let now_vec = glMatrix.vec2.fromValues(nowPos[0], nowPos[1]),
        old_vec = glMatrix.vec2.fromValues(this._touch_screenPos[0], this._touch_screenPos[1]),
        rad = glMatrix.vec2.angle(old_vec,now_vec),
        deg = rad * 180 / Math.PI;
    
    if(this._rotation >= 0 && this._rotation < 90){
        if(dis[0]> 0){
            this._rotation += deg * 5;
        }else{
            this._rotation -= deg * 5;
        }
    }else if(this._rotation >= 90 && this._rotation < 180){
        if(dis[1] > 0){
            this._rotation += deg * 5;
        }else{
            this._rotation -= deg * 5;
        }
    }else if(this._rotation >= 180 && this._rotation < 270){
        if(dis[0] < 0){
            this._rotation += deg * 5;
        }else{
            this._rotation -= deg * 5;
        }
    }else if(this._rotation >= 270 && this._rotation < 360){
        if(dis[1] < 0){
            this._rotation += deg * 5;
        }else{
            this._rotation -= deg * 5;
        }
    } 

    this._rotation %= 360;

    if(this._rotation < 0)
        this._rotation = 360 + this._rotation;        
    
    TAG.forEach(tag=>{
        this._dom.style[tag] = `rotate(${Math.floor(this._rotation)}deg)`;
    });
};

module.exports = _rotate;