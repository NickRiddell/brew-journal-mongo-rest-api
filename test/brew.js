process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Brew = require("../models").Brew;

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
            .get('/brews')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });

  /*
  * Test the /POST route
  */
  describe('/POST brew', () => {
      it('it should not POST a brew without specificGravityInitial field', (done) => {
        let brew = {
            title: "Coffee Wine",
            ingredients: "Ground coffee(170g), water, sugar(900g), yeast(5g), nutrient(3tsp)"
        }
        chai.request(app)
            .post('/brews')
            .send(brew)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
            done();
            });
      });

		it('it should POST a brew with all required fields entered ', (done) => {
		        let brew = {
		            title: "Coffee Wine",
		            ingredients: "Ground coffee(170g), water, sugar(900g), yeast(5g), nutrient(3tsp)",
		            specificGravityInitial: 1.098
		        }
		        chai.request(app)
		            .post('/brews')
		            .send(brew)
		            .end((err, res) => {
		                res.should.have.status(201);
		                res.body.should.be.a('object');
		                res.body.should.have.property('title');
		                res.body.should.have.property('ingredients');
		                res.body.should.have.property('specificGravityInitial');
		              done();
		            });
		      });
		  });

});