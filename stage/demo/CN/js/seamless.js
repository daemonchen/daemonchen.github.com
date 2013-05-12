function seamless(ctr, opt){
	var cfg = {
		'container': ctr,			// 效果类结构总容器
		'elements' : '',			// 效果类的主体结构对象
		'triggers' : '',			// 触点元素,点击元素滚动至对应处
		'visibles' : 5,				// 当前显示的个数
		'scrolls'  : 1,				// 滚动的元素个数
		'focus'	   : 'cur', 		// 当元素获取焦点时应用的样式
		'direction': 'horizontal',	// 元素滚动的方向	垂直 vertical
		'prev'	   : '',			// 上一个的按钮
		'next'     : '',			// 下一个的按钮
		'inside'   : false, 		// 判断按钮是否在容器内查找
		'auto'	   : 0,				// 是否自动播放
		'speed'	   : 'fast',		// 动画播放速度
		'elementsEvent': 'click',	// 滚动元素是否追加事件(滚动至当前元素),默认为点击触发,如果不需要则传入 null|false
		'preventDefault': true,		// 是否阻止默认动作(超链接默认跳转)
		'listeners': {}, 			// 事件
		'adaptive' : false			// 是否开启焦点图自适应
	};
	$.extend(cfg, opt);
	// 将参数转成必要的DOM对象
	var _container = $(cfg.container),				// 主容器对象
		_elements  = $(cfg.elements, _container),	// 滚动元素列表
		_triggers  = $(cfg.triggers, _inside ? _container : document.body),
		_visibles  = cfg.visibles,					// 当屏显示元素个数
		_scrolls   = cfg.scrolls,					// 一次滚动多少个
		_focus     = cfg.focus, 					// 滚动时切换的class
		_direction = cfg.direction,					// 元素滚动的方向
		_inside	   = cfg.inside,					// 用于在获取上下(左右)按钮时,是否在容器内部查找(默认不在容器内部查找)
		_prev	   = $(cfg.prev, _inside ? _container : document.body),	// 上一项按钮
		_next      = $(cfg.next, _inside ? _container : document.body),	// 下一项按钮
		_elementsEvent  = cfg.elementsEvent,		// 指定元素列表追加事件
		_preventDefault = cfg.preventDefault,		// 在元素列表追加的事件中是否阻止元素默认动作
		_auto	   = cfg.auto,						// 是否开启自动播放
		_speed	   = cfg.speed,						// 动画的执行速度
		_listeners = cfg.listeners;					// 自定义回调管理对象
	var length	 = _elements.length,					// 列表元素总个数
		curIndex = length,								// 初始化时的当前索引
		listItemParent = _elements.parent(),			// 列表元素的父对象
		animateElement = _elements.parent().parent(),	// 执行滚动动作的容器对象
		isHorizontal   = _direction == 'horizontal',	// 是否是水平滚动
		scrollString   = isHorizontal ? 'scrollLeft' : 'scrollTop',	// 当前滚动的方式
		once = _elements.first()[isHorizontal ? 'outerWidth' : 'outerHeight'](true),	// 一次滚动的距离
		newElementList,		// 无疑滚动结构初始化后的列表元素集合
		interval;			// 定时器对象
	var _this = this;
	// 初始化函数
	_this.init = function(){
		// 在原有列表的前后复制一份,以达到无缝滚动的效果
		listItemParent.prepend(_elements.clone(true).removeClass(_focus)).append(_elements.clone(true).removeClass(_focus));
		
		// 获取最新的滚动元素列表
		newElementList = listItemParent.children();
		if (isHorizontal){
			cfg.adaptive && (once = $(window).width());
			// 结构复制完成后,设置其宽度, 只有水平滚动才需要
			listItemParent.width(length * 3 * once);
			newElementList.width(once);
		}
		// 初始化位置
		animateElement[scrollString](curIndex * once);
		// 处理设定的滚动数是否大于一屏的显示总个数
		_scrolls > _visibles && (_scrolls = _visibles);
		// 返回当前函数本身
		return arguments.callee;
	}();

	_this.resize = function(){
		once = $(window).width();
		var minWidth = parseInt(newElementList.css('min-width'));
		once < minWidth && (once = minWidth);
		if (isHorizontal){
			listItemParent.width(length * 3 * once);
			newElementList.width(once);
			animateElement[scrollString](curIndex * once);
		}
	}
	cfg.adaptive && $(window).on('resize', _this.resize);

	// 设置样式至当前位置
	_this.toggleClass = function(i){
		$(newElementList).removeClass(_focus).eq(i).addClass(_focus);
	}
	// 滚动方法 => 滚动于当前索引处
	_this.moveTo = function(i){
		// 调用执行回调方法
		_listeners.begin && _listeners.begin.call(_this, i);
		// 滚动动画开始执行
		// 因为json对象的key无法直接以变量传递,所以需要用此方式
		var animateManage = {};
		animateManage[scrollString] = i * once;
		$(animateElement).stop(true, true).animate(animateManage, {'duration': _speed, 'complete': function(){
			// 此处为动画执行完毕后所调用的回调函数
			if (i < length){
				// 表示向上滚动, 如果滚动到头了, 则让其跳转到最后一个元素后对应的位置
				curIndex = length * 2 - 1;
				$(animateElement)[scrollString](curIndex * once);
			}
			else if (i > length * 2 - 1){
				// 表示向下滚动, 如果滚动到尾了, 则让其跳转到第一个元素前对应的位置
				curIndex = i - length;
				$(animateElement)[scrollString](curIndex * once);
			}
			// 设置当前元素的选中样式
			_this.toggleClass(curIndex);	
			// 调用执行回调方法
			_listeners.done && _listeners.done.call(_this, curIndex, i);
		}});
	}
	// 滚动至上一个
	_this.prev = function(e){
		e.preventDefault();
		// 如果当前动画未结束, 则不执行
		// animateElement 执行动画的元素
		if (animateElement.filter(':animated').length > 0) return false;
		curIndex -= _scrolls;
		_this.moveTo(curIndex);
	}
	// 滚动至下一个
	_this.next = function(e){
		e.preventDefault();
		// 如果当前动画未结束, 则不执行
		// animateElement 执行动画的元素
		if (animateElement.filter(':animated').length > 0) return false;
		curIndex += _scrolls;
		_this.moveTo(curIndex);
	}
	// 开启自动播放
	_this.start = function(){
		if (_auto){
			interval = setInterval(_this.next, _auto);
		}
	}
	// 中止自动播放
	_this.stop = function(){
		clearInterval(interval);
		// 停止定时器调用上面方法就行了
		// 此处赋值是为下面委托hover使用,
		// 因为即使定时器清除了, 其返回值不为空, 为内存中为当前定时器分配的一个ID
		interval = null;
	}
	// 用于绑定用户自定义回调函数, 如: begin  done
	// type: 	函数名称
	// fn: 		函数主体
	_this.on = function(type, fn){
		_listeners[type] = fn;
	}
	// 可以在任意的地方调用自定义函数
	// type:　函数名称
	_this.fire = function(type){
		_listeners[type] && typeof _listeners[type] == 'function' && _listeners[type].call(_this);
	}

	_prev.bind({
		'click': _this.prev,
		'mouseenter': _this.stop,
		'mouseleave': _this.start
	});
	_next.bind({
		'click': _this.next,
		'mouseenter': _this.stop,
		'mouseleave': _this.start
	});

	// 滚动的元素是否追加事件处理
	// 由于考虑到列表元素数量数题,此处采用委托处理
	if (_elementsEvent){
		$(listItemParent).delegate('li', _elementsEvent, function(e){
			_preventDefault && e.preventDefault();
			curIndex = $(this).index();
			_this.moveTo(curIndex);
		});
		$(_triggers).parent().on('click', 'li', function(e){
			_preventDefault && e.preventDefault();
			curIndex = $(this).index() + length;
			_this.moveTo(curIndex);
		});
		listItemParent.delegate('li', 'hover', function(){
			// 在委托中, hover 只能指定这一个函数
			// 需要在此处处理 mouseenter  mouseleave 时所执行的代码
			// 开启了自动播放才处理 => 如果当前是关闭的则开启, 否则停止
			_auto && (interval ? _this.stop() : _this.start());
		});
	}
	// 效果类实例完成后,处理自动播放
	_auto && _this.start();
}