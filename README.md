## site-template

Nodejs site using express.js mongodb and jsonwebtoken for authentication

Dependecies:

- node js
- npm
- mongodb

Installation:

Clone the repo and run:

```
cd site-template
npm intall
npm run build
npm start

```

Optional:
This template use a self sign certificate for localhost, only for test purposes.

Run the script criaCert.sh (linux machines) in certificate folder, to create a self sign certificate for localhost.

Before run the script open the criaCert.sh on text editor to edit CA variables.

After runing the script folow the instructions to install the CA cert in your Browser

 :warning: Remember... use this only for development and test purposes.

Then edit the file config.js and change de boolean variable 'useHttps' to true.
