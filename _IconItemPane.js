define([
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./iconUtils"
], function(declare, domConstruct, Contained, Container, WidgetBase, iconUtils){

/*=====
	var IconItemPane = dojox.mobile._IconItemPane
=====*/

	// module:
	//		dojox/mobile/_IconItemPane
	// summary:
	//		An internal widget used from IconItem.

	return declare("dojox.mobile._IconItemPane", [WidgetBase, Container, Contained], {
		label: "",
		closeIcon: "mblDomButtonBlueMinus",
		baseClass: "mblIconItemPane",

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || domConstruct.create("li");
			this.hide();
			this.closeHeaderNode = domConstruct.create("h2", {className:"mblIconItemPaneHeading"}, this.domNode);
			this.closeIconNode = domConstruct.create("div", {className:"mblIconItemPaneIcon"}, this.closeHeaderNode);
			this.labelNode = domConstruct.create("span", {className:"mblIconItemPaneTitle"}, this.closeHeaderNode);
			this.containerNode = domConstruct.create("div", {className:"mblContent"}, this.domNode);
			this.inherited(arguments);
		},

		show: function(){
			this.domNode.style.display = "";
		},

		hide: function(){
			this.domNode.style.display = "none";
		},

		isOpen: function(e){
			return this.domNode.style.display !== "none";
		},

		scrollIntoView: function(){
			this.domNode.scrollIntoView();
		},

		_setLabelAttr: function(/*String*/text){
			this.label = text;
			var s = this._cv ? this._cv(text) : text;
			this.labelNode.innerHTML = s;
		},

		_setCloseIconAttr: function(icon){
			this.closeIconNode = iconUtils.setIcon(icon, this.iconPos, this.closeIconNode, this.alt, this.closeHeaderNode);
			this.closeIcon = icon;
		}
	});
});
