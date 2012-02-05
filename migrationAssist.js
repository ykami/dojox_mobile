define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/ready",
	"dijit/_Container",
	"dijit/_WidgetBase",
	"dojox/mobile/_ItemBase",
	"dojox/mobile/common", 
	"dojox/mobile/FixedSplitterPane",
	"dojox/mobile/Heading",
	"dojox/mobile/iconUtils",
	"dojox/mobile/RoundRect",
	"dojox/mobile/TabBarButton",
	"dojox/mobile/ToolBarButton",
	"dojox/mobile/View"
], function(declare, lang, win, domClass, domConstruct, domStyle, ready, Container, WidgetBase, _ItemBase, mobile, FixedSplitterPane, Heading, iconUtils, RoundRect, TabBarButton, ToolBarButton, View){

	// module:
	//		dojox/mobile/migrationAssist
	// summary:
	//		Dojo Mobile 1.6/1.7 to 1.8 migration assistance.

	var migrationAssist = new function(){
		this.dispatch = function(/*String*/cls, /*Widget*/ w){
			var base = cls.replace(/.*\./, "");
			this["check" + base] && this["check" + base](w);
		};

		this.checkListItem = function(/*Widget*/ w){
			if(w.sync !== undefined || w.srcNodeRef && w.srcNodeRef.getAttribute("sync")){
				console.log('[MIG:fixed] ListItem: The sync property is no longer supported. (async always)');
			}
		};

		this.checkToolBarButton = function(/*Widget*/ w){
			if((w.class || "").indexOf("mblColor") === 0){
				console.log('[MIG:fixed] ToolBarButton: Use defaultColor="' + w.class + '" instead of class="' + w.class + '".');
				w.defaultColor = w.class;
				w.class = "";
				if(w.srcNodeRef){
					w.srcNodeRef.className = "";
				}
			}

			if((w.class || "").indexOf("mblDomButton") === 0){
				console.log('[MIG:fixed] ToolBarButton: Use icon="' + w.class + '" instead of class="' + w.class + '".');
				w.icon = w.class;
				w.class = "";
				if(w.srcNodeRef){
					w.srcNodeRef.className = "";
				}
			}
		};

		this.checkSwitch = function(/*Widget*/ w){
			if(w.class === "mblItemSwitch"){
				console.log('[MIG:fixed] Switch: class="mblItemSwitch" is no longer necessary.');
			}
		};

		this.checkFixedSplitter = function(/*Widget*/ w){
			// FixedSplitter.css has been moved from the themes/common folder
			// to a device theme folder such as themes/android.
			if(!this._fixedSplitter_css_checked){
				this._fixedSplitter_css_checked = true;
				var dummy = domConstruct.create("div", {
					className: "mblFixedSplitter"
				}, win.body());
				if(domStyle.get(dummy, "height") == 0){
					domConstruct.create("link", {
						href: "../themes/android/FixedSplitter.css",
						type: "text/css",
						rel: "stylesheet"
					}, win.doc.getElementsByTagName('head')[0]);
					console.log('[MIG:fixed] FixedSplitter.css does not seem to be loaded. Loaded it for you just now. It is in a device theme folder.');
				}
				win.body().removeChild(dummy);
				setTimeout(function(){
					w.resize();
				}, 1000);
			}
		};

		this.checkFixedSplitterPane = function(/*Widget*/ w){
			console.log('[MIG:fixed] FixedSplitterPane: Deprecated. Use dojox.mobile.Container instead.');
		};
	};

	WidgetBase.prototype.postMixInProperties = function(){
		migrationAssist.dispatch(this.declaredClass, this);
		dojo.forEach([FixedSplitterPane, Heading, RoundRect, TabBarButton, ToolBarButton, View], function(module){
			if(this.declaredClass !== module.prototype.declaredClass && this instanceof module){
				migrationAssist.dispatch(module.prototype.declaredClass, this);
			}
		}, this);

	};

	extendContainerFunction = function(obj) {
		lang.extend(obj, {
			addChild: function(){
				console.log('[MIG:fixed] ' + this.declaredClass + '(id='+this.id+'): Use placeAt() instead of addChild(), and call startup().');
				Container.prototype.addChild.apply(this, arguments);
			},
			removeChild: function(){
				console.log('[MIG:fixed] ' + this.declaredClass + '(id='+this.id+'): Use native removeChild() instead of removeChild().');
				Container.prototype.removeChild.apply(this, arguments);
			},
			hasChildren: function(){
				console.log('[MIG:fixed] ' + this.declaredClass + '(id='+this.id+'): Use getChildren().length instead of hasChildren().');
				return Container.prototype.hasChildren.apply(this, arguments);
			},
			_getSiblingOfChild: function(){
				console.log('[MIG:fixed] ' + this.declaredClass + '(id='+this.id+'): _getSiblingOfChild() is no longer supported.');
				return Container.prototype._getSiblingOfChild.apply(this, arguments);
			},
			getIndexOfChild: function(){
				console.log('[MIG:fixed] ' + this.declaredClass + '(id='+this.id+'): getIndexOfChild() is no longer supported.');
				return Container.prototype.getIndexOfChild.apply(this, arguments);
			}
		});
	};

	extendContainerFunction(Heading);
	extendContainerFunction(View);
	extendContainerFunction(RoundRect);
	extendContainerFunction(_ItemBase);


	extendSelectFunction = function(obj) {
		lang.extend(obj, {
			select: function(){
				console.log('[MIG:fixed] ' + this.declaredClass + '(id='+this.id+'): Use set("selected", boolean) instead of select/deselect.');
				obj.prototype.set("selected", !!arguments[0]);;
			},
			deselect: function(){
				this.select(true);
			}
		});
	};

	extendSelectFunction(ToolBarButton);
	extendSelectFunction(TabBarButton);

	lang.mixin(mobile, {
		createDomButton: function(){
			console.log('[MIG:fixed] ' + this.declaredClass + '(id='+this.id+'): createDomButton had been moved to iconUtils.');
			return iconUtils.createDomButton(this, arguments);
		}
	});

	// check css
	ready(function(){
		var cssFiles = [], i, j;

		// collect @import
		var s = win.doc.styleSheets;
		for(i = 0; i < s.length; i++){
			if(s[i].href){ continue; }
			var r = s[i].cssRules || s[i].imports;
			if(!r){ continue; }
			for(j = 0; j < r.length; j++){
				if(r[j].href){
					cssFiles.push(r[j].href);
				}
			}
		}

		// collect <link>
		var elems = win.doc.getElementsByTagName("link");
		for(i = 0; i < elems.length; i++){
			cssFiles.push(elems[i].href);
		}

		for(i = 0; i < cssFiles.length; i++){
			if(cssFiles[i].match(/themes\/common\/(FixedSplitter.css)|themes\/common\/(SpinWheel.css)/)){
				console.log('[MIG:error] ' + (RegExp.$1 || RegExp.$2) + ' is no longer in the themes/common folder. It is in a device theme folder.');
			}
		}
		
	});

	return migrationAssist;
});
