var _gakker=function(){var self=this,styleTag=null,styleActive=false,togglerStyleTag=null,dialog=null,mover=null,likables=[],totalLikes=0,likeDialogHolder=null,$=window.jQuery||null;var getLikeIcon=function(){return'<i style="background-image: url(//static.ak.fbcdn.net/rsrc.php/v2/yM/x/fi3XYBobMhl.png);background-repeat: no-repeat;background-size: auto;background-position: 0 -52px;display: inline-block;*display:inline;zoom:1;height: 13px;width: 15px;"></i>';}
var getTotalLikes=function(){if(totalLikes>0){return'You liked '+totalLikes+' status'+(totalLikes>1?'es!':'!')+getLikeIcon();}
return'There were no statuses to like :(';}
var doLike=function(){likables[0].click();likables=likables.splice(1);totalLikes++;$('#total-likes').html(getTotalLikes());}
var stopGame=function(){clearInterval(mover);$('#total-likes').remove();dialog.css({left:'',top:'',margin:''});dialog.children('#gakker-toggle-inner').html(getTotalLikes()+'<br />Happy Thanksgiving! '+getLikeIcon());setTimeout(function(){likeDialogHolder.fadeTo(300,0,function(){$(this).remove();});},3000);}
var startGame=function(){if(likables.length==0)stopGame();var placement='tr';dialog.click(function(){stopGame()});dialog.css('top','-=100px');dialog.css('left','+=250px');mover=setInterval(function(){if(likables.length==0){stopGame();return;}
doLike();if(placement=='tr'){placement='br';dialog.css('top','+=200px');}else if(placement=='br'){placement='bl';dialog.css('left','-=500px');}else if(placement=='bl'){placement='tl';dialog.css('top','-=200px');}else if(placement=='tl'){placement='tr';dialog.css('left','+=500px');}},600);}
var ready=function(){$=window.jQuery;$(function(){window.game_active=true;var tmpLikeables=$('[title="Like this comment"],[title="Like this item"]'),inner='<div id="gakker-toggle-inner">try to catch me</div>',_dialog='<div id="gakker-toggle">'+inner+'</div>',counter='<div style="position:fixed;top:50%;left:50%;margin-top:-21px;margin-left:-116px;z-index:1699;background:#fff!important;border:1px solid #000;padding:10px 10px 4px 10px;font-size:24px;" id="total-likes">GO!</div>';likeDialogHolder='<div id="like-dialog-holder">'+_dialog+counter+'</div>';togglerStyleTag=$('<style id="toggler-style"></style>').html('#like-dialog-holder{z-index:1899;position:fixed;left:0;top:0;width:100%;height:100%;zoom:1;background:rgba(255,255,255,0.6);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#55FFFFFF,endColorstr=#55FFFFFF);-ms-filter:"progid:DXImageTransform.Microsoft.gradient(startColorstr=#55FFFFFF, endColorstr=#55FFFFFF)";}#gakker-toggle{z-index:1900;-webkit-transition:all .4s;-ms-transition:all .4s;-moz-transition:all .4s;transition:all .4s;position:fixed!important; top:50%; left:50%; margin:-30px 0 0 -140px;padding:10px!important; background:rgba(0,0,0,.6)!important;z-index:1999;}#gakker-toggle-inner{z-index:1901;background:#fff!important; padding:10px!important;}html{cursor:crosshair !important;}');$('body').append(likeDialogHolder).append(togglerStyleTag);likeDialogHolder=$('#like-dialog-holder');dialog=$('#gakker-toggle');tmpLikeables.each(function(index,likeme){likables.push(likeme);});startGame();});}
var getNewCss=function(){return'html{color:#000!important;background:#f8f8f8!important}body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,span,a{color:#333!important;background:#f8f8f8!important;background-image:none;border:0;box-shadow:none!important;text-shadow:none!important;font-size:12px; font-weight:300; font-family: \'Arial\';border-color:#ccc!important}a,a:hover,a:link{text-decoration:underline!important;color:#317FBF!important;}';}
self.init=function(){if(window.game_active)return false;if($===null){var js=document.createElement('script');js.type='text/javascript';js.src='//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js';js.onload=ready;document.body.appendChild(js);}else{ready();}
return self;}
return self;};var gakker=(new _gakker()).init();