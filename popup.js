
function fixedEncodeURIComponent (str) {  
	return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');  
}

function trim(stringToTrim) { return stringToTrim.replace(/^\s+|\s+$/g,""); }

function querySt(ji) {
	hu = window.location.search.substring(1);
	gy = hu.split("&");
	for (i=0;i<gy.length;i++) {
		ft = gy[i].split("=");
		if (ft[0] == ji) {
			return ft[1];
		}
	}
}

function textareaToArray(t){
	return t.value.split(/[\n]+/);
}
function removeByIndex(arrayName,arrayIndex){ 
	arrayName.splice(arrayIndex,1); 
	return arrayName;
}
function updatePreview()
{
	a = textareaToArray(document.batchform.copytext);
	split1 = document.batchform.start.value;
	split2 = document.batchform.finish.value;

	if(split1!="") {
		if(split1==" ") {
			// crop1 = a[0].match(/\w+|"[^"]+"/g);
			// crop1 = a[0].split(/[\s]+/g);
			crop1 = a[0].split(/[\s]+/);	
		} else {
			crop1 = a[0].split(split1);	
		}
		crop1 = removeByIndex(crop1,0).join(split1);
	}
	else {
		crop1=a[0];
	}
	if(split2!="") {
		crop2 = crop1.split(split2);
		preview=trim(crop2[0]);
	} else {
		preview=trim(crop1);
	}
	document.getElementById("preview").innerText=trim(preview);
}
function showArray(a,split1,split2){
	var msg="";
	var finalval = "";
	document.batchform.copytext.value="";
	var crop1;
	
	for(var i=0;i<a.length;i++){
		if(split1!="") {
			if(split1==" ") {
				// crop1 = a[i].match(/\w+|"[^"]+"/g);
				// crop1 = a[i].split(/[\s]+/g);
				crop1 = a[i].split(/[\s]+/);
			} else {
				crop1 = a[i].split(split1);	
			}
			crop1 = removeByIndex(crop1,0).join(split1);

		} else {
			crop1=a[i];
		}
		if(split2!="") {
			crop2 = crop1.split(split2);
			line = crop2[0];
		} else {
			line=crop1;
		}
		document.batchform.copytext.value =  document.batchform.copytext.value + trim(line) + '\n';
	}
}
function sendback() {

	chrome.tabs.getSelected(null, function(tab) 
	{ 
		idtab=parseInt(querySt("tabid"));
		chrome.tabs.update(idtab, {selected: true});
		chrome.tabs.sendRequest(idtab, {method: "fromPopup", tabid: idtab, type: document.batchform.importance.value, contents: fixedEncodeURIComponent(document.batchform.copytext.value), oldtabid: tab.id}, function(response) {
			window.close();
		}); 
	});
	
}
// Add body hander
document.addEventListener('DOMContentLoaded', function() {
    var body = document.getElementsByTagName("body")[0];
    //load();
	updatePreview();
});

// Add send handler
var send = document.getElementsByName("send")[0];
send.addEventListener("click", function(e){
	e.preventDefault();
	sendback();
	return false;
}, false);

// Add clear handler
var clear = document.getElementsByName("clear")[0];
clear.addEventListener("click", function(e){
	e.preventDefault();
	var answer = confirm ('Are you sure you want to clear this form?');
	if(answer){
		document.getElementsByTagName('form')[0].reset();
	}
	return false;
}, false);

// Add start handlers
var start = document.getElementsByName("start")[0];
start.addEventListener("change", function(e){
	updatePreview();
}, false);	

start.addEventListener("onkeyup", function(e){
	updatePreview();
}, false);	

// Add finish handlers
var finish = document.getElementsByName("finish")[0];
finish.addEventListener("change", function(e){
	updatePreview();
}, false);	

finish.addEventListener("onkeyup", function(e){
	updatePreview();
}, false);	

// Add copytext handlers
var copytext = document.getElementsByName("copytext")[0];
copytext.addEventListener("mouseup", function(e){
	updatePreview();
}, false);	

copytext.addEventListener("onkeyup", function(e){
	updatePreview();
}, false);	

copytext.addEventListener("click", function(e){
	updatePreview();
}, false);	

// Add split hander
var splt = document.getElementsByName("splt")[0];
splt.addEventListener("click", function(e){
	e.preventDefault();
	showArray(textareaToArray(copytext),start.value,finish.value);
	return false;
}, false);	


chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

	/* Listed for requests coming background.js */
	if(request.method == 'createPopup') {

		/* Reply to the background page, we hear you */
		sendResponse({
			'reply': 'popupCreated',
			'selectedtabid': request.selectedtabid,
			'popuptabid': request.popuptabid,
		});

	} else if (request.method == 'updateTextbox') {

		/* We got a selection, so update the textbox! */
		document.batchform.copytext.value = request.selectiontext;
		updatePreview();	
	}
});
