const   Util = require('../Util/Util'),
        _appendIcon= require('./_appendIcon'),
        _convert = require('./_convert'),
        _deselectAll = require('./_deselectAll'),
        _drawCanvas = require('./_drawCanvas'),
        _init = require('./_init'),
        _init_eleStyle = require('./_init_eleStyle'),
        _loadImg = require('./_loadImg'),
        _setEle = require('./_setEle'),
        _handle_icon_select = require('./_handle_icon_select');

const   LOGO_SRC = require('./_logoImg_base64'),
        BG_SRC = require('./_bgImg_base64'),
        LOADING_SRC= require('./_loadingGif_base64');

const   SIZE_RATIO = 693/868,
        RATIO = 2;

const   ELE_STYLE ={
    'position':'absolute',
    'background-position':'0% 0%',
    'background-size':'100% 100%',
    'background-repeat':'no-repeat',
    'display':'none'
};

class Canvas_Item{
    constructor(container,option){
        this._container = container;
        this._bg_container= document.createElement('div');
        this._icon_container = document.createElement('div');

        this._ratio = RATIO;
        this._size_ratio = SIZE_RATIO;
        this._ele_style = ELE_STYLE;

        this._bg_ele = document.createElement('div');
        this._bottomLogo_ele = document.createElement('div');
        //this._sodaLogo_ele = document.createElement('div');
        this._frame_ele = document.createElement('div');
        this._shirt_ele = document.createElement('div');
        this._icons = [];
        this._icon_imgs = [];

        this._bg_img = null;
        this._bottomLog_img = null;
        //this._sodaLogo_img = null;
        this._frame_img = null;
        this._shirt_img = null;

        this._bg_src = BG_SRC;
        this._bottomLogo_src = LOGO_SRC;
        //this._sodaLogo_src = SODA_SRC;
        this._loadingGif_src = LOADING_SRC;

        this._deleteCb = ()=>{console.log('icon delete cb');}

        this._canvas = document.createElement('canvas');
        this._init_option(option);
        this._init();
    }
    /*-------------------
        getter and setter
    --------------------*/
    get shirt(){return this._shirt_ele;}
    set shirt(src){this._setEle('shirt',src);}
    
    get frame(){return this._frame_ele;}
    set frame(src){this._setEle('frame',src);}

    set onIconDelete(cb){this._deleteCb = cb;}
    /*-------------------
        public method
    --------------------*/
    appendIcon(src,option){_appendIcon.call(this,src,option);}
    convert(cb){return _convert.call(this,cb);}
    deselectAll(){_deselectAll.call(this);}
    /*-------------------
        private method
    --------------------*/
    _drawCanvas(cb){_drawCanvas.call(this,cb);}
    _setEle(eleKey,src){_setEle.call(this,eleKey,src);}
    _init_option(option){Util.init_option.call(this,option);}
    _init_eleStyle(ele,style){_init_eleStyle.call(this,ele,style);}
    _init(){_init.call(this);}
    _loadImg(src,cb){_loadImg.call(this,src,cb);}
    _handle_icon_select(icon){_handle_icon_select.call(this,icon);}
}

module.exports = Canvas_Item;