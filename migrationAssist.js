define([
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/ready",
	"dijit/_WidgetBase"
], function(win, domClass, ready, WidgetBase){

	// module:
	//		dojox/mobile/migrationAssist
	// summary:
	//		Dojo Mobile 1.6/1.7 to 1.8 migration assistance.

	var migrationAssist = new function(){
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
	};

	WidgetBase.prototype.postMixInProperties = function(){
		var base = this.declaredClass.replace(/.*\./, "");
		migrationAssist["check" + base] && migrationAssist["check" + base](this);
	};

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
			if(cssFiles[i].indexOf("themes/common/FixedSplitter.css") !== -1){
				console.log('[MIG:error] FixedSplitter.css is no longer in the themes/common folder. It is in a device theme folder.');
			}
		}
	});

	return migrationAssist;
});
