define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang", /* 1.8 */
	"dojo/_base/window",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dijit/registry",	// registry.byNode
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./IconItem2",
	"./Heading",
	"./View",
], function(array, declare, lang, win, domConstruct, domStyle, registry, Contained, Container, WidgetBase, IconItem2, Heading, View){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/IconContainer
	// summary:
	//		A container widget that holds multiple icons.

	return declare("dojox.mobile.IconContainer2", [WidgetBase, Container, Contained],{
		// summary:
		//		A container widget that holds multiple icons.
		// description:
		//		IconContainer is a container widget that holds multiple icons
		//		each of which represents application component.

		// defaultIcon: String
		//		The default fall-back icon, which is displayed only when the
		//		specified icon has failed to load.
		defaultIcon: "",

		// transition: String
		//		A type of animated transition effect. You can choose from the
		//		standard transition types, "slide", "fade", "flip", or from the
		//		extended transition types, "cover", "coverv", "dissolve",
		//		"reveal", "revealv", "scaleIn", "scaleOut", "slidev",
		//		"swirl", "zoomIn", "zoomOut". If "none" is specified, transition
		//		occurs immediately without animation. If "below" is specified,
		//		the application contents are displayed below the icons.
		transition: "below",

		// pressedIconOpacity: Number
		//		The opacity of the pressed icon image.
		pressedIconOpacity: 0.4,

		// iconBase: String
		//		The default icon path for child items.
		iconBase: "",

		// iconPos: String
		//		The default icon position for child items.
		iconPos: "",

		// back: String
		//		A label for the navigational control.
		back: "Home",

		// label: String
		//		A title text of the heading.
		label: "My Application",

		// single: Boolean
		//		If true, only one icon content can be opened at a time.
		single: false,

		// editable: Boolean
		//		If true, the icons can be removed or re-ordered.
		editable: false,

		editableMixinClass: "dojox/mobile/_EditableIconMixin",

		baseClass: "mblIconContainer",
		tag: "ul",
		iconItemPaneContainerClass: "dojox/mobile/_IconItemPaneContainer",
		iconItemPaneClass: "dojox/mobile/_IconItemPane",

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || domConstruct.create(this.tag);
			this._terminator = domConstruct.create("li", {className:"mblIconItemTerminator"}, this.domNode);
			this.inherited(arguments);
		},

		postCreate: function(){
			if(this.editable){
				require([this.editableMixinClass], lang.hitch(this, function(module){
					lang.mixin(this, new module());
				}));
			}
		},
	
		startup: function(){
			if(this._started){ return; }

			require([this.iconItemPaneContainerClass], lang.hitch(this, function(module){
				this.paneContainerWidget = new module();
				if(this.transition === "below"){
					domConstruct.place(this.paneContainerWidget.domNode, this.domNode, "after");
				}else{
					var view = this.appView = new View({id:this.id+"_mblApplView"});
					var _this = this;
					view.onAfterTransitionIn = function(moveTo, dir, transition, context, method){
						_this._opening._open_1();
					};
					view.domNode.style.visibility = "hidden";
					var heading = view._heading
						= new Heading({back: this._cv ? this._cv(this.back) : this.back,
										label: this._cv ? this._cv(this.label) : this.label,
										moveTo: this.domNode.parentNode.id,
										transition: this.transition == "zoomIn" ? "zoomOut" : this.transition}); /* 1.8 */
					view.addChild(heading);
					view.addChild(this.paneContainerWidget);

					var target;
					for(var w = this.getParent(); w; w = w.getParent()){
						if(w instanceof View){
							target = w.domNode.parentNode;
							break;
						}
					}
					if(!target){ target = win.body(); }
					target.appendChild(view.domNode);

					view.startup();
				}
			}));

			this.inherited(arguments);
		},

		closeAll: function(){
			// summary:
			//		Closes all the icon items.
			array.forEach(this.getChildren(), function(w){
				w.close(true); // disables closing animation
			}, this);
		},

		addChild: function(widget, /*Number?*/insertIndex){
			this.inherited(arguments);
			this.domNode.appendChild(this._terminator); // to ensure that _terminator is always the last node
		},

		removeChild: function(/*Widget|Number*/widget){
			var index = (typeof widget == "number") ? widget : widget.getIndexInParent();
			this.paneContainerWidget.removeChild(index);
			this.inherited(arguments);
		},	

		_setLabelAttr: function(/*String*/text){
			if(!this.appView){ return; }
			this.label = text;
			var s = this._cv ? this._cv(text) : text;
			this.appView._heading.set("label", s);
		}
	});
});
