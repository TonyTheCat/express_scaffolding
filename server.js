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
app.set('secret', config.secret);

// POST request parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Logger
app.use(morgan('dev'));


// Routes -----------------------------------------

// Authenticate
apiRoutes.post('/authenticate', (req, res) => {
   User.findOne({
       name: req.body.name
   }, (err, user) => {
           // Error
           if (err) {
               throw err
           }
           // User not found
           else if (!user) {
               res.json({ success: false, message: 'User not found!' });
           }
           // Password doesn't match
           else if (user) {
               if (user.password !== req.body.password) {
                   res.json({ success: false, message: 'Wrong password!' })
               }
               // Alright!
               else {
                   const payload = {
                       admin: user.admin
                   };

                   let token = jwt.sign(payload, app.get('secret'), {
                       expiresIn: 1200
                   });

                   // Return token and status
                   res.json({
                       success: true,
                       token: token
                   });
               }
           }
        }
   )
});

// Token verification route
apiRoutes.use((req, res, next) => {
    // check req for token
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('secret'), (err, decoded) => {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if ok
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

// Root
apiRoutes.get('/', (req, res) => {
    res.json({message: 'Welcome!'});
});

// List of all users
apiRoutes.get('/users', (req, res) => {
   User.find({}, (err, users) => {
       res.json(users);
   })
});

// Setup - just to add new user record in db
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

// Add prefix "api" - просто так, для красоты ))
app.use('/api', apiRoutes);


// Start app and test it's up
app.listen(port);
console.log('TEST http://localhost:' + port);
