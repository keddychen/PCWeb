;!function($, window, document, undefined){ 
	
	var pack = {
	        func: {
	            init:function(){
	            	
	            	//产品详情处理
	            	//弹层
	                $(document).on('click','.product_p',function(){
	                	if(!$(".people_tips").hasClass("hide")) {
	                		window.location.href="#product_title";
	                		return ;
	                	}
	                	if(day == "") {
	                    	alert("请选择出发日期"); 
	                    	return ;
	                    }
	                	//清空上一次产品信息
	                	$("#product_content").html();
	                    var _this = $(this),
	                    _parent = _this.parent().parent(),
	                    parentOffset = _parent.offset(),
	                    parentHeight = _parent.height();
	                    
	                    var linkCode = $(this).data("link-code");
	                    var category = $(this).data("product-category");
	                    var day = $("#start-date").val();
	                    var ad = $("#adNum").val();
						var kd = $("#kdNum").val();
						var unitCount = 1;
						if(category == "HOTEL" || category == "CAR") unitCount = $D.func.getUnitCount($(this).find(".label-unit-count"), ad, kd);
//	                    pack.modify = _this;
	                    //加载产品信息
	                    $("#product_content").load("/xpack/product/detail/" + linkCode, {day:day, ad:ad, kd:kd, unitCount:unitCount}, function(){
	                        $('.table_pop_wrapper').fadeIn();
	                    });
	                });
	                //关闭弹出层
	                $(document).on('click',function(event){
	                    if($(event.target).hasClass('table_pop_mask')) {
	                        $('.table_pop_wrapper').fadeOut();
	                    }
	                    
	                });
	                $('.top_block_close').on('click',function(){
	                    $('.table_pop_wrapper').fadeOut();
	                });
	                //内容切换
	                $("#product_content").delegate(".content_switch div", "click", function(){
	                	$(this).addClass('switch_on').siblings().removeClass('switch_on');
	                    var ectInformation = $(this).parent().parent().find('.ect_information'),
	                        dataType ='.' + $(this).data('type');
	                        ectInformation.find(dataType).show().siblings().hide();
	                });
	            	
	            	//唤起客服
	                $(".btn-pack-53kf").click(function(){
	                	if(!!ga) ga('send', 'event', 'consult', 'live800_click', 'pack_detail_banner');
	                	$("#onlineKefu").click();
	                });
	            	//人数选择
	            	$(".select-form").on("change", function(){
	            		var ad = window.parseInt($("#adNum").val());
	            		var kd = window.parseInt($("#kdNum").val());
	            		var maxpeo = window.parseInt($("#adNum").data("maxpeo"));
	            		var count = ad + kd;
	            		if(count > maxpeo) $(".people_tips").html("<i></i>您已超过"+maxpeo+"人同行，请直接联系客服！").removeClass("hide");
	            		else if(kd > ad) $(".people_tips").html("<i></i>儿童数不能大于成人数，请重新选择！").removeClass("hide");
	            		else {
	            			var type = $(this).data("type");
	            			//设置表单
	            			if(type == "ad" || type == "kd") {
	            				if($("#hotelNum").size() > 0) {
	            					var hcount = $D.func.getUnitCount($("#hotelNum"), ad, kd, 0);
	            					$("#hotelNum").val(hcount);
//	            					$(".hotel-unit-count").text(hcount);
	            				}
//	            				if($("#carNum").size() > 0) {
//	            					var carNum = $D.func.getUnitCount($("#carNum"), ad, kd, 0);
//	            					$("#carNum").val(carNum);
//	            				}
	            			}
	            			//设置产品详情酒店和租车数量
//	            			var count = $(this).val();
//	            			if(type == "hotel") $(".hotel-unit-count").text(count);
//	            			else if(type == "car") $(".car-unit-count").text(count);
	            			$(".people_tips").addClass("hide");
	            			$D.func.calculatePrice();
	            			
	            			$(".label-unit-count").each(function(){
	            				$(this).text($D.func.getUnitCount(this, ad, kd));
	            			});
	            		}
	            	});
	                //hover tips
	                $('.real_order').hover(function() {
	                    Layer.hoverTips.create(this, false, '', '本产品价格、出行日期等已经经过核实，下单后即时付款。', 250)
	                }, function() {
	                    Layer.hoverTips.hide();
	                });
	                $('.confirm_order').hover(function() {
	                    Layer.hoverTips.create(this, false, '', '下单后留下您的联系方式，客服将在48小时内与您联系并确认订单。', 250)
	                }, function() {
	                    Layer.hoverTips.hide();
	                });
	                $('.price_tips').hover(function() {
	                    Layer.hoverTips.create(this, false, '', '本起价为此产品两位成人出行且共用一间房核算的单人价格。产品价格会根据您所选择的出发日期、酒店等级以及其他升级服务的不同而有所变动。', 250)
	                }, function() {
	                    Layer.hoverTips.hide();
	                });
	                //lazy load
	                $('img.lazy').lazyload();
	                //滚动导航
	                
	                $('.btn_book_now').click(function() {
	                	if(!$(".people_tips").hasClass("hide")) return ;
	                	var ad = $("#adNum").val();
						var kd = $("#kdNum").val();
						var hotel = $("#hotelNum").val();
						if(hotel == undefined) hotel = 0;
//						var car = $("#carNum").val();
//						if(car == undefined) car = 0;
	    				var personObj = {
							AD: ad,
							KD: kd
						};
	    				var comboItems = new Array();
	    				$(".combo-item.on").each(function(i){
	    					comboItems.push({comboCode: $(this).data("combo-code"), 
	    											comboName: $(this).data("combo-name"), 
	    											comboItemCode: $(this).data("combo-item-code"),
	    											comboItemName: $(this).data("combo-item-name")});
						});
	    				var jsoncontext = {person : personObj, comboItems:comboItems};
	    				var params = {
	    					productID: $("#lineCode").val(),
	    					titleCn: $("#lineName").val(),
	    					days: $("#duringDays").val(),
	    					confirmType: $("#confirmType").val(),
	    					startDate: $("#start-date").val(),
	    					jsonContext: JSON.stringify(jsoncontext),
	    					imageUrl: $("#mainImg").val(),
	    					roomNum: hotel
	    				};
	    				var url = _HTTP + w_base_url +"/pack/quickbook";
	    				$.ajax({
	    					async: true,
	    					url: url,
	    					type: "POST",
	    					dataType : 'jsonp',
	    					jsonp : "callbackparam",
	    					data: params,
	    					success: function(data) {
								if (!data.res.result) {
									if(data.res.returnMessage != ""){
									    alert(data.res.returnMessage);
									}
									else{
									    alert("预订失败");
									}
									return;
								}
								window.location.href = _HTTPS + w_base_url  + "/" + continent + "/pack/fill/" + data.quickBookID;
								return;
	    					},
	    					error: function(a, b, c, d) {
	    						alert("网络异常，请稍后再试");
	    					}
	    				});
	    			});
	                
	                

	            },
	            getDoyenObj:function(continent){
	            	var objs = doyens[continent];
	            	if(objs == undefined) return null;
	            	var size = objs.length;
	            	var index = window.parseInt(Math.random() * size);
	            	var obj = objs[index];
	            	return obj
	            }
	        }
	    };
	    pack.func.init();
	    
    var $D = detail = {
		config: {
			lineCode: "",
			curDate: $("#start-date").val(),
			curMonth: "0000-00",
			personMap: {}, //{201 : [2,1,4,3,4]}
			curPerson: "", //${itm.dftAD},${itm.dftKD},${itm.maxAD},${itm.maxKD},${itm.maxSum}
			bandPriceMap: {}, //{2014-01-01 : 650.50}
			currency: "$",
			totalPrice: 0, //总的价格
			favourableCurrency: "$",
			initUnitPrice: false,
			lastTotalPrice: 0,
			currentTotalPrice: 0,
			compare_product_num: 0,
			currentTotalPrice: 0,
			itemPriceList: [],
			currentItemPriceList: []
		},
        func: {
            init:function() {
            	var nowDay = $("#nowDay").val();
				$D.config.curMonth = nowDay == ""?"0000-00":nowDay.substring(0, 7);
				/**
				 * 初始化全局变量
				 */
				$D.config.lineCode = $("#lineCode").val();
				
                //banner photowall
                var $photoList = $('.photo-list'),
                    _nodeNum = $photoList.find('li').length,
                    _nodeWidth = $photoList.find('li').outerWidth(true);
                $photoList.css({'width':(_nodeNum + 1)*_nodeWidth});
                $photoList.find('li').eq(1).css({
                    'width':'498px',
                    'height':'370px',
                    'margin-top':'-40px'
                }).addClass('on');
                $('.switch-l').on('click',function(){
                    var $current = $photoList.find('.on');
                        $photoList.find('li').stop(true,true);
                        $photoList.find('li').eq(_nodeNum-1).prependTo($photoList).css({'margin-left':-_nodeWidth})
                        .animate({
                            'margin-left':'1px'
                        },600)
                        $current.animate({
                            'height':'280px',
                            'width':'348px',
                            'margin-top':'0px'
                        },600);
                        $current.prev().animate({
                            'height':'370px',
                            'width':'498px',
                            'margin-top':'-40px'
                        },600);
                        $current.removeClass('on').prev().addClass('on');
                });
                $('.switch-r').on('click',function(){
                    var $current = $photoList.find('.on');
                        $photoList.find('li').stop(true,true);
                        $current.prev().animate({
                            'margin-left':-_nodeWidth
                        },600,function(){
                            $(this).appendTo($photoList).css({'margin-left':'1px'});
                        });
                        $current.animate({
                            'height':'280px',
                            'width':'348px',
                            'margin-top':'0px'
                        },600);
                         $current.next().animate({
                            'height':'370px',
                            'width':'498px',
                            'margin-top':'-40px'
                        },600);
                        $current.removeClass('on').next().addClass('on');
                });

                //scroll nav 
                $('.scroll-nav').wqScrollSpy({
                    wq_scroll_nav: 'scroll-nav',
                    wq_scroll_navbar: 'nav-item',
                    wq_scroll_part: 'scroll-part',
                    ActiveControlClass: 'on',
                    beforeScrollArea: function() {
                        $('.scroll-nav').css({
                            'position': 'absolute',
                            'z-index': '1',
                            'left:':0
                        });
                        $('.nav_btn').hide();
                    },
                    scrollToArea: function() {
                        $('.scroll-nav').css({
                            'position': 'fixed',
                            'z-index': 800,
                            'top': 0,
                            'left':'auto'
                        });
                    }
                });
                //combo-list switch
              //套餐切换
                $('.combo-item').on('click',function(){
                	if(!$(this).hasClass("on")) {
                		var comboItems = new Array();
                		var _comboCode = $(this).data("combo-code");
        				$(".combo-item.on").each(function(i){
        					if(_comboCode != $(this).data("combo-code")) {
        						comboItems.push({comboCode: $(this).data("combo-code"), comboItemCode: $(this).data("combo-item-code")});
        					}
    					});
        				comboItems.push({comboCode: $(this).data("combo-code"), comboItemCode: $(this).data("combo-item-code")});
        				comboItems = JSON.stringify(comboItems);
        				$("#comboItems").val(comboItems);
        				$("#form_load_product").submit();
                	}
                	$(this).addClass('on').siblings().removeClass('on');
                });
              //绑定出发日期点击弹出calendar
				$("#start-date").click(function(event) {
                    var top = $(this).offset().top + 35,
                        left = $(this).offset().left - 100;
                    $('#calendar').css({'top':top,'left':left})
					$("#calendar").toggle();
					$D.func.stopbubble(event);
				});
				//绑定body点击隐藏calendar和套餐选择
				$("body").click(function() {
					$("#calendar").hide();
					$("ul[name='item-list']").hide();
				});
				//初始化日历，并根据日历显示相应的band，并初始化人数选择
				$D.func.loadCalendar($D.config.curMonth);
				//绑定日历上月点击
				$("#calendar").find("[name='prev-month']").click(function() {
					$D.func.loadCalendar($D.func.addMonthStr($D.config.curMonth, -1));
					return false;
				});
				//绑定日历下月点击
				$("#calendar").find("[name='next-month']").click(function() {
					$D.func.loadCalendar($D.func.addMonthStr($D.config.curMonth, 1));
					return false;
				});
				//绑定日历中日期点击切换相应的band
				$("ul[name='cal-list']").on('click', "li[data-date]", function() {
					var nowDate = $(this).attr("data-date");
					$("#start-date").val(nowDate);
					//提交表单获取选择日期
					if($D.config.curDate != nowDate) {
						$("#form_load_product").submit();
						return ;
					}
					$D.config.curDate = nowDate;
					$(this).parent().children(".on").removeClass("on");
					$(this).addClass("on");
					$("#calendar").hide();
					
//					if(nowDate != $("#start-date").val()){
//						alert("change");
//					}
//					var the_bandId = $(this).attr("data-bandId");
					//if ($D.config.curBandId != the_bandId)
//						$D.func.switchBand($D.config.curBandId, the_bandId);
					$D.func.calculatePrice();
//					$D.func.inAdvanceOrDelay(); //提前和延住
				});

                //custom dialog show
                $(".customization,.btn-custom-dialog").on('click',function(){
					$("body").append('<form target="_blank" action="http:www.woqu.com/custom/intent" id="customIntentPage"></form>');
					$("#customIntentPage").submit();
                });

                //expand-collapse
                $('.text-content').each(function(){
                    var $this = $(this);
                    if($this.height() > 100) {
                        $this.css({'height':'93px'});
                        $this.siblings('.btn-expand').show();
                    } 
                });

                var $routeItem =  $('.route-wrapper').find('.route-item'),
                    routeNum = $routeItem.length;
                    //expand-collapse btn hide or show
                    if(routeNum <= 3) $('.expand-collapse').hide();
                    //index large than three hide
                    $routeItem.each(function(i){
                        if( i>=3 ) {
                            $(this).hide();
                        }
                    });

                $('.expand-collapse').find('span').on('click',function(){
                    if($(this).hasClass('on')) {
                        $(this).removeClass('on').html('查看全部<i class="green-arrow"></i>');
                        $routeItem.each(function(i){
                            if( i>=3 ) {
                                $(this).hide();
                            }
                        });
                        $(window).scrollTop($(this).attr('data-top') - 200 );
                    } else {
                        $(this).attr('data-top',$(this).offset().top);
                        $(this).addClass('on').html('收起<i class="green-arrow"></i>');
                        $routeItem.show();
                    }
                });

                $('.btn-expand').on('click',function(){
                    var $this = $(this),$_brother = $this.siblings('.text-content');
                        if($this.hasClass('on')) {
                            $this.removeClass('on').html('展开<i></i>');
                            $_brother.css({'height':'93px'});
                        } else {
                            $this.addClass('on').html('收起<i></i>');
                            $_brother.css({'height':'auto'});
                        }
                });

            },
            scrollBarFix: function(target, scrollTop) {
                try {
                    var footerTop = $('.wq_footer_wrapper').offset().top,
                        targetHeight = target.height();
                    if (scrollTop < $('.intro-wrapper').offset().top) {
                        target.css({
                            'top': 0,
                            'bottom': 'auto'
                        });
                    } else if (scrollTop > $('.intro-wrapper').offset().top && scrollTop < footerTop - targetHeight) {
                        target.css({
                            'top': scrollTop - $('.intro-wrapper').offset().top,
                            'bottom': 'auto'
                        });
                    } else {
                        target.css({
                            'top': 'auto',
                            'bottom': 22
                        });
                    }
                } catch (e) {}
            },
            stopbubble: function(event) {
				if (event.cancelbubble) event.cancelbubble = true;
				else event.stopPropagation();
			},
			loadCalendar: function(month) { //加载日历并切换相应band
				$.ajax({
					url: "http://www.woqu.com/xpack/line-calendar/"+$D.config.lineCode+"/" + month,
					dataType: "json",
					beforeSend: function() {
						$(".global_loading").show();
					},
					success: function(crs) {
						if (crs.rs == 0) {
							alert(crs.msg);
						} else {
							$D.config.curMonth = crs.data.month;
							$D.config.currency = crs.data.currencyShow;
							$D.func.fillCalendar(crs.data);
							$D.func.calculatePrice();
							$(".unit_price_total").html(crs.data.currencyShow +crs.data.dates[0].price);
						}
					},
					error: function() {

					},
					complete: function() {
						$(".global_loading").hide();
					}
				});
			},
			fillCalendar: function(cal) {
				var currencyShow = cal.currencyShow;
				var jq_cal = $("#calendar");
				jq_cal.find("[name='cur-month']").html("<span>" + cal.month.substr(5, 2) + "</span>月&nbsp;&nbsp;&nbsp;&nbsp;<span>" + cal.month.substr(0, 4) + "</span>");

//				if (!$D.config.curDate) {
//					$D.config.curDate = cal.firstDate;
//					$("#start-date").val(cal.firstDate);
//				}
				var datePriceMap = {};
				var dateArr = cal.dates;
				for (var i = 0; i < dateArr.length; i++) {
					datePriceMap[dateArr[i].hasPriceDate] = {
						soldOut: dateArr[i].soldOut,
						price: dateArr[i].price
					};
				}

				var calFrom = new XDate(cal.calFrom.replace(/-/g, "/"));
				var calTo = new XDate(cal.calTo.replace(/-/g, "/"));
				var dayNum = calFrom.diffDays(calTo) + 1;
				var jq_cal_list = jq_cal.find("[name='cal-list']");
				jq_cal_list.html("");
				for (var i = 0; i < dayNum; i++) {
					var the_day = $D.func.addDate(calFrom, i);
					var the_day_str = the_day.toString("yyyy-MM-dd");
					var jq_li = $("<li>" + the_day.getDate() + "</li>").appendTo(jq_cal_list);
					if (i % 7 == 6) jq_li.addClass("right_li");
					if ($D.config.curDate == the_day_str) jq_li.addClass("on");

					var datePrice = datePriceMap[the_day_str];
					if (datePrice) {
						jq_li.attr("data-date", the_day_str)
							.append("<span class='inner_price'>" + currencyShow + "<br />"+datePrice.price+"起</span>");
//						if (!$D.config.curBandId) $D.config.curBandId = datePrice.bandId; //设置当前bandId
					} else {
						jq_li.addClass("invalid_day").append('<span class="inner_count" style="display:block;color:#c8c8c8;">可询价</span>');
					}
				}
			},
			calculatePrice: function() {
				//人数验证
				if(!$(".people_tips").hasClass("hide")) return ;
				var itemCodes = [];
				$(".combo-list .combo-item.on").each(function(i){
					itemCodes.push({comboCode: $(this).data("combo-code"), comboItemCode: $(this).data("combo-item-code")});
				});
				var ad = window.parseInt($("#adNum").val());
				var kd = window.parseInt($("#kdNum").val());
				var hotel = $("#hotelNum").val();
				if(hotel == undefined) hotel = 0;
//				var car = $("#carNum").val();
//				if(car == undefined) car = 0;
				$.ajax({
					url: "http://www.woqu.com/xpack/caculate-price/"+$("#lineCode").val()+"/" + $("#start-date").val(),
					data: {
						ad: ad,
						kd: kd,
						hotel: hotel,
//						car: car,
						itemCodes:JSON.stringify(itemCodes)
					},
					type: "post",
					beforeSend:function(){
						$(".price_total").html('<img src="http://www.quimg.com/a4535/img/common/loading.gif">');
						$(".average_price").html('<img src="http://www.quimg.com/a4535/img/common/loading.gif">');
						$('.book-now').attr('disabled',true).css({
							'backgroundColor':'#ccc',
							'cursor':'default'
						});
					},
					success: function(rsp) {
						if (rsp.rs == 1) {
							$D.config.totalPrice = rsp.data.cdVO.price;
							$(".price_total").html($D.config.currency + '<span class="font_size28">'+rsp.data.cdVO.price+'</span>');
                            $(".average_price").html($D.config.currency + '<span class="font_size20">'+((rsp.data.cdVO.price)/(ad + kd)).toFixed(2)+'</span>');
                            $("#divTen").text((rsp.data.cdVO.price / 10).toFixed(2));
                            $("#divThree").text((rsp.data.cdVO.price / 3).toFixed(2));
							/*换算
							$('.conversion').hover(function() {
								Layer.hoverTips.create(this, false, '', '<p class="dl_price_convert_alert"><font class="font_size14">约合</font> &nbsp;' + rsp.data.showPrice + '</p>')
							}, function() {
								Layer.hoverTips.hide();
							});*/
						} else {
							alert("计算价格错误");
						}
					},
					complete:function(){
						$('.book-now').attr('disabled',false).css({
							'backgroundColor':'#f08300',
							'cursor':'pointer'
						});
					}
				});
			},
			addDate: function(date, i) {
				var d = new XDate(date);
				return d.addDays(i);
			},
			addMonthStr: function(monthStr, i) {
				var d = new Date(monthStr.replace(/-/g, "/") + "/15");
				d.setTime(d.getTime() + i * 30 * 24 * 60 * 60 * 1000);
				return d.getFullYear() + "-" + ((d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : "" + (d.getMonth() + 1));
			},
            getUnitCount:function(_this, ad, kd, count){
            	if(count == null) count = 0;
            	var maxSum = window.parseInt($(_this).data("maxsum"));
            	var maxAd = window.parseInt($(_this).data("maxad"));
            	var maxKd = window.parseInt($(_this).data("maxkd"));
            	
        		if(ad <= 0 && kd <= 0) return 0;
        		if(count > 5) return 0;
        		
        		var jad = 0;
        		if(ad > 0) {
        			jad = Math.min(ad, maxAd);
        			ad -= jad;
        		}
        		if(kd > 0) kd -= Math.min(maxSum - jad, maxKd);
        		return 1 + $D.func.getUnitCount(_this, ad, kd, count + 1);
            }
        }
    }

    $(window).scroll(function() {
        var top = $(this).scrollTop();
        $D.func.scrollBarFix($('.content-right'), top);
    });

    $D.func.init();
}(jQuery, window, document);