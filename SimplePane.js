define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dijit/_Contained",
	"dijit/_WidgetBase"
], function(array, declare, Contained, WidgetBase){

/*=====
	var Contained = dijit._Contained;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/SimplePane
	// summary:
	//		A simple div-wrapper pane widget.

	return declare("dojox.mobile.SimplePane", [WidgetBase, Contained], {
		// summary:
		//		A simple pane widget.
		// description:
		//		SimplePane is a pane widget that can be used for any purposes.
		//		It is a widget, but can be regarded as a simple <div> element.

		baseClass: "mblSimplePane",

		buildRendering: function(){
			this.inherited(arguments);
			if(!this.containerNode){
				// set containerNode so that getChildren() works
				this.containerNode = this.domNode;
			}
		},

		resize: function(){
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		}
	});
});
