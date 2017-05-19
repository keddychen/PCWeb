var wq = {};
/*
 *  woqu layer 
 * @params {string} title 标题
 * @params {string} content 内容
 * @params {boolearn} close 关闭按钮
 * @params {boolearn} cover 遮罩层
 * @params {number} width 宽度
 * @params {number} height 高度
 * @params {string}  innerHTML 弹层html结构，一般不做修改
 */
wq.layer = {
	param:{
		defaults:{
			title:null,
			content:'',
			close:true,
			ok:false,
			cancel:false,
			okfn:$.noop,
			cancelfn:$.noop,
			cover:true,
			width:null,
			height:null,
			innerHTML:[
				'<div class="wq_dialog">',
					'<div class="wq_dialog_title"></div>',
					'<div class="wq_dialog_content"></div>',
					'<div class="wq_dialog_close"></div>',
					'<div class="wq_dialog_cusp"></div>',
				'</div>'].join('')
		},
		elem:null,
		timer:null
	},
	create:function(opts){
		if(this.param.timer)clearTimeout(this.param.timer);
		if(this.param.elem)this.close();		
		opts.id = 'wq_dialog_'+ (new Date - 0);		
		var $this = this;
		var	options = $.extend({},$this.param.defaults,opts);
		var	$elem = $(options.innerHTML).appendTo($('body'));
		var backdrop;
		//set id
		$elem.attr('id', opts.id);
		$this.param.elem = $elem;	
		//cover
		if(options.cover){
			backdrop = $('<div class="wq_dialog_cover"></div>').appendTo($('body'));
			backdrop.on('click',function(){
				backdrop.hide().remove();
				$this.close();
				if(opts.closeCallBack)opts.closeCallBack();
			});
		}
		//关闭按钮
		if(options.close){
			$this._$('close')
			.on('click',function(){
				if(backdrop)backdrop.hide().remove();
				$this.close();
				if(opts.closeCallBack)opts.closeCallBack();
			}).show();
		}
		//title
		if(options.title){
			$this.title(options.title);
		}
		//content
		if(options.content){
			$this.content(options.content);		
		}
		//width
		if(options.width){
			$this.width(options.width);
		}
		//height
		if(options.height){
			$this.height(options.height);
		}
		//ok
		if(options.ok && typeof options.okfn === 'function'){
			$this._$('content').on( 'click' , options.ok , function(){
				$this.close();
				options.okfn();
			});	
		}
		//cancel
		if(options.cancel && typeof options.cancelfn === 'function'){
			$this._$('content').on( 'click' , options.cancel , function(){
				$this.close();
				options.cancelfn();
			});
		}
		return $this;		
	},
	dialog:function(opts){
		var $this = this;
		$this.create(opts).setDiaposi(opts).resize(opts);
		return $this;
	},
	hoverTip:function(target,opts,type){
		if(!target)return;
		var $this = this;
		opts.close = false;
		opts.cover = false;
		$this.create(opts).setHoverposi(target,type);
		$this.param.elem.hover(function(){
			if($this.param.timer)clearTimeout($this.param.timer);			
		},function(){
			$this.param.timer = setTimeout(function(){
				$this.close();
			},100);
		})	
		return $this;
	},
	_$:function(i){
		return this.param.elem.find('.wq_dialog_'+i);
	},
	content:function(v){
		this._$('content').html(v);
	},
	title:function(v){
		this._$('title').text(v).show();
	},
	width:function(v){
		this.param.elem.css('width',v);
	},
	height:function(v){
		this.param.elem.css('height',v);
	},
	show:function(){
		if(this.param.timer)clearTimeout(this.param.timer);
		this.param.elem.show();
	},
	close:function(time){
		var $this = this;
		if($this.param.timer)clearTimeout($this.param.timer);
		if(time){
			$this.param.timer = setTimeout(function(){
				$this.param.elem.hide().remove();
			},time);
		}else{
			$this.param.elem.hide().remove();
		}		
	},
	cusp:function(v){
		this._$('cusp').addClass(this._$('cusp').attr('class')+'_'+v);
	},
	setDiaposi:function(opts){
		var _content = this._$('content'),
	    	_W = this.param.elem.width(),
	    	_H = opts.height ? opts.height : this.param.elem.height(),
	    	_MAX_H = ($(window).height() > 900) ? 900 : $(window).height();
		if(_H > _MAX_H){
			this.param.elem.css({marginLeft:-_W/2,height:_MAX_H,marginTop:-_MAX_H/2});			
		}else{
			this.param.elem.css({marginLeft : -_W/2,marginTop  : -_H/2});
		}
		var _MAX_CH = this.param.elem.height() - (opts.title ? 40 : 0);
		 _content.css('height',_MAX_CH-40);
		_content.height() > _MAX_CH ? _content.css('overflowY','scroll') : _content.css('overflowY','auto');		
		return this;
	},
	setHoverposi:function(target,type){	
		this._$('content').css('padding','10px');
		var type = type || 'bottom';
		var	ow = this.param.elem.outerWidth();
		var	oh = this.param.elem.outerHeight();
		var	tw = $(target).outerWidth();
		var	th = $(target).outerHeight();
		var	winw = $(window).width();
		var	winh = $(window).height();
		var scrollTop = $(window).scrollTop();
		var	left = $(target).offset().left;
		var	top = $(target).offset().top;
		var	css = {position:'absolute',borderRadius:'4px',boxShadow:'0 0 2px #ccc'};
		css.left = ow/2  > (left + tw/2) ? 0 : left + tw/2 - ow/2;
		this._$('cusp').css('left',left - css.left + tw/2 - 7).show();
		if(type == 'bottom'){						
			//if(oh > winh + scrollTop - top - th){
			//	css.top = top - oh - 10;
			//	this.cusp('bottom');
			//}else{
				css.top = top + th + 10 ;
				this.cusp('top');
			//}		
		}else{			
			//if(oh > top - scrollTop){
			//	css.top = top + th + 10;
			//	this.cusp('top');
			//}else{
				css.top = top - oh - 10 ;
				this.cusp('bottom');
			//}
		}
		this.param.elem.css(css);	
		return this;
	},
	resize:function(opts){
		var $this = this;
		$(window).on('resize',function(){
			$this.setDiaposi(opts);
		})
		return this;
	}	
}

