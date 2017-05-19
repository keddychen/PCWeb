$(function() {
    $('img.lazy').lazyload();

    //费用包含弹层
    $('.layer_pop').on('click',function(){
        $('#descLayer').show();
    })
    $('#closeBtn').on('click',function(){
        $('#descLayer').hide();
    })

    //筛选框展开收起
    $('.expand_collapse_inner').on('click',function() {
        $_this =$(this);
        if($_this.hasClass('on')) {
            $_this.removeClass('on');
            $_this.html('更多选项（'+$_this.data("filter-value")+'）<i></i>')
            $('.filter_item_wrapper').each(function(i){
                if( i > 3) {
                    $(this).hide();
                } 
            })
            $('.fiw_divide').each(function(i){
                if( i > 2) {
                    $(this).hide();
                } 
            })
        } else {
            $_this.addClass('on');
            $_this.html('收起<i></i>');
            $('.filter_item_wrapper').show();
            $('.fiw_divide').show();
        }
    });
    $('.filter_item_wrapper').each(function(i){
        if( i > 3) {
            $(this).hide();
        } 
    });
    $('.fiw_divide').each(function(i){
        if( i > 2) {
            $(this).hide();
        } 
    })

    //banner slider 
    var bannerSlider = new Slider($('#bannerSlider'), {
        time: 5000,
        delay: 400,
        event: 'hover',
        auto: true,
        mode: 'fade',
        controller: $('#bannerCtrl'),
        activeControllerCls: 'active'
    });
    
    /**
	 * 53客服深度自由行列表页点击事件，添加google事件统计代码，右侧工具按钮统计
	 */
	$('body').on('click', '#KFLOGO div', function() {
		var _index = $(this).index();
		if (_index == 0) {
			//客服点击
			if(!!ga){
				ga('send', 'event', 'consult', '53kf_click', 'pack_list'); 
			}
			
		} else if (_index == 2) {
			//腾讯客服点击			
			if(!!ga){
				ga('send', 'event', 'consult', 'qq', 'pack_list');  
			}
			
		}
	});
    
    //唤起客服
    $(".btn-pack-53kf").click(function(){
    	if(!!ga) ga('send', 'event', 'consult', 'live800_click', 'pack_list_banner');
//    	window.open('http://www2.53kf.com/webCompany.php?arg=10055668&style=1&kflist=off&kf=hong.li@woqu.com,ivy.lo@woqu.com,yanli.liu@woqu.com,ray.lv@woqu.com,wei.liu@woqu.com,xi.wang@woqu.com,qiang.luo@woqu.com,&zdkf_type=1&language=zh-cn&charset=gbk&lytype=0&referer='+window.encodeURIComponent(window.location.href)+'&keyword=&tfrom=1&tpl=crystal_blue','_blank','height=473,width=703,top=200,left=200,status=yes,toolbar=no,menubar=no,resizable=yes,scrollbars=no,location=no,titlebar=no');
    	$("#onlineKefu").click();
    });
    
    //hover tips
    $(".packages_list").delegate(".instant_order", "mouseover", function(){
    	Layer.hoverTips.create(this, false, '', '本产品价格、出行日期等已经经过核实，下单后即时付款。', 250);
    });
    $(".packages_list").delegate(".instant_order", "mouseleave", function(){
    	Layer.hoverTips.hide();
    });
    
    $(".packages_list").delegate(".second_confirm", "mouseover", function(){
    	Layer.hoverTips.create(this, false, '', '下单后留下您的联系方式，客服将在48小时内与您联系并确认订单。', 250);
    });
    $(".packages_list").delegate(".second_confirm", "mouseleave", function(){
    	Layer.hoverTips.hide();
    });
});