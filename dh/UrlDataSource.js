define([
	"dojo/_base/kernel",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/xhr",
	"dojo/dom-construct"
], function(dojo, array, declare, lang, xhr, domConstruct){

	return declare("dojox.mobile.dh.UrlDataSource", null, {
		text: "",

		_url: "",

		constructor: function(/*String*/ url){
			this._url = url;
		},

		getData: function(){
			var obj = xhr.get({
				url: this._url,
				handleAs: "text"
			});
			obj.addCallback(lang.hitch(this, function(response, ioArgs){
				this.text = response;
			}));
			obj.addErrback(function(error){
				console.log("Failed to load "+this._url+"\n"+(error.description||error));
			});
			return obj; // Deferred
		}
	});
});