/*
 * woqu scrollWall 无缝左右切换
 * @params {element} box 外层dom节点
 * @params {number} size 展示的个数
 * @params {string} eventType 事件触发类型
 * @params {boolearn} auto 是否自动滑动
 * @params {boolearn} jump 指定页跳转
 * @params {function} callback 滑动后返回函数
 */
wq.scrollWall = function(opts){
	var options = $.extend({},{
		box:$('#scrollWall'),
		size:1,
		eventType:'click',
		auto:false,
		jump:false,
		callback:null
	},opts),
	$sw = options.box,
	$ul = $sw.find('[role="scrollwall-ul"]'),
	$li = $ul.find('[role="scrollwall-li"]'),
	$li_w = $li.outerWidth(true),
	$prev = $sw.find('[role="prev-btn"]'),
	$next = $sw.find('[role="next-btn"]'),
	_index = 0,
	_length = $li.length,
	_flag = false;
	$ul.append($ul.html()).css('width',$li_w*_length*2);
	var MODEL = {
		/**
         * 向上轮播
         */
		prev:function(){
			if(_flag)return;
			if(_index == 0){
				_index = _length;
				$ul.css('left',-_index * $li_w);
			}
			_index--;
			this.go();
		},
		/**
         * 向下轮播
         */
		next:function(){
			if(_flag)return;
			if(_index == _length*2 - options.size){
				_index = _length - options.size;
				$ul.css('left',-_index * $li_w);
			}
			_index++;
			this.go();
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
			_flag = true;
			$ul.stop().animate({left:-_index * $li_w},500,function(){
				if(options.callback && typeof options.callback == 'function'){options.callback(_index,$prev,$next);}
				_flag = false;
			});
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
			},time)
			return _Inter;
		}
	}	
	if(options.auto){
		//自动轮播
		var _setInter = MODEL.setInter(options.time);
        //停止自动轮播
		$sw.hover(function(){
			clearInterval(_setInter);
			_setInter = null;
		},function(){
			_setInter = MODEL.setInter(options.time);
		});
	}
    if(options.jump){
    	//jump
		$sw.find('[role="scrollwall-btn"]').on(options.eventType,function(){
			var _index = $sw.find('[role="scrollwall-btn"]').index($(this)[0]);
			 $sw.find('[role="scrollwall-btn"]').removeClass('current').eq(_index).addClass('current');
			MODEL.go(_index);
		});
    }	        
    //prev
    $prev.on('click',function(){
		MODEL.prev();
	});
	//next
    $next.on('click',function(){
		MODEL.next();
	})	
	return {
    	setIndex:function(num){
    		MODEL.go(num);
    	}
    }
}

