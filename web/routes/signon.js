import axios from 'axios';
import https from 'https';
import { URL } from 'url';
import express from 'express';
import { getJwt, createCookie } from "../utils";

const router = express.Router();


// const url = 'https://sisweb-dev-02.uit.tufts.edu:10811/psc/padev92/EMPLOYEE/EMPL/s/WEBLIB_TFP_MOBI.ISCRIPT1.FieldFormula.IScript_tfpNMSignin?cmd=start';
// const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlZHVQZXJzb25QcmluY2lwYWxOYW1lIjoidHRlc3QwMSIsImVtYWlsIjoidHRlc3QwMUB0dWZ0cy5lZHUiLCJleHAiOjE1NTExMjUyNzksImlhdCI6MTU1MTEyNTI0OSwibmJmIjoxNTUxMTI1MjQ5LCJ0dWZ0c0VkdUF0YW1zRWxpZ2liaWxpdHkiOiJubyIsInVpZCI6InR0ZXN0MDEifQ.KyqOknzv_DxLBTbHavNjLPLmFhT7iiJQ2kpAMFIEb1c';

router.use('/signon', async (req, res, next) => {
    const { body: { url, uid }, cookies } = req;
    const BearerToken = await getJwt({ payload: { uid } });
    const Cookie = `${createCookie(cookies).join('; ')};`;
    const urlOptions = new URL(url);
    // const payload = { version: 'shibSSO.v1', jwt: BearerToken, url, uid, Cookie, myUrl: urlOptions };

    // res.cookie('JWT', BearerToken, { domain: '.uit.tufts.edu' });
    // res.redirect(302, url);

    axios({
        method: 'POST',
        url,
        withCredentials: true,
        headers: {
            "Authorization": "Bearer " + BearerToken,
        }
    }).then((response) => {
        console.log('done ==================> ', response);
        const payload = { version: 'shibSSO.v1', jwt: BearerToken, url, uid, Cookie, myUrl: urlOptions };

        res.set('set-cookie', response.headers['set-cookie']);
        res.json(payload);
    }).catch((error) => {
        console.log('error =================>', error);
    });

});

export default router;