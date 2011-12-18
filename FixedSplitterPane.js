define([
	"dojo/_base/kernel",
	"dojox/mobile/SimpleContainer"
], function(kernel, SimpleContainer){
	kernel.deprecated("dojox.mobile.FixedSplitterPane is deprecated", "Use dojox.mobile.SimpleContainer instead", 2.0);
	dojox.mobile.FixedSplitterPane = SimpleContainer;
	return SimpleContainer;
});
