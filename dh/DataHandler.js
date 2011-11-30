define([
	"dojo/_base/kernel",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/dom-construct",
	"dojox/mobile/dh/ContentTypeMap"
], function(dojo, array, declare, lang, Deferred, domConstruct, ContentTypeMap){

	return declare("dojox.mobile.dh.DataHandler", null, {
		ds: null,
		target: null,
		refNode: null,

		constructor: function(/*DataSource*/ ds, /*DomNode*/ target, /*DomNode*/ refNode){
			this.ds = ds;
			this.target = target;
			this.refNode = refNode;
		},

		processData: function(/*String*/ contentType, /*Function*/ callback){
			var ch = ContentTypeMap.getHandlerClass(contentType);
			require([ch], lang.hitch(this, function(ContentHandler){
				Deferred.when(this.ds.getData(), lang.hitch(this, function(){
					var id = new ContentHandler().parse(this.ds.text, this.target, this.refNode);
					callback(id);
				}))
			}));
		}
	});
});
