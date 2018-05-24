const express = require('express'),
    http = require('http'),
    Path = require('path');

let app = new express(),
    server = http.Server(app),
    _root = __dirname;

//default static folder
app.use('/', express.static(`${Path.dirname(_root)}\/client\/dist\/`));
// default route

//listen
app.listen(3001, (err) =>{
    console.log(err||'Server Started on localhost:3001');
});