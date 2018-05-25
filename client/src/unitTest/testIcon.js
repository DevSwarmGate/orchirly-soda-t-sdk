const Icon = require('../Icon_Item/Icon_Item');

let container = document.querySelector('#container'),
    img = document.querySelector('#canvas'),
    icon = new Icon(
        './images/icon.png',
        container
    );


document.body.style.margin = 0;
container.style.width = `100%`;
container.style.height= `50%`;
container.style.position = 'absolute';
container.style.background = 'rgba(1,0,0,.7)';

img.style.width ='100%';
img.style.height = '50%';
img.style.position = 'absolute';
img.style.top = '50%';

window.icon = icon;

window.convert = ()=>{
    img.src = icon.convert();
};