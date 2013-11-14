function trim(stringToTrim) { return stringToTrim.replace(/^\s+|\s+$/g,""); }

function alphanum(txt)
{
	for(var i=0; i<txt.length; i++)
		{
		var c = txt.charAt(i);
		var cc = c.charCodeAt(0);
		if((cc > 47 && cc<58) || (cc > 64 && cc<91) || (cc > 96 && cc<123)) { }
		else { return false; }
	}

	return true;
}

//a variable that will hold the index number of the selected radio button
function RadioValue(RadioElement)
{
	for (i=0;i<RadioElement.length;i++){
		if (RadioElement[i].checked==true){
			return RadioElement[i].value;
		}
	}
	RadioElement[0].checked=true;
        return RadioElement[0].value;
}

//set selected radio button
function SetRadioValue(RadioElement, index)
{
	for (i=0;i<RadioElement.length;i++){
		if (index==i) {
			RadioElement[i].checked=true;
		} else {
			RadioElement[i].checked=false;
		}
	}
}

function process_options() {

	// Capitalize Alpha numeric characters
	document.getElementById("AlphaKeyMi").value = document.getElementById("AlphaKeyMi").value.toUpperCase();
	document.getElementById("AlphaKeyGi").value = document.getElementById("AlphaKeyGi").value.toUpperCase();
	document.getElementById("AlphaKeyRi").value = document.getElementById("AlphaKeyRi").value.toUpperCase();

}

// Saves options to localStorage.
function save_options() {

	// The Alpha numeric key values
	alphaM = document.getElementById("AlphaKeyMi");
	alphaG = document.getElementById("AlphaKeyGi");
	alphaR = document.getElementById("AlphaKeyRi");

	// Check for blank fields
	if(trim(alphaM.value).length==0 || trim(alphaM.value).length==0 || trim(alphaM.value).length==0) { 
		alert("Blank fields are not allowed. Please enter an alpha numeric hotkey.");
		return false; 
	}

	// Check for non-alpha numeric characters
	if(!alphanum(alphaM.value) || !alphanum(alphaG.value) || !alphanum(alphaR.value)) {
		alert("Only alpha numeric characters are allowed for hotkeys.");
		return false;
	}	

	// Get the modifier key (0-Ctrl, 1-Alt, 2-Both)
	modM = parseInt(RadioValue(document.settings.ActionKeyM));
	modG = parseInt(RadioValue(document.settings.ActionKeyG));	
	modR = parseInt(RadioValue(document.settings.ActionKeyR));

	// Alter the keycodes if Alt is selected
	intM = alphaM.value.charCodeAt(0);
	intG = alphaG.value.charCodeAt(0);
	intR = alphaR.value.charCodeAt(0);

	localStorage["modM"]= modM;
	localStorage["modG"]= modG;
	localStorage["modR"]= modR;
	localStorage["intM"]= intM;
	localStorage["intG"]= intG;
	localStorage["intR"]= intR;

	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = "<span style='color:#c00;'>Options Saved. Please reload all What.CD tabs or restart Chrome.&nbsp;</span>";
	setTimeout(function() {
		status.innerHTML = "";
	}, 4000);

	return false;
}

// Restores select box state to saved value from localStorage.
function restore_options() {

	if(localStorage["modM"].length==1) {
		modM = parseInt(localStorage["modM"]);
		SetRadioValue(document.settings.ActionKeyM, modM);
	}
	if(localStorage["modG"].length==1) {
		modG = parseInt(localStorage["modG"]);
		SetRadioValue(document.settings.ActionKeyG, modG);
	}
	if(localStorage["modR"].length==1) {
		modR = parseInt(localStorage["modR"]);
		SetRadioValue(document.settings.ActionKeyR, modR);
	}

	// The Alpha numeric key values
	alphaM = document.getElementById("AlphaKeyMi");
	alphaG = document.getElementById("AlphaKeyGi");
	alphaR = document.getElementById("AlphaKeyRi");

	intM = localStorage["intM"];
	intG = localStorage["intG"];
	intR = localStorage["intR"];

	alphaM.value = (intM) ? String.fromCharCode(intM) : alphaM.value;
	alphaG.value = (intG) ? String.fromCharCode(intG) : alphaG.value;
	alphaR.value = (intR) ? String.fromCharCode(intR) : alphaR.value;

	process_options();
}

// Add body hander
var body = document.getElementsByTagName("body")[0];
body.addEventListener("load", restore_options, false);

// Add submit handler
var sub = document.getElementsByName("sub")[0];
sub.addEventListener("click", function(e){
	e.preventDefault();
	process_options();
	save_options();
	return false;
}, false);
