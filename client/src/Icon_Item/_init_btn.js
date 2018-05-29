const BTN_IMGS = [
    require('./_rotateBtn_img_base64'),
    require('./_closeBtn_img_base64'),
    require('./_scaleBtn_img_base64')
];

function _init_btn(iconWidth,iconHeight){
    let btnList = [this._rotateBtn,this._closeBtn,this._scaleBtn],
        imgList = BTN_IMGS;

    let btn_position =[
        [-this._btnStyle.width/2,-this._btnStyle.height/2],
        [iconWidth-this._btnStyle.width/2,-this._btnStyle.height/2],
        [iconWidth-this._btnStyle.width/2,iconHeight-this._btnStyle.height/2]
    ];

    btn_position.forEach((position,index)=>{
        btnList[index].style.left = `${position[0]}px`;
        btnList[index].style.top = `${position[1]}px`;
        btnList[index].style['background-image'] = `url(${imgList[index]})`;
    });
};

module.exports = _init_btn;