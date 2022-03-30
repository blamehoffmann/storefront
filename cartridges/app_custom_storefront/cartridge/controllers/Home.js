'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');

server.extend(module.superModule);

server.prepend('Show', cache.applyDefaultCache, function (req, res, next) {
    var viewData = res.getViewData();
    viewData.param1 = 'This is from prepend';
    res.setViewData(viewData);
    next();
});

server.append('Show', cache.applyDefaultCache, function (req, res, next) {
    var viewData = res.getViewData();
    var appendParam = 'This is from append';
    var queryparam = req.querystring.param ? req.querystring.param : 'no parameter was passed';
    res.setViewData({
        param1: viewData.param1 + ' AND ' + appendParam + ' AND querystring param = ' + queryparam
    });
    next();
});

// server.replace('Show', cache.applyDefaultCache, function (req, res, next) {
//     var Site = require('dw/system/Site');
//     var PageMgr = require('dw/experience/PageMgr');
//     var pageMetaHelper = require('*/cartridge/scripts/helpers/pageMetaHelper');

//     var viewData = res.getViewData();
//     var appendParam = 'This is from append';
//     var replaceParam = req.querystring.param ? req.querystring.param : 'no parameter was passed';

//     pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);

//     var page = PageMgr.getPage('homepage');

//     if (page && page.isVisible()) {
//         res.page('homepage');
//     } else {
//         res.render('home/homePage');
//     }

//     res.setViewData({
//         param1: viewData.param1 + ' AND ' + appendParam + ' AND querystring param = ' + replaceParam
//     });

//     next();
// });

module.exports = server.exports();
