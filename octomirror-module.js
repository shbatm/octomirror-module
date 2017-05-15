/* global Module */

/* Magic Mirror
 * Module: OctoMirror-Module
 *
 * By Kieran Ramnarine
 * MIT Licensed.
 */

Module.register("octomirror-module", {
	defaults: {
		
	},
	
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
		var data = null;
		var request = new XMLHttpRequest();
		/*request.addEventListener("readystatechange", function() {
			if(this.readyState === 4) {
				console.log(this.responseText);
			}
		});*/
		request.onreadystatechange = function () {
			/*if(this.readyState == 4  && this.status == 200) {
				return this.responseText;
			}*/
		}
		request.open("GET", this.config.url + "/api/files?recursive=true");
		request.setRequestHeader("x-api-key", this.config.api_key);
		request.send(data);
		return this.responseText;
	},
	
	start: function() {
		console.log(this.updateFiles());
	},
});
