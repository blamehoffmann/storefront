'use strict';

/**
 * @namespace Newsletter
 */

var server = require('server');
var URLUtils = require('dw/web/URLUtils');
//Use the following for CSRF protection: add middleware in routes and hidden field on form
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

/**
 * Newsletter-Show : This endpoint is called to load the Newsletter page
 * @name Newsletter-Show
 * @function
 * @memberof Newsletter
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.generateToken
 * @param {renders} - isml
 * @param {serverfunction} - get
 */

server.get(
    'Show',
    server.middleware.https,
    csrfProtection.generateToken,
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
 * @param {middleware} - csrfProtection.validateAjaxRequest
 * @param {renders} - isml
 * @param {serverfunction} - post
 */
server.post(
    'Handler',
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        var newsletterForm = server.forms.getForm('newsletter');
        var continueUrl = dw.web.URLUtils.url('Newsletter-Show');
        var Resource = require('dw/web/Resource');

        // form validation
        if (newsletterForm.email.value.toLowerCase()
            !== newsletterForm.emailconfirm.value.toLowerCase()) {
            newsletterForm.valid = false;
            newsletterForm.email.valid = false;
            newsletterForm.emailconfirm.valid = false;
            newsletterForm.emailconfirm.error =
                Resource.msg('error.message.mismatch.email', 'forms', null);
        }

        // Perform any server-side validation before this point, and invalidate form accordingly
        if (newsletterForm.valid) {
            // Send back a success status, and a redirect to another route
            // res.render('/newsletter/newslettersuccess', {
            //     continueUrl: continueUrl,
            //     newsletterForm: newsletterForm
            // });
            // Show the success page
            res.json({
                success: true,
                redirectUrl: URLUtils.url('Newsletter-Success').toString()
            });
        } else {
            // Handle server-side validation errors here: this is just an example
            // res.render('/newsletter/newslettererror', {
            //     errorMsg: dw.web.Resource.msg('error.crossfieldvalidation', 'newsletter', null),
            //     continueUrl: continueUrl
            // });
            res.setStatusCode(500);
            res.json({
                error: true,
                redirectUrl: URLUtils.url('Error-Start').toString()
            });
        }

        next();
    }
);

server.get(
    'Success',
    server.middleware.https,
    function (req, res, next) {
        res.render('/newsletter/newslettersuccess', {
            continueUrl: URLUtils.url('Newsletter-Show'),
            newsletterForm: server.forms.getForm('newsletter')
        });

        next();
    }
);

module.exports = server.exports();
