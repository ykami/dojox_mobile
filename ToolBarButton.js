define([
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"./iconUtils",
	"./sniff",
	"./_ItemBase"
], function(declare, win, domClass, domConstruct, domStyle, iconUtils, has, ItemBase){
/*=====
	var ItemBase = dojox.mobile._ItemBase;
=====*/

	// module:
	//		dojox/mobile/ToolBarButton
	// summary:
	//		A button widget that is placed in the Heading widget.

	return declare("dojox.mobile.ToolBarButton", ItemBase, {
		// summary:
		//		A button widget that is placed in the Heading widget.
		// description:
		//		ToolBarButton is a button that is placed in the Heading
		//		widget. It is a subclass of dojox.mobile._ItemBase just like
		//		ListItem or IconItem. So, unlike Button, it has basically the
		//		same capability as ListItem or IconItem, such as icon support,
		//		transition, etc.

		// selected: Boolean
		//		If true, the button is in the selected status.
		selected: false,

		// arrow: String
		//		Specifies "right" or "left" to be an arrow button.
		arrow: "",

		baseClass: "mblToolBarButton",

		defaultColor: "mblColorDefault",
		selColor: "mblColorDefaultSel",

		_disableTimerSelection: true, // overrides _ItemBase.js

		buildRendering: function(){
			this.inherited(arguments);

			if(!this.label){
				this.label = this.domNode.innerHTML;
			}
			this.domNode.innerHTML = "";

			if(this.arrow === "left" || this.arrow === "right"){
				this.arrowNode = domConstruct.create("div", {className:"mblToolBarButtonArrow"}, this.domNode);
				domClass.add(this.domNode, "mblToolBarButton" +
					(this.arrow === "left" ? "Left" : "Right") + "Arrow");
			}
			this.bodyNode = domConstruct.create("div", {className:"mblToolBarButtonBody"}, this.domNode);
			this.tableNode = domConstruct.create("table", {cellPadding:"0",cellSpacing:"0",border:"0"}, this.bodyNode);

			var row = this.tableNode.insertRow(-1);
			this.iconParentNode = row.insertCell(-1);
			this.labelNode = row.insertCell(-1);
			this.iconParentNode.className = "mblToolBarButtonIcon";
			this.labelNode.className = "mblToolBarButtonLabel";

			if(this.icon && this.icon !== "none" && this.label){
				domClass.add(this.bodyNode, "mblToolBarButtonLabeledIcon");
			}

			domClass.add(this.bodyNode, this.defaultColor);
			var _this = this;
			setTimeout(function(){ // for programmatic instantiation
				_this._updateArrowColor();
			}, 0);
			if(!has("webkit")){
				setTimeout(function(){ // compat mode browsers need this
					_this._updateArrowColor();
				}, 1000);
			}
			if(this.selected){
				this.select();
			}

			this._clickHandle = this.connect(this.domNode, "onclick", "_onClick");
			this._keydownHandle = this.connect(this.domNode, "onkeydown", "_onClick");
			this._onTouchStartHandle = this.connect(this.domNode, has('touch') ? "ontouchstart" : "onmousedown", "_onTouchStart");
		},

		startup: function(){
			if(!this._isOnLine){
				this.inheritParams();
				this.set("icon", this.icon);
			}
		},

		select: function(){
			// summary:
			//		Makes this widget in the selected state.
			if(arguments[0]){ // deselect
				domClass.replace(this.bodyNode, this.defaultColor, this.selColor);
			}else{ // select
				domClass.replace(this.bodyNode, this.selColor, this.defaultColor);
			}
			this._updateArrowColor();
			this.selected = !arguments[0];
		},

		deselect: function(){
			// summary:
			//		Makes this widget in the deselected state.
			this.select(true);
		},
	
		_updateArrowColor: function(){
			if(this.arrowNode && !has("ie")){
				var s = domStyle.get(this.bodyNode, "backgroundImage");
				domStyle.set(this.arrowNode, "backgroundImage",
							 s.replace(/\(top,/, "(top left,") // webkit new
							 .replace(/0% 0%, 0% 100%/, "0% 0%, 100% 100%") // webkit old
							 .replace(/50% 0%/, "0% 0%") // moz
							 .replace(/0\.5/, "0.45")); // adjust color-stop
			}
		},

		_onTouchStart: function(e){
			if(!this._onTouchEndHandle){
				this._onTouchEndHandle = this.connect(this.domNode, has('touch') ? "ontouchend" : "onmouseleave", "_onTouchEnd");
			}
			this.select();
		},

		_onTouchEnd: function(e){
			var _this = this;
			this._timer = setTimeout(function(){
				// webkit mobile has no onmouseleave, so we have to use touchend instead,
				// but we don't know if onclick comes or not after touchend,
				// therefore we need to delay deselecting the button, otherwise, the button blinks.
				_this.deselect();
			}, this._duration / 2);
			this.disconnect(this._onTouchEndHandle);
			this._onTouchEndHandle = null;
		},
	
		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(this.onClick(e) === false){ return; } // user's click action
			if(e && e.type === "keydown" && e.keyCode !== 13){ return; }
			if(this._timer){
				clearTimeout(this._timer);
				this._timer = null;
			}
			if(this._onTouchEndHandle){
				this.disconnect(this._onTouchEndHandle);
				this._onTouchEndHandle = null;
			}
			this.setTransitionPos(e);
			this.defaultClickAction();
			this.deselect();
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},
	
		_setLabelAttr: function(/*String*/text){
			this.inherited(arguments);
			domClass.toggle(this.tableNode, "mblToolBarButtonText", text);
		}
	});
});
