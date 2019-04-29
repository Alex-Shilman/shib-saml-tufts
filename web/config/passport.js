import fs from 'fs';
import path from 'path';
import { Strategy as SamlStrategy } from 'passport-saml';


// const privateCertPath = path.join(__dirname, '..', 'bin', 'certpkey.pem')
const privateCertPath = path.join(__dirname, '..', 'bin', 'ca', 'server-key.pem');

class Saml_Strategy {
    create(passport, { passport: { saml } }) {
       const privateKey = fs.readFileSync(privateCertPath, 'UTF-8');
        console.log('provateCert', privateKey);
        const {
            path,
            entryPoint,
            issuer,
            cert,
        } = saml;

        const saml_strategy = new SamlStrategy(
            {
                callbackUrl: 'https://shib.uit.tufts.edu:7000/login/callback',
                identifierFormat: '',
                decryptionPvk: privateKey,
                privateCert: privateKey,
                entryPoint,
                issuer,
                cert,
            },
            (profile, done) => {
                console.log('here we are done...', profile);
                return done(null, {
                    id: profile.uid,
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