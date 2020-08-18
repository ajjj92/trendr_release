var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Promise = require("bluebird");

// define routers
var indexRouter = require('./routes/index')
var chartRouter = require('./routes/chart')


const app = express();

 // We use flash to send messages to templates
const flash = require('connect-flash');
app.use(flash());

// configure session
var expressSession = require('express-session');
// Encrypt session id
app.use(expressSession({secret: 'secretKeyS12'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Use the routes
app.use('/', indexRouter);
app.use('/chart',chartRouter);

module.exports = app;
