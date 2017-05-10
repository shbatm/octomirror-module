# Octomirror Module
This is a module for a Magic Mirror device that will interact with an Octoprint Instance. 

The module will allow you to:
- View a live feed of the raspicam stream
- Start and stop prints
- View G-Code viewer
- Manually control the printer

Also this module include tasks for checking your code. For that you need install the developer dependencies.

```
cd MI_MODULE_PATH && npm install 
```

Run the grunt
```
./node_modules/grunt/bin/grunt
```

Includes configuration of code and style used in MagicMirror core. Also to test these things in travis, previously you need active your repository in Travis.


## Installation

`bash -c "$(curl -sL https://raw.githubusercontent.com/DongerZonie/octomirror-module/master/create_module.sh)"`

This creates a module example to start your developement.

If you have any suggest, please let me know [by an issue](https://github.com/DongerZonie/octomirror-module/issues/new).
