define([
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/hash",
	"dijit/registry",
	"./TransitionEvent",
	"./View",
	"./viewRegistry"
], function(array, connect, lang, win, hash, registry, TransitionEvent, View, viewRegistry){

	// module:
	//		dojox/mobile/bookmarkable
	// summary:
	//		Utilities to make view transition bookmarkable

	var b = {
		settingHash: false,
		transitionInfo: [],

		getTransitionInfo: function(/*String*/ fromViewId, /*String*/ toViewId){
			return this.transitionInfo[fromViewId.replace(/^#/, "") + ":" + toViewId.replace(/^#/, "")];
		},

		addTransitionInfo: function(/*String*/ fromViewId, /*String*/ toViewId, /*Object*/args){
			this.transitionInfo[fromViewId.replace(/^#/, "") + ":" + toViewId.replace(/^#/, "")] = args;
		},

		findTransitionViews: function(/*String*/moveTo){
			// summary:
			//		Searches for a starting view and a destination view.
			if(!moveTo){ return []; }
			var view = registry.byId(moveTo.replace(/^#/, ""));
			if(!view){ return []; }
			for(var v = view.getParent(); v; v = v.getParent()){ // search for the topmost invisible parent node
				if(v.isVisible && !v.isVisible()){
					view = v;
				}
			}
			return [view.getShowingView(), view]; // fromView, toView
		},

		onHashChange: function(value){
			if(this.settingHash){
				this.settingHash = false;
				return;
			}
			var params = this.handleFragIds(value);
			params.hashchange = true;
			new TransitionEvent(win.body(), params).dispatch();
		},

		handleFragIds: function(/*String*/fragIds){
			var arr, moveTo;
			if(!fragIds){
				moveTo = "#" + viewRegistry.initialView.id;
				arr = this.findTransitionViews(moveTo);
			}else{
				var ids = fragIds.replace(/^#/, "").split(/,/);
				for(var i = 0; i < ids.length; i++){
					// Search for the first invisible view.
					// Both ids are identical if the view is visible.
					moveTo = "#" + ids[i];
					arr = this.findTransitionViews(moveTo);
					if(arr.length === 2 && arr[0].id !== arr[1].id){
						break;
					}
				}
			}

			var args = this.getTransitionInfo(arr[0].id, arr[1].id);
			var dir = 1;
			if(!args){
				args = this.getTransitionInfo(arr[1].id, arr[0].id);
				dir = -1;
			}

			return {
				moveTo: moveTo,
				transitionDir: args ? args.transitionDir * dir : 1,
				transition: args ? args.transition : "none"
			};
		},

		setFragIds: function(/*Widget*/toView){
			// summary:
			//		Update the hash (=fragment id) in the browser URL.
			// description:
			//		The hash value consists of one or more visible view ids
			//		separated with commas.
			//		The first one is an id of the deepest visible view.

			// Find the deepest view under target
			var view = toView;
			for(var v = viewRegistry.getChildViews(toView)[0]; v; v = viewRegistry.getChildViews(v)[0]){
				v = v.getShowingView();
				if(!v){ break; }
				view = v;
			}

			// Append the other visible views
			var arr = [view].concat(array.filter(viewRegistry.getViews(), function(v){ return v.isVisible() && v !== view; }));

			this.settingHash = true;
			hash(array.map(arr, function(v){ return v.id; }).join(","));
		}
	};

	connect.subscribe("/dojo/hashchange", null, function(){ b.onHashChange.apply(b, arguments); });

	lang.extend(View, {
		getTransitionInfo: function(){ b.getTransitionInfo.apply(b, arguments); },
		addTransitionInfo: function(){ b.addTransitionInfo.apply(b, arguments); },
		handleFragIds: function(){ b.handleFragIds.apply(b, arguments); },
		setFragIds: function(){ b.setFragIds.apply(b, arguments); },
	});

	return b;
});
