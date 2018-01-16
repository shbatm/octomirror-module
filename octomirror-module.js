/* global Module */

/* Magic Mirror
 * Module: OctoMirror-Module
 *
 * By Kieran Ramnarine
 * MIT Licensed.
 */

Module.register("octomirror-module", {
    defaults: {
        updateInterval: 60 * 1000,
        retryDelay: 2500,
        initialLoadDelay: 2500,
        interactive: true, // Set to false to hide the file drop down and only show the stream.
    },

    //Override dom generator.
    getDom: function() {
        var self = this;
        var wrapper = document.createElement("div");
        var stream = document.createElement("img");
        stream.src = this.config.url + ":8080/?action=stream";

        if (this.config.interactive) {
            var fileMenu = document.createElement("div");
            var fileList = document.createElement("select");
            for (var f in this.files) {
                var option = document.createElement("option");
                option.setAttribute("value", this.files[f]);
                option.appendChild(document.createTextNode(this.files[f]));
                fileList.appendChild(option);
            }
            var printButton = document.createElement("button");
            printButton.appendChild(document.createTextNode("Send to Printer"));
            printButton.addEventListener("click", function() {
                self.sendPrint(fileList.value);
            });
            var fileUpload = document.createElement("div");
            var uploadFileInput = document.createElement("input");
            uploadFileInput.setAttribute("type", "file");
            var uploadButton = document.createElement("button");
            uploadButton.appendChild(document.createTextNode("Upload Files"));
            uploadButton.addEventListener("click", function() {
                self.uploadFile(uploadFileInput.value);
            });
            fileUpload.appendChild(uploadFileInput);
            fileUpload.appendChild(uploadButton);
            fileMenu.appendChild(fileList);
            fileMenu.appendChild(printButton);
            fileMenu.appendChild(fileUpload);
            wrapper.appendChild(fileMenu);
        }
        wrapper.appendChild(stream);
        wrapper.appendChild(document.createElement("br"));
        return wrapper;
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.files = [];
        this.loaded = false;
        this.scheduleUpdate(this.config.initialLoadDelay);
        this.updateTimer = null;

        this.opClient = new OctoPrintClient();
        this.opClient.options.baseurl = this.config.url;
        this.opClient.options.apikey = this.config.api_key;

        // Subscribe to live push updates from the server
        this.opClient.socket.connect();
        this.opClient.socket.onMessage("*", function(message) {
            // TODO: Display progress of current print job
            // Reference: http://docs.octoprint.org/en/master/api/push.html#sec-api-push-datamodel-currentandhistory
            console.log("Octoprint", message);
        });
    },

    getHeader: function() {
        return 'Octoprint!';
    },

    getScripts: function() {
        return [
            this.file('jquery.min.js'),
            this.file('lodash.min.js'),
            this.file('sockjs.min.js'),
            this.file('packed_client.js'),
        ];
    },

    processFiles: function(data) {
        this.files = [];
        for (var x in data.files) {
            this.files.push(data.files[x].name);
        }
        this.show(this.config.animationSpeed, { lockString: this.identifier });
        this.loaded = true;
        this.updateDom(this.config.animationSpeed);
    },

    scheduleUpdate: function(delay) {
        var nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        var self = this;
        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(function() {
            self.updateFiles();
        }, nextLoad);
    },

    updateFiles: function() {
        var self = this;

        this.opClient.files.list()
            .done(function(response) {
                console.log(response);
                self.processFiles(response);
            });
    },

    sendPrint: function(filename) {
        this.opClient.files.select("local", filename, true);
    },

    uploadFile: function(file) {
        var self = this;
        this.opClient.files.upload("local", file)
            .done(function(response) {
                self.updateFiles();
            });
    }
});