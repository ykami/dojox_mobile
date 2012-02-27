define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/Deferred"
], function(array, declare, lang, Deferred){

	var store = lang.getObject("dojox.mobile.store", true);

	return declare("dojox.mobile.store.ContactsBase", null, {
		// summary:
		//		This is a basic store for Contacts
		//		formatted data. It implements dojo.store.api.Store.

		// idProperty: String
		//		Indicates the property to use as the identity property. The values of this
		//		property should be unique.
		idProperty: "id",

		contactFields: null,

		contactsObj: null,

		ContactFindOptionsClass: null,

		QueryMultiple: true,

		constructor: function(/*dojox.mobile.store.mobileContacts*/ args){
			// summary:
			//		Creates a contacts object store.
			this.contactFields = ["id", "displayName", "name", "phoneNumbers", "emails", "addresses"];
			declare.safeMixin(this, args);
		},

		get: function(id, contactFields){
			//	summary:
			//		Retrieves an object by its identity.
			//	id: Number
			//		The identity to use to lookup the object
			//	returns: Object
			//		The object in the store that matches the given id.
			var options = new ContactFindOptionsClass();
			options.filter = id;
			options.multiple = true;
			var deferred = new Deferred();
			contactsObj.find(contactFields || this.contactFields,
				lang.hitch(this, "_onFindIdSuccess", deferred, id),
				lang.hitch(this, "_onFindError", deferred),
				options);
			
			return deferred;
		},

		_onFindIdSuccess: function(deferred, id, contacts){
			for (var i = 0; i<contacts.length; i++){
				if(contacts[i][this.idProperty] == id){
					deferred.resolve(contacts[i]);
					return;
				};
			}
			var err = new Error(this.idProperty + " not match.");
			deferred.reject(err);
		},

		_onFindSuccess: function(deferred, contacts){
			deferred.resolve(contacts);
		},

		_onFindError: function(deferred, contactError){
			deferred.reject(contactError);
		},

		getIdentity: function(object){
			// summary:
			//		Returns an object's identity
			// object: Object
			//		The object to get the identity from
			//	returns: Number
			return object[this.idProperty];
		},

		put: function(object){
		},

		add: function(object){
		},

		remove: function(object){
		},

		query: function(query, contactFields){
			var options = new ContactFindOptionsClass();
			options.filter = query;
			options.multiple = this.QueryMultiple;
			var deferred = new Deferred();
			contactsObj.find(contactFields || this.contactFields,
				lang.hitch(this, "_onFindSuccess", deferred),
				lang.hitch(this, "_onFindError", deferred),
				options);
			
			return deferred;
		},

		setContactFields: function(fields){
			this.contactFields = fields;
			if(array.indexOf(this.contactFields, this.idProperty) === -1){
				this.contactFields.push(this.idProperty);
			}
		}

	});
});
