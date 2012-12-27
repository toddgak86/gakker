var miniFeed;
var lastFeedLength;
var timerRoutine;
var nbAttempt = 0;
var r = 0;
var aStoryNodes;
var totalDeleted = 0;
var working = false;

function simulateClick(elm) {
	if (elm.dispatchEvent) {
		var evt = document.createEvent("MouseEvents");
		evt.initEvent("click", true, true);
		elm.dispatchEvent(evt);
	} else {
		elm.click();
	}
}

function goClean()
{
	if (confirm("Be careful, it will definitely erase your posts.\nDo you want to continue ?")) {
		getMiniFeed();
		document.getElementById('cmw_statsContent').style.display = '';
	}
}

function stopCleaning()
{
	document.getElementById('cmw_goButton').disabled = '';
	document.getElementById('cmw_stopButton').disabled = 'disabled';
	document.getElementById('cmw_infosdiv').style.display = 'none';
	document.getElementById('cmw_warningdiv').style.display = '';
	document.getElementById('cmw_statusMsg').innerHTML = 'Cleaning stopped !';
	window.clearTimeout(timerRoutine);
}

function endCleaning()
{
	stopCleaning();
	document.getElementById('cmw_statusMsg').innerHTML = 'Cleaning finished !';
}

function closeCleaning()
{
	stopCleaning();
	var clDiv = document.getElementById('cleanupModalDiv');
	document.body.removeChild(clDiv);
}
 
function submitPopDelete()
{
	var aInputs = document.getElementById('pop_content').getElementsByTagName('input');
	for (var i = 0; i < aInputs.length; i++) {
		if (aInputs[i].name == "ok") {
			var submitButton = aInputs[i];
			simulateClick(submitButton);
			totalDeleted++;
			document.getElementById('cmw_nbTotalDeleted').innerHTML = totalDeleted;
			working = false;
		}
	}
}

var waitingPopDelete = true;
function clickDelete(crossLink)
{
	if (document.getElementById('pop_content')) {
		waitingPopDelete = false;
		submitPopDelete();
	} else {
		simulateClick(crossLink);
	}
	
	if(waitingPopDelete) {
		window.setTimeout(function() {
			clickDelete(crossLink);
        }, 2000);
	}
}

var waitingDeleteSubMenu = true;
function getDeleteSubMenu(crossLink)
{
	var checkSubMenu = crossLink.parentNode.getElementsByTagName('div');
	if (checkSubMenu.length > 0) {
		waitingDeleteSubMenu = false;
		
		var ulSubMenu = checkSubMenu[0].getElementsByTagName('div')[0].getElementsByTagName('ul')[0];
		var rmLink = ulSubMenu.getElementsByTagName('a');
		if(rmLink.length > 0) {
			for(var i=0; i < rmLink.length; i++) {
				linkAtt = rmLink[i].getAttribute('ajaxify');
				if (linkAtt) {
					if (linkAtt.indexOf('remove') > -1) {
						clickDelete(rmLink[i]);
						i = rmLink.length;
					}
				}
			}
		}
	} else {
		simulateClick(crossLink);
	}
		
	if(waitingDeleteSubMenu) {
		window.setTimeout(function() {
			getDeleteSubMenu(crossLink)
        }, 2000);
	}
}

function deletePost(storyNode)
{
	var zNodes = storyNode.getElementsByTagName('a');
    for (var i = 0; i < zNodes.length; i++) {
		if ((zNodes[i].className.indexOf('uiCloseButton') > -1) || (zNodes[i].className.indexOf('uiSelectorButton') > -1)) {
			var crossLink = zNodes[i];
			if (crossLink.className.indexOf('uiSelectorButton') < 0) {
				clickDelete(crossLink);
			}
			else {
                getDeleteSubMenu(crossLink);
            }
			i = zNodes.length;
		}
	}
}

function searchOlderPosts()
{
	var bottomPageLinks = document.getElementById('profile_pager').getElementsByTagName('a');
	if (bottomPageLinks.length > 0) {
		for (var i = 0; i < bottomPageLinks.length; i++) {
			if (bottomPageLinks[i].className.indexOf('uiMorePagerPrimary') > -1) {
				document.getElementById('cmw_statusMsg').innerHTML = 'Searching for older posts... <img src="http://cleanmywall.netbew.com/cmw/wait.gif" align="absmiddle" border="0" />';
				simulateClick(bottomPageLinks[i]);
				return true;
			}
		}
		return false;
	} else {
		return false;
	}
}

