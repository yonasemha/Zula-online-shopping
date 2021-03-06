const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require("helmet")
const compression = require("compression")
const morgan = require("morgan")
const fs = require("fs")
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
const acessLogstream = fs.createWriteStream(path.join(__dirname,"acess.log"),{flags:"a"});
app.use(morgan("combined",{stream:acessLogstream}))


const MONGODB_URL='mongodb+srv://zula3:JdXVvDjRKseEo6L7@zula-ks5oc.mongodb.net/test?retryWrites=true&w=majority'
//const MONGODB_URL = `mongodb+srv://${process.env.MONGO_USER}:${ process.env.MONGO_PWD}@cluster0-rxgd3.gcp.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=t rue&w=majority`;
const store = new MongoSessionStore({
    uri:MONGODB_URL,
    collection: 'mySessions'
});
const csrfProtection = csrf();
app.use(helmet())
app.use(compression())

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images',express.static(path.join(__dirname,'public','uploads')))
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
    name: 'Embaye',
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





app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorRoutes);

app.use(errorController.get404);


mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT || 222, ()=>{
            console.log('Listening 222')
        });
    }).catch(err => console.error(err));

