'use strict';
import _commonsGameHelpers from './commons-gameHelpers.js';

const CHINESE_CHARACTERS_JSON = []; //Array of levels of array of words json objects

//TARGET (pinyin key for audio file for reading loud)  {	 "pinyin":"ān" , "traditionnal": "安", "simplified": "安, "translation" : "paix", "hint" : "femme sous toît"},
CHINESE_CHARACTERS_JSON[0]=[
    {
        "pinyin": "ān",
        "simplified": "安",
        "traditional": " 安",
        "translation": "paix",
        "hint": "femme sous toît",
        "audio": "a1n"
    },
    {
        "pinyin": "bàba",
        "simplified": "爸爸",
        "traditional": " 爸爸",
        "translation": "papa",
        "hint": "",
        "audio": "ba4ba"
    },
    {
        "pinyin": "māma",
        "simplified": "媽媽",
        "traditional": " 媽媽",
        "translation": "mère,maman",
        "hint": "genre féminin + puis le ma phonétique",
        "audio": "ma1ma"
    },
    {
        "pinyin": "dìdi",
        "simplified": "弟弟",
        "traditional": " 弟弟",
        "translation": "jeune frère",
        "hint": "",
        "audio": "di4di"
    },
    {
        "pinyin": "gēge",
        "simplified": "哥哥",
        "traditional": " 哥哥",
        "translation": "frère aîné",
        "hint": "",
        "audio": "ge1ge"
    },
    {
        "pinyin": "jiā",
        "simplified": "家",
        "traditional": " 家",
        "translation": "famille",
        "hint": "(toit|porc)",
        "audio": "jia1"
    },
    {
        "pinyin": "jiějie",
        "simplified": "姐姐",
        "traditional": " 姐姐",
        "translation": "grande sœur",
        "hint": "",
        "audio": "jie3jie"
    },
    {
        "pinyin": "mèimei",
        "simplified": "妹妹",
        "traditional": " 妹妹",
        "translation": "petite sœur",
        "hint": "",
        "audio": "me4imei"
    },
    {
        "pinyin": "zài",
        "simplified": "在",
        "traditional": " 在",
        "translation": "à,exister,en,dans",
        "hint": "",
        "audio": "za4i"
    },
    {
        "pinyin": "zhèlǐ",
        "simplified": "這里",
        "traditional": " 這里",
        "translation": "ici",
        "hint": "en désignant : ceci à l'intérieur (du village)",
        "audio": "zhe4li3"
    },
    {
        "pinyin": "nǎlǐ",
        "simplified": "哪里",
        "traditional": " 哪里",
        "translation": "là-bas",
        "hint": "où à l'intérieur du village",
        "audio": "na3li3"
    },
    {
        "pinyin": "Wǒ jiā zài zhèlǐ",
        "simplified": "我 家 在 這里",
        "traditional": " 我 家 在 這里",
        "translation": "Ma maison est ici.",
        "hint": "Je maison/foyer exister ici",
        "audio": "Wo3_jia1_za4i_zhe4li3"
    },
    {
        "pinyin": "nǎlǐ",
        "simplified": "哪里",
        "traditional": " 哪里",
        "translation": "là-bas",
        "hint": "où à l'interieur du vilage",
        "audio": "na3li3"
    },
    {
        "pinyin": "Nǐ jiā zài nǎlǐ?",
        "simplified": "你 家 在 哪里?",
        "traditional": " 你 家 在 哪里?",
        "translation": "Où se trouve ta maison?",
        "hint": "",
        "audio": "Ni3_jia1_za4i_na3li3"
    },
    {
        "pinyin": "zài",
        "simplified": "在",
        "traditional": " 在",
        "translation": "de nouveau",
        "hint": "",
        "audio": "za4i"
    },
    {
        "pinyin": "jiàn",
        "simplified": "見",
        "traditional": " 見",
        "translation": "voir",
        "hint": "clé de l'oeil actif!",
        "audio": "jia4n"
    },
    {
        "pinyin": "zàijiàn",
        "simplified": "再見",
        "traditional": " 再見",
        "translation": "Au revoir!",
        "hint": "de nouveau /  oeil",
        "audio": "za4ijia4n"
    },
    {
        "pinyin": "míngtiān jiàn",
        "simplified": "明天見",
        "traditional": " 明天見",
        "translation": "A demain",
        "hint": "se voir jour brillant",
        "audio": "mi2ngtia1n_jia4n"
    },
    {
        "pinyin": "míngtiān",
        "simplified": "明天",
        "traditional": " 明天",
        "translation": "demain",
        "hint": "brillant/le ciel au dessus de l'homme, le jour.",
        "audio": "mi2ngtia1n"
    },
    {
        "pinyin": "zǎo",
        "simplified": "早",
        "traditional": " 早",
        "translation": "matin",
        "hint": "soleil|petit déjeuner",
        "audio": "za3o"
    },
    {
        "pinyin": "zǎoān",
        "simplified": "早安",
        "traditional": " 早安",
        "translation": "bonjour (tôt le matin)",
        "hint": "matin|paix",
        "audio": "za3oa1n"
    },
    {
        "pinyin": "hǎo",
        "simplified": "好",
        "traditional": " 好",
        "translation": "bon",
        "hint": "femme+enfant=bon",
        "audio": "ha3o"
    },
    {
        "pinyin": "nǐ",
        "simplified": "你",
        "traditional": " 你",
        "translation": "tu,toi",
        "hint": "",
        "audio": "ni3"
    },
    {
        "pinyin": "nǐhǎo",
        "simplified": "你好",
        "traditional": " 你好",
        "translation": "toi, bonjour",
        "hint": "",
        "audio": "ni3ha3o"
    },
    {
        "pinyin": "tā",
        "simplified": "他 ",
        "traditional": " 他 ",
        "translation": "il/lui",
        "hint": "",
        "audio": "ta1"
    },
    {
        "pinyin": "tā",
        "simplified": "她",
        "traditional": " 她",
        "translation": "elle",
        "hint": "",
        "audio": "ta1"
    },
    {
        "pinyin": "bù",
        "simplified": "不",
        "traditional": " 不",
        "translation": "ne pas",
        "hint": "",
        "audio": "bu4"
    },
    {
        "pinyin": "wǒ",
        "simplified": "我",
        "traditional": " 我",
        "translation": "je,moi",
        "hint": "",
        "audio": "wo3"
    },
    {
        "pinyin": "xièxie",
        "simplified": "谢谢",
        "traditional": " 谢谢",
        "translation": "merci",
        "hint": "",
        "audio": "xie4xie"
    },
    {
        "pinyin": "xiǎo",
        "simplified": "小",
        "traditional": " 小",
        "translation": "petit",
        "hint": "",
        "audio": "xia3o"
    }
];
CHINESE_CHARACTERS_JSON[1]=[
    {
        "pinyin": "shì",
        "simplified": "是",
        "traditional": " 是",
        "translation": "être",
        "hint": "sous le soleil , exactement.",
        "audio": "shi4"
    },
    {
        "pinyin": "bù kèqì",
        "simplified": "不客氣",
        "traditional": " 不客氣",
        "translation": "pas de quoi",
        "hint": "(ne) pas , politesse",
        "audio": "bu4_ke4qi4"
    },
    {
        "pinyin": "jiào",
        "simplified": "叫",
        "traditional": " 叫",
        "translation": "s'appeler",
        "hint": "la clé bouche!",
        "audio": "jia4o"
    },
    {
        "pinyin": "shénme",
        "simplified": "什麽",
        "traditional": " 什麽",
        "translation": "quel",
        "hint": "",
        "audio": "she2nme"
    },
    {
        "pinyin": "míngzì",
        "simplified": "名字",
        "traditional": " 名字",
        "translation": "nom",
        "hint": "la clé bouche, réputation!",
        "audio": "mi2ngzi4"
    },
    {
        "pinyin": "nǐ jiào shénme míngzì?",
        "simplified": "你 叫 什麽 名字?",
        "traditional": " 你 叫 什麽 名字?",
        "translation": "Comment t'appelles-tu?",
        "hint": "toi s'appeler quel nom?",
        "audio": "ni3_jia4o_she2nme_mi2ngzi4"
    },
    {
        "pinyin": "wǒ jiào Xiǎomíng",
        "simplified": "我 叫 小明",
        "traditional": " 我 叫 小明",
        "translation": "Je m'appelle Xiăomíng",
        "hint": "",
        "audio": "wo3_jia4o_Xia3omi2ng"
    },
    {
        "pinyin": "tā jiào Dànián",
        "simplified": " 他 叫 大年",
        "traditional": "  他 叫 大年",
        "translation": "Il s'appelle Dànián",
        "hint": "",
        "audio": "ta1_jia4o_Da4nia2n"
    },
    {
        "pinyin": "míng",
        "simplified": "明 ",
        "traditional": " 明 ",
        "translation": "clair, lumineux",
        "hint": "soleil|lune",
        "audio": "mi2ng"
    },
    {
        "pinyin": "Xiǎomíng",
        "simplified": "小明",
        "traditional": " 小明",
        "translation": "Xiǎomíng (prénom)",
        "hint": "petit lumineux",
        "audio": "Xia3omi2ng"
    },
    {
        "pinyin": "Xiǎoxiāng",
        "simplified": "小香",
        "traditional": " 小香",
        "translation": "Xiǎoxiāng (prénom)",
        "hint": "petit parfumé",
        "audio": "Xia3oxia1ng"
    },
    {
        "pinyin": "xiāng",
        "simplified": "香",
        "traditional": " 香",
        "translation": "parfumé",
        "hint": "la bonne odeur du grain 禾 (hé) qui dore au soleil 日 (rì)",
        "audio": "xia1ng"
    },
    {
        "pinyin": "dà",
        "simplified": "大",
        "traditional": " 大",
        "translation": "grand,très",
        "hint": "Un homme 人 écartant grand les bras.",
        "audio": "da4"
    },
    {
        "pinyin": "nián",
        "simplified": "年",
        "traditional": " 年",
        "translation": "an, année",
        "hint": "",
        "audio": "nia2n"
    },
    {
        "pinyin": "Dànián",
        "simplified": "大年",
        "traditional": " 大年",
        "translation": "Dànián (prénom)",
        "hint": "",
        "audio": "Da4nia2n"
    },
    {
        "pinyin": "jiā",
        "simplified": "佳",
        "traditional": " 佳",
        "translation": "beau, joli",
        "hint": "",
        "audio": "jia1"
    },
    {
        "pinyin": "Jiājiā",
        "simplified": "佳佳",
        "traditional": " 佳佳",
        "translation": "prénom Jiājiā",
        "hint": "",
        "audio": "Jia1jia1"
    },
    {
        "pinyin": "péngyǒu",
        "simplified": "朋友",
        "traditional": " 朋友",
        "translation": "ami",
        "hint": "",
        "audio": "pe2ngyo3u"
    },
    {
        "pinyin": "péng",
        "simplified": "朋",
        "traditional": " 朋",
        "translation": "ami",
        "hint": "",
        "audio": "pe2ng"
    },
    {
        "pinyin": "yǒu",
        "simplified": "友",
        "traditional": " 友",
        "translation": "ami",
        "hint": "",
        "audio": "yo3u"
    },
    {
        "pinyin": "shéi",
        "simplified": "谁|誰",
        "traditional": " 谁|誰",
        "translation": "Qui?",
        "hint": "radical parole = demander qui? 2e partie = phonétique",
        "audio": "she2i"
    },
    {
        "pinyin": "tā shì shéi?",
        "simplified": "他 是 誰?",
        "traditional": " 他 是 誰?",
        "translation": "Qui est-il?",
        "hint": "Lui être qui?",
        "audio": "ta1_shi4_she2i"
    },
    {
        "pinyin": "tā shì wǒ māma",
        "simplified": "她 是 我 媽媽",
        "traditional": " 她 是 我 媽媽",
        "translation": "Elle est ma Maman",
        "hint": "",
        "audio": "ta1_shi4_wo3_ma1ma"
    },
    {
        "pinyin": "kè",
        "simplified": "课|課",
        "traditional": " 课|課",
        "translation": "leçon ",
        "hint": "dire cours (clé parole)",
        "audio": "ke4"
    },
    {
        "pinyin": "de",
        "simplified": "的",
        "traditional": " 的",
        "translation": "de (appartenance)",
        "hint": "",
        "audio": "de"
    },
    {
        "pinyin": "lǎoshī",
        "simplified": "老師",
        "traditional": " 老師",
        "translation": "professeur",
        "hint": "personne avec une canne",
        "audio": "la3oshi1"
    },
    {
        "pinyin": "háishì",
        "simplified": "還是",
        "traditional": " 還是",
        "translation": "ou bien encore être",
        "hint": "",
        "audio": "ha2ishi4"
    },
    {
        "pinyin": "hái",
        "simplified": "還",
        "traditional": " 還",
        "translation": "ou bien encore, en plus",
        "hint": "",
        "audio": "ha2i"
    },
    {
        "pinyin": "lǎoshī, wǒ zài zhèlǐ",
        "simplified": "老師, 我 再 這里",
        "traditional": " 老師, 我 再 這里",
        "translation": "Professeur, je suis ici!",
        "hint": "",
        "audio": "la3oshi1,_wo3_za4i_zhe4li3"
    },
    {
        "pinyin": "nǐ shì Xiǎomíng ma ?",
        "simplified": "你 是 小明 嗎?",
        "traditional": " 你 是 小明 嗎?",
        "translation": "Tu es Xiǎomíng n'est-ce pas?",
        "hint": "",
        "audio": "ni3_shi4_Xia3omi2ng_ma_"
    },
    {
        "pinyin": "ài",
        "simplified": "愛",
        "traditional": "爱",
        "translation": "aimer, amour",
        "hint": "",
        "audio": "a4i"
    },
    {
        "pinyin": "bā",
        "simplified": "八",
        "traditional": "八",
        "translation": "huit, 8",
        "hint": "",
        "audio": "ba1"
    },
    {
        "pinyin": "bàba",
        "simplified": "爸爸",
        "traditional": "爸爸",
        "translation": "papa",
        "hint": "",
        "audio": "ba4ba"
    },
    {
        "pinyin": "bēizi",
        "simplified": "杯子",
        "traditional": "杯子",
        "translation": "verre, tasse",
        "hint": "",
        "audio": "be1izi"
    },
    {
        "pinyin": "Běijīng",
        "simplified": "北京",
        "traditional": "北京",
        "translation": "Beijing, Pékin",
        "hint": "",
        "audio": "Be3iji1ng"
    },
    {
        "pinyin": "běn",
        "simplified": "本",
        "traditional": "本",
        "translation": "classificateur pour livre",
        "hint": "",
        "audio": "be3n"
    },
    {
        "pinyin": "bù kèqi",
        "simplified": "不客氣",
        "traditional": "不客气",
        "translation": "je vous en prie",
        "hint": "",
        "audio": "bu4_ke4qi"
    },
    {
        "pinyin": "bù",
        "simplified": "不",
        "traditional": "不",
        "translation": "non, particule négative",
        "hint": "",
        "audio": "bu4"
    },
    {
        "pinyin": "cài",
        "simplified": "菜",
        "traditional": "菜",
        "translation": "légume, plat",
        "hint": "",
        "audio": "ca4i"
    },
    {
        "pinyin": "chá",
        "simplified": "茶",
        "traditional": "茶",
        "translation": "thé",
        "hint": "",
        "audio": "cha2"
    },
    {
        "pinyin": "chī",
        "simplified": "吃",
        "traditional": "吃",
        "translation": "manger",
        "hint": "",
        "audio": "chi1"
    },
    {
        "pinyin": "chūzūchē",
        "simplified": "出租車",
        "traditional": "出租车",
        "translation": "taxi",
        "hint": "",
        "audio": "chu1zu1che1"
    },
    {
        "pinyin": "dǎ diànhuà",
        "simplified": "打電話",
        "traditional": "打电话",
        "translation": "téléphoner",
        "hint": "",
        "audio": "da3_dia4nhua4"
    },
    {
        "pinyin": "dà",
        "simplified": "大",
        "traditional": "大",
        "translation": "grand",
        "hint": "",
        "audio": "da4"
    },
    {
        "pinyin": "de",
        "simplified": "的",
        "traditional": "的",
        "translation": "particule de détermination",
        "hint": "",
        "audio": "de"
    },
    {
        "pinyin": "diǎn",
        "simplified": "點",
        "traditional": "点",
        "translation": "point, heure",
        "hint": "",
        "audio": "dia3n"
    },
    {
        "pinyin": "diànnǎo",
        "simplified": "電腦",
        "traditional": "电脑",
        "translation": "ordinateur",
        "hint": "",
        "audio": "dia4nna3o"
    },
    {
        "pinyin": "diànshì",
        "simplified": "電視",
        "traditional": "电视",
        "translation": "télévision",
        "hint": "",
        "audio": "dia4nshi4"
    },
    {
        "pinyin": "diànyǐng",
        "simplified": "電影",
        "traditional": "电影",
        "translation": "film, cinéma",
        "hint": "",
        "audio": "dia4nyi3ng"
    },
    {
        "pinyin": "dōngxi",
        "simplified": "東西",
        "traditional": "东西",
        "translation": "chose, objet",
        "hint": "",
        "audio": "do1ngxi"
    },
    {
        "pinyin": "dōu",
        "simplified": "都",
        "traditional": "都",
        "translation": "tout, tous",
        "hint": "",
        "audio": "do1u"
    },
    {
        "pinyin": "dú",
        "simplified": "讀",
        "traditional": "读",
        "translation": "lire, étudier",
        "hint": "",
        "audio": "du2"
    },
    {
        "pinyin": "duìbuqǐ",
        "simplified": "對不起",
        "traditional": "对不起",
        "translation": "désolé, pardon",
        "hint": "",
        "audio": "dui4buqi3"
    },
    {
        "pinyin": "duō",
        "simplified": "多",
        "traditional": "多",
        "translation": "beaucoup",
        "hint": "",
        "audio": "duo1"
    },
    {
        "pinyin": "duōshǎo",
        "simplified": "多少",
        "traditional": "多少",
        "translation": "combien ? (plus de 10)",
        "hint": "",
        "audio": "duo1sha3o"
    },
    {
        "pinyin": "érzi",
        "simplified": "兒子",
        "traditional": "儿子",
        "translation": "fils",
        "hint": "",
        "audio": "e2rzi"
    },
    {
        "pinyin": "èr",
        "simplified": "二",
        "traditional": "二",
        "translation": "deux, 2",
        "hint": "",
        "audio": "e4r"
    },
    {
        "pinyin": "fànguǎnr",
        "simplified": "飯館兒",
        "traditional": "饭馆儿",
        "translation": "restaurant",
        "hint": "",
        "audio": "fa4ngua3nr"
    },
    {
        "pinyin": "fēijī",
        "simplified": "飛機",
        "traditional": "飞机",
        "translation": "avion",
        "hint": "",
        "audio": "fe1iji1"
    },
    {
        "pinyin": "fēnzhōng",
        "simplified": "分鐘",
        "traditional": "分钟",
        "translation": "minute (d’horloge)",
        "hint": "",
        "audio": "fe1nzho1ng"
    },
    {
        "pinyin": "gāoxìng",
        "simplified": "高興",
        "traditional": "高兴",
        "translation": "content",
        "hint": "",
        "audio": "ga1oxi4ng"
    },
    {
        "pinyin": "gè",
        "simplified": "個",
        "traditional": "个",
        "translation": "classificateur générique",
        "hint": "",
        "audio": "ge4"
    },
    {
        "pinyin": "gōngzuò",
        "simplified": "工作",
        "traditional": "工作",
        "translation": "travailler, travail",
        "hint": "",
        "audio": "go1ngzuo4"
    },
    {
        "pinyin": "gǒu",
        "simplified": "狗",
        "traditional": "狗",
        "translation": "chien",
        "hint": "",
        "audio": "go3u"
    },
    {
        "pinyin": "Hànyǔ",
        "simplified": "漢語",
        "traditional": "汉语",
        "translation": "chinois (langue chinoise)",
        "hint": "",
        "audio": "Ha4nyu3"
    },
    {
        "pinyin": "hāo",
        "simplified": "好",
        "traditional": "好",
        "translation": "bien, bon",
        "hint": "",
        "audio": "ha1o"
    },
    {
        "pinyin": "hē",
        "simplified": "喝",
        "traditional": "喝",
        "translation": "boire",
        "hint": "",
        "audio": "he1"
    },
    {
        "pinyin": "hé",
        "simplified": "和",
        "traditional": "和",
        "translation": "et",
        "hint": "",
        "audio": "he2"
    },
    {
        "pinyin": "hěn",
        "simplified": "很",
        "traditional": "很",
        "translation": "très",
        "hint": "",
        "audio": "he3n"
    },
    {
        "pinyin": "hòumiàn",
        "simplified": "后面",
        "traditional": "后面",
        "translation": "derrière",
        "hint": "",
        "audio": "ho4umia4n"
    },
    {
        "pinyin": "huí",
        "simplified": "回",
        "traditional": "回",
        "translation": "revenir, retourner ; fois",
        "hint": "",
        "audio": "hui2"
    },
    {
        "pinyin": "huì",
        "simplified": "會",
        "traditional": "会",
        "translation": "savoir, pouvoir faire",
        "hint": "",
        "audio": "hui4"
    },
    {
        "pinyin": "huǒchēzhàn",
        "simplified": "火車站",
        "traditional": "火车站",
        "translation": "gare ferroviaire",
        "hint": "",
        "audio": "huo3che1zha4n"
    },
    {
        "pinyin": "jǐ",
        "simplified": "幾",
        "traditional": "几",
        "translation": "combien ? (1 à 10)",
        "hint": "",
        "audio": "ji3"
    },
    {
        "pinyin": "jiā",
        "simplified": "家",
        "traditional": "家",
        "translation": "maison, famille ; classificateur",
        "hint": "",
        "audio": "jia1"
    },
    {
        "pinyin": "jiào",
        "simplified": "叫",
        "traditional": "叫",
        "translation": "appeler",
        "hint": "",
        "audio": "jia4o"
    },
    {
        "pinyin": "jīntiān",
        "simplified": "今天",
        "traditional": "今天",
        "translation": "aujourd’hui",
        "hint": "",
        "audio": "ji1ntia1n"
    },
    {
        "pinyin": "jiǔ",
        "simplified": "九",
        "traditional": "九",
        "translation": "neuf, 9",
        "hint": "",
        "audio": "jiu3"
    },
    {
        "pinyin": "kāi",
        "simplified": "開",
        "traditional": "开",
        "translation": "ouvrir, conduire",
        "hint": "",
        "audio": "ka1i"
    },
    {
        "pinyin": "kān",
        "simplified": "看",
        "traditional": "看",
        "translation": "regarder, voir",
        "hint": "",
        "audio": "ka1n"
    },
    {
        "pinyin": "kànjian",
        "simplified": "看見",
        "traditional": "看见",
        "translation": "voir, apercevoir",
        "hint": "",
        "audio": "ka4njian"
    },
    {
        "pinyin": "kuài",
        "simplified": "塊",
        "traditional": "块",
        "translation": "morceau ; classificateur",
        "hint": "",
        "audio": "kua4i"
    },
    {
        "pinyin": "lái",
        "simplified": "來",
        "traditional": "来",
        "translation": "venir",
        "hint": "",
        "audio": "la2i"
    },
    {
        "pinyin": "lǎoshī",
        "simplified": "老師",
        "traditional": "老师",
        "translation": "enseignant, professeur",
        "hint": "",
        "audio": "la3oshi1"
    },
    {
        "pinyin": "le",
        "simplified": "了",
        "traditional": "了",
        "translation": "particule grammaticale",
        "hint": "",
        "audio": "le"
    },
    {
        "pinyin": "lěng",
        "simplified": "冷",
        "traditional": "冷",
        "translation": "froid, avoir froid",
        "hint": "",
        "audio": "le3ng"
    },
    {
        "pinyin": "lǐ",
        "simplified": "裡",
        "traditional": "里",
        "translation": "à l’intérieur",
        "hint": "",
        "audio": "li3"
    },
    {
        "pinyin": "líng",
        "simplified": "零",
        "traditional": "零",
        "translation": "zéro, 0",
        "hint": "",
        "audio": "li2ng"
    },
    {
        "pinyin": "liù",
        "simplified": "六",
        "traditional": "六",
        "translation": "six, 6",
        "hint": "",
        "audio": "liu4"
    },
    {
        "pinyin": "māma",
        "simplified": "媽媽",
        "traditional": "妈妈",
        "translation": "maman",
        "hint": "",
        "audio": "ma1ma"
    },
    {
        "pinyin": "ma",
        "simplified": "嗎",
        "traditional": "吗",
        "translation": "particule interrogative",
        "hint": "",
        "audio": "ma"
    },
    {
        "pinyin": "mǎi",
        "simplified": "買",
        "traditional": "买",
        "translation": "acheter",
        "hint": "",
        "audio": "ma3i"
    },
    {
        "pinyin": "māo",
        "simplified": "貓",
        "traditional": "猫",
        "translation": "chat",
        "hint": "",
        "audio": "ma1o"
    },
    {
        "pinyin": "méi",
        "simplified": "沒",
        "traditional": "没",
        "translation": "négation du verbe ‘you’ avoir",
        "hint": "",
        "audio": "me2i"
    },
    {
        "pinyin": "méi guānxi",
        "simplified": "沒關系",
        "traditional": "没关系",
        "translation": "peu importe, ce n’est pas grave",
        "hint": "",
        "audio": "me2i_gua1nxi"
    },
    {
        "pinyin": "mǐfàn",
        "simplified": "米飯",
        "traditional": "米饭",
        "translation": "riz",
        "hint": "",
        "audio": "mi3fa4n"
    },
    {
        "pinyin": "míngtiān",
        "simplified": "明天",
        "traditional": "明天",
        "translation": "demain",
        "hint": "",
        "audio": "mi2ngtia1n"
    },
    {
        "pinyin": "míngzi",
        "simplified": "名字",
        "traditional": "名字",
        "translation": "prénom (personne), nom (objet)",
        "hint": "",
        "audio": "mi2ngzi"
    },
    {
        "pinyin": "nǎr",
        "simplified": "哪兒",
        "traditional": "哪儿",
        "translation": "où ?",
        "hint": "",
        "audio": "na3r"
    },
    {
        "pinyin": "nàr",
        "simplified": "那兒",
        "traditional": "那儿",
        "translation": "là-bas",
        "hint": "",
        "audio": "na4r"
    },
    {
        "pinyin": "ne",
        "simplified": "呢",
        "traditional": "呢",
        "translation": "particule interrogative",
        "hint": "",
        "audio": "ne"
    },
    {
        "pinyin": "néng",
        "simplified": "能",
        "traditional": "能",
        "translation": "pouvoir",
        "hint": "",
        "audio": "ne2ng"
    },
    {
        "pinyin": "nǐ",
        "simplified": "你",
        "traditional": "你",
        "translation": "tu, toi",
        "hint": "",
        "audio": "ni3"
    },
    {
        "pinyin": "nián",
        "simplified": "年",
        "traditional": "年",
        "translation": "année",
        "hint": "",
        "audio": "nia2n"
    },
    {
        "pinyin": "nǚ’ér",
        "simplified": "女兒",
        "traditional": "女儿",
        "translation": "fille",
        "hint": "",
        "audio": "nuu3’e2r"
    },
    {
        "pinyin": "péngyou",
        "simplified": "朋友",
        "traditional": "朋友",
        "translation": "ami",
        "hint": "",
        "audio": "pe2ngyou"
    },
    {
        "pinyin": "piàoliang",
        "simplified": "漂亮",
        "traditional": "漂亮",
        "translation": "joli",
        "hint": "",
        "audio": "pia4oliang"
    },
    {
        "pinyin": "píngguǒ",
        "simplified": "蘋果",
        "traditional": "苹果",
        "translation": "pomme",
        "hint": "",
        "audio": "pi2ngguo3"
    },
    {
        "pinyin": "qī",
        "simplified": "七",
        "traditional": "七",
        "translation": "sept, 7",
        "hint": "",
        "audio": "qi1"
    },
    {
        "pinyin": "qián",
        "simplified": "錢",
        "traditional": "钱",
        "translation": "argent",
        "hint": "",
        "audio": "qia2n"
    },
    {
        "pinyin": "qiánmian",
        "simplified": "前面",
        "traditional": "前面",
        "translation": "devant",
        "hint": "",
        "audio": "qia2nmian"
    },
    {
        "pinyin": "qǐng",
        "simplified": "請",
        "traditional": "请",
        "translation": "inviter, svp",
        "hint": "",
        "audio": "qi3ng"
    },
    {
        "pinyin": "qù",
        "simplified": "去",
        "traditional": "去",
        "translation": "aller",
        "hint": "",
        "audio": "qu4"
    },
    {
        "pinyin": "rè",
        "simplified": "熱",
        "traditional": "热",
        "translation": "chaud, avoid chaud",
        "hint": "",
        "audio": "re4"
    },
    {
        "pinyin": "rén",
        "simplified": "人",
        "traditional": "人",
        "translation": "homme, personne",
        "hint": "",
        "audio": "re2n"
    },
    {
        "pinyin": "rènshi",
        "simplified": "認識",
        "traditional": "认识",
        "translation": "connaître, savoir",
        "hint": "",
        "audio": "re4nshi"
    },
    {
        "pinyin": "rì",
        "simplified": "日",
        "traditional": "日",
        "translation": "soleil, jour",
        "hint": "",
        "audio": "ri4"
    },
    {
        "pinyin": "sān",
        "simplified": "三",
        "traditional": "三",
        "translation": "trois, 3",
        "hint": "",
        "audio": "sa1n"
    },
    {
        "pinyin": "shāngdiàn",
        "simplified": "商店",
        "traditional": "商店",
        "translation": "magasin, boutique",
        "hint": "",
        "audio": "sha1ngdia4n"
    },
    {
        "pinyin": "shǎng",
        "simplified": "上",
        "traditional": "上",
        "translation": "monter ; précédent",
        "hint": "",
        "audio": "sha3ng"
    },
    {
        "pinyin": "shàngwǔ",
        "simplified": "上午",
        "traditional": "上午",
        "translation": "matin",
        "hint": "",
        "audio": "sha4ngwu3"
    },
    {
        "pinyin": "shǎo",
        "simplified": "少",
        "traditional": "少",
        "translation": "peu, peu nombreux",
        "hint": "",
        "audio": "sha3o"
    },
    {
        "pinyin": "shuí",
        "simplified": "誰",
        "traditional": "谁",
        "translation": "qui ?",
        "hint": "",
        "audio": "shui2"
    },
    {
        "pinyin": "shénme",
        "simplified": "什麼",
        "traditional": "什么",
        "translation": "quoi ?",
        "hint": "",
        "audio": "she2nme"
    },
    {
        "pinyin": "shí",
        "simplified": "十",
        "traditional": "十",
        "translation": "dix, 10",
        "hint": "",
        "audio": "shi2"
    },
    {
        "pinyin": "shíhou",
        "simplified": "時候",
        "traditional": "时候",
        "translation": "moment",
        "hint": "",
        "audio": "shi2hou"
    },
    {
        "pinyin": "shì",
        "simplified": "是",
        "traditional": "是",
        "translation": "être",
        "hint": "",
        "audio": "shi4"
    },
    {
        "pinyin": "shū",
        "simplified": "書",
        "traditional": "书",
        "translation": "livre",
        "hint": "",
        "audio": "shu1"
    },
    {
        "pinyin": "shuǐ",
        "simplified": "水",
        "traditional": "水",
        "translation": "eau",
        "hint": "",
        "audio": "shui3"
    },
    {
        "pinyin": "shuǐguǒ",
        "simplified": "水果",
        "traditional": "水果",
        "translation": "fruit",
        "hint": "",
        "audio": "shui3guo3"
    },
    {
        "pinyin": "shuìjiào",
        "simplified": "睡覺",
        "traditional": "睡觉",
        "translation": "dormir",
        "hint": "",
        "audio": "shui4jia4o"
    },
    {
        "pinyin": "shuōhuà",
        "simplified": "說話",
        "traditional": "说话",
        "translation": "parler, dire",
        "hint": "",
        "audio": "shuo1hua4"
    },
    {
        "pinyin": "sì",
        "simplified": "四",
        "traditional": "四",
        "translation": "quatre, 4",
        "hint": "",
        "audio": "si4"
    },
    {
        "pinyin": "suì",
        "simplified": "歲",
        "traditional": "岁",
        "translation": "âge, année d’âge",
        "hint": "",
        "audio": "sui4"
    },
    {
        "pinyin": "tā",
        "simplified": "他",
        "traditional": "他",
        "translation": "il, lui",
        "hint": "",
        "audio": "ta1"
    },
    {
        "pinyin": "tā",
        "simplified": "她",
        "traditional": "她",
        "translation": "elle",
        "hint": "",
        "audio": "ta1"
    },
    {
        "pinyin": "tài",
        "simplified": "太",
        "traditional": "太",
        "translation": "trop, extrêmement",
        "hint": "",
        "audio": "ta4i"
    },
    {
        "pinyin": "tiānqì",
        "simplified": "天氣",
        "traditional": "天气",
        "translation": "temps, météo",
        "hint": "",
        "audio": "tia1nqi4"
    },
    {
        "pinyin": "tīng",
        "simplified": "聽",
        "traditional": "听",
        "translation": "écouter, entendre ; canette",
        "hint": "",
        "audio": "ti1ng"
    },
    {
        "pinyin": "tóngxué",
        "simplified": "同學",
        "traditional": "同学",
        "translation": "camarade",
        "hint": "",
        "audio": "to2ngxue2"
    },
    {
        "pinyin": "wèi",
        "simplified": "喂",
        "traditional": "喂",
        "translation": "allô ; nourrir",
        "hint": "",
        "audio": "we4i"
    },
    {
        "pinyin": "wǒ",
        "simplified": "我",
        "traditional": "我",
        "translation": "je, moi",
        "hint": "",
        "audio": "wo3"
    },
    {
        "pinyin": "wǒmen",
        "simplified": "我們",
        "traditional": "我们",
        "translation": "nous",
        "hint": "",
        "audio": "wo3men"
    },
    {
        "pinyin": "wǔ",
        "simplified": "五",
        "traditional": "五",
        "translation": "cinq, 5",
        "hint": "",
        "audio": "wu3"
    },
    {
        "pinyin": "xǐhuan",
        "simplified": "喜歡",
        "traditional": "喜欢",
        "translation": "aimer, apprécier",
        "hint": "",
        "audio": "xi3huan"
    },
    {
        "pinyin": "xià",
        "simplified": "下",
        "traditional": "下",
        "translation": "descendre ; suivant",
        "hint": "",
        "audio": "xia4"
    },
    {
        "pinyin": "xiàwǔ",
        "simplified": "下午",
        "traditional": "下午",
        "translation": "après-midi",
        "hint": "",
        "audio": "xia4wu3"
    },
    {
        "pinyin": "xiàyǔ",
        "simplified": "下雨",
        "traditional": "下雨",
        "translation": "pleuvoir",
        "hint": "",
        "audio": "xia4yu3"
    },
    {
        "pinyin": "xiānsheng",
        "simplified": "先生",
        "traditional": "先生",
        "translation": "monsieur ; mari",
        "hint": "",
        "audio": "xia1nsheng"
    },
    {
        "pinyin": "xiànzài",
        "simplified": "現在",
        "traditional": "现在",
        "translation": "maintenant",
        "hint": "",
        "audio": "xia4nza4i"
    },
    {
        "pinyin": "xiǎng",
        "simplified": "想",
        "traditional": "想",
        "translation": "penser ; avoir envie de",
        "hint": "",
        "audio": "xia3ng"
    },
    {
        "pinyin": "xiǎo",
        "simplified": "小",
        "traditional": "小",
        "translation": "petit",
        "hint": "",
        "audio": "xia3o"
    },
    {
        "pinyin": "xiǎojie",
        "simplified": "小姐",
        "traditional": "小姐",
        "translation": "mademoiselle",
        "hint": "",
        "audio": "xia3ojie"
    },
    {
        "pinyin": "xiē",
        "simplified": "些",
        "traditional": "些",
        "translation": "quelques, plusieurs",
        "hint": "",
        "audio": "xie1"
    },
    {
        "pinyin": "xiě",
        "simplified": "寫",
        "traditional": "写",
        "translation": "écrire",
        "hint": "",
        "audio": "xie3"
    },
    {
        "pinyin": "xièxie",
        "simplified": "謝謝",
        "traditional": "谢谢",
        "translation": "merci, remercier",
        "hint": "",
        "audio": "xie4xie"
    },
    {
        "pinyin": "xīngqī",
        "simplified": "星期",
        "traditional": "星期",
        "translation": "semaine",
        "hint": "",
        "audio": "xi1ngqi1"
    },
    {
        "pinyin": "xuésheng",
        "simplified": "學生",
        "traditional": "学生",
        "translation": "étudiant, écolier",
        "hint": "",
        "audio": "xue2sheng"
    },
    {
        "pinyin": "xuéxí",
        "simplified": "學習",
        "traditional": "学习",
        "translation": "étudier, apprendre",
        "hint": "",
        "audio": "xue2xi2"
    },
    {
        "pinyin": "xuéxiào",
        "simplified": "學校",
        "traditional": "学校",
        "translation": "école",
        "hint": "",
        "audio": "xue2xia4o"
    },
    {
        "pinyin": "yī",
        "simplified": "一",
        "traditional": "一",
        "translation": "un, 1",
        "hint": "",
        "audio": "yi1"
    },
    {
        "pinyin": "yīfu",
        "simplified": "衣服",
        "traditional": "衣服",
        "translation": "vêtement, habit",
        "hint": "",
        "audio": "yi1fu"
    },
    {
        "pinyin": "yīshēng",
        "simplified": "醫生",
        "traditional": "医生",
        "translation": "docteur, médecin",
        "hint": "",
        "audio": "yi1she1ng"
    },
    {
        "pinyin": "yīyuàn",
        "simplified": "醫院",
        "traditional": "医院",
        "translation": "hôpital",
        "hint": "",
        "audio": "yi1yua4n"
    },
    {
        "pinyin": "yǐzi",
        "simplified": "椅子",
        "traditional": "椅子",
        "translation": "chaise",
        "hint": "",
        "audio": "yi3zi"
    },
    {
        "pinyin": "yǒu",
        "simplified": "有",
        "traditional": "有",
        "translation": "avoir, y avoir",
        "hint": "",
        "audio": "yo3u"
    },
    {
        "pinyin": "yuè",
        "simplified": "月",
        "traditional": "月",
        "translation": "lune, mois",
        "hint": "",
        "audio": "yue4"
    },
    {
        "pinyin": "zài",
        "simplified": "在",
        "traditional": "在",
        "translation": "se trouver, être quelque part",
        "hint": "",
        "audio": "za4i"
    },
    {
        "pinyin": "zàijiàn",
        "simplified": "再見",
        "traditional": "再见",
        "translation": "au revoir",
        "hint": "",
        "audio": "za4ijia4n"
    },
    {
        "pinyin": "zěnme",
        "simplified": "怎麼",
        "traditional": "怎么",
        "translation": "comment ?",
        "hint": "",
        "audio": "ze3nme"
    },
    {
        "pinyin": "zěnmeyàng",
        "simplified": "怎麼樣",
        "traditional": "怎么样",
        "translation": "comment ça va ?",
        "hint": "",
        "audio": "ze3nmeya4ng"
    },
    {
        "pinyin": "zhèr",
        "simplified": "這兒",
        "traditional": "这儿",
        "translation": "ici",
        "hint": "",
        "audio": "zhe4r"
    },
    {
        "pinyin": "Zhōngguó",
        "simplified": "中國",
        "traditional": "中国",
        "translation": "Chine",
        "hint": "",
        "audio": "Zho1ngguo2"
    },
    {
        "pinyin": "zhōngwǔ",
        "simplified": "中午",
        "traditional": "中午",
        "translation": "midi",
        "hint": "",
        "audio": "zho1ngwu3"
    },
    {
        "pinyin": "zhù",
        "simplified": "住",
        "traditional": "住",
        "translation": "habiter",
        "hint": "",
        "audio": "zhu4"
    },
    {
        "pinyin": "zhuōzi",
        "simplified": "桌子",
        "traditional": "桌子",
        "translation": "table",
        "hint": "",
        "audio": "zhuo1zi"
    },
    {
        "pinyin": "zì",
        "simplified": "字",
        "traditional": "字",
        "translation": "caractère, lettre",
        "hint": "",
        "audio": "zi4"
    },
    {
        "pinyin": "zuótiān",
        "simplified": "昨天",
        "traditional": "昨天",
        "translation": "hier",
        "hint": "",
        "audio": "zuo2tia1n"
    },
    {
        "pinyin": "zuò",
        "simplified": "坐",
        "traditional": "坐",
        "translation": "s’asseoir",
        "hint": "",
        "audio": "zuo4"
    },
    {
        "pinyin": "zuò",
        "simplified": "做",
        "traditional": "做",
        "translation": "faire",
        "hint": "",
        "audio": "zuo4"
    }
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
	// TODO : correct here to go plunge in formal levels such as defined by delta unused further in this code at present time
	
	if (levelIndex > 1 && levelIndex < MAX_LEVEL_GUESSCHARACTER_GAME) {
			var delta = -1;
			if(random %2 == 0) delta = 1;
			return levelIndex + delta;	
	}
	else if (levelIndex < MAX_LEVEL_GUESSCHARACTER_GAME) {
			return levelIndex;
	}
	else if (levelIndex > 1) { return (levelIndex -1); }
	else return 1 ; //Default value

}

