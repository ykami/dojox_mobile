define([
	"dojo/_base/kernel",
	"dojo/_base/array",
	"dojo/_base/connect", /* 1.8 */
	"dojo/_base/declare",
	"dojo/_base/event", /* 1.8 */
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/_base/window",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry", /* 1.8 */
	"dojo/dom-style",
	"dijit/registry",	// registry.byId
	"./common",
	"./lazyLoadUtils",
	"./_ItemBase",
	"./Badge", /* 1.8 */
	"./TransitionEvent"
], function(dojo, array, connect, declare, event, lang, has, win, domAttr, domClass, domConstruct, domGeometry, domStyle, registry, common, lazyLoadUtils, ItemBase, Badge, TransitionEvent){

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
		removeBtnClass: "mblDomButtonBlackCircleCross", /* 1.8 */

		// closeBtnClass: String
		//		A class name of a DOM button to be used as a close button.
		closeBtnClass: "mblDomButtonBlueMinus",

		// closeBtnProp: String
		//		Properties for the close button.
		closeBtnProp: null,

		badge: "", /* 1.8 */
		removable: true, /* 1.8 */

		 /* 1.8 */templateString: '<div class="mblIconArea" dojoAttachPoint="iconDivNode">'+
							'<div class="mblIconAreaInner"><img src="${icon}" dojoAttachPoint="iconNode"></div><span dojoAttachPoint="labelNode1"></span>'+
						'</div>',
		templateStringSub: '<li class="mblIconItemSub" lazy="${lazy}" style="display:none;" dojoAttachPoint="contentNode">'+
						'<h2 class="mblIconContentHeading" dojoAttachPoint="closeNode">'+
							'<div class="${closeBtnClass}" style="position:absolute;left:4px;top:2px;" dojoAttachPoint="closeIconNode"></div><span dojoAttachPoint="labelNode2"></span>'+
						'</h2>'+
						'<div class="mblContent" dojoAttachPoint="containerNode"></div>'+
					'</li>',

		createTemplate: function(s){
			array.forEach(["lazy","icon","closeBtnClass"], function(v){
				while(s.indexOf("${"+v+"}") != -1){
					s = s.replace("${"+v+"}", this[v]);
				}
			}, this);
			var div = win.doc.createElement("div");
			div.innerHTML = s;
	
			/*
			array.forEach(query("[dojoAttachPoint]", domNode), function(node){
				this[node.getAttribute("dojoAttachPoint")] = node;
			}, this);
			*/

			var nodes = div.getElementsByTagName("*");
			var i, len, s1;
			len = nodes.length;
			for(i = 0; i < len; i++){
				s1 = nodes[i].getAttribute("dojoAttachPoint");
				if(s1){
					this[s1] = nodes[i];
				}
			}
			if(this.closeIconNode && this.closeBtnProp){
				domAttr.set(this.closeIconNode, this.closeBtnProp);
			}
			var domNode = div.removeChild(div.firstChild);
			div = null;
			return domNode;
		},

		buildRendering: function(){
			this.inheritParams();
			var node = this.createTemplate(this.templateString);
			this.subNode = this.createTemplate(this.templateStringSub);
			this.subNode._parentNode = this.domNode; // [custom property]

			this.domNode = this.srcNodeRef || domConstruct.create("li");
			domClass.add(this.domNode, "mblIconItem");
			if(this.srcNodeRef){
				// reparent
				for(var i = 0, len = this.srcNodeRef.childNodes.length; i < len; i++){
					this.containerNode.appendChild(this.srcNodeRef.firstChild);
				}
			}
			this.domNode.appendChild(node);
		},

		postCreate: function(){
			common.createDomButton(this.closeIconNode, {
				top: "-2px",
				left: "1px"
			});
			this.connect(this.iconNode, has('touch') ? "touchstart" : "onmousedown", "onTouchStart"); /* 1.8 */
			this.connect(this.domNode, "webkitTransitionStart", "onTransitionStart"); /* 1.8 */
			this.connect(this.domNode, "webkitTransitionEnd", "onTransitionEnd"); /* 1.8 */
			this.connect(this.domNode, "ondragstart", event.stop); /* 1.8 */
			this.connect(this.iconNode, "onmousedown", "onMouseDownIcon");
			this.connect(this.iconNode, "onclick", "iconClicked");
			this.connect(this.closeIconNode, "onclick", "closeIconClicked");
			this.connect(this.iconNode, "onerror", "onError");
		},
	
		destroy: function(){ /* 1.8 */
			if(this.badgeObj){
				delete this.badgeObj;
			}
			this.inherited(arguments);
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

		startEdit: function(){ /* 1.8 */
			if(this.removable){
				if(!this.removeIconNode){
					this.removeIconNode = domConstruct.create("div", {className: this.removeBtnClass}, this.iconDivNode);
					common.createDomButton(this.removeIconNode);
					domStyle.set(this.removeIconNode, {
						position: "absolute",
						top: "-5px",
						left: "-2px"
					});
					this.connect(this.removeIconNode, "onclick", "removeIconClicked");
				}else{
					domStyle.set(this.removeIconNode, "display", "");
				}
			}
			this.highlight(0);
		},
		
		endEdit: function(){ /* 1.8 */
			this.unhighlight();
			if(this.removable && this.removeIconNode){
				domStyle.set(this.removeIconNode, "display", "none");
			}
		},
		
		removeIconClicked: function(e){ /* 1.8 */
			this.getParent().onRemoveIconClicked(e, this);
		},
		
		remove: function(){ /* 1.8 */
			var p = this.getParent();
			p.removeChildWithAnimation(this);
			connect.publish("/dojox/mobile/removeItem", [p, this]); // pubsub
			p.onRemoveItem(this); // callback
			this.destroy();
		},
		
		scale: function(/*Number*/ratio){ /* 1.8 */
			domStyle.set(this.domNode, {
				webkitTransition: has("android") ? "" : "-webkit-transform .1s ease-in-out",
				webkitTransform: ratio == 1 ? "" : "scale(" + ratio + ")"
			});
		},
		
		onTransitionStart: function(e){ /* 1.8 */
			event.stop(e);
		},
		
		onTransitionEnd: function(e){ /* 1.8 */
			event.stop(e);
			this._moving = false;
			domStyle.set(this.domNode, {
				webkitTransition: ""
			});
		},
		
		onTouchStart: function(e){ /* 1.8 */
			if(!this.getParent().editable){ return; }
			if(!this._ch){
				this._ch = [];
				this._ch.push(this.connect(this.domNode, has('touch') ? "touchmove" : "onmousemove", "onTouchMove"));
				this._ch.push(this.connect(this.domNode, has('touch') ? "touchend" : "onmouseup", "onTouchEnd"));
				this._ch.push(this.connect(this.domNode, "onmouseout", "onTouchEnd"));
			}
			if(this.getParent()._editing){
				this.onDragStart(e);
			}else{
				// set timer to detect long press
				var _this = this;
				this._pressTimer = setTimeout(lang.hitch(this, function(){
					this.getParent().startEdit();
					this.onDragStart(e);
				}), 1000);
			}
		},
		
		onDragStart: function(e){/* 1.8 */
			this.scale(1.1);
			this._draging = true;
			this._pos = domGeometry.position(this.domNode, true);
			this._offset = {
				x: this._pos.x - e.pageX,
				y: this._pos.y - e.pageY
			};
			var p = this.getParent();
			this._oldIndex = p.getIndexOfChild(this);
			p.addChild(p._dummyItem, this._oldIndex);
			p.moveChild(this, p.getChildren().length);
			domStyle.set(this.domNode, {
				position: "absolute",
				top: (this._pos.y) + "px",
				left: (this._pos.x) + "px",
				zIndex: 100
			});
		},
		
		onTouchMove: function(e){ /* 1.8 */
			if(this._draging){
				event.stop(e);
				
				var x = e.touches ? e.touches[0].pageX : e.clientX;
				var y = e.touches ? e.touches[0].pageY : e.clientY;
				domStyle.set(this.domNode, {
					top: (this._offset.y + y) + "px",
					left: (this._offset.x + x) + "px"
				});
				
				this.getParent()._detectOverlap({x: x, y: y});
			}
		},
		
		onTouchEnd: function(e){ /* 1.8 */
			this._clearPressTimer();
			for(var i=0; i<this._ch.length; i++){
				this.disconnect(this._ch[i]);
			}
			this._ch = null;
			if(this._draging){
				this.scale(1.0);
				this._draging = false;
				domStyle.set(this.domNode, {
					position: "",
					top: "",
					left: "",
					zIndex: ""
				});
				var p = this.getParent();
				var newIndex = p.getIndexOfChild(p._dummyItem);
				p.moveChild(this, newIndex);
				p.removeChild(p._dummyItem);
				connect.publish("/dojox/mobile/moveItem", [p, this, this._oldIndex, newIndex]); // pubsub
				p.onMoveItem(this, this._oldIndex, newIndex); // callback
				this._oldIndex = null;
			}
		},
		
		_clearPressTimer: function(){ /* 1.8 */
			if(this._pressTimer){
				clearTimeout(this._pressTimer);
				this._pressTimer = null;
			}
		},

	/* 1.8 Removed
		instantiateWidget: function(e){
			....
		},
	*/
	
		isOpen: function(e){
			// summary:
			//		Returns true if the icon is open.
			return this.containerNode.style.display != "none";
		},
	
		onMouseDownIcon: function (e){
			 /* 1.8 */
		},
	
		iconClicked: function(e){
			if(this.getParent()._editing) { return; } /* 1.8 */
			if(e){
				domStyle.set(this.iconNode, "opacity", this.getParent().pressedIconOpacity); /* 1.8 */
				this.setTransitionPos(e);
				setTimeout(lang.hitch(this, function(d){ this.iconClicked(); }), 0);
				return;
			}

			if (this.href && this.hrefTarget) {
				common.openWindow(this.href, this.hrefTarget);
				dojo.style(this.iconNode, "opacity", 1);
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
					domStyle.set(this.iconNode, "opacity", 1);
				}), 1500);
			}else{
				return this.open(e);
			}
	
			if(transOpts){
				return new TransitionEvent(this.domNode,transOpts,e).dispatch();
			}
		},
	
		closeIconClicked: function(e){
			if(e){
				setTimeout(lang.hitch(this, function(d){ this.closeIconClicked(); }), 0);
				return;
			}
			this.close();
		},
	
		open: function(e){
			// summary:
			//		Opens the icon content, or makes a transition.
			var parent = this.getParent(); // IconContainer
			if(this.transition == "below"){
				if(parent.single){
					parent.closeAll();
					domStyle.set(this.iconNode, "opacity", this.getParent().pressedIconOpacity);
				}
				this._open_1();
			}else{
				parent._opening = this;
				if(parent.single){
					this.closeNode.style.display = "none";
					parent.closeAll();
					var view = registry.byId(parent.id+"_mblApplView");
					view._heading._setLabelAttr(this.label);
				}
				var transOpts = this.transitionOptions || {transition: this.transition, transitionDir: this.transitionDir, moveTo: parent.id + "_mblApplView"};		
				new TransitionEvent(this.domNode, transOpts, e).dispatch();
			}
		},
	
		_open_1: function(){
			this.contentNode.style.display = "";
			this.unhighlight();
			if(this.lazy){ /* 1.8 */
				lazyLoadUtils.instantiateLazyWidgets(this.containerNode, this.requires);
				this.lazy = false;
			}
			this.contentNode.scrollIntoView();
			this.onOpen();
		},
	
		close: function(){
			// summary:
			//		Closes the icon content.
			if(has("webkit")){ /* 1.8 */
				if(this.getParent().transition == "below"){
					domClass.add(this.contentNode, "mblCloseContent mblShrink");
					var nodePos = domGeometry.position(this.contentNode, true);
					var targetPos = domGeometry.position(this.domNode, true);
					var origin = (targetPos.x + targetPos.w/2 - nodePos.x) + "px " + (targetPos.y + targetPos.h/2 - nodePos.y) + "px";
					domStyle.set(this.contentNode, { webkitTransformOrigin:origin });
				}else{
					domClass.add(this.contentNode, "mblCloseContent mblShrink0");
				}
			}else{
				this.containerNode.parentNode.style.display = "none";
			}
			domStyle.set(this.iconNode, "opacity", 1);
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
	
		onError: function(){
			var icon = this.getParent().defaultIcon;
			if(icon){
				this.iconNode.src = icon;
			}
		},
	
		_setIconAttr: function(icon){
			if(!this.getParent()){ return; } // icon may be invalid because inheritParams is not called yet
			this.icon = icon;
			common.createIcon(icon, this.iconPos, this.iconNode, this.alt);
			if(this.iconPos){
				domClass.add(this.iconNode, "mblIconItemSpriteIcon");
				var arr = this.iconPos.split(/[ ,]/);
				var p = this.iconNode.parentNode;
				domStyle.set(p, {
					width: arr[2] + "px",
					top: Math.round((p.offsetHeight - arr[3]) / 2) + 1 + "px",
					margin: "auto"
				});
			}
		},
	
		_setLabelAttr: function(/*String*/text){
			this.label = text;
			var s = this._cv ? this._cv(text) : text;
			this.labelNode1.innerHTML = s;
			this.labelNode2.innerHTML = s;
		},
		
		_getBadgeAttr: function(){ /* 1.8 */
			return this.badgeObj ? this.badgeObj.getValue() : null;
		},

		_setBadgeAttr: function(/*String*/value){ /* 1.8 */
			if(!this.badgeObj){
				this.badgeObj = new Badge({fontSize:14});
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
		}
	});
});
