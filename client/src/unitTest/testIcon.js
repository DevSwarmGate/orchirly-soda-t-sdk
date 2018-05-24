const Icon = require('../Icon_Item/Icon_Item');

let container = document.querySelector('#container'),
    icon = new Icon(
        './images/icon.png',
        container
    );

window.icon = icon;