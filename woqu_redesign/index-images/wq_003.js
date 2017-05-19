/**
 * @usage: base	api
 **/

/* console fix for IE7 */
console = window.console || {
	log: function() {}
};

/* extend Date */
Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1, //month
		"d+": this.getDate(), //day
		"h+": this.getHours(), //hour
		"m+": this.getMinutes(), //minute
		"s+": this.getSeconds(), //second
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter
		"S": this.getMilliseconds() //millisecond
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};

var DateUtil = {
	addDay: function(date, num) {
		var tempDate = date;
		if (typeof date == 'string') {
			tempDate = new Date(date.replace(/-/g, "/"));
		}
		var newDate = new Date(tempDate.getTime() + num * 24 * 60 * 60 * 1000);
		return newDate;
	},

	getDays: function(date1, date2) {
		var tempDate1 = date1;
		var tempDate2 = date2;
		if (typeof date1 == 'string') {
			tempDate1 = new Date(date1.replace(/-/g, "/"));
		}
		if (typeof date2 == 'string') {
			tempDate2 = new Date(date2.replace(/-/g, "/"));
		}

		var num = (tempDate2.getTime() - tempDate1.getTime()) / (24 * 60 * 60 * 1000);
		return num;
	}
};

/**
 * @usage: init event
 **/
//nav
(function(){
	var navSetInter = null;
	$('.wqHeader-nav-li').hover(function(){
		if(navSetInter)clearInterval(navSetInter);
		var sideBar = $(this).siblings('.wqHeader-nav-li').find('.side-bar:visible');
		if(sideBar.length > 0){
			$('.wqHeader-nav-li').find('.side-bar').hide();
		}
		$(this).find('.side-bar').stop(true,true).show(500);
	},function(){
		var _this = $(this);
		navSetInter = setTimeout(function(){
			_this.find('.side-bar').hide();
		},300);
	});
})();

//header search
(function(){
	//show
	$('.wqHeader-search').hover(function(){
		var _this = $(this);
		var info = _this.parents('.wqHeader-info');
		if(info.is('.wqHeader-base-info')){
			_this.stop().animate({width:'162px'},500).css('borderColor','#ccc');
		}else{
			_this.stop().animate({width:'162px'},500).css('borderColor','#fff');
		}
		
	},function(){
		var _this = $(this);
		var inpt = _this.find('input');
		var v = $.trim(inpt.val());
		if(!inpt.is(':focus') && v == ''){
			_this.stop().animate({width:'0'},500,function(){
				_this.css('borderColor','transparent');
			});
		}
	});
	//hide
	$('.wqHeader-search').find('input').on('blur',function(){
		var _this = $(this);
		var v = $.trim(_this.val());
		var li = _this.parent();
		if(v != '')return;
		li.stop().animate({width:'0'},500,function(){
			li.css('borderColor','transparent');
			_this.val('');
		});
	});
	//search
	$('.wqHeader-search').find('span').on('click',function(){
		var _this = $(this);
		var v = $.trim(_this.siblings('input').val());
		if(v == '')return;
		var _httpProtocol = (("https:" == document.location.protocol) ? "https://" : "http://");
		url = _httpProtocol + www_base_url + "/globalsearch?keys=" + v;
		window.open(encodeURI(url));
	});
})();

/*header notice*/
(function(){
	if ($('#wq_notice').length) {
		setInterval(function() {
			var left = parseInt($('#notice').find('p').css('left'));
			left -= 1;
			if (left < -1200) {
				left = 1200;
			}
			$('#wq_notice').find('p').css('left', left);
		}, 100)
	}
})();

/* header info box position fix */
$('#allProTag').on('mouseover', 'li', function() {
	var _this = $(this);

	_this.find('.nma_info_box').css('top', -_this.position().top);
});

/*localjoin show kefu btn gif*/
if(location.href.indexOf('localjoin') > -1){
	$('.wq-kefu-gif').css('display','block');
}

/* go to top */
$(window).scroll(function() {
	if ($(this).scrollTop() > 500) {
		$('.wq_to_top').fadeIn(300);
	} else {
		$('.wq_to_top').fadeOut(300);
	}
});
$('#toTop').click(function() {
	$(window).scrollTop(0);
});

