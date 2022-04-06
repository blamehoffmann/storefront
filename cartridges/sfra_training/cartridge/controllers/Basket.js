'use strict';

/**
 * @namespace Basket
 */

var server = require('server');

/**
 * Basket-Show : The Basket-Show endpoint renders the cart page with the current basket
 * @name Base/Basket-Show
 * @function
 * @memberof Basket
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get('Show', function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var CartModel = require('*/cartridge/models/cart');
    var basketModel = new CartModel(BasketMgr.currentBasket);

    res.setViewData({ basket: basketModel });
    res.render('basket/basket');
    next();
});

module.exports = server.exports();
