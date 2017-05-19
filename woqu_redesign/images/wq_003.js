;$(function($, window, document, undefined) {

	//jquery cookie
	(function(factory) {
		if (typeof define === 'function' && define.amd) {
			define(['jquery'], factory);
		} else if (typeof exports === 'object') {
			factory(require('jquery'));
		} else {
			factory(jQuery);
		}
	}(function($) {
		var pluses = /\+/g;

		function encode(s) {
			return config.raw ? s : encodeURIComponent(s);
		}

		function decode(s) {
			return config.raw ? s : decodeURIComponent(s);
		}

		function stringifyCookieValue(value) {
			return encode(config.json ? JSON.stringify(value) : String(value));
		}

		function parseCookieValue(s) {
			if (s.indexOf('"') === 0) {
				s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
			}
			try {
				s = decodeURIComponent(s.replace(pluses, ' '));
				return config.json ? JSON.parse(s) : s;
			} catch (e) {}
		}

		function read(s, converter) {
			var value = config.raw ? s : parseCookieValue(s);
			return $.isFunction(converter) ? converter(value) : value;
		}
		var config = $.cookie = function(key, value, options) {
			if (arguments.length > 1 && !$.isFunction(value)) {
				options = $.extend({}, config.defaults, options);
				if (typeof options.expires === 'number') {
					var days = options.expires,
						t = options.expires = new Date();
					t.setTime(+t + days * 864e+5);
				}
				return (document.cookie = [
					encode(key), '=', stringifyCookieValue(value),
					options.expires ? '; expires=' + options.expires.toUTCString() : '',
					options.path ? '; path=' + options.path : '',
					options.domain ? '; domain=' + options.domain : '',
					options.secure ? '; secure' : ''
				].join(''));
			}
			var result = key ? undefined : {};
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			for (var i = 0, l = cookies.length; i < l; i++) {
				var parts = cookies[i].split('=');
				var name = decode(parts.shift());
				var cookie = parts.join('=');
				if (key && key === name) {
					result = read(cookie, value);
					break;
				}
				if (!key && (cookie = read(cookie)) !== undefined) {
					result[name] = cookie;
				}
			}

			return result;
		};
		config.defaults = {};

		$.removeCookie = function(key, options) {
			if ($.cookie(key) === undefined) {
				return false;
			}
			$.cookie(key, '', $.extend({}, options, {
				expires: -1
			}));
			return !$.cookie(key);
		};

	}));

	
	/* ------------------------$.function----------------------------------- */

	$.extend({
		openWin: function(opt) {
			var defaults = {
					method: "GET",
					target: "_blank",
					url: "",
					params: []
				}
				opt = jQuery.extend({}, defaults, opt),
				_form = $("#wq_open_win");
			
			if (_form.length == 0) _form = $("<form id='wq_open_win' style='display:none;' action='' target='_blank' method='GET'></form>").appendTo("body");
			_form.children().remove();
			_form.attr("action", opt.url).attr("target", opt.target).attr("method", opt.method);
			if (opt.params && opt.params.length > 0) {
				for (var i = 0; i < opt.params.length; i++) {
					_form.append("<input type='hidden' name='" + opt.params[i].name + "' value='" + opt.params[i].value + "'/>");
				}
			}
			_form.submit();
		},
		corsProxy: function(opt) {
			var _method = opt.method || "GET",
				_url = encodeURI(opt.url),
				_dataType = opt.dataType,
				_params = opt.params || {},
				_callback = opt.callback,
				_domain = opt.domain || "http://www.woqu.com",
				_paramsJsonStr = encodeURI(JSON.stringify(_params)),
				_src = _domain + "/ajax-proxy?url=" + _url + "&method=" + _method + "&params=" + _paramsJsonStr + "&dataType=" + _dataType + "&callback=" + _callback,
				_frame = $("#ajaxProxyFrame");
			
			if (_frame.length == 0) {
				_frame = $("<iframe id='ajaxProxyFrame' style='display:none;'></iframe>").appendTo("body");
			}
			_frame.attr("src", _src);
		},
		/**
		 * detail page error tips
	 	 */
		wqDetailTip: function(opt) {
			var defaults = {
					title: "我趣温馨提醒",
					content: "this is an example",
					close: $.noop,
					left: 0,
					top: 0,
					zIndex: 98,
					needCover: true
				},
				opt = $.extend({}, defaults, opt),
				cover = $("#cover");
			
			if (!cover.length) {
				cover = $('<div id="cover" style="display:none;position:fixed;_position:absolute;z-index:' + opt.zIndex + ';left:0;top:0;opacity:0.06;filter:alpha(opacity=6);background-color:#000;"></div>').appendTo("body");
			}
			cover.css({
				width: $(window).width(),
				height: $(window).height()
			});
			if (opt.needCover) cover.show();
			else cover.hide();
			var tip_wrapper = $('<div id="tip_wrapper" style="width:266px;border:1px solid #06a6a6;background-color:#fff;position:absolute;z-index:' + (opt.zIndex + 1) + ';padding:15px;"></div>')
				.appendTo("body");
			tip_wrapper.css({
				left: opt.left,
				top: opt.top
			});
			$('<p style="color:#f08300;font-size:16px;font-weight:bold;padding-bottom:8px;">' + opt.title + '</p>').appendTo(tip_wrapper);
			$('<p style="color:#aeaeae;font-size:14px;">' + opt.content + '</p>').appendTo(tip_wrapper);
			var close_btn = $('<i style="position:absolute;left:280px;top:5px;width:12px;height:12px;background:url(\'http://www.quimg.com/a2358/img/common/woqu-detail-all.png\') -389px -87px no-repeat;"></i>').appendTo(tip_wrapper);
			close_btn.click(function() {
				$(this).parent().remove();
				$("#cover").hide();
				if (typeof opt.close == 'function') {
					opt.close.call(this, null);
				}
			});

			return tip_wrapper;
		},
		/**
		 * regExp test
	 	 */
		wqRegExpTest: function(type, content) {
	 		var regExpMap = {
					'common'			: /[\s\S]*/,													//匹配任何内容
					'chinese'  			: /^[\u4e00-\u9fa5]{1,}$/,										//中文
					'noChinese'			: /^[^\u4e00-\u9fa5]{0,}$/,										//非中文
					'letter'			: /^[a-zA-Z]+([a-zA-Z]|\s)*$/,									    	//纯字母
					'number'			: /^\d+$/, 														//匹配数字
					'numberLimit10'		: /^\d{10}$/, 													//匹配10位数字
					'bankCard'			: /^\d{15,19}$/,													//银行卡号
					'idCard'			: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,					//身份证号码
	                'creditMonth'		: /^(([0][1-9])|([1][0-2]))$/,
	                'creditYear'		: /^(\d){1,2}$/,
	                'creditCvc'			: /^(\d){3,4}$/,
	                'creditNumberUSA'	: /^(\d){5,19}$/,				
					'email'				: /^\w+([-.]\w+)*@\w+([-]\w+)*\.(\w+([-]\w+)*\.)*[a-z]{2,3}$/,
					'mobile'			: /^1[0-9]{10}$/, 												//指的是中国的手机号码
					'mobileCN'			: /^1[0-9]{10}$/,												//中国1开头的10为数字
					'mobileUSA'			: /^[0-9]{10,11}$/, 												//美国10位数字
					'mobileCAD'			: /^[0-9]{10,11}$/, 												//加拿大10位数字
					'mobileAUD'			: /^[0-9]{9,10}$/, 												//澳大利亚9位
					'mobileNZD'			: /^[0-9]{9,10}$/, 												//新西兰9位数字
					'mobileHK'			: /^[0-9]{8,9}$/, 												//香港
					'mobileMacau'		: /(^0\d{8}$)|(^6\d{7}$)/, 												//澳门
					'mobileTW'			: /^[0-9]{9,10}$/, 												//台湾
					'mobileUK'			: /(^0\d{10}$)|(^7\d{9}$)/,												//英国手机号码位数：10位数字，7开头
					'mobileFrance'		: /^[0-9]{9,10}$/, 												//法国手机号码位数：9位数字
					'mobileGermany'		: /^[0-9]{10,11}$/, 												//德国手机号码位数：11位数字
					'mobileBelgium'		: /(^0\d{9}$)|(^4\d{8}$)/, 												//比利时手机号码位数：10位数字，4开头
					'mobileItaly'		: /(^0\d{10}$)|(^3\d{9}$)/, 												//意大利手机号码位数：10位数字
					'mobileSpain'		: /(^0\d{9}$)|(^7\d{8}$)|(^6\d{8}$)/, 												//西班牙手机号码位数：9位数字，以6开头
					'mobileSwiss'		: /^[0-9]{9,10}$/, 												//瑞士手机号码位数：10位数字，07开头
					'mobileHolland'		: /(^0\d{9}$)|(^6\d{8}$)/, 												//荷兰手机号码位数：10位数字，以06开头
					'mobileGreece'		: /(^0\d{10}$)|(6\d{9}$)/, 												//希腊手机号码位数：10位数字
					'mobileNorway'		: /(^0\d{8}$)|(^4\d{7}$)|(^9\d{7}$)/,
					'password'			: /^[a-zA-Z0-9]{6,22}$/,
					'registPassword'    : /^[0-9a-zA-Z_]{6,22}$/,                                        //验证由数字、26个英文字母或者下划线组成的密码
					'telephone' 		: /^[+]{0,1}(\d){1,4}[ ]{0,1}([-]{0,1}((\d)|[ ]){1,12})+$/,
					'date'				: /^\d{4}-\d{2}-\d{2}$/, 										//简单日期格式判断  1990-12-12
					'flightNum'			: /^[a-zA-Z]{2}[0-9]{1,4}$/,										//航班号格式判断	航空公司双字码（字母两位） + 2-4位数字
					'hour'				: /^(1|0)[0-9]|2[0-3]$/,											//小时格式判断		24小时制
					'minute'			: /^[0-5][0-9]$/,												//分钟格式判断	
					'passportNum'		: /^[0-9a-zA-Z]{0,12}?$/ ,    									//护照号码正则
					'userName'			:/^[\u4e00-\u9fa50-9a-zA-Z]{1,}$/					//字母、中文
				},
				regExpErrMap = {
					'email'				: '邮箱格式错误',
					'mobile'			: '手机格式错误',
					'letter'			: '请输入英文字母',
					'chinese'			: '请输入中文',
					'noChinese'			: '此处不允许输入中文',
					'number'			: '请输入正确数字',
					'numberLimit10'		: '请输入正确的10位数字',
					'bankCard'			: '请输入正确的银行卡号',
					'idCard'			: '请输入正确的身份证号码',
					'creditMonth'		: '请输入2位的月数',
	                'creditYear'		: '请输入2位的年数',
	                'creditCvc'			: '请输入正确的验证码',
	                'creditNumberUSA'	: '请输入正确的卡号',
					'mobileCN'			: '手机格式错误(中国)',
					'mobileUSA'			: '手机格式错误(美国/加拿大)',
					'mobileCAD'			: '手机格式错误(美国/加拿大)',
					'mobileAUD'			: '手机格式错误(澳大利亚)',
					'mobileNZD'			: '手机格式错误(新西兰)',
					'mobileHK'			: '手机格式错误(香港)',
					'mobileMacau'		: '手机格式错误(澳门)',
					'mobileTW'			: '手机格式错误(台湾)',
					'mobileUK'			: '手机格式错误(英国)',
					'mobileFrance'		: '手机格式错误(法国)',
					'mobileGermany'		: '手机格式错误(德国)',
					'mobileBelgium'		: '手机格式错误(比利时)',
					'mobileItaly'		: '手机格式错误(意大利)',
					'mobileSpain'		: '手机格式错误(西班牙)',
					'mobileSwiss'		: '手机格式错误(瑞士)',
					'mobileHolland'		: '手机格式错误(荷兰)',
					'mobileGreece'		: '手机格式错误(希腊)',
					'mobileNorway'		: '手机格式错误(挪威)',
					'telephone' 		: '座机格式错误',
					'password'			: '密码长度必须为6-22位',
					'registPassword'    : '密码格式错误',
					'date'				: '请选择日期',
					'flightNum'			: '请输入正确的航班号码',
					'hour'				: '请输入正确的小时',
					'minute'			: '请输入正确的分钟',
					'passportNum' 		: '护照号码不符合规则',
					'userName'			:'用户名格式不正确'
				};

	 		return {code: regExpMap[type].test(content), msg: regExpErrMap[type]};
	 	},
	 	/**
		 * content fill error tips
	 	 */
	 	wqErrorTips: function(opt) {
			var typeArr = [
					'data-vtype', 	//获取元素的类型 mobile || email || common(没有特别类型的) || ...   	*必须项*
					'data-vrequire', //判断元素是否必填 true || false	 									*必须项(除非有data-vgroup)*
					'data-vgroup', 	//如果值相同的元素只需填一个，属于组元素则不需要data-vrequire属性		*拥有该属性则不需要data-vrequire*	
				   	'data-vrepeat',	//需要确认的值需要与原值相同，需要确认的元素必须有data-vrequire属性
				   	'data-vdefault'	//下拉列表选项有默认值，判断如果当前的值为默认值的话就报“请选择类型”
				],
				repeatErrMap = {
					'email': '确认邮箱与原邮箱不一致',
					'password': '确认密码与原密码不一致'
				},
				isWrapExits = $('#errorTips').length ? true : false,
				tipsHtml = $(),
				wrapper = $(opt.wrapper),
				validArr = wrapper.find('*[data-vtype]'),	//DOM Object
				len = validArr.length;

			if (!isWrapExits) {
				tipsHtml = $('<span id="errorTips" class="comp_tips_default" style="display: block;position: absolute;top: 0;left: 0;height: 24px;line-height: 24px;z-index: 999;font-size: 14px;color: #f5f6f6;padding: 0 5px;background-color: #f08300;display: none;"></span>');
				tipsHtml.appendTo($(document.body));
			} else {
				tipsHtml = $('#errorTips');
			}	
			for (var i = 0; i < len; i++) {
				var valItem_DOM = validArr[i],
					valItem = $(valItem_DOM),	//当前元素
					val = $.trim(valItem.val()),
					offset = valItem.offset(),
					x = offset.left + valItem.width() + 10 + 'px',
					y = offset.top + valItem.height() - 16 + 'px',
					type = valItem.attr('data-vtype'),
					isMatchRegExp = $.wqRegExpTest(type, val).code,
					regExpErr = $.wqRegExpTest(type, val).msg,
					isRequire = valItem.attr('data-vrequire') === 'true' ? true : false,
					hasGroup = valItem.attr('data-vgroup') ? true : false,
					currentGroup = hasGroup ? valItem.attr('data-vgroup') : '',		//当前属于的组
					needRepeat = valItem.attr('data-vrepeat') ? true : false,
					currentRepeat = needRepeat ? valItem.attr('data-vrepeat') : '',	//当前需要确认的
					hasDefault = valItem.attr('data-vdefault') ? true : false,
					isDefault = hasDefault ? (val == '请选择') : false;			//有默认值的选项当前的值

				tipsHtml.css({
					'top': y,
					'left': x
				});
				if (isRequire) {	//必填
					if (!val) {		//为空
						tipsHtml.html('不能为空').show();
						positionFix(valItem);
						return;
					} else {		//不为空
						if (hasDefault && isDefault)	{	//有默认值
							tipsHtml.html('请选择一种类型').show();
							positionFix(valItem);
							return;
						} else if (!isMatchRegExp) {	//不匹配
							tipsHtml.html(regExpErr).show();
							positionFix(valItem);
							return;
						} else {	//匹配
							if (needRepeat) {		//需要确认
								var rGroupArr = wrapper.find('*[data-vrepeat="' + currentRepeat + '"]'),
									_len = rGroupArr.length,
									rFirstVal = $.trim($(rGroupArr[0]).val());
								for (var t = 1; t < _len; t++) {
									var repeatItem = $(rGroupArr[t]),
										rVal = $.trim(repeatItem.val()),
										rOffset = repeatItem.offset(),
										rX = rOffset.left + repeatItem.width() + 10 + 'px',
										rY = rOffset.top + repeatItem.height() - 16 + 'px';
									tipsHtml.css({
										'top': rY,
										'left': rX
									});
									if (rVal == rFirstVal) {
										tipsHtml.hide();
										continue;
									} else {
										tipsHtml.html(repeatErrMap[type]).show();
										positionFix(repeatItem);
										return;
									}
								}
							} else {
								tipsHtml.hide();
								continue;
							}
						}
					}
				} else {	//非必填
					if (hasGroup) {		//属于分组
						if (val) {		//不为空
							if (!isMatchRegExp) {	//不匹配
								tipsHtml.html(regExpErr).show();
								positionFix(valItem);
								return;
							} else {
								tipsHtml.hide();
								continue;
							}
						} else {	//为空，则遍历该分组所有元素，如果全部为空则提示错误，如果有不为空但不匹配也提示错误
							var groupArr = wrapper.find('*[data-vgroup="' + currentGroup + '"]'),
								_len_ = groupArr.length,
								isGroupEmpty = true,
								isGroupValid = true;
							for (var j = 0; j < _len_; j++) {
								var groupItem_DOM = groupArr[j],
									groupItem = $(groupItem_DOM),
									gOffset = groupItem.offset(),
									gX = gOffset.left + groupItem.width() + 10 + 'px',
									gY = gOffset.top + groupItem.height() - 16 + 'px',
									gVal = $.trim(groupItem.val()),
									gType = groupItem.attr('data-vtype')/*,
									gregExp = regExpMap[gType]*/;
								tipsHtml.css({
									'top': gY,
									'left': gX
								});
								if (!gVal) {	//遍历的组元素为空，则从下一个开始执行
									continue;
								} else {	//遍历到不为空的组元素
									isGroupEmpty = false;
									if (!$.wqRegExpTest(gType, gVal).code) {	//不匹配正则
										tipsHtml.html(regExpErr).show();
										isGroupValid = false;
										positionFix(groupItem);
										return;
									} else {	//匹配正则
										tipsHtml.hide();
										continue;
									}
								}
							}
							if (isGroupEmpty) {
								var first = $(groupArr[0]),
									content = '', 
									fOffset = first.offset(),
									fX = fOffset.left + first.width() + 10 + 'px',
									fY = fOffset.top + first.height() - 16 + 'px';
								if (first.attr('data-vtype') == 'mobile' ||  first.attr('data-vtype') == 'telephone') {
									content = '手机或者座机至少填写一个'
								}
								tipsHtml.css({'top': fY, 'left': fX}).html(content).show();
								positionFix(first);
								return;
							}
							if (!isGroupEmpty && isGroupValid) {
								tipsHtml.hide();
								continue;
							}
						}
					} else {	//不属于分组
						if (val) {		//不为空
							if (!isMatchRegExp) {	//不匹配
								tipsHtml.html(regExpErr).show();
								positionFix(valItem);
								return;
							} else {
								tipsHtml.hide();
								continue;
							}
						}
					}
				}
			}
			//全部通过验证则执行回调函数
			opt.success();
			function positionFix(elem) {
				var offsetY = elem.offset().top;
				$(window).scrollTop(offsetY - 300);
				elem.focus(function() {
					tipsHtml.hide();
				});
				
				if (opt.fail && typeof opt.fail == 'function') {
					opt.fail();
				}
			}
		},
		AlertMsg: function(options) {
			var AlertMsgIDArr = [],
				msg = options.msg || "",
				elem = options.elem || null,
				position = options.position || null,
				distance = options.distance || 5,
				type = options.type || null,
				msgId = options.msgId || "alert_msg_" + new Date().getTime(),
				timeout = options.timeout || 2500;
			
			if ($(".alert_msg").length > 0) {
				$(".alert_msg").remove();
			}
			AlertMsgIDArr.push[msgId];
			if (type == 'error') type = 'alert_msg_error';
			else if (type == 'suc') type = 'alert_msg_suc';
			else if (type == 'tips') type = 'alert_msg_tips';
			else type = '';
			var left = 0,
				top = 0;
			var d = $('<div class="alert_msg ' + type + '" id="' + msgId + '">' + msg + '</div>').appendTo("body");
			if (elem == null || position == null || position === 'center') {
				var winWidth = window.innerWidth || document.documentElement.clientWidth,
					winHeight = window.innerHeight || document.documentElement.clientHeight;
				var left = (winWidth - d.width()) / 2,
					top = (winHeight - d.height()) / 2;
				d.css({
					"top": top + "px",
					"left": left + "px",
					"z-index": 99999
				}).show();
			} else {
				left = $(elem).offset().left,
					top = $(elem).offset().top,
					twidth = elem[0].offsetWidth,
					theight = elem[0].offsetHeight;
				if (position == 'right') left = left + twidth + distance;
				if (position == 'bottom') top = top + theight + distance;
				if (position == 'top') top = top - theight - distance;
				d.css({
					"top": top + "px",
					"left": left + "px",
					"z-index": 99999
				}).show();
			}
			setTimeout(function() {
				AlertMsgRemove(msgId);
			}, timeout);

			function AlertMsgRemove(_id) {
				$("#" + _id).animate({
					opacity: "0"
				}, 500, function() {
					for (var i = 0; i < AlertMsgIDArr.length; i++) {
						if (AlertMsgIDArr[i] == _id) AlertMsgIDArr[i];
					}
					$(this).remove();
				});
			}
		},
		/**
		 * hotel confirm dialog
		 */
		hotelCancelDialog: function(opts) {
			var defaults = {
				type: 'free',	//free || pay
				title: '我趣君提醒你',
				content: '<span style="line-height: 70px;">酒店提示框</span>',
				width: 370,
				height: 200,
				callback: $.noop
			};

			opts = $.extend({}, defaults, opts);

			var target,
			_htmlTemplate = $('<div class="hotel_dialog_mask_wrapper"><div class="hotel_dialog_mask"></div>\
								<div style="height: ' + opts.height + 'px; width: ' + opts.width + 'px;margin-left: ' + -opts.width/2 + 'px;margin-top: ' + -opts.height/2 + 'px;" class="hotel_dialog_wrapper ' + opts.type + '_dialog">\
								<a class="hd_close" href="javascript:;"></a>\
								<h1 class="hd_title">' + opts.title + '</h1>\
								<div class="hd_main">\
									<i class="' + opts.type + '_icon"></i>\
									<div class="hd_content">' + opts.content + '</div>\
									<div class="hd_btn_wrapper">\
										<a class="cancel_btn" href="javascript:;" data-event="0">否</a>\
										<a class="confirm_btn" href="javascript:;" data-event="1">是</a>\
									</div>\
								</div>\
							</div></div>');
			if ($('.hotel_dialog_wrapper').length) {
				target = $('.hotel_dialog_wrapper');

				if (target.is('.' + opts.type + '_dialog')) {
					target.show();
				} 
			} else {
				$(document.body).append(_htmlTemplate);
			}
			target = _htmlTemplate.appendTo($(document.body));

			target.on('click', '.hd_close', function() {
				close();
			});

			target.on('click', '.hd_btn_wrapper a', function() {
				var _this = $(this);
				if (opts.callback && typeof opts.callback == 'function') {
					opts.callback(_this.data('event'));
					close();
				}
			});

			function close() {
				target.hide();
			}
		},
		/**
		 * tab
		 */
		wqTabControl:function(opts){
			/*
			 * 按钮添加role=tab-btn属性
			 * 内容添加role=tab-content属性
			 */
			var options = $.extend({},{
				eventType:'click',
				animate:false,
				callback:null
			},opts);
			if(!options.box)return;
	        var _$btn = options.box.find('[role=tab-btn]'),
	            _$content = options.box.find('[role=tab-content]'),
	            _MAX_INDEX = _$btn.length - 1,
	            _index = 0,
	            _flag = false;

	         _$btn.on(options.eventType,function(){
	             var num = options.box.find('[role=tab-btn]').index($(this)[0]);
	             if(num == _index){
	                    return;
	             }
	             if(_flag)return;
	             _flag = true;
	             _$btn.removeClass('current').eq(num).addClass('current');
	             if(options.animate){
	            	 //动画切换效果需要配合css：position来实现
		             _$content.delay(500).css('left','100%').eq(num).stop(true,false).animate({'left':'0'},500,function(){
		            	 _index = num;
		            	 if(options.callback && typeof options.callback == 'function'){options.callback(_index);}
		            	 _flag = false;
		             });
	             }else{
	            	 //一般切换
	            	 _$content.hide().eq(num).show();
	            	 _index = num;
	            	 if(options.callback && typeof options.callback == 'function'){options.callback(_index);}
	            	 _flag = false;
	             }
	         })
		         
		},
		/**
		 * photoWall
		 */
		wqPhotoWall:function(options){

			var options = $.extend({},{
				box:$('#photoWall'),
				size:1,
				eventType:'click',
				auto:false,
				animate:false,
				jump:false,
				callback:null
			},options),
			$PW = options.box,
			$UL = $PW.find('[role="photowall-ul"]'),
			$LI = $UL.find('[role="photowall-li"]'),
			$li_w = $LI.outerWidth(true),
			$PREV = $PW.find('[role="prev-btn"]'),
			$NEXT = $PW.find('[role="next-btn"]'),
			_index = 0,
			_MAX_INDEX = $LI.length-options.size,
			_flag = false;
			
			if(options.animate){
				$UL.css('width',$li_w*$LI.length);
			}
			
			var MODEL = {
				/**
	             * 向上轮播
	             */
				prev:function(){
					if(_flag)return;
					if(options.animate){
						if(_index > 0){
							_index--;							
							this.go();
						}
					}else{
						_index--;
						_index = _index < 0 ? _MAX_INDEX : _index;
						this.go();
					}
					
				},
				/**
	             * 向下轮播
	             */
				next:function(){
					if(_flag)return;
					if(options.animate){
						if(_index < _MAX_INDEX){
							_index++;							
							this.go();
						}
					}else{
						_index++;
						_index = _index > _MAX_INDEX ? 0 :_index;
						this.go();
					}
					
				},
				/**
	             * 指定页轮播
	             */
				go:function(i){
					
					if(_index == i){
						return;
					}
					if(_flag)return;					
					_index = (i != null) ? i : _index;	
					if(options.animate){
						_flag = true;
						$UL.stop().animate({left:-_index * $li_w},500,function(){
							if(options.callback && typeof options.callback == 'function'){options.callback(_index,$PREV,$NEXT);}
							_flag = false;
						});
					}else{
						$LI.fadeOut(400).eq(_index).fadeIn(400);
						$PW.find('[role="photo-btn"]').removeClass('current').eq(_index).addClass('current');
					}
					
				},				
				/**
	             * 定时轮播
	             * @param {number} [time] 轮播间隔 默认5000; 
	             */
				setInter:function(time){
					time = time || 5000;
					var _this = this,
						_Inter = setInterval(function(){
						_this.next();
					},5000)
					return _Inter;
				}
			}
						
			if(options.auto){
				//自动轮播
				var _setInter = MODEL.setInter();
		        //停止自动轮播
				$PW.hover(function(){
					clearInterval(_setInter);
					_setInter = null;
				},function(){
					_setInter = MODEL.setInter();
				});
			}
	        if(options.jump){
	        	//jump
				$PW.find('[role="photo-btn"]').on(options.eventType,function(){
					var _index = $PW.find('[role="photo-btn"]').index($(this)[0]);
					MODEL.go(_index);
				});
	        }	        
	        //prev
	        $PREV.on('click',function(){
				MODEL.prev();
			});
			//next
	        $NEXT.on('click',function(){
				MODEL.next();
			})				
			
		}
	});

	
	/* ------------------------$.fn.function----------------------------------- */

	$.fn.extend({
		/**
		 * select init plugin
	 	 */
		wqSelect: function(options) {
    		var defaults = {
		        	defaultOpt: ['0', '请选择'],
		        	hasDefaultOpt: false,
		        	defaultValue: '',
		        	mapArr: [],
		        	callback: $.noop
		        },
		        options = $.extend({}, defaults, options);
    		
    		return this.each(function() {
    			var _this = $(this);

    			//set default option
    			if (options.hasDefaultOpt) {
    				options.defaultValue = options.defaultOpt[0];
    				$('<option></option>').val(options.defaultOpt[0]).text(options.defaultOpt[1]).appendTo(_this);
    			} else {
    				options.defaultValue = options.mapArr[0][0];
    			}
    			options.defaultValue = _this.attr('data-selectedValue') || options.defaultValue;
    			
    			//fill options
    			for (var i=0; i<options.mapArr.length; i++) {
    				$('<option></option>').val(options.mapArr[i][0]).text(options.mapArr[i][1]).appendTo(_this);
    				if (options.defaultValue == options.mapArr[i][0]) {
    					_this.val(options.defaultValue);
    				}
    			}

    			if (options.callback && typeof options.callback == 'function') {
    				_this.change(function() {
    					options.callback.call(this, _this.val());
    				});
    			}
    		});
    	},
		wqScrollSpy: function(options) {
			var defaults = {
					wq_scroll_nav: '', 		//对浮动导航整体设置class
					wq_scroll_navbar: '', 	//对导航标签设置class
					wq_scroll_part: '', 	//对滚动的每个内容块设置class
					ActiveControlClass: '', //导航块选中时的样式
					beforeScrollArea: '', 	//未到达滚动区域时，浮动导航执行的函数,例:beforeScrollArea:function(){ $('.wq_scroll_nav').hide(); },
					scrollToArea: '', 		//到达滚动区域时，浮动导航执行的函数
					scrollOutArea: '', 		//离开滚动区域时，滚动导航执行的函数，默认隐藏
					whenInArea_call: ''		// 当在滚动区域滚动时的回调函数
				},
				opts = $.extend({}, $.fn.wqScrollSpy.defaults, options),
				wq_scroll_nav = opts.wq_scroll_nav ? opts.wq_scroll_nav : 'wq_scroll_nav',
				wq_scroll_navbar = opts.wq_scroll_navbar ? opts.wq_scroll_navbar : 'wq_scroll_navbar',
				wq_scroll_part = opts.wq_scroll_part ? opts.wq_scroll_part : 'wq_scroll_part',
				ActiveControlClass = opts.ActiveControlClass,
				beforeScrollArea = opts.beforeScrollArea,
				scrollToArea = opts.scrollToArea,
			    scrollOutArea = opts.scrollOutArea,
			    whenInArea_call = opts.whenInArea_call,
				ishide = opts.ishide,
				doc_H = $(document).height(),
				win_H = $(window).height(),
				wq_scroll_part_H = 0,
				//wq_scroll_nav_left = $('.'+wq_scroll_nav).offset().left,
				every_part_top = new Array(),
				every_navbar = new Array();

			$('.' + wq_scroll_part).each(function() {
				wq_scroll_part_H += $(this).height();
			});

			//导航如需要隐藏或其他样式，刚加载页面时隐藏导航或执行其他样式
			function changeScrollpartStatus() {
				var _scrollT = $(window).scrollTop(),
					scrollpartTop = $('.' + wq_scroll_part).eq(0).offset().top;
				if (_scrollT < scrollpartTop && beforeScrollArea && typeof beforeScrollArea == 'function') {
					beforeScrollArea();
					//$('.'+wq_scroll_nav).css('left','0');
				}
				if (_scrollT > scrollpartTop && _scrollT < wq_scroll_part_H + $('.' + wq_scroll_part).offset().top && scrollToArea && typeof scrollToArea == 'function') {
					scrollToArea();
					//$('.'+wq_scroll_nav).css('left',wq_scroll_nav_left);
				}
			}

			function scrollPartEvent() {
				var scrollT = $(window).scrollTop();
				$('.' + wq_scroll_part).each(function(i) {
					every_part_top[i] = $(this).offset().top;
					every_navbar[i] = $('.' + wq_scroll_navbar).eq(i);
					
					//判断当前页面位置，并执行相应函数
					changeScrollpartStatus();

					//设置导航标签active样式
					if (scrollT >= every_part_top[i]) {
						$('.' + wq_scroll_navbar).removeClass(ActiveControlClass);
						every_navbar[i].addClass(ActiveControlClass);
					}

					//判断滚动区域的最后一部分执行函数
					var wq_scroll_part_L = $('.' + wq_scroll_part).length;
			
					if (i == (wq_scroll_part_L - 1)) {
						var last_part_offset_top = every_part_top[i],
							last_part_H = $(this).height(),
							wq_scroll_nav_H = $('.' + wq_scroll_nav).height();
						
						if (scrollT > (last_part_offset_top + last_part_H - wq_scroll_nav_H)) {
							if (scrollOutArea && typeof scrollOutArea == 'function') {
								scrollOutArea();
							}
						}
					}
				});
			}
			$(window).on('scroll', function() {
				scrollPartEvent();
				if (whenInArea_call && typeof whenInArea_call == 'function') {
					whenInArea_call();
				}
			});
			$('.' + wq_scroll_navbar).click(function() {
				$('.' + wq_scroll_navbar).removeClass(ActiveControlClass);
				$(this).addClass(ActiveControlClass);
			});

			changeScrollpartStatus();

			return this;
		},
		/**
		 * radio plugin
	 	 */
		wqRadio: function() {
			return this.each(function() {
				var _this = $(this),
					dRadio = _this.attr('data-radio'),
					hidden = $(document.body).find('input[data-radio="' + dRadio + '"]'),
					clsName = 'wq_active_radio',
					dVal = _this.attr('data-value');
				_this.click(function() {
					var _this_ = $(this);
					if (_this_.hasClass(clsName))
						return;
					$(document.body).find('span.wq_active_radio[data-radio="' + dRadio + '"]').removeClass(clsName);
					_this_.addClass(clsName);
					hidden.val(dVal);
				});
			});
		},
		/**
		 * checkbox plugin
	 	 */
		wqCheckbox: function(opt) {
			var defaults = {
				clickEvent: $.noop()
			},
			opt = $.extend({}, defaults, opt);
			return this.each(function() {
				var _this = $(this),
					newNode,
					id = _this.attr('id'),
					val = _this.val(),
					checkboxName = _this.attr('name'),
					isCheck = _this.attr('checked') ? true : false;
				_this.hide();
				newNode = $(createNode(id, isCheck));
				newNode.insertBefore(_this);
				newNode = $(document).find('span[data-id="' + id + '"]');
				newNode.click(function() {
					var _this = $(this),
						target = $('#' + id);

					if (_this.hasClass('comp_active_checkbox')) {
						_this.removeClass('comp_active_checkbox');
						target.prop('checked', false);
						target.val('false');
					} else {
						_this.addClass('comp_active_checkbox');
						target.prop('checked', true);
						target.val('true');
					}
					if((typeof opt.clickEvent) == 'function'){
						opt.clickEvent();
					}
				});
			});
			function createNode(id, isCheck) {
				return '<span data-id="' + id + '" class="comp_checkbox ' + (isCheck ? 'comp_active_checkbox' : '') + '"><i></i></span>';
			}
		},
		/**
		 * placeholder plugin
	 	 */
		wqPlaceHolder: function(opt) {
			var defaults = {
				fontSize: '18px',
				lineHeight: '18px',
				height: '18px',
				placeHolderColor: '#aaa',
				top: 3,
				left: 5,
				inputTextColor: '#000',
				content: ''
			},
			opt = $.extend({}, defaults, opt);
			return this.each(function() {
				var spanHtml = $('<span class="wq_place_holder" style="position: absolute;top: 0;left: 0;vertical-align: middle;cursor: text;"></span>'),
					_this = $(this),
					offset = _this.offset(),
					_top = offset.top,
					_left = offset.left,
					relParent = opt.relParent || document.body;
				spanHtml.css({
					'position': 'absolute',
					'vertical-align': 'middle',
					'top': ((relParent == document.body) ? opt.top + _top : opt.top) + 'px',
					'left': ((relParent == document.body) ? opt.left + _left : opt.left) + 'px',
					'font-size': opt.fontSize,
					'line-height': opt.lineHeight,
					'height': opt.height,
					'color': opt.placeHolderColor
				}).html(opt.content).click(function() {
					_this.focus();
					$(this).hide();
				});
				$(relParent).append(spanHtml);
				_this.css({
					'color': opt.inputTextColor
				}).focus(function() {
					spanHtml.hide();
				}).blur(function() {
					if (!_this.val()) {
						spanHtml.show();
					}
				}).on('input', function() {
					if (!!_this.val()) {
						spanHtml.hide();
					}
				});
				if(relParent == document.body){	//相对于body定位的才需要监听resize事件
					$(window).resize(function() {
						offset = _this.offset(),
						_top = offset.top,
						_left = offset.left;
						spanHtml.css({
							'top': opt.top + _top  + 'px',
							'left': opt.left + _left + 'px'
						});
					});
				}
				if (_this.val()) {
					spanHtml.hide();
				}
			});
		},
		/**
		 * hover tips plugin == it is old, please don't use it anymore ==
	 	 */
		wqShowTips: function(opt) {
			var defaults = {
				width: 200,
				content: '',
				title: '信息提示',
				iconLeft: 95,
				direction: 'down',
				Cls: ''			//内容相同则可以通过相同的class名调用，内容不同则提供唯一的id或者class调用
			},
			opt = $.extend({}, defaults, opt);
			
			return this.each(function() {
				var _this = $(this),
					tipsHtml = $(),
					delay;

				if ($('.tips_' + opt.Cls).length) {
					tipsHtml = $('.tips_' + opt.Cls);
				} else {
					tipsHtml = $('<div class="wq_hover_tips_down tips_' + opt.Cls + '">\
									<p class="wq_tips_content_title">'+opt.title+'</p>\
									<i></i>\
									<p class="wq_tips_content">' + opt.content + '</p>\
								</div>');
				}
				tipsHtml.css('width', opt.width).appendTo($(document.body));
				tipsHtml.find('i').css('left', opt.iconLeft);
				$(document.body).append(tipsHtml);
				_this.hover(function() {
				    if (opt.content != $('.tips_' + opt.Cls).find('.wq_tips_content').text()){
					   $('.tips_' + opt.Cls).find('.wq_tips_content').html(opt.content);
					}
					var _this_ = $(this),
						offset = _this_.offset(),
						x = offset.left + _this_.width() - opt.width / 2 + 10, 
						y = offset.top + 30;

					delay = setTimeout(function() {
						tipsHtml.css({
							'left': x,
							'top': y
						}).fadeIn();
					}, 100);
				}, function() {
					clearTimeout(delay);
					tipsHtml.hide();
				});
			});
		},
		/**
		 * fill info and highlight
	 	 */
		wqConfirm: function(opt) {
			var defaults = {
				wrapper: '',		//class || id
				target: ''			//class || id
			},
			opt = $.extend({}, defaults, opt);
			return this.each(function() {
				var _this = $(this),
					val = _this.val(),
					_wrapper = $(opt.wrapper),
					_target = $(opt.target);
				if (val) {
					_target.html(val);
					_wrapper.show();
				}
				
				_this.bind("blur",function(){
				    var value = $.trim(_this.val());
					if (!value) {
						_wrapper.hide();
						return;
					}
					_target.html(value);
					_wrapper.show();
				});
				
				_this.keyup(function() {
					var value = $.trim(_this.val());
					if (!value) {
						_wrapper.hide();
						return;
					}
					_target.html(value);
					_wrapper.show();
				});
			});
		},
		/**
		 * activity dialog
	 	 */
		activityDialog: function(opts) {
			var defaults = {
				width: 300,
				height: 300,
				title: '活动说明',
				content: '活动内容',
				cls: ''
			};

			opts = $.extend({}, defaults ,opts);

			return this.each(function() {
				$(this).click(function() {
					if ($('.' + opts.cls).length) {
						$('.' + opts.cls).remove();
					}
					var width = opts.width,
						height = opts.height,
						_htmlTemplate = $('<div class="activity_mask_wrapper ' + opts.cls + '">\
							<div class="activity_mask"></div>\
							<div class="activity_dialog" style="width:' + width + 'px; margin-top:' + -height/2 + 'px; margin-left:' + -width/2 + 'px;">\
								<h1 class="acd_title"><i></i>' + (function(){
									if(typeof(opts.title) === "function"){
										return opts.title();
									}else{
										return opts.title;
									}
								})() + '<a class="activity_dialog_close_icon" href="javascript:;"></a></h1>\
								<div class="acd_content">' + (function(){
									if(typeof(opts.content) === "function"){
										return opts.content();
									}else{
										return opts.content;
									}
								})() + '</div>\
								<a class="btn btn_disable btn_w110 btn_h30 activity_dialog_close_btn" href="javascript:;">关闭</a>\
							</div>\
						</div>').appendTo(document.body);

					_htmlTemplate.on('click', '.activity_dialog_close_icon, .activity_dialog_close_btn, .activity_mask', function() {
						_htmlTemplate.hide();
					});
				});
			});
		}
	});

	/**
	 * @usage 	: woqu common slider
	 * @author 	: Frend
	 * @email	: xin.wang@woqu.com
	 * @date   	: 2014-07-09
	 */
	Slider = function(container, options) {
		/*
		options = {
			auto: true,
			time: 3000,
			event: 'hover' | 'click',
			mode: 'slide | fade',
			controller: $(),
			activeControllerCls: 'className',
			exchangeEnd: $.noop
		}
		*/

		"use strict";	//stirct mode not support by IE9-

		if (!container) return;

		var options = options || {},
			currentIndex = 0,
			cls = options.activeControllerCls,
			delay = options.delay,
			isAuto = options.auto,
			controller = options.controller,
			event = options.event,
			interval,
			slidesWrapper = container.children().first(),
			slides = slidesWrapper.children(),
			length = slides.length,
			childWidth = container.width(),
			totalWidth = childWidth * slides.length;

		function init() {
			var controlItem = controller.children();

			mode();

			event == 'hover' 
			? controlItem.mouseover(function() {
				stop();
				var index = $(this).index();

				play(index, options.mode);
			}).mouseout(function() {
				isAuto && autoPlay();
			}) 
			: controlItem.click(function() {
				stop();
				var index = $(this).index();

				play(index, options.mode);
				isAuto && autoPlay();
			});

			isAuto && autoPlay();
		}

		//animate mode
		function mode() {
			var wrapper = container.children().first();
			
			options.mode == 'slide' 
			? wrapper.width(totalWidth)
			: wrapper.children().css({
				'position': 'absolute',
				'left': 0,
				'top': 0
			})
			.first().siblings().hide();
		}

		//auto play
		function autoPlay() {
			interval = setInterval(function() {
				triggerPlay(currentIndex);
			}, options.time);
		}

		//trigger play
		function triggerPlay(cIndex) {
			var index;

			(cIndex == length - 1)
			? index = 0
			: index = cIndex + 1;
			play(index, options.mode);
		}

		//play
		function play(index, mode) {
			slidesWrapper.stop(true, true);
			slides.stop(true, true);
			
			mode == 'slide'
			? (function() {
				if (index > currentIndex) {
					slidesWrapper.animate({
						left: '-=' + Math.abs(index - currentIndex) * childWidth + 'px'
					}, delay);
				} else if (index < currentIndex) {
					slidesWrapper.animate({
						left: '+=' + Math.abs(index - currentIndex) * childWidth + 'px'
					}, delay);
				} else {
					return;
				}
			})()
			: (function() {
				if (slidesWrapper.children(':visible').index() == index) return;
				slidesWrapper.children().fadeOut(delay).eq(index).fadeIn(delay);
			})();

			try {
				controller.children('.' + cls).removeClass(cls);
				controller.children().eq(index).addClass(cls);
			} catch(e) {}

			currentIndex = index;

			options.exchangeEnd && typeof options.exchangeEnd == 'function' && options.exchangeEnd.call(this, currentIndex);
		}

		//stop
		function stop() {
			clearInterval(interval);
		}

		//prev frame
		function prev() {
			stop();
			
			currentIndex == 0
			? triggerPlay(length - 2)
			: triggerPlay(currentIndex - 2);
			
			isAuto && autoPlay();
		}

		//next frame
		function next() {
			stop();
			
			currentIndex == length - 1
			? triggerPlay(-1)
			: triggerPlay(currentIndex);
			
			isAuto && autoPlay();
		}

		//init
		init();

		//expose the Slider API
		return {
			prev: function() {
				prev();
			},
			next: function() {
				next();
			}
		}
	};

}(jQuery, window, document));