/* hai nan airline activity */
try {
	$('#haihang_active').activityDialog({
		width: 607,
		height: 700,
		title: '海航专享活动',
		content: '<p>即日起，我趣旅行网与海南航空达成合作。同期推出"我趣旅行  出行有里"海航专享活动，海航金鹏会员每在我趣消费，即可获得海航航空里程奖励。<p><br/><p><span>活动时间：</span>2014年8月1日——2016年7月31日</p><br/><p><span>基本流程：</span></p><p>海航用户注册为我趣旅行会员——进入我趣旅行官网预订产品——填写订单——填写海航金鹏会员姓名+卡号——完成预订——成功出行即可获得航空里程</p><br/><p><span>兑换规则：</span></p><p><span>【美国和加拿大-----消费送里程规则】</span><br>境外参团产品（1日/半日游）：每消费10元人民币等值外币累积5里程。 <br>境外参团产品（多日游）：每消费10元人民币等值外币累积10里程。<br>自助游/门票/购物产品：每消费10元人民币等值外币累积5里程。<br>签证产品：每消费10元人民币等值外币累积1.5里程。<br>酒店/租车/保险/电话卡产品：每消费10元人民币等值外币累积5里程。<br/><span>【澳洲和新西兰----消费送里程规则】</span><br/>境外参团产品：每消费10元人民币等值外币累积5里程。<br/>自助游/门票/购物产品：每消费10元人民币等值外币累积5里程。<br/>签证产品：每消费10元人民币等值外币累积1.5里程。<br/>酒店/租车/保险/电话卡产品：每消费10元人民币等值外币累积5里程。<br/><span>【欧洲-----消费送里程规则】</span><br/>境外参团产品：每消费10元人民币等值外币累积5里程。<br/>自助游/门票/购物产品：每消费10元人民币等值外币累积5里程。<br/>签证产品：每消费10元人民币等值外币累积1.5里程。<br/>酒店/租车/保险/电话卡产品：每消费10元人民币等值外币累积5里程。</p><br/><p><span>注意事项：</span></p><p>1.当消费金额不足10元，将按四舍五入计算。<br/>2.请填写正确的姓名和对应的金鹏会员卡号，以便统计奖励里程。<br/>3.此活动不与我趣旅行网其他优惠活动同时享用。</p>',
		cls: 'haihang_active'
	});
	$('.hh_name_input').wqPlaceHolder({
		fontSize: '13px',
		lineHeight: '18px',
		height: '18px',
		placeHolderColor: '#848484',
		top: 4,
		left: 5,
		inputTextColor: '#333',
		content: '请输入姓名',
		relParent: $('.hh_name_input_wrapper')
	});
	$('.hh_card_input').wqPlaceHolder({
		fontSize: '13px',
		lineHeight: '18px',
		height: '18px',
		placeHolderColor: '#848484',
		top: 4,
		left: 5,
		inputTextColor: '#333',
		content: '金鹏会员卡号',
		relParent: $('.hh_card_input_wrapper')
	});
	$('.hh_select').click(function(event) {
		var _this = $(this),
			target = event.target,
			type = _this.attr('type'),
			isCheck = _this.prop('checked'),
			radioSiblings = type == 'radio' ? $('input[name=' + _this.attr('name') + ']') : null;

		if (isCheck) {
			_this.parent().next().show();
		} else {
			_this.parent().next().hide();
		}

		if (radioSiblings) {
			radioSiblings.click(function(event) {
				if (event.target != target) {
					_this.parent().next().hide();
				}
			});
		}
	});
} catch (e) {}

