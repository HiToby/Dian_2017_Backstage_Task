'use strict';

let chai = require('chai');
let expect = require('chai').expect;
const debug = require('debug')('TEST');
var should = chai.should();

chai.use(require('chai-http'));
chai.use(require('chai-json-schema'));

let baseUrl = (process.env.NODE_ENV === 'production') ? 'http://39.106.172.254:3000' : 'http://localhost:3000';
let addContactsJsonSchema = {
    title: 'Add Contacts Response JSON Schema',
    type: 'object',
    required: ['result'],
    properties: {
        result: {
            type: 'object',
            required: ['contact_id', 'phone', 'name'],
            properties: {
                contact_id: {type: 'string'},
                phone: {type: 'string'},
                name: {type: 'string'},
            }
        }
    }
};

describe('Contacts API', () => {
    //test 'add contacts'
    it('Add Contact', done => {
        let testBody = {
            phone: '18827054817',
            name: 'dian',
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
                    done();
                }
            });
    });
    //test 'get all contacts'
    it('Get All Contacts', done => {
        chai.request(baseUrl)
            .get('/contacts')
            .end((err, res) => {
                if (err) {
                    debug(`error => ${err.stack}`);
                    done(err);
                } else {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('result');
                    res.body.result.should.be.a('array');
                    res.body.result[0].should.have.property('name');
                    res.body.result[0].should.have.property('phone');
                    res.body.result[0].should.have.property('email');
                    res.body.result[0].should.have.property('contact_id');
                    debug(`response => ${JSON.stringify(res.body, null, 2)}`);
                    done();
                }
            });
    });
    //test 'get single contact'
    it('Get Single Contact', done => {
        chai.request(baseUrl)
            .get('/contacts/5a3e713e008403325ca2cdd9')
            .end((err, res) => {
                if (err) {
                    debug(`error => ${err.stack}`);
                    done(err);
                } else {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('result');
                    res.body.result.should.be.a('object');
                    res.body.result.should.have.property('name');
                    res.body.result.should.have.property('phone');
                    res.body.result.should.have.property('email');
                    res.body.result.should.have.property('contact_id');
                    done();
                }
            });
    });
    //test 'update contact'
    it('Update Contact', done => {
        let testbody = {
            "document": {
                "name": "卞瑞"
            }
        };
        chai.request(baseUrl)
            .put('/contacts/5a3bc00f144ed90b80cb5442')
            .send(testbody)
            .end((err, res) => {
                if (err) {
                    debug(`error => ${err.stack}`);
                    done(err);
                } else {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Contact updated!');
                    done();
                }
            });
    });
    //test 'delete contact'
    it('Delete Contact', done => {
        chai.request(baseUrl)
            .delete('/contacts/5a406ed6c678dd2b9c64f18a')
            .end((err, res) => {
                if (err) {
                    debug(`error => ${err.stack}`);
                    done(err);
                } else {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Delete successfully!');
                    done();
                }
            });
    });

});
