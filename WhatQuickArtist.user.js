function trim(stringToTrim) { return stringToTrim.replace(/^\s+|\s+$/g,""); }

function multilineToArray(t){
	return t.split(/[\n]+/);
}

// Taken from what.cd's browse.js (Line 192)
function AddArtistField() {
	var ArtistFieldCount = document.getElementById("AddArtists").getElementsByTagName("input").length;
	var x = document.getElementById('AddArtists');
	x.appendChild(document.createElement("br"));
	var ArtistField = document.createElement("input");
	ArtistField.type = "text";
	ArtistField.name = "aliasname[]";
	ArtistField.size = "17";
	x.appendChild(ArtistField);
	x.appendChild(document.createTextNode(' '));
	var Importance = document.createElement("select");
	Importance.name = "importance[]";
	Importance.innerHTML = '<option value="1">Main</option><option value="2">Guest</option><option value="4">Composer</option><option value="5">Conductor</option><option value="6">DJ / Compiler</option><option value="3">Remixer</option><option value="7">Producer</option>';
	x.appendChild(Importance);
	ArtistFieldCount++; 
}

function WhatQuickArtist(strTxt,aType)
{

	for(var i=0,aa=document.getElementById("AddArtists"),a=aa.getElementsByTagName("input"),as=aa.getElementsByTagName("select"),j=as.length;i<a.length; i++)
	{	
		var diff = a.length - j;
		if(trim(a[i].value).length<1 && a[i].name=="aliasname[]") {
			a[i].value=strTxt;
			setDropdownByValue(as[i-diff],aType);
			i=a.length+1;
		}
		if(i==a.length-1)
		{
			AddArtistField();
			a[i+1].value=strTxt;
			setDropdownByValue(as[i-diff+1],aType);
			i=a.length+1;
		}	
	}
}

function setDropdownByValue(e,v) {
	for(var i=0; i<e.options.length; i++) {
	  if ( e.options[i].value == v ) {
	    e.selectedIndex = i;
	    
	    break;
	  }
	}
}

/* Process any incoming requests */
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

	if (request.method == "fromPopup") {
		// Send JSON data back to Popup.
		window.focus();
		contents = decodeURIComponent(request.contents);
		contents=multilineToArray(contents);
		for(var i=0;i<contents.length;i++) 
		{
			WhatQuickArtist(contents[i],parseInt(request.type));
		}
		
		sendResponse({data: "from Content Script to Popup"});

		// Send JSON data to background page.
		// chrome.extension.sendRequest({method: "fromContentScript"}, function(response) {
		//	console.log(response.data);
		// });
	} else if (request.method == "requestSelection") {

		// http://groups.google.com/group/mozilla.dev.tech.dom/browse_thread/thread/7ecbbb066ff2027f
		// Martin Honnen
		//  http://JavaScript.FAQTs.com
		 var selection = window.getSelection();
		 var range = selection.getRangeAt(0);
		 if (range) {
		 	var div = document.createElement('div');
		 	div.appendChild(range.cloneContents());
		 	sel=div.textContent;
		 }

		sendResponse({
			'reply':'selectionCaptured',
			'selectedtabid': request.selectedtabid,
			'popuptabid': request.popuptabid,
			'selectiontext': sel, 
		});
		 

	} else {
		WhatQuickArtist(request.selectedText,request.addType);
	}

});


/* Listener for keyup event */
window.addEventListener('keyup', keyboardNavigation, false); 
function keyboardNavigation(e) { 

	chrome.extension.sendRequest({options: "hotkeys"}, function(response) {

		// Keyboard modifier defaults in the event the response fails
		var mMod = 2;
		var gMod = 2;
		var rMod = 2;

		// Using keycodes is our only choice - http://www.expandinghead.net/keycode.html

		// Defaults: In the event the response fails or returns invalid results
		var mKey = 77; //  Ctrl + M (77)
		var gKey = 71; // Ctrl + G (71)
		var rKey = 82; // Ctrl + R (82)

		modM = (response.modM) ? parseInt(response.modM) : mMod;
		modG = (response.modG) ? parseInt(response.modG) : gMod;
		modR = (response.modR) ? parseInt(response.modR) : rMod;
		intM = (response.intM) ? parseInt(response.intM) : mKey;
		intG = (response.intG) ? parseInt(response.intG) : gKey;
		intR = (response.intR) ? parseInt(response.intR) : rKey;

		switch(e.which) { 
		case intM:
			if(modM==0) {
				if (e.ctrlKey && !e.altKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),1); 
					} 
				}
			} else if(modM==1) {
				if (e.altKey && !e.ctrlKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),1); 
					} 
				}
			} else if(modM==2) {
				if (e.ctrlKey && e.altKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),1); 
					} 
				}
			}
		break;
		case intM+32: 
			if(modM==1) {
				if (e.altKey && !e.ctrlKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),1); 
					} 
				}
			}
	     break;
		case intG:
			if(modG==0) {
				if (e.ctrlKey && !e.altKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),2); 
					} 
				}
			} else if(modG==1) {
				if (e.altKey && !e.ctrlKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),2); 
					} 
				}
			} else if(modG==2) {
				if (e.ctrlKey && e.altKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),2); 
					} 
				}
			}
		break;
		case intG+32: 
			if(modG==1) {
				if (e.altKey && !e.ctrlKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),2); 
					} 
				}
			}
	     break;
		case intR:
			if(modR==0) {
				if (e.ctrlKey && !e.altKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),3); 
					} 
				}
			} else if(modR==1) {
				if (e.altKey && !e.ctrlKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),3); 
					} 
				}
			} else if(modR==2) {
				if (e.ctrlKey && e.altKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),3); 
					} 
				}
			}
		break;
		case intR+32: 
			if(modR==1) {
				if (e.altKey && !e.ctrlKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),3); 
					} 
				}
			}
	     break;
	  	}
	}); 
} 
