'use strict';

let ContactsDB = require('../models/contacts_db');
let Joi = require('joi');
let IsEmpty = require('is-empty');
let ErrorUtil = require('../utils/error_util');

// post one data
exports.addContact = async params => {
    if (!await _validateAddContactParams(params)) {
        throw ErrorUtil.createError(ErrorUtil.ErrorSet.REQUEST_PARAMETER_ERROR);
    }
    let data = await ContactsDB.addContact(params);
    data.contact_id = data._id;
    delete data._id;
    return {result: data};
}

async function _validateAddContactParams(params) {
    var emailPattern = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/,
    	phonePattern = /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;

    if (!params.name.value) {
        return true;
    } else if (!params.email.value) {
        return true;
    } else if (!emailPattern.test(params.email.value)) {
        params.email.focus();
        return true;
    } else if (!params.phone.value) {
        params.phone.focus();
        return true;
    } else if (!phonePattern.test(params.phone.value)) {
        return true;
    }

    return false;
}

// get all datas
exports.getAllContacts = async params => {
	// get array data
	let data = await ContactsDB.getAllContacts();

	for (var i = 0; i < data.length; i++)
	{
		data[i].contact_id = data[i]._id;
		delete data[i]._id;
	}
	return data;
}

// delete data
exports.deleteContact = async params => {
	//delete data
	let result = await ContactsDB.deleteContact(params);

	return result;
}

// update data
exports.updateContact = async params => {
	//update data
	let result = await ContactsDB.updateContact(params);

	return result;
}