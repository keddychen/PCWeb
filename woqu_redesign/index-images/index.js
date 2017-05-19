;
! function($, window, document, undefined) {

	var index = {
		func: {
			init: function() {
				
				index.func.search();
				index.func.autoBanner();
				
				wq.tabControl({
					box:$('.search'),
					callback:function(num){
						var arr = [200,458];
						$('.search-content').find('i').stop().animate({left:arr[num]},500);
					}
				});
			
				//top banner animate
				setTimeout(function() {
					$('#anniversaryTopBanner').animate({
						height: 60
					}, 600, function() {
						$(this).addClass('smallBanner');
					})
				}, 5000);
				
				//restore
				$('.restore_title_close').click(function() {
					$(this).parent().hide();
				});

			},
			autoBanner:function(){
				var pw = $('#bannerSlider');
				var li = $('.slider_item');
				var btn = $('.btn_item');
				var _index = 0;
				var _MAX_INDEX = li.length - 1;
				var timeout = null;
				var M = {
					init:function(){
						
						//自动轮播
						var _setInter = M._setInter();
						pw.hover(function(){
							clearInterval(_setInter);
							_setInter = null;
						},function(){
							_setInter = M._setInter();
						});
						
						//jump
						btn.on('mouseover',function(){
							var num = btn.index($(this)[0]);
							//timeout = setTimeout(function(){
							//	if(timeout)clearTimeout(timeout);
								M._go(num);
							//},300);
						}).on('mouseout',function(){
							if(timeout)clearTimeout(timeout);
						});
							
					},
					_prev:function(){
						_index--;
						_index = _index < 0 ? _MAX_INDEX : _index;
						M._go();
					},
					_next:function(){
						_index++;
						_index = _index > _MAX_INDEX ? 0 :_index;
						M._go();
					},
					_go:function(i){
						if(_index == i)return;
						
						timeout = setTimeout(function(){
							if(timeout)clearTimeout(timeout);
							_index = (i!=null) ? i : _index;
							
							var n = pw.find('.current').index();
							li.eq(n).css('zIndex','3').siblings().css('zIndex','1');	
																											
							li.eq(_index).css({left:'50%',width:'0',zIndex:'5'})
							.stop(true,false).animate({left:'0',width:'100%'},1000);
							
							btn.removeClass('current').eq(_index).addClass('current');
						},300)
					},
					_setInter:function(time){
						var times = time || 5000;
						_Inter = setInterval(function(){
							M._next();
						},times);
						return _Inter;
					}	
				}
				M.init();
			},
			search:function(){
				/* header global search */
				var inputEle = document.createElement('input');
				if (!('placeholder' in inputEle)) {
					$('#hSearchInput').wqPlaceHolder({
						fontSize: '14px',
						lineHeight: '18px',
						height: '18px',
						placeHolderColor: '#848484',
						top: 8,
						left: 10,
						inputTextColor: '#333',
						content: '旅游城市/景点/产品/关键字',
						relParent: $('.header_search_wrapper')
					});
				}

				var _httpProtocol = (("https:" == document.location.protocol) ? "https://" : "http://");
				var _serviceUrl = _httpProtocol + "www.woqu.com/search";
				$('#hSearchInput').autocomplete({
					maxHeight: 'auto',
					width: 510,
					serviceUrl: _serviceUrl,
					dataType: 'jsonp',
					paramName: 'keys',
					params: {
						'continent': $("#searchContinent").val()
					},
					autoSelectFirst: false,
					showNoSuggestionNotice: true,
					noSuggestionNotice: '点击搜索查看更多结果',
					triggerSelectOnValidInput: false,
					preventBadQueries: false,
					transformResult: function(response) {
						//var response = JSON.parse(response);
						$("#rspUseFirst").val(response.rsp.useFirst);
						return {
							suggestions: $.map(response.rsp.suggestions, function(dataItem) {
								return {
									value: dataItem.suggestWord,
									data: dataItem.url,
									count: dataItem.count,
									category: dataItem.category || ''
								};
							})
						};
					},
					onSelect: function(suggestion) {
						//$('#hSearchCate').text(suggestion.category);
						window.open(encodeURI(suggestion.data));
					}
				});
				
				$('#hSearchInput').on('focus',function(){
					var v = $(this).val();
					if(v == ''){
						$(this).siblings('.search-list').slideDown();
					}else{
						$(this).siblings('.search-list').hide();
					}
				}).on('keyup',function(){
					var v = $(this).val();
					if(v == ''){
						$(this).siblings('.search-list').slideDown();
					}else{
						$(this).siblings('.search-list').hide();
					}
				}).on('blur',function(){
					$(this).siblings('.search-list').slideUp();
				}).on('keydown', function(event) {
					if (event.keyCode == 13) {
						$("#hSearchBtn").click();
					}
				});

				$('#hSearchBtn').on('click',function() {
					var useFirst = $("#rspUseFirst").val();
					var keys = $("#hSearchInput").val();
					if (useFirst == 'true') {
						var suggestion = $('.autocomplete-suggestion[data-index="0"]');
						var url = suggestion.attr('data-url');
						if (url) {
							window.open(encodeURI(url));
							return;
						}
					}
					var _httpProtocol = (("https:" == document.location.protocol) ? "https://" : "http://");
					url = _httpProtocol + www_base_url + "/globalsearch?keys=" + keys;
					window.open(encodeURI(url));

				});
			}
		}
	};

	index.func.init();
	
}(jQuery, window, document);