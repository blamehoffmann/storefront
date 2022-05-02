'use strict';

function ifItemExist(productId, wishList, currentCustomer) {
    var list;
    var productLists = wishList.getProductLists(currentCustomer, 10);
    var founded = false;

    list = productLists.length > 0 ? productLists[0] : null;
    if (!list) {
        return founded;
    }
    list.items.toArray().forEach(function (item) {
        if (item.productID === productId) {
            founded = item;
        }
    });
    return founded;
}

function createWishlist(customer, listType) {
    var Transaction = require('dw/system/Transaction');
    var productListMgr = require('dw/customer/ProductListMgr');
    var list;

    Transaction.wrap(function () {
        list = productListMgr.createProductList(customer, listType);
    });
    return list;
}

module.exports = {
    ifItemExist: ifItemExist,
    createWishlist: createWishlist
};
