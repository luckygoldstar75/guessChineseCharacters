'use strict';


const CHINESE_CHARACTERS_JSON = [];

CHINESE_CHARACTERS_JSON[1]=[
{"pinyin":"ān" , "caracter": "安", "translation" : "paix", "hint" : "femme sous toît"},
{"pinyin":"bàba" , "caracter": "爸爸", "translation" : "papa", "hint" : ""},
{"pinyin":"māma" , "caracter": "媽媽", "translation" : "mère,maman", "hint" : "genre féminin + puis le ma phonétique"},
{"pinyin":"dìdi" , "caracter": "弟弟", "translation" : "jeune frère", "hint" : ""},
{"pinyin":"gēge" , "caracter": "哥哥", "translation" : "frère aîné", "hint" : ""},
{"pinyin":"jiā" , "caracter": "家", "translation" : "famille", "hint" : "(toit|porc)"},
{"pinyin":"jiějie" , "caracter": "姐姐", "translation" : "grande sœur", "hint" : ""},
{"pinyin":"mèimei" , "caracter": "妹妹", "translation" : "petite sœur", "hint" : ""},
{"pinyin":"zài" , "caracter": "在", "translation" : "à,exister,en,dans", "hint" : ""},
{"pinyin":"zhèlǐ" , "caracter": "這里", "translation" : "ici", "hint" : "en désignant : ceci à l'intérieur (du village)"},
{"pinyin":"nǎlǐ" , "caracter": "哪里", "translation" : "là-bas", "hint" : "où à l'intérieur du village"},
{"pinyin":"Wǒ jiā zài zhèlǐ" , "caracter": "我 家 在 這里", "translation" : "Ma maison est ici.", "hint" : "Je maison/foyer exister ici"},
{"pinyin":"nǎlǐ" , "caracter": "哪里", "translation" : "là-bas", "hint" : "où à l'interieur du vilage"},
{"pinyin":"Nǐ jiā zài nǎlǐ?" , "caracter": "你 家 在 哪里?", "translation" : "Où se trouve ta maison?", "hint" : ""},
{"pinyin":"zài" , "caracter": "在", "translation" :  "de nouveau", "hint" : ""},
{"pinyin":"jiàn" , "caracter": "見", "translation" :  "voir", "hint" : "clé de l'oeil actif!"},
{"pinyin":"zàijiàn" , "caracter": "再見", "translation" :  "Au revoir!", "hint" : "de nouveau /  oeil"},
{"pinyin":"míngtiān jiàn" , "caracter": "明天見", "translation" :  "A demain", "hint" : "se voir jour brillant"},
{"pinyin":"míngtiān" , "caracter": "明天", "translation" :  "demain", "hint" : "brillant/le ciel au dessus de l'homme, le jour."},
{"pinyin":"zǎo" , "caracter": "早", "translation" :  "matin", "hint" : "soleil|petit déjeuner"},
{"pinyin":"zǎoān" , "caracter": "早安", "translation" :  "bonjour (tôt le matin)", "hint" : "matin|paix"},
{"pinyin":"hǎo" , "caracter": "好", "translation" :  "bon", "hint" : "femme+enfant=bon"},
{"pinyin":"nǐ" , "caracter": "你", "translation" :  "tu,toi", "hint" : ""},
{"pinyin":"nǐhǎo" , "caracter": "你好", "translation" :  "toi, bonjour", "hint" : ""},
{"pinyin":"tā" , "caracter" : "他 ", "translation" :  "il/lui", "hint" : ""},
{"pinyin":"tā" , "caracter" : "她", "translation" :  "elle", "hint" : ""},
{"pinyin":"bù" , "caracter" : "不", "translation" :  "ne pas", "hint" : ""},
{"pinyin":"wǒ" , "caracter" : "我", "translation" :  "je,moi", "hint" : ""},
{"pinyin":"xièxie" , "caracter" : "谢谢", "translation" :  "merci", "hint" : ""},
{"pinyin":"xiǎo" , "caracter" : "小", "translation" :  "petit", "hint" : ""}];
CHINESE_CHARACTERS_JSON[2]=[
{"pinyin":"shì" , "caracter" : "是", "translation" :  "être", "hint" : "sous le soleil , exactement."},
{"pinyin":"bù kèqì" , "caracter" : "不客氣", "translation" :  "pas de quoi", "hint" : "(ne) pas , politesse"},
{"pinyin":"jiào" , "caracter" : "叫", "translation" :  "s'appeler", "hint" : "la clé bouche!"},
{"pinyin":"shénme" , "caracter" : "什麽", "translation" :  "quel", "hint" : ""},
{"pinyin":"míngzì" , "caracter" : "名字", "translation" :  "nom", "hint" : "la clé bouche, réputation!"},
{"pinyin":"nǐ jiào shénme míngzì?" , "caracter" : "你 叫 什麽 名字?", "translation" :  "Comment t'appelles-tu?", "hint" : "toi s'appeler quel nom?"},
{"pinyin":"wǒ jiào Xiǎomíng" , "caracter" : "我 叫 小明", "translation" :  "Je m'appelle Xiăomíng", "hint" : ""},
{"pinyin":"tā jiào Dànián" , "caracter" : " 他 叫 大年", "translation" :  "Il s'appelle Dànián", "hint" : ""},
{"pinyin":"míng" , "caracter" : "明 ", "translation" :  "clair, lumineux", "hint" : "soleil|lune"},
{"pinyin":"Xiǎomíng" , "caracter" : "小明", "translation" :  "Xiǎomíng (prénom)", "hint" : "petit lumineux"},
{"pinyin":"Xiǎoxiāng" , "caracter" : "小香", "translation" :  "Xiǎoxiāng (prénom)", "hint" : "petit parfumé"},
{"pinyin":"xiāng" , "caracter" : "香", "translation" :  "parfumé", "hint" : "la bonne odeur du grain 禾 (hé) qui dore au soleil 日 (rì)"},
{"pinyin":"dà" , "caracter" : "大", "translation" :  "grand,très", "hint" : "Un homme 人 écartant grand les bras."},
{"pinyin":"nián" , "caracter" : "年", "translation" :  "an, année", "hint" : ""},
{"pinyin":"Dànián" , "caracter" : "大年", "translation" :  "Dànián (prénom)", "hint" : ""},
{"pinyin":"jiā" , "caracter" : "佳", "translation" :  "beau, joli", "hint" : ""},
{"pinyin":"Jiājiā" , "caracter" : "佳佳", "translation" :  "prénom Jiājiā", "hint" : ""},
{"pinyin":"péngyǒu" , "caracter" : "朋友", "translation" :  "ami", "hint" : ""},
{"pinyin":"péng" , "caracter" : "朋", "translation" :  "ami", "hint" : ""},
{"pinyin":"yǒu" , "caracter" : "友", "translation" :  "ami", "hint" : ""},
{"pinyin":"shéi" , "caracter" : "谁|誰", "translation" :  "Qui?", "hint" : "radical parole = demander qui? 2e partie = phonétique"},
{"pinyin":"tā shì shéi?" , "caracter" : "他 是 誰?", "translation" :  "Qui est-il?", "hint" : "Lui être qui?"},
{"pinyin":"tā shì wǒ māma" , "caracter" : "她 是 我 媽媽", "translation" :  "Elle est ma Maman", "hint" : ""},
{"pinyin":"kè" , "caracter" : "课|課", "translation" :  "leçon ", "hint" : "dire cours (clé parole)"},
{"pinyin":"de" , "caracter" : "的", "translation" :  "de (appartenance)", "hint" : ""},
{"pinyin":"lǎoshī" , "caracter" : "老師", "translation" :  "professeur", "hint" : "personne avec une canne"},
{"pinyin":"háishì", "caracter" : "還是", "translation" :  "ou bien encore être", "hint" : ""},
{"pinyin":"hái", "caracter" : "還", "translation" :  "ou bien encore, en plus", "hint" : ""},
{"pinyin":"lǎoshī, wǒ zài zhèlǐ" , "caracter" : "老師, 我 再 這里", "translation" :  "Professeur, je suis ici!", "hint" : ""},
{"pinyin":"nǐ shì Xiǎomíng ma ?" , "caracter" : "你 是 小明 嗎?", "translation" :  "Tu es Xiǎomíng n'est-ce pas?", "hint" : ""}
]
;

