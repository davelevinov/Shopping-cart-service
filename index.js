// using express npm
var express = require('express');
var app = express();
var url = require('url')

// start with empty shopping cart, sum 0
var currentCart = {};
var shoppingCartSum = 0

// returns cheapest item in shopping cart or shopping cart empty
function getCheapestItem(callback) {
  if (Object.keys(currentCart).length == 0) {
    // console.log('The shopping cart is empty')
    callback(404, 'The shopping cart is empty')
    return
    // return ('The shopping cart is empty')
  }
  var minKey = Object.keys(currentCart).reduce(function (a, b) { return Number.parseFloat(currentCart[a]) < Number.parseFloat(currentCart[b]) ? a : b });
  var minVal = currentCart[minKey]
  var result = '{"itemId": "' + minKey + '", "Price": "' + minVal + '" }'

  // console.log('cheapest item is:' + result)
  callback(200, result)
  // return result
}

// returns most expensive item in shopping cart or shopping cart empty
function getMostExpensiveItem(callback) {
  if (Object.keys(currentCart).length == 0) {
    // console.log('The shopping cart is empty')
    callback(404, 'The shopping cart is empty')
    return
  }
  var maxKey = Object.keys(currentCart).reduce(function (a, b) { return Number.parseFloat(currentCart[a]) > Number.parseFloat(currentCart[b]) ? a : b });
  var maxVal = currentCart[maxKey]
  var result = '{"itemId": "' + maxKey + '", "Price": "' + maxVal + '" }'

  // console.log('most expensive item is: ' + result)
  callback(200, result)
  return
}

// adds item to cart or returns already exists
function addToCart(itemId, itemPrice, callback) {
  if (itemId in currentCart) {
    // console.log("item already exists in shopping cart")
    callback(400)
    return
  }
  if (Number.isNaN(Number.parseFloat(itemPrice))) {
    // console.log("price is not a number")
    callback(400)
    return
  }
  currentCart[itemId] = itemPrice;
  // console.log('shopping cart sum before addition: ' + shoppingCartSum)
  shoppingCartSum = shoppingCartSum + Number(itemPrice)
  // console.log('shopping cart sum after addition: ' + shoppingCartSum)
  // console.log('current shopping cart items: ')
  // console.log(currentCart)
  callback(200)
  return
}

// removes item from cart or returns item doesn't exist
function removeFromCart(itemId, callback) {
  if (!(itemId in currentCart)) {
    // console.log("item doesn't exist in shopping cart")
    callback(404)
    return
  }
  // console.log('current cart:')
  // console.log(currentCart)
  shoppingCartSum = shoppingCartSum - Number(currentCart[itemId])
  delete currentCart[itemId]
  // console.log(currentCart)
  callback(200);
  return
}

// get sum of all items
app.get('(/get-sum)', function (req, res) {
  if (shoppingCartSum == 0) {
    res.status(404).send('Shopping cart is empty, sum is 0')
    res.end()
  } else {
    res.status(200).send('Shopping cart sum is: ' + (shoppingCartSum).toString())
    // console.log('sum is: ')
    // console.log(shoppingCartSum)
    res.end();
  }
});

// get cheapest item price
app.get('(/get-cheapest)', function (req, res) {
 getCheapestItem(function (status, result) {
    res.status(status).send(result)
  })
  res.end();
});

// get most expensive item price
app.get('(/get-most-expensive)', function (req, res) {
  getMostExpensiveItem(function (status, result) {
    res.status(status).send(result)
  })
  res.end();
});

// POST request to add an item to shopping cart
app.post('/add-to-cart', function (req, res) {
  var itemIdFromQuery = url.parse(req.url, true).query.itemId;
  var itemPriceFromQuery = url.parse(req.url, true).query.price;
  // console.log('adding to cart item: ' + itemIdFromQuery + ' with price:' + itemPriceFromQuery)
  addToCart(itemIdFromQuery.toString(), itemPriceFromQuery, function (status) {
    if (status != 200) {
      res.status(status).send("failed")
    } else {
      res.status(status).send("success!")
    }
  })
  res.end();
});

// POST request to remove an item from the shopping cart
app.post('/remove-from-cart', function (req, res) {
  var itemIdFromQuery = url.parse(req.url, true).query.itemId;
  // console.log('removing from cart item: ' + itemIdFromQuery)
  removeFromCart(itemIdFromQuery.toString(), function (status) {
    if (status != 200) {
      res.status(status).send("failed")
    } else {
      res.status(status).send("success!")
    }
  })
  res.end()
});

app.listen(3000, function () {
  console.log('Shopping cart service running on Port 3000..');
})