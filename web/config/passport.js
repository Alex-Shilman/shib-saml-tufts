import fs from 'fs';
import path from 'path';
import { Strategy as SamlStrategy } from 'passport-saml';

const privateCertPath = path.join(__dirname, '..', 'bin', 'ca', 'server-key.pem');

class Saml_Strategy {
    create(passport, { passport: { saml } }) {
       const privateKey = fs.readFileSync(privateCertPath, 'UTF-8');
        const {
            entryPoint,
            issuer,
            path: callbackPath,
            cert,
        } = saml;

        const saml_strategy = new SamlStrategy(
            {
                callbackUrl: `${issuer}${callbackPath}`,
                identifierFormat: '',
                forceAuthn: true,
                decryptionPvk: privateKey,
                privateCert: privateKey,
                entryPoint,
                issuer,
                cert,
            },
            (profile, done) => {
                console.log(profile);
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