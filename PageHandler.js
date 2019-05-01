var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.sendFile(__dirname + '/Public/HTML/HomePage.html');
});

app.get('/favicon.ico', (req, res) => res.status(204));


app.get('/LevelOne', function(req, res){
    res.sendFile(__dirname + '/Public/HTML/LevelOne.html');
});

app.get('/LevelTwo', function(req, res){
    res.sendFile(__dirname + '/Public/HTML/LevelTwo.html');
});

app.get('/LevelThree', function(req, res){
    res.sendFile(__dirname + '/Public/HTML/LevelThree.html');
});

app.get('/LevelFour', function(req, res){
    res.sendFile(__dirname + '/Public/HTML/LevelFour.html');
});

app.get('/LevelFive', function(req, res){
    res.sendFile(__dirname + '/Public/HTML/LevelFive.html');
});


module.exports = app;
