$(function() {

	var list = {
		//sort section
		sort: {
			init: function() {
				list.sort.setPriceValue();
				$('#minPrice, #maxPrice, #minDay, #maxDay').keyup(function(event) {
					var _this = $(this);

					_this.val(list.sort.forbidonLetter(_this.val()));
				});
				
				//搜索的值关闭
			    $("#closeSearch").click(function(){
				    var allUrl = $("#allUrl").val();
				    window.location.href = allUrl;
			    });
				
			    var allUrl = $("#allUrl").val();
				//清空全部
				$("#empty_filter").click(function(){
                    var newUrl = allUrl.substring(0,allUrl.indexOf("/search/"));
                    window.location.href = newUrl;					
				});
				
				var searchCategory = $("#searchCategory").val();
				$("#search-category-ul").find("a[data-category]").each(function(){
				    //改变选中
					if (searchCategory == $(this).attr("data-category")) {
				       $(this).parent().addClass("active_tag");
			        }
					//绑定点击事件
					$(this).on('click',function(){
					    var url = $(this).attr("data-href");
						window.location.href = encodeURI(url);
					});
				});
								
				//初始话specialOffer的选中的tag
				$('#specialOffer').find('input[data-key-tag]').each(function() {
					var specialOfferShortName = "tag";
					if (allUrl.indexOf('/'+specialOfferShortName+'-') > 0) {
					    var oldPartUrl = allUrl.substring(allUrl.indexOf('/'+specialOfferShortName+'-') + 1),
						oldPartUrl = oldPartUrl.split('/')[0],
						filterItems = oldPartUrl.split("-");
						for(var i = 0; i < filterItems.length; i++){
						    if(filterItems[i] == $(this).attr("data-key-tag")){
							    $(this).attr("checked",true);
							}
						}
					}	
				});	
                
				//初始话specialOffer的选中的tag
				$('#specialOffer').find('input[data-key-special]').each(function() {
					var specialOfferShortName = "pa";
					if (allUrl.indexOf('/'+specialOfferShortName+'-') > 0) {
					    var oldPartUrl = allUrl.substring(allUrl.indexOf('/'+specialOfferShortName+'-') + 1),
						oldPartUrl = oldPartUrl.split('/')[0],
						filterItems = oldPartUrl.split("-");
						for(var i = 0; i < filterItems.length; i++){
						    if(filterItems[i] == $(this).attr("data-key-special")){
							    $(this).attr("checked",true);
							}
						}
					}	
				});	
				
				//附加服务
				$('#specialOffer').find('input[type="checkbox"][data-key]').click(function() {
					list.sort.specialOfferConfirm("as","data-key");
				});
				//年终大促
				$('#specialOffer').find('input[type="checkbox"][data-key-special]').click(function() {
					list.sort.specialOfferConfirm("pa","data-key-special");
				});
				
				//限时优惠
				$('#specialOffer').find('input[type="checkbox"][data-key-tag]').click(function() {
					list.sort.specialOfferConfirm("tag","data-key-tag");
				});
				//按价格查询
				$('#submitPriceSort').click(function() {
					list.sort.priceFormat($('#minPrice'), $('#maxPrice'), function(lowPriceInput, highPriceInput) {
						var minPrice = lowPriceInput.val(),
							maxPrice = highPriceInput.val(),
							partUrl = 'pr-price_' + minPrice + '_to_' + maxPrice;
						var newUrl = list.func.getNewUrl(partUrl,"pr");
						window.location.href = newUrl;
					});
				});
				//按日期查询
				$('#submitDateSort').click(function() {				
						
						var minDate =$('#startSortDate').val().replace(/-/g,'/'),
							maxDate = $('#endSortDate').val().replace(/-/g,'/');
						var d1 = new Date(minDate);
						var d2 = new Date(maxDate);
						
						d1 = d1.getFullYear()+''+((d1.getMonth()+1 <10) ? ('0'+(d1.getMonth()+1)):(d1.getMonth()+1))+''+((d1.getDate() < 10)?('0'+d1.getDate()):(d1.getDate()));
						d2 = d2.getFullYear()+''+((d2.getMonth()+1 <10) ? ('0'+(d2.getMonth()+1)):(d2.getMonth()+1))+''+((d2.getDate() < 10)?('0'+d2.getDate()):(d2.getDate()));
						
						var partUrl = 'dd-date_' + d1 + '_to_' + d2;
						var newUrl = list.func.getNewUrl(partUrl,"dd");
						window.location.href = newUrl;					
				});
				//行程天数的确认
				$('#submitDayRangeSort').click(function(){
				   list.sort.priceFormat($('#minDay'), $('#maxDay'), function(lowPriceInput, highPriceInput) {
						var minPrice = lowPriceInput.val(),
							maxPrice = highPriceInput.val(),
							partUrl = 'dr-' + minPrice + '_' + maxPrice+'d';
						if(minPrice =="" || maxPrice ==""){
						    alert("请输入正确天数");
							return ;
						}
						var newUrl = list.func.getNewUrl(partUrl,"dr");
						window.location.href = newUrl;
					});
				});

				$('#checkboxBoss').click(function() {
					var _this = $(this),
						isChecked = _this.prop('checked'),
						checkboxList = $('#specialOffer').find('input[type="checkbox"]'),
						liList = $('#specialOffer').children();

					checkboxList.prop('checked', isChecked);
					if (isChecked) {
						liList.addClass('active_opt');
					} else {
						liList.removeClass('active_opt');
					}
				});
				$('#specialOffer input').change(function() {
					var _this = $(this);
					
					if (_this.prop('checked')) {
						_this.parent().addClass('active_opt');
					} else {
						_this.parent().removeClass('active_opt');
					}
				});
			},
			setPriceValue: function() {
				var allUrl = $('#allUrl').val();
				
				if (allUrl.indexOf('/pr-') > 0) {
					var partUrl = allUrl.substring(allUrl.indexOf('/pr-') + 1),
						priceUrl = partUrl.split("/")[0],
						min = priceUrl.split("_")[1],
						max = priceUrl.split("_")[3];

					$('#minPrice').val(min);
					$('#maxPrice').val(max);
				}
			},
			forbidonLetter: function(value) {
				return value.replace(/[^0-9]/g, '');
			},
			priceFormat: function(lowPriceInput, highPriceInput, callback) {
				var strLowPrice = lowPriceInput.val().replace(/[^0-9]/g, ''),
					strHighPrice = highPriceInput.val().replace(/[^0-9]/g, ''),
					lowPrice = strLowPrice ? parseInt(strLowPrice) : '',
					highPrice = strHighPrice ? parseInt(strHighPrice) : '';
				
				if (lowPrice > highPrice && lowPrice !== '' && highPrice !== '') {
					var temp = lowPrice,
						lowPrice = highPrice,
						highPrice = temp;
				}

				lowPriceInput.val(lowPrice);
				highPriceInput.val(highPrice);

				if (callback && typeof callback == 'function') callback.call(this, lowPriceInput, highPriceInput);
			},
			specialOfferConfirm: function(shortName,type) {
				var partUrl = shortName;
	
				$('#specialOffer').find('input:checked['+type+']').each(function() {
					partUrl += '-' + $(this).attr(type);
				});
				if(partUrl == shortName){
				    partUrl = "";
				}
				var newUrl = list.func.getNewUrl(partUrl,shortName);
				window.location.href = newUrl;
			}
		},
		//filter section
		filter: {
			func: {
				init: function() {
					this.filterOptsHide();
					this.selectHide();
				},
				filterOptsHide: function() {
					$('.opt_expand').click(function(e) {
						e.preventDefault();
						var _this = $(this),
							liHideList = _this.prev('ul').find('li.hide'),
							hotList = _this.parent().find('.md_hot_list'),
							allList = _this.parent().find('.md_all_list');

						if (_this.is('.opt_collapse')) {
							_this.text('更多').removeClass('opt_collapse');

							if (_this.is('.opt_isolate')) {
								allList.hide();
								hotList.show();
								return;
							}
							liHideList.hide();
							return;
						}

						_this.text('收起').addClass('opt_collapse');

						if (_this.is('.opt_isolate')) {
							hotList.hide();
							allList.show();
							return;
						}
						liHideList.show();
					});
				},
				selectHide: function() {
					$('.se_opt').click(function(event) {
						event.stopPropagation();
						$(this).next().toggle();
					});
					$(document.body).click(function(event) {
						if ($(event.target).is('.se_selecter')) return;

						$('.se_selecter').hide();
					});
				}
			}
		},
		//pagination section
		pagination: {
			func: {
				init: function() {
					$('#page-ul, #page_simple_div').find('a[href]').each(function() {
						var hrefValue = $(this).attr('href'),
							woqu_poiKeyWord = $('#paginationKeys').val();

						if (woqu_poiKeyWord != '') {
							$(this).attr('href', hrefValue + '&keys=' + encodeURI(woqu_poiKeyWord));
						}
					});
				}
			}
		},
		//途径城市
		letterCityFilter:{
			init:function() {
				$('.filter_group_opt').hover(function() {
					$(this).find('.group_box').show();
				}, function() {
					$(this).find('.group_box').hide();
				});

			    //letter的tag的切换
				$("#passCityUl").find('li[data-group]').each(function(i){
					$(this).on('click',function(){
						$(this).addClass('on').siblings().removeClass('on');
						$("#passCityDiv").find("div[data-group]").hide();
						$("#passCityDiv").find("div[data-group]").eq(i).show();
					});
				});
				//poi的切换
				$(".pass_travel_box").find("li[data-poiKey]").on('click',function(){
					$(this).toggleClass('on');
				});
				
				//确认
				$(".pass_travel_confirm").click(function(){
				    var shortName = $(this).attr('data-type');
					var partUrl = shortName;
					$(this).parents('.group_box').find("li[data-poiKey][class='on']").each(function(){
					    partUrl += "-"+$(this).attr("data-poiKey");
					});
					//如果没有筛选项，清空partUrl
					if(partUrl == shortName){
					    partUrl = "";
					}
					var newUrl = list.func.getNewUrl(partUrl,shortName);
					newUrl = newUrl.replace(/\/hihitu\/1000[12]+/g,'');
					window.location.href = newUrl;
					
				});
				//取消
				$(".pass_travel_cancel").click(function(){
				    $("#passCityUl").parent().hide();
				});
			}
		},
		
		
		func:{
		    getNewUrl:function(partUrl,shortName){
				var allUrl = $('#allUrl').val();
				var newUrl = allUrl,
				hasSearch = allUrl.indexOf('/search/') > 0;
				if(allUrl.lastIndexOf("/") == allUrl.length - 1){
					newUrl = allUrl.substring(0,allUrl.length - 1);
				}
				if (allUrl.indexOf('/'+shortName+'-') > 0) {
					var oldPartUrl = allUrl.substring(allUrl.indexOf('/'+shortName+'-') + 1),
						oldPartUrl = oldPartUrl.split('/')[0];
					var	newUrl = "";
					//处理partUrl为空的情况
                    if(partUrl == ""){
                        oldPartUrl = "/"+oldPartUrl;
					}					
					newUrl = allUrl.replace(oldPartUrl, partUrl);
                   //如果partUrl为空，并且allurl只包含该过滤项时，则删除/search/
				   if(newUrl.indexOf("/search/")+ 8== newUrl.length){
				        newUrl = newUrl.replace("/search/", "");
                    }
                    if(newUrl.indexOf("/search")+ 7== newUrl.length){
				        newUrl = newUrl.replace("/search", "");
                    }					
				} else {
					if (hasSearch) {
						newUrl += '/' + partUrl;
					} else {
						newUrl += '/search/' + partUrl;
					}
				}				
				var woqu_poiKeyWord = $('#search_input').val();
				if (woqu_poiKeyWord != '') {
					newUrl += '?keys=' + encodeURI(woqu_poiKeyWord);
				}
				return newUrl;
			}
		}
	};

	(function() {

		//init sort
		list.sort.init();
		list.letterCityFilter.init();
		$('#right_filter').find('a').each(function() {
			var href = $(this).attr('href');
			
			$(this).attr('href', href + '#right_filter');
		});
		if ($('#checkboxBoss').length > 0) {
			var isChecked = true;
			
			if ($('#specialOffer').find('input[type="checkbox"]').length == 0) {
				isChecked = false;
			}
			$('#specialOffer').find('input[type="checkbox"]').each(function() {
				if (!$(this).prop('checked')) {
					isChecked = false;
				}
			});
			if (isChecked) {
				$('#checkboxBoss').prop('checked', true);
			}
		}

		//init filter
		list.filter.func.init();

		//init pagination
		list.pagination.func.init();

	})();

	window.list = list;
	
});