define([
	"dojo/_base/kernel",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/dom-construct"
], function(dojo, array, declare, domConstruct){

	var ContentTypeMap = {
		map: {
			"html": "dojox/mobile/dh/HtmlContentHandler",
			"json": "dojox/mobile/dh/JsonContentHandler"
		},

		add: function(/*String*/ contentType, /*String*/ handlerClass){
			this.map[contentType] = handlerClass;
		},

		getHandlerClass: function(/*String*/ contentType){
			return this.map[contentType];
		}
	};
	return ContentTypeMap;
});
