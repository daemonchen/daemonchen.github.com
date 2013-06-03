(function($) {
$.fn.extend({
	fillParent:function(params){
	params = $.extend({

			minWidth : 0,
			minHeight : 0,
			align : 'both'

		}, params);
		return this.each(function() {
			var elem = $(this);
			var newposition = null;
			var ratio = 0;
			var parent = elem.parent();

			elem.css({
				'position' : 'absolute'
			});

			if(parent.css('position') != "absolute") {

				parent.css({
					'position' : 'relative',
					'overflow' : 'hidden',
					'z-index' : '0'
				});

			} else {

				parent.css({
					'overflow' : 'hidden',
					'z-index' : '0'
				});

			}

			var onResize = function() {
				var parentWidth = Math.max(parent.width(), params.minWidth), parentHeight = Math.max(parent.height(), params.minHeight);

				if((parentWidth / ratio) > parentHeight) {

					elem.width(parentWidth + 2);
					elem.height(parentWidth / ratio);

				} else {

					elem.height(parentHeight);
					elem.width((parentHeight * ratio) + 2);

				}

				switch(params.align) {

					case 'horizontal':

						elem.css({

							'position' : 'absolute',
							'z-index' : '0',
							left : '50%',
							marginLeft : -(($(this).width() / 2) + 2) + 'px'

						});

						break;

					case 'vertical':

						elem.css({

							'position' : 'absolute',
							'z-index' : '0',
							top : '50%',
							marginTop : -($(this).height() / 2) + 'px'

						});

						break;

					case 'both':

						elem.css({

							'position' : 'absolute',
							'z-index' : '0',
							left : '50%',
							top : '50%',
							marginLeft : -(($(this).width() / 2) + 2) + 'px',
							marginTop : -($(this).height() / 2) + 'px'

						});

						break;

				}

			}
			if(elem.is('img')) {
				var img = new Image();
				function getRatio() {
					ratio = img.width / img.height;
					$(window).resize();
				}
				$(img).bind('load', getRatio);
				img.src = elem[0].src;

				elem.each(function() {
				    if(this.complete)
				        $(this).load();
				 });

				/*
				 elem.bind('load', function() {
				 ratio = this.width / this.height;
				 $(window).resize();
				 }).each(function() {
				 if(this.complete)
				 $(this).load();
				 });*/


			} else {
				ratio = elem.width() / elem.height();
			}

			$(window).bind('resize', onResize).resize();
			/*$(window).resize(function(){
				console.error('sdf');
				onResize();
			});*/

			if($('body').hasClass('ipad')) {

				window.onorientationchange = function() {
					onResize();

				}
			}

		});
		
	}
})
	
})(jQuery);