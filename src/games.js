'use strict';
import CHINESE_CHARACTERS_JSON from './chineseCaracters.js';

const GAMES = 
{
getNextQuestion : function(_gameName, _level, _nbSuggestions) {
	var nextCharacter=null;
	switch (_gameName) {		
		case 'readCharacterWritePinyin':
			nextCharacter = CHINESE_CHARACTERS_JSON.getNextRandomCharacter(_level);
			return ({"game": _gameName, "level" : _level ,
					question : { "type" : "string", "value" : nextCharacter.traditional},
					expectedAnswer :  { "type" : "string", "value" : nextCharacter.pinyin},
					});
		case 'readCharacterSelectFrench':
			nextCharacter = CHINESE_CHARACTERS_JSON.getNextRandomCharacter(_level);
			var randomCharacters = CHINESE_CHARACTERS_JSON.getRandomSuggestedAnswersCharacter(nextCharacter,
																									_level, _nbSuggestions);
			var _randomSuggestedAnswers = randomCharacters.map(x => x.translation);
			var _randomIndex=Math.floor((Math.random()*100000)) % _randomSuggestedAnswers.length;
			
			_randomSuggestedAnswers.splice( _randomIndex, 0 ,nextCharacter.translation);
			
			
			return ({"game": _gameName, "level" : _level ,
					question : { "type" : "string", "value" : nextCharacter.traditional, suggestedAnswers : _randomSuggestedAnswers},
					expectedAnswer :  { "type" : "string", "value" : nextCharacter.translation}
					});
		default:
			throw 'unknown game';
	}
}};


export default GAMES;
