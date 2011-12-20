define([
	"dojo/_base/declare",
	"dijit/_Container",
	"./SimplePane"
], function(declare, Container, SimplePane){

/*=====
	var Container = dijit._Container;
=====*/

	// module:
	//		dojox/mobile/SimpleContainer
	// summary:
	//		A simple container-type container widget.

	return declare("dojox.mobile.SimpleContainer", [SimplePane, Container], {
		// summary:
		//		A simple container-type container widget.
		// description:
		//		SimpleContainer is a container widget that can be used for any purposes.
		//		It is a widget, but can be regarded as a simple <div> element.

		baseClass: "mblSimpleContainer"
	});
});
