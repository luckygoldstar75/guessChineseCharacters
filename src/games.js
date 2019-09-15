'use strict';
import CHINESE_CHARACTERS_JSON from './chineseCaracters.js';

const GAMES = 
{
getNextQuestion : function(_gameName, _level) {
	switch (_gameName) {
		case 'readCharacterWritePinyin':
			var nextCharacter = CHINESE_CHARACTERS_JSON.getNextRandomCharacter(_level);
			return ({"game": _gameName, "level" : _level ,
					question : { "type" : "string", "value" : nextCharacter.caracter},
					expectedAnswer :  { "type" : "string", "value" : nextCharacter.pinyin}
					});
		default:
			throw 'unknown game';
	}
}};


export default GAMES;
