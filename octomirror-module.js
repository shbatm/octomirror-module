/* global Module */

/* Magic Mirror
 * Module: OctoMirror-Module
 *
 * By Kieran Ramnarine
 * MIT Licensed.
 */

Module.register("octomirror-module", {
	defaults: {
		text: "Octoprint Module!"
	},
	
	//Override dom generator.
	getDom: function() {
		var wrapper = documents.createElement("IFRAME");
		iframe.src = this.config.url;
		return wrapper;
	},
	getHeader: function() {
		return 'Octoprint!';
	}
});
