'use strict';


const CHINESE_CHARACTERS_JSON = []; //Array of levels of array of words json objects

//TARGET (pinyin key for audio file for reading loud)  {	 "pinyin":"ān" , "traditionnal": "安", "simplified": "安, "translation" : "paix", "hint" : "femme sous toît"},
CHINESE_CHARACTERS_JSON[1]=[
{"pinyin":"ān" , "simplified" : "安" , "traditional" : " 安", "translation" : "paix", "hint" : "femme sous toît"},
{"pinyin":"bàba" , "simplified" : "爸爸" , "traditional" : " 爸爸", "translation" : "papa", "hint" : ""},
{"pinyin":"māma" , "simplified" : "媽媽" , "traditional" : " 媽媽", "translation" : "mère,maman", "hint" : "genre féminin + puis le ma phonétique"},
{"pinyin":"dìdi" , "simplified" : "弟弟" , "traditional" : " 弟弟", "translation" : "jeune frère", "hint" : ""},
{"pinyin":"gēge" , "simplified" : "哥哥" , "traditional" : " 哥哥", "translation" : "frère aîné", "hint" : ""},
{"pinyin":"jiā" , "simplified" : "家" , "traditional" : " 家", "translation" : "famille", "hint" : "(toit|porc)"},
{"pinyin":"jiějie" , "simplified" : "姐姐" , "traditional" : " 姐姐", "translation" : "grande sœur", "hint" : ""},
{"pinyin":"mèimei" , "simplified" : "妹妹" , "traditional" : " 妹妹", "translation" : "petite sœur", "hint" : ""},
{"pinyin":"zài" , "simplified" : "在" , "traditional" : " 在", "translation" : "à,exister,en,dans", "hint" : ""},
{"pinyin":"zhèlǐ" , "simplified" : "這里" , "traditional" : " 這里", "translation" : "ici", "hint" : "en désignant : ceci à l'intérieur (du village)"},
{"pinyin":"nǎlǐ" , "simplified" : "哪里" , "traditional" : " 哪里", "translation" : "là-bas", "hint" : "où à l'intérieur du village"},
{"pinyin":"Wǒ jiā zài zhèlǐ" , "simplified" : "我 家 在 這里" , "traditional" : " 我 家 在 這里", "translation" : "Ma maison est ici.", "hint" : "Je maison/foyer exister ici"},
{"pinyin":"nǎlǐ" , "simplified" : "哪里" , "traditional" : " 哪里", "translation" : "là-bas", "hint" : "où à l'interieur du vilage"},
{"pinyin":"Nǐ jiā zài nǎlǐ?" , "simplified" : "你 家 在 哪里?" , "traditional" : " 你 家 在 哪里?", "translation" : "Où se trouve ta maison?", "hint" : ""},
{"pinyin":"zài" , "simplified" : "在" , "traditional" : " 在", "translation" :  "de nouveau", "hint" : ""},
{"pinyin":"jiàn" , "simplified" : "見" , "traditional" : " 見", "translation" :  "voir", "hint" : "clé de l'oeil actif!"},
{"pinyin":"zàijiàn" , "simplified" : "再見" , "traditional" : " 再見", "translation" :  "Au revoir!", "hint" : "de nouveau /  oeil"},
{"pinyin":"míngtiān jiàn" , "simplified" : "明天見" , "traditional" : " 明天見", "translation" :  "A demain", "hint" : "se voir jour brillant"},
{"pinyin":"míngtiān" , "simplified" : "明天" , "traditional" : " 明天", "translation" :  "demain", "hint" : "brillant/le ciel au dessus de l'homme, le jour."},
{"pinyin":"zǎo" , "simplified" : "早" , "traditional" : " 早", "translation" :  "matin", "hint" : "soleil|petit déjeuner"},
{"pinyin":"zǎoān" , "simplified" : "早安" , "traditional" : " 早安", "translation" :  "bonjour (tôt le matin)", "hint" : "matin|paix"},
{"pinyin":"hǎo" , "simplified" : "好" , "traditional" : " 好", "translation" :  "bon", "hint" : "femme+enfant=bon"},
{"pinyin":"nǐ" , "simplified" : "你" , "traditional" : " 你", "translation" :  "tu,toi", "hint" : ""},
{"pinyin":"nǐhǎo" , "simplified" : "你好" , "traditional" : " 你好", "translation" :  "toi, bonjour", "hint" : ""},
{"pinyin":"tā" , "simplified" : "他 " , "traditional" : " 他 ", "translation" :  "il/lui", "hint" : ""},
{"pinyin":"tā" , "simplified" : "她" , "traditional" : " 她", "translation" :  "elle", "hint" : ""},
{"pinyin":"bù" , "simplified" : "不" , "traditional" : " 不", "translation" :  "ne pas", "hint" : ""},
{"pinyin":"wǒ" , "simplified" : "我" , "traditional" : " 我", "translation" :  "je,moi", "hint" : ""},
{"pinyin":"xièxie" , "simplified" : "谢谢" , "traditional" : " 谢谢", "translation" :  "merci", "hint" : ""},
{"pinyin":"xiǎo" , "simplified" : "小" , "traditional" : " 小", "translation" :  "petit", "hint" : ""}];
CHINESE_CHARACTERS_JSON[2]=[
{"pinyin":"shì" , "simplified" : "是" , "traditional" : " 是", "translation" :  "être", "hint" : "sous le soleil , exactement."},
{"pinyin":"bù kèqì" , "simplified" : "不客氣" , "traditional" : " 不客氣", "translation" :  "pas de quoi", "hint" : "(ne) pas , politesse"},
{"pinyin":"jiào" , "simplified" : "叫" , "traditional" : " 叫", "translation" :  "s'appeler", "hint" : "la clé bouche!"},
{"pinyin":"shénme" , "simplified" : "什麽" , "traditional" : " 什麽", "translation" :  "quel", "hint" : ""},
{"pinyin":"míngzì" , "simplified" : "名字" , "traditional" : " 名字", "translation" :  "nom", "hint" : "la clé bouche, réputation!"},
{"pinyin":"nǐ jiào shénme míngzì?" , "simplified" : "你 叫 什麽 名字?" , "traditional" : " 你 叫 什麽 名字?", "translation" :  "Comment t'appelles-tu?", "hint" : "toi s'appeler quel nom?"},
{"pinyin":"wǒ jiào Xiǎomíng" , "simplified" : "我 叫 小明" , "traditional" : " 我 叫 小明", "translation" :  "Je m'appelle Xiăomíng", "hint" : ""},
{"pinyin":"tā jiào Dànián" , "simplified" : " 他 叫 大年" , "traditional" : "  他 叫 大年", "translation" :  "Il s'appelle Dànián", "hint" : ""},
{"pinyin":"míng" , "simplified" : "明 " , "traditional" : " 明 ", "translation" :  "clair, lumineux", "hint" : "soleil|lune"},
{"pinyin":"Xiǎomíng" , "simplified" : "小明" , "traditional" : " 小明", "translation" :  "Xiǎomíng (prénom)", "hint" : "petit lumineux"},
{"pinyin":"Xiǎoxiāng" , "simplified" : "小香" , "traditional" : " 小香", "translation" :  "Xiǎoxiāng (prénom)", "hint" : "petit parfumé"},
{"pinyin":"xiāng" , "simplified" : "香" , "traditional" : " 香", "translation" :  "parfumé", "hint" : "la bonne odeur du grain 禾 (hé) qui dore au soleil 日 (rì)"},
{"pinyin":"dà" , "simplified" : "大" , "traditional" : " 大", "translation" :  "grand,très", "hint" : "Un homme 人 écartant grand les bras."},
{"pinyin":"nián" , "simplified" : "年" , "traditional" : " 年", "translation" :  "an, année", "hint" : ""},
{"pinyin":"Dànián" , "simplified" : "大年" , "traditional" : " 大年", "translation" :  "Dànián (prénom)", "hint" : ""},
{"pinyin":"jiā" , "simplified" : "佳" , "traditional" : " 佳", "translation" :  "beau, joli", "hint" : ""},
{"pinyin":"Jiājiā" , "simplified" : "佳佳" , "traditional" : " 佳佳", "translation" :  "prénom Jiājiā", "hint" : ""},
{"pinyin":"péngyǒu" , "simplified" : "朋友" , "traditional" : " 朋友", "translation" :  "ami", "hint" : ""},
{"pinyin":"péng" , "simplified" : "朋" , "traditional" : " 朋", "translation" :  "ami", "hint" : ""},
{"pinyin":"yǒu" , "simplified" : "友" , "traditional" : " 友", "translation" :  "ami", "hint" : ""},
{"pinyin":"shéi" , "simplified" : "谁|誰" , "traditional" : " 谁|誰", "translation" :  "Qui?", "hint" : "radical parole = demander qui? 2e partie = phonétique"},
{"pinyin":"tā shì shéi?" , "simplified" : "他 是 誰?" , "traditional" : " 他 是 誰?", "translation" :  "Qui est-il?", "hint" : "Lui être qui?"},
{"pinyin":"tā shì wǒ māma" , "simplified" : "她 是 我 媽媽" , "traditional" : " 她 是 我 媽媽", "translation" :  "Elle est ma Maman", "hint" : ""},
{"pinyin":"kè" , "simplified" : "课|課" , "traditional" : " 课|課", "translation" :  "leçon ", "hint" : "dire cours (clé parole)"},
{"pinyin":"de" , "simplified" : "的" , "traditional" : " 的", "translation" :  "de (appartenance)", "hint" : ""},
{"pinyin":"lǎoshī" , "simplified" : "老師" , "traditional" : " 老師", "translation" :  "professeur", "hint" : "personne avec une canne"},
{"pinyin":"háishì", "simplified" : "還是" , "traditional" : " 還是", "translation" :  "ou bien encore être", "hint" : ""},
{"pinyin":"hái", "simplified" : "還" , "traditional" : " 還", "translation" :  "ou bien encore, en plus", "hint" : ""},
{"pinyin":"lǎoshī, wǒ zài zhèlǐ" , "simplified" : "老師, 我 再 這里" , "traditional" : " 老師, 我 再 這里", "translation" :  "Professeur, je suis ici!", "hint" : ""},
{"pinyin":"nǐ shì Xiǎomíng ma ?" , "simplified" : "你 是 小明 嗎?" , "traditional" : " 你 是 小明 嗎?", "translation" :  "Tu es Xiǎomíng n'est-ce pas?", "hint" : ""},
{"pinyin" : "ài", "simplified" : "愛", "traditional" : "爱", "translation" : "aimer, amour", "hint" : ""},
{"pinyin" : "bā", "simplified" : "八", "traditional" : "八", "translation" : "huit, 8", "hint" : ""},
{"pinyin" : "bàba", "simplified" : "爸爸", "traditional" : "爸爸", "translation" : "papa", "hint" : ""},
{"pinyin" : "bēizi", "simplified" : "杯子", "traditional" : "杯子", "translation" : "verre, tasse", "hint" : ""},
{"pinyin" : "Běijīng", "simplified" : "北京", "traditional" : "北京", "translation" : "Beijing, Pékin", "hint" : ""},
{"pinyin" : "běn", "simplified" : "本", "traditional" : "本", "translation" : "classificateur pour livre", "hint" : ""},
{"pinyin" : "bù kèqi", "simplified" : "不客氣", "traditional" : "不客气", "translation" : "je vous en prie", "hint" : ""},
{"pinyin" : "bù", "simplified" : "不", "traditional" : "不", "translation" : "non, particule négative", "hint" : ""},
{"pinyin" : "cài", "simplified" : "菜", "traditional" : "菜", "translation" : "légume, plat", "hint" : ""},
{"pinyin" : "chá", "simplified" : "茶", "traditional" : "茶", "translation" : "thé", "hint" : ""},
{"pinyin" : "chī", "simplified" : "吃", "traditional" : "吃", "translation" : "manger", "hint" : ""},
{"pinyin" : "chūzūchē", "simplified" : "出租車", "traditional" : "出租车", "translation" : "taxi", "hint" : ""},
{"pinyin" : "dǎ diànhuà", "simplified" : "打電話", "traditional" : "打电话", "translation" : "téléphoner", "hint" : ""},
{"pinyin" : "dà", "simplified" : "大", "traditional" : "大", "translation" : "grand", "hint" : ""},
{"pinyin" : "de", "simplified" : "的", "traditional" : "的", "translation" : "particule de détermination", "hint" : ""},
{"pinyin" : "diǎn", "simplified" : "點", "traditional" : "点", "translation" : "point, heure", "hint" : ""},
{"pinyin" : "diànnǎo", "simplified" : "電腦", "traditional" : "电脑", "translation" : "ordinateur", "hint" : ""},
{"pinyin" : "diànshì", "simplified" : "電視", "traditional" : "电视", "translation" : "télévision", "hint" : ""},
{"pinyin" : "diànyǐng", "simplified" : "電影", "traditional" : "电影", "translation" : "film, cinéma", "hint" : ""},
{"pinyin" : "dōngxi", "simplified" : "東西", "traditional" : "东西", "translation" : "chose, objet", "hint" : ""},
{"pinyin" : "dōu", "simplified" : "都", "traditional" : "都", "translation" : "tout, tous", "hint" : ""},
{"pinyin" : "dú", "simplified" : "讀", "traditional" : "读", "translation" : "lire, étudier", "hint" : ""},
{"pinyin" : "duìbuqǐ", "simplified" : "對不起", "traditional" : "对不起", "translation" : "désolé, pardon", "hint" : ""},
{"pinyin" : "duō", "simplified" : "多", "traditional" : "多", "translation" : "beaucoup", "hint" : ""},
{"pinyin" : "duōshǎo", "simplified" : "多少", "traditional" : "多少", "translation" : "combien ? (plus de 10)", "hint" : ""},
{"pinyin" : "érzi", "simplified" : "兒子", "traditional" : "儿子", "translation" : "fils", "hint" : ""},
{"pinyin" : "èr", "simplified" : "二", "traditional" : "二", "translation" : "deux, 2", "hint" : ""},
{"pinyin" : "fànguǎnr", "simplified" : "飯館兒", "traditional" : "饭馆儿", "translation" : "restaurant", "hint" : ""},
{"pinyin" : "fēijī", "simplified" : "飛機", "traditional" : "飞机", "translation" : "avion", "hint" : ""},
{"pinyin" : "fēnzhōng", "simplified" : "分鐘", "traditional" : "分钟", "translation" : "minute (d’horloge)", "hint" : ""},
{"pinyin" : "gāoxìng", "simplified" : "高興", "traditional" : "高兴", "translation" : "content", "hint" : ""},
{"pinyin" : "gè", "simplified" : "個", "traditional" : "个", "translation" : "classificateur générique", "hint" : ""},
{"pinyin" : "gōngzuò", "simplified" : "工作", "traditional" : "工作", "translation" : "travailler, travail", "hint" : ""},
{"pinyin" : "gǒu", "simplified" : "狗", "traditional" : "狗", "translation" : "chien", "hint" : ""},
{"pinyin" : "Hànyǔ", "simplified" : "漢語", "traditional" : "汉语", "translation" : "chinois (langue chinoise)", "hint" : ""},
{"pinyin" : "hāo", "simplified" : "好", "traditional" : "好", "translation" : "bien, bon", "hint" : ""},
{"pinyin" : "hē", "simplified" : "喝", "traditional" : "喝", "translation" : "boire", "hint" : ""},
{"pinyin" : "hé", "simplified" : "和", "traditional" : "和", "translation" : "et", "hint" : ""},
{"pinyin" : "hěn", "simplified" : "很", "traditional" : "很", "translation" : "très", "hint" : ""},
{"pinyin" : "hòumiàn", "simplified" : "后面", "traditional" : "后面", "translation" : "derrière", "hint" : ""},
{"pinyin" : "huí", "simplified" : "回", "traditional" : "回", "translation" : "revenir, retourner ; fois", "hint" : ""},
{"pinyin" : "huì", "simplified" : "會", "traditional" : "会", "translation" : "savoir, pouvoir faire", "hint" : ""},
{"pinyin" : "huǒchēzhàn", "simplified" : "火車站", "traditional" : "火车站", "translation" : "gare ferroviaire", "hint" : ""},
{"pinyin" : "jǐ", "simplified" : "幾", "traditional" : "几", "translation" : "combien ? (1 à 10)", "hint" : ""},
{"pinyin" : "jiā", "simplified" : "家", "traditional" : "家", "translation" : "maison, famille ; classificateur", "hint" : ""},
{"pinyin" : "jiào", "simplified" : "叫", "traditional" : "叫", "translation" : "appeler", "hint" : ""},
{"pinyin" : "jīntiān", "simplified" : "今天", "traditional" : "今天", "translation" : "aujourd’hui", "hint" : ""},
{"pinyin" : "jiǔ", "simplified" : "九", "traditional" : "九", "translation" : "neuf, 9", "hint" : ""},
{"pinyin" : "kāi", "simplified" : "開", "traditional" : "开", "translation" : "ouvrir, conduire", "hint" : ""},
{"pinyin" : "kān", "simplified" : "看", "traditional" : "看", "translation" : "regarder, voir", "hint" : ""},
{"pinyin" : "kànjian", "simplified" : "看見", "traditional" : "看见", "translation" : "voir, apercevoir", "hint" : ""},
{"pinyin" : "kuài", "simplified" : "塊", "traditional" : "块", "translation" : "morceau ; classificateur", "hint" : ""},
{"pinyin" : "lái", "simplified" : "來", "traditional" : "来", "translation" : "venir", "hint" : ""},
{"pinyin" : "lǎoshī", "simplified" : "老師", "traditional" : "老师", "translation" : "enseignant, professeur", "hint" : ""},
{"pinyin" : "le", "simplified" : "了", "traditional" : "了", "translation" : "particule grammaticale", "hint" : ""},
{"pinyin" : "lěng", "simplified" : "冷", "traditional" : "冷", "translation" : "froid, avoir froid", "hint" : ""},
{"pinyin" : "lǐ", "simplified" : "裡", "traditional" : "里", "translation" : "à l’intérieur", "hint" : ""},
{"pinyin" : "líng", "simplified" : "零", "traditional" : "零", "translation" : "zéro, 0", "hint" : ""},
{"pinyin" : "liù", "simplified" : "六", "traditional" : "六", "translation" : "six, 6", "hint" : ""},
{"pinyin" : "māma", "simplified" : "媽媽", "traditional" : "妈妈", "translation" : "maman", "hint" : ""},
{"pinyin" : "ma", "simplified" : "嗎", "traditional" : "吗", "translation" : "particule interrogative", "hint" : ""},
{"pinyin" : "mǎi", "simplified" : "買", "traditional" : "买", "translation" : "acheter", "hint" : ""},
{"pinyin" : "māo", "simplified" : "貓", "traditional" : "猫", "translation" : "chat", "hint" : ""},
{"pinyin" : "méi", "simplified" : "沒", "traditional" : "没", "translation" : "négation du verbe ‘you’ avoir", "hint" : ""},
{"pinyin" : "méi guānxi", "simplified" : "沒關系", "traditional" : "没关系", "translation" : "peu importe, ce n’est pas grave", "hint" : ""},
{"pinyin" : "mǐfàn", "simplified" : "米飯", "traditional" : "米饭", "translation" : "riz", "hint" : ""},
{"pinyin" : "míngtiān", "simplified" : "明天", "traditional" : "明天", "translation" : "demain", "hint" : ""},
{"pinyin" : "míngzì", "simplified" : "名字", "traditional" : "名字", "translation" : "prénom (personne), nom (objet)", "hint" : ""},
{"pinyin" : "nǎr", "simplified" : "哪兒", "traditional" : "哪儿", "translation" : "où ?", "hint" : ""},
{"pinyin" : "nàr", "simplified" : "那兒", "traditional" : "那儿", "translation" : "là-bas", "hint" : ""},
{"pinyin" : "ne", "simplified" : "呢", "traditional" : "呢", "translation" : "particule interrogative", "hint" : ""},
{"pinyin" : "néng", "simplified" : "能", "traditional" : "能", "translation" : "pouvoir", "hint" : ""},
{"pinyin" : "nǐ", "simplified" : "你", "traditional" : "你", "translation" : "tu, toi", "hint" : ""},
{"pinyin" : "nián", "simplified" : "年", "traditional" : "年", "translation" : "année", "hint" : ""},
{"pinyin" : "nǚ’ér", "simplified" : "女兒", "traditional" : "女儿", "translation" : "fille", "hint" : ""},
{"pinyin" : "péngyou", "simplified" : "朋友", "traditional" : "朋友", "translation" : "ami", "hint" : ""},
{"pinyin" : "piàoliang", "simplified" : "漂亮", "traditional" : "漂亮", "translation" : "joli", "hint" : ""},
{"pinyin" : "píngguǒ", "simplified" : "蘋果", "traditional" : "苹果", "translation" : "pomme", "hint" : ""},
{"pinyin" : "qī", "simplified" : "七", "traditional" : "七", "translation" : "sept, 7", "hint" : ""},
{"pinyin" : "qián", "simplified" : "錢", "traditional" : "钱", "translation" : "argent", "hint" : ""},
{"pinyin" : "qiánmian", "simplified" : "前面", "traditional" : "前面", "translation" : "devant", "hint" : ""},
{"pinyin" : "qǐng", "simplified" : "請", "traditional" : "请", "translation" : "inviter, svp", "hint" : ""},
{"pinyin" : "qù", "simplified" : "去", "traditional" : "去", "translation" : "aller", "hint" : ""},
{"pinyin" : "rè", "simplified" : "熱", "traditional" : "热", "translation" : "chaud, avoid chaud", "hint" : ""},
{"pinyin" : "rén", "simplified" : "人", "traditional" : "人", "translation" : "homme, personne", "hint" : ""},
{"pinyin" : "rènshi", "simplified" : "認識", "traditional" : "认识", "translation" : "connaître, savoir", "hint" : ""},
{"pinyin" : "rì", "simplified" : "日", "traditional" : "日", "translation" : "soleil, jour", "hint" : ""},
{"pinyin" : "sān", "simplified" : "三", "traditional" : "三", "translation" : "trois, 3", "hint" : ""},
{"pinyin" : "shāngdiàn", "simplified" : "商店", "traditional" : "商店", "translation" : "magasin, boutique", "hint" : ""},
{"pinyin" : "shǎng", "simplified" : "上", "traditional" : "上", "translation" : "monter ; précédent", "hint" : ""},
{"pinyin" : "shàngwǔ", "simplified" : "上午", "traditional" : "上午", "translation" : "matin", "hint" : ""},
{"pinyin" : "shǎo", "simplified" : "少", "traditional" : "少", "translation" : "peu, peu nombreux", "hint" : ""},
{"pinyin" : "shuí", "simplified" : "誰", "traditional" : "谁", "translation" : "qui ?", "hint" : ""},
{"pinyin" : "shénme", "simplified" : "什麼", "traditional" : "什么", "translation" : "quoi ?", "hint" : ""},
{"pinyin" : "shí", "simplified" : "十", "traditional" : "十", "translation" : "dix, 10", "hint" : ""},
{"pinyin" : "shíhou", "simplified" : "時候", "traditional" : "时候", "translation" : "moment", "hint" : ""},
{"pinyin" : "shì", "simplified" : "是", "traditional" : "是", "translation" : "être", "hint" : ""},
{"pinyin" : "shū", "simplified" : "書", "traditional" : "书", "translation" : "livre", "hint" : ""},
{"pinyin" : "shuǐ", "simplified" : "水", "traditional" : "水", "translation" : "eau", "hint" : ""},
{"pinyin" : "shuǐguǒ", "simplified" : "水果", "traditional" : "水果", "translation" : "fruit", "hint" : ""},
{"pinyin" : "shuìjiào", "simplified" : "睡覺", "traditional" : "睡觉", "translation" : "dormir", "hint" : ""},
{"pinyin" : "shuōhuà", "simplified" : "說話", "traditional" : "说话", "translation" : "parler, dire", "hint" : ""},
{"pinyin" : "sì", "simplified" : "四", "traditional" : "四", "translation" : "quatre, 4", "hint" : ""},
{"pinyin" : "suì", "simplified" : "歲", "traditional" : "岁", "translation" : "âge, année d’âge", "hint" : ""},
{"pinyin" : "tā", "simplified" : "他", "traditional" : "他", "translation" : "il, lui", "hint" : ""},
{"pinyin" : "tā", "simplified" : "她", "traditional" : "她", "translation" : "elle", "hint" : ""},
{"pinyin" : "tài", "simplified" : "太", "traditional" : "太", "translation" : "trop, extrêmement", "hint" : ""},
{"pinyin" : "tiānqì", "simplified" : "天氣", "traditional" : "天气", "translation" : "temps, météo", "hint" : ""},
{"pinyin" : "tīng", "simplified" : "聽", "traditional" : "听", "translation" : "écouter, entendre ; canette", "hint" : ""},
{"pinyin" : "tóngxué", "simplified" : "同學", "traditional" : "同学", "translation" : "camarade", "hint" : ""},
{"pinyin" : "wèi", "simplified" : "喂", "traditional" : "喂", "translation" : "allô ; nourrir", "hint" : ""},
{"pinyin" : "wǒ", "simplified" : "我", "traditional" : "我", "translation" : "je, moi", "hint" : ""},
{"pinyin" : "wǒmen", "simplified" : "我們", "traditional" : "我们", "translation" : "nous", "hint" : ""},
{"pinyin" : "wǔ", "simplified" : "五", "traditional" : "五", "translation" : "cinq, 5", "hint" : ""},
{"pinyin" : "xǐhuan", "simplified" : "喜歡", "traditional" : "喜欢", "translation" : "aimer, apprécier", "hint" : ""},
{"pinyin" : "xià", "simplified" : "下", "traditional" : "下", "translation" : "descendre ; suivant", "hint" : ""},
{"pinyin" : "xiàwǔ", "simplified" : "下午", "traditional" : "下午", "translation" : "après-midi", "hint" : ""},
{"pinyin" : "xiàyǔ", "simplified" : "下雨", "traditional" : "下雨", "translation" : "pleuvoir", "hint" : ""},
{"pinyin" : "xiānsheng", "simplified" : "先生", "traditional" : "先生", "translation" : "monsieur ; mari", "hint" : ""},
{"pinyin" : "xiànzài", "simplified" : "現在", "traditional" : "现在", "translation" : "maintenant", "hint" : ""},
{"pinyin" : "xiǎng", "simplified" : "想", "traditional" : "想", "translation" : "penser ; avoir envie de", "hint" : ""},
{"pinyin" : "xiǎo", "simplified" : "小", "traditional" : "小", "translation" : "petit", "hint" : ""},
{"pinyin" : "xiǎojie", "simplified" : "小姐", "traditional" : "小姐", "translation" : "mademoiselle", "hint" : ""},
{"pinyin" : "xiē", "simplified" : "些", "traditional" : "些", "translation" : "quelques, plusieurs", "hint" : ""},
{"pinyin" : "xiě", "simplified" : "寫", "traditional" : "写", "translation" : "écrire", "hint" : ""},
{"pinyin" : "xièxie", "simplified" : "謝謝", "traditional" : "谢谢", "translation" : "merci, remercier", "hint" : ""},
{"pinyin" : "xīngqī", "simplified" : "星期", "traditional" : "星期", "translation" : "semaine", "hint" : ""},
{"pinyin" : "xuésheng", "simplified" : "學生", "traditional" : "学生", "translation" : "étudiant, écolier", "hint" : ""},
{"pinyin" : "xuéxí", "simplified" : "學習", "traditional" : "学习", "translation" : "étudier, apprendre", "hint" : ""},
{"pinyin" : "xuéxiào", "simplified" : "學校", "traditional" : "学校", "translation" : "école", "hint" : ""},
{"pinyin" : "yī", "simplified" : "一", "traditional" : "一", "translation" : "un, 1", "hint" : ""},
{"pinyin" : "yīfu", "simplified" : "衣服", "traditional" : "衣服", "translation" : "vêtement, habit", "hint" : ""},
{"pinyin" : "yīshēng", "simplified" : "醫生", "traditional" : "医生", "translation" : "docteur, médecin", "hint" : ""},
{"pinyin" : "yīyuàn", "simplified" : "醫院", "traditional" : "医院", "translation" : "hôpital", "hint" : ""},
{"pinyin" : "yǐzi", "simplified" : "椅子", "traditional" : "椅子", "translation" : "chaise", "hint" : ""},
{"pinyin" : "yǒu", "simplified" : "有", "traditional" : "有", "translation" : "avoir, y avoir", "hint" : ""},
{"pinyin" : "yuè", "simplified" : "月", "traditional" : "月", "translation" : "lune, mois", "hint" : ""},
{"pinyin" : "zài", "simplified" : "在", "traditional" : "在", "translation" : "se trouver, être quelque part", "hint" : ""},
{"pinyin" : "zàijiàn", "simplified" : "再見", "traditional" : "再见", "translation" : "au revoir", "hint" : ""},
{"pinyin" : "zěnme", "simplified" : "怎麼", "traditional" : "怎么", "translation" : "comment ?", "hint" : ""},
{"pinyin" : "zěnmeyàng", "simplified" : "怎麼樣", "traditional" : "怎么样", "translation" : "comment ça va ?", "hint" : ""},
{"pinyin" : "zhèr", "simplified" : "這兒", "traditional" : "这儿", "translation" : "ici", "hint" : ""},
{"pinyin" : "Zhōngguó", "simplified" : "中國", "traditional" : "中国", "translation" : "Chine", "hint" : ""},
{"pinyin" : "zhōngwǔ", "simplified" : "中午", "traditional" : "中午", "translation" : "midi", "hint" : ""},
{"pinyin" : "zhù", "simplified" : "住", "traditional" : "住", "translation" : "habiter", "hint" : ""},
{"pinyin" : "zhuōzi", "simplified" : "桌子", "traditional" : "桌子", "translation" : "table", "hint" : ""},
{"pinyin" : "zì", "simplified" : "字", "traditional" : "字", "translation" : "caractère, lettre", "hint" : ""},
{"pinyin" : "zuótiān", "simplified" : "昨天", "traditional" : "昨天", "translation" : "hier", "hint" : ""},
{"pinyin" : "zuò", "simplified" : "坐", "traditional" : "坐", "translation" : "s’asseoir", "hint" : ""},
{"pinyin" : "zuò", "simplified" : "做", "traditional" : "做", "translation" : "faire", "hint" : ""}
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
