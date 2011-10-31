define([
	"dojo/_base/declare",
	"./IconMenu"
], function(declare, IconMenu){
	// module:
	//		dojox/mobile/IconMenu
	// summary:
	//		TODOC

	return declare("dojox.mobile.GridLayout", IconMenu, {
		cols: 0,
		childItemClass: "mblGridItem",
		className: "mblGridLayout",
		_tags: "div",
		_createTerminator: true

	});
});
