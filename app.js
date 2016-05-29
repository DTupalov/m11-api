var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const api = {
    auth     : require('./api/v1/authorize'),
    balance  : require('./api/v1/balance'),
    contracts: require('./api/v1/contracts'),
    profile  : require('./api/v1/profile'),
    periods  : require('./api/v1/periods'),
    transits : require('./api/v1/transits')
};

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/account/authorize', api.auth);
app.use('/api/v1/account/balance', api.balance);
app.use('/api/v1/account/contracts', api.contracts);
app.use('/api/v1/account/profile', api.profile);
app.use('/api/v1/account/periods', api.periods);
app.use('/api/v1/transits/search', api.transits);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error  : err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error  : {}
    });
});

module.exports = app;
