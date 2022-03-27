var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');

server.get('Show', cache.applyDefaultCache, function (req, res, next) {
    var Site = require('dw/system/Site');
    res.render('hello', { param1: Site.current.name });
    next();
});

module.exports = server.exports();
