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
        var Resource = require('dw/web/Resource');

        // email confirm validation
        newsletterForm.valid = newsletterForm.email.value.toLowerCase() === newsletterForm.emailconfirm.value.toLowerCase();

        // Perform any server-side validation before this point, and invalidate form accordingly
        if (newsletterForm.valid) {
            this.on('route:BeforeComplete', function (req, res) {
                var Transaction = require('dw/system/Transaction');
                try {
                    Transaction.wrap(function () {
                        var CustomObjectMgr = require('dw/object/CustomObjectMgr');
                        var co = CustomObjectMgr.createCustomObject('NewsletterSubscription', newsletterForm.email.value);
                        co.custom.firstName = newsletterForm.fname.value;
                        co.custom.lastName = newsletterForm.lname.value;

                        res.json({
                            success: true,
                            redirectUrl: URLUtils.url('Newsletter-Success').toString()
                        });
                    });
                } catch (e) {
                    var err = e;
                    if (err.javaName === 'MetaDataException') {
                        /* Duplicate primary key on CO: send back message to client-side, but don't log error. This is possible if the user tries to subscribe with the same email multiple times */
                        res.json({
                            success: false,
                            error: [Resource.msg('error.subscriptionexists', 'newsletter', null)]
                        });
                    } else {
                        /* Missing CO definition: Log error with message for site admin, set the response to error, and send error page URL to client-side */
                        var Logger = require('dw/system/Logger');
                        Logger.getLogger('newsletter_subscription').error(Resource.msg('error.customobjectmissing', 'newsletter', null));
                        // Show general error page: there is nothing else to do
                        res.setStatusCode(500);
                        res.json({
                            error: true,
                            redirectUrl: URLUtils.url('Error-Start').toString()
                        });
                    }
                }
            });
        } else {
            // Handle server-side validation errors here: this is just an example
            res.json({
                success: false,
                error: [Resource.msg('error.crossfieldvalidation', 'newsletter', null)]
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
