'use strict';

let ConfigSet = require('../configs/config_set.json');
let ErrorSet = require('../utils/error_util');
let Joi = require('joi');
let ContactsLogger = require('../logger').ContactsLogger;
let MongoDB = require('mongodb');
let MongoClient = MongoDB.MongoClient;
let IsEmpty = require('is-empty');
let assert = require('assert')

let db;
MongoClient.connect(ConfigSet.DATABASE_URL, (err, client) => {
    if (err) {
        ContactsLogger.error(`database error => ${err.stack}`);
        throw err;
    } else {
        db = client.db(ConfigSet.DATABASE_NAME);
    }
})

exports.addContact = async function(params) {
	//connect collection
   	var col = db.collection(ConfigSet.COLLECTION_NAME);
   	//insert data
   	var data = params;
   	col.insert(data,function(err,result) {
   		if (err)
   		{
   			console.log('Error:' + err);
   			return;
   		}
   	data = result;
   	} );

   	return data;
}

exports.getAllContacts = function() {
	//connect collection
   	var col = db.collection(ConfigSet.COLLECTION_NAME);
   	//get all documents to Array
   	var data = col.find().toArray();
   	return data;
}

exports.deleteContact = function(params) {
	//connect collection
   	var col = db.collection(ConfigSet.COLLECTION_NAME);

   	//delete data
   	var data = {"_id":MongoDB.ObjectId(params.contact_id)};
   	// var data = {"_id": params.contact_id};

   	ContactsLogger.info(`MongoDB.ObjectId(params.contact_id) => ${JSON.stringify(MongoDB.ObjectId(params.contact_id),null,2)}`);
   	ContactsLogger.info(`params.contact_id =>  ${JSON.stringify(params.contact_id,null,2)}`);

   	var result = col.find(data).toArray();

   	col.remove(data,function(err, result) {
    	assert.equal(err, null,"Removed the document failed");
  	});

   	//return {"message": "Delete successfully!"};
    ContactsLogger.info(`DELETE SUCCESS`);
   	return result;

}

exports.updateContact = function(params) {
	//connect collection
   	var col = db.collection(ConfigSet.COLLECTION_NAME);

   	//update data
   	var id = {'_id' : MongoDB.ObjectId(params.contact_id)};
   	var set = {$set : params.documents};

   	col.update(id,set,function (err,result) {
   		assert.equal(err, null,"Update the document failed");
   	});

   	//ContactsLogger.info(`UPDATE SUCCESS`);
   	return params;
}