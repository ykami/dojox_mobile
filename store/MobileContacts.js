define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"./_ContactsBase",
	"./_MobileContactsMixin"
], function(array, declare, Deferred, ContactsBase, MobileContactsMixin){

	return declare("dojox.mobile.store.MobileContacts", [ContactsBase, MobileContactsMixin], {
		
		constructor: function(/*dojox.mobile.store.MobileContacts*/ args){
			// summary:
			//		Creates a Mobile Contacts store.
			contactsObj = navigator.contacts;
			ContactFindOptionsClass = ContactFindOptions;
			this.inherited(arguments);
		},

		put: function(object){
			var contact = typeof object.save === "function" ? object : contactsObj.create(object);
			var id = this.getIdentity(contact);
			var hasId = typeof id != "undefined";
			if(hasId){
				contact.save(this.onSaveSuccess, this.onSaveError);
			}else{
				var err = new Error(this.idProperty + " is not exist.");
				this.onSaveError(err);
			}
		},

		add: function(object){
			var contact = typeof object.save === "function" ? object : contactsObj.create(object);
			contact.save(this.onSaveSuccess, this.onSaveError);
		},

		remove: function(object){
			if(typeof object.remove === "function"){
				object.remove(this.onRemoveSuccess, this.onRemoveError);
			}else{
				delete object;
			}
		}
	});
});
