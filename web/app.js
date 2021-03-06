import session from 'express-session';
import helmet from 'helmet';
import express from 'express';
import passport from 'passport';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routes from './routes/index';
import axios from 'axios';
import signon from './routes/signon';
import server_config from './config/server_config';
import Saml_Strategy from './config/passport';
import { getPKey, getJwt } from "./utils";
import fs from 'fs';
import favicon from 'serve-favicon';

const app = express();
const env = process.env.NODE_ENV || 'development';
const config = server_config[env];
const saml_strategy = Saml_Strategy.create(passport, config);
// passport_config(passport, config);

// console.log('init app - config ->', config);
app.use(helmet());
app.disable('etag');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('env', env);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    key: config.session.key,
    secret: config.session.secret,
    cookie: config.session.cookie,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// app.use('/', routes);
app.use('/api', signon);
app.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.json({ user: null });
    }
});

app.get('/login',
    (req, res, next) => {
        req.session.psSignonUrl = req.param('signonUrl');
        next();
    },
    passport.authenticate(config.passport.strategy,
        {
            successRedirect: '/',
            failureRedirect: '/login'
        })
);

app.post(config.passport.saml.path,
    passport.authenticate(config.passport.strategy,
        {
            failureRedirect: '/',
            failureFlash: true
        }),
    function (req, res) {
        res.redirect('/profile');
    }
);

app.get('/profile', async (req, res) => {
    if (req.isAuthenticated()) {
        const { user: { id }, cookies, session: { psSignonUrl: url } } = req;
        const BearerToken = await getJwt({ payload: { uid: id } });
        const payload = { id, BearerToken, url };
        console.log(payload);
        Object.keys(cookies).forEach(key => {
            res.cookie(key, '', { expires: new Date(0), domain:'.uit.tufts.edu', path: '/' })
        });
        res.cookie('JWT', BearerToken, { domain: '.tufts.edu' });
        res.redirect(url);
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.logout();
    // TODO: invalidate session on IDP
    res.redirect('/');
});

app.get('/metadata', async (req, res) => {
    const decryptionCert = await getPKey(path.join(__dirname, 'bin', 'ca', 'server-crt.pem'));
    const metadata = saml_strategy.generateServiceProviderMetadata(decryptionCert, decryptionCert);

    fs.writeFile("./metadata.xml", metadata, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
        res.type('application/xml');
        res.send(metadata);
    });

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
