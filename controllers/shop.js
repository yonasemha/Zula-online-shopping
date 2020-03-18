const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const ObjectId = require("mongodb").ObjectId
exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.prodId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: 'Product Detail',
                path: '/products'
            });
        })
        .catch(err => console.log(err));
}
//************* */ shows user cart***************************
exports.getCart = async (req, res, next) => {
    const user = await User.findById(req.session.user._id)
    user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {

            const products = user.cart;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => console.log(err));
};
// *********adds to cart********************
exports.postCart = async (req, res, next) => {
    const prodId = req.body.productId;
    const user = await User.findById(req.session.user._id)
    Product.findById(prodId)
        .then(product => {
            return user.addToCart(product);
        })
        .then(result => {
            res.redirect('/');
        })
        .catch(err => console.log(err));
};
//************delete from cart****************************** */
exports.postCartDeleteProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    let result = await Product.findById({ _id: new ObjectId(prodId) })

    const user = await User.findById(req.session.user._id);
    let quantity = user.cart.items.filter(prod=> prod.productId == prodId)[0].quantity;

    user.cart.totalprice -= (result.price * quantity) 

    user
        .deleteItemFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

//*************making order ********************************* */
exports.postOrder = async (req, res, next) => {

    const user = await User.findById(req.session.user._id)
    user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {

                return { quantity: i.quantity, product: { ...i.productId._doc } };
            });
            const order = new Order({
                user: {
                    name: req.session.user.email,
                    userId: req.session.user
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return user.clearCart();
        })
        .then(() => {
            res.redirect("/order-history");
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.session.user._id })
        .then(orders => {
            res.render('shop/history', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
};

exports.deleteHistory = (req, res) => {
    Order.deleteOne({ _id: req.body.orderId })
        .then((data) => {
            res.redirect("/order-history")
        })

}

exports.getPayment = (req, res, next) => {
    // const obj = {}
    // obj.name = req.body.name;
    // obj.address = req.body.address;
    // obj.city = req.body.city;
    // obj.zip = req.body.zip;
    // obj.state = req.body.state;
    res.render('../views/shop/orders', {

        pageTitle: 'payment-page',
        path: '/payment-page'
    });


}

