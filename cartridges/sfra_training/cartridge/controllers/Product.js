'use strict';

var server = require('server');

server.extend(module.superModule);

server.append('Show', function (req, res, next) {
    var wishlistHelper = require('*/cartridge/scripts/helpers/wishlistHelper');
    var productListMgr = require('dw/customer/ProductListMgr');
    var viewData = res.getViewData();
    var productId = req.querystring.pid;
    var currentCustomer = req.currentCustomer.raw;
    var itemExist = wishlistHelper.ifItemExist(productId, productListMgr, currentCustomer);
    if (itemExist) {
        viewData.isInWishlist = true;
    }
    res.setViewData(viewData);
    next();
});

module.exports = server.exports();
