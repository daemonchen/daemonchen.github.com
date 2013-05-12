function footerNavigation(){
    // 语言选择
    $('#footer .footer-language').on('mouseenter', 'span', function(){
        $(this).prev().stop(true, true).slideDown('fast');
    });
    $('#footer .footer-language').on('mouseleave', function(e){
        $('.footer-language-list', this).stop(true, true).slideUp('fast');
    });
    // 分类列表导航
    $('#footer .footer-text-list').on('mouseenter', 'span', function(){
      $(this).parent().prev().find('ul').eq($(this).index()).stop(true, true).slideDown('fast')
        .siblings().stop(true, true).slideUp('fast'); 
    });
    $('#footer .footer-text-list').on('mouseleave', 'span', function(e){
      if ($(e.relatedTarget).closest('.footer-second-list').length == 0) $(this).parent().prev().find('ul').eq($(this).index()).hide(); 
    });
    $('#footer .footer-text').on('mouseleave', function(){
        $('.footer-second-list ul:not(:hidden)', this).slideUp('fast');
    });
}

function headerScroll(){
  // 顶部上拉条
  $('.header').on('mouseenter', '.idea-arrow', function(){
    $('.header-nav').slideDown('fast');
    // 此处结构效果有点特殊,所以在此初始化滚动条
    // 使用Data保证此效果类只执行一次
    if (!$(this).data('onEvent')){
      $(this).data('onEvent', true);
      // 实例化滚动条
      window['headerObj'] = customScroll({
        ctrEle: '#horscrollcontainer',
        listEle: '.nav-list',
        scrollEle: '.horScroll',
        direction: 'horzontal',
        adaptive: true
      });
    }
  });
  $('.header-nav').on({
    'mouseleave': function(){
      if (!$(this).data('isHide'))
          $(this).slideUp('fast');
    },
    'mousedown': function(){
      $(this).data('isHide', true);
      $(window).one('mouseup', function(e){
        $('.header-nav').removeData('isHide');
        $(e.target).closest('.header-nav').length || $('.header-nav').slideUp('fast');
      });
    }
  });
  // 处理窗口缩放时, 上拉条的状态
 /* $(window).on('load resize', function(){
    var window_w  = $(window).width(),
        container = $('.nav-wrap-content'),
        ltElement = $('.header-nav-img', container),
        rtElement = $('#horscrollcontainer', container),
        minWidth  = parseInt($(container).css('min-width'));
    window_w < minWidth && (window_w = minWidth);
    $('.header-nav').show();
    $(rtElement).width(window_w - ltElement.outerWidth(true));
    window['headerObj'] && window['headerObj'].refresh();
    $('.header-nav').hide();
  });*/
}


function adaptiveHeight(){
  $(window).on('load resize', function(){
    var wh = $(window).height(),
        hh = $('#container .header').outerHeight(true),
        fh = $('#footer').outerHeight(true),
        ch = $('#container > div.content').height(); 
        window_ch = wh - hh - fh;

    if (ch < window_ch){
        // 只有中间内容实际显示区域小于窗口高度才作垂直居中操作
        // 43 是此元素的小间距, 至少要与顶部隔开43px
        $('#container > div.content .content-all').css('margin-top', (window_ch - ch) / 2 + 43);
    }


    ch = ch < window_ch ? window_ch : ch;
    // 左右按钮垂直居中
    var buttonElement = $('.content-prev,.content-next'),
        button_h = $(buttonElement).height(),
        button_t = (ch - button_h) / 2;
    // - 47, 指不将底部导航计算在内
    $(buttonElement).css('top', button_t);
  });
}
$('.footer-text-list span').hover(
	function(){$(this).addClass('on')},
	function(){$(this).removeClass('on')}
)