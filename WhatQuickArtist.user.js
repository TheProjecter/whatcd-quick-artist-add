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
	ArtistField.size = "20";
	x.appendChild(ArtistField);
	x.appendChild(document.createTextNode(' '));
	var Importance = document.createElement("select");
	Importance.name = "importance[]";
	Importance.innerHTML = '<option value="1">Main</option><option value="2">Guest</option><option value="3">Remixer</option>';
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
			as[i-diff][aType].selected="selected";
			i=a.length+1;
		}
		if(i==a.length-1)
		{
			AddArtistField();
			a[i+1].value=strTxt;
			as[i-diff+1][aType].selected="selected";
			i=a.length+1;
		}	
	}
}


chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

	if (request.method == "fromPopup") {
		// Send JSON data back to Popup.
		focus();
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
	} else {
		WhatQuickArtist(request.selectedText,request.addType);
	}

});

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
						WhatQuickArtist(window.getSelection(),0); 
					} 
				}
			} else if(modM==1) {
				if (e.altKey && !e.ctrlKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),0); 
					} 
				}
			} else if(modM==2) {
				if (e.ctrlKey && e.altKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),0); 
					} 
				}
			}
		break;
		case intM+32: 
			if(modM==1) {
				if (e.altKey && !e.ctrlKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),0); 
					} 
				}
			}
	     break;
		case intG:
			if(modG==0) {
				if (e.ctrlKey && !e.altKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),1); 
					} 
				}
			} else if(modG==1) {
				if (e.altKey && !e.ctrlKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),1); 
					} 
				}
			} else if(modG==2) {
				if (e.ctrlKey && e.altKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),1); 
					} 
				}
			}
		break;
		case intG+32: 
			if(modG==1) {
				if (e.altKey && !e.ctrlKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),1); 
					} 
				}
			}
	     break;
		case intR:
			if(modR==0) {
				if (e.ctrlKey && !e.altKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),2); 
					} 
				}
			} else if(modR==1) {
				if (e.altKey && !e.ctrlKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),2); 
					} 
				}
			} else if(modR==2) {
				if (e.ctrlKey && e.altKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),2); 
					} 
				}
			}
		break;
		case intR+32: 
			if(modR==1) {
				if (e.altKey && !e.ctrlKey) {
					if(window.getSelection().toString().length>0){ 
						WhatQuickArtist(window.getSelection(),2); 
					} 
				}
			}
	     break;
	  	}
	}); 
} 