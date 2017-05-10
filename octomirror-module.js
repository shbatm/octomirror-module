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
		wrapper.style = "border:0"
		wrapper.width = this.config.width;
		wrapper.height = this.config.height;
		wrapper.src = this.config.url;
		return wrapper;
	},
	getHeader: function() {
		return 'Octoprint!';
	}
});
