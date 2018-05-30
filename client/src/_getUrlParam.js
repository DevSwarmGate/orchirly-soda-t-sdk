function _getUrlParam(){
    let url_template = this._url_template,
        keys = [];

    let getParam=(name,str)=>{

        let val = '',
            reg = new RegExp('[\\?&]' + name + '=([^&]+)', 'i');

        if (reg.test(str)) {
            val = RegExp.$1;
        }

        return val ? decodeURIComponent(val) : '';
    };

    let getKey = (url)=>{
        let start_point = url.indexOf('=${'),
            end_point = url.indexOf('}',start_point),
            key = null;

        if(start_point === -1)
            return ;
            
        if(end_point === -1)
            return ;

        key = url.substring(start_point+3,end_point);

        keys.push(key);

        url = url.replace("?"+key+"=${"+key+"}",'');
        url = url.replace("&"+key+"=${"+key+"}",'');

        getKey(url);
    };

    getKey(url_template);

    for(let i=0;i<keys.length;i++){
        if(getParam(keys[i],window.location.href) === '')
            continue;
        this._urlParam[keys[i]] = getParam(keys[i],window.location.href);
    }
}

module.exports = _getUrlParam;