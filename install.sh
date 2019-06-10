#!/bin/bash
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root"
   exit 1
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cp -r $DIR /root
cd /root/cosmos-sdk-monitor

# Logging to seperate file
apt -y install nodejs npm vim

npm install

clear
echo #################
echo press enter to edit the validator address in the js file
echo #################
read xx
vi index.js
cp 60-cosmos.conf /etc/rsyslog.d/60-cosmos.conf
echo 'module(load="imudp")' >> /etc/rsyslog.conf
echo 'input(type="imudp" port="514")'  >> /etc/rsyslog.conf

systemctl restart rsyslog

cp cosmos-sdk-monitor.service /etc/systemd/system
systemctl enable cosmos-sdk-monitor
systemctl start cosmos-sdk-monitor
