# shib-saml-tufts

### 1. sudo su - pspa
### 2. install `nvm` globally (wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash)
### 3. `nano ~/.bashrc`
### 4. copy/paste the below into the file and save
```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```
### 5. `nvm install v8.6.0`
### 6. `git clone git@gitlab.it.tufts.edu:ashilm01/shib-saml-tufts.git`
### 7. `cd shib-saml-tufts/web`
### 8. `npm i`
### 9. (will have to generate certs/keys for new env)
### 10. generate meta data by navigating to https://sisweb-dev-03.uit.tufts.edu:7000/metadata
### 11. install pm2 globally `npm install pm2 -g`
### 11. start server: `pm2 start npm -- run start:staging`