function getNextRandomCharacter(_level) {
    var levelIndex = Object.keys(_commonsGameHelpers.levels).indexOf(_level);
        
	if (levelIndex == null || levelIndex < 0 || levelIndex > MAX_LEVEL_GUESSCHARACTER_GAME) {
		var randomIndex=Math.floor((Math.random()*100000)) % TOTAL_NB_ELEMENTS;
		console.debug("Method " , getNextRandomCharacter.name, " NB TOTAL ELEMENTS: " ,TOTAL_NB_ELEMENTS);
		var currentIndex =0;
		for (var i=1; i< CHINESE_CHARACTERS_JSON.length; i++) {
			if(randomIndex < CHINESE_CHARACTERS_JSON[i].length) {return CHINESE_CHARACTERS_JSON[i][randomIndex];}
			else { randomIndex -= CHINESE_CHARACTERS_JSON[i].length;  }		
		}	
	}
	
	// level is OK in good boundaries
	var _levelIndex = pickLevelIndexRandom(levelIndex);
	return CHINESE_CHARACTERS_JSON[_levelIndex][Math.floor((Math.random() *100000)) % CHINESE_CHARACTERS_JSON[_levelIndex].length];
}


 function getRandomSuggestedAnswersCharacter(nextCharacter, _level, _nbSuggestions) {
    var levelIndex = Object.keys(_commonsGameHelpers.levels).indexOf(_level);
    
	var suggestions = [];
	
	if (_nbSuggestions == null || !parseInt(_nbSuggestions) || _nbSuggestions < 2 || _nbSuggestions > 10) {
		console.log("nbSuggestions is invalid number");
		throw("Error : invalid nbSuggestion");
	}
	else {
		var c ;
		for(var i=0; i<_nbSuggestions; i++) {
			c=getNextRandomCharacter(levelIndex);
			suggestions.push(c);
		}
	}
	
	return suggestions;
	
 }

export default {CHINESE_CHARACTERS_JSON , getNextRandomCharacter, getRandomSuggestedAnswersCharacter};
