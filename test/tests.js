// using Mocha to test for http request simulation

require('../index.js');
var expect = require('chai').expect;
var request = require('request');

describe('Basic single operations to shopping cart', function () {

  it('should get sum 0 of items and code and code 404', function (done) {
    request.get('http://localhost:3000/get-sum', function (err, res) {
      expect(res.statusCode).to.equal(404);
      done();
    });
  });

  it('should insert an item and get code 200', function (done) {
    request.post('http://localhost:3000/add-to-cart?itemId=1000&price=30.0', function (err, res) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('should recieve the most expensive item with code 200', function (done) {
    request.get('http://localhost:3000/get-most-expensive', function (err, res) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('should recieve the cheapest item with code 200', function (done) {
    request.get('http://localhost:3000/get-cheapest', function (err, res) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('should remove an item and get code 200', function (done) {
    request.post('http://localhost:3000/remove-from-cart?itemId=1000', function (err, res) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('should get 404 for not found item', function (done) {
    request.get('http://localhost:3000/?itemId=1000', function (err, res) {
      expect(res.statusCode).to.equal(404);
    });
    done();
  })
});

describe('Shopping cart multiple requests test', function () {

  it('should insert 100 items into shopping cart', function (done) {
    // will use counter as itemId for simplicity, same price
    var itemsToInsert = 100;
    var pathToSend;
    while (itemsToInsert > 0) {
      pathToSend = 'http://localhost:3000/add-to-cart?itemId=' + itemsToInsert + '&price=1'
      request.post(pathToSend, function (err, res) {
        expect(res.statusCode).to.equal(200);
      });
      itemsToInsert--;
    }
    done();
  });

  it('should make 100 get cheapest requests', function (done) {
    var load = 100;
    while (load > 0) {
      request.get('http://localhost:3000/get-cheapest', function (err, res) {
        expect(res.statusCode).to.equal(200);
      });
      load--;
    }
    done();
  });

  it('should remove 100 items from shopping cart', function (done) {
    // will use counter as itemId for simplicity, same price
    var itemsToRemove = 99;
    var pathToSend;
    while (itemsToRemove > 0) {
      pathToSend = 'http://localhost:3000/remove-from-cart?itemId=' + itemsToRemove
      request.post(pathToSend, function (err, res) {
        expect(res.statusCode).to.equal(200);
      });
      itemsToRemove--;
    }
    done();
  });
});