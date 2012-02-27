define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/store/Memory",
	"./_ContactsBase",
	"./_MobileContactsMixin"
], function(array, declare, Deferred, Memory, ContactsBase, MobileContactsMixin){

	return declare("dojox.mobile.store.MobileContactsStab", [ContactsBase, MobileContactsMixin], {
		
		memory: null,
		
		constructor: function(/*dojox.mobile.store.mobileContacts*/ args){
			// summary:
			//		Creates a memory object store.
			this.contactFields = ["id", "displayName", "name", "phoneNumbers", "emails", "addresses"];
			contactsObj = this;
			ContactFindOptionsClass = function(filter, multiple){
				this.filter = filter || "";
				this.multiple = multiple || true;
			};
			this.inherited(arguments);
			this.memory = new Memory();
			this.memory.setData(this.data || []);
		},

		find: function(fields, onFindSuccess, onFindError, options){
			try{
				var _data = this.memory.data;
				fields = fields.length == 0 ? ["id"] : fields;
				var datas = [];
				// gather fields
				array.forEach(_data, function(item, i){
					var obj = {};
					for(var key in item){
						if(fields[0] === "*" || array.indexOf(fields, key) !== -1){
							obj[key]=item[key];
						}
					}
					datas.push(obj);
				});

				//Search value recursively
				var regexp = new RegExp("^" + options.filter || ".*" + "$", "i");
				function search(item){
					for(var key in item){
						switch(typeof item[key]){
							case "string":
								if(regexp.test(item[key])){
									return true;
								}
								break;
							case "object":
								if(search(item[key])){
									return true;
								}
								break;
						}
					}
					return false;
				}
				var ret=[];
				var _multiple = options.multiple;
				array.forEach(datas, function(item, i){
					if(search(item)){
						ret.push(item);
						if(!_multiple){
							return;
						}
					}
				});
				setTimeout(onFindSuccess(ret));
			}catch(e){
				setTimeout(onFindError(e));
			}
		},

		put: function(object){
			var id = this.getIdentity(object);
			var hasId = typeof id != "undefined";
			if(hasId){
				this.memory.put(object);
			}else{
				var err = new Error(this.idProperty + " is not exist.");
			}
			this.onSaveSuccess(object);
		},

		add: function(object){
			var id = this.getIdentity(object);
			var hasId = typeof id != "undefined";
			if(hasId){
				this.memory.put(object);
			}else{
				id = this.memory.add(object);
				object[this.idProperty] = id.toString();
				this.memory.put(object);
			}
			this.onSaveSuccess(object);
		},

		remove: function(object){
			var id = this.getIdentity(contact);
			var hasId = typeof id != "undefined";
			if(hasId){
				this.memory.remove(id);
				this.onRemoveSuccess(object);
			}else{
				var err = new Error(this.idProperty + " not found.");
				this.onRemoveError(err);
			}
		}

	});
});
