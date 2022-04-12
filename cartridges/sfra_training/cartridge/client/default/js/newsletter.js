'use strict';

var processInclude = require('base/util');

$(document).on('ready', function () {
    processInclude(require('./newsletter/newsletter'));
});
