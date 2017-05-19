$(function(){
	var productBusinessId = $('#businessID').val();
	
	getUgcData();
	getNote(productBusinessId,1);
	getComment(productBusinessId,1);
	
	$('#favourLink').on('click',function(){
		if(!$('#favourDiv').hasClass("on")){//增加想去
			addFavour(productBusinessId);
		}
	});
	
	$('#collectLink').on('click',function(){
		if(simpleCheckIfLogin()){
			if($('#collectDiv').hasClass("on")){//取消收藏
				cancelCollect(productBusinessId);
			}else{//增加收藏
				addCollect(productBusinessId);
			}
		}else{
			alert('亲爱的顾客请先登陆');
		}
	});
	
	//评论翻页
	$(document).on('click','#cmt-prev-id',function(){
		var pageNum = Number($('#cmt-cur-page').text());
		if(pageNum-1>0){
			getComment(productBusinessId,pageNum-1);
		}
	});
	$(document).on('click','#cmt-next-id',function(){
		var pageNum = Number($('#cmt-cur-page').text());
		if(pageNum+1<=Number($('#cmt-total-page').text())){
			getComment(productBusinessId,pageNum+1);
		}
	});
	
	//游记翻页
	$(document).on('click','#note-prev',function(){
		var pageNum = Number($('#note-cur-page').text());
		if(pageNum-1>0){
			getNote(productBusinessId,pageNum-1);
		}
	});
	$(document).on('click','#note-next',function(){
		var pageNum = Number($('#note-cur-page').text());
		if(pageNum+1<=Number($('#note-total-page').text())){
			getNote(productBusinessId,pageNum+1);
		}
	});
	
	function getUgcData() {
		var url = _HTTP + w_base_url +"/ugc/proDetailUgcData";
		$.ajax({
			url: url,
			data:'businessId='+productBusinessId,
			type: "POST",
			dataType : 'jsonp',
			jsonp : "callbackparam",
			success: function(data) {
				$("#favourCount").html(data.favourCount);
				$("#shareCount").html(data.shareCount);
				$("#collectCount").html(data.collectCount);
				$("#commentCount").html(data.commentCount);
				$("#noteCount").html(data.noteCount);
				var scoreString = data.commentScore.toString();  
	            if (!isNaN(data.commentScore)) {  
		            var rs = scoreString.indexOf('.'); 
		            if (rs < 0) {  
		                rs = scoreString.length;  
		                scoreString += '.0';  
		            }  
	            }
				if(data.commentCount == 0){
					$("#commentScore").parent().hide();
					$("#commentCount").parent().hide();
					$('.comment_list').html('快来点评领取优惠券吧')
				}else{
					$('.top_bar_wrapper').find("a").each(function(){
						if($(this).html() == "用户点评") {
							$(this).html("用户点评(" + data.commentCount + ")")
						}
					})
				}
				$("#commentScore").html(scoreString);
				if(data.collected==true){
					$('#collectDiv').addClass("on");
					$('#collectLink').text("已收藏");
				};
				if(data.shared==true){
					$('#shareDiv').addClass("on");
				};
//				addFavourWhenOpen(productBusinessId); modify by an.yin 2015.5.21
			},
			error: function(a, b, c, d) {
//				alert("网络异常，请稍后再试");
			}
		});
	}
	
	function getComment(businessId,pageNum) {
		var url = _HTTP + www_base_url +"/detailPage/commentList";
		$.ajax({
			url: "/detailPage/commentList",
			data:'businessId='+businessId+'&currentPage='+pageNum,
			type: "POST",
			success: function(data) {
				$("#cmt-wrapper").html(data);

			},
			error: function(a, b, c, d) {
//				alert("网络异常，请稍后再试");
			}
		});
	}
	
	function getNote(businessId,pageNum) {
		var url = _HTTP + www_base_url +"/detailPage/travelNoteList";
		$.ajax({
			url: "/detailPage/travelNoteList",
			data:'businessId='+businessId+'&currentPage='+pageNum,
			type: "POST",
			success: function(data) {
				$("#detailNoteList").html(data);
			},
			error: function(a, b, c, d) {
//				alert("网络异常，请稍后再试");
			}
		});
	}
	
	function addFavourWhenOpen(businessId) { //打开页面便增加一次想去数目
		var url = "http://" + w_base_url +"/favour/add";
		$.ajax({
			url: url,
			data:'businessId='+productBusinessId,
			type: "POST",
			dataType : 'jsonp',
			jsonp : "callbackparam",
			success: function(data) {
				if(data.resultStatus){
					$("#favourCount").html(data.num);
				}
			}
		});
	}
	
	function addFavour(businessId) {
		var url = "http://" + w_base_url +"/favour/add";
		$.ajax({
			url: url,
			data:'businessId='+productBusinessId,
			type: "POST",
			dataType : 'jsonp',
			jsonp : "callbackparam",
			success: function(data) {
				if(data.resultStatus){
					$("#favourCount").html(data.num);
					$('#favourDiv').addClass("on");
					$('#favourTips').show();
				}
				setTimeout(function() {
					$('#favourTips').hide();
				}, 1000);
			},
			error: function(a, b, c, d) {
//				alert("网络异常，请稍后再试");
			}
		});
	}
	
	function addShare(businessId) {
		var url = "http://" + w_base_url +"/share/add";
		$.ajax({
			url: url,
			data:'businessId='+businessId,
			type: "POST",
			dataType : 'jsonp',
			jsonp : "callbackparam",
			success: function(data) {
				if(data.resultStatus){
					$("#shareCount").html(data.num);
				}
			},
			error: function(a, b, c, d) {
//				alert("网络异常，请稍后再试");
			}
		});
	}
	//增加收藏
	function addCollect(businessId) {
		var url = "http://" + w_base_url +"/collect/add";
		$.ajax({
			url: url,
			data:{
				businessId : businessId
			},
			type: "POST",
			dataType : 'jsonp',
			jsonp : "callbackparam",
			success: function(data) {
				if(data.resultStatus){
					$("#collectCount").html(data.num);
					$('#collectDiv').addClass("on");
					$('#collectLink').text("已收藏");
				}
			},
			error: function(a, b, c, d) {
//				alert("网络异常，请稍后再试");
			}
		});
	}
	//删除收藏
	function cancelCollect(businessId) {
		var url = "http://" + w_base_url +"/collect/cancel";
		$.ajax({
			url: url,
			data:{
				businessId : businessId
			},
			type: "POST",
			dataType : 'jsonp',
			jsonp : "callbackparam",
			success: function(data) {
				if(data.resultStatus){
					$("#collectCount").html(data.num);
					$('#collectDiv').removeClass("on");
					$('#collectLink').text("收藏");
				}
			},
			error: function(a, b, c, d) {
//				alert("网络异常，请稍后再试");
			}
		});
	}
	//判断是否登陆
	function simpleCheckIfLogin (){
		if($.cookie == null){
			return false;
		}
		if($.cookie('tk') != null && $.cookie('tk') != ''){
			return true;
		}else{
			return false;
		}
	}

	$('#sinaShare').click(function(){
		if(simpleCheckIfLogin()){
			sinaShare();
			addShare(productBusinessId);
		}else{
			alert('亲爱的顾客请先登陆');
		}
	});
	$('#qqShare').click(function(){
		if(simpleCheckIfLogin()){
			qqshare();
			addShare(productBusinessId);
		}else{
			alert('亲爱的顾客请先登陆');
		}
	});
	$('#qzoneShare').click(function(){
		if(simpleCheckIfLogin()){
			qzoneShare();
			addShare(productBusinessId);
		}else{
			alert('亲爱的顾客请先登陆');
		}
	});
	$('#wechatShare').click(function(){});
	function getTitleAndPrice(){
		var productTitle = $('#productTitle').val();
		var price='';
		if($('#unit-price').length>0){
			price = $('#unit-price').text();
		}else
			if($('#carPrice').length>0){
				price = $('#currencySign').val()+$('#unit-price').text();
			}else
				if(null!=$('#start-price').length>0){
					price = $('#currencySign').val()+$('#start-price').text();
				}else{
					price = $('#currencySign').val()+$('#startPrice').text();
				}
		return productTitle+" "+price+"，";
	}
	//微博分享接口
	function sinaShare(){
		var shareContent = getTitleAndPrice()+'我刚刚在我趣旅行网发现了超好玩的出境游，你也去看看吧~@我趣旅行网';
		//d指的是window
		(function(s,d,e){
			var f='http://v.t.sina.com.cn/share/share.php?',
			u=d.location.href,
			shareUrl=$('#thumbnail').find('img').attr('src'),
//			shareUrl=$('#thumbnail').find('img').attr('src'),
			p=['url=',e(u),
			   '&title=',shareContent,
			   '&appkey=2924220432',
			   '&pic=',e(shareUrl)
			   ].join('');
			function a(){
				if(!window.open([f,p].join(''),'mb',['toolbar=0,status=0,resizable=1,width=620,height=450,left=',(s.width-620)/2,',top=',(s.height-450)/2].join('')))
					u.href=[f,p].join('');
				};
				if(/Firefox/.test(navigator.userAgent)){
					setTimeout(a,0)
				}else{
					a()
				}})(screen,document,encodeURIComponent);
	}
	function qzoneShare(){
		var shareContent = getTitleAndPrice()+'我刚刚在我趣旅行网发现了超好玩的出境游，你也去看看吧~@我趣旅行网';
		var p = {
			url:location.href,
			showcount:'1',/*是否显示分享总数,显示：'1'，不显示：'0' */
			desc:'',/*默认分享理由(可选)*/
			summary:'',/*分享摘要(可选)*/
			title:'',/*分享标题(可选)*/
			site:'',/*分享来源 如：腾讯网(可选)*/
			pics:'', /*分享图片的路径(可选)*/
			style:'203',
			width:98,
			height:22
		};
		var s = [];
		for(var i in p){
			s.push(i + '=' + encodeURIComponent(p[i]||''));
		}
		window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+encodeURIComponent(document.location.href)+"&desc="+shareContent,"","height=518,width=766,top=100,left="+((window.screen.width)*0.35)+",toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
//		window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+encodeURIComponent(document.location.href));
//		document.write(['<a version="1.0" class="qzOpenerDiv" href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?',s.join('&'),'" target="_blank">分享</a>'].join(''));
	}
	function qqshare(){
		var shareContent = getTitleAndPrice()+'我刚刚在我趣旅行网发现了超好玩的出境游，你也去看看吧~@我趣旅行网';
		var p = {
			url:location.href, /*获取URL，可加上来自分享到QQ标识，方便统计*/
			desc:'', /*分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）*/
			title:'', /*分享标题(可选)*/
			summary:'', /*分享摘要(可选)*/
			pics:'', /*分享图片(可选)*/
			flash: '', /*视频地址(可选)*/
			site:'', /*分享来源(可选) 如：QQ分享*/
			style:'201',
			width:32,
			height:32
		};
		var s = [];
		for(var i in p){
			s.push(i + '=' + encodeURIComponent(p[i]||''));
		}
		window.open('http://connect.qq.com/widget/shareqq/index.html?url='+encodeURIComponent(document.location.href)+"&desc="+shareContent,"","height=650,width=766,top=100,left="+((window.screen.width)*0.35)+",toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
//		window.open('http://connect.qq.com/widget/shareqq/index.html?url='+encodeURIComponent(document.location.href));
//		document.write(['<a class="qcShareQQDiv" href="http://connect.qq.com/widget/shareqq/index.html?',s.join('&'),'" target="_blank">分享到QQ</a>'].join(''));
	}
});
