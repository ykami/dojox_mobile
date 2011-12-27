define([
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"./_ItemBase",
	"./Badge",
	"./TransitionEvent",
	"./iconUtils",
	"./lazyLoadUtils"
], function(connect, declare, event, lang, has, win, domClass, domConstruct, domGeometry, domStyle, ItemBase, Badge, TransitionEvent, iconUtils, lazyLoadUtils){

/*=====
	var ItemBase = dojox.mobile._ItemBase;
=====*/

	// module:
	//		dojox/mobile/IconItem
	// summary:
	//		An icon item widget.

	return declare("dojox.mobile.IconItem", ItemBase, {
		// summary:
		//		An icon item widget.
		// description:
		//		IconItem represents an item that has an application component
		//		and its icon image. You can tap the icon to open the
		//		corresponding application component. You can also use the icon
		//		to move to a different view by specifying either of the moveTo,
		//		href or url parameters.

		// lazy: String
		//		If true, the content of the item, which includes dojo markup, is
		//		instantiated lazily. That is, only when the icon is opened by
		//		the user, the required modules are loaded and dojo widgets are
		//		instantiated.
		lazy: false,

		// requires: String
		//		Comma-separated required module names to be loaded. All the
		//		modules specified with dojoType and their depending modules are
		//		automatically loaded by the IconItem. If you need other extra
		//		modules to be loaded, use this parameter. If lazy is true, the
		//		specified required modules are loaded when the user opens the
		//		icon for the first time.
		requires: "",

		// timeout: String
		//		Duration of highlight in seconds.
		timeout: 10,
		
		// TODO:1.8 Btn -> Button
		// closeBtnClass: String
		//		A class name of a DOM button to be used as a close button.
		closeBtnClass: "mblDomButtonBlueMinus",

		// closeBtnProp: String
		//		Properties for the close button.
		closeBtnProp: null,

		// content: String
		//		An html fragment to embed.
		content: "",

		badge: "", /* 1.8 */
		badgeClass: "mblDomButtonRedBadge", /* 1.8 */
		
		deletable: true, /* 1.8 */
		deleteIcon: "", /* 1.8 */

		baseClass: "mblIconItem",
		tag: "li",

		destroy: function(){ /* 1.8 */
			if(this.badgeObj){
				delete this.badgeObj;
			}
			this.inherited(arguments);
		},

		buildRendering: function(){
			this.domNode = this.srcNodeRef || domConstruct.create(this.tag);

			if(this.srcNodeRef){
				// reparent
				this._tmpNode = domConstruct.create("div");
				for(var i = 0, len = this.srcNodeRef.childNodes.length; i < len; i++){
					this._tmpNode.appendChild(this.srcNodeRef.firstChild);
				}
			}

			this.iconDivNode = domConstruct.create("div", {className:"mblIconArea"}, this.domNode);
			this.iconParentNode = domConstruct.create("div", {className:"mblIconAreaInner"}, this.iconDivNode);
			this.labelNode = domConstruct.create("span", {className:"mblIconAreaTitle"}, this.iconDivNode);

			this.inherited(arguments);
		},

		startup: function(){
			if(this._started){ return; }

			if(!this._isOnLine){
				this.inheritParams();
				this.set("icon", this.icon);
			}
			var p = this.getParent();
			if(!this.icon && p.defaultIcon){
				this.set("icon", p.defaultIcon);
			}

			require([p.iconItemPaneClass], lang.hitch(this, function(module){
				var w = this.paneWidget = new module();
				this.containerNode = w.containerNode;
				if(this._tmpNode){
					// reparent
					for(var i = 0, len = this._tmpNode.childNodes.length; i < len; i++){
						w.containerNode.appendChild(this._tmpNode.firstChild);
					}
					this._tmpNode = null;
				}
				p.paneContainerWidget.addChild(w, this.getIndexInParent());
				w.set("label", this.label);
				this._clickCloseHandle = this.connect(w.closeIconNode, "onclick", "_closeIconClicked");
			}));

			this._dragstartHandle = this.connect(this.domNode, "ondragstart", event.stop);
			this._clickHandle = this.connect(this.iconNode, "onclick", "_onClick");
		},

		highlight: function(/*Number?*/timeout){ /* 1.8 */
			// summary:
			//		Shakes the icon 10 seconds.
			domClass.add(this.iconDivNode, "mblVibrate");
			timeout = (timeout !== undefined) ? timeout : this.timeout; /* 1.8 */
			if(timeout > 0){ /* 1.8 */
				var _this = this;
				setTimeout(function(){
					_this.unhighlight();
				}, timeout*1000); /* 1.8 */
			}
		},

		unhighlight: function(){
			// summary:
			//		Stops shaking the icon.
			domClass.remove(this.iconDivNode, "mblVibrate");
		},

		isOpen: function(e){
			// summary:
			//		Returns true if the icon is open.
			return this.paneWidget.isOpen();
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(e){
				if(this.onClick(e) === false){ return; } // user's click action
				this._press();
				this.setTransitionPos(e);
				setTimeout(lang.hitch(this, function(d){ this._onClick(); }), 0);
				return;
			}

			if (this.href && this.hrefTarget) {
				win.global.open(this.href, this.hrefTarget || "_blank");
				this._release();
				return;
			}

			var transOpts;
			if(this.moveTo || this.href || this.url || this.scene){
				transOpts = {moveTo: this.moveTo, href: this.href, url: this.url, scene: this.scene, transitionDir: this.transitionDir, transition: this.transition};
			}else if(this.transitionOptions){
				transOpts = this.transitionOptions;
			}
			if(transOpts){
				setTimeout(lang.hitch(this, function(d){
					this._release();
				}), 1500);
			}else{
				return this.open(e);
			}

			if(transOpts){
				return new TransitionEvent(this.domNode,transOpts,e).dispatch();
			}
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		_closeIconClicked: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(e){
				if(this.closeIconClicked(e) === false){ return; } // user's click action
				setTimeout(lang.hitch(this, function(d){ this._closeIconClicked(); }), 0);
				return;
			}
			this.close();
		},

		closeIconClicked: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		open: function(e){
			// summary:
			//		Opens the icon content, or makes a transition.
			var parent = this.getParent(); // IconContainer
			if(this.transition === "below"){
				if(parent.single){
					parent.closeAll();
				}
				this._press();
				this._open_1();
			}else{
				parent._opening = this;
				if(parent.single){
					this.paneWidget.closeHeaderNode.style.display = "none";
					parent.closeAll();
					parent.appView._heading.set("label", this.label);
				}
				var transOpts = this.transitionOptions || {transition: this.transition, transitionDir: this.transitionDir, moveTo: parent.id + "_mblApplView"};		
				new TransitionEvent(this.domNode, transOpts, e).dispatch();
			}
		},

		_open_1: function(){
			this.paneWidget.show();
			this.unhighlight();
			if(this.lazy){ /* 1.8 */
				lazyLoadUtils.instantiateLazyWidgets(this.containerNode, this.requires);
				this.lazy = false;
			}
			this.paneWidget.scrollIntoView();
			this.onOpen();
		},

		close: function(/*Boolean?*/noAnimation){
			// summary:
			//		Closes the icon content.
			this._release();
			if(!this.isOpen()){ return; }
			if(has("webkit") && !noAnimation){ /* 1.8 */
				var contentNode = this.paneWidget.domNode;
				if(this.getParent().transition == "below"){
					domClass.add(contentNode, "mblCloseContent mblShrink");
					var nodePos = domGeometry.position(contentNode, true);
					var targetPos = domGeometry.position(this.domNode, true);
					var origin = (targetPos.x + targetPos.w/2 - nodePos.x) + "px " + (targetPos.y + targetPos.h/2 - nodePos.y) + "px";
					domStyle.set(contentNode, { webkitTransformOrigin:origin });
				}else{
					domClass.add(contentNode, "mblCloseContent mblShrink0");
				}
			}else{
				this.paneWidget.hide();
			}
			this.onClose();
		},

		onOpen: function(){
			// summary:
			//		Stub method to allow the application to connect to.
		},

		onClose: function(){
			// summary:
			//		Stub method to allow the application to connect to.
		},

		_press: function(){
			domStyle.set(this.iconNode, "opacity", this.getParent().pressedIconOpacity);
		},

		_release: function(){
			domStyle.set(this.iconNode, "opacity", 1);
		},

		_setLabelAttr: function(/*String*/text){
			this.label = text;
			var s = this._cv ? this._cv(text) : text;
			this.labelNode.innerHTML = s;
			if(this.paneWidget){
				this.paneWidget.set("label", text);
			}
		},

		_getBadgeAttr: function(){ /* 1.8 */
			return this.badgeObj ? this.badgeObj.getValue() : null;
		},

		_setBadgeAttr: function(/*String*/value){ /* 1.8 */
			if(!this.badgeObj){
				this.badgeObj = new Badge({fontSize:14, className:this.badgeClass});
				domStyle.set(this.badgeObj.domNode, {
					position: "absolute",
					top: "-2px",
					right: "2px"
				});
			}
			this.badgeObj.setValue(value);
			if(value){
				this.iconDivNode.appendChild(this.badgeObj.domNode);
			}else{
				this.iconDivNode.removeChild(this.badgeObj.domNode);
			}
		},
		
		_setDeleteIconAttr: function(icon){
			if(!this.getParent()){ return; } // icon may be invalid because inheritParams is not called yet
			
			this._set("deleteIcon", icon);			
			icon = this.deletable ? icon : "";
			this.deleteIconNode = iconUtils.setIcon(icon, this.deleteIconPos, this.deleteIconNode, 
					this.deleteIconTitle || this.alt, this.iconDivNode);
			if(this.deleteIconNode){
				domClass.add(this.deleteIconNode, "mblIconItemDeleteIcon");
			}
		},
		
		_setContentAttr: function(/*String|DomNode*/data){
			var root;
			if(!this.paneWidget){
				if(!this._tmpNode){
					this._tmpNode = domConstruct.create("div");
				}
				root = this._tmpNode;
			}else{
				root = this.paneWidget.containerNode;
			}

			if(typeof data === "object"){
				domConstruct.empty(root);
				root.appendChild(data);
			}else{
				root.innerHTML = data;
			}
		}
	});
});
