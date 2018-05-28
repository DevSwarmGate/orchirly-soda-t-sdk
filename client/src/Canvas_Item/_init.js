function _init(){
    let eles = [];

    let check =()=>{
        if(eles.length < 2)
            return;
        
        this._bg_container.appendChild(this._bg_ele);
        this._bg_container.appendChild(this._bottomLogo_ele);
        //this._bg_container.appendChild(this._sodaLogo_ele);
        this._bg_container.appendChild(this._shirt_ele);
        this._bg_container.appendChild(this._frame_ele);

        this._init_eleStyle(this._shirt_ele,this._ele_style);
        this._init_eleStyle(this._frame_ele,this._ele_style);
    };

    this._container.style.width = this._bg_container.style.width = this._icon_container.style.width = window.innerWidth+'px';
    this._container.style.height = this._bg_container.style.height = this._icon_container.style.height =window.innerWidth / this._size_ratio+'px';
    this._container.appendChild(this._bg_container);
    this._container.appendChild(this._icon_container);
    this._init_eleStyle(this._bg_container,this._ele_style);
    this._init_eleStyle(this._icon_container,this._ele_style);
    this._bg_container.style.display = '';
    this._icon_container.style.display = '';
    this._icon_container.style.overflow = 'hidden';

    this._loadImg(this._bg_src,(img)=>{
        this._bg_img = img;
        this._init_eleStyle(this._bg_ele,this._ele_style);
        this._bg_ele.style['background-image'] = `url(${this._bg_src})`;
        this._bg_ele.style.display = '';
        this._bg_ele.style.width = this._frame_ele.style.width = this._shirt_ele.style.width = img.width +'px';
        this._bg_ele.style.height = this._frame_ele.style.height = this._shirt_ele.style.height =img.height +'px';

        eles.push(this._bg_ele);
        check();
    });

    // this._loadImg(this._sodaLogo_src,(img)=>{
    //     this._sodaLogo_img = img;
    //     this._init_eleStyle(this._sodaLogo_ele,this._ele_style);
    //     this._sodaLogo_ele.style['background-image'] = `url(${this._sodaLogo_src})`;
    //     this._sodaLogo_ele.style.width = img.width;
    //     this._sodaLogo_ele.style.height = img.height;

    //     eles.push(this._sodaLogo_ele);
    //     check();
    // });

    this._loadImg(this._bottomLogo_src,(img)=>{
        this._bottomLogo_img = img;
        this._init_eleStyle(this._bottomLogo_ele,this._ele_style);
        this._bottomLogo_ele.style['background-image'] = `url(${this._bottomLogo_src})`;
        this._bottomLogo_ele.style.display = '';
        this._bottomLogo_ele.style.width = img.width+'px';
        this._bottomLogo_ele.style.height = img.height+'px';
        
        eles.push(this._bottomLogo_ele);
        check();
    });
};

module.exports = _init;