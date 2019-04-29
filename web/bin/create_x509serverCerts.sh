#!/usr/bin/env bash

# https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2
wget https://raw.githubusercontent.com/anders94/https-authorized-clients/master/keys/ca.cnf
openssl req -new -x509 -days 9999 -config ca.cnf -keyout ca-key.pem -out ca-crt.pem
openssl x509 -req -extfile server.cnf -days 999 -passin "pass:password" -in server-csr.pem -CA ca-crt.pem -CAkey ca-key.pem -CAcreateserial -out server-crt.pem