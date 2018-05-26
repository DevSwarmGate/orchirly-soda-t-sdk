function _init_eleStyle(ele,style){
    for(let key in style){
        ele.style[key] = style[key];
    }
};

module.exports = _init_eleStyle;