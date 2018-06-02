const   Sdk = require('../Sdk');

let img = document.querySelector('#canvas'),
    sdk = new Sdk(),
    item = sdk.createShare('images/share_bg.png');


document.body.style.margin = 0;
img.style.width ='100%';
img.style.position = 'absolute';
img.style.top = 0;

window.item = item;
window.sdk = sdk;
