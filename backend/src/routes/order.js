const expresss = require('express');
const router = expresss.Router();
const order = require('../controller/order');
const { verifyJwtToken } = require('../middleware/Auth'); //sellerVerifyJwtToken,adminVerifyJwtToken

router.post('/create', verifyJwtToken, order.createOrder);
router.get('/product-page',order.rednerProductPage);
router.get('/all-order',order.allOrders);

module.exports = router;