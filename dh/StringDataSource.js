define([
	"dojo/_base/kernel",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/xhr",
	"dojo/dom-construct"
], function(dojo, array, declare, lang, xhr, domConstruct){

	return declare("dojox.mobile.dh.StringDataSource", null, {
		text: "",

		constructor: function(/*String*/ text){
			this.text = text;
		},

		getData: function(){
			return this.text;
		}
	});
});
