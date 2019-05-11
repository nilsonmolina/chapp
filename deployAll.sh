#!/bin/bash
set -e # Any subsequent(*) commands which fail will cause the shell script to exit immediately

# CHECK IF ENV VARIABLES ARE SET
[ -z "$HOST_SERVER_IP" ] && echo "Need to set HOST_SERVER_IP" && exit 1;
[ -z "$HOST_SERVER_USER" ] && echo "Need to set HOST_SERVER_USER" && exit 1;
[ -z "$AWS_KEY_PATH" ] && echo "Need to set HOST_SERVER_USER" && exit 1;

cd react-app/
sed -i -e 's/127.0.0.1:5000/chapp.ml/g' ./src/App.js
npm run build
rm -rf ../server/public/
cp -r build/ ../server/public/
cd ../server

tar czf chapp.tar.gz server.js package.json package-lock.json ecosystem.config.js public models db
scp -r -i $AWS_KEY_PATH chapp.tar.gz $HOST_SERVER_USER@$HOST_SERVER_IP:~
rm chapp.tar.gz
mv ../react-app/src/App.js-e ../react-app/src/App.js

ssh -i $AWS_KEY_PATH $HOST_SERVER_USER@$HOST_SERVER_IP << 'ENDSSH'
pm2 delete all
rm -rf chapp
mkdir chapp
tar xf chapp.tar.gz -C chapp
rm chapp.tar.gz
cd chapp
mv db/.index.js db/index.js
npm install
mkdir logs
pm2 start
ENDSSH