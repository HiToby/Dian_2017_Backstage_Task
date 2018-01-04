'use strict';

let chai = require('chai');
let expect = require('chai').expect;
const debug = require('debug')('TEST');
let should = chai.should();

chai.use(require('chai-http'));
chai.use(require('chai-json-schema'));

let baseUrl = (process.env.NODE_ENV === 'production') ? 'http://120.79.74.51:3000' : 'http://localhost:3000';
// let baseUrl = 'http://localhost:3000'
let addContactsJsonSchema = {
    title: 'Add Contacts Response JSON Schema',
    type: 'object',
    required: ['result'],
    properties: {
        result: {
            type: 'object',
            required: ['contact_id', 'phone', 'name','email'],
            properties: {
                contact_id: {type: 'string'},
                phone: {type: 'string'},
                name: {type: 'string'},
                email: {type:'string'},
            }
        }
    }
};

let getAllContactsJsonSchema = {
    title: 'Get All Contacts Response JSON Schema',
    
    required: ['result'],
    properties: {
        result: {
            type: 'array',
            required: ['contact_id', 'phone', 'name','email'],
            properties: {
                contact_id: {type: 'string'},
                phone: {type: 'string'},
                name: {type: 'string'},
                email: {type:'string'},
            }
        }
    }
};

let UpdateContactsJsonSchema = {
    title: 'Update Contacts Response JSON Schema',
    type: 'object',
    required:['result'],
    properties:{
        result:{
            type: 'object',
            required: ['contact_id','documents'],
            properties: {
                contact_id : {type : 'string'},
                documents : {
                    type : 'object',
                    required: ['phone', 'name','email'],
                    properties: {
                        phone: {type: 'string'},
                        name: {type: 'string'},
                        email: {type:'string'},
                    }
                }
            } 
        }
    }    
};

let DeleteContactsJsonSchema = {
    title: 'Delete Contacts Response JSON Schema',
    type: 'object',
    required: ['result'],
    properties:{
        result:{
            type:'array',
            required: ['contact_id', 'phone', 'name','email'],
            properties: {
                contact_id: {type: 'string'},
                phone: {type: 'string'},
                name: {type: 'string'},
                email: {type:'string'},
            }
        }
    }
}

var test_id;

describe('Contacts API', () => {
    // test add contact
    it('Add Contact', done => {
        let testBody = {
            phone: '18827054817',
            name: 'Dian',
            email: 'email@email.com'
        };
        chai.request(baseUrl)
            .post('/contacts')
            .send(testBody)
            .end((err, res) => {
                if (err) {
                    debug(`error => ${err.stack}`);
                    done(err);
                } else {
                    expect(res.body).to.be.jsonSchema(addContactsJsonSchema);
                    debug(`response => ${JSON.stringify(res.body, null, 2)}`);
                    test_id = res.body.result.contact_id;
                    done();
                }
            });
    });

    // test get all contacts
    it('Get All Contacts', done => {
        chai.request(baseUrl)
            .get('/contacts')
            .end(function(err,res) {
                if (err){
                    debug(`error => ${err.stack}`);
                    done(err); 
                } else {
                    res.should.have.status(200);
                    res.should.be.json;
                    expect(res.body).to.be.jsonSchema(getAllContactsJsonSchema);
                    debug(`response => ${JSON.stringify(res.body, null, 2)}`);
                    done();
                }
            });
    });

    // test update contact
    it('Update Contact', done => {
        let testBody = {
            "name": "UpdateTest",
            "phone": "15888888888",
            "email": "test@email.com"
        }

        chai.request(baseUrl)
            .put('/contacts/' + test_id)
            .send(testBody)
            .end(function(err,res) {
                if(err) {
                    debug(`error => ${err.stack}`);
                    done(err); 
                } else {
                    res.should.have.status(200);
                    res.should.be.json;
                    expect(res.body).to.be.jsonSchema(UpdateContactsJsonSchema);
                    debug(`response => ${JSON.stringify(res.body, null, 2)}`);
                    done();
                }
            });
    });

    //test delete contact
    it('Delete Contact', done =>{
        chai.request(baseUrl)
            .delete('/contacts/' + test_id)
            .end(function(err,res){
                if (err) {
                    debug(`error => ${err.stack}`);
                    done(err); 
                } else {
                    res.should.have.status(200);
                    res.should.be.json;
                    expect(res.body).to.be.jsonSchema(DeleteContactsJsonSchema);
                    debug(`response => ${JSON.stringify(res.body, null, 2)}`);
                    done();
                }
            });
    });
});
