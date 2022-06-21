#!/bin/bash
cd /home/ubuntu/tom-backend
sudo pm2 kill
sudo pm2 start server.js --name "backend"
sudo service nginx restart