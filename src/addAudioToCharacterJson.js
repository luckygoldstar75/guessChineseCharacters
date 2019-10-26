var regexReplace = /[āēīōūǖĀĒĪŌŪǕáéíóúǘÁÉÍÓÚǗǎěǐǒǔǚǍĚǏǑǓǙàèìòùǜÀÈÌÒÙǛüÜ !?]/gi;


function substituteSpecialCharacters(corresp, decalage, chaine) {
    var replaceString ='';
    
    switch(corresp) {
        case 'ā':
            replaceString='a1';
            break;
            
        case 'ē':
			replaceString='e1';
			break;

 		case 'ī':
			replaceString='i1';
			break;

 		case 'ō':
			replaceString='o1';
			break;

 		case 'ū':
			replaceString='u1';
			break;

 		case 'ǖ':
			replaceString='uu1';
			break;

 		case 'Ā':
			replaceString='A1';
			break;

 		case 'Ē':
			replaceString='E1';
			break;

 		case 'Ī':
			replaceString='I1';
			break;

 		case 'Ō':
			replaceString='O1';
			break;

 		case 'Ū':
			replaceString='U1';
			break;

 		case 'Ǖ':
			replaceString='UU1';
			break;

 		case 'á':
			replaceString='a2';
			break;

 		case 'é':
			replaceString='e2';
			break;

 		case 'í':
			replaceString='i2';
			break;

 		case 'ó':
			replaceString='o2';
			break;

 		case 'ú':
			replaceString='u2';
			break;

 		case 'ǘ':
			replaceString='uu2';
			break;

 		case 'Á':
			replaceString='A2';
			break;

 		case 'É':
			replaceString='E2';
			break;

 		case 'Í':
			replaceString='I2';
			break;

 		case 'Ó':
			replaceString='O2';
			break;

 		case 'Ú':
			replaceString='U2';
			break;

 		case 'Ǘ':
			replaceString='UU2';
			break;

 		case 'ǎ':
			replaceString='a3';
			break;

 		case 'ě':
			replaceString='e3';
			break;

 		case 'ǐ':
			replaceString='i3';
			break;

 		case 'ǒ':
			replaceString='o3';
			break;

 		case 'ǔ':
			replaceString='u3';
			break;

 		case 'ǚ':
			replaceString='uu3';
			break;

 		case 'Ǎ':
			replaceString='A3';
			break;

 		case 'Ě':
			replaceString='E3';
			break;

 		case 'Ǐ':
			replaceString='I3';
			break;

 		case 'Ǒ':
			replaceString='O3';
			break;

 		case 'Ǔ':
			replaceString='U3';
			break;

 		case 'Ǚ':
			replaceString='UU3';
			break;

 		case 'à':
			replaceString='a4';
			break;

 		case 'è':
			replaceString='e4';
			break;

 		case 'ì':
			replaceString='i4';
			break;

 		case 'ò':
			replaceString='o4';
			break;

 		case 'ù':
			replaceString='u4';
			break;

 		case 'ǜ':
			replaceString='uu4';
			break;

 		case 'À':
			replaceString='A4';
			break;

 		case 'È':
			replaceString='E4';
			break;

 		case 'Ì':
			replaceString='I4';
			break;

 		case 'Ò':
			replaceString='O4';
			break;

 		case 'Ù':
			replaceString='U4';
			break;

 		case 'Ǜ':
			replaceString='UU4';
			break;

 		case 'ü':
			replaceString='uu';
			break;

 		case 'Ü':
			replaceString='UU';
			break;
        
        case ' ':
            replaceString='_';
            break;
        
        case '!':
            replaceString='';
            break;
        
        case '?':
            replaceString='';
            break;
        
        
        default:
            console.error("unexpectedMatch: " + corresp);
    }
    
    return replaceString;
}

function getAudioFileCode(_character) {
var pinyin=_character.pinyin;
var substitutedPinyin = pinyin.replace(regexReplace, substituteSpecialCharacters);

return substitutedPinyin;
}

function putAudioFile(arrayCharacters) {
Array.from(arrayCharacters).forEach(element => {
        element.audio=getAudioFileCode(element);}
     );

console.log(arrayCharacters);
return arrayCharacters;
}
