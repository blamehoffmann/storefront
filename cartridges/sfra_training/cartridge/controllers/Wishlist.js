'use strict';

var server = require('server');

server.get('Show', function (req, res, next) {
    var productListMgr = require('dw/customer/ProductListMgr');
    var list;
    var productLists = productListMgr.getProductLists(req.currentCustomer.raw, 10);

    list = productLists.length > 0 ? productLists[0] : null;
    res.setViewData({ wishlist: list });
    res.render('wishlist/wishlist');
    next();
});

server.post('Add', function (req, res, next) {
    var wishlistHelper = require('*/cartridge/scripts/helpers/wishlistHelper');
    var productListMgr = require('dw/customer/ProductListMgr');
    var Transaction = require('dw/system/Transaction');
    var list;
    var productId = req.querystring.pid;
    var currentCustomer = req.currentCustomer.raw;

    var productLists = productListMgr.getProductLists(currentCustomer, 10).length;

    if (!productLists) {
        productLists = wishlistHelper.createWishlist(currentCustomer, 10);
    } else {
        productLists = productListMgr.getProductLists(currentCustomer, 10);
    }

    list = productLists[0];
    try {
        Transaction.wrap(function () {
            var productMgr = require('dw/catalog/ProductMgr');
            var product = productMgr.getProduct(productId);
            list.createProductItem(product);
        });
    } catch (e) {
        res.setStatusCode(500);
        res.json({
            error: true,
            errorMessage: e.message
        });
    }
    res.json({
        success: true
    });
    next();
});

server.post('Remove', function (req, res, next) {
    var productListMgr = require('dw/customer/ProductListMgr');
    var Transaction = require('dw/system/Transaction');
    var list;
    var removedProduct;
    var productId = req.querystring.pid;
    var productLists = productListMgr.getProductLists(req.currentCustomer.raw, 10);

    list = productLists[0];

    list.items.toArray().forEach(function(item) {
        if (item.productID === productId) {
            removedProduct = item;
            return removedProduct;
        }
    });
    try {
        Transaction.wrap(function () {
            list.removeItem(removedProduct);
        });
    } catch (e) {
        res.setStatusCode(500);
        res.json({
            error: true,
            errorMessage: e.message
        });
    }
    res.json({
        success: true,
        isEmpty: list.items.length
    });
    next();
});

server.post('RemoveAll', function (req, res, next) {
    var productListMgr = require('dw/customer/ProductListMgr');
    var Transaction = require('dw/system/Transaction');
    var list;
    var productLists = productListMgr.getProductLists(req.currentCustomer.raw, 10);

    list = productLists[0];

    try {
        Transaction.wrap(function () {
            productListMgr.removeProductList(list);
        });
    } catch (e) {
        res.setStatusCode(500);
        res.json({
            error: true,
            errorMessage: e.message
        });
    }
    res.json({
        success: true
    });
    next();
});

module.exports = server.exports();
