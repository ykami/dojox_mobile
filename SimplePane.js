define([
	"dojo/_base/declare",
	"dijit/_Contained",
	"dijit/_WidgetBase"
], function(declare, Contained, WidgetBase){

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
		//		A simple container-type pane widget.
		// description:
		//		SimplePane is a pane widget that can be used for any purposes.
		//		It is a widget, but can be regarded as a simple <div> element.

		baseClass: "mblSimplePane"
	});
});
