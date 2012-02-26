define([
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/dom-class",
	"./Button"
], function(declare, domConstruct, domStyle, domClass, Button){
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
				dc = bc + (this.direction === "right" ? "Right" : "Left");
			domClass.add(this.domNode, dc);
			this.boxNode = domConstruct.create("div", {className:bc + "HeadBox"}, this.domNode, "first");
			this.headNode = domConstruct.create("div", {className:bc + "Head"}, this.boxNode);
		},

		startup: function(){
			this.inherited(arguments);
			var bh = Math.max(this.domNode.offsetHeight, 29),
				headOffset = Math.ceil(bh / 2 * 0.7) - 2,
				headSize = Math.floor((bh - 1) / Math.SQRT2);
			domStyle.set(this.domNode, {width: this.domNode.offsetWidth - headOffset + "px"});
			domStyle.set(this.boxNode, {width: headOffset+"px", height: bh+"px"});
			domStyle.set(this.headNode, {width: headSize+1+"px", height: headSize+"px"});
			if(this.direction === "left"){
				this.domNode.style.marginLeft = domStyle.get(this.domNode, "marginLeft") + headOffset + "px";
				this.boxNode.style.marginLeft = -(domStyle.get(this.domNode, "paddingLeft") + headOffset) + "px";
			}else{
				this.domNode.style.marginRight = domStyle.get(this.domNode, "marginRight") + headOffset + "px";
				this.boxNode.style.marginRight = -(domStyle.get(this.domNode, "paddingLeft") + headOffset) + "px";
			}
		}
	});
});
