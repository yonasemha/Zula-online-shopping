const express = require('express');
const check = require('../middleware/permissions');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isauth');

const router = express.Router();

// // /admin/products => GET
router.get('/products', isAuth,check.permit("admin"), adminController.getProducts);

// /admin/add-product => GET
router.get('/add-product', isAuth, check.permit("admin"), adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', isAuth,check. permit("admin"), adminController.postAddProduct);

router.get('/edit-product/:prodId', check.permit("admin"), isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, check.permit("admin"), adminController.postEditProduct);

router.post('/delete-product', isAuth,check. permit("admin"), adminController.postDeleteProduct);



module.exports = router;
