#!/bin/bash

set -e # exit on error

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -y
apt-get install -y nodejs npm
ln -s /usr/bin/nodejs /usr/local/bin/node

cd ~ubuntu

su -c 'git clone https://github.com/gertvv/ictrp-search' ubuntu

cd ictrp-search

su -c 'npm install' ubuntu
su -c 'npm run build' ubuntu
su -c 'npm run server 80'
