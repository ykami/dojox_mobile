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
		selColor: "mblIconMenuItemSel",
		closeOnAction: false,

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "li",

		baseClass: "mblIconMenuItem",

		_selStartMethod: "touch",
		_selEndMethod: "touch",

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

		startup: function(){
			if(this._started){ return; }

			this._clickHandle = this.connect(this.domNode, "onclick", "_onClick");

			this.inherited(arguments);
			if(!this._isOnLine){
				this.set("icon", this.icon); // retry applying the attribute
			}
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(this.onClick(e) === false){ return; } // user's click action
			if(this.closeOnAction){
				var p = this.getParent(); // maybe SimpleDialog
				if(p && p.hide){
					p.hide();
				}
			}
			this.defaultClickAction(e);
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		_setSelectedAttr: function(/*Boolean*/selected){
			// summary:
			//		Makes this widget in the selected or unselected state.
			this.inherited(arguments);
			domClass.toggle(this.domNode, this.selColor, selected);
		}
	});
});
