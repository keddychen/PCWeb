$(function($, window, document, undefined) {
    var win = $(window), 
        winWidth = win.width(), 
        winHeight = win.height();

    function barPosFix(winWidth) {
        var barLeft = (winWidth - 1200) / 2 - 200;
        if (winWidth < 1300) {
            barLeft = 0;
        }
        var target = $('.side_bar'),
            offset = target.data('offset') || 0;
        target.css('left', barLeft + offset);
    }
    
    barPosFix(winWidth);
    $('img.lazy').lazyload();
    
    $(window).resize(function() {
        var winWidth = win.width(),
            winHeight = win.height();
        barPosFix(winWidth);
    });

    $('.wq_scroll_nav_top').wqScrollSpy({
        wq_scroll_nav: 'wq_scroll_nav_top',
        wq_scroll_navbar: 'wq_scroll_navbar_top',
        wq_scroll_part: 'wq_scroll_part_top',
        ActiveControlClass: 'side_on',
        beforeScrollArea: function() {
            $('.side_bar').find("li").removeClass("side_on");
        }
    });
}(jQuery, window, document));
