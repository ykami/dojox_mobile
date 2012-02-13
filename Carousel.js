define([
	"dojo/_base/declare",
	"./_Carousel",
	"./_StoreMixin"
], function(declare, Carousel, StoreMixin){

/*=====
	var Carousel = dojox.mobile.Carousel;
	var StoreMixin = dojox.mobile._StoreMixin;
=====*/

	// module:
	//		dojox/mobile/Carousel
	// summary:
	//		A carousel widget with dojo.store support

	return declare("dojox.mobile.Carousel", [StoreMixin, Carousel],{
		// summary:
		//		A carousel widget with dojo.store support
	});
});
