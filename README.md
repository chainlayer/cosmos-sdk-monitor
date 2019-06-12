## Cosmos SDK Monitor

This is a simple script to log information to a logfile (/var/log/monitoring.log by default). It modifies rsyslog to log to a new file. 

It works by opening a websocket to localhost (a cosmos-sdk node must be running on the server) and looks if the validator specified validated each block. If not it outputs it in the logfile. This logfile can then be picked up by Zabbix or some other tool.

## Using this code
Feel free to use this code for something else entirely, or use it as is. Drop us a note on info@chainlayer.io or find us on Telegram.

## Delegation
If you like what we've been doing please show your love by delegating something to us. Check our site for the latest info (www.chainlayer.io)
