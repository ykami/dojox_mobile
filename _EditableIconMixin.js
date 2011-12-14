
// experimental, still work-in-progress

define([
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dijit/registry",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./IconItem",
	"./sniff"
], function(array, connect, declare, event, lang, win, domClass, domGeometry, domStyle, registry, Contained, Container, WidgetBase, IconItem, has){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
=====*/

	// module:
	//		dojox/mobile/_EditableIconMixin
	// summary:
	//		A mixin for IconContainer so it can be editable.

	return declare("dojox.mobile._EditableIconMixin", null, {
		// summary:
		//		A mixin for IconContainer so it can be editable.
		// description:
		//		
		
		deleteIconForEdit: "mblDomButtonBlackCircleCross",
		threshold: 4, // drag threshold value in pixels
		
		startEdit: function(){
			if(!this.editable){ return; }
			
			this._editing = true;
			
			var count = 0;
			array.forEach(this.getChildren(), function(w){
				setTimeout(lang.hitch(this, function(){
					w.set("deleteIcon", this.deleteIconForEdit);
					w.highlight(0);
				}), 15*count++);
			}, this);
			
			connect.publish("/dojox/mobile/startEdit", [this]); // pubsub
			this.onStartEdit(); // callback
		},
		
		endEdit: function(){
			array.forEach(this.getChildren(), function(w){
				w.unhighlight();
				w.set("deleteIcon", "");
			});
			
			this._editing = false;
			this._movingItem = null;
			
			connect.publish("/dojox/mobile/endEdit", [this]); // pubsub
			this.onEndEdit(); // callback
		},
		
		scaleItem: function(/*Widget*/widget, /*Number*/ratio){
			domStyle.set(widget.domNode, {
				webkitTransition: has("android") ? "" : "-webkit-transform .1s ease-in-out",
				webkitTransform: ratio == 1 ? "" : "scale(" + ratio + ")"
			});			
		},
		
		onTransitionStart: function(e){
			event.stop(e);
		},
		
		onTransitionEnd: function(e){
			event.stop(e);
			var w = registry.getEnclosingWidget(e.target);
			w._moving = false;
			domStyle.set(w.domNode, {
				webkitTransition: ""
			});
		},
		
		onTouchStart: function(e){
			if(!this._blankItem){
				this._blankItem = new IconItem();
				this._blankItem.domNode.style.visibility = "hidden";
				this._blankItem._onClick = function(){};
			}
			var item = this._movingItem = registry.getEnclosingWidget(e.target);
			var iconPressed = false;
			for(var n = e.target; n !== item.domNode; n = n.parentNode){
				if(n === item.iconNode){
					iconPressed = true;
					break;
				}
			}
			if(!iconPressed){ return; }
			
			if(!this._conn){
				this._conn = [];
				this._conn.push(this.connect(this.domNode, has('touch') ? "ontouchmove" : "onmousemove", "onTouchMove"));
				this._conn.push(this.connect(this.domNode, has('touch') ? "ontouchend" : "onmouseup", "onTouchEnd"));
			}
			this._touchStartPosX = e.touches ? e.touches[0].pageX : e.pageX;
			this._touchStartPosY = e.touches ? e.touches[0].pageY : e.pageY;
			if(this._editing){
				this.onDragStart(e);
			}else{
				// set timer to detect long press
				this._pressTimer = setTimeout(lang.hitch(this, function(){
					this.startEdit();
					this.onDragStart(e);
				}), 1000);
			}
		},
		
		onDragStart: function(e){
			this._dragging = true;
			
			var movingItem = this._movingItem;
			this.scaleItem(movingItem, 1.1);
			
			var x = e.touches ? e.touches[0].pageX : e.pageX;
			var y = e.touches ? e.touches[0].pageY : e.pageY;
			var startPos = this._startPos = domGeometry.position(movingItem.domNode, true);
			this._offsetPos = {
				x: startPos.x - x,
				y: startPos.y - y
			};
			
			this._startIndex = this.getIndexOfChild(movingItem);
			this.addChild(this._blankItem, this._startIndex);
			this.moveChild(movingItem, this.getChildren().length);
			domStyle.set(movingItem.domNode, {
				position: "absolute",
				top: startPos.y + "px",
				left: startPos.x + "px",
				zIndex: 100
			});
		},
		
		onTouchMove: function(e){
			var x = e.touches ? e.touches[0].pageX : e.pageX;
			var y = e.touches ? e.touches[0].pageY : e.pageY;
			if(this._dragging){
				domStyle.set(this._movingItem.domNode, {
					top: (this._offsetPos.y + y) + "px",
					left: (this._offsetPos.x + x) + "px"
				});
				this._detectOverlap({x: x, y: y});
				event.stop(e);
			}else{
				var dx = Math.abs(this._touchStartPosX - x);
				var dy = Math.abs(this._touchStartPosY - y);
				if (dx > this.threshold || dy > this.threshold) {
					this._clearPressTimer();					
				}
			}
		},
		
		onTouchEnd: function(e){
			this._clearPressTimer();
			if(this._conn){
				array.forEach(this._conn, this.disconnect, this);
				this._conn = null;				
			}
			
			if(this._dragging){
				this._dragging = false;
				
				var movingItem = this._movingItem;
				this.scaleItem(movingItem, 1.0);
				domStyle.set(movingItem.domNode, {
					position: "",
					top: "",
					left: "",
					zIndex: ""
				});
				var startIndex = this._startIndex;
				var endIndex = this.getIndexOfChild(this._blankItem);
				this.moveChild(movingItem, endIndex);
				this.removeChild(this._blankItem);
				connect.publish("/dojox/mobile/moveIconItem", [this, movingItem, startIndex, endIndex]); // pubsub
				this.onMoveItem(movingItem, startIndex, endIndex); // callback
			}
		},
		
		_clearPressTimer: function(){
			if(this._pressTimer){
				clearTimeout(this._pressTimer);
				this._pressTimer = null;
			}
		},
		
		_detectOverlap: function(/*Object*/point){
			var children = this.getChildren();
			for(var i=0; i<children.length-1; i++){ // TODO should make smarter algorithm
				var w = children[i];
				if(w._moving){ continue; }
				var pos = domGeometry.position(w.domNode, true);
				if(pos.x < point.x && point.x < pos.x + pos.w && pos.y < point.y && point.y < pos.y + pos.h){
					if(this._blankItem !== w){
						var moveIndex = this.getIndexOfChild(this._blankItem) < i ? i+1 : i;
						this.moveChildWithAnimation(this._blankItem, moveIndex);
					}
					break;
				}else if(pos.y > point.y){
					break;
				}
			}
		},
		
		_animate: function(/*Integer*/from, /*Integer*/to){
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
		},
		
		removeChildWithAnimation: function(/*Widget|Number*/widget){
			var index = (typeof widget === "number") ? widget : this.getIndexOfChild(widget);
			this.removeChild(widget);
			
			// Show remove animation
			this.addChild(this._blankItem);
			this._animate(index, this.getChildren().length - 1);
			this.removeChild(this._blankItem);
		},
		
		moveChild: function(/*Widget|Number*/widget, /*Number?*/insertIndex){
			this.addChild(widget, insertIndex);
			this.paneContainerWidget.addChild(widget.paneWidget, insertIndex);
		},
		
		moveChildWithAnimation: function(/*Widget|Number*/widget, /*Number?*/insertIndex){
			var index = this.getIndexOfChild(this._blankItem);
			this.moveChild(widget, insertIndex);
			
			// Show move animation
			this._animate(index, insertIndex);
		},
		
		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(this.onClick(e) === false){ return; } // user's click action
			var item = registry.getEnclosingWidget(e.target);
			if(item.deleteIconNode){
				for(var n = e.target; n !== item.domNode; n = n.parentNode){
					if(n === item.deleteIconNode){
						this.onDeleteIconClicked(e, item);
						break;
					}
				}
			}
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},
		
		deleteItem: function(item){
			this.removeChildWithAnimation(item);
			
			connect.publish("/dojox/mobile/deleteIconItem", [this, item]); // pubsub
			this.onDeleteItem(item); // callback
			
			item.destroy();
		},
		
		onDeleteIconClicked: function(/*Event*/e, /*Widget*/item){
			this.deleteItem(item);
		},
		
		onDeleteItem: function(/*Widget*/item){
			// Stub function to connect to from your application.
		},
		
		onMoveItem: function(/*Widget*/item, /*Integer*/from, /*Ingeter*/to){
			// Stub function to connect to from your application.
		},
		
		onStartEdit: function(){
			// Stub function to connect to from your application.
		},
		
		onEndEdit: function(){
			// Stub function to connect to from your application.
		},
		
		_setEditableAttr: function(/*Boolean*/editable){
			this.editable = editable;
			if(editable){
				if(!this._handles){
					this._handles = [];
					this._handles.push(this.connect(this.domNode, has('touch') ? "ontouchstart" : "onmousedown", "onTouchStart"));
					this._handles.push(this.connect(this.domNode, "onclick", "_onClick"));
					this._handles.push(this.connect(this.domNode, "webkitTransitionStart", "onTransitionStart"));
					this._handles.push(this.connect(this.domNode, "webkitTransitionEnd", "onTransitionEnd"));
				}
			}else{
				if(this._handles){
					array.forEach(this._handles, this.disconnect, this);
					this._handles = null;
				}
			}
		}
	});
});
