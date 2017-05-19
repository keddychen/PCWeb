$(function($, window, document, undefined) {
	var $D = detail = {
		config: {
			businessID: "",
			curMonth: "",
			startPrice: 0,
			personRuleMap: {}, //key=pkgId,value=rule5
			personInfoMap: {}, //key=bandId,value=person no
			personNO: {},
			usd2cny: 0, //the rate from usd to cny
			totalPrice: 0,
			favourablePrice: 0, //优惠价格
			currency: "", //货币类型
			currencySign: "" //货币符号
		},
		priceTemplete: {
			noFavourableTable: '<td align="right">\
			                      <p class="font_color_black font_size13 td_label">总价：</p>\
							    </td>\
		        				<td colspan="2">\
		        				   <p class="total_price_usd font_size14 font_color_orange" id="total-price">-</p>\
		        				</td>',
			favourableTable: '<td colspan="3" style="padding-top: 15px;">\
		        				<table class="font_size14 font_color_gray">\
		        					<col width="75px"></col>\
		        					<col width="35px"></col>\
		        					<col width="50px"></col>\
		        					<col width="35px"></col>\
		        					<col width="140px"></col>\
		        					<tr>\
		        						<td align="center">原价</td>\
		        						<td></td>\
		        						<td align="center">优惠</td>\
		        						<td></td>\
		        						<td align="center" class="font_color_black">应付</td>\
		        					</tr>\
									<tr class="font_size14">\
										<td align="center" id="total-price">$2830</td>\
										<td align="center">-</td>\
										<td align="center" id="favourable-price">$300</td>\
										<td align="center">=</td>\
										<td align="center">\
										<p class="font_size14 font_color_orange" id="last-price">$2800</p>\
										</td>\
									</tr>\
									</table>\
								</td>'
		},

		func: {
			init: function() {
				//初始化产品介绍图片样式
				$('.need_img_wrapper').find('img').each(function(){
					$(this).addClass('detail_info_map detail_product_overview_wrapper');
				});
				//防止用户错误购买——过渡方案
				$('#book-btn').click(function() {
					if($('#package').children('option:selected').data('desc') == 'defaultOption' || $('#package').children('option:selected').data('desc') == undefined){
						$('#date-pkg-wrap').addClass('error_hint');
						$('.error_text').show();
					} else {
						$D.func.addToCart(true);
					}
				});

				//初始化businessID
				$D.config.businessID = $("#businessID").val();
				$D.config.startPrice = parseFloat($("#startPrice").val() || "0");
				$D.config.usd2cny = parseFloat($("#usd2cny").val() || "0");

				//load hotel
				$.ajax({
					url: "http://www.woqu.com/mustactive/mustactive-hotelList-" + $D.config.businessID,
					type: 'POST',
					success: function(data) {
						var hotels = "";
						var jsondata = data;
						if (null != jsondata && jsondata.length != 0) {
							hotels += "<div id='hotelInputWrap' style='position: relative;'><input class='wq_viator_hotel_input' type='text' onkeyup='$D.func.searchHotel(this);'></div>";
							hotels += "<ul class='wq_viator_hotel_list' name='hotelList'>";
							for (var i = 0; i < jsondata.length; i++) {
								hotels += "<li class='wq_hotel_li'><p>" + jsondata[i].name + "&nbsp;" + jsondata[i].phone + "</p>";
								hotels += "<p>" + jsondata[i].address + "</p>";
								hotels += "<div class='wq_hotel_divide'></div></li>";
							}
							hotels += "</ul><br/><br/>以上列表仅供参考。如果您入住的酒店不在列表内，请直接联系我们的客服人员，我们将尽快为您查询。";
						} else {
							hotels += "此城市/地区大部分酒店皆可提供接送服务。请直接联系我们的客服人员，我们将尽快为您查询。"
						}
						$('#showHotel').append(hotels);
						$('.wq_viator_hotel_input').wqPlaceHolder({
							fontSize: '14px',
							lineHeight: '14px',
							height: '14px',
							placeHolderColor: '#607575',
							inputTextColor: '#607575',
							top: 5,
							content: '输入您入住酒店的英文名称查询',
							relParent: $('#hotelInputWrap')
						});
					}
				});

				//优惠券
				$("[coupon-name]").each(function(index, elem) {
					$(elem).hover(function() {
						Layer.hoverTips.create(this, true, $(this).attr("coupon-name"), $(this).attr("coupon-desc"), 300)
					}, function() {
						Layer.hoverTips.hide();
					});
				});

				if ($("#productState").val() == "ON_SALE") {
					//绑定travelDate点击
					$("#travel-date").click(function(event) {
						var left = $(this).offset().left,
							top = $(this).offset().top;
						$("#price-calendar").css({
							left: left - 238,
							top: top + 29
						}).toggle();
						if (event.cancelbubble) event.cancelbubble = true;
						else event.stopPropagation();
					});
					//初始化价格日历
					$D.func.loadCalendar("0000-00", true);
					$(document).click(function(event) {
						$("#price-calendar").hide();
					});
					$("#price-calendar").click(function(event) {
						if (event.cancelbubble) event.cancelbubble = true;
						else event.stopPropagation();
					});
					//绑定日历前后月
					$("#price-calendar").find("[name='prev-month']").click(function() {
						if (!$D.config.curMonth) return;
						var prev_month = $D.func.addMonthStr($D.config.curMonth, -1);
						$D.func.loadCalendar(prev_month, false);
					});
					//绑定日历前后月
					$("#price-calendar").find("[name='next-month']").click(function() {
						if (!$D.config.curMonth) return;
						var next_month = $D.func.addMonthStr($D.config.curMonth, 1);
						$D.func.loadCalendar(next_month, false);
					});
					//绑定日期点击事件
					$("#price-calendar").find("[name='date-list']").on("click", "li[data-d]", function() {
							var date_str = $(this).attr("data-d");
							$(this).siblings().removeClass("on");
							$(this).addClass("on");
							$("#travel-date").val(date_str);
							$("#price-calendar").hide();
							$D.func.loadPackageByDate(date_str);
						})
						//绑定人数变化事件
					$("#person-list").on("change", "select", function() {
						var personNum = 0;
						$("#person-list").find("[name='person-select']").each(function(index, elem) {
							personNum += parseInt($(elem).val() || "0");
						});
						var pos_elem = $("#person-list").find("tr[name='price-tr']"),
							_left = pos_elem.offset().left,
							_top = pos_elem.offset().top;
						if (personNum <= 0) {
							$.wqDetailTip({
								content: "亲，请您选择至少1位预订人数。",
								left: _left,
								top: _top
							});
						} else if (personNum > 9) {
							$.wqDetailTip({
								content: "亲，您的预订人数超过9人，请重新选择。",
								left: _left,
								top: _top
							});
							$(this).get(0).selectedIndex = 0;
						}
						// 人数变化的时候 更新选择人数 重画选择框
						var selects = $("#person-list").find("select");
						selects.each(function() {
							var selected = $(this).find("option:selected");
							var bid = $(this).attr("data-id");
							var _num = parseInt(selected.val() || "0");
							$D.config.personInfoMap[bid] = _num;
						});
						var matrixs = $D.config.personRuleMap[$("#package").val()];
						var rules, ruleNO = 0;
						for (var ele in matrixs) {
							for (var i = 0; i < matrixs[ele].rules.length; i++) {
								var person = matrixs[ele].rules[i];
								var bid = person.id,
									min = person.min,
									max = person.max;
								var num = $D.config.personInfoMap[bid];
								if (num > max || num < min) break;
								if (i == matrixs[ele].rules.length - 1) rules = matrixs[ele].rules;
							}
							if (rules != null && rules.length > ruleNO) {
								ruleNO = rules.length;
								$D.func.resetPersonSelect($D.config.personNO[$("#package").val()], rules);
							}
						}
						// 人数选择无法匹配到 则以成人数选择重画
						if (rules == null) {
							ruleNO = 0;
							for (var ele in matrixs) {
								var rules = matrixs[ele].rules;
								for (var i = 0; i < rules.length; i++) {
									var person = rules[i];
									var bid = person.id,
										min = person.min,
										max = person.max;
									var num = $D.config.personInfoMap[bid];
									if (num <= max && num >= min) {
										if (rules.length > ruleNO) {
											ruleNO = rules.length;
											$D.func.resetPersonSelect($D.config.personNO[$("#package").val()], rules);
											break;
										}
									} else {
										break;
									}
								}
							}
						}

						//如套餐没有选择则不算价
						if($('#package').children('option:selected').data('desc') != 'defaultOption' && $('#package').children('option:selected').data('desc') != undefined){
							$D.func.calculatePrice("person num changed", false);
						}
						
					});
				}

				//hover tips
				$('.wq_price_tips').hover(function() {
					Layer.hoverTips.create(this, true, '起价说明', '此起价为根据基础套餐里的推荐出行人数核算而来。产品价格会根据您所选的出行日期、出行人数以及所选择的套餐类型的不同而有所变动。', 250)
				}, function() {
					Layer.hoverTips.hide();
				});

				$('.sec_confirm').hover(function() {
					Layer.hoverTips.create(this, true, '二次确认说明', '由于部分产品的特殊性（当季热销、每日限量、隔日出行等），在您下单后，我趣客服将尽快为您确认订单，或在出发前致电确认您的行程信息，以便为您预约行程，请务必保持电话畅通。', 250)
				}, function() {
					Layer.hoverTips.hide();
				});

				$('.date_exp').hover(function() {
					Layer.hoverTips.create(this, true, '日期说明', '此团出发日期为<span style="color:#06a6a6">'+$('#cityName').val()+'</span>当地的时间', 250)
				}, function() {
					Layer.hoverTips.hide();
				});

				//初始化咨询
				$QA.load(1);
				//初始化评论
				$CMT.load(1);

				//优惠信息tips
				if ($("#benifit-content").val()) {
					$('#benifit-info').hover(function() {
						Layer.hoverTips.create(this, false, '', $("#benifit-content").val(), 300)
					}, function() {
						Layer.hoverTips.hide();
					});
				}

				//top tag fix
				$('.wq_scroll_nav_top').wqScrollSpy({
					wq_scroll_nav: 'wq_scroll_nav_top',
					wq_scroll_navbar: 'wq_scroll_navbar_top',
					wq_scroll_part: 'wq_scroll_part_top',
					ActiveControlClass: 'active_tag',
					beforeScrollArea: function() {
						$('.wq_scroll_nav_top').css({
							'position': 'relative',
							'width': '998px',
							'z-index': '1'
						});
					},
					scrollToArea: function() {
						$('.wq_scroll_nav_top').css({
							'position': 'fixed',
							'z-index': 1001,
							'top': 0
						});
					}
				});

				$('#product-tab').on('click', 'a', function() {
					var _this = $(this),
						id = _this.attr('data-href'),
						targetSection = $(id),
						topHeight;

					if (id == '#product-brief') {
						topHeight = targetSection.offset().top - 80;
					} else if (id == '#product-need-know') {
						topHeight = targetSection.offset().top - 60;
					} else {
						topHeight = targetSection.offset().top;
					}

					$('html, body').animate({
						scrollTop: topHeight
					}, 500);
				});

				//poi text cut
				this.poiTextCut();

				//check natural image
				$('.detail_product_overview_wrapper').on('click', 'img', function() {
					var _this = $(this),
						domEle = _this[0],
						src = domEle.src,
						naturalImgEle = $('#naturalImg'),
						iWidth,
						iHeight;

					if (domEle.naturalWidth) {
						iWidth = domEle.naturalWidth;
						iHeight = domEle.naturalHeight;
					} else {
						var tmp = new Image();
						image.src = src;
						image.onload = function() {
							iWidth = image.width;
							iHeight = image.height;
						}
					}

					if (iWidth >= 1100) {
						iHeight = 1100 / iWidth * iHeight;
						iWidth = 1100;
					}

					if (naturalImgEle.length) {
						naturalImgEle.find('img')
						.attr('src', src)
						.attr('width', iWidth)
						.attr('height', iHeight)
						.css({
							left: ($(window).width() - iWidth) / 2 + 'px',
							top: ($(window).height() - iHeight) / 2 + 'px'
						});
						naturalImgEle.show();
					} else {
						naturalImgEle = $('<div id="naturalImg"><span class="mask"></span><img src="' + src + '" width="' + iWidth + '" height="' + iHeight + '" style="left: ' + ($(window).width() - iWidth) / 2 + 'px;top: ' + ($(window).height() - iHeight) / 2 + 'px;"></div>').appendTo(document.body);
						naturalImgEle.on('click', function() {
							$(this).hide();
						});
					}
				});
			},
			searchHotel: function(object) {
				var txt = object.value,
					ul = $(object).parent().next();
				ul.children("li[name='noResult']").remove();
				if (txt == '' || $.trim(txt) == '') {
					ul.children().show();
				}
				txt = $.trim(txt.toLowerCase());
				var i = 0;
				ul.children().each(function(index, elem) {
					var _html = $(elem).text().toLowerCase();
					if (_html.indexOf(txt) < 0) {
						$(elem).hide();
					} else {
						$(elem).show();
						i++;
					}
				});
				if (i == 0) {
					ul.append('<li class="wq_hotel_li" name="noResult" style="display: list-item;"><p>没有找到符合条件的酒店</p></li>');
				}
			},
			addToCart: function(isRedirect) {
				var totalPrice = parseFloat($("#theTotalPrice").val()).toFixed(2);
				if (totalPrice <= 0) {
					addCartResult(false, "添加失败！<br/>该产品价格错误，无法加入到购物车里");
					return;
				}
				var _json = {};
				_json.startDate = $("#travel-date").val();
				_json.pkgCode = $("#package").val();
				_json.pkgName = $("#package option:selected").text();

				_json.person = [];

				var personSelect = $("[name='person-select']");
				personSelect.each(function(index, elem) {
					var _opt = $(elem).find("option:selected");
					if ($(elem).attr("data-ruleType") == "3") {
						var data_person = eval("(" + _opt.attr("data-person") + ")");
						for (var i = 0; i < data_person.length; i++) {
							var bid = data_person[i].bid;
							var thisPerson = $D.config.personInfoMap[bid];
							var ageDesc = thisPerson.ageDesc,
								ageFrom = thisPerson.ageFrom,
								ageTo = thisPerson.ageTo;
							var fromToDesc = '(' + ageFrom + '-' + ageTo + '岁)';
							if (ageFrom == 0 && ageTo == 0) {
								fromToDesc = "";
							}
							_json.person.push({
								id: bid,
								num: data_person[i].num,
								desc: (ageDesc + fromToDesc)
							});
						}
					} else {
						_json.person.push({
							id: $(elem).attr("data-id"),
							num: $(elem).val(),
							desc: $(elem).attr("data-desc")
						});
					}
				});
				var params = {
					productID: $("#businessID").val(),
					titleCn: $("#productTitle").val(),
					type: "viator",
					totalPrice: $D.config.totalPrice.toFixed(2),
					currency: "USD",
					imageUrl: $("#mainImage").val(),
					json: JSON.stringify(_json)
				};
				addProductToCartWithParams(isRedirect, params);
			},
			loadCalendar: function(month, flag) { //flag mean is init
				var init = flag;
				var cal = $("#price-calendar"),
					cur_month = cal.find("[name='cur-month']"),
					date_list = cal.find("[name='date-list']"),
					loading = cal.find("[name='loading']"),
					pkg_loading = $("#loading"),
					pkg_price_section = $("#pkg-price-section");
				$.ajax({
					url: "http://www.woqu.com/mustactive/mustactive-calendar-month/" + $D.config.businessID + "/" + month,
					dataType: "json",
					beforeSend: function() {
						if (init) {
							pkg_price_section.hide();
							pkg_loading.show();
						} else {
							date_list.hide();
							loading.show();
						}
					},
					success: function(rsp) {
						if (rsp.rs == 1) {
							if (!rsp.data.effect && !init) {
								alert(rsp.data.msg);
								date_list.show();
								loading.hide();
								return;
							}
							if (init) {
								if (rsp.data.calendar == null) {
									pkg_loading.html("此产品没有价格数据");
									return;
								}
								$D.config.currency = rsp.data.defaultDay.pkgs[0].matrixs[0].rules[0].currency;
								$D.config.currencySign = rsp.data.defaultDay.pkgs[0].matrixs[0].rules[0].currencySign;

								$D.func.buildCalendar(cur_month, date_list, rsp);
								pkg_loading.hide();
								loading.hide();
								pkg_price_section.show();
								$D.func.fillPackage(rsp.data.defaultDay.pkgs);

								$D.func.packageReset();

								// $D.func.calculatePrice("初始化日历", flag);
							} else {
								$D.func.buildCalendar(cur_month, date_list, rsp);
								date_list.show();
								loading.hide();
							}
						} else { //loading failed
							if (flag) {
								pkg_loading.html(rsp.msg);
							} else {
								loading.html("加载失败，请重试");
							}
						}
					},
					error: function(rsp) {
						if (flag) {
							pkg_loading.html(rsp.msg);
						} else {
							loading.html("加载失败，请重试");
						}
					}
				});
			},
			buildCalendar: function(cur_month, date_list, rsp) {
				cur_month.html(rsp.data.month.replace("-", "年&nbsp;") + "月");
				$D.config.curMonth = rsp.data.month;

				//fill date list
				var beginDate = new XDate(rsp.data.beginDate),
					endDate = new XDate(rsp.data.endDate),
					days = beginDate.diffDays(endDate);
				date_list.html("")
				beginDate.addDays(-1);
				for (var i = 0; i <= days; i++) {
					var the_date = beginDate.addDays(1);
					var the_date_str = the_date.toString('yyyy-MM-dd');
					var li = $("<li class='invalid_day'>" + the_date.getDate() + "</li>").appendTo(date_list);
					if (i % 7 == 6)
						li.addClass("right_li");
					var price_of_date;
					if (rsp.data.calendar) price_of_date = rsp.data.calendar[the_date_str];
					if (price_of_date) {
						li.attr("data-d", the_date_str).removeClass("invalid_day").append("<span class='inner_price'>" + $D.config.currencySign +'<font>'+ price_of_date.toFixed(2) +'</font>'+ "起</span>");
						// if ($("#travel-date").val() == "") {
						// 	$("#travel-date").val(the_date_str);
						// }
						if ($("#travel-date").val() == "") {
							$("#travel-date").val('请选择您的出行日期');
						}
						if (the_date_str == $("#travel-date").val()) {
							li.addClass("on");
						}
					}
				}
			},
			loadPackageByDate: function(date_str) {
				$.ajax({
					url: "http://www.woqu.com/mustactive/mustactive-calendar-date/" + $D.config.businessID + "/" + date_str,
					dataType: "json",
					beforeSend: function() {
						$("#loading").show();
					},
					success: function(rsp) {
						if (rsp.rs == 0) {
							alert(rsp.msg);
						} else {
							//console.log(JSON.stringify(rsp));
							$D.func.fillPackage(rsp.data);
							//如套餐没有选择则不算价
							if($('#package').children('option:selected').data('desc') != 'defaultOption' && $('#package').children('option:selected').data('desc') != undefined){
								// $D.func.calculatePrice("person num changed", false);
								$D.func.calculatePrice("更换日期重新加载package", true);
							} else {
								$('#viator_price_table').hide();
							}
							// $D.func.calculatePrice("更换日期重新加载package", true);
						}
					},
					error: function() {

					},
					complete: function() {
						$("#loading").hide();
						$("#date-pkg-wrap").show();
						$("#person-price-wrap").show();
					}
				});
			},
			fillPackage: function(pkgs) {
				var pkg_select = $("#package").html('<option value="'+pkgs[0].id+'" data-desc="defaultOption">请选择您的套餐</option>');
				$D.config.personRuleMap = {}; //reset personRule
				$D.config.personNO = {}; //reset adultNO
				for (var i = 0; i < pkgs.length; i++) {
					var pkg = pkgs[i];
					var rule = pkg.matrixs;
					$D.config.personRuleMap[pkg.id] = rule;
					$D.config.personNO[pkg.id] = pkg.persons;
					pkg.title = (pkg.title == '' || pkg.title == 'null') ? '标准套餐' : pkg.title;
					pkg.desc = (pkg.desc == '' || pkg.desc == 'null' || pkg.desc == '这是标准套餐') ? pkg.title : pkg.desc;
					pkg.desc = pkg.desc.replace(/\"/g, "'");
					var opt = $('<option value="' + pkg.id + '" data-desc="' + pkg.desc + '">' + pkg.title + '</option>').appendTo(pkg_select);
					if (i == 0) {
						var rules, ruleNO = 0;
						for (var ele in rule) {
							if (rule[ele].rules.length > ruleNO) {
								rules = rule[ele].rules;
								ruleNO = rule[ele].rules.length;
							}
						}
						// 初始化人数选择
						for (var ele in rules) {
							var person = rules[ele]
							$D.config.personInfoMap[person.id] = person.min;
						}
						$D.func.resetPersonSelect(pkg.persons, rules);

						// $('#packageRow').show();
						// $("#package-intro").html(pkg.desc);
					}
				}

				//选择套餐，
				$("#package").unbind("change").bind("change", function() {
					if($(this).children('option:selected').data('desc') != 'defaultOption'){
						$('#packageRow').show();
						$('#viator_price_table').show();
						$('#date-pkg-wrap').removeClass('error_hint');
						$('.error_text').hide();
						$("#package-intro").html($(this).children('option:selected').attr("data-desc"));
						var personRule = $D.config.personRuleMap[$(this).children('option:selected').val()];
						var adults = $D.config.personNO[$(this).children('option:selected').val()];
						var rules, ruleNO = 0;
						for (var ele in personRule) {
							if (personRule[ele].rules.length > ruleNO) {
								rules = personRule[ele].rules;
								ruleNO = personRule[ele].rules.length;
							}
						}
						for (var ele in rules) {
							var person = rules[ele];
							$D.config.personInfoMap[person.id] = person.min;
						}
						$D.func.resetPersonSelect(adults, rules);
						$D.func.calculatePrice("package changed", true);
					} else {
						$('#packageRow').hide();
						$('#viator_price_table').hide();
					}
				});
				$("#loading").hide();
				$("#date-pkg-wrap").show();
				$("#person-price-wrap").show();
			},
			resetPersonSelect: function(adults, rule) {
				var person_wrap = $("#person-list");
				person_wrap.find("tr[name='person-tr']").remove();
				var person_alert_span = person_wrap.find("tr[name='person-alert-tr']").find("span").hide();
				for (var i = 0; i < rule.length; i++) {
					var person = rule[i];
					var bid = person.id,
						currency = person.currency,
						currencySign = person.currencySign,
						price = person.price,
						min = person.min,
						max = person.max;
					//所选人数不满足matrix 重设人数
					if ($D.config.personInfoMap[bid] > max) $D.config.personInfoMap[bid] = max;
					if ($D.config.personInfoMap[bid] < min) $D.config.personInfoMap[bid] = min;
					var ageDesc = person.ageDesc,
						ageFrom = person.ageFrom,
						ageTo = person.ageTo;
					var fromToDesc = '(' + ageFrom + '-' + ageTo + '岁)';
					if (ageFrom == 0 && ageTo == 0)
						fromToDesc = "";

					var one_person = $(['<tr name="person-tr">',
						'<td>',
						'<p class="font_color_black font_size13 td_label">' + ageDesc + fromToDesc + '</p>',
						'</td>',
						'<td>',
						'<select id="personSelect' + bid + '" name="person-select" data-id="' + bid + '" data-desc="' + ageDesc + fromToDesc + '" data-currencySign="' + $D.config.currencySign + '" class="person_num_select bd_color_gray font_color_select">',
						'</select>',
						'</td>',
						'<td>',
						'<p name="unit-price" class="font_color_black font_size13"></p>',
						'</td>',
						'</tr>'
					].join("")).insertBefore(person_wrap.find("tr[name='person-alert-tr']"));
					var person_select = one_person.find("select[name='person-select']"),
						unit_price_p = one_person.find("p[name='unit-price']");
					for (var elem in adults[bid]) {
						person_select.append("<option value='" + adults[bid][elem] + "' data-price='" + price + "'>" + adults[bid][elem] + "位</option>");
					}
					$("select[id=personSelect" + bid + "] option").each(function() {
						if ($(this).val() == $D.config.personInfoMap[bid]) {
							$("#personSelect" + bid).val($D.config.personInfoMap[bid]);
						}
					});
					if (price != 0) unit_price_p.html($D.config.currencySign + price.toFixed(2) + "/人");
					else unit_price_p.html("免费");
				}
			},
			calculatePrice: function(str, init_flag) { //when personChanged,bandChanged,itemChanged,calculate price
				var selects = $("#person-list").find("select"),
					select_1 = $("#person-list").find("select[data-id='1']");
				var total_price = 0,
					total_person = 0,
					adPrice = 0;
				selects.each(function() {
					var selected = $(this).find("option:selected");
					var _num = parseInt(selected.val() || "0");
					var _price = parseFloat(selected.attr("data-price") || "0"); //获取Select选择的Text
					total_price += _price * _num;
					total_person += _num;
					if ($(this).attr("data-id") == "1") adPrice = _price;
				});
				if (total_person == 0 && init_flag) { //find band=1,change value
					$("#person-list").find("select[data-id='1']").val(1);
					total_person = 1;
					total_price = adPrice;
				}
				$("#total-price").hide().html($D.config.currencySign + "<span class='font_size28'>" + (total_price).toFixed(2) + "</span>").show(100);
				$D.config.totalPrice = total_price;
				//添加优惠
				var params = "totalPrice=" + $D.config.totalPrice;
				var date_str = $("#travel-date").val();
				$.ajax({
					url: "http://www.woqu.com/mustactive/mustactive-favourable/" + $D.config.businessID + "/" + date_str,
					type: "POST",
					dataType: "json",
					data: params,
					beforeSend: function() {
						$("#loading").show();
					},
					success: function(rsp) {
						if (rsp.rs == 0) {
							alert(rsp.msg);
						} else {
							//如果没有优惠的话
							if (rsp.data.favourablePrice == 0.0) {
								$D.config.favourablePrice = 0;
								$("#viator_price_table").html($D.priceTemplete.noFavourableTable);
								$("#total-price").html($D.config.currencySign + "<span class='font_size28'>" + ($D.config.totalPrice).toFixed(2) + "</span>");
							} else { //如果有优惠的话
								$D.config.favourablePrice = rsp.data.favourablePrice;
								$("#viator_price_table").html($D.priceTemplete.favourableTable);
								$("#total-price").html($D.config.currencySign + "<span class='font_size28'>" + ($D.config.totalPrice).toFixed(2) + "</span>");
								$("#favourable-price").html($D.config.currencySign + "<span class='font_size16'>" + ($D.config.favourablePrice).toFixed(2) + "</span>");
								var lastPrice = $D.config.totalPrice - $D.config.favourablePrice;
								$("#last-price").html($D.config.currencySign + "<span class='font_size16'>" + (lastPrice.toFixed(2)) + "</span>");
							}
						}
					},
					error: function() {

					},
					complete: function() {
						$("#loading").hide();
						$("#date-pkg-wrap").show();
						$("#person-price-wrap").show();
					}
				});
			},
			addMonthStr: function(monthStr, i) {
				return new XDate(monthStr).addMonths(i).toString('yyyy-MM')
			},
			packageReset: function() {
				$('#package').html('<option>确定日期后才能选择套餐</option>')
				$('#packageRow').hide();
			},
			poiTextCut: function() {
				$('.poi_text_wrapper').each(function() {
					var _this = $(this),
						textSpan = _this.find('.poi_text'),
						infoList = _this.find('.ma_poi_info_list'),
						text = textSpan.html(),
						allTextBtn = $('<a data-expand="false" class="font_size13 font_color_orange" style="display: block;text-align: right;" href="javascript:;">查看全部</a>');

					if (text.length > 113) {
						textSpan.attr('data-text', text);
						textSpan.html(text.substr(0, 100) + '...');
						allTextBtn.insertAfter(_this);
					}

					allTextBtn.click(function() {
						var _this_ = $(this),
							isExpand = _this_.attr('data-expand');

						if (isExpand == 'false') {
							_this_.html('收起全部');
							textSpan.html(textSpan.attr('data-text'));
							_this_.attr('data-expand', 'true');
							infoList.show();
							return;
						}
						_this_.html('查看全部');
						textSpan.html(text.substr(0, 100) + '...');
						_this_.attr('data-expand', 'false');
						infoList.hide();
					});
				});
			}
		}
	};
	window.$D = $D;

	$D.func.init();

}(jQuery, window, document));
