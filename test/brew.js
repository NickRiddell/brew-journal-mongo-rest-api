process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Brew = require("../models").Brew;
let router = require("../routes").router;

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Brews', () => {
    beforeEach((done) => { //Before each test we empty the database
        Brew.remove({}, (err) => { 
           done();         
        });     
    });
/*
  * Test the /GET route
  */
  describe('/GET brew', () => {
      it('it should GET all the brews', (done) => {
        chai.request(app)
            .get('/brew')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });

});