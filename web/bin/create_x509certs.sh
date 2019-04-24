#!/usr/bin/env bash

openssl req -x509 -newkey rsa:4096 -keyout certpkey.pem -out cert.pem -nodes -days 900