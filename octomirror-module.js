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
	},
	
	//Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		var stream = document.createElement("img");
		stream.src = this.config.url + ":8080/?action=stream";
		var fileMenu = document.createElement("div");
		var fileList = document.createElement("table");
		for (var f in this.files) {
			var file = this.files[f];
			var row = document.createElement("tr");
			fileList.appendChild(row);
			var fileCell = document.createElement("td");
			fileCell.className = file;
			fileCell.innerHTML = file;
			row.appendChild(fileCell);
			var buttonCell = document.createElement("td");
			var printButton = document.createElement("button");
			buttonCell.appendChild(printButton);
			var printButtonText = document.createTextNode("Print " + file.substring(0, file.length-6));
			row.appendChild(buttonCell);
			
		}
		var fileUpload = document.createElement("div");
		fileMenu.appendChild(fileList);
		fileMenu.appendChild(fileUpload);
		wrapper.appendChild(stream);
		wrapper.appendChild(document.createElement("br"));
		wrapper.appendChild(fileMenu);
		return wrapper;
		
	},
	
	getHeader: function() {
		return 'Octoprint!';
	},
	
	updateFiles: function() {
		var self = this;
		var retry = true;
		var fileRequest = new XMLHttpRequest();
		fileRequest.open("GET", this.config.url + "/api/files?recursive=true", true);
		fileRequest.setRequestHeader("x-api-key", this.config.api_key);
		fileRequest.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200){
				self.processFiles(JSON.parse(this.responseText));
			}
			if(retry){
				self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
			}
		}
		fileRequest.send();
		
	},
	
	processFiles: function(data) {
		this.files = [];
		for(var x in data.files){
			this.files.push(data.files[x].name);
		}
		console.log(this.files);
		this.show(this.config.animationSpeed, {lockString: this.identifier});
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
	
	start: function(){
		this.files = [];
		this.loaded = false;
		this.scheduleUpdate(this.config.initialLoadDelay);
		this.updateTimer = null;
	},
});
