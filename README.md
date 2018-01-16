# Octomirror Module
This is a module for a Magic Mirror device that will interact with an Octoprint Instance. 

The module will allow you to:
- View a live feed of the raspicam stream
- Start and stop prints
- View G-Code viewer
- Manually control the printer

If you have any suggest, please let me know [by an issue](https://github.com/DongerZonie/octomirror-module/issues/new).

## Installation

````shell
cd ~/MagicMirror/modules
git clone https://github.com/shbatm/octomirror-module.git
cd octomirror-module
npm install
# A version of OctoPrint's JS Client Library is included by default, but it's
# recommended to replace it with your server's version.
# Replace 'http://octopi.local' with your OctoPrint's URL/IP
wget http://octopi.local/static/webassets/packed_client.js -O packed_client.js