import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import fs from 'fs';

export const getPKey = async pathToPKey => await promisify(fs.readFile)(pathToPKey, 'UTF-8');

export const getJwt = async ( { pKpath = './bin/jwtRS256.key', payload = {} }) => {
    const pKey = await getPKey(pKpath);
    const iat = Math.floor(Date.now() / 1000);
    const ttl = 5;
    const iss = 'auth0';
    return promisify(jwt.sign)({
        ...payload,
        iss,
        exp: iat + ttl,
        iat: iat - 100000,
        nbf: iat - 100000
    }, pKey, { algorithm: 'RS256' });
};