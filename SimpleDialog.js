define([
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/dom-construct",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./iconUtils"
], function(declare, win, domConstruct, Contained, Container, WidgetBase, iconUtils){
	// module:
	//		dojox/mobile/SimpleDialog
	// summary:
	//		TODOC

	return declare("dojox.mobile.SimpleDialog", [WidgetBase, Container, Contained], {
		title: "",
		top: "auto",
		left: "auto",
		modal: true,
		closeButton: false,
		closeButtonClass: "mblDomButtonSilverCircleRedCross",

		buildRendering: function(){
			this.containerNode = domConstruct.create("div", {className:"mblSimpleDialogContainer"});
			if(this.srcNodeRef){
				// reparent
				for(var i = 0, len = this.srcNodeRef.childNodes.length; i < len; i++){
					this.containerNode.appendChild(this.srcNodeRef.removeChild(this.srcNodeRef.firstChild));
				}
			}
			this.domNode = this.srcNodeRef || domConstruct.create("div");
			this.domNode.className = "mblSimpleDialog mblSimpleDialogDecoration";
			this.domNode.style.display = "none";
			this.domNode.appendChild(this.containerNode);
			if(this.closeButton){
				this.closeButtonNode = domConstruct.create("div", {
					className: "mblSimpleDialogCloseBtn "+this.closeButtonClass
				}, this.domNode);
				iconUtils.createDomButton(this.closeButtonNode);
				this._clickHandle = this.connect(this.closeButtonNode, "onclick", "_onClick");
			}
		},

		startup: function(){
			if(this._started){ return; }
			this.inherited(arguments);
		},

		addCover: function(){
			if(!this._cover){
				this._cover = domConstruct.create("div", {
					className: "mblSimpleDialogCover"
				}, win.body());
			}else{
				this._cover.style.display = "";
			}
		},

		removeCover: function(){
			this._cover.style.display = "none";
		},

		_onClick: function(e){
			this.hide();
		},

		refresh: function(){ // TODO: should we call refresh on resize?
			var n = this.domNode;
			if(this.closeButton){
				var b = this.closeButtonNode;
				var s = Math.round(b.offsetHeight / 2);
				b.style.top = -s + "px";
				b.style.left = n.offsetWidth - s + "px";
			}
			if(this.top === "auto"){
				var h = win.global.innerHeight || win.doc.documentElement.clientHeight;
				n.style.top = Math.round((h - n.offsetHeight) / 2) + "px";
			}else{
				n.style.top = this.top;
			}
			if(this.left === "auto"){
				var h = win.global.innerWidth || win.doc.documentElement.clientWidth;
				n.style.left = Math.round((h - n.offsetWidth) / 2) + "px";
			}else{
				n.style.left = this.left;
			}
		},

		show: function(){
			if(this.domNode.style.display === ""){ return; }
			if(this.modal){
				this.addCover();
			}
			this.domNode.style.display = "";
			this.refresh();
		},

		hide: function(){
			if(this.domNode.style.display === "none"){ return; }
			this.domNode.style.display = "none";
			if(this.modal){
				this.removeCover();
			}
		}
	});
});
