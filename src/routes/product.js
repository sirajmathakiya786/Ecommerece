const express = require('express');
const router = express.Router();
const product = require('../controller/product');
const { verifyJwtToken,sellerVerifyJwtToken,adminVerifyJwtToken } = require('../middleware/Auth');
const { userProductSchema } = require('../services/validation/productValidation');
const validateRequest = require('../middleware/bodyErrorSender');

router.post('/add', sellerVerifyJwtToken,validateRequest(userProductSchema),product.addProduct);
router.post('/favorite', verifyJwtToken,product.productLikeDislike);
router.get('/my-favorite-list', verifyJwtToken,product.myLikeProduct);
router.get('/common-product', verifyJwtToken,product.allProduct);
router.get('/test', verifyJwtToken,product.test);
router.put('/product-status/:productId', adminVerifyJwtToken,product.changeProductStatus);
router.post('/search', verifyJwtToken,product.productSearch);
router.post('/multiple-search', verifyJwtToken,product.productMultipleSearch);
router.delete('/delete/:userId', verifyJwtToken,product.deleteProduct);

module.exports = router;