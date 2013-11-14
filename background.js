/****
 * BACKGROUND.JS
 * 
 * Sits in the background and listens for hotkeys,
 * context menu presses, and opens popup.
 *****/

/* Fix URI encoded component */
function fixedEncodeURIComponent (str) {  
	return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');  
}

/* Trim a string */
function trim(stringToTrim) { return stringToTrim.replace(/^\s+|\s+$/g,""); }

/* Hook any extension requests */
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

	if (request.options == "hotkeys") { // Reply to a hotkey options request
		sendResponse({
			modM: localStorage.modM, 
			modG: localStorage.modG,
			modR: localStorage.modR,
			intM: localStorage.intM, 
			intG: localStorage.intG,
			intR: localStorage.intR
		});
	} else { // Snub anything else
		// alert("Got a non hotkey request in background.js with options: " + request.options + "\nmethod: " + request.method);
		sendResponse({});
	}
});

/* Create context menus in selections and pages */
var addmain = chrome.contextMenus.create({"title": "Add As Main", "contexts":["selection","page"],"onclick": AddMain,"documentUrlPatterns":["http://what.cd/torrents.php?id=*","https://what.cd/torrents.php?id=*","https://ssl.what.cd/torrents.php?id=*"]});
var addguest = chrome.contextMenus.create({"title": "Add As Guest", "contexts":["selection","page"],"onclick": AddGuest,"documentUrlPatterns":["http://what.cd/torrents.php?id=*","https://what.cd/torrents.php?id=*","https://ssl.what.cd/torrents.php?id=*"]});
var addremixer = chrome.contextMenus.create({"title": "Add As Remixer", "contexts":["selection","page"],"onclick": AddRemixer,"documentUrlPatterns":["http://what.cd/torrents.php?id=*","https://what.cd/torrents.php?id=*","https://ssl.what.cd/torrents.php?id=*"]});
var batchadd = chrome.contextMenus.create({"title": "Batch Add", "contexts":["selection","page"],"onclick": BatchAdd,"documentUrlPatterns":["http://what.cd/torrents.php?id=*","https://what.cd/torrents.php?id=*","https://ssl.what.cd/torrents.php?id=*"]});

/* Callbacks to handle context menu clicks */
function AddMain(info, tab) { AddGeneric(info,tab,1) }
function AddGuest(info, tab) { AddGeneric(info,tab,2) }
function AddRemixer(info, tab) { AddGeneric(info,tab,3) }
function BatchAdd(info, tab) { chrome.tabs.getSelected(null, function(selectedtab) { 
	args="?txt="+fixedEncodeURIComponent(info.selectionText)+"&tabid="+selectedtab.id;
	
	/* Create a new popup tab */
	chrome.tabs.create({ 
		url: chrome.extension.getURL("popup.html")+args
	}, function(popuptab) {
		/* Once new popup is created, send it a request */
		chrome.tabs.sendRequest(popuptab.id, {
			'popuptabid':popuptab.id,
			'selectedtabid':selectedtab.id,
			'method':'createPopup', 
			'selectionText':info.selectionText
		}, function(response) { // Process the response coming from popup.js
			if(response.reply == "popupCreated") {
				// alert('Got a response. Popup tab id: ' + response.popuptabid + " Selected tab id: " + parseInt(response.selectedtabid));

				/* Since the popup is confirmed open, send the selectedtab a request */ 
				chrome.tabs.sendRequest(parseInt(response.selectedtabid), {
					'popuptabid':response.popuptabid,
					'selectedtabid':response.selectedtabid,
					'method':'requestSelection', 
				}, function(response) { // Process the selectionText that the selectedtab sends back
					if(response.reply == "selectionCaptured") {
						/* Since we have a selection, ask the popup textbox to update itself */
						chrome.tabs.sendRequest(parseInt(response.popuptabid), {
							'popuptabid':response.popuptabid,
							'selectedtabid':response.selectedtabid,
							'method':'updateTextbox',
							'selectiontext': response.selectiontext
						});
					}
				});
			}
		});
	}); 

})};

function AddGeneric(info,tab,aType)
{
	// Trim the text
	selText = trim(info.selectionText);

	if(selText.length>0)
	{
		/* Get the selected tab and do something to it */
		chrome.tabs.getSelected(null, function(tab) {
  			chrome.tabs.sendRequest(tab.id, {selectedText: selText, addType: aType}, function(response) {
  				/* The page received the request and returned a response */

  			});
		});
	}
}