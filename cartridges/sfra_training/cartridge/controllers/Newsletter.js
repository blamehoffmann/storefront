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

/**
 * Newsletter-Handler : This endpoint is called to Handler the Newsletter form
 * @name Newsletter-Handler
 * @function
 * @memberof Newsletter
 * @param {middleware} - server.middleware.https
 * @param {renders} - isml
 * @param {serverfunction} - post
 */
server.post(
    'Handler',
    server.middleware.https,
    function (req, res, next) {
        var newsletterForm = server.forms.getForm('newsletter');
        var continueUrl = dw.web.URLUtils.url('Newsletter-Show');

        // Perform any server-side validation before this point, and invalidate form accordingly
        if (newsletterForm.valid) {
            // Send back a success status, and a redirect to another route
            res.render('/newsletter/newslettersuccess', {
                continueUrl: continueUrl,
                newsletterForm: newsletterForm
            });
        } else {
            // Handle server-side validation errors here: this is just an example
            res.render('/newsletter/newslettererror', {
                errorMsg: dw.web.Resource.msg('error.crossfieldvalidation', 'newsletter', null),
                continueUrl: continueUrl
            });
        }

        next();
    }
);

module.exports = server.exports();
