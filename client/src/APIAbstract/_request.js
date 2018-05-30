function _request(verb,options,cb){
    let xhr = new XMLHttpRequest();

    let parseParam = (data,method)=>{
        let res = '',
            keys = method ==="GET" 
                 ? this._verbs[verb].get 
                 : this._verbs[verb].post;

        for (let i = 0;i < keys.length;i++) {
            if(keys[i] && keys[i] in data){

                res += encodeURIComponent(keys[i])
                    +"="
                    +encodeURIComponent(data[keys[i]])
                    +"&";

            }else if(this._debug){
                console.log(
                    `${this._modelName}/${verb}`,
                    `missing a ${method} param:${this._verbs[verb].post[i]}`
                );
            }
            
        }
        
        res = res.substring(0,res.length-1);

        // if(method === "GET" && keys.length !== 0)
        //     res = '?'+res;

        return res;
    };

    xhr.open(
        this._verbs[verb].post.length === 0? "GET":"POST",
        this._isApiresult?
        `${this._api_host}/index.php?g=Wap&m=Apiresult&a=index&mname=${this._modelName}&aname=${verb}&token=${this._token}&${parseParam(options.get,'GET')}`:
        `${this._api_host}/index.php?g=Wap&m=Index&a=${verb}&token=${this._token}&${parseParam(options.get,'GET')}`
    );
    
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            let responseData = JSON.parse(xhr.responseText);
            
            if(this._debug){
                console.log(`${this._modelName}/${verb}:`,responseData);   
            }
            
            if(cb !== undefined){
                cb(responseData);
            }
        }
    };
    
    xhr.send(parseParam(options.post,'POST'));

    if(this._debug)
        console.log(
            `API requested url:`,
            this._isApiresult?
            `${this._api_host}/index.php?g=Wap&m=Apiresult&a=index&mname=${this._modelName}&aname=${verb}&token=${this._token}&${parseParam(options.get,'GET')}`:
            `${this._api_host}/index.php?g=Wap&m=Index&a=${verb}&token=${this._token}&${parseParam(options.get,'GET')}`
        );
};

module.exports = _request;