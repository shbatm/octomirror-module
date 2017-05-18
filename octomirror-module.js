/* global Module */

/* Magic Mirror
 * Module: OctoMirror-Module
 *
 * By Kieran Ramnarine
 * MIT Licensed.
 */

Module.register("octomirror-module", {
	defaults: {
		updateInterval: 10 * 60 * 1000,
		retryDelay: 2500,
		initialLoadDelay: 0,
	},
	
	files: 0,
	
	//Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		var stream = document.createElement("img");
		var files = document.createElement("div");
		var fileList = document.createElement("div");
		var fileUpload = document.createElement("div");
		files.appendChild(fileList);
		files.appendChild(fileUpload);
		wrapper.appendChild(stream);
		wrapper.appendChild(document.createElement("br"));
		wrapper.appendChild(files);
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
		if(this.files != data.files.length){
			this.files = data.files.length;
			console.log(this.files);
		}
	},
	
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		setTimeout(function() {
			self.updateFiles();
		}, nextLoad);
	},
	
	start: function(){
		this.loaded = false;
		this.scheduleUpdate(this.config.initialLoadDelay);
	},
});
