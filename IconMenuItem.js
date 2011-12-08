define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"./iconUtils",
	"./_ItemBase"
], function(declare, lang, domClass, domConstruct, iconUtils, ItemBase){
	// module:
	//		dojox/mobile/IconMenuItem
	// summary:
	//		An item of IconMenu.

	return declare("dojox.mobile.IconMenuItem", ItemBase, { 
		selected: false,
		selColor: "mblIconMenuItemSel",
		closeOnAction: false,

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "li",

		baseClass: "mblIconMenuItem",

		buildRendering: function(){
			this.domNode = this.srcNodeRef || domConstruct.create(this.tag);
			this.inherited(arguments);
			if(this.selected){
				domClass.add(this.domNode, this.selColor);
			}

			if(this.srcNodeRef){
				if(!this.label){
					this.label = lang.trim(this.srcNodeRef.innerHTML);
				}
				this.srcNodeRef.innerHTML = "";
			}

			var a = this.anchorNode = this.containerNode = domConstruct.create("a", {
				className: "mblIconMenuItemAnchor",
				href: "javascript:void(0)"
			});
			var tbl = domConstruct.create("table", {
				className: "mblIconMenuItemTable"
			}, a);
			var cell = tbl.insertRow(-1).insertCell(-1);
			this.iconNode = this.iconParentNode = domConstruct.create("div", {
				className: "mblIconMenuItemIcon"
			}, cell);
			this.labelNode = domConstruct.create("div", {
				className: "mblIconMenuItemLabel"
			}, cell);
			this.domNode.appendChild(a);
		},

		postCreate: function(){
			this._clickHandle = this.connect(this.domNode, "onclick", "_onClick");
		},

		startup: function(){
			if(this._started){ return; }
			this.inheritParams();
			this.set("icon", this.icon);
			this.inherited(arguments);
		},

		select: function(){
			domClass.toggle(this.domNode, this.selColor, true);
			this.selected = true;
		},
	
		deselect: function(){
			domClass.toggle(this.domNode, this.selColor, false);
			this.selected = false;
		},
	
		_onClick: function(e){
			if(this.closeOnAction){
				var p = this.getParent(); // maybe SimpleDialog
				if(p && p.hide){
					p.hide();
				}
			}
			this.setTransitionPos(e);
			this.defaultClickAction();
		}
	});
});
