function _init_options(options){
    for(let i in options){
        if(i in this)
            this[i] = options[i]

        if(`_${i}` in this)
            this[`_${i}`] = options[i];      
    }
};

module.exports = _init_options;