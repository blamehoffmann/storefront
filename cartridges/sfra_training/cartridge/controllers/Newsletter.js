'use strict';

/**
 * @namespace Newsletter
 */

var server = require('server');

/**
 * Newsletter-Show : This endpoint is called to load the Newsletter page
 * @name Newsletter-Show
 * @function
 * @memberof Newsletter
 * @param {middleware} - server.middleware.https
 * @param {renders} - isml
 * @param {serverfunction} - get
 */

server.get(
    'Show',
    server.middleware.https,
    function (req, res, next) {
        var actionUrl = dw.web.URLUtils.url('Newsletter-Handler');
        var newsletterForm = server.forms.getForm('newsletter');
        newsletterForm.clear();

        res.render('/newsletter/newslettersignup', {
            actionUrl: actionUrl,
            newsletterForm: newsletterForm
        });

        next();
    }
);

module.exports = server.exports();
