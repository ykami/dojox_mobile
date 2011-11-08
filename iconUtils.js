define([
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/event",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"./sniff"
], function(array, connect, event, domClass, domConstruct, domStyle, has){

	// module:
	//		dojox/mobile/iconUtils
	// summary:
	//		Utilities to create an icon (image, css sprite image, or DOM Button)

	var iconUtils = new function(){
		this.setupSpriteIcon = function(/*DomNode*/iconNode, /*String*/iconPos){
			// summary:
			//		Sets up CSS sprite for a foreground image.
			if(iconNode && iconPos){
				var arr = array.map(iconPos.split(/[ ,]/),function(item){return item-0});
				var t = arr[0]; // top
				var r = arr[1] + arr[2]; // right
				var b = arr[0] + arr[3]; // bottom
				var l = arr[1]; // left
				domStyle.set(iconNode, {
					clip: "rect("+t+"px "+r+"px "+b+"px "+l+"px)",
					top: (iconNode.parentNode ? domStyle.get(iconNode, "top") : 0) - t + "px",
					left: -l + "px"
				});
			}
		};

		this.createDomButton = function(/*DomNode*/refNode, /*Object?*/style, /*DomNode?*/toNode){
			// summary:
			//		Creates a DOM button.
			// description:
			//		DOM button is a simple graphical object that consists of one or
			//		more nested DIV elements with some CSS styling. It can be used
			//		in place of an icon image on ListItem, IconItem, and so on.
			//		The kind of DOM button to create is given as a class name of
			//		refNode. The number of DIVs to create is searched from the style
			//		sheets in the page. However, if the class name has a suffix that
			//		starts with an underscore, like mblDomButtonGoldStar_5, then the
			//		suffixed number is used instead. A class name for DOM button
			//		must starts with 'mblDomButton'.
			// refNode:
			//		A node that has a DOM button class name.
			// style:
			//		A hash object to set styles to the node.
			// toNode:
			//		A root node to create a DOM button. If omitted, refNode is used.

			if(!this._domButtons){
				if(has("webkit")){
					var findDomButtons = function(sheet, dic){
						// summary:
						//		Searches the style sheets for DOM buttons.
						// description:
						//		Returns a key-value pair object whose keys are DOM
						//		button class names and values are the number of DOM
						//		elements they need.
						var i, j;
						if(!sheet){
							var dic = {};
							var ss = dojo.doc.styleSheets;
							for (i = 0; i < ss.length; i++){
								ss[i] && findDomButtons(ss[i], dic);
							}
							return dic;
						}
						var rules = sheet.cssRules || [];
						for (i = 0; i < rules.length; i++){
							var rule = rules[i];
							if(rule.href && rule.styleSheet){
								findDomButtons(rule.styleSheet, dic);
							}else if(rule.selectorText){
								var sels = rule.selectorText.split(/,/);
								for (j = 0; j < sels.length; j++){
									var sel = sels[j];
									var n = sel.split(/>/).length - 1;
									if(sel.match(/(mblDomButton\w+)/)){
										var cls = RegExp.$1;
										if(!dic[cls] || n > dic[cls]){
											dic[cls] = n;
										}
									}
								}
							}
						}
					}
					this._domButtons = findDomButtons();
				}else{
					this._domButtons = {};
				}
			}

			var s = refNode.className;
			var node = toNode || refNode;
			if(s.match(/(mblDomButton\w+)/) && s.indexOf("/") === -1){
				var btnClass = RegExp.$1;
				var nDiv = 4;
				if(s.match(/(mblDomButton\w+_(\d+))/)){
					nDiv = RegExp.$2 - 0;
				}else if(this._domButtons[btnClass] !== undefined){
					nDiv = this._domButtons[btnClass];
				}
				var props = null;
				if(has("bb") && config["mblBBBoxShadowWorkaround"] !== false){
					// Removes box-shadow because BlackBerry incorrectly renders it.
					props = {style:"-webkit-box-shadow:none"};
				}
				for(var i = 0, p = node; i < nDiv; i++){
					p = p.firstChild || domConstruct.create("div", props, p);
				}
				if(toNode){
					setTimeout(function(){
						domClass.remove(refNode, btnClass);
					}, 0);
					domClass.add(toNode, btnClass);
				}
			}else if(s.indexOf(".") !== -1){ // file name
				domConstruct.create("img", {src:s}, node);
			}else{
				return null;
			}
			domClass.add(node, "mblDomButton");
			!!style && domStyle.set(node, style);
			return node;
		};

		this.createIcon = function(/*String*/icon, /*String*/iconPos, /*DomNode*/node, /*String?*/title, /*DomNode?*/parent){
			// summary:
			//		Creates or updates an icon node
			// description:
			//		If node exists, updates the existing node. Otherwise, creates a new one.
			// icon:
			//		Path for an image, or DOM button class name.
			if(icon && icon.indexOf("mblDomButton") === 0){
				// DOM button
				if(node && node.className.match(/(mblDomButton\w+)/)){
					domClass.remove(node, RegExp.$1);
				}else{
					node = domConstruct.create("div", null, parent); /* 1.8 */
				}
				node.title = title;
				domClass.add(node, icon);
				this.createDomButton(node);
			}else if(icon && icon !== "none"){
				// Image
				if(!node || node.nodeName !== "IMG"){
					node = domConstruct.create("img", {
						alt: title
					}, parent); /* 1.8 */
				}
				node.src = (icon || "").replace("${theme}", this.currentTheme); //TODO: how do I pass currentTheme
				this.setupSpriteIcon(node, iconPos);
				if(parent && iconPos){
					var arr = iconPos.split(/[ ,]/);
					domStyle.set(parent, {
						width: arr[2] + "px",
						height: arr[3] + "px"
					});
				}
				connect.connect(node, "ondragstart", event, "stop"); /* 1.8 */
			}
			return node;
		};

		// iconNode is a DIV node that holds an icon
		this.setIcon = function(/*String*/icon, /*String*/iconPos, /*DomNode*/iconNode, /*DomNode*/parent, /*String?*/alt){
			if(!parent || !icon && !iconNode){ return; }
			if(!iconNode){
				iconNode = domConstruct.create("div", {className:"mblIconRoot"}, parent);
			}
			domConstruct.empty(iconNode);
			if(icon && icon !== "none"){
				this.createIcon(icon, iconPos, null, alt, iconNode);
				if(iconPos){
					domClass.add(iconNode.firstChild, "mblSpriteIcon");
				}
				domClass.remove(parent, "mblNoIcon");
				return iconNode;
			}else{
				domConstruct.destroy(iconNode);
				domClass.add(parent, "mblNoIcon");
				return null;
			}
		}
	};
	return iconUtils;
});
