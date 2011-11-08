define([
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase"
], function(declare, domConstruct, Contained, Container, WidgetBase){

/*=====
	var IconItemPane = dojox.mobile._IconItemPaneContainer
=====*/

	// module:
	//		dojox/mobile/_IconItemPaneContainer
	// summary:
	//		An internal widget used from IconItem.

	return declare("dojox.mobile._IconItemPaneContainer", [WidgetBase, Container, Contained], {
		baseClass: "mblIconItemPaneContainer",

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || domConstruct.create("ul");
			this.inherited(arguments);
		}
	});
});
