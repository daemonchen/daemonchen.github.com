function customScroll(opt){
    var cfg = {
        'ctrEle': '',               // 包括整个滚动区域的主容器对象
        'listEle': '',              // 内容区域元素对象
        'scrollEle': '',            // 滚动条区域元素对象
        'offset': 0,                // 两个按钮的宽/高,用于计算可拖动区域的有效范围,默认22px
        'adaptive': false,          // 是否自适应 
        'direction': 'vertical'     // 滚动条的方向,默认垂直滚动
    };
    $.extend(cfg, opt);

    var ctr = $(cfg.ctrEle),           // 获取主容器对象
        listEle = $(cfg.listEle, ctr),      // 获取内容区域对象
        scrollEle = $(cfg.scrollEle, ctr),  // 获取滚动区域对象     
        dragElementCollection = scrollEle.children(),     // 拖动区域的所有对象（两按钮和拖动层）
        dragPrev = dragElementCollection[0],            // 向上（向左）按钮对象
        dragLayer = dragElementCollection[1],           // 拖动层对象
        dragNext = dragElementCollection[2],            // 向下（向右）按钮对象
        ctrPoint,       // 主容器的绝对坐标
        limit,     // 拖动的有效区域
        myInter,        // 定时器
        moveing,        // 移动的距离
        isVertical = cfg.direction == 'vertical';       // 是否是垂直滚动
    var xy = isVertical ? 'y' : 'x', 
        lt = isVertical ? 'top' : 'left',
        exy = isVertical ? 'clientY' : 'clientX',
        swh = isVertical ? 'scrollHeight' : 'scrollWidth',
        owh = isVertical ? 'offsetHeight' : 'offsetWidth',
        slt = isVertical ? 'scrollTop' : 'scrollLeft';
    var os = cfg.offset, min = os, max = scrollEle[0][owh] - dragLayer[owh] - os;

    // 获取主窗口坐标
    ctrPoint = $(ctr).offset();
    // 获取拖动的有效区域
    limit = [min, max];
    var fn = {
        'isDown': false,    // 鼠标是否按下
        'isDrag': false,    // 拖动层是否处于拖动中
        'downPoint': {},    // 鼠标按下时相对拖动层的坐标
        'target': null,     // 事件响对象,当前拖动的对象
        'isExecute': true,  // 是否允许拖动
        'allowScroll': function(){
            if (isVertical){
                var container_h = $(listEle).height(),
                    content_h = $(listEle).children().height();
                if (container_h >= content_h) {
                    $(dragLayer).height(container_h - cfg.offset * 2);
                    fn.isExecute = false;
                } else {
                    fn.isExecute = true;
                }
            } else {
                var container_w = $(listEle).width(),
                    content_w = 0;
                $(listEle).children().children().each(function(){
                    content_w += $(this).width();
                });
                if (container_w >= content_w) {
                    $(dragLayer).width(container_w - cfg.offset * 2);
                    fn.isExecute = false;
                } else {
                    fn.isExecute = true;
                }
            }
        },
        'init': function(){
            if (isVertical){
                $(listEle).scrollTop(0);
            } else {
                $(listEle).scrollLeft(0);
                var fullEle = $(listEle).children(),        // 滚动区域的容器对象
                    allListItem = $(fullEle).children(),    // 滚动区域的列表元素
                    renderWidth = 0,
                    isHidden = $(ctr).filter(':hidden').length;
                $(allListItem).each(function(){
                    renderWidth += $(this).outerWidth(true);
                });
                $(fullEle).width(renderWidth);
            }
        },
        'mousedown': function(e){
            if (!fn.isExecute) return;
            fn.isDown = true;
            fn.target = e.srcElement || e.target;
            // 用于处理当前页面存在多个实例造成冲突的现象
            if (fn.target !== dragLayer) return;
            // 当鼠标按下时,获取鼠标相对坐标
            fn.downPoint.x = e.offsetX || e.originalEvent.layerX;
            fn.downPoint.y = e.offsetY || e.originalEvent.layerY;

            // 添加事件监听
            $(document).on('mousemove', fn.mousemove);
            $(document).on('mouseup', fn.mouseup);
        },
        'mousemove': function(e){
            if (fn.isDown && fn.target){
                fn.isDrag = true;
                var _scrollDistance = Math.max(document.body[slt], document.documentElement[slt]);
                // 移动坐标 = 当前坐标 - 主容器绝对坐标 - 鼠标相对拖动层距离
                moveing = e[exy] + _scrollDistance - ctrPoint[lt] - fn.downPoint[xy];

                // 处理有效区域的限制
                moveing < limit[0] && (moveing = limit[0]);
                moveing > limit[1] && (moveing = limit[1]);
                fn.scrollTo(moveing);
                // 取消页面的对象的选中状态
                !+"\v1"? document.selection.empty() : window.getSelection().removeAllRanges();
            }
        },
        'mouseup'  : function(e){
            fn.isDown = false;
            fn.isDrag = false;
            // 移除事件监听
            $(document).off('mousemove', fn.mousemove);
            $(document).off('mouseup', fn.mouseup);
        },
        'scrollTo': function(move){
            // 处理需要设置的样式属性 lt => left|top
            var opt = {};
            opt[lt] = move + 'px';
            // 设置拖层样式
            // setCss(dragLayer, opt);
            $(dragLayer).css(opt);
            /**
             * []: 里面指定内容以 | 分割,表示或者
             * 内容滚动距离 = (内容总[高度|宽度] - 内容可见[高度|宽度]) * (拖层当前移动距离 - [上面|左边]按钮有效[高度|宽度]) / (拖层有效[高度|宽度])|(拖层区域总[高度|宽度] - 两按钮[高度|宽度] - 拖层[高度|宽度])
            **/
            $(listEle)[slt](Math.ceil(($(listEle).children()[0][swh] - $(ctr)[0][owh]) * (move - limit[0]) / ($(scrollEle)[0][owh] - limit[0] * 2 - $(dragLayer)[0][owh])));
        },
        'prev': function(){
            myInter = setInterval(function(){
                var curMove = parseInt(dragLayer.style[lt]) || limit[0];
                --curMove < limit[0] && (curMove = limit[0]);
                fn.scrollTo(curMove);
            }, 30);
        },
        'next': function(){
            myInter = setInterval(function(){
                var curMove = parseInt(dragLayer.style[lt]) || limit[0];
                ++curMove > limit[1] && (curMove = limit[1]);
                fn.scrollTo(curMove);
            }, 30);
        },
        'stop': function(){
            clearInterval(myInter);
        }
    };
    // if (fn.allowScroll()) return;
    // 初始化
    fn.init();


    // 给相应对象添加事件
    $(document).on('mousedown', fn.mousedown);  // 拖动元素鼠标按下事件
    $(dragPrev).on('mousedown', fn.prev);         // 向上（向左）按钮鼠标按下事件
    $(dragPrev).on('mouseup', fn.stop);           // 向上（向左）按钮鼠标弹起事件
    $(dragNext).on('mousedown', fn.next);         // 向下（向右）按钮鼠标按下事件
    $(dragNext).on('mouseup', fn.stop);           // 向下（向右）按钮鼠标弹起事件

    return {
        'refresh': fn.allowScroll
    }
}