define([
	"dojo/_base/declare",
	"dojo/dom-class",
	"dojo/dom-construct",
	"./iconUtils",
	"./_ItemBase"
], function(declare, domClass, domConstruct, iconUtils, ItemBase){
	// module:
	//		dojox/mobile/IconMenuItem
	// summary:
	//		TODOC

	return declare("dojox.mobile.IconMenuItem", ItemBase, { 
		selected: false,
		selColor: "mblIconMenuItemSel",
		closeOnAction: false,

		buildRendering: function(){
			this.domNode = this.srcNodeRef || domConstruct.create("li");
			this.domNode.className = "mblIconMenuItem";
			if(this.selected){
				domClass.add(this.domNode, this.selColor);
			}

			var a = this.anchorNode = this.containerNode = domConstruct.create("a", {
				className: "mblIconMenuItemAnchor",
				href: "javascript:void(0)"
			});
			var tbl = domConstruct.create("table", {
				className: "mblIconMenuItemTable"
			}, a);
			var cell = tbl.insertRow(-1).insertCell(-1);
			this.iconNode = domConstruct.create("div", {
				className: "mblIconMenuItemIcon"
			}, cell);
			this.labelNode = domConstruct.create("div", {
				className: "mblIconMenuItemLabel"
			}, cell);
//x			for(var i = 0, len = this.domNode.childNodes.length; i < len; i++){
//x				a.appendChild(this.domNode.firstChild); // reparent
//x			}
			this.domNode.appendChild(a);
		},

		postCreate: function(){
			this.connect(this.domNode, "onclick", "_onClick");
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
		},

		_setIconAttr: function(icon){
			if(!this.getParent()){ return; } // icon may be invalid because inheritParams is not called yet
			this.icon = icon;
			var a = this.containerNode;
			domConstruct.empty(this.iconNode);
			if(icon && icon !== "none"){
				iconUtils.createIcon(icon, this.iconPos, null, this.alt, this.iconNode);
				if(this.iconPos){
					domClass.add(this.iconNode.firstChild, "mblIconMenuItemSpriteIcon");
				}
				domClass.remove(a, "mblIconMenuItemAnchorNoIcon");
			}else{
				domClass.add(a, "mblIconMenuItemAnchorNoIcon");
			}
		},
	
		_setLabelAttr: function(/*String*/text){
			this.label = text;
			this.labelNode.innerHTML = this._cv ? this._cv(text) : text;
		}
	});
});
