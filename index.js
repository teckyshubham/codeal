const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
// const app = express();
const port = process.env.PORT ||8000;
const db = require('./config/mongoose');

const expressLayouts = require('express-ejs-layouts');
// session key
// const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-local-strategy');

const passportGoogle=require('./config/passport-google-oauth2-strategy');
// const MongoStore = require('connect-mongo')(session);
// const MongoDBStore = require('connect-mongodb-session')(session);
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const sassMiddleware =require('node-sass-middleware');
const flash=require('connect-flash');
const customMware =require('./config/middleware');
// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'expanded',
    prefix: '/css'

}));



app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(expressLayouts);
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'codeal',
    secret: 'blahsomething',
    saveUninitialized:false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    },
    store: new MongoStore(
        {
            mongoUrl: mongoose.connection._connectionString,
      mongoOptions: {}
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);


app.use('/', require('./routes'))

app.listen(port, function(err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`The server is running on ${port}`);

});