function cleanRoutine()
{
	if (working == false) {
		
		if (document.getElementById('pop_content')) {
			
			submitPopDelete();
			
			window.clearTimeout(timerRoutine);
			timerRoutine = window.setTimeout(function(){
				cleanRoutine();
			}, 2000);
		}
		else {
			working = true;
			waitingDeleteSubMenu = true;
			waitingPopDelete = true;
			
			if (r < aStoryNodes.length) {
				var storyNode = aStoryNodes[r];
				deletePost(storyNode);
				document.getElementById('cmw_nbCurrentlyCleaning').innerHTML = (r + 1);
				
				window.clearTimeout(timerRoutine);
				timerRoutine = window.setTimeout(function(){
					cleanRoutine();
				}, 5000);
				
				r++;
			}
			else {
				
				searchOlderPosts();
				window.clearTimeout(timerRoutine);
				timerRoutine = window.setTimeout(function(){
					getMiniFeed();
				}, 8000);
				
				working = false;
			}
		}
	} else {
		window.clearTimeout(timerRoutine);
		timerRoutine = window.setTimeout(function(){
			cleanRoutine();
		}, 1000);
	}
    return true;
}

function getMiniFeed()
{
	document.getElementById('cmw_stopButton').disabled = '';
	document.getElementById('cmw_goButton').disabled = 'disabled';
	document.getElementById('cmw_infosdiv').style.display = '';
	document.getElementById('cmw_statusMsg').innerHTML = 'Cleaning, please wait... <img src="http://cleanmywall.netbew.com/cmw/wait.gif" align="absmiddle" border="0" />';
	document.getElementById('cmw_warningdiv').style.display = 'none';
	
    r = 0;
    aStoryNodes = new Array();
    var feedNodes = miniFeed.childNodes;
	lastFeedLength = feedNodes.length;
	document.getElementById('cmw_nbWallPosts').innerHTML = '--';
	document.getElementById('cmw_nbCurrentlyCleaning').innerHTML = '--';
	
	if (feedNodes.length > 0) {
		
		var slcFrom = document.getElementById('cmw_slcfrom');
		var beginIndex = parseInt(slcFrom.options[slcFrom.selectedIndex].value);
		
		if (feedNodes.length <= beginIndex) {
			if(searchOlderPosts()) {
				window.clearTimeout(timerRoutine);
				timerRoutine = window.setTimeout(function(){
					var testRecup = miniFeed.childNodes.length;
					if (testRecup > lastFeedLength) {
						getMiniFeed();
					}
					else {
						if (nbAttempt < 3) {
							nbAttempt++;
							getMiniFeed();
						} else {
							endCleaning();
						}
					}
				}, 8000);
			} else {
				endCleaning();
			}
		}
		else {
			
			for (var i = beginIndex; i < feedNodes.length; i++) {
				var zNode = feedNodes[i];
				
				if (zNode.className.indexOf('uiStreamMinistoryGroup') > -1) {
					var sNodes = zNode.childNodes[1].childNodes;
					for (var j = 0; j < sNodes.length; j++) {
						var storyNode = sNodes[j];
						aStoryNodes.push(storyNode);
					}
				}
				else {
					var storyNode = zNode;
					aStoryNodes.push(storyNode);
				}
			}
			
			if (aStoryNodes.length > 0) {
				document.getElementById('cmw_nbWallPosts').innerHTML = aStoryNodes.length;
				cleanRoutine();
			}
			else {
				endCleaning();
			}
		}
		
	} else {
		endCleaning();
	}

    return true;
}