/* user feedback */
$('#feedBack').click(function() {
	CloseCover();
	$("#feedbackContent").val("");
	$('#feedbackContact').val("");
	$("#feedbackContent").wqPlaceHolder({
		fontSize: '14px',
		top: 57,
		left: 28,
		content: '写下您的意见，这对我们很宝贵',
		relParent: $('#feedbackDiv')
	});
	$.ajax({
		url: window.location.protocol + "//" + w_base_url + "/feedback",
		type: 'GET',
		dataType: "text",
		success: function(data) {
			if (data != "") {
				$('#feedbackContact').val(data);
				$('#feedbackContact').hide();
			} else {
				$("#feedbackContact").wqPlaceHolder({
					fontSize: '14px',
					top: 266,
					left: 28,
					content: '留下您的手机号或e-mail',
					relParent: $('#feedbackDiv')
				});
			}
			$('#feedbackDiv').show();
			OpenCover();
		}
	});
});
$('#feedbackCancel').click(function() {
	$('#feedbackDiv').hide();
	CloseCover();
});
$('#feedbackSubmit').click(function() {
	var content = $("#feedbackContent").val(),
		contact = $("#feedbackContact").val();

	if (content == "") {
		$.AlertMsg({
			msg: "请输入内容",
			elem: $("#feedbackCancel"),
			position: "right",
			type: "error"
		});
		return;
	}
	if (/<script.*|.*<script.*/.test(content)) {
		$.AlertMsg({
			msg: "不法内容",
			elem: $("#feedbackCancel"),
			position: "right",
			type: "error"
		});
		return;
	}
	if (contact == "") {
		$.AlertMsg({
			msg: "请输入联系方式",
			elem: $("#feedbackCancel"),
			position: "right",
			type: "error"
		});
		return;
	}
	if (!(/^\w+([-.]\w+)*@\w+([-]\\w+)*\.(\w+([-]\w+)*\.)*[a-z]{2,3}$/.test(contact) || /^1[0-9]{10}$/.test(contact))) {
		$.AlertMsg({
			msg: "邮箱或手机格式不正确",
			elem: $("#feedbackCancel"),
			position: "right",
			type: "error"
		});
		return;
	}
	$.ajax({
		url: window.location.protocol + "//" + w_base_url + "/feedback/submit",
		method: 'POST',
		data: {
			content: content,
			contact: contact,
			sourceUrl: window.location.href
		},
		success: function(data) {
			var jsonData = $.parseJSON(data);
			if (jsonData.result == true) {
				$.AlertMsg({
					msg: jsonData.returnMessage,
					elem: $("#feedbackCancel"),
					position: "right",
					type: "suc",
					timeout: 2000
				});
				setTimeout(function() {
					$("#feedbackDiv").fadeOut(500, function() {
						CloseCover();
						$("#feedbackContent").val("");
						$('#feedbackContact').val("");
					});
				}, 2000);
			} else {
				$.AlertMsg({
					msg: jsonData.returnMessage,
					elem: $("#feedbackCancel"),
					position: "right",
					type: "error"
				});
			}

		},
		error: function(data) {
			var jsonData = $.parseJSON(data);
			$.AlertMsg({
				msg: jsonData.returnMessage,
				elem: $("#feedbackCancel"),
				position: "right",
				type: "error"
			});
		}
	});
});



/**
 * @usage: utility function
 **/
/* add product to cart */
function addProductToCartWithParams(isRedirect, params) {
	var url = _HTTP + w_base_url + "/cart/add";
	if (isRedirect) {
		url = _HTTP + w_base_url + "/cart/quickbook";
	}
	$.ajax({
		async: true,
		url: url,
		type: "POST",
		dataType: 'jsonp',
		jsonp: "callbackparam",
		data: params,
		success: function(data) {
			if (isRedirect) {
				if (!data.res.result) {
					if (data.res.returnMessage != "") {
						alert(data.res.returnMessage);
					} else {
						alert("预订失败");
					}
					return;
				}
				var payType = $("#jdStageValue").val();
				if(payType == 1){
					window.location.href = _HTTPS + w_base_url + "/" + continent + "/" + params.type + "/fill/" + data.quickBookID+"?payType="+payType;
				}else{
					window.location.href = _HTTPS + w_base_url + "/" + continent + "/" + params.type + "/fill/" + data.quickBookID;
				}
				return;
			}
		},
		error: function(a, b, c, d) {
			alert("网络异常，请稍后再试");
		}
	});
}

/* user feedback mask */
function OpenCover() {
	var winW = $(window).width(),
		winH = $(window).height();
	$("<div id='the_cover' class='cover' style='width:" + winW + "px;height:" + winH + "px;'></div>").appendTo("body");
}

function CloseCover() {
	$("#the_cover").remove();
}

