define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/dom-class",
	"dijit/registry",
	"dijit/_Contained",
	"dijit/_WidgetBase",
	"./TransitionEvent",
	"./iconUtils",
	"./sniff"
], function(array, declare, domClass, registry, Contained, WidgetBase, TransitionEvent, iconUtils, has){

/*=====
	var Contained = dijit._Contained;
	var WidgetBase = dijit._WidgetBase;
	var TransitionEvent = dojox.mobile.TransitionEvent;
=====*/

	// module:
	//		dojox/mobile/_ItemBase
	// summary:
	//		A base class for item classes (e.g. ListItem, IconItem, etc.)

	return declare("dojox.mobile._ItemBase", [WidgetBase, Contained],{
		// summary:
		//		A base class for item classes (e.g. ListItem, IconItem, etc.)
		// description:
		//		_ItemBase is a base class for widgets that have capability to
		//		make a view transition when clicked.

		// icon: String
		//		An icon image to display. The value can be either a path for an
		//		image file or a class name of a DOM button. If icon is not
		//		specified, the iconBase parameter of the parent widget is used.
		icon: "",

		// iconPos: String
		//		The position of an aggregated icon. IconPos is comma separated
		//		values like top,left,width,height (ex. "0,0,29,29"). If iconPos
		//		is not specified, the iconPos parameter of the parent widget is
		//		used.
		iconPos: "", // top,left,width,height (ex. "0,0,29,29")

		// alt: String
		//		An alt text for the icon image.
		alt: "",

		// href: String
		//		A URL of another web page to go to.
		href: "",

		// hrefTarget: String
		//		A target that specifies where to open a page specified by
		//		href. The value will be passed to the 2nd argument of
		//		window.open().
		hrefTarget: "",

		// moveTo: String
		//		The id of the transition destination view which resides in the
		//		current page.
		//
		//		If the value has a hash sign ('#') before the id (e.g. #view1)
		//		and the dojo.hash module is loaded by the user application, the
		//		view transition updates the hash in the browser URL so that the
		//		user can bookmark the destination view. In this case, the user
		//		can also use the browser's back/forward button to navigate
		//		through the views in the browser history.
		//
		//		If null, transitions to a blank view.
		//		If '#', returns immediately without transition.
		moveTo: "",

		// scene: String
		//		The name of a scene. Used from dojox.mobile.app.
		scene: "",

		// clickable: Boolean
		//		If true, this item becomes clickable even if a transition
		//		destination (moveTo, etc.) is not specified.
		clickable: false,

		// url: String
		//		A URL of an html fragment page or JSON data that represents a
		//		new view content. The view content is loaded with XHR and
		//		inserted in the current page. Then a view transition occurs to
		//		the newly created view. The view is cached so that subsequent
		//		requests would not load the content again.
		url: "",

		// urlTarget: String
		//		Node id under which a new view will be created according to the
		//		url parameter. If not specified, The new view will be created as
		//		a sibling of the current view.
		urlTarget: "",

		// transition: String
		//		A type of animated transition effect. You can choose from the
		//		standard transition types, "slide", "fade", "flip", or from the
		//		extended transition types, "cover", "coverv", "dissolve",
		//		"reveal", "revealv", "scaleIn", "scaleOut", "slidev",
		//		"swirl", "zoomIn", "zoomOut". If "none" is specified, transition
		//		occurs immediately without animation.
		transition: "",

		// transitionDir: Number
		//		The transition direction. If 1, transition forward. If -1,
		//		transition backward. For example, the slide transition slides
		//		the view from right to left when dir == 1, and from left to
		//		right when dir == -1.
		transitionDir: 1,

		// transitionOptions: Object
		//		A hash object that holds transition options.
		transitionOptions: null,

		// callback: Function|String
		//		A callback function that is called when the transition has been
		//		finished. A function reference, or name of a function in
		//		context.
		callback: null,

		// label: String
		//		A label of the item. If the label is not specified, innerHTML is
		//		used as a label.
		label: "",

		// toggle: Boolean
		//		If true, the item acts like a toggle button.
		toggle: false,

		// selected: Boolean
		//		If true, the item is highlighted to indicate it is selected.
		selected: false,

		// paramsToInherit: String
		//		Comma separated parameters to inherit from the parent.
		paramsToInherit: "transition,icon",

		// _selStartMethod: String
		//		Specifies how the item enters the selected state.
		//		"touch": Use touch events to enter the selected state.
		//		"none": Do not change the selected state.
		_selStartMethod: "none", // touch or none

		// _selEndMethod: String
		//		Specifies how the item leaves the selected state.
		//		"touch": Use touch events to leave the selected state.
		//		"timer": Use setTimeout to leave the selected state.
		//		"none": Do not change the selected state.
		_selEndMethod: "none", // touch, timer, or none

		// _duration: Number
		//		Duration of selection, milliseconds.
		_duration: 800,

		buildRendering: function(){
			this.inherited(arguments);
			this._isOnLine = this.inheritParams();
		},

		startup: function(){
			if(this._started){ return; }
			if(!this._isOnLine){
				this.inheritParams();
			}
			if(this._clickHandle && this._selStartMethod === "touch"){
				this._onTouchStartHandle = this.connect(this.domNode, has('touch') ? "ontouchstart" : "onmousedown", "_onTouchStart");
			}
			this.inherited(arguments);
		},

		inheritParams: function(){
			var parent = this.getParent();
			if(parent){
				array.forEach(this.paramsToInherit.split(/,/), function(p){
					if(p.match(/icon/i)){
						var base = p + "Base", pos = p + "Pos";
						if(this[p] && parent[base] &&
							parent[base].charAt(parent[base].length - 1) === '/'){
							this[p] = parent[base] + this[p];
						}
						if(!this[p]){ this[p] = parent[base]; }
						if(!this[pos]){ this[pos] = parent[pos]; }
					}else{
						if(!this[p]){ this[p] = parent[p]; }
					}
				}, this);
			}
			return !!parent;
		},

		userClickAction: function(e){
			// summary:
			//		User defined click action
		},
	
		defaultClickAction: function(e){
			// summary:
			//		The default action of this item
			this.handleSelection(e);
			if(this.userClickAction(e) === false){ return; } // user's click action
			this.makeTransition(e);
		},

		handleSelection: function(e){
			// summary:
			//		Handles this items selection state
			if(this._timer){
				clearTimeout(this._timer);
				this._timer = null;
			}

			if(this._onTouchEndHandle){
				this.disconnect(this._onTouchEndHandle);
				this._onTouchEndHandle = null;
			}

			var p = this.getParent();
			if(this.toggle){
				this.set("selected", !this.selected);
			}else if(p && p.selectOne){
				this.set("selected", true);
			}else{
				if(this._selEndMethod === "touch"){
					this.set("selected", false);
				}else if(this._selEndMethod === "timer"){
					var _this = this;
					setTimeout(function(){
						_this.set("selected", false);
					}, this._duration);
				}
			}
		},

		makeTransition: function(e){
			if (this.href && this.hrefTarget) {
				win.global.open(this.href, this.hrefTarget || "_blank");
				this._onNewWindowOpened(e);
				return;
			}
			var transOpts = this.transitionOptions || {};
			if(this.moveTo || this.href || this.url || this.scene){
				array.forEach(["moveTo", "href", "hrefTarget", "url",
					"urlTarget", "scene", "transition", "transitionDir"], function(p){
					if(this[p]){
						transOpts[p] = this[p];
					}
				}, this);
			}
			if(this._prepareForTransition(e, transOpts) === false){ return; }
			if(transOpts){
				this.setTransitionPos(e);
				new TransitionEvent(this.domNode, transOpts, e).dispatch();
			}
		},

		_onNewWindowOpened: function(e){
			// subclass may want to implement
		},
	
		_prepareForTransition: function(e, /*Object*/ transOpts){
			// subclass may want to implement
		},
	
		_onTouchStart: function(e){
			if(!this._onTouchEndHandle && this._selStartMethod === "touch"){
				this._onTouchEndHandle = this.connect(this.domNode, has('touch') ? "ontouchend" : "onmouseleave", "_onTouchEnd");
			}
			this._currentSel = this.selected;
			this.set("selected", true);
		},

		_onTouchEnd: function(e){
			var _this = this;
			this._timer = setTimeout(function(){
				// webkit mobile has no onmouseleave, so we have to use touchend instead,
				// but we don't know if onclick comes or not after touchend,
				// therefore we need to delay deselecting the button, otherwise, the button blinks.
				_this.set("selected", false);
				_this._prevSel && _this._prevSel.set("selected", true);
				_this.timer = null;
			}, this._duration / 2);
			this.disconnect(this._onTouchEndHandle);
			this._onTouchEndHandle = null;
		},
	
		setTransitionPos: function(e){
			// summary:
			//		Stores the clicked position for later use.
			// description:
			//		Some of the transition animations (e.g. ScaleIn) needs the
			//		clicked position.
			var w = this;
			while(true){
				w = w.getParent();
				if(!w || domClass.contains(w.domNode, "mblView")){ break; }
			}
			if(w){
				w.clickedPosX = e.clientX;
				w.clickedPosY = e.clientY;
			}
		},

		transitionTo: function(/*String|Object*/moveTo, href, url, scene){
			// summary:
			//		Performs a view transition.
			// description:
			//		Given a transition destination, this method performs a view
			//		transition. This method is typically called when this item
			//		is clicked.
			var opts = (typeof(moveTo) === "object") ? moveTo :
				{moveTo: moveTo, href: href, url: url, scene: scene,
				 transition: this.transition, transitionDir: this.transitionDir};
			new TransitionEvent(this.domNode, opts).dispatch();
		},

		_setIconAttr: function(icon){
			if(!this.getParent()){ return; } // icon may be invalid because inheritParams is not called yet
			this._set("icon", icon);
			this.iconNode = iconUtils.setIcon(icon, this.iconPos, this.iconNode, this.alt, this.iconParentNode);
		},

		_setLabelAttr: function(/*String*/text){
			this._set("label", text);
			this.labelNode.innerHTML = this._cv ? this._cv(text) : text;
		},

		_setSelectedAttr: function(/*Boolean*/selected){
			// summary:
			//		Makes this widget in the selected or unselected state.
			// description:
			//		Subclass should override.
			if(selected){
				var p = this.getParent();
				if(p && p.selectOne){
					// deselect the currently selected item
					var _this = this;
					array.filter(p.getChildren(), function(w){ return w.selected; })
						.forEach(function(c){ _this._prevSel = c; c.set("selected", false); });
				}
			}
			this._set("selected", selected);
		}
	});
});
