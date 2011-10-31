define([
	"dojo/_base/declare",
	"dojo/_base/sniff",
	"dojox/mobile/Audio"
], function(declare, has, Audio){
	// module:
	//		dojox/mobile/Video
	// summary:
	//		TODOC

	return declare("dojox.mobile.Video", Audio, {
		width: "200px", //TODO: proper default value
		height: "150px", //TODO: proper default value
		_tag: "video",

		_getEmbedRegExp: function(){
			return has('ff') ? /video\/mp4/i :
				   has.isIE >= 9 ? /video\/webm/i :
				   //has("safari") ? /video\/webm/i : //Google is gooing to provide webm plugin for safari
				   null;
		}
	});
});
