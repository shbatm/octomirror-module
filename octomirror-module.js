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
		stream.src = this.config.url + ":8080/?action=stream";
		var files = document.createElement("div");
		var fileList = document.createElement("div");
		var fileUpload = document.createElement("div");
		fileList.
		files.appendChild(fileList);
		files.appendChild(fileUpload);
		wrapper.appendChild(stream);
		wrapper.appendChild(document.createElement("br"));
		wrapper.appendChild(files);
		return wrapper;
		
	},
	getHeader: function() {
		return 'Octoprint!';
	}
});
