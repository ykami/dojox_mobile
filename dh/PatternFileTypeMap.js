define([
	"dojo/_base/kernel",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/dom-construct"
], function(dojo, array, declare, domConstruct){

	var PatternFileTypeMap = {
		map: {
			".*\.html": "html",
			".*\.json": "json"
		},

		add: function(/*String*/ key, /*String*/ contentType){
			this.map[key] = contentType;
		},

		getContentType: function(/*String*/ fileName){
			for(var key in this.map){
				if((new RegExp(key)).test(fileName)){
					return this.map[key];
				}
			}
			return null;
		}
	};
	return PatternFileTypeMap;
});