const MAX_LEVEL_GUESSCHARACTER_GAME = CHINESE_CHARACTERS_JSON.length;

function computeNbTotalElements() {
	var _totalNbElements = 0;
	for (var i=1; i< CHINESE_CHARACTERS_JSON.length; i++) {
		_totalNbElements +=  CHINESE_CHARACTERS_JSON[i].length;	
	}
	return _totalNbElements;
}

const TOTAL_NB_ELEMENTS = computeNbTotalElements();

function pickLevelIndexRandom(levelIndex) {
	var randomIndex=Math.floor((Math.random() *1000000)) % 20;
	var delta = 0;
	
	if (randomIndex <=11) {return levelIndex;}
	else if (randomIndex <= 15) {
		delta =1;
	}
	else if (randomIndex <= 17) {
		delta=2;	
	}
	else {
		delta = 3;
	}
	
	
	if (levelIndex > 1 && levelIndex < MAX_LEVEL_GUESSCHARACTER_GAME) {
			var delta = -1;
			if(random %2 == 0) delta = 1;
			return levelIndex + delta;	
	}
	else if (levelIndex < MAX_LEVEL_GUESSCHARACTER_GAME) {
			return levelIndex +1;
	}
	else if (levelIndex > 1) { return (levelIndex -1); }
	else return 1 ; //Default value

}

function getNextRandomCharacter(level) {
	if (level == null || level < 0 || level > MAX_LEVEL_GUESSCHARACTER_GAME) {
		var randomIndex=Math.floor((Math.random()*100000)) % TOTAL_NB_ELEMENTS;
		console.debug("Method " , getNextRandomCharacter.name, " NB TOTAL ELEMENTS: " ,TOTAL_NB_ELEMENTS);
		var currentIndex =0;
		for (var i=1; i< CHINESE_CHARACTERS_JSON.length; i++) {
			if(randomIndex < CHINESE_CHARACTERS_JSON[i].length) {return CHINESE_CHARACTERS_JSON[i][randomIndex];}
			else { randomIndex -= CHINESE_CHARACTERS_JSON[i].length;  }		
		}	
	}
	
	// level is OK in good boundaries
	var _levelIndex = pickLevelIndexRandom(level);
	return CHINESE_CHARACTERS_JSON[_levelIndex][Math.floor((Math.random() *100000)) % CHINESE_CHARACTERS_JSON[_levelIndex]];
}


 function getRandomSuggestedAnswersCharacter(nextCharacter, _level, _nbSuggestions) {
	var suggestions = [];
	
	if (_nbSuggestions == null || !parseInt(_nbSuggestions) || _nbSuggestions < 2 || _nbSuggestions > 10) {
		console.log("nbSuggestions is invalid number");
		throw("Error : invalid nbSuggestion");
	}
	else {
		var c ;
		for(var i=0; i<_nbSuggestions; i++) {
			c=getNextRandomCharacter(_level);
			suggestions.push(c);
		}
	}
	
	return suggestions;
	
 }

export default {CHINESE_CHARACTERS_JSON , getNextRandomCharacter, getRandomSuggestedAnswersCharacter};
