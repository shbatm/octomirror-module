/* global Module */
/* jshint esversion: 6 */

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
        showStream: true,
        interactive: true, // Set to false to hide the file drop down and only show the stream.
        debugMode: false, // Set to true to log all messages from OctoPrint Socket
    },

    //Override dom generator.
    getDom: function() {
        var self = this;
        var wrapper = document.createElement("div");

        if (this.config.showStream) {
            var stream = document.createElement("img");
            stream.src = (this.config.streamUrl) ? this.config.streamUrl : this.config.url + ":8080/?action=stream";
            wrapper.appendChild(stream);
        }

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

        var infoWrapper = document.createElement("div");
        infoWrapper.className = "small";
        infoWrapper.innerHTML = `<span>Printer State: </span><span id="opStateIcon"></span> <span id="opState" class="title bright"> </span>
                <br />
                <span>File: </span><span id="opFile" class="title bright">N/A</span>
                <br />
                <span> Time Elapsed: </span><span id="opPrintTime" class="title bright">N/A</span>
                <span> | Time Remaining: </span><span id="opPrintTimeRemaining" class="title bright">N/A</span>
                <span> | Percent Complete: </span><span id="opPercent" class="title bright">N/A</span>
                `;

        
        wrapper.appendChild(infoWrapper);
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
    },

    initializeSocket: function() {
        var self = this;
        // Subscribe to live push updates from the server
        this.opClient.socket.connect();

        if (this.config.debugMode) {
            this.opClient.socket.onMessage("*", (message) => {
                // Reference: http://docs.octoprint.org/en/master/api/push.html#sec-api-push-datamodel-currentandhistory
                console.log("Octoprint", message);
            });
        }

        this.opClient.socket.onMessage("history", (message) => {
            this.updateData(message.data);
        });

        this.opClient.socket.onMessage("current", (message) => {
            this.updateData(message.data);
        });
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
    },

    updateData: function(data) {
        document.getElementById("opState").textContent = (data.state.text.startsWith("Offline: SerialException")) ? "Offline / Disconnected" : data.state.text;
        var icon = document.getElementById("opStateIcon");
        if (data.state.flags.printing) {
            icon.innerHTML = `<i class="fa fa-print" aria-hidden="true" style="color:green;"></i>`;
        } else if (data.state.flags.closedOrError) {
            icon.innerHTML = `<i class="fa fa-exclamation-triangle" aria-hidden="true" style="color:red;"></i>`;
        } else if (data.state.flags.paused) {
            icon.innerHTML = `<i class="fa fa-pause" aria-hidden="true" style="color:yellow;"></i>`;
        } else if (data.state.flags.error) {
            icon.innerHTML = `<i class="fa fa-exclamation-triangle" aria-hidden="true" style="color:red;"></i>`;
        } else if (data.state.flags.ready) {
            icon.innerHTML = `<i class="fa fa-check-circle" aria-hidden="true" style="color:green;"></i>`;
        } else if (data.state.flags.operational) {
            icon.innerHTML = `<i class="fa fa-check-circle" aria-hidden="true" style="color:green;"></i>`;
        }
        document.getElementById("opFile").textContent = (data.job.file.name) ? data.job.file.name : "N/A";
        document.getElementById("opPrintTime").textContent = (data.progress.printTime) ? data.progress.printTime.toHHMMSS() : "N/A";
        document.getElementById("opPrintTimeRemaining").textContent = (data.progress.printTimeLeft) ? data.progress.printTimeLeft.toHHMMSS() : "N/A";
        document.getElementById("opPercent").textContent = (data.progress.completion) ? Math.round(data.progress.completion) + "%" : "N/A";
    },

    notificationReceived: function(notification, payload, sender) {
        if (notification === 'DOM_OBJECTS_CREATED') {
            this.initializeSocket();
            this.scheduleUpdate(1);
        }
    }
});

Number.prototype.toHHMMSS = function() {
    var seconds = Math.floor(this),
        hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    var time = "";

    if (hours !== 0) {
        time = hours + ":";
    }
    if (minutes !== 0 || time !== "") {
        minutes = (minutes < 10 && time !== "") ? "0" + minutes : String(minutes);
        time += minutes + ":";
    }
    if (time === "") {
        time = seconds + "s";
    } else {
        time += (seconds < 10) ? "0" + seconds : String(seconds);
    }
    return time;
};