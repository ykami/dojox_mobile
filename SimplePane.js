define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/dom-class",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase"
], function(array, declare, domClass, Contained, Container, WidgetBase){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/SimplePane
	// summary:
	//		A pane widget that is used in a dojox.mobile.FixedSplitter.

	return declare("dojox.mobile.SimplePane", [WidgetBase, Container, Contained], {
		// summary:
		//		A simple container-type pane widget.
		// description:
		//		SimplePane is a pane widget that can be used for any purposes.
		//		It is a widget, but can be regarded as a simple <div> element.

		baseClass: "mblSimplePane",

		resize: function(){
			array.forEach(this.getChildren(), function(child){
				if(child.resize){ child.resize(); }
			});
		}
	});
});
