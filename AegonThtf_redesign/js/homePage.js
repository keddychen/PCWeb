/**
 * Created by chenxiaping on 17/3/23.
 */
$(function() {
    //主菜单
    $('.subNavInWrapper1 dd:last').css('text-align','center');
    $('.subNavInWrapper1 dd:first,.subNavInWrapper2 dd:first').css('width','90px');

    $('.hm').hover(function () {
        $(this).find('.subMenu').stop().slideDown();
    },function(){
        $(this).find('.subMenu').stop().slideUp();
    });

    //banner轮播
    var colorArray=['#496281','#180B03','#F1F5E7'];
    $('.imgList li').each(function(index, el) {
        $(el).css('background-color', colorArray[index]);
    });

    $('.imgList li:first').show();

    $('.dianList li:last').css('margin-right', 0);

    var num=0;
    var timer;

    function nextFn(event) {

        $('.imgList li').eq(num).stop().fadeOut(1000);
        num++;
        if(num>5){
            num=0;
        }

        $('.dianList li').eq(num).addClass('current').siblings().removeClass('current');

        $('.imgList li').eq(num).addClass('current').siblings().removeClass('current');

        $('.imgList li').eq(num).stop().fadeIn(1000);

    }

    timer=setInterval(nextFn, 1500);

    $('.banner').hover(function() {
        clearInterval(timer);
    }, function() {
        clearInterval(timer);
        timer=setInterval(nextFn, 1500);
    });

    $('.dianList li').click(function(event) {

        $('.imgList li').eq(num).stop().fadeOut(1000);

        var i=$(this).index();

        $('.dianList li').eq(i).addClass('current').siblings().removeClass('current');

        $('.imgList li').eq(i).addClass('current').siblings().removeClass('current');
        $('.imgList li').eq(i).stop().fadeIn(1000);

        num=i;

    });

    //产品详情
    var elem=$('.productList li');
    var serveMenu=$('.serveList li');
    for(var i=0;i<elem.length;i++){
        (function(w){
            elem[w].onclick=function(){
                if(w==0){
                    $('.b1,.productCon-hotSell').show();
                    $('.b2,.b3,.productCon-individual,.productCon-organization').hide();
                }else if(w==1){
                    $('.b2,.productCon-individual').show();
                    $('.b1,.b3,.productCon-hotSell,.productCon-organization').hide();
                }else if(w==2){
                    $('.b3,.productCon-organization').show();
                    $('.b1,.b2,.productCon-hotSell,.productCon-individual').hide();
                }
            }
        })(i);
    }
    for(var i=0;i<serveMenu.length;i++){
        (function(w){
            serveMenu[w].onclick=function(){
                if(w==0){
                    $('.bs1,.serveCon-individual').show();
                    $('.bs2,.serveCon-organization').hide();
                }else if(w==1){
                    $('.bs2,.serveCon-organization').show();
                    $('.bs1,.serveCon-individual').hide();
                }
            }
        })(i);
    }

    $('.p-i-rel li,.productInCon').hover(function(){
        $(this).addClass('current').siblings().removeClass("current");
    },function(){
        $(this).removeClass('current');
    });

    $('.productCon-hotSell li').eq(2).hover(function(){
        $(this).removeClass('current');
    },function(){
        $(this).removeClass('current');
    });

    $('.serveCon-individual li,.serveCon-organization li').hover(function () {
        $(this).find('.caption').stop().slideDown();
    },function () {
        $(this).find('.caption').stop().slideUp();
    });

    $('.caption:even').css('background-color','#39bdfe');
    $('.caption').eq(8).css('background-color','#f5810f');

    //更多新闻内容
    $('.news li').hover(function(){
        $(this).addClass("current").siblings().removeClass("current");
        $(".left > div.view03").eq($(this).index()).addClass("curr").siblings().removeClass("curr");
    });
    $('.investmentSearch li').hover(function(){
        $(this).addClass("current").siblings().removeClass("current");
        $(".right > div.view03").eq($(this).index()).addClass("curr").siblings().removeClass("curr");
    });

    var newsList=$('.con');
    var onOff=true;
    $('.OpenClose').on('click',function(){
        if(onOff==true){
            newsList.stop().slideDown();
            $('.OpenClose.on strong').show();
            $('.OpenClose span').hide();
            onOff=false;
        }else{
            newsList.stop().slideUp();
            $('.OpenClose span').show();
            $('.OpenClose.on strong').hide();
            onOff=true;
        }

    });

    //快速返回首页
    var viewHeight=$(window).height();

    $(window).scroll(function(event) {

        if($(window).scrollTop()>=viewHeight){
            $('.goBack').show();
        }else{
            $('.goBack').hide();
        }

    });

    $('.goBack').click(function(event) {
        $('html,body').stop().animate({
            'scrollTop':0
        }, 500);

    });

});
