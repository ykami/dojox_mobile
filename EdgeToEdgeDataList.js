define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"./EdgeToEdgeList",
	"./_DataListMixin"
], function(kernel, declare, EdgeToEdgeList, DataListMixin){

/*=====
	var EdgeToEdgeList = dojox.mobile.EdgeToEdgeList;
	var DataListMixin = dojox.mobile._DataListMixin;
=====*/

	// module:
	//		dojox/mobile/EdgeToEdgeDataList
	// summary:
	//		An enhanced version of EdgeToEdgeList.

	kernel.deprecated("dojox.mobile.EdgeToEdgeDataList is deprecated", "Use dojox.mobile.EdgeToEdgeStoreList instead", 2.0);
	return declare("dojox.mobile.EdgeToEdgeDataList", [EdgeToEdgeList, DataListMixin],{
		// summary:
		//		An enhanced version of EdgeToEdgeList.
		// description:
		//		EdgeToEdgeDataList is an enhanced version of EdgeToEdgeList. It
		//		can generate ListItems according to the given dojo.data store.
	});
});
