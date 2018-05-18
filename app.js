var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);


var path = require('path');
var fm = require("formidable");
var fs = require("fs");

var dbUrl = 'mongodb://127.0.0.1:27017/test';
mongoose.connect(dbUrl,{ useMongoClient:true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error",console.error.bind(console,"mongodb connect error !"));
db.once('open',function(){
	console.log("Mongodb started!");
});

var app = express();
var routes = require('./routes/index');
app.set('views',path.join(__dirname,'node_modules'));


var app = express();
var routes = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use("/lib",express.static(path.join(__dirname, 'node_modules')));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended:false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'imooc',
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));

routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
