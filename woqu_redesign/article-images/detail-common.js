$(function($, window, document, undefined) {
	var $Common = {
		init: function() {

			//show wechat code
			$('.share_list').on('click', '.wechat', function() {
				$('#wechatCode').show().find('a').click(function() {
					$('#wechatCode').hide();
				});
			});

			$Common.exchangeImg();
			$Common.clickImage();

			//qa
			$('#questionDialog [name="question"]').wqPlaceHolder({
				fontSize : '14px',
				top : 55,
				left : 45,
				content : '请输入您要咨询的问题',
				relParent : $('#questionDialog')
			});
			if ($('#questionDialog [name="contact"]').attr('data-n') != '1') {
				$('#questionDialog [name="contact"]').wqPlaceHolder({
					fontSize : '14px',
					top : 232,
					left : 45,
					content : '请输入您的联系方式(email/手机号)',
					relParent : $('#questionDialog')
				});
			}
		},
		exchangeImg: function() {
			var imgUl = $('.img_ul'),
				childList = imgUl.children(),
				len = childList.length,
				totalLen = childList.length * 123;
			imgUl.css('width', totalLen);
			$('.next_img_btn').click(function() {
				var _this = $(this),
					able = _this.attr('data-able');
				if (len < 4 || imgUl.css('left') == (492 - totalLen + 'px')) {
					return;
				}
				_this.attr('data-able', 'false');
				if (able == 'true') {
					imgUl.animate({
						left: '-=123px'
					}, function() {
						_this.attr('data-able', 'true');
						if (len < 4 || imgUl.css('left') == (492 - totalLen + 'px')) {
							$(".next_img_btn").css("visibility", "hidden");
						}
						if (imgUl.css('left') != '0px') {
							$(".prev_img_btn").css("visibility", "visible");
						}
					});
				}
			});
			$('.prev_img_btn').click(function() {
				var _this = $(this),
					able = _this.attr('data-able');
				if (imgUl.css('left') == '0px') {
					return;
				}
				_this.attr('data-able', 'false');
				if (able == 'true') {
					imgUl.animate({
						left: '+=123px'
					}, function() {
						_this.attr('data-able', 'true');
						if (imgUl.css('left') == '0px') {
							$(".prev_img_btn").css("visibility", "hidden");
						}
						if (len != 4 && imgUl.css('left') != (492 - totalLen + 'px')) {
							$(".next_img_btn").css("visibility", "visible");
						}
					});
				}
			});
		},
		clickImage: function() {
			var imgUl = $('.img_ul'),
				childList = imgUl.children();
			childList.click(function() {
				var size = "120x90";
				var bigSize = "500x300";
				var bigUrl = $(this).find("img").attr("src").replace(size, bigSize);
				$(".mainImage").attr("src", bigUrl);
				imgUl.find("li.active_img_li").removeClass("active_img_li");
				$(this).addClass("active_img_li");
			});

		}
	};

	window.$Common = $Common;

	$Common.init();

}(jQuery, window, document));
