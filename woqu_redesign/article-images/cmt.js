$(function($, win, doc) {
	var $CMT = detail = {
		config: {
			curPageNo:1,
			totalPage:0,
			type:"",
			businessID:"",
			init:false
		},
		init:function(){
			 $CMT.config.type = $("#type").val();
			 $CMT.config.businessID = $("#businessID").val();
			 $("#cmt-wrapper").find("[name='cmt-prev']").click(function(){
				 var pn = $CMT.config.curPageNo-1;
				 if(pn > $CMT.config.totalPage || pn <= 0){
					return;
				 }
				 $CMT.load(pn);
			 });
			 $("#cmt-wrapper").find("[name='cmt-next']").click(function(){
				 var pn = $CMT.config.curPageNo+1;
				 if(pn > $CMT.config.totalPage || pn <= 0){
					return;
				 }
				 $CMT.load(pn);
			 });
			 $CMT.config.init = true;
		},
		load:function(pn,fn) {
			if(!$CMT.config.init) $CMT.init();
			
			var cmt_wrap = $("#cmt-wrapper"), 
				cmt_num = cmt_wrap.find("span[name='cmt-num']"),
				cmt_list = cmt_wrap.find("ul[name='cmt-list']"),
				cmt_prev = cmt_wrap.find("a[name='cmt-prev']"),
				cmt_next = cmt_wrap.find("a[name='cmt-next']"),
				cur_page = cmt_wrap.find("span[name='cur-page']"),
				total_page = cmt_wrap.find("span[name='total-page']"),
				avg_star_img = cmt_wrap.find("[name='avg-star-img']"),
				avg_star = cmt_wrap.find("[name='avg-star']");
			
			$.ajax({
				url:"http://www.woqu.com/cmt-list/cmt-"+$CMT.config.type+"/"+$CMT.config.businessID+"/"+pn,
				dataType:"json",
				success:function(prs){
					if(prs.rs==1){
						$CMT.config.curPageNo = pn;
						cmt_list.html("");
						$CMT.config.totalPage = prs.totalPage;
						/*if(!prs.hasPrev) cmt_prev.hide();
						else cmt_prev.show();
						if(!prs.hasNext) cmt_next.hide();
						else cmt_next.show();*/
						cmt_num.html(prs.total);
						if(avg_star.html()=="") {
							avg_star.html(prs.code+"分");
							avg_star_img.addClass("evluation_star"+prs.code);
							
							if(fn != null) {
								fn.call(this,prs.code,prs.total);
							}
						}
						
						total_page.html(prs.totalPage);
						cur_page.html(prs.pageNo);
						if(prs.totalPage==0) {
							cur_page.html("0");
							return;
						}
						if(prs.list==null||prs.list.length==0) return;
						for(var i=0;i<prs.list.length;i++){
							var cmt = prs.list[i];
							var _html = '<li class="wq_clearfix">'
											+'<div class="member_info">'
												+'<i class="member_avatar"></i>'
												+'<p class="font_size14 font_color_white">'+cmt.userName+'</p>'
											+'</div>'
											+'<div class="member_evaluation bg_color_white wq_clearfix">'
												+'<p class="evaluation_text font_size14 font_color_black">'+cmt.content+'</p>'
												+'<div class="evaluation_right">'
													+'<p class="font_size13 font_color_orange">满意度</p>'
													+'<em class="evluation_star evluation_star'+cmt.score+'" title="'+cmt.score+'分"></em>'
													+'<p class="font_size13 font_color_gray">'+cmt.appraisalTime.substring(0,10)+'</p>'
												+'</div>'
											+'</div>'
										+'</li>';
							$(_html).appendTo(cmt_list);
						}
					}else{
						var error_tips_html = '<li name="error_tips" class="wq_clearfix">'
													+'<p class="evaluation_text font_size14 font_color_black">评论加载失败，请稍后刷新重试!</p>'
											+'</li>';
						cmt_list.append(error_tips_html);
					}
				}
			});
		}
	};
	window.$CMT = $CMT;
}(jQuery, window, document));