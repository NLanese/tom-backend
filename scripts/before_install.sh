#!/bin/bash

#download node and npm
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
apt-get install -y nodejs

#create our working directory if it doesnt exist
DIR="/home/ubuntu/tom-admin-portal"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  mkdir ${DIR}
fi