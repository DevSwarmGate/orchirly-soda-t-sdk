const VERB_STRUCT = {
    "get":[],
    "post":[]
}

function _make_api(json){
    let verbs = [];

    let makeVerb = (verbObj)=>{
        let struct = Object.assign({},VERB_STRUCT);
        struct.get = verbObj.get;
        struct.post= verbObj.post;
        return struct;
    };

    if(json.constructor === "".constructor)
        json = JSON.parse(json);

    for(let i in json.verbs){
        verbs[i]= makeVerb(json.verbs[i]);
    }

    this._modelName = json.modelName;
    this._verbs = verbs;
    this._isApiresult = json.isApi?json.isApi:true;
};

module.exports = _make_api;