/**
 * tab
 */
wq.tabControl=function(opts){
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
         
}

/**
 * photoWall
 */
wq.photoWall=function(options){
	var options = $.extend({},{
		box:$('#photoWall'),
		size:1,
		eventType:'click',
		auto:false,
		animate:false,
		jump:false,
		callback:null,
		time:5000
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
			}
			$PW.find('[role="photo-btn"]').removeClass('current').eq(_index).addClass('current');
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
		var _setInter = MODEL.setInter(options.time);
        //停止自动轮播
		$PW.hover(function(){
			clearInterval(_setInter);
			_setInter = null;
		},function(){
			_setInter = MODEL.setInter(options.time);
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

/*
 * mobile select init
 * */
wq.initMobileSelect = function(opts){
	var options = $.extend({},{
		box:$('#select'),
		li:null,
		evt:'change',
		selectChange:null
	},opts);
	var arr =[
     	{type:'mobileCN',country:'中国',code:'86'},
     	{type:'mobileUSA',country:'美国',code:'1'},
     	{type:'mobileCAD',country:'加拿大',code:'1'},
     	{type:'mobileAUD',country:'澳大利亚',code:'61'},
     	{type:'mobileNZD',country:'新西兰',code:'64'},
     	{type:'mobileHK',country:'香港',code:'852'},
     	{type:'mobileMacau',country:'澳门',code:'853'},
     	{type:'mobileTW',country:'台湾',code:'886'},
     	{type:'mobileUK',country:'英国',code:'44'},
     	{type:'mobileFrance',country:'法国',code:'33'},
     	{type:'mobileGermany',country:'德国',code:'49'},
     	{type:'mobileBelgium',country:'比利时',code:'32'},
     	{type:'mobileItaly',country:'意大利',code:'39'},
     	{type:'mobileSpain',country:'西班牙',code:'34'},
     	{type:'mobileSwiss',country:'瑞士',code:'41'},
     	{type:'mobileHolland',country:'荷兰',code:'31'},
     	{type:'mobileGreece',country:'希腊',code:'30'},
     	{type:'mobileNorway',country:'挪威',code:'47'}
     ],select = [];
	for(var i=0;i < arr.length ;i++){
		if(!options.li){
			select[i] = '<option value="'+arr[i].code+'" type="'+arr[i].type+'">+'+arr[i].code+'('+arr[i].country+')</option>';
		}else{
			select[i] = '<'+options.li+' data-value="'+arr[i].code+'" data-type="'+arr[i].type+'">+'+arr[i].code+'('+arr[i].country+')</'+options.li+'>';
		}
		
	}
	options.box.html(select.join(''));

	if(typeof options.selectChange == 'function'){
		if(!options.li){
			options.box.on('change',function(){
				options.selectChange(this);
			})
		}else{
			options.box.find(options.li).on(options.evt,function(){
				options.selectChange(this);
			})
		}	
	}
}