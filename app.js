var express        = require('express'),
	expressHbs     = require('express-handlebars'),
	config         = require('./config'),
	app 		   = express(),
	bodyParser     = require('body-parser'),
	methodOverride = require('method-override'),
  errorHandler   = require('errorhandler'),
  cookieParser   = require('cookie-parser'),
  session        = require('express-session'),
  multiLogger    = require('./services/logger.service'),
  passportAuth = require('./authenticate');
  routes         = require('./routes'),
  path 		   = require('path'),
    server = require('http').createServer(app);
var moment = require('moment');
var moment= require('moment-timezone');

var multer  = require('multer');


// allow CORS
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');

    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'layout.hbs'}));

app.use(bodyParser.urlencoded({'extended':'true', 'limit': '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

/**
 * Express configuration.
 */

app.set('port', config.server.internalPort);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app
  .use(bodyParser())
  .use(express.static(path.join(__dirname, 'public')))
  .use(cookieParser())
  .use(session({secret: config.session.secret
    , resave:false
    , saveUninitialized:false}))
  .use(passportAuth.initialize())
  .use(passportAuth.session())
  .use(routes.router)
  .use(function (req, res) {
    res.status(404).render('404', {title: 'Not Found :('});
  });
app.use(require('less-middleware')({
    src: __dirname + '/public'
}));
app.use(express.static(path.join(__dirname, 'public')));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers
app.use(function (err, req, res, next) {
    var code = err.status || 500;
    return res.status(code).json({
        error: true,
        code: code,
        data: {message: err.message}
    });
});

var servicesPromises = [];

Promise.all(servicesPromises).then(function() {
  multiLogger.info('app.js','All services initialized');
  server.listen(app.get('port'), function () {
    multiLogger.info('app.js','Express server listening on port ' + app.get('port'));
  });
})
.catch(function(error){
  multiLogger.error('app.js', 'failed to start Feast API:' + JSON.stringify(error));
});
