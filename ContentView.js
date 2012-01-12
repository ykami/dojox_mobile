define([
	"dojo/_base/declare",
	"./View",
	"./ContentPane"
], function(declare, View, ContentPane){

	// module:
	//		dojox/mobile/ContentPane
	// summary:
	//		A widget widget that has ContentPane's capability

	return declare("dojox.mobile.ContentView", [View, ContentPane], {
		// summary:
		//		A widget widget that has ContentPane's capability
		baseClass: "mblView mblContentView"
	});
});
