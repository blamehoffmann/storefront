'use strict';

var formValidation = require('../components/form-validation');

module.exports = function () {
    $('form.login').submit(function (e) {
        var form = $(this);
        e.preventDefault();
        var url = form.attr('action');
        form.spinner().start();
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: form.serialize(),
            success: function (data) {
                form.spinner().stop();
                if (!data.success) {
                    formValidation(form, data);
                } else {
                    location.href = data.redirectUrl;
                }
            },
            error: function () {
                form.spinner().stop();
            }
        });
        return false;
    });

    $('form.registration').submit(function (e) {
        var form = $(this);
        e.preventDefault();
        var url = form.attr('action');
        form.spinner().start();
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: form.serialize(),
            success: function (data) {
                form.spinner().stop();
                if (!data.success) {
                    formValidation(form, data);
                } else {
                    location.href = data.redirectUrl;
                }
            },
            error: function () {
                form.spinner().stop();
            }
        });
        return false;
    });

    $('.reset-password-form').submit(function (e) {
        var form = $(this);
        e.preventDefault();
        var url = form.attr('action');
        form.spinner().start();
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: form.serialize(),
            success: function (data) {
                form.spinner().stop();
                if (!data.success) {
                    formValidation(form, data);
                } else {
                    $('.modal-title').text(data.receivedMsgHeading);
                    $('.modal-body').empty().append('<p>' + data.receivedMsgBody + '</p>');
                    $('#modalButton').text(data.buttonText).attr('data-dismiss', 'modal');
                }
            },
            error: function () {
                form.spinner().stop();
            }
        });
        return false;
    });

    $('#login .modal').on('hidden.bs.modal', function () {
        $('#reset-password-email').val('');
        $('.modal-dialog .form-group.has-danger').removeClass('has-danger');
    });
};