function _init_btn(iconWidth,iconHeight){
    let btnList = [this._rotateBtn,this._closeBtn,this._scaleBtn];

    let btn_position =[
        [-this._btnStyle.width/2,-this._btnStyle.height/2],
        [iconWidth-this._btnStyle.width/2,-this._btnStyle.height/2],
        [iconWidth-this._btnStyle.width/2,iconHeight-this._btnStyle.height/2]
    ];

    btn_position.forEach((position,index)=>{
        btnList[index].style.left = `${position[0]}px`;
        btnList[index].style.top = `${position[1]}px`;
    });
};

module.exports = _init_btn;