//loading tips
function LoadingTips(opt) {
	if (typeof opt != "object") var opt = {};
	opt.images = opt.images || '//www.quimg.com/a4535/img/common/loading.gif';
	opt.tipsText = opt.tipsText || '正在读取价格信息，请稍后';
	opt.relay = opt.relay || document.body;
	opt.top = opt.top || 0;
	opt.left = opt.left || 0;
	opt.width = opt.width || 490;
	opt.height = opt.height || 130;
	var html = '<div class="loading_tips_sm"><img src="' + opt.images + '" alt=""><span>' + opt.tipsText + '</span></div>',
		jDom = $(html);
	jDom.css({
		position: 'absolute'
	});
	$(opt.relay).append(jDom);
	return {
		showLoading: function(settings) {
			if (typeof settings != 'object') settings = opt;
			jDom.css({
				height: settings.height,
				width: settings.width,
				left: settings.left,
				top: settings.top,
				display: 'block'
			});
		},
		hideLoading: function() {
			jDom.css({
				display: 'none'
			});
		}
	};
}

function HeadLogin() {
	window.location.href = _HTTPS + 'vip.woqu.com/login?s=' + window.location.href;
}

function HeadLogout() {
	window.location.href = _HTTPS + 'vip.woqu.com/logout?s=' + window.location.href;
}
/* 
 * 定制浮层
 */
if ((location.protocol == 'http:') && ($.cookie('utm_medium_last') == 'cpc' && ($.cookie('utm_source_last') == '360so' || $.cookie('utm_source_last') == 'baidupz' || $.cookie('utm_source_last') == 'google'))) {
	if($.cookie('customLayer')!=1){
		$('#customLayer').show();
	}
}
var travelCustom_name_flag = false,
		travelCustom_phone_flag = false;
$('#customLayer').find('input').blur(function() {
	var val = $(this).val();
	var vtype = $(this).attr('data-vtype') || $(this).siblings('.select_type').val();
	var resCode = $.wqRegExpTest(vtype,val);
	if(!resCode.code){
		$(this).next().text(resCode.msg).show();
		return;
	}
	if($(this).is('#customName'))travelCustom_name_flag = true;
	if($(this).is('#customMobile'))travelCustom_phone_flag = true;
}).focus(function(){
	$(this).next().hide();
});
$('#customSubmitBtn').on('click',function(){
	if(!travelCustom_name_flag || !travelCustom_phone_flag){
		return;
	}
	$(this).attr('disabled',true).css({
		backgroundColor:'#ccc',
		cursor:'wait'
	});
	
	var params = {
			name:$('#customName').val(),
			phone:$('#customMobile').val(),
			countryCode: parseInt($('#customLayer').find('.select_type').find('option:selected').text()),
			orderSource:'bottom_banner',
			utmSource:$.cookie('utm_source'),
			utmMedium:$.cookie('utm_medium'),
			utmTime:$.cookie('utm_time'),
			from:'bottom'
	}
	 $.ajax({
			async : false,
			url: "https://w.woqu.com/pack/createCustomOrder",
			type: "POST",
			data : params,
			dataType : 'jsonp',
			jsonp : "callbackparam",
			success:function(data){
				if(data.ret == 1){
					$('.info_fill').hide().siblings('.info_success').show();
				}else{
					if (data.errMsg != null) {
						alert(data.errMsg);
					} else {
						alert("定制单提交失败，请重新提交\n"+
								"或请致电客服热线：400-661-5757 ");
					}
				}
			},
			error:function(a,b,c,d){
				alert("定制单提交失败，请重新提交\n"+
				"或请致电客服热线：400-661-5757 ");
				console.log(a+b+c+d);
			},
			complete:function(){
				travelCustom_name_flag = false;
				travelCustom_phone_flag = false;
				$('#customSubmitBtn').removeAttr('disabled').css({
					backgroundColor:'#f08300',
					cursor:'pointer'
				})
			}
	 })
})
$('#customCloseBtn,.customInfoSuccessCloseBtn').on('click',function(){
	$('#customLayer').animate({bottom:'-254px'},500);
	$.cookie('customLayer',1,{path:'/',domain:'.woqu.com',expires:1});
	if (!!ga) {
		ga('send', 'event', 'check_huoke', 'click_close',  {'nonInteraction': 1});
	}
})

//
var continent = $('#globalContinent').val() || 'global';

