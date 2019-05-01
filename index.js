var express = require('express');
var app = express();


/*app.get('/', function (req, res) {
  res.send('Hello World!');
});*/

app.use(express.static('Public'));

var expressValidator = require('express-validator');
app.use(expressValidator());

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var methodOverride = require('method-override');
app.use(methodOverride(function (req, res) {
    console.log(req.query)
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method
    }
}));


var PageHandler = require('./PageHandler');
//var LevelOne = require('./Public/LevelOne');

app.use('/', PageHandler);
//app.use('/LevelOne', LevelOne);


app.listen(3000, function () {
  console.log('App listening on port 3000!');
});
