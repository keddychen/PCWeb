$(function($, window, document, undefined) {
	var $POIINFO = {
		config: {
			currentPoiObj: null
		},
		func: {
			init: function() {
				/**
				 * 初始化全局变量
				 */
			},
			showPOI: function(obj) {
				var _poi_code = $(obj).data("code");
				$("#the_cover").remove();
				var winW = $(window).width(),
					winH = $(window).height();
				$("<div id='the_cover' class='cover' style='width:" + winW + "px;height:" + winH + "px;' onclick='$POIINFO.func.closePoi();'></div>").appendTo("body");
				$.get("http://www.woqu.com/poi/show/" + _poi_code,
					function(data) {
						$POIINFO.config.currentPoiObj = obj;
						var left = (winW - $("#poiContainer").width()) / 2,
							top = (winH - $(
								"#poiContainer").height()) / 2;
						var poiContainer = $("#poiContainer").css({
							left: left,
							top: top,
							display: "block"
						});
						poiContainer.find("#poiIntroduce").html(data);
					});
			},
			goToPoi: function(i) {
				var _curr_poi = $POIINFO.config.currentPoiObj;
				var _next_poi = (i == -1) ? $(_curr_poi).prev() : $(_curr_poi).next();
				if (_next_poi.length > 0) {
					$POIINFO.func.showPOI(_next_poi);
				} else {
					$POIINFO.func.closePoi();
				}
			},
			closePoi: function() {
				$('#poiContainer').hide().find('#poiIntroduce').html('');
				$("#the_cover").remove();
			},
		}
	};
	
	window.$POIINFO = $POIINFO;
	
	$POIINFO.func.init();

}(jQuery, window, document));