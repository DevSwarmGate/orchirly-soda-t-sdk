const RANK_STRUCT ={
    'header':'headurl',
    'rank':'',
    'name':'nickname',
    'ticket':'votecnt',
    'img':'img'
}

function _getRank(errorCb,successCb){
    let parseRank =(data)=>{
        let res = Object.assign({},RANK_STRUCT);
        for(let i in res){
            if(res[i] && data[res[i]])
                res[i] = data[res[i]]
        }
        res.ticket = (+res.ticket);
        return res;
    };

    let make =(data)=>{
        let res = {nowRank:null,rankList:[]};
        
        if(data.mySubmission && data.myRank){
            res.nowRank = parseRank(data.mySubmission);
            res.nowRank.rank = (+data.myRank);
        }

        if(data.rank && data.rank.length > 0)
            data.rank.forEach((rank,index)=>{
                let obj = parseRank(rank);
                obj.rank = index+1;
                res.rankList.push(obj);
                if(data.mySubmission && (+data.mySubmission.sid) == (+rank.sid))
                    res.nowRank.rank = (+obj.rank);
            });

        successCb(res);
    };
    if(this._urlParam.sid){
        this._models.app.request('sodaGetRank',{post:{pid:this._urlParam.sid}},(data)=>{
            if(this._debug)
                console.log('sodaGetRank',data);
            
            if(data.error_code == '200'){
                make(data.data);
            }else{
                errorCb(data.error_code);
            }
        });
    }else{
        this._models.app.request('sodaGetRank',{},(data)=>{
            if(this._debug)
                console.log('sodaGetRank',data);
            
            if(data.error_code == '200'){
                make(data.data);
            }else{
                errorCb(data.error_code);
            }
        });
    }
};

module.exports = _getRank;