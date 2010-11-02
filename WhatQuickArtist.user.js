function trim(stringToTrim) { return stringToTrim.replace(/^\s+|\s+$/g,""); }

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

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {WhatQuickArtist(request.selectedText,request.addType);});