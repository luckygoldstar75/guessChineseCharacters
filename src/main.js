var nbTries=0;
var nbSuccess=0;

document.getElementById("Valider").addEventListener("click", valider);
document.getElementById("Suivant").addEventListener("click", auSuivant);
document.getElementById("saisiePinyin").onkeypress = function(e) {
   if (e.keyCode == 13) {valider();}; //enter
   if (e.keyCode == 40) {auSuivant();}; //down
};

var currentCaracter;
auSuivant();

function auSuivant() {
 nbTries++;
 document.getElementById("currentResult").innerHTML="Réussis: " + nbSuccess + " / " + "Total : " + nbTries;
 document.getElementById("saisiePinyin").value ="";
 var indexHasard=Math.floor((Math.random() * caracteres.length));
 var myCar = caracteres[indexHasard].caracter;
 document.getElementById('caractereADeviner').innerHTML=myCar;

 currentCaracter=caracteres[indexHasard];
 document.getElementById("Valider").disabled=false;
 document.getElementById("Suivant").disabled=true;
 document.getElementById("listePinYin").disabled=true;
 document.getElementById("saisiePinyin").className="pinyintextarea";
 document.getElementById("saisiePinyin").focus();
}

function valider() {
 var result = false;
 var pinyinInput=document.getElementById("saisiePinyin").value;
 if(currentCaracter.pinyin.toLowerCase() !== pinyinInput.toLowerCase()) {
  document.getElementById("saisiePinyin").className="pinyintextareawrong";
  document.getElementById("saisiePinyin").value += " ===> No :  " + currentCaracter.pinyin;
 }
 else {
  nbSuccess++;
  document.getElementById("currentResult").innerHTML=nbSuccess;				
 }

 document.getElementById("Valider").disabled=true;
 document.getElementById("Suivant").disabled=false;
}

function addChar(char) {
  var _pinyinInput=document.getElementById("saisiePinyin"); 	

  var start = _pinyinInput.selectionStart;
  var end = _pinyinInput.selectionEnd;
  var text = _pinyinInput.value;
  var before = text.substring(0, start);
  var after  = text.substring(end, text.length);
  _pinyinInput.value=(before + char + after);

  _pinyinInput.selectionStart = _pinyinInput.selectionEnd = start + char.length;
  _pinyinInput.focus();
}
