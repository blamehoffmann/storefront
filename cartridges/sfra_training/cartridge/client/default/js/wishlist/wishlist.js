'use strict';

module.exports = {
    wishlist: function () {
        $('#add-to-wishlist').on('click', function (e) {
            e.preventDefault();
            const addToWishlistBtn = $(this);
            const addUrl = addToWishlistBtn.data('add');
            const removeUrl = addToWishlistBtn.data('remove');
            
            if (addToWishlistBtn.hasClass('active')) {
                $.ajax({
                    url: removeUrl,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        pid: addToWishlistBtn.data('pid')
                    },
                    success: function () {
                        addToWishlistBtn.toggleClass('active');
                    },
                    error: function (err) {
                        console.log('error', err);
                    }
                });
            } else {
                $.ajax({
                    url: addUrl,
                    type: 'post',
                    success: function () {
                        addToWishlistBtn.toggleClass('active');
                    },
                    error: function (err) {
                        console.log('error', err);
                    }
                });
            }
        });
        $('.wishlist-remove-btn').on('click', function(e){
            e.preventDefault();
            const removeFromWishlistBtn = $(this);
            const removeUrl = removeFromWishlistBtn.data('remove');
            $.ajax({
                url: removeUrl,
                type: 'post',
                success: function (data) {
                    removeFromWishlistBtn.parents('.product').parent().remove();
                    if(!data.isEmpty){
                        $('.product-grid').append('<div><h3>Wishlist is empty</h3></div>');
                        $('#remove-all').remove();
                    }
                },
                error: function (err) {
                    console.log('error', err);
                }
            });
        });
        $('#remove-all').on('click', function(e){
            e.preventDefault();
            const removeAllBtn = $(this);
            const removeUrl = removeAllBtn.data('remove');
            $.ajax({
                url: removeUrl,
                type: 'post',
                success: function () {
                    $('.product-grid').empty().append('<div><h3>Wishlist is empty</h3></div>');
                    $('#remove-all').remove();
                },
                error: function (err) {
                    console.log('error', err);
                }
            });
        })
    }
};
