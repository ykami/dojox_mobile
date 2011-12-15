define([
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/has",
	"./common",
	"./iconUtils",
	"./_ItemBase",
	"./ProgressIndicator",
	"./TransitionEvent"
], function(array, connect, declare, lang, domClass, domConstruct, domStyle, has, common, iconUtils, ItemBase, ProgressIndicator, TransitionEvent){

/*=====
	var ItemBase = dojox.mobile._ItemBase;
=====*/

	// module:
	//		dojox/mobile/ListItem
	// summary:
	//		An item of either RoundRectList or EdgeToEdgeList.

	return declare("dojox.mobile.ListItem", ItemBase, {
		// summary:
		//		An item of either RoundRectList or EdgeToEdgeList.
		// description:
		//		ListItem represents an item of either RoundRectList or
		//		EdgeToEdgeList. There are three ways to move to a different
		//		view, moveTo, href, and url. You can choose only one of them.

		// rightText: String
		//		A right-aligned text to display on the item.
		rightText: "",

		// rightIcon: String
		//		An icon to display at the right hand side of the item. The value
		//		can be either a path for an image file or a class name of a DOM
		//		button.
		rightIcon: "",

		// rightIcon2: String
		//		An icon to display at the left of the rightIcon. The value can
		//		be either a path for an image file or a class name of a DOM
		//		button.
		rightIcon2: "",

		// deleteIcon: String
		//		A delete icon to display at the left of the item. The value can
		//		be either a path for an image file or a class name of a DOM
		//		button.
		deleteIcon: "",

		// anchorLabel: Boolean
		//		If true, the label text becomes a clickable anchor text. When
		//		the user clicks on the text, the onAnchorLabelClicked handler is
		//		called. You can override or connect to the handler and implement
		//		any action. The handler has no default action.
		anchorLabel: false,

		// noArrow: Boolean
		//		If true, the right hand side arrow is not displayed.
		noArrow: false,

		// selected: Boolean
		//		If true, the item is highlighted to indicate it is selected.
		selected: false,

		// checked: Boolean
		//		If true, a check mark is displayed at the right of the item.
		checked: false,

		// arrowClass: String
		//		An icon to display as an arrow. The value can be either a path
		//		for an image file or a class name of a DOM button.
		arrowClass: "",

		// checkClass: String
		//		An icon to display as a check mark. The value can be either a
		//		path for an image file or a class name of a DOM button.
		checkClass: "",

		// uncheckClass: String
		//		An icon to display as an uncheck mark. The value can be either a
		//		path for an image file or a class name of a DOM button.
		uncheckClass: "",

		// variableHeight: Boolean
		//		If true, the height of the item varies according to its
		//		content. In dojo 1.6 or older, the "mblVariableHeight" class was
		//		used for this purpose. In dojo 1.7, adding the mblVariableHeight
		//		class still works for backward compatibility.
		variableHeight: false,


		// rightIconTitle: String
		//		An alt text for the right icon.
		rightIconTitle: "",

		// rightIcon2Title: String
		//		An alt text for the right icon2.
		rightIcon2Title: "",

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "li",

		// busy: Boolean
		//		If true, a progress indicator spins.
		busy: false,

		paramsToInherit: "variableHeight,transition,deleteIcon,icon,rightIcon,rightIcon2,uncheckIcon,arrowClass,checkClass,uncheckClass",

		baseClass: "mblListItem",

		_selClass: "mblItemSelected",
	
		buildRendering: function(){
			this._isOnLine = this.inheritParams();
			this.domNode = this.srcNodeRef || domConstruct.create(this.tag);
			this.inherited(arguments);
			if(this.selected){
				domClass.add(this.domNode, this._selClass);
			}

			// inner HTML
			if(this.srcNodeRef){
				// reparent
				var label;
				if(this.srcNodeRef.length === 1){
					var n = this.srcNodeRef.firstChild;
					if(n.nodeType === 3){
						label = lang.trim(n.nodeValue) || "";
					}
				}
				if(label){ // inner text label
					this.label = label;
				}else if(lang.trim(this.srcNodeRef.innerHTML) !== ""){ // inline content
					this.label = "";
					this.labelNode = domConstruct.create("div", {className:"mblListItemTextBox"});
					for(var i = 0, len = this.srcNodeRef.childNodes.length; i < len; i++){
						this.labelNode.appendChild(this.srcNodeRef.firstChild);
					}
					this.domNode.appendChild(this.labelNode);
				}
			}
			if(!this.labelNode){
				this.labelNode = domConstruct.create("div", {className:"mblListItemTextBox"}, this.domNode);
			}

			if(this.anchorLabel){
				this.labelNode.style.display = "inline"; // to narrow the text region
				this.labelNode.style.cursor = "pointer";
			}
		},

		startup: function(){
			if(this._started){ return; }

			if(!this._isOnLine){
				this.inheritParams();
				this.set({
					icon: this.icon,
					deleteIcon: this.deleteIcon,
					rightIcon: this.rightIcon,
					rightIcon2: this.rightIcon2
				});
			}

			var parent = this.getParent();
			if(this.moveTo || this.href || this.url || this.clickable || (parent && parent.select)){
				this._clickHandle = this.connect(this.domNode, "onclick", "_onClick");
				this._keydownHandle = this.connect(this.domNode, "onkeydown", "_onClick");
			}
			this.setArrow();

			if(domClass.contains(this.domNode, "mblVariableHeight")){
				this.variableHeight = true;
			}
			if(this.variableHeight){
				domClass.add(this.domNode, "mblVariableHeight");
				setTimeout(lang.hitch(this, "layoutVariableHeight"));
			}

			if(parent.select){
				this.set("checked", this.checked);
			}

			this.inherited(arguments);
		},

		resize: function(){
			if(this.variableHeight){
				this.layoutVariableHeight();
			}
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(this.onClick(e) === false){ return; } // user's click action
			if(e && e.type === "keydown" && e.keyCode !== 13){ return; }
			var a = e.currentTarget;
			var li = a.parentNode;
			if(domClass.contains(li, this._selClass)){ return; } // already selected
			if(this.anchorLabel){
				for(var p = e.target; p.tagName !== this.tag.toUpperCase(); p = p.parentNode){
					if(p.className == "mblListItemTextBox"){
						domClass.add(p, "mblListItemTextBoxSelected");
						setTimeout(function(){
							domClass.remove(p, "mblListItemTextBoxSelected");
						}, has('android') ? 300 : 1000);
						this.onAnchorLabelClicked(e);
						return;
					}
				}
			}
			var parent = this.getParent();
			if(parent.select){
				if(parent.select === "single"){
					if(!this.checked){
						this.set("checked", true);
					}
				}else if(parent.select === "multiple"){
					this.set("checked", !this.checked);
				}
			}
			this.select();

			if (this.href && this.hrefTarget) {
				common.openWindow(this.href, this.hrefTarget);
				return;
			}
			var transOpts;
			if(this.moveTo || this.href || this.url || this.scene){
				transOpts = {
					moveTo: this.moveTo, href: this.href, hrefTarget: this.hrefTarget,
					url: this.url, urlTarget: this.urlTarget, scene: this.scene,
					transition: this.transition, transitionDir: this.transitionDir
				};
			}else if(this.transitionOptions){
				transOpts = this.transitionOptions;
			}	

			if(transOpts){
				this.setTransitionPos(e);
				return new TransitionEvent(this.domNode,transOpts,e).dispatch();
			}
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},
	
		select: function(){
			// summary:
			//		Makes this widget in the selected state.
			var parent = this.getParent();
			if(parent.stateful){
				parent.deselectAll();
			}else{
				var _this = this;
				setTimeout(function(){
					_this.deselect();
				}, has('android') ? 300 : 1000);
			}
			domClass.add(this.domNode, this._selClass);
		},
	
		deselect: function(){
			// summary:
			//		Makes this widget in the deselected state.
			domClass.remove(this.domNode, this._selClass);
		},
	
		onAnchorLabelClicked: function(e){
			// summary:
			//		Stub function to connect to from your application.
		},

		layoutVariableHeight: function(){
			var h = this.domNode.offsetHeight;
			if(h === this.domNodeHeight){ return; }
			this.domNodeHeight = h;
			array.forEach([
					this.rightTextNode,
					this.rightIcon2Node,
					this.rightIconNode,
					this.uncheckIconNode,
					this.iconNode,
					this.deleteIconNode,
					this.knobIconNode
				], function(n){
					if(n){
						var domNode = this.domNode;
						var f = function(){
							var t = Math.round((h - n.offsetHeight) / 2) -
								domStyle.get(domNode, "paddingTop");
							n.style.marginTop = t + "px";
						}
						if(n.offsetHeight === 0 && n.tagName === "IMG"){
							n.onload = function(){ f(); };
						}else{
							f();
						}
					}
				}, this);
		},

		setArrow: function(){
			// summary:
			//		Sets the arrow icon if necessary.
			if(this.checked){ return; }
			var c = "";
			var parent = this.getParent();
			if(this.moveTo || this.href || this.url || this.clickable){
				if(!this.noArrow && !(parent && parent.stateful)){
					c = this.arrowClass || "mblDomButtonArrow";
				}
			}
			if(c){
				this._setRightIconAttr(c);
			}
		},

		_setIcon: function(/*String*/icon, /*String*/type, /*DomNode*/ref){
			if(!this.getParent()){ return; }
			this._set(type, icon);
			this[type + "Node"] = iconUtils.setIcon(icon, this[type + "Pos"],
				this[type + "Node"], this[type + "Title"] || this.alt, this.domNode, ref, "before");
			if(this[type + "Node"]){
				var cap = type.charAt(0).toUpperCase() + type.substring(1);
				domClass.add(this[type + "Node"], "mblListItem" + cap);
			}
		},

		_setDeleteIconAttr: function(/*String*/icon){
			this._setIcon(icon, "deleteIcon", this.iconNode || this.rightIconNode || this.rightIcon2Node || this.rightTextNode || this.labelNode);
		},
	
		_setIconAttr: function(icon){
			this._setIcon(icon, "icon", this.rightIconNode || this.rightIcon2Node || this.rightTextNode || this.labelNode);
		},
	
		_setRightTextAttr: function(/*String*/text){
			if(!this.rightTextNode){
				this.rightTextNode = domConstruct.create("div", {className:"mblListItemRightText"}, this.labelNode, "before");
			}
			this.rightText = text;
			this.rightTextNode.innerHTML = this._cv ? this._cv(text) : text;
		},
	
		_setRightIconAttr: function(/*String*/icon){
			this._setIcon(icon, "rightIcon", this.rightIcon2Node || this.rightTextNode || this.labelNode);
		},
	
		_setUncheckIconAttr: function(/*String*/icon){
			this._setIcon(icon, "uncheckIcon", this.rightIcon2Node || this.rightTextNode || this.labelNode);
		},

		_setRightIcon2Attr: function(/*String*/icon){
			this._setIcon(icon, "rightIcon2", this.rightTextNode || this.labelNode);
		},
	
		_setCheckedAttr: function(/*Boolean*/checked){
			var parent = this.getParent();
			if(parent && parent.select === "single" && checked){
				array.forEach(parent.getChildren(), function(child){
					child.set("checked", false);
				});
			}
			this._setRightIconAttr(this.checkClass || "mblDomButtonCheck");
			this._setUncheckIconAttr(this.uncheckClass);

			domClass.toggle(this.domNode, "mblListItemChecked", checked);
			domClass.toggle(this.domNode, "mblListItemUnchecked", !checked);
			domClass.toggle(this.domNode, "mblListItemHasUncheck", !!this.uncheckIconNode);
			this.rightIconNode.style.position = (this.uncheckIconNode && !checked) ? "absolute" : "";

			if(parent && this.checked !== checked){
				parent.onCheckStateChanged(this, checked);
			}
			this._set("checked", checked);
		},

		_setBusyAttr: function(/*Boolean*/busy){
			if(busy){
				if(!this.iconNode){
					this.iconNode = domConstruct.create("div", {className:"mblListItemIcon"},
						this.rightIconNode || this.rightIcon2Node || this.rightTextNode || this.labelNode, "before");
				}
				if(!this._prog){
					this._prog = new ProgressIndicator({size:25, center:false});
				}
				array.forEach(this.iconNode.childNodes, function(child){
					child.style.display = "none";
				});
				this.iconNode.appendChild(this._prog.domNode);
				this._prog.start();
			}else{
				array.forEach(this.iconNode.childNodes, function(child){
					child.style.display = "";
				});
				this._prog.stop();
			}
			this._set("busy", busy);
		}	
	});
});
