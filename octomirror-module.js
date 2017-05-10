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
		var wrapper = document.createElement("img");
		wrapper.src = "http://192.168.1.19:8080/?action=stream";
		return wrapper;
	},
	getHeader: function() {
		return 'Octoprint!';
	}
});
