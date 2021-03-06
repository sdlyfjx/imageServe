/**
 * Created by liuwensa on 2016/11/27.
 */

'use strict';

require('./globals');

const express      = require('express');
const log4js       = require('log4js');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');

/* eslint-disable */
fs.mkdirsSync(config.tmpDir);
fs.mkdirsSync(config.uploadDir);
fs.mkdirsSync(config.thumbnailDir);
/* eslint-enable */

const routes = require('./routes');

const app = express();

app.use(bodyParser.json({limit: '80mb'}));
app.use(bodyParser.urlencoded({limit: '80mb', parameterLimit: 100000, extended: true}));
app.use(cookieParser());

app.use(log4js.connectLogger(logger, config.log));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(config.uploadDir, {maxAge: 1000 * 60 * 60}));
app.use(express.static(config.thumbnailDir, {maxAge: 1000 * 60 * 60}));

// 设置跨域访问
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', ' 3.2.1');
  next();
});

app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err  = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error  : err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error  : {}
  });
});

app.listen(config.port, function () {
  logger.info('server listening on port ' + config.port);
});