/* live800 kefu */
try{
	// JavaScript Document	 //cookie util
	 if (typeof LIM == "undefined") window.LIM = {};
	 LIM.getCookie = function(name) {
	  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	  arr = document.cookie.match(reg);
	  var value = "";
	  if (arr) {
	      value = unescape(arr[2]);
	  } else {
	      value = null;
	  }
	  if (value != null) {
	      value = value.replace(/\"/g, "");
	  }
	  return value;
		};
		LIM.setCookie = function(name, value, exp) {
		    var Days = 30;
		    var s = this.getHostAndPath();
		    try {
		        document.cookie = name + "=" + value + ";";
		    } catch (e) {
		        throw "storing document cookie has error!";
		    }
		};
		(function(){//保存访客来源必须添加到所有页面中
		   var docref = document.referrer || "";
		   if(docref && docref.toLowerCase().indexOf(location.hostname) == -1 ){//非本站才算入来源
		     LIM.setCookie("refferChat",docref);
		   }
		}());
	
	function openChat(chaturl,kuan,gao){
		var url=chaturl;
			url+="&enterurl="+encodeURIComponent(document.URL||window.location);
			url+="&pagetitle="+encodeURIComponent(document.title||window.location);
			url+="&timestamp="+new Date().getTime();
			url+="&pagereferrer="+(LIM.getCookie("refferChat")||"");
		window.open(url,"800chatbox","toolbar=0,scrollbars=0,location=0,menubar=0,resizable=1,width="+kuan+",height="+gao+"");
		if(document.getElementById("InviteWindow"))//打开对话后，隐藏邀请窗口
				document.getElementById("InviteWindow").style.display="none";
    }
	
	var live800_groups = [{configID:"125432",skillID:"6774"}, //境外参团组
	                     {configID:"125433",skillID:"6775"}, //自助游套餐
	                     {configID:"125434",skillID:"6800"}  //前端组
	                     ]; 
	
	var live_group = live800_groups[2]; //前端组
	var locationHref = window.location.href;
	if (locationHref.indexOf('/localjoin') != -1 || locationHref.indexOf('/cyclic') != -1){
		live_group = live800_groups[0]; //境外参团组
	}else if(locationHref.indexOf('/pack') != -1 || locationHref.indexOf('/car') != -1 || locationHref.indexOf('/insurance') != -1
			|| locationHref.indexOf('/wifi') != -1 || locationHref.indexOf('/sim') != -1 || locationHref.indexOf('/car') != -1
			|| locationHref.indexOf('/mustactive') != -1 || locationHref.indexOf('/traffic') != -1 || locationHref.indexOf('/ticket') != -1
			|| locationHref.indexOf('/pass') != -1 || locationHref.indexOf('/jrpass') != -1 || locationHref.indexOf('/theme')
	        || locationHref.indexOf('/album')!= -1 ){
		live_group = live800_groups[1]; //自助游套餐
	}	
	else{
		live_group = live800_groups[2];//前端组
	}
	
	var ssl = location.protocol == "http:"?"":"&ss=1";
//	var live800Script = '<div style="display:none;"><a href="http://www.live800.com">live800Link.webchat</a></div>'
//		+'<script type="text/javascript" src="'+location.protocol+'//v2.live800.com/live800/chatClient/floatButton.js?jid=6166624721&companyID=556242&configID='+configID+'&codeType=custom'+ssl+'"></script>'
//		+'<div style="display:none;"><a href="http://en.live800.com">live chat</a></div>';
//	  console.log(live800Script);
	//document.write(live800Script);
	//改变客服组
	 var live800_href="http://v2.live800.com/live800/chatClient/chatbox.jsp?companyID=556242&jid=6166624721&configID="+live_group.configID+"&skillId="+live_group.skillID;
	 $("#onlineKefu").on('click',function(){
	     openChat(live800_href,900,600);	
	 });
	//添加live800的监控代码
	 if(location.protocol == "http:"){
	    var live800monitor = '<script type="text/javascript" src="'+location.protocol+'//v2.live800.com/live800/chatClient/monitor.js?jid=6166624721&companyID=556242&configID=125278&codeType=custom'+ssl+'"></script>';
	    //去除不需咨询页面URL
	    var _removeUrl = ['http://www.woqu.com/','http://woqu.com/'];
	    var _href = location.href;
	    var _noNeed = false;
	    for(var i=0;i<_removeUrl.length;i++){
	    	if(_href == _removeUrl[i]){
	    		_noNeed = true;
	    		break;
	    	}
	    }
	    if(!_noNeed)document.write(live800monitor);
	 }
		
}catch(e){
}
