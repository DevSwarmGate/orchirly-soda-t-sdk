function _getAPIURL(verb,options){
    if(!options.get)
        options.get = {};

    let parseParam = (data)=>{
        let res = '',
            keys = this._verbs[verb].get

        for (let i = 0;i < keys.length;i++) {
            if(data[keys[i]]){

                res += keys[i]//encodeURIComponent(keys[i])
                    +"="
                    + data[keys[i]]//encodeURIComponent(data[keys[i]])
                    +"&";

            }else if(this._debug){
                console.log(
                    `${this._modelName}/${verb}`,
                    `missing a GET param:${this._verbs[verb].post[i]}`
                );
            }
            
        }
        
        res = res.substring(0,res.length-1);

        // if(keys.length !== 0)
        //     res = '?'+res;

        return res;
    };

    return this._isApiresult?
        `${this._api_host}/index.php?g=Wap&m=Apiresult&a=index&mname=${this._modelName}&aname=${verb}&token=${this._token}&${parseParam(options.get,'GET')}`:
        `${this._api_host}/index.php?g=Wap&m=Index&a=${verb}&token=${this._token}&${parseParam(options.get,'GET')}`;
}

module.exports = _getAPIURL;