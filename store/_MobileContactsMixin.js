define([
	"dojo/_base/declare"
], function(declare){

	return declare("dojox.mobile.store.MobileContactsMixin", null, {

		onSaveSuccess: function(contact){
			// summary:
			//		User defined function to handle SaveSuccess
			// tags:
			//		callback
		},

		onSaveError: function(contactError){
			// summary:
			//		User defined function to handle SaveError
			// tags:
			//		callback
		},

		onRemoveSuccess: function(contact){
			// summary:
			//		User defined function to handle RemoveSuccess
			// tags:
			//		callback
		},

		onRemoveError: function(contactError){
			// summary:
			//		User defined function to handle RemoveError
			// tags:
			//		callback
		}
	});
});
