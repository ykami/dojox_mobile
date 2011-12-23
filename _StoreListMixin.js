define([
	"dojo/_base/Deferred",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/registry",
	"./ListItem"
], function(Deferred, array, declare, lang, registry, ListItem){

	// module:
	//		dojox/mobile/_StoreListMixin
	// summary:
	//		Mixin for widgets to generate the list items corresponding to the
	//		dojo.store data provider object.

	return declare("dojox.mobile._StoreListMixin", null, {
		// summary:
		//		Mixin for widgets to generate the list items corresponding to
		//		the dojo.store data provider object.
		// description:
		//		By mixing this class into the widgets, the list item nodes are
		//		generated as the child nodes of the widget and automatically
		//		re-generated whenever the corresponding data items are modified.

		// store: Object
		//		Reference to data provider object
		store: null,

		// query: Object
		//		A query that can be passed to 'store' to initially filter the
		//		items.
		query: null,

		// queryOptions: Object
		//		An optional parameter for the query.
		queryOptions: null,

		labelProperty: "label",

		buildRendering: function(){
			this.inherited(arguments);
			if(!this.store){ return; }
			var store = this.store;
			this.store = null;
			this.setStore(store, this.query, this.queryOptions);
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
			// summary:
			//		Fetches the data and generates the list items.
			if(!this.store){ return; }

			var _this = this;
			var promise = this.store.query(this.query, this.queryOptions);
			Deferred.when(promise, function(results){
				if(promise.observe){
					promise.observe(function(object, removedFrom, insertedInto){
						if(removedFrom > -1){ // existing object removed
							_this.onDelete(object, removedFrom);
						}else if(insertedInto > -1){ // new or updated object inserted
							_this.onUpdate(object, insertedInto);
						}
					});
				}
				_this.onComplete(results);
			}, function(error){
				_this.onError(error);
			});
		},

		createListItem: function(/*Object*/item){
			// summary:
			//		Creates a list item widget.
			var props = {};
			if(!item["label"]){
				props["label"] = item[this.labelProperty];
			}
			return new ListItem(lang.mixin(props, item));
		},

		generateList: function(/*Array*/items, /*Object*/dataObject){
			// summary:
			//		Given the data, generates a list of items.
			array.forEach(this.getChildren(), function(child){
				child.destroyRecursive();
			});
			array.forEach(items, function(item, index){
				this.addChild(this.createListItem(item));
			}, this);
		},

		onComplete: function(/*Array*/items, /*Object*/request){
			// summary:
			//		An handler that is called after the fetch completes.
			this.generateList(items, request);
		},

		onError: function(/*Object*/errorData, /*Object*/request){
			// summary:
			//		An error handler.
		},

		onUpdate: function(/*Object*/item, /*Number*/insertedInto){
			//	summary:
			//		Add a new item or update an existing item.
			if(insertedInto === this.getChildren().length){
				this.addChild(this.createListItem(item)); // add a new ListItem
			}else{
				this.getChildren()[insertedInto].set(item); // update the existing ListItem
			}
		},

		onDelete: function(/*Object*/item, /*Number*/removedFrom){
			//	summary:
			//		Delete an existing item.
			this.getChildren()[removedFrom].destroyRecursive();
		}
	});
});
