// Imports modules and files
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var jwt         = require('jsonwebtoken');
var config      = require('./config');
var User        = require('./app/models/user');


// Connection to DB
var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

// POST request parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Logger
app.use(morgan('dev'));


// Routes
app.get('/', function(req, res) {
    res.send('http://localhost:' + port + '/api');
});

// Start app and test it's up
app.listen(port);
console.log('TEST http://localhost:' + port);
