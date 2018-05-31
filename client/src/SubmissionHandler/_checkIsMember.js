function _checkIsMember(){
    if(this._rawData.isblind == '0' && this._rawData.ismember == '0' && this._rawData.isregister =='0')
        return false;

    return true;
};

module.exports = _checkIsMember;