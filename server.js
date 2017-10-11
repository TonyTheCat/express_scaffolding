// Imports modules and files
const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mongoose    = require('mongoose');
const jwt         = require('jsonwebtoken');
const config      = require('./config');
const User        = require('./app/models/user');
const apiRoutes   = express.Router();

// Connection to DB
let port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

// POST request parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Logger
app.use(morgan('dev'));


// Routes
// Root
apiRoutes.get('/', (req, res) => {
    res.json({message: 'Welcome!'});
});


apiRoutes.get('/users', (req, res) => {
   User.find({}, (err, users) => {
       res.json(users);
   })
});

// Setup
app.get('/setup', (req, res) => {
    // test user
    let anton = new User({
        name: 'Anton S',
        password: 'password',
        admin: 'true'
    });

    // save test user
    anton.save( (err) => {
        if (err) throw err;

        console.log('User was saved successfully');
        res.json({ success: true });
    });
});

app.use('/api', apiRoutes);


// Start app and test it's up
app.listen(port);
console.log('TEST http://localhost:' + port);
