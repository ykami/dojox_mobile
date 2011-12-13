define([
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dijit/registry",	// registry.byNode
	"./iconUtils",
	"./_ItemBase",
	"./Badge" /* 1.8 */
], function(connect, declare, event, lang, win, domClass, domConstruct, domStyle, registry, iconUtils, ItemBase, Badge){

/*=====
	var ItemBase = dojox.mobile._ItemBase;
=====*/

	// module:
	//		dojox/mobile/TabBarButton
	// summary:
	//		A button widget that is placed in the TabBar widget.

	return declare("dojox.mobile.TabBarButton", ItemBase,{
		// summary:
		//		A button widget that is placed in the TabBar widget.
		// description:
		//		TabBarButton is a button that is placed in the TabBar widget. It
		//		is a subclass of dojox.mobile._ItemBase just like ListItem or
		//		IconItem. So, unlike Button, it has similar capability as
		//		ListItem or IconItem, such as icon support, transition, etc.

		// icon1: String
		//		A path for the unselected (typically dark) icon. If icon is not
		//		specified, the iconBase parameter of the parent widget is used.
		icon1: "",

		// icon2: String
		//		A path for the selected (typically highlight) icon. If icon is
		//		not specified, the iconBase parameter of the parent widget or
		//		icon1 is used.
		icon2: "",

		// iconPos1: String
		//		The position of an aggregated unselected (typically dark)
		//		icon. IconPos1 is comma separated values like
		//		top,left,width,height (ex. "0,0,29,29"). If iconPos1 is not
		//		specified, the iconPos parameter of the parent widget is used.
		iconPos1: "",

		// iconPos2: String
		//		The position of an aggregated selected (typically highlight)
		//		icon. IconPos2 is comma separated values like
		//		top,left,width,height (ex. "0,0,29,29"). If iconPos2 is not
		//		specified, the iconPos parameter of the parent widget or
		//		iconPos1 is used.
		iconPos2: "",

		// selected: Boolean
		//		If true, the button is in the selected status.
		selected: false,

		// transition: String
		//		A type of animated transition effect.
		transition: "none",

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "li",

		baseClass: "mblTabBarButton",

		/* internal properties */	
		selectOne: true,
		badge: "", /* 1.8 */
	
		destroy: function(){ /* 1.8 */
			if(this.badgeObj){
				delete this.badgeObj;
			}
			this.inherited(arguments);
		},

		inheritParams: function(){
			// summary:
			//		Overrides dojox.mobile._ItemBase.inheritParams().
			if(this.icon && !this.icon1){ this.icon1 = this.icon; }
			var parent = this.getParent();
			if(parent){
				if(!this.transition){ this.transition = parent.transition; }
				if(this.icon1 && parent.iconBase &&
					parent.iconBase.charAt(parent.iconBase.length - 1) === '/'){
					this.icon1 = parent.iconBase + this.icon1;
				}
				if(!this.icon1){ this.icon1 = parent.iconBase; }
				if(!this.iconPos1){ this.iconPos1 = parent.iconPos; }
				if(this.icon2 && parent.iconBase &&
					parent.iconBase.charAt(parent.iconBase.length - 1) === '/'){
					this.icon2 = parent.iconBase + this.icon2;
				}
				if(!this.icon2){ this.icon2 = parent.iconBase || this.icon1; }
				if(!this.iconPos2){ this.iconPos2 = parent.iconPos || this.iconPos1; }

				if(parent.closable){
					if(!this.icon1){
						this.icon1 = "mblDomButtonGrayCross";
					}
					if(!this.icon2){
						this.icon2 = "mblDomButtonGrayCross";
					}
					domClass.add(this.domNode, "mblTabBarButtonClosable");
				}
			}
		},

		buildRendering: function(){
			this.domNode = this.srcNodeRef || domConstruct.create(this.tag);

			if(this.srcNodeRef){
				if(!this.label){
					this.label = lang.trim(this.srcNodeRef.innerHTML);
				}
				this.srcNodeRef.innerHTML = "";
			}

			this.anchorNode = domConstruct.create("a", {className:"mblTabBarButtonAnchor"}, this.domNode);
			this.labelNode = this.box = domConstruct.create("div", {className:"mblTabBarButtonLabel"}, this.anchorNode);

			this._isOnLine = this.inheritParams();
			this.inherited(arguments);
		},
	
		startup: function(){
			if(this._started){ return; }

			if(!this._isOnLine){
				this.inheritParams();
				this.set({icon1:this.icon1, icon2:this.icon2});
			}

			this._dragstartHandle = this.connect(this.domNode, "ondragstart", event.stop);
			this._clickHandle = this.connect(this.anchorNode, "onclick", "_onClick");
			if(this.getParent().closable){
				this._clickCloseHandler = this.connect(this.iconDivNode, "onclick", "_onClick");
			}

			this.inherited(arguments);
		},
	
		select: function(){
			// summary:
			//		Makes this widget in the selected state.
			if(arguments[0]){ // deselect
				domClass.remove(this.domNode, "mblTabBarButtonSelected");
			}else{ // select
				domClass.add(this.domNode, "mblTabBarButtonSelected");
				for(var i = 0, c = this.domNode.parentNode.childNodes; i < c.length; i++){
					if(c[i].nodeType != 1){ continue; }
					var w = registry.byNode(c[i]); // sibling widget
					if(w && w != this){
						w.deselect();
					}
				}
			}
			this.selected = !arguments[0];
			if(this.iconNode1){
				this.iconNode1.style.visibility = this.selected ? "hidden" : "";
			}
			if(this.iconNode2){
				this.iconNode2.style.visibility = this.selected ? "" : "hidden";
			}
		},
		
		deselect: function(){
			// summary:
			//		Makes this widget in the deselected state.
			this.select(true);
		},
	
		onClose: function(e){
			connect.publish("/dojox/mobile/tabClose", [this]);
			return this.getParent().onCloseButtonClick(this);
		},
	
		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(this.onClick(e) === false){ return; } // user's click action
			if(e.currentTarget === this.iconDivNode){
				if(this.onClose()){
					this.destroy();
				}
			}else{
				this.defaultClickAction();
			}
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		_setIcon: function(icon, n, sel){
			if(!this.getParent()){ return; } // icon may be invalid because inheritParams is not called yet
			if(icon){ this._set("icon" + n, icon); }
			if(!this.iconDivNode){
				this.iconDivNode = domConstruct.create("div", {className:"mblTabBarButtonIconArea"}, this.anchorNode, "first");
				// mblTabBarButtonDiv -> mblTabBarButtonIconArea
			}
			if(!this["iconParentNode" + n]){
				this["iconParentNode" + n] = domConstruct.create("div", {className:"mblTabBarButtonIconParent mblTabBarButtonIconParent" + n}, this.iconDivNode);
				// mblTabBarButtonIcon -> mblTabBarButtonIconParent
			}
			this["iconNode" + n] = iconUtils.setIcon(icon, this["iconPos" + n],
				this["iconNode" + n], this.alt, this["iconParentNode" + n]);
			this["icon" + n] = icon;
			domClass.toggle(this.domNode, "mblTabBarButtonHasIcon", icon && icon !== "none");
		},
	
		_setIcon1Attr: function(icon){
			this._setIcon(icon, 1, this.selected);
		},
	
		_setIcon2Attr: function(icon){
			this._setIcon(icon, 2, !this.selected);
		},
	
		_getBadgeAttr: function(){ /* 1.8 */
			return this.badgeObj ? this.badgeObj.getValue() : null;
		},

		_setBadgeAttr: function(/*String*/value){ /* 1.8 */
			if(!this.badgeObj){
				this.badgeObj = new Badge({fontSize:11});
				domStyle.set(this.badgeObj.domNode, {
					position: "absolute",
					top: "0px",
					right: "0px"
				});
			}
			this.badgeObj.setValue(value);
			if(value){
				this.domNode.appendChild(this.badgeObj.domNode);
			}else{
				this.domNode.removeChild(this.badgeObj.domNode);
			}
		},

		_setSelectedAttr: function(/*Boolean*/sel){
			sel ? this.select() : this.deselect();
		}
	});
});
