$(function($, window, document, undefined) {
	var $QA = detail = {
		config: {
			curPageNo: 1,
			totalPage: 0,
			type: "",
			businessID: "",
			init: false
		},
		init: function() {
			$QA.config.type = $("#type").val();
			$QA.config.businessID = $("#businessID").val();
			$("#qa-wrapper").find("[name='qa-prev']").click(function() {
				var pn = $QA.config.curPageNo - 1;
				if (pn > $QA.config.totalPage || pn <= 0) {
					return;
				}
				$QA.load(pn);
			});
			$("#qa-wrapper").find("[name='qa-next']").click(function() {
				var pn = $QA.config.curPageNo + 1;
				if (pn > $QA.config.totalPage || pn <= 0) {
					return;
				}
				$QA.load(pn);
			});

			var qa_dialog = $("#questionDialogWrapper");
			qa_dialog.find("[name='submit-qa']").unbind("click").bind("click", function() {
				$QA.sbmt();
			});
			qa_dialog.find("[name='close-qa']").click(function() {
				qa_dialog.hide();
			});
			$QA.config.init = true;
		},
		load: function(pn) {
			if (!$QA.config.init) $QA.init();

			var qa_wrap = $("#qa-wrapper"),
				qa_num = qa_wrap.find("span[name='qa-num']"),
				qa_list = qa_wrap.find("ul[name='qa-list']"),
				qa_prev = qa_wrap.find("a[name='qa-prev']"),
				qa_next = qa_wrap.find("a[name='qa-next']"),
				cur_page = qa_wrap.find("span[name='cur-page']"),
				total_page = qa_wrap.find("span[name='total-page']");

			$.ajax({
				url: "http://www.woqu.com/qa-list/qa-" + $QA.config.type + "/" + $QA.config.businessID + "/" + pn,
				dataType: "json",
				success: function(prs) {
					$QA.config.curPageNo = pn;
					qa_list.html("");
					if (prs.rs == 1) {
						$QA.config.totalPage = prs.totalPage;
						qa_num.html(prs.total);
						//游记临时改为问题咨询
						$("#qaCount").html(prs.total);

						total_page.html(prs.totalPage);
						cur_page.html(prs.pageNo);
						if (prs.totalPage == 0) {
							cur_page.html("0");
							return;
						}
						if (prs.list == null || prs.list.length == 0) return;
						for (var i = 0; i < prs.list.length; i++) {
							var qa = prs.list[i];
							var _html = '<li><p class="question_text font_size14 font_color_orange"><i></i>' + qa.comment + '<span class="font_color_gray">（' + qa.creator + '&nbsp;' + qa.createTime + '）</span></p>';
							if (qa.reply) {
								_html += '<p class="answer_text font_size14 font_color_black"><i></i>客服回答：' + qa.reply + '</p>';
							}
							_html += "</li>";
							$(_html).appendTo(qa_list);
						}
					} else {
						alert("加载咨询失败");
					}
				}
			});
		},
		sbmt: function() {
			var qa_dialog = $("#questionDialog"),
				qa_contact = qa_dialog.find("input[name='contact']"),
				qa_alert = qa_dialog.find("span[name='alert']"),
				sbmt = qa_dialog.find("[name='submit-qa']"),
				sbmting = qa_dialog.find("[name='sbmting-qa']");
			var _q = qa_dialog.find("textarea[name='question']").val(),
				_c = qa_contact.val(),
				_n = qa_contact.attr("data-n");
			if (!_q || $.trim(_q).length < 1) {
				qa_alert.hide().html("请输入咨询内容").show(100);
				return;
			}
			if (_n != "1") {
				var reg = {
					email: /^\w+([-.]\w+)*@\w+([-]\\w+)*\.(\w+([-]\w+)*\.)*[a-z]{2,3}$/,
					mobileCN: /^1[0-9]{10}$/,
					mobileUSA: /^[0-9]{10}$/
				};
				var _c = $.trim(_c);
				if (_c == "" || (!reg.email.test(_c) && !reg.mobileCN.test(_c) && !reg.mobileUSA.test(_c))) {
					qa_alert.hide().html("请输入正确的联系方式").show(100);
					return;
				}
			}
			qa_alert.hide();
			$.ajax({
				url: "http://www.woqu.com/qa-submit/qa-" + $QA.config.type + "/" + $QA.config.businessID,
				data: {
					question: _q,
					contact: _c,
					productTitle: $("#productTitle").val(),
					productImg: $("#mainImage").val()
				},
				dataType: "json",
				beforeSend: function() {
					sbmt.hide();
					sbmting.show();
				},
				success: function(prs) {
					if (prs.rs == 1) {
						qa_alert.hide().html("提交成功！").show(100);
						qa_dialog.find("textarea[name='question']").val("");
						setTimeout(function() {
							$("#questionDialogWrapper").hide().find("span[name='alert']").hide();
						}, 2000);
					} else {
						qa_alert.hide().html(prs.msg).show(100);
					}
				},
				error: function() {
					qa_alert.hide().html("提交失败！").show(100);
				},
				complete: function() {
					sbmt.show();
					sbmting.hide();
				}
			});
		}
	};
	window.$QA = $QA;
}(jQuery, window, document));