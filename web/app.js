import session from 'express-session';
import helmet from 'helmet';
import express from 'express';
import passport from 'passport';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import ssoRoutes from './routes/index';
import server_config from './config/server_config';
import Saml_Strategy from './config/passport';

const app = express();
const env = app.get('env');
const config = server_config[env];
const saml_strategy = Saml_Strategy.create(passport, config);

app.use(helmet());
app.disable('etag');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    key: config.session.key,
    secret: config.session.secret,
    cookie: config.session.cookie,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(ssoRoutes({
    config,
    passport,
    saml_strategy,
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: env === 'development' ? err : {}
    });
  });


export default app;
