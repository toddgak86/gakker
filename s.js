/* usage 
// var s=window.document.createElement("script");s.type="text/javascript";s.src="https://raw.github.com/toddgak86/gakker/master/s.js";window.document.body.appendChild(s); */

(function() {

	new (function() {
		
		var self = this,
	        styleTag = null,
	        styleActive = false,
	        togglerStyleTag = null,
	        dialog = null,
	        mover = null,
	        likables = [],
	        totalLikes = 0,
	        likeDialogHolder = null,
	        $ = window.jQuery || null;

	    var ready = function () {
	        $ = window.jQuery;
	        $(function () {
	            window.already_set = true;
	            var togglerStyleTag = $('<style id="cp-style"></style>').html(getNewCss());	
	            $('body').append(togglerStyleTag);
				$('head').append('<link rel="shortcut icon" href="/favicon.png" type="image/png">');
				$('title').text('Yahoo! News');
				$('#pagelet_side_ads').remove();
				$('#pagelet_ego_pane_w').remove();
				$('.fbChatSidebar').remove();
	        });
	    }
	
	    var getNewCss = function () {
	        return 'html{color:#000!important;background:#f8f8f8!important}body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,span,a{color:#333!important;background:#f8f8f8!important;background-image:none;border:0;box-shadow:none!important;text-shadow:none!important;font-size:12px; font-weight:300; font-family: \'Arial\';border-color:#ccc!important}a,a:hover,a:link{text-decoration:underline!important;color:#317FBF!important;}img {opacity:.1;} img:hover, a:hover img{opacity:1;}';
	    }
	
		var init = function () {
	        if (window.already_set) return false;
	        if ($ === null) {
	            var js = document.createElement('script');
	            js.type = 'text/javascript';
	            js.src = '//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js';
	            js.onload = ready;
	            document.body.appendChild(js);
	        } else {
	            ready();
	        }
	        return self;
	    }
	
	    return init();
		
	})();

})();
