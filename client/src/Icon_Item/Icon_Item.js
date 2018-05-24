const   Util = require('../Util/Util'),
        _init = require('./_init'),
        _init_style = require('./_init_style'),
        _init_event = require('./_init_event'),
        _init_btn = require('./_init_btn'),
        _handle_touchEnd = require('./_handle_touchEnd'),
        _handle_touchMove = require('./_handle_touchMove'),
        _move = require('./_move'),
        _scale= require('./_scale'),
        _rotate = require('./_rotate');
    
const   ICON_STYLE ={
    'position':'absolute',
    'width':50,
    'height':50,
    'background-position':'0% 0%',
    'background-size':'100% 100%',
    'background-repeat':'no-repeat',
    'background-color':'rgba(1,0,0,0.7)'
};

const   BTN_STYLE ={
    'position':'absolute',
    'width':20,
    'height':20,
    'background-position':'0% 0%',
    'background-size':'100% 100%',
    'background-repeat':'no-repeat',
    'background-color':'rgba(1,0,0,0.7)',
    'display':'none'
};

const  MAX_SIZE = 200;

class Icon_Item{
    constructor(imgSrc,container,option){
        this._container = container;
        this._iconStyle = ICON_STYLE;
        this._btnStyle = BTN_STYLE;
        this._imgSrc = imgSrc;
        this._imgEle = null; 

        this._canvas = document.createElement('canvas');
        this._dom = document.createElement('div');

        this._closeBtn = document.createElement('div');
        this._scaleBtn = document.createElement('div');
        this._rotateBtn = document.createElement('div');

        this._touch_screenPos = null;
        this._isActive = false;
        this._isMove = false;

        this._rotation = 0;
        this._size = [this._iconStyle.width,this._iconStyle.height];
        this._maxSize = MAX_SIZE;

        this._touchCb =()=>{console.log('touch cb');}
        this._moveCb = ()=>{console.log('move cb');}
        this._scaleCb = ()=>{console.log('scale cb');}
        this._rotateCb = ()=>{console.log('rotate cb');}

        this._init_option(option);
        this._init();
    }
    //getter and setter
    set touchCb(cb){this._touchCb = cb;}
    set moveCb(cb){this._moveCb = cb;}
    set scaleCb(cb){this._scaleCb = cb;}
    set rotateCb(cb){this._rotateCb = cb;}
    //public
    convert(){return _convert();}
    active(){this._handle_touch();}
    //private
    _init(){_init.call(this);}
    _init_btn(width,height){_init_btn.call(this,width,height);}
    _init_style(){_init_style.call(this);}
    _init_event(){_init_event.call(this);}
    _init_option(option){Util.init_option.call(this,option);}

    _handle_touchEnd(evt){_handle_touchEnd.call(this,evt);}
    _handle_touchMove(evt){_handle_touchMove.call(this,evt);}
    _move(dis){_move.call(this,dis);}
    _rotate(nowPos,dis){_rotate.call(this,nowPos,dis);}
    _scale(dis){_scale.call(this,dis);}
}

module.exports = Icon_Item;