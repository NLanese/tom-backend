#!/bin/bash
cd /home/ubuntu/tom-admin-portal
sudo npm i -g pm2@latest
sudo pm2 start server.js --name "backend"
sudo pm2 restart backend