
/* Note: This module will soon be rewritten using dojo/data/util/simpleFetch */

define([
	"dojo/_base/kernel",
	"dojo/_base/xhr",
	"dojo/_base/declare",
	"dojo/_base/array"
], 
	function(dojo, xhr, declare, array) {


	declare("dojox.mobile.RssReadStore", null, {

	constructor: function(/* object */ args){
		//	summary:
		//		Constructor for the AtomRead store.
		//	args:
		//		An anonymous object to initialize properties.	It expects the following values:
		//		url:			The url to a service or an XML document that represents the store

		if(args){
			this.url = args.url;
		}
		if(!this.url){
			throw new Error("RssReadStore: a URL must be specified when creating the data store");
		}
	},

	//Values that may be set by the parser.
	//Ergo, have to be instantiated to something
	//So the parser knows how to set them.
	url: "",

	label: "title",

	getValue: function(	/* item */ item,
						/* attribute-name-string */ attribute,
						/* value? */ defaultValue){
		// summary:
		//		Returns a single attribute value.
		//		Returns defaultValue if and only if *item* does not have a value for *attribute*.
		//		Returns null if and only if null was explicitly set as the attribute value.
		//		Returns undefined if and only if the item does not have a value for the
		//		given attribute (which is the same as saying the item does not have the attribute).
		// description:
		//		Saying that an "item x does not have a value for an attribute y"
		//		is identical to saying that an "item x does not have attribute y".
		//		It is an oxymoron to say "that attribute is present but has no values"
		//		or "the item has that attribute but does not have any attribute values".
		//		If store.hasAttribute(item, attribute) returns false, then
		//		store.getValue(item, attribute) will return undefined.
		// item:
		//		The item to access values on.
		// attribute:
		//		The attribute to access represented as a string.
		// defaultValue:
		//		Optional.  A default value to use for the getValue return in the attribute does not exist or has no value.
		// returns:
		//		a literal, an item, null, or undefined (never an array)
		// exceptions:
		//		Throws an exception if *item* is not an item, or *attribute* is not a string
		// example:
		//	|	var darthVader = store.getValue(lukeSkywalker, "father");
		return item[attribute.toLowerCase()] || defaultValue;
	},

	getValues: function(/* item */ item,
						/* attribute-name-string */ attribute){
		// summary:
		// 		This getValues() method works just like the getValue() method, but getValues()
		//		always returns an array rather than a single attribute value.  The array
		//		may be empty, may contain a single attribute value, or may contain
		//		many attribute values.
		//		If the item does not have a value for the given attribute, then getValues()
		//		will return an empty array: [].  (So, if store.hasAttribute(item, attribute)
		//		has a return of false, then store.getValues(item, attribute) will return [].)
		// item:
		//		The item to access values on.
		// attribute:
		//		The attribute to access represented as a string.
		// returns:
		//		an array that may contain literals and items
		// exceptions:
		//		Throws an exception if *item* is not an item, or *attribute* is not a string
		// example:
		//	|	var friendsOfLuke = store.getValues(lukeSkywalker, "friends");
		return [this.getValue(item, attribute)];
	},

	getAttributes: function(/* item */ item){
		// summary:
		//		Returns an array with all the attributes that this item has.  This
		//		method will always return an array; if the item has no attributes
		//		at all, getAttributes() will return an empty array: [].
		// item:
		//		The item to access attributes on.
		// exceptions:
		//		Throws an exception if *item* is not an item, or *attribute* is not a string
		// example:
		//	|	var array = store.getAttributes(kermit);
		var keys = [];
		for(key in item){
			keys.push(key);
		}
		return keys;
	},

	hasAttribute: function(	/* item */ item,
							/* attribute-name-string */ attribute){
		// summary:
		//		Returns true if the given *item* has a value for the given *attribute*.
		// item:
		//		The item to access attributes on.
		// attribute:
		//		The attribute to access represented as a string.
		// exceptions:
		//		Throws an exception if *item* is not an item, or *attribute* is not a string
		// example:
		//	|	var trueOrFalse = store.hasAttribute(kermit, "color");
		return (this.getValue(item, attribute) !== undefined);
	},

	containsValue: function(/* item */ item,
							/* attribute-name-string */ attribute,
							/* anything */ value){
		// summary:
		//		Returns true if the given *value* is one of the values that getValues()
		//		would return.
		// item:
		//		The item to access values on.
		// attribute:
		//		The attribute to access represented as a string.
		// value:
		//		The value to match as a value for the attribute.
		// exceptions:
		//		Throws an exception if *item* is not an item, or *attribute* is not a string
		// example:
		//	|	var trueOrFalse = store.containsValue(kermit, "color", "green");
		var values = this.getValues(item, attribute);
		for(var i = 0; i < values.length; i++){
			if((typeof value === "string")){
				if(values[i].toString && values[i].toString() === value){
					return true;
				}
			}else if(values[i] === value){
				return true; //boolean
			}
		}
		return false;//boolean
	},

	isItem: function(/* anything */ something){
		// summary:
		//		Returns true if *something* is an item and came from the store instance.
		//		Returns false if *something* is a literal, an item from another store instance,
		//		or is any object other than an item.
		// something:
		//		Can be anything.
		// example:
		//	|	var yes = store.isItem(store.newItem());
		//	|	var no  = store.isItem("green");
		for(var i = 0; i < this._items.length; i++){
			if(this._items[i]===something)
				return true;
		}
		return false;//boolean
	},

	isItemLoaded: function(/* anything */ something){
		// summary:
		//		Returns false if isItem(something) is false.  Returns false if
		//		if isItem(something) is true but the the item is not yet loaded
		//		in local memory (for example, if the item has not yet been read
		//		from the server).
		// something:
		//		Can be anything.
		// example:
		//	|	var yes = store.isItemLoaded(store.newItem());
		//	|	var no  = store.isItemLoaded("green");
		 return this.isItem(something);
	},

	loadItem: function(/* object */ keywordArgs){
	},

	fetch: function(/* Object */ request){
		// summary:
		//		Given a query and set of defined options, such as a start and count of items to return,
		//		this method executes the query and makes the results available as data items.
		//		The format and expectations of stores is that they operate in a generally asynchronous
		//		manner, therefore callbacks are always used to return items located by the fetch parameters.
		//
		// description:
		//		A Request object will always be returned and is returned immediately.
		//		The basic request is nothing more than the keyword args passed to fetch and
		//		an additional function attached, abort().  The returned request object may then be used
		//		to cancel a fetch.  All data items returns are passed through the callbacks defined in the
		//		fetch parameters and are not present on the 'request' object.
		//
		//		This does not mean that custom stores can not add methods and properties to the request object
		//		returned, only that the API does not require it.  For more info about the Request API,
		//		see dojo.data.api.Request
		//
		// keywordArgs:
		//		The keywordArgs parameter may either be an instance of
		//		conforming to dojo.data.api.Request or may be a simple anonymous object
		//		that may contain any of the following:
		//		{
		//			query: query-object or query-string,
		//			queryOptions: object,
		//			onBegin: Function,
		//			onItem: Function,
		//			onComplete: Function,
		//			onError: Function,
		//			scope: object,
		//			start: int
		//			count: int
		//			sort: array
		//		}
		//		All implementations should accept keywordArgs objects with any of
		//		the 9 standard properties: query, onBegin, onItem, onComplete, onError
		//		scope, sort, start, and count.  Some implementations may accept additional
		//		properties in the keywordArgs object as valid parameters, such as
		//		{includeOutliers:true}.
		//
		//	The *query* parameter.
		//		The query may be optional in some data store implementations.
		//		The dojo.data.api.Read API does not specify the syntax or semantics
		//		of the query itself -- each different data store implementation
		//		may have its own notion of what a query should look like.
		//		However, as of dojo 0.9, 1.0, and 1.1, all the provided datastores in dojo.data
		//		and dojox.data support an object structure query, where the object is a set of
		//		name/value parameters such as { attrFoo: valueBar, attrFoo1: valueBar1}.  Most of the
		//		dijit widgets, such as ComboBox assume this to be the case when working with a datastore
		//		when they dynamically update the query.  Therefore, for maximum compatibility with dijit
		//		widgets the recommended query parameter is a key/value object.  That does not mean that the
		//		the datastore may not take alternative query forms, such as a simple string, a Date, a number,
		//		or a mix of such.  Ultimately, The dojo.data.api.Read API is agnostic about what the query
		//		format.
		//		Further note:  In general for query objects that accept strings as attribute
		//		value matches, the store should also support basic filtering capability, such as *
		//		(match any character) and ? (match single character).  An example query that is a query object
		//		would be like: { attrFoo: "value*"}.  Which generally means match all items where they have
		//		an attribute named attrFoo, with a value that starts with 'value'.
		//
		//	The *queryOptions* parameter
		//		The queryOptions parameter is an optional parameter used to specify optiosn that may modify
		//		the query in some fashion, such as doing a case insensitive search, or doing a deep search
		//		where all items in a hierarchical representation of data are scanned instead of just the root
		//		items.  It currently defines two options that all datastores should attempt to honor if possible:
		//		{
		//			ignoreCase: boolean, //Whether or not the query should match case sensitively or not.  Default behaviour is false.
		//			deep: boolean 	//Whether or not a fetch should do a deep search of items and all child
		//							//items instead of just root-level items in a datastore.  Default is false.
		//		}
		//
		//	The *onBegin* parameter.
		//		function(size, request);
		//		If an onBegin callback function is provided, the callback function
		//		will be called just once, before the first onItem callback is called.
		//		The onBegin callback function will be passed two arguments, the
		//		the total number of items identified and the Request object.  If the total number is
		//		unknown, then size will be -1.  Note that size is not necessarily the size of the
		//		collection of items returned from the query, as the request may have specified to return only a
		//		subset of the total set of items through the use of the start and count parameters.
		//
		//	The *onItem* parameter.
		//		function(item, request);
		//		If an onItem callback function is provided, the callback function
		//		will be called as each item in the result is received. The callback
		//		function will be passed two arguments: the item itself, and the
		//		Request object.
		//
		//	The *onComplete* parameter.
		//		function(items, request);
		//
		//		If an onComplete callback function is provided, the callback function
		//		will be called just once, after the last onItem callback is called.
		//		Note that if the onItem callback is not present, then onComplete will be passed
		//		an array containing all items which matched the query and the request object.
		//		If the onItem callback is present, then onComplete is called as:
		//		onComplete(null, request).
		//
		//	The *onError* parameter.
		//		function(errorData, request);
		//		If an onError callback function is provided, the callback function
		//		will be called if there is any sort of error while attempting to
		//		execute the query.
		//		The onError callback function will be passed two arguments:
		//		an Error object and the Request object.
		//
		//	The *scope* parameter.
		//		If a scope object is provided, all of the callback functions (onItem,
		//		onComplete, onError, etc) will be invoked in the context of the scope
		//		object.  In the body of the callback function, the value of the "this"
		//		keyword will be the scope object.   If no scope object is provided,
		//		the callback functions will be called in the context of dojo.global().
		//		For example, onItem.call(scope, item, request) vs.
		//		onItem.call(dojo.global(), item, request)
		//
		//	The *start* parameter.
		//		If a start parameter is specified, this is a indication to the datastore to
		//		only start returning items once the start number of items have been located and
		//		skipped.  When this parameter is paired with 'count', the store should be able
		//		to page across queries with millions of hits by only returning subsets of the
		//		hits for each query
		//
		//	The *count* parameter.
		//		If a count parameter is specified, this is a indication to the datastore to
		//		only return up to that many items.  This allows a fetch call that may have
		//		millions of item matches to be paired down to something reasonable.
		//
		//	The *sort* parameter.
		//		If a sort parameter is specified, this is a indication to the datastore to
		//		sort the items in some manner before returning the items.  The array is an array of
		//		javascript objects that must conform to the following format to be applied to the
		//		fetching of items:
		//		{
		//			attribute: attribute || attribute-name-string,
		//			descending: true|false;   // Optional.  Default is false.
		//		}
		//		Note that when comparing attributes, if an item contains no value for the attribute
		//		(undefined), then it the default ascending sort logic should push it to the bottom
		//		of the list.  In the descending order case, it such items should appear at the top of the list.
		//
		// returns:
		//		The fetch() method will return a javascript object conforming to the API
		//		defined in dojo.data.api.Request.  In general, it will be the keywordArgs
		//		object returned with the required functions in Request.js attached.
		//		Its general purpose is to provide a convenient way for a caller to abort an
		//		ongoing fetch.
		//
		//		The Request object may also have additional properties when it is returned
		//		such as request.store property, which is a pointer to the datastore object that
		//		fetch() is a method of.
		//
		// exceptions:
		//		Throws an exception if the query is not valid, or if the query
		//		is required but was not supplied.
		//
		// example:
		//		Fetch all books identified by the query and call 'showBooks' when complete
		//		|	var request = store.fetch({query:"all books", onComplete: showBooks});
		// example:
		//		Fetch all items in the story and call 'showEverything' when complete.
		//		|	var request = store.fetch(onComplete: showEverything);
		// example:
		//		Fetch only 10 books that match the query 'all books', starting at the fifth book found during the search.
		//		This demonstrates how paging can be done for specific queries.
		//		|	var request = store.fetch({query:"all books", start: 4, count: 10, onComplete: showBooks});
		// example:
		//		Fetch all items that match the query, calling 'callback' each time an item is located.
		//		|	var request = store.fetch({query:"foo/bar", onItem:callback});
		// example:
		//		Fetch the first 100 books by author King, call showKing when up to 100 items have been located.
		//		|	var request = store.fetch({query:{author:"King"}, start: 0, count:100, onComplete: showKing});
		// example:
		//		Locate the books written by Author King, sort it on title and publisher, then return the first 100 items from the sorted items.
		//		|	var request = store.fetch({query:{author:"King"}, sort: [{ attribute: "title", descending: true}, {attribute: "publisher"}], ,start: 0, count:100, onComplete: 'showKing'});
		// example:
		//		Fetch the first 100 books by authors starting with the name King, then call showKing when up to 100 items have been located.
		//		|	var request = store.fetch({query:{author:"King*"}, start: 0, count:100, onComplete: showKing});
		// example:
		//		Fetch the first 100 books by authors ending with 'ing', but only have one character before it (King, Bing, Ling, Sing, etc.), then call showBooks when up to 100 items have been located.
		//		|	var request = store.fetch({query:{author:"?ing"}, start: 0, count:100, onComplete: showBooks});
		// example:
		//		Fetch the first 100 books by author King, where the name may appear as King, king, KING, kInG, and so on, then call showKing when up to 100 items have been located.
		//		|	var request = store.fetch({query:{author:"King"}, queryOptions:(ignoreCase: true}, start: 0, count:100, onComplete: showKing});
		// example:
		//		Paging
		//		|	var store = new dojo.data.LargeRdbmsStore({url:"jdbc:odbc:foobar"});
		//		|	var fetchArgs = {
		//		|		query: {type:"employees", name:"Hillary *"}, // string matching
		//		|		sort: [{attribute:"department", descending:true}],
		//		|		start: 0,
		//		|		count: 20,
		//		|		scope: displayer,
		//		|		onBegin: showThrobber,
		//		|		onItem: displayItem,
		//		|		onComplete: stopThrobber,
		//		|		onError: handleFetchError,
		//		|	};
		//		|	store.fetch(fetchArgs);
		//		|	...
		//		and then when the user presses the "Next Page" button...
		//		|	fetchArgs.start += 20;
		//		|	store.fetch(fetchArgs);  // get the next 20 items
		request = request || {};
		if(!request.store){
			request.store = this;
		}

		this._fetchItems(request);
		return request;
	},

	_errorHandler: function(errorData, requestObject){
		if(requestObject.onError){
			var scope = requestObject.scope || dojo.global;
			requestObject.onError.call(scope, errorData, requestObject);
		}
	},

	_fetchHandler: function(items, requestObject){
		var scope = requestObject.scope || dojo.global;
		if(!requestObject.store){
			requestObject.store = this;
		}
		if(requestObject.onBegin){
			requestObject.onBegin.call(scope, items.length, requestObject);
		}
		if(requestObject.onItem){
			for(var i = 0; i < items.length; i++){
				var item = items[i];
				requestObject.onItem.call(scope, item, requestObject);
			}
		}
		if(requestObject.onComplete){
			requestObject.onComplete.call(scope, items, requestObject);   
		}
	},

	_getItem: function(element){
		return {
			element: element,
			store: this
		};
	},

	_getItems: function(document, request){
		// summary:
		//		Parses the document in a first pass
		if(this._items){
			return this._items;
		}
		var items = [];
		var nodes = [];

		var rssNodes = array.filter(document.childNodes, "return item.tagName && item.tagName.toLowerCase() === 'rdf:rdf'");
		if(rssNodes.length === 0){	//RSS 2.0
			rssNodes = array.filter(document.childNodes, "return item.tagName && item.tagName.toLowerCase() === 'rss'");
			this._rss20 = true;
		}

		var channelNodes = this._rss20?dojo.filter(rssNodes[0].childNodes, "return item.tagName && item.tagName.toLowerCase() === 'channel'"):rssNodes;

		nodes = array.filter(channelNodes[0].childNodes, "return item.tagName && item.tagName.toLowerCase() == 'item'");

		var count = request.count;
		for(var i = 0; i < nodes.length; i++){
			var node = nodes[i];
			if(node.nodeType != 1 /*ELEMENT_NODE*/){
				continue;
			}
			var item ={};
			for(var j = 0; j < node.childNodes.length; j++){
				var cnode = node.childNodes[j];
				if(cnode.nodeType != 1 /*ELEMENT_NODE*/){
					continue;
				}
				item[cnode.nodeName] = cnode.textContent ? cnode.textContent: cnode.innerText;
			}
			if(count && count < items.length)
				break;
			items.push(item);
		}
		return items;
	},

	_fetchItems: function(request){
		if(!request.query){ request.query = {}; }
		if(!request.queryOptions){ request.queryOptions = {}; }

		// summary:
		//		Retrieves the items from the Atom XML document.
		var getArgs = {
			url: this.url,
			handleAs: "xml",
			preventCache: this.urlPreventCache
		};

		var getHandler = xhr.get(getArgs);
		var _this = this;
		getHandler.addCallback(function(data){
			this.doc = data;
			_this._items = _this._getItems(data, request);
			_this._fetchHandler(_this._items, request);
		});

		getHandler.addErrback(function(data){
			_this._errorHandler(data, request);
		});
	},

	getFeatures: function(){
		return {
			'dojo.data.api.Read': true
		};
	},

	close: function(/*dojo.data.api.Request || keywordArgs || null */ request){
	},

	getLabel: function(/* item */ item){
		// summary:
		//		Method to inspect the item and return a user-readable 'label' for the item
		//		that provides a general/adequate description of what the item is.
		//
		// description:
		//		Method to inspect the item and return a user-readable 'label' for the item
		//		that provides a general/adequate description of what the item is.  In general
		//		most labels will be a specific attribute value or collection of the attribute
		//		values that combine to label the item in some manner.  For example for an item
		//		that represents a person it may return the label as:  "firstname lastlame" where
		//		the firstname and lastname are attributes on the item.  If the store is unable
		//		to determine an adequate human readable label, it should return undefined.  Users that wish
		//		to customize how a store instance labels items should replace the getLabel() function on
		//		their instance of the store, or extend the store and replace the function in
		//		the extension class.
		//
		// item:
		//		The item to return the label for.
		//
		// returns:
		//		A user-readable string representing the item or undefined if no user-readable label can
		//		be generated.
		return this.getValue(item, this.label);
	},

	getLabelAttributes: function(/* item */ item){
		// summary:
		//		Method to inspect the item and return an array of what attributes of the item were used
		//		to generate its label, if any.
		//
		// description:
		//		Method to inspect the item and return an array of what attributes of the item were used
		//		to generate its label, if any.  This function is to assist UI developers in knowing what
		//		attributes can be ignored out of the attributes an item has when displaying it, in cases
		//		where the UI is using the label as an overall identifer should they wish to hide
		//		redundant information.
		//
		// item:
		//		The item to return the list of label attributes for.
		//
		// returns:
		//		An array of attribute names that were used to generate the label, or null if public attributes
		//		were not used to generate the label.
		return [this.label];
	}
});

return dojox.mobile.RssReadStore;
});
