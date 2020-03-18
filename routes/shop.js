const express = require('express');
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isauth');
const obj = require('../middleware/permissions');

const router = express.Router();

router.get(['/', '/products'], shopController.getProducts);

router.get('/products/:prodId', shopController.getProduct);

router.get('/cart', isAuth,obj.permituser("user") ,shopController.getCart);

router.post('/cart', isAuth, obj.permituser("user"),shopController.postCart);

router.post('/cart-delete-item', isAuth, obj.permituser("user"),shopController.postCartDeleteProduct);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/payment-page', isAuth, obj.permituser("user"),shopController.getPayment);

router.get('/order-history', isAuth, obj.permituser("user"),shopController.getOrders);
router.post('/delete-history', isAuth, obj.permituser("user"),shopController.deleteHistory)

module.exports = router;
