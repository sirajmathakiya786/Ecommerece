const express = require('express');
const router = express.Router();
const cart = require('../controller/cart');
const { verifyJwtToken } = require('../middleware/Auth');

router.post('/add', verifyJwtToken,cart.addToCart);
router.get('/get-cart', verifyJwtToken,cart.getCart);
router.post('/add-address', verifyJwtToken,cart.addToAddress);
router.get('/get-address', verifyJwtToken,cart.getAddress);


module.exports = router;