'use strict';
import CHINESE_CHARACTERS_JSON from './chineseCharacters.js';

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
		
		case 'readCharacterChoosePronunciation' :
			nextCharacter = CHINESE_CHARACTERS_JSON.getNextRandomCharacter(_level);
			var randomCharacters = CHINESE_CHARACTERS_JSON.getRandomSuggestedAnswersCharacter(nextCharacter,
																									_level, _nbSuggestions);
			var _randomSuggestedAnswers = randomCharacters.map(x => x.audio);
			var _randomIndex=Math.floor((Math.random()*100000)) % _randomSuggestedAnswers.length;
			
			_randomSuggestedAnswers.splice( _randomIndex, 0 ,nextCharacter.audio);			
			
			return ({"game": _gameName, "level" : _level ,
					question : { "type" : "audio", "value" : nextCharacter.traditional, suggestedAnswers : _randomSuggestedAnswers},
					expectedAnswer :  { "type" : "string", "value" : nextCharacter.audio}
					});
		
		case 'hearPronunciationSelectCharacter' :
			nextCharacter = CHINESE_CHARACTERS_JSON.getNextRandomCharacter(_level);
			var randomCharacters = CHINESE_CHARACTERS_JSON.getRandomSuggestedAnswersCharacter(nextCharacter,
																									_level, _nbSuggestions);
			var _randomSuggestedAnswers = randomCharacters.map(x => {
				var _mysuggestion = {'character' : x.traditional, 'audio' : x.audio};
				return _mysuggestion;});
			var _randomIndex=Math.floor((Math.random()*100000)) % _randomSuggestedAnswers.length;
			
			_randomSuggestedAnswers.splice( _randomIndex, 0 ,
										   {'character' : nextCharacter.traditional, 'audio' : nextCharacter.audio});			
			
			return ({"game": _gameName, "level" : _level ,
					question : {"type" : "audio", "value" : nextCharacter.audio, suggestedAnswers : _randomSuggestedAnswers},
					expectedAnswer :  { "type" : "string", "value" : nextCharacter.audio}
					});
		
		default:
			throw 'unknown game';
	}
}};


export default GAMES;
