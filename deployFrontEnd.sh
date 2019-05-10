#!/bin/bash
set -e # Any subsequent(*) commands which fail will cause the shell script to exit immediately

[ -z "$HOST_SERVER_IP" ] && echo "Need to set HOST_SERVER_IP" && exit 1;
[ -z "$HOST_SERVER_USER" ] && echo "Need to set HOST_SERVER_USER" && exit 1;
[ -z "$AWS_KEY_PATH" ] && echo "Need to set HOST_SERVER_USER" && exit 1;

cd react-app/
sed -i -e 's/127.0.0.1:5000/chapp.ml/g' ./src/App.js
npm run build

tar czf chapp.tar.gz build
scp -r -i $AWS_KEY_PATH chapp.tar.gz $HOST_SERVER_USER@$HOST_SERVER_IP:~
rm chapp.tar.gz
mv src/App.js-e src/App.js

ssh -i $AWS_KEY_PATH $HOST_SERVER_USER@$HOST_SERVER_IP << 'ENDSSH'
rm -rf chapp/public
tar xf chapp.tar.gz -C chapp
mv chapp/build chapp/public
rm chapp.tar.gz
ENDSSH