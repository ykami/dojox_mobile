define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/dom-class",
	"dijit/_Contained",
	"dijit/_WidgetBase"
], function(array, declare, win, domClass, Contained, WidgetBase){

/*=====
	var Contained = dijit._Contained;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/RoundRect
	// summary:
	//		A simple round rectangle pane.

	return declare("dojox.mobile.RoundRect", [WidgetBase, Contained], {
		// summary:
		//		A simple round rectangle pane.
		// description:
		//		RoundRect is a simple round rectangle pane for any HTML
		//		and/or widgets. You can achieve the same appearance by just
		//		applying the -webkit-border-radius style to a div tag. However,
		//		if you use RoundRect, you can get a round rectangle even on
		//		non-CSS3 browsers such as (older) IE.

		// shadow: Boolean
		//		If true, adds a shadow effect to the pane element.
		shadow: false,

		baseClass: "mblRoundRect",

		buildRendering: function(){
			this.inherited(arguments);
			if(this.shadow){
				domClass.add(this.domNode, "mblShadow");
			}
		},

		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		}
	});
});
