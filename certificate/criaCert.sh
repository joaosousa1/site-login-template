#!/bin/bash
#script to create self sign certificate for localhost. Only for test purposes

echo "lamePass" > passphrase
echo "lamePass" >> passphrase
#Use the same passpharse in https.createServer options on file server.js

rm *.crt
rm *.csr
rm *.key
rm *.srl

#variables
CN="Test"
CNL="localhost"
CA="AAAA-Test"
OU="Tux"
C="PT"
ST="LISBOA"
L="LISBOA"

echo

echo "Create CA certificate..."
openssl genrsa -des3 -passout file:passphrase -out ca.key 4096
openssl req -new -x509 -days 720 -passin file:passphrase -key ca.key -passout file:passphrase -out ca.crt -subj "/CN=$CN CA/O=$CA/OU=$OU/C=$C/ST=$ST/L=$L"
echo "Done."

echo

echo "Creating Server certificate..."
openssl genrsa -des3 -passout file:passphrase -out server.key 1024
openssl req -new -passin file:passphrase -key server.key -passout file:passphrase -out server.csr -subj "/CN=$CNL/O=$CA/OU=$OU/C=$C/ST=$ST/L=$L"
openssl x509 -req -in server.csr -out server.crt -passin file:passphrase -CA ca.crt -CAkey ca.key -CAcreateserial -days 720
echo "Done."

echo

echo "----- Don't forget to open your browser and install your ca.crt certificates -----"

echo

#1    Create your own authority (i.e, become a CA)
#2    Create a certificate signing request (CSR) for the server
#3    Sign the server's CSR with your CA key
#4    Install the server certificate on the server
#5    Install the CA certificate on the client

#example expressjs

#	https.createServer({
#	  key: fs.readFileSync(path.join(__dirname, 'selfSigned', 'server.key')),
#	  cert: fs.readFileSync(path.join(__dirname, 'selfSigned', 'server.crt')),
#	  passphrase: 'lamePass'
#	}, app).listen(port);
