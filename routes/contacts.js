'use strict';

let express = require('express');
let router = express.Router();
let ContactsLogger = require('../logger').ContactsLogger;
let ContactsController = require('../controllers/contacts_controller');

// 获取'/'路径的post请求
router.post('/', async (req, res, next) => {
    let params = {
        "name": req.body.name,
        "phone": req.body.phone,
        "email": req.body.email
        //创建post的内容
    };
    try {
        let result = await ContactsController.addContact(params);
        ContactsLogger.info(`add contact result => ${JSON.stringify(result, null, 2)}`);
        res.json(result);
    } catch(err) {
        ContactsLogger.error(`add contact error => ${err.stack}`);
        next(err);
    }
});

// 获取'/'路径的get请求
router.get('/',async(req,res,next) => {
    try{
        // get all documents
        let result = await ContactsController.getAllContacts();
        // get documents success log
        ContactsLogger.info(`get all contacts result => ${JSON.stringify(result,null,2)}`);
        // send a json res
        res.json({"result": result});
    } catch (err) {
        //error log
        ContactsLogger.info(`get all contacts error' => ${JSON.stringify(err.stack)}`);
        next(err);
    }
});

// 响应'/:contact_id'路径的delete请求
router.delete('/:contact_id',async(req,res,next) => {
    let params = {'contact_id':req.params.contact_id};
    try{
        // get all documents
        let result = await ContactsController.deleteContact(params);
        // get documents success log
        ContactsLogger.info(`delete contacts result => ${JSON.stringify(result,null,2)}`);
        // send a json res
        res.json({"result": result});
    } catch (err) {
        //error log
        ContactsLogger.info(`delete contacts error' => ${JSON.stringify(err.stack)}`);
        next(err);
    }
});

// 响应'/:contact_id'路径的put请求
router.put('/:contact_id',async(req,res,next) => {
    let params = {
        'contact_id' : req.params.contact_id,
        'documents'  : {
            'name'       : req.body.name,
            'phone'      : req.body.phone,
            'email'      : req.body.email
        }
    };

    try{
        // get all documents
        let result = await ContactsController.updateContact(params);
        // get documents success log
        ContactsLogger.info(`UPDATE SUCCESS`);
        ContactsLogger.info(`update contacts result => ${JSON.stringify(result,null,2)}`);
        // send a json res
        res.json({"result": result});
    } catch (err) {
        //error log
        ContactsLogger.info(`update contacts error' => ${JSON.stringify(err.stack)}`);
        next(err);
    }
});

module.exports = router;