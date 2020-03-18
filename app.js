const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoSessionStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const User = require("./models/user")
const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const mongoose = require('mongoose');
const csrf = require('csurf');

const app = express();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorRoutes = require('./routes/error');

const store = new MongoSessionStore({
    uri: 'mongodb://localhost:27017/onlineshopping',
    collection: 'mySessions'
});
const csrfProtection = csrf();

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images',express.static(path.join(__dirname,'public','uploads')))
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
    name: 'Tina',
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));
//The order of csrf must be after bodyparser
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.csrfToken = req.csrfToken();
    next();
});

// app.use((req, res, next) => {
//     User.findById('5e6ef2bf0fe80a4774ff32c2')
//         .then(user => {
           
//             req.user = user;
//             console.log("====",req.user);
//             next();
//         })
//         .catch(err => console.log(err));
// });







app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorRoutes);

app.use(errorController.get404);



mongoose.connect('mongodb://localhost:27017/onlineshopping', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(1000, ()=>{
            console.log('Listening 888')
        });
    }).catch(err => console.error(err));

