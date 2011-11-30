define([
	"dojo/_base/kernel",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/dom-construct"
], function(dojo, array, declare, domConstruct){

	var SuffixFileTypeMap = {
		map: {
			"html": "html",
			"json": "json"
		},

		add: function(/*String*/ key, /*String*/ contentType){
			this.map[key] = contentType;
		},

		getContentType: function(/*String*/ fileName){
			var fileType = (fileName || "").replace(/.*\./, "");
			return this.map[fileType];
		}
	};
	return SuffixFileTypeMap;
});
