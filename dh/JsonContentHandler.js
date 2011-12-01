define([
	"dojo/_base/kernel",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct"
], function(dojo, array, declare, lang, domConstruct){

	return declare("dojox.mobile.dh.JsonContentHandler", null, {

		parse: function(/*String*/ text, /*DomNode*/ target, /*DomNode*/ refNode){
			var view, container = domConstruct.create("DIV");
			target.insertBefore(container, refNode);
			this._ws = [];
			view = this._instantiate(eval('('+text+')'), container);
			view.style.visibility = "hidden";
			array.forEach(this._ws, function(w){
				if(w && !w._started && w.startup){
					w.startup();
				}
			});
			this._ws = null;
			return view.id;
		},

		_instantiate: function(/*Object*/obj, /*DomNode*/node, /*Widget*/parent){
			// summary:
			//		Given the evaluated json data, does the same thing as what
			//		the parser does.
			var widget;
			for(var key in obj){
				if(key.charAt(0) == "@"){ continue; }
				var cls = lang.getObject(key);
				if(!cls){ continue; }
				var params = {};
				var proto = cls.prototype;
				var objs = lang.isArray(obj[key]) ? obj[key] : [obj[key]];
				for(var i = 0; i < objs.length; i++){
					for(var prop in objs[i]){
						if(prop.charAt(0) == "@"){
							var val = objs[i][prop];
							prop = prop.substring(1);
							if(typeof proto[prop] == "string"){
								params[prop] = val;
							}else if(typeof proto[prop] == "number"){
								params[prop] = val - 0;
							}else if(typeof proto[prop] == "boolean"){
							params[prop] = (val != "false");
							}else if(typeof proto[prop] == "object"){
								params[prop] = eval("(" + val + ")");
							}
						}
					}
					widget = new cls(params, node);
					if(node){ // to call View's startup()
						this._ws.push(widget);
					}
					if(parent && parent.addChild){
						parent.addChild(widget);
					}
					this._instantiate(objs[i], null, widget);
				}
			}
			return widget && widget.domNode;
		}
	});
});
