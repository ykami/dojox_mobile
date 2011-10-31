define([
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dojo/dom-style",
	"./Button"
], function(declare, domConstruct, domStyle, Button){
	// module:
	//	dojox/mobile/ArrowButton
	// summary:
	//	ArrowButton widget
	return declare("dojox.mobile.ArrowButton", [Button], {
		// summary:
		//		Non-templated Arrow Button widget with a thin API wrapper for click events and setting the label
		//
		// description:
		//		Buttons can display a label, an icon, or both.
		//		A label should always be specified (through innerHTML) or the label
		//		attribute.  It can be hidden via showLabel=false.
		// example:
		//		<button dojoType="dojox.mobile.ArrowButton" onClick="...">Hello world</button>
		// limitations:
		//		This widget cannot be applied to <input> tag. 

		// arrow direction: "left" or "right"
		direction: "left",

		baseClass: "mblArrowButton",

		buildRendering: function(){
			this.inherited(arguments);
			var bc = this.baseClass,
				pc = this.domNode.className + " " + bc + (this.direction === "right" ? "Right" : "Left"),
				hn = domConstruct.create("div", {className:bc + "Head " + pc}, this.domNode, "first");
			domConstruct.create("div", {className:bc + "Neck " + pc}, hn, "after");
		},

		startup: function(){
			this.inherited(arguments);
			var headOffset = Math.max(Math.ceil(this.domNode.offsetHeight / 2), 15);
			// var headOffset = Math.ceil(this.domNode.offsetHeight / 2;
			this.domNode.style.width = this.domNode.offsetWidth - headOffset + "px";
			if(this.direction === "left"){
				this.domNode.style.marginLeft = domStyle.get(this.domNode, "marginLeft") + headOffset + "px";
				this.domNode.style.borderLeft = "none";
			}else{
				this.domNode.style.marginRight = domStyle.get(this.domNode, "marginRight") + headOffset + "px";
				this.domNode.style.borderRight = "none";
			}
		}
	});
});
