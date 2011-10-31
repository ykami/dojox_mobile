define([
	"dojo/_base/array",
	"dojo/_base/connect", /* 1.8 */
	"dojo/_base/declare",
	"dojo/_base/lang", /* 1.8 */
	"dojo/_base/window",
	"dojo/dom-construct",
	"dojo/dom-geometry", /* 1.8 */
	"dojo/dom-style",
	"dijit/registry",	// registry.byNode
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./IconItem",
	"./Heading",
	"./View"
], function(array, connect, declare, lang, win, domConstruct, domGeometry, domStyle, registry, Contained, Container, WidgetBase, IconItem, Heading, View){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/IconContainer
	// summary:
	//		A container widget that holds multiple icons.

	return declare("dojox.mobile.IconContainer", [WidgetBase, Container, Contained],{
		// summary:
		//		A container widget that holds multiple icons.
		// description:
		//		IconContainer is a container widget that holds multiple icons
		//		each of which represents application component.

		// defaultIcon: String
		//		The default fall-back icon, which is displayed only when the
		//		specified icon has failed to load.
		defaultIcon: "",

		// transition: String
		//		A type of animated transition effect. You can choose from the
		//		standard transition types, "slide", "fade", "flip", or from the
		//		extended transition types, "cover", "coverv", "dissolve",
		//		"reveal", "revealv", "scaleIn", "scaleOut", "slidev",
		//		"swirl", "zoomIn", "zoomOut". If "none" is specified, transition
		//		occurs immediately without animation. If "below" is specified,
		//		the application contents are displayed below the icons.
		transition: "below",

		// pressedIconOpacity: Number
		//		The opacity of the pressed icon image.
		pressedIconOpacity: 0.4,

		// iconBase: String
		//		The default icon path for child items.
		iconBase: "",

		// iconPos: String
		//		The default icon position for child items.
		iconPos: "",

		// back: String
		//		A label for the navigational control.
		back: "Home",

		// label: String
		//		A title text of the heading.
		label: "My Application",

		// single: Boolean
		//		If true, only one icon content can be opened at a time.
		single: false,
		editable: false, /* 1.8 */

		buildRendering: function(){
			this.domNode = this.containerNode = this.srcNodeRef || win.doc.createElement("ul");
			this.domNode.className = "mblIconContainer";
			var t = this._terminator = domConstruct.create("li");
			t.className = "mblIconItemTerminator";
			t.innerHTML = "&nbsp;";
			this.domNode.appendChild(t);
		},

		_setupSubNodes: function(ul){
			array.forEach(this.getChildren(), function(w){
				ul.appendChild(w.subNode);
			});
		},

		startup: function(){
			if(this._started){ return; }
			if(this.transition === "below"){
				this._setupSubNodes(this.domNode);
			}else{
				var view = this.appView = new View({id:this.id+"_mblApplView"});
				var _this = this;
				view.onAfterTransitionIn = function(moveTo, dir, transition, context, method){
					_this._opening._open_1();
				};
				view.domNode.style.visibility = "hidden";
				var heading = view._heading
					= new Heading({back: this._cv ? this._cv(this.back) : this.back,
									label: this._cv ? this._cv(this.label) : this.label,
									moveTo: this.domNode.parentNode.id,
									transition: this.transition == "zoomIn" ? "zoomOut" : this.transition}); /* 1.8 */
				view.addChild(heading);
				var ul = view._ul = win.doc.createElement("ul");
				ul.className = "mblIconContainer";
				ul.style.marginTop = "0px";
				this._setupSubNodes(ul);
				view.domNode.appendChild(ul);

				var target;
				for(var w = this.getParent(); w; w = w.getParent()){
					if(w instanceof View){
						target = w.domNode.parentNode;
						break;
					}
				}
				if(!target){ target = win.body(); }
				target.appendChild(view.domNode);

				view.startup();
			}
			this.inherited(arguments);
		},

		closeAll: function(){
			// summary:
			//		Closes all the icon items.
			var len = this.domNode.childNodes.length, child, w;
			for(var i = 0; i < len; i++){
				var child = this.domNode.childNodes[i];
				if(child.nodeType !== 1){ continue; }
				if(child === this._terminator){ break; }
				var w = registry.byNode(child);
				w.containerNode.parentNode.style.display = "none";
				domStyle.set(w.iconNode, "opacity", 1);
			}
		},

		addChild: function(widget, /*Number?*/insertIndex){
			var children = this.getChildren();
			if(typeof insertIndex !== "number" || insertIndex > children.length){
				insertIndex = children.length;
			}
			var idx = insertIndex;
			var refNode = this.containerNode;
			if(idx > 0){
				refNode = children[idx - 1].domNode;
				idx = "after";
			}
			domConstruct.place(widget.domNode, refNode, idx);

			widget.transition = this.transition;
			if(this.transition === "below"){
				for(var i = 0, refNode = this._terminator; i < insertIndex; i++){
					refNode = refNode.nextSibling;
				}
				domConstruct.place(widget.subNode, refNode, "after");
			}else{
				domConstruct.place(widget.subNode, this.appView._ul, insertIndex);
			}
			widget.inheritParams();
			widget._setIconAttr(widget.icon);

			if(this._started && !widget._started){
				widget.startup();
			}
		},
		
		removeChild: function(/*Widget|Number*/widget){
			if(typeof widget === "number"){
				widget = this.getChildren()[widget];
			}
			if(widget){
				this.inherited(arguments);
				if(this.transition === "below"){
					this.containerNode.removeChild(widget.subNode);
				}else{
					this.appView._ul.removeChild(widget.subNode);
				}
			}
		},
		
		removeChildWithAnimation: function(/*Widget|Number*/widget){ /* 1.8 */
			var index = (typeof widget === "number") ? widget : this.getIndexOfChild(widget);
			this.removeChild(widget);
			// Show remove animation
			this.addChild(this._dummyItem);
			this._animate(index, this.getChildren().length - 1);
			this.removeChild(this._dummyItem);
		},
		
		moveChild: function(/*Widget|Number*/widget, /*Number?*/insertIndex){ /* 1.8 */
			this.removeChild(widget);
			this.addChild(widget, insertIndex);
		},
		
		moveChildWithAnimation: function(/*Widget|Number*/widget, /*Number?*/insertIndex){ /* 1.8 */
			var index = this.getIndexOfChild(this._dummyItem);
			this.moveChild(widget, insertIndex);
			// Show move animation
			this._animate(index, insertIndex);
		},

		onRemoveIconClicked: function(/*Event*/e, /*Widget*/item){ /* 1.8 */
			item.remove();
		},

		onRemoveItem: function(/*Widget*/item){ /* 1.8 */
			// Stub function to connect to from your application.
		},

		onMoveItem: function(/*Widget*/item, /*Integer*/from, /*Ingeter*/to){ /* 1.8 */
			// Stub function to connect to from your application.
		},

		onStartEdit: function(){ /* 1.8 */
			// Stub function to connect to from your application.
		},

		onEndEdit: function(){ /* 1.8 */
			// Stub function to connect to from your application.
		},

		startEdit: function(){ /* 1.8 */
			if(!this.editable){ return; }
			
			this._editing = true;
			if(!this._dummyItem){
				this._dummyItem = new dojox.mobile.IconItem();
				this._dummyItem.iconNode.style.visibility = "hidden";
			}
			var i = 0;
			array.forEach(this.getChildren(), function(w){
				setTimeout(function(){
					w.startEdit();
				}, 15*i++);
			});
			
			connect.publish("/dojox/mobile/startEdit", [this]); // pubsub
			this.onStartEdit(); // callback
		},

		endEdit: function(){ /* 1.8 */
			if(!this.editable){ return; }
			
			array.forEach(this.getChildren(), function(w){
				w.endEdit();
			});
			this._editing = false;
			this._currentItem = null;
			
			connect.publish("/dojox/mobile/endEdit", [this]); // pubsub
			this.onEndEdit(); // callback
		},

		_detectOverlap: function(/*Object*/point){ /* 1.8 */
			var children = this.getChildren();
			for(var i=0; i<children.length-1; i++){
				var w = children[i];
				if(w._moving){ continue; }
				var pos = domGeometry.position(w.domNode, true);
				if(pos.x < point.x && point.x < pos.x + pos.w && pos.y < point.y && point.y < pos.y + pos.h){
					if(this._currentItem === w){ break; }
					this._currentItem = w;
					this.moveChildWithAnimation(this._dummyItem, i);
					break;
				}else if(pos.y > point.y){
					break;
				}
			}
		},

		_animate: function(/*Integer*/from, /*Integer*/to){ /* 1.8 */
			if(from == to) { return; }
			var dir = from < to ? 1 : -1;
			var children = this.getChildren();
			var posArray = [];
			for(var i=from; i!=to; i+=dir){
				posArray.push({
					t: (children[i+dir].domNode.offsetTop - children[i].domNode.offsetTop) + "px",
					l: (children[i+dir].domNode.offsetLeft - children[i].domNode.offsetLeft) + "px"
				});
			}
			for(var i=from, j=0; i!=to; i+=dir, j++){
				var w = children[i];
				w._moving = true;
				domStyle.set(w.domNode, {
					top: posArray[j].t,
					left: posArray[j].l
				});
				setTimeout(lang.hitch(w, function(){
					domStyle.set(this.domNode, {
						webkitTransition: "top .3s ease-in-out, left .3s ease-in-out",
						top: "0px",
						left: "0px"
					});
				}), j*10);
			}
		}
	});
});
