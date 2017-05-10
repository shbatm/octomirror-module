/* global Module */

/* Magic Mirror
 * Module: OctoMirror-Module
 *
 * By Kieran Ramnarine
 * MIT Licensed.
 */

Module.register("octomirror-module", {
	defaults: {
		
		height:"100%",
		width:"300px"
	},
	
	//Override dom generator.
	getDom: function() {
		var wrapper = documents.createElement("IFRAME");		
		iframe.style = "border:0"
		iframe.width = this.config.width;
		iframe.height = this.config.height;
		iframe.src = this.config.url;
		return wrapper;
	},
	getHeader: function() {
		return 'Octoprint!';
	}
});
