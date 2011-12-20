
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//                         EXPERIMENTAL
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

define([
	"dojo/_base/declare",
	"./ContentPane",
	"./ScrollablePane"
], function(declare, ContentPane, ScrollablePane){

/*=====
	var Container = dijit._Container;
=====*/

	// module:
	//		dojox/mobile/ScrollableContentPane
	// summary:
	//		A scrollable content pane to embed an HTML fragment.

	return declare("dojox.mobile.ScrollableContentPane", [ContentPane, ScrollablePane], {
		// summary:
		//		A scrollable content pane to embed an HTML fragment.
		// description:
		//		ScrollableContentPane is a pane widget that inherits from
		//		both from ContentPane and ScrollablePane.

		baseClass: "mblScrollableContentPane"
	});
});
