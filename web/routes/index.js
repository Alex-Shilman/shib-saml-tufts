import express from 'express';
import fs from 'fs';
import { getPKey, getJwt } from "../utils"
const router = express.Router();

const ssoRoutes = ({config, passport, saml_strategy}) => {
    router.get('/login', (req, res, next) => {
            req.session.psSignonUrl = req.param('signonUrl');
            next();
        },
        passport.authenticate(config.passport.strategy,
            {
                successRedirect: '/',
                failureRedirect: '/login'
            })
    );

    router.post(config.passport.saml.path,
        passport.authenticate(config.passport.strategy,
            {
                failureRedirect: '/',
                failureFlash: true
            }),
        function (req, res) {
            res.redirect('/profile');
        }
    );

    router.get('/profile', async (req, res) => {
        if (req.isAuthenticated()) {
            const { user: { id }, cookies, session: { psSignonUrl: url } } = req;
            const BearerToken = await getJwt({ payload: { uid: id } });
            const payload = { id, BearerToken, url };
            console.log(payload);
            Object.keys(cookies).forEach(key => {
                res.cookie(key, '', {
                    expires: new Date(0),
                    domain:'.uit.tufts.edu',
                    path: '/'
                });
            });
            res.cookie('JWT', BearerToken, { domain: '.tufts.edu' });
            res.redirect(url);
        } else {
            res.redirect('/login');
        }
    });

    router.get('/logout', (req, res) => {
        req.logout();
        // TODO: invalidate session on IDP
        res.redirect('/');
    });

    router.get('/metadata', async (req, res) => {
        const decryptionCert = await getPKey(path.join(__dirname, 'bin', 'ca', 'server-crt.pem'));
        const metadata = saml_strategy.generateServiceProviderMetadata(decryptionCert, decryptionCert);

        fs.writeFile("./metadata.xml", metadata, function(err) {
            if(err) {
                console.log(err);
                return next(err);
            }
            console.log("The file was saved!");
            res.type('application/xml');
            res.send(metadata);
        });

    });

    return router;
}


export default ssoRoutes;
