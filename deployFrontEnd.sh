#!/bin/bash
set -e # Any subsequent(*) commands which fail will cause the shell script to exit immediately

cd react-app/
sed -i -e 's/127.0.0.1:5000/chapp.ml/g' ./src/App.js
npm run build

tar czf chapp.tar.gz build
scp -r -i ~/.ssh/aws-kp-2019-02-15.pem chapp.tar.gz ubuntu@3.95.113.35:~
rm chapp.tar.gz
mv src/App.js-e src/App.js

ssh -i ~/.ssh/aws-kp-2019-02-15.pem ubuntu@3.95.113.35 << 'ENDSSH'
rm -rf chapp/public
tar xf chapp.tar.gz -C chapp
mv chapp/build chapp/public
rm chapp.tar.gz
ENDSSH