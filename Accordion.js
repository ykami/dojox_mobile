define([
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./iconUtils",
	"./lazyLoadUtils",
	"require"
], function(array, connect, declare, lang, has, dom, domClass, domConstruct, Contained, Container, WidgetBase, iconUtils, lazyLoadUtils, require){
	// module:
	//		dojox/mobile/Accordion
	// summary:
	//		TODOC

	// inner class
	var _AccordionTitle = declare([WidgetBase, Contained], {
		label: "Label",
		icon1: "",
		icon2: "",
		iconPos1: "",
		iconPos2: "",

		baseClass: "mblAccordionTitle",

		buildRendering: function(){
			this.inherited(arguments);

			var a = this.anchorNode = domConstruct.create("a", {
				className: "mblAccordionTitleAnchor"
			}, this.domNode);
			a.href = "javascript:void(0)"; // for a11y

			// icon
			this.iconNode1 = domConstruct.create("div", {
				className: "mblAccordionTitleIcon mblAccordionTitleIcon1",
				innerHTML: "<div class='mblAccordionTitleIcon1Inner'></div>"
			}, a); // unselected
			this.iconNode1Inner = this.iconNode1.firstChild;

			this.iconNode2 = domConstruct.create("div", {
				className: "mblAccordionTitleIcon mblAccordionTitleIcon2",
				innerHTML: "<div class='mblAccordionTitleIcon2Inner'></div>"
			}, a); // selected
			this.iconNode2Inner = this.iconNode2.firstChild;

			// text box
			this.textBoxNode = domConstruct.create("div", {className:"mblAccordionTitleTextBox"}, a);
			this.labelNode = domConstruct.create("span", {
				className: "mblAccordionTitleLabel",
				innerHTML: this._cv ? this._cv(this.label) : this.label
			}, this.textBoxNode);
		},

		postCreate: function(){
			this._clickHandle = this.connect(this.domNode, "onclick", "_onClick");
			dom.setSelectable(this.domNode, false);
		},

		inheritParams: function(){
			var parent = this.getParent();
			if(parent){
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
			}
		},

		_setIcon: function(num){
			var i = "icon" + num, n = "iconNode" + num + "Inner", p = "iconPos" + num;
			if(this[i] && this[i] !== "none"){
				var img = iconUtils.createIcon(this[i], this[p], null, this.alt, this[n]);
				this[n].parentNode.style.height = this[n].style.height;
				if(has("ie")){
					this[n].appendChild(domConstruct.create("img", {
						src: require.toUrl("dojo", "resources/blank.gif"),
						height: this.domNode.offsetHeight + ""
					}));
				}
				var cls;
				if(this[i] && this[i].indexOf("mblDomButton") === 0){
					cls = "mblAccordionTitleDomIcon";
				}else if(this[p]){
					cls = "mblAccordionTitleSpriteIcon";
				}else{
					cls = "mblAccordionTitleSingleIcon";
				}
				domClass.add(this["iconNode" + num], cls);
			}else{
				domClass.add(this.anchorNode, "mblAccordionTitleAnchorNoIcon");
			}
		},

		startup: function(){
			this.inheritParams();
			this._setIcon(1);
			this._setIcon(2);
		},

		select: function(/*Widget*/pane){
			domClass.add(this.domNode, "mblAccordionTitleSelected");
		},

		deselect: function(/*Widget*/pane){
			domClass.remove(this.domNode, "mblAccordionTitleSelected");
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(this.onClick(e) === false){ return; } // user's click action
			var p = this.getParent();
			if(!p.fixedHeight && this.contentWidget.domNode.style.display !== "none"){
				p.collapse(this.contentWidget, !p.animation);
			}else{
				p.expand(this.contentWidget, !p.animation);
			}
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		}
	});

	lang.extend(dijit._WidgetBase, {
		alt: "",
		label: "",
		icon1: "",
		icon2: "",
		iconPos1: "",
		iconPos2: "",
		selected: false,
		lazy: false
	});

	return declare("dojox.mobile.Accordion", [dijit._WidgetBase, dijit._Container, dijit._Contained], {
		iconBase: "",
		iconPos: "",
		fixedHeight: false,
		singleOpen: false,
		animation: true,

		duration: .3, // [seconds]

		_openSpace: 1,

		buildRendering: function(){
			this.inherited(arguments);
			this.domNode.className = "mblAccordion";
		},

		startup: function(){
			if(this._started){ return; }

			if(this.fixedHeight){
				this.singleOpen = true;
			}
			var children = this.getChildren();
			array.forEach(children, this._setupChild, this);
			var sel;
			array.forEach(children, function(child){
				child.startup();
				child._at.startup();
				this.collapse(child);
				if(child.selected){
					sel = child;
				}
			}, this);
			if(!sel && this.fixedHeight){
				sel = children[children.length - 1];
			}
			if(sel){
				this.expand(sel, true);
			}else{
				this._updateLast();
			}
			setTimeout(lang.hitch(this, function(){ this.resize(); }), 0);

			this._started = true;
		},

		_setupChild: function(/*Widget*/ child){
			if(child.domNode.style.overflow != "hidden"){
				child.domNode.style.overflow = this.fixedHeight ? "auto" : "hidden";
			}
			child._at = new _AccordionTitle({
				label: child.label,
				alt: child.alt,
				icon1: child.icon1,
				icon2: child.icon2,
				iconPos1: child.iconPos1,
				iconPos2: child.iconPos2,
				contentWidget: child
			});
			domConstruct.place(child._at.domNode, child.domNode, "before");
			domClass.add(child.domNode, "mblAccordionPane");
		},

		addChild: function(/*Widget*/ widget, /*int?*/ insertIndex){
			this.inherited(arguments);
			if(this._started){
				this._setupChild(widget);
				widget._at.startup();
				if(widget.selected){
					this.expand(widget, true);
					setTimeout(function(){
						widget.domNode.style.height = "";
					}, 0);
				}else{
					this.collapse(widget);
				}
			}
		},

		removeChild: function(/*Widget*/ widget){
			child._at.destroy();
			this.inherited(arguments);
		},

		getChildren: function(){
			return array.filter(this.inherited(arguments), function(child){
				return !(child instanceof _AccordionTitle);
			});
		},

		getSelectedPanes: function(){
			return array.filter(this.getChildren(), function(pane){
				return pane.domNode.style.display != "none";
			});
		},

		resize: function(){
			if(this.fixedHeight){
				var panes = array.filter(this.getChildren(), function(child){ // active pages
					return child._at.domNode.style.display != "none";
				});
				var openSpace = this.domNode.clientHeight; // height of all panes
				array.forEach(panes, function(child){
					openSpace -= child._at.domNode.offsetHeight;
				});
				this._openSpace = openSpace > 0 ? openSpace : 0;
				var sel = this.getSelectedPanes()[0];
				sel.domNode.style.webkitTransition = "";
				sel.domNode.style.height = this._openSpace + "px";
			}
		},

		_updateLast: function(){
			var children = this.getChildren();
			array.forEach(children, function(c, i){
				// add "mblAccordionTitleLast" to the last, closed accordion title
				domClass.toggle(c._at.domNode, "mblAccordionTitleLast",
					i === children.length - 1 && !domClass.contains(c._at.domNode, "mblAccordionTitleSelected"))
			}, this);
		},

		expand: function(/*Widget*/pane, /*boolean*/noAnimation){
			if(pane.lazy){
				lazyLoadUtils.instantiateLazyWidgets(pane.containerNode, pane.requires);
				pane.lazy = false;
			}
			var children = this.getChildren();
			array.forEach(children, function(c, i){
				c.domNode.style.webkitTransition = noAnimation ? "" : "height "+this.duration+"s linear";
				if(c === pane){
					c.domNode.style.display = "";
					var h;
					if(this.fixedHeight){
						h = this._openSpace;
					}else{
						h = parseInt(c.height || c.domNode.getAttribute("height")); // ScrollableView may have the height property
						if(!h){
							c.domNode.style.height = "";
							h = c.domNode.offsetHeight;
							c.domNode.style.height = "0px";
						}
					}
					setTimeout(function(){ // necessary for webkitTransition to work
						c.domNode.style.height = h + "px";
					}, 0);
					this.select(pane);
				}else if(this.singleOpen){
					this.collapse(c, noAnimation);
				}
			}, this);
			this._updateLast();
		},

		collapse: function(/*Widget*/pane, /*boolean*/noAnimation){
			pane.domNode.style.webkitTransition = noAnimation ? "" : "height "+this.duration+"s linear";
			pane.domNode.style.height = "0px";
			if(!has("webKit") || noAnimation){
				pane.domNode.style.display = "none";
				this._updateLast();
			}else{
				// Adding a webkitTransitionEnd handler to panes may cause conflict
				// when the panes already have the one. (e.g. ScrollableView)
				var _this = this;
				setTimeout(function(){
					pane.domNode.style.display = "none";
					_this._updateLast();

					// resizeAll is necessary especially when the Accordion is
					// on a ScrollableView, the ScrollableView is scrolled to
					// the bottom, and then expand any other pane while in the
					// non-fixed singleOpen mode.
					if(!_this.fixedHeight && _this.singleOpen){
						dojox.mobile.resizeAll();
					}
				}, this.duration*1000);
			}
			this.deselect(pane);
		},

		select: function(/*Widget*/pane){
			pane._at.select();
		},

		deselect: function(/*Widget*/pane){
			pane._at.deselect();
		},

		onselectstart: function(){
			return false;
		}
	});
});
