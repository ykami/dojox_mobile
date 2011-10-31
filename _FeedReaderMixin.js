define([
	"dojo/_base/declare",
	"./ListItem"
], function(declare, ListItem){
	// module:
	//		dojox/mobile/_FeedReaderMixin
	// summary:
	//		TODOC

	return declare("dojox.mobile._FeedReaderMixin", null, {
		showContent: true,
		showDescription: false,
		enableNoContentFailSafe: true,

		createListItem: function(item){
			var store = this.store;
			var title = store.getLabel(item);
			var link = store.getValue(item, "link");
			var description = store.getValue(item, "description") || store.getValue(item, "summary");
			var content = store.getValue(item, "content:encoded") || store.getValue(item, "content");
			link = (link && link.href) || link || "";
			description = (description && description.text) || description || "";
			content = (content && content.text) || content || (this.enableNoContentFailSafe && description) || "";
			var txt = (link ? '<a href="' + link +'" class="mblFeedReaderMixinContentTitle">' + title + '</a>':
				'<div class="mblFeedReaderMixinContentTitle">' + title + '</div>') + '<br/>' + 
				(this.showDescription ? description : "") + (this.showContent ? content : "");
			var w = new ListItem({label:txt, variableHeight:true});
			item._widgetId = w.id;
			return w;
		}
	});
});