function apppendModalDiv()
{
	window.scrollTo(0, 0);
	var modalDiv = '<div style="position: absolute; margin-top: 40px; z-index: 500; width: 100%">';
			modalDiv += '<div style="height: 1000px; opacity:0.9; filter:alpha(opacity=90); background: #F3F3F3; padding: 20px;">';
				modalDiv += '<div style="width: 700px; margin-left: auto; margin-right: auto; margin-top: 45px; position: relative;" id="cmw_divcontent">';
	
					modalDiv += '<div style="text-align: center; font-size: 18px; font-weight: bold;">';
						modalDiv += '<a href="http://cleanmywall.netbew.com/index.en.html" title="Clean My Wall" target="_blank"><img src="http://cleanmywall.netbew.com/cmw/cleanmywall.gif" width="140" height="75" alt="Clean My Wall" title="Clean My Wall" border="0" align="absmiddle" /></a>';
						modalDiv += 'Clean My Wall, the ultimate solution to clean your wall !';
						modalDiv += '<div style="margin-left: 50px; margin-top: -15px;">';
							modalDiv += '<iframe src="http://www.facebook.com/plugins/like.php?href=http://www.facebook.com/pages/Clean-My-Wall/295522143798018&amp;layout=standard&amp;show_faces=false&amp;width=450&amp;action=like&amp;font=arial&amp;colorscheme=light&amp;height=45" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:45px;" allowTransparency="true"></iframe>';
						modalDiv += '</div>';
					modalDiv += '</div>';
	
					modalDiv += '<div style="margin-left: 200px; margin-top: 20px; font-weight: bold; font-size: 16px;">';
						modalDiv += '<ol><li>Click GO to launch the cleaner.</li><li>Click STOP at any time</li><li>Click CLOSE to return to your profile</li></ol>';
					modalDiv += '</div>';
					
					modalDiv += '<p>&nbsp;</p>';
					
					modalDiv += '<div style="text-align: center; font-weight: bold; font-size: 14px;">';
						modalDiv += '<div style="border: 2px solid #888; text-align: center; padding: 10px;">';
							modalDiv += '<span style="font-size: 12px">Your posts will be deleted one by one, from the most recent to the oldest ones.</span>';
							modalDiv += '<br />';
							modalDiv += 'Remove my posts after the : ';
							modalDiv += '<select id="cmw_slcfrom">';
								modalDiv += '<option value="1">1st post</option>';
								modalDiv += '<option value="5" selected="selected">5th post</option>';
								modalDiv += '<option value="10">10th posts</option>';
								modalDiv += '<option value="20">20th posts</option>';
							modalDiv += '</select>';
							modalDiv += '<div style="margin-top: 5px;">';
								modalDiv += '<input type="button" onclick="goClean()" value="GO" id="cmw_goButton" />';
								modalDiv += '&nbsp;&nbsp;';
								modalDiv += '<input type="button" onclick="stopCleaning()" value="STOP" id="cmw_stopButton" disabled="disabled" />';
								modalDiv += '&nbsp;&nbsp;';
								modalDiv += '<input type="button" onclick="closeCleaning()" value="CLOSE" id="cmw_closeButton" />';
							modalDiv += '</div>';
						modalDiv += '</div>';
						modalDiv += '<div id="cmw_statusMsg" style="margin-top: 20px; font-size: 20px;">&nbsp;</div>';
						modalDiv += '<div id="cmw_statsContent" style=" display: none; margin-top: 5px; font-size: 12px;">';
							modalDiv += 'Posts on the wall : <span id="cmw_nbWallPosts">--</span>&nbsp;&nbsp;&nbsp;&nbsp;';
							modalDiv += 'Currently deleting the : <span id="cmw_nbCurrentlyCleaning">--</span>&nbsp;&nbsp;&nbsp;&nbsp;';
							modalDiv += 'Total posts deleted : <span id="cmw_nbTotalDeleted">--</span>';
						modalDiv += '</div>';
					modalDiv += '</div>';
					
					modalDiv += '<div id="cmw_infosdiv" style="width:570px; margin-left: 65px; margin-top: 30px; padding-top: 10px; border-top: 1px solid #888; font-weight: bold; font-size: 12px; display: none;">';
					modalDiv += 'This may take a while, depending on the number of posts you have. <br /> ';
					modalDiv += 'But don\'t worry, in the meantime you can continue to do what you want. <br /> Just minimize this window, or open a new tab !';
					modalDiv += '</div>';
					
					modalDiv += '<div id="cmw_warningdiv" style="width:570px; margin-left: 65px; margin-top: 30px; padding-top: 10px; border-top: 1px solid #888; font-weight: bold; font-size: 12px; display: none;">';
					modalDiv += 'Warning ! <br />There might still be some old posts since Facebook \'Older posts\' response is very strange.<br />';
					modalDiv += 'To be absolutely shure, and to perform a deap clean up you can manually click on the button \'Older posts\' until something appears, and then launch the cleaner again.<br />';
					modalDiv += '<br />Your data is stored on multiple servers. It can take several days, or weeks for them to be totaly up to date, so your friends might see some old posts until then.';
					modalDiv += '</div>';
	
				modalDiv += '</div>';
			modalDiv += '</div>';
		modalDiv += '</div>';

	var o = document.createElement("div");
	o.setAttribute('id', 'cleanupModalDiv');
	o.innerHTML = modalDiv;
	document.body.insertBefore(o, document.body.childNodes[0]);
	
}

if (document.location.href.indexOf('facebook') < 0) {
	alert("First, add this link to your bookmarks and then\ngo to your Facebook profile and click this bookmark to launch the cleaner.");
}
else {
	
	miniFeed = document.getElementById('profile_minifeed');
	if (miniFeed) {
		apppendModalDiv();
	} else {
		alert("You are not on your profile page\nFirst go to your personal feed, and then click the bookmark.\n\nInformation : Clean My Wall is not compatible with the Timeline but there is still a trick to make it work.\nVisit cleanmywall.netbew.com to see the explanations.");
	}
	
}