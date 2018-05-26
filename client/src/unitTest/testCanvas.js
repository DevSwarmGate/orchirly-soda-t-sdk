const Canvas_Item = require('../Canvas_Item/Canvas_Item');

let container = document.querySelector('#container'),
    img = document.querySelector('#canvas'),
    item = new Canvas_Item(container);


document.body.style.margin = 0;
container.style.position = 'absolute';
img.style.background = container.style.background = 'rgba(1,0,0,.7)';

img.style.width ='100%';
img.style.position = 'absolute';
img.style.top = '100%';


item.frame = 'images/red_frame.png';
item.shirt = 'images/pink_02.png';

window.item = item;