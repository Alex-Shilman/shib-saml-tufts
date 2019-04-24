import fs from 'fs';
import path from 'path';
import { Strategy as SamlStrategy } from 'passport-saml';

const privateCertPath = path.join(__dirname, '..', 'bin', 'certpkey.pem')

class Saml_Strategy {
    create(passport, { passport: { saml } }) {

       const privateCert = fs.readFileSync(privateCertPath, 'UTF-8');
        console.log('provateCert', privateCert);
        const {
            path,
            entryPoint,
            issuer,
            cert,
        } = saml;

        const saml_strategy = new SamlStrategy(
            {
                callbackUrl: 'https://shib.uit.tufts.edu:7000/login/callback',
                entryPoint,
                issuer,
                privateCert,
                cert,
            },
            (profile, done) => {
                console.log('here we are done...', profile);
                return done(null, {
                    id: profile.uid,
                    email: profile.email,
                })
            }
        );

        passport.serializeUser((user,  done) => done(null, user));

        passport.deserializeUser((user,  done) => done(null, user));

        passport.use(saml_strategy);

        return saml_strategy;
    }
}

export default new Saml_Strategy();