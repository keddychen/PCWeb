// JavaScript Document


window.onload=function(){
		var boxObj=document.getElementById('moreId');
		var listObj=document.getElementById('moreList');
		boxObj.onmouseover=function(){
			listObj.style.display='block';
		}
		boxObj.onmouseleave=function(){
			listObj.style.display='none';
		}
	}
	$(function(){
		$('.headerNav li').hover(function(){
			$(this).children('div').stop().slideToggle('slow');
		});
		$('.list-s li:last').css('border-bottom',0);
		var aLi=$('.list-s li:gt(1):not(:last)');
		aLi.hide();
		var onOff=true;
		$('.myBtn').click(function(event){
			if(onOff==true){
				aLi.stop().slideDown('slow');
				$('.myBtn').html('收起').css('background-image','url(list-images/package2.png)');
				onOff=false;
			}else{
				aLi.stop().slideUp('slow');
				$('.myBtn').html('更多选项（目的地、交通、主题）').css('background-image','url(list-images/packages_r1.png)');
				onOff=true;
			}
		});	
        $('.listBanner li').hover(function() {
            $(this).stop().animate({'width':500},600).siblings().stop().animate({'width':150}, 600);
        }, function() {
            $('.listBanner li').stop().animate({'width':200},600);
        });
        
        $('.myTravel-list li:eq(3),.myTravel-list li:eq(7)').css('margin-right', 0);	
        $('.myTravel-list li').hover(function() {
            var i=$(this).index();
            $(this).stop().animate({'top':-6},500);
            $('.wordBox').eq(i).stop().fadeIn(500);
        }, function() {
            $(this).stop().animate({'top':0},400);
            $('.wordBox').stop().fadeOut(500);
        });
        $('.Inmyqu li:eq(3),.Inmyqu li:eq(7),.Inmyqu li:eq(11)').css('margin-right', 0);
	});
