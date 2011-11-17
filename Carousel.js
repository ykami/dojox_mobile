define([
	"dojo/_base/kernel",
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/event",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dijit/registry",
	"dijit/_Contained",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"./lazyLoadUtils",
	"./_CarouselItem",
	"./PageIndicator",
	"./SwapView",
	"require"
], function(kernel, array, connect, declare, event, lang, has, domClass, domConstruct, domStyle, registry, Contained, Container, WidgetBase, lazyLoadUtils, CarouselItem, PageIndicator, SwapView, require){

/*=====
	var Contained = dijit._Contained;
	var Container = dijit._Container;
	var WidgetBase = dijit._WidgetBase;
	var PageIndicator = dojox.mobile.PageIndicator;
	var SwapView = dojox.mobile.SwapView;
=====*/

	// module:
	//		dojox/mobile/Carousel
	// summary:
	//		A carousel widget that manages a list of images

	kernel.experimental("dojox.mobile.Carousel");

	return declare("dojox.mobile.Carousel", [WidgetBase, Container, Contained], {
		// summary:
		//		A carousel widget that manages a list of images
		// description:
		//		The carousel widget manages a list of images that can be
		//		displayed horizontally, and allows the user to scroll through
		//		the list and select a single item.

		// numVisible: Number
		//		The number of visible items.
		numVisible: 3,

		// title: String
		//		A title of the carousel to be displayed on the title bar.
		title: "",

		// pageIndicator: Boolean
		//		If true, a page indicator, a series of small dots that indicate
		//		the current page, is displayed on the title bar.
		pageIndicator: true,

		// navButton: Boolean
		//		If true, navigation buttons are displyed on the title bar.
		navButton: false,

		// height: String
		//		Explicitly specified height of the widget (ex. "300px"). If
		//		"inherit" is specified, the height is inherited from its offset
		//		parent.
		height: "", /* 1.8 */

		// store: Object
		//		Reference to data provider object used by this widget.
		store: null,

		// query: Object
		//		A query that can be passed to 'store' to initially filter the
		//		items.
		query: null,

		// queryOptions: Object
		//		An optional parameter for the query.
		queryOptions: null,

		selectable: true,

		baseClass: "mblCarousel",

		buildRendering: function(){
			this.inherited(arguments);

			var h;
			if(this.height === "inherit"){
				if(this.domNode.offsetParent){
					h = this.domNode.offsetParent.offsetHeight + "px";
				}
			}else if(this.height){
				h = this.height;
			}
			if(h){ /* 1.8 */
				this.domNode.style.height = h;
			}
			this.headerNode = domConstruct.create("div", {className:"mblCarouselHeaderBar"}, this.domNode);

			if(this.navButton){
				this.btnContainerNode = domConstruct.create("div", {
					className: "mblCarouselBtnContainer"
				}, this.headerNode);
				domStyle.set(this.btnContainerNode, "float", "right"); // workaround for webkit rendering problem
				this.prevBtnNode = domConstruct.create("button", {
					className: "mblCarouselBtn",
					title: "Previous",
					innerHTML: "&lt;"
				}, this.btnContainerNode);
				this.nextBtnNode = domConstruct.create("button", {
					className: "mblCarouselBtn",
					title: "Next",
					innerHTML: "&gt;"
				}, this.btnContainerNode);
				this.connect(this.prevBtnNode, "onclick", "onPrevBtnClick");
				this.connect(this.nextBtnNode, "onclick", "onNextBtnClick");
			}

			if(this.pageIndicator){
				if(!this.title){
					this.title = "&nbsp;";
				}
				this.piw = new PageIndicator();
				domStyle.set(this.piw, "float", "right"); // workaround for webkit rendering problem
				this.headerNode.appendChild(this.piw.domNode);
			}

			this.titleNode = domConstruct.create("div", {
				className: "mblCarouselTitle"
			}, this.headerNode);

			this.containerNode = domConstruct.create("div", {className:"mblCarouselPages"}, this.domNode);
			this.subscribe("/dojox/mobile/viewChanged", "handleViewChanged");
			this.connect(this.domNode, "onclick", "_onClick");
			this.connect(this.domNode, "onkeydown", "_onClick");
			this.connect(this.domNode, "ondragstart", event.stop);
		},

		startup: function(){
			if(this._started){ return; }
			if(this.store){
				var store = this.store;
				this.store = null;
				this.setStore(store, this.query, this.queryOptions);
			}
			this.inherited(arguments);
		},

		setStore: function(store, query, queryOptions){
			// summary:
			//		Sets the store to use with this widget.
			if(store === this.store){ return; }
			this.store = store;
			this.query = query;
			this.queryOptions = queryOptions;
			this.refresh();
		},

		refresh: function(){
			if(!this.store){ return; }
			this.store.fetch({
				query: this.query,
				queryOptions: this.queryOptions,
				onComplete: lang.hitch(this, "generate"),
				onError: lang.hitch(this, "onError")
			});
		},

		_createMarkup: function(/*String*/type, /*String*/props, /*Object*/item){
			if(!type){ return ""; }
			var width = item.width || (90/this.numVisible + "%");
			var h = this.domNode.offsetHeight - (this.headerNode ? this.headerNode.offsetHeight : 0);
			var height = item.height || h + "px";
			var m = has("ie") ? 5/this.numVisible-1 : 5/this.numVisible;
			var margin = item.margin || (m + "%");

			var ml = '<div class="mblCarouselBox"' +
			' style="width:' + width + ';height:' + height +
			';margin:0 ' + margin + '"' +
			' data-dojo-type="' + type + '"';
			if(props){
				ml += ' data-dojo-props=\'' + props + '\'';
			}
			ml += '></div>\n';

			return ml;
		},

		fillPages: function(){
			array.forEach(this.getChildren(), function(child, i){
				var s = "";
				for(var j = 0; j < this.numVisible; j++){
					var type = "", props = "";
					var idx = i * this.numVisible + j;
					var item = {};
					if(idx < this.items.length){
						item = this.items[idx];
						type = this.store.getValue(item, "type");
						if(type){
							props = this.store.getValue(item, "props");
						}else{
							type = "dojox.mobile._CarouselItem";
							array.forEach(["src", "headerText", "footerText"], function(p){
								var v = this.store.getValue(item, p);
								if(v !== undefined){
									if(props){ props += ','; }
									props += p + ':"' + v + '"';
								}
							}, this);
						}
					}else{
						type = "dojox.mobile._CarouselItem";
						props = 'src:"' + require.toUrl("dojo/resources/blank.gif") + '"';
					}
					s += this._createMarkup(type, props, item);
				}
				child.containerNode.innerHTML = s;
			}, this);
		},

		generate: function(/*Array*/items, /*Object*/ dataObject){
			array.forEach(this.getChildren(), function(child){
				if(child instanceof SwapView){
					child.destroyRecursive();
				}
			});
			this.items = items;
			var nPages = Math.ceil(items.length / this.numVisible),
				h = this.domNode.offsetHeight - this.headerNode.offsetHeight,
				i;
			for(i = 0; i < nPages; i++){
				var w = new SwapView({height:h+"px"});
				this.addChild(w);
				if(i === 0 && this.piw){
					this.piw.refId = w.id;
					this.currentView = w;
				}
			}
			if(this.piw){
				this.piw.reset();
			}
			this.fillPages();
			var children = this.getChildren();
			for(i = 0; i < 2 && i < nPages; i++){
				this.instantiateView(children[i]);
			}
		},

		createBox: function(item, h){
			var width = item.width || (90/this.numVisible + "%");
			var height = item.height || h + "px";
			var m = has("ie") ? 5/this.numVisible-1 : 5/this.numVisible;
			var margin = item.margin || (m + "%");
			var box = domConstruct.create("div", {
				className: "mblCarouselBox"
			});
			domStyle.set(box, {
				margin: "0px " + margin,
				width: width,
				height: height
			});
			return box;
		},

		getIndexByItemWidget: function(/*Widget*/w){
			var children = this.getChildren();
			for(var i = 0; i < children.length; i++){
				var items = children[i].getChildren();
				for(var j = 0; j < items.length; j++){
					var item = items[j];
					if(w === item){
						return i * this.numVisible + j;
					}
				}
			}
			return -1;
		},

		onError: function(errText){
		},

		onPrevBtnClick: function(e){
			if(this.currentView){
				this.currentView.goTo(-1);
			}
		},

		onNextBtnClick: function(e){
			if(this.currentView){
				this.currentView.goTo(1);
			}
		},

		_onClick: function(e){
			if(e && e.type === "keydown" && e.keyCode !== 13){ return; }
			var w;
			for(w = registry.getEnclosingWidget(e.target); ; w = w.getParent()){
				if(!w){ return; }
				if(w.getParent() instanceof SwapView){ break; }
			}
			if(this.selectable){
				if(this.selectedItem){
					if(this.selectedItem.deselect){
						this.selectedItem.deselect();
					}
					domClass.remove(this.selectedItem.domNode, "mblCarouselItemSelected");
				}
				if(w.select){
					w.select();
				}
				domClass.add(w.domNode, "mblCarouselItemSelected");
				this.selectedItem = w;
			}
			var idx = this.getIndexByItemWidget(w);
			connect.publish("/dojox/mobile/carouselSelect", [this, w, this.items[idx], idx]);
		},

		instantiateView: function(view){
			if(view && !view._instantiated){
				var isHidden = (domStyle.get(view.domNode, "display") === "none");
				if(isHidden){
					domStyle.set(view.domNode, {visibility:"hidden", display:""});
				}
				lazyLoadUtils.instantiateLazyWidgets(view.containerNode, null, function(root){
					if(isHidden){
						domStyle.set(view.domNode, {visibility:"visible", display:"none"});
					}
				});
				view._instantiated = true;
			}
		},

		handleViewChanged: function(view){
			if(view.getParent() !== this){ return; }
			this.currentView = view;
			this.instantiateView(view.nextView(view.domNode));
		},

		_setTitleAttr: function(/*String*/title){
			this.title = title;
			this.titleNode.innerHTML = this._cv ? this._cv(title) : title;
		}
	});
});
