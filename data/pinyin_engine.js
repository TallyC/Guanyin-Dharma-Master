window.PinyinEngine = (() => {
const ZHUYIN_TO_PINYIN_MAP = {
  // 聲母 + 韻母完整音節映射 (無調號 base syllable)
  // 單韻母與雙韻母
  "ㄚ": "a", "ㄛ": "o", "ㄜ": "e", "ㄝ": "e", "ㄞ": "ai", "ㄟ": "ei", "ㄠ": "ao", "ㄡ": "ou",
  "ㄢ": "an", "ㄣ": "en", "ㄤ": "ang", "ㄥ": "eng", "ㄦ": "er",
  "ㄧ": "yi", "ㄨ": "wu", "ㄩ": "yu",
  "ㄧㄚ": "ya", "ㄧㄛ": "yo", "ㄧㄝ": "ye", "ㄧㄞ": "yai", "ㄧㄠ": "yao", "ㄧㄡ": "you",
  "ㄧㄢ": "yan", "ㄧㄣ": "yin", "ㄧㄤ": "yang", "ㄧㄥ": "ying",
  "ㄨㄚ": "wa", "ㄨㄛ": "wo", "ㄨㄞ": "wai", "ㄨㄟ": "wei", "ㄨㄢ": "wan", "ㄨㄣ": "wen", "ㄨㄤ": "wang", "ㄨㄥ": "weng",
  "ㄩㄝ": "yue", "ㄩㄢ": "yuan", "ㄩㄣ": "yun", "ㄩㄥ": "yong",
  
  // ㄅ
  "ㄅㄚ": "ba", "ㄅㄛ": "bo", "ㄅㄞ": "bai", "ㄅㄟ": "bei", "ㄅㄠ": "bao", "ㄅㄢ": "ban", "ㄅㄣ": "ben", "ㄅㄤ": "bang", "ㄅㄥ": "beng",
  "ㄅㄧ": "bi", "ㄅㄧㄝ": "bie", "ㄅㄧㄠ": "biao", "ㄅㄧㄢ": "bian", "ㄅㄧㄣ": "bin", "ㄅㄧㄥ": "bing",
  "ㄅㄨ": "bu",
  
  // ㄆ
  "ㄆㄚ": "pa", "ㄆㄛ": "po", "ㄆㄞ": "pai", "ㄆㄟ": "pei", "ㄆㄠ": "pao", "ㄆㄡ": "pou", "ㄆㄢ": "pan", "ㄆㄣ": "pen", "ㄆㄤ": "pang", "ㄆㄥ": "peng",
  "ㄆㄧ": "pi", "ㄆㄧㄝ": "pie", "ㄆㄧㄠ": "piao", "ㄆㄧㄢ": "pian", "ㄆㄧㄣ": "pin", "ㄆㄧㄥ": "ping",
  "ㄆㄨ": "pu",

  // ㄇ
  "ㄇㄚ": "ma", "ㄇㄛ": "mo", "ㄇㄜ": "me", "ㄇㄞ": "mai", "ㄇㄟ": "mei", "ㄇㄠ": "mao", "ㄇㄡ": "mou", "ㄇㄢ": "man", "ㄇㄣ": "men", "ㄇㄤ": "mang", "ㄇㄥ": "meng",
  "ㄇㄧ": "mi", "ㄇㄧㄝ": "mie", "ㄇㄧㄠ": "miao", "ㄇㄧㄡ": "miu", "ㄇㄧㄢ": "mian", "ㄇㄧㄣ": "min", "ㄇㄧㄥ": "ming",
  "ㄇㄨ": "mu",

  // ㄈ
  "ㄈㄚ": "fa", "ㄈㄛ": "fo", "ㄈㄟ": "fei", "ㄈㄡ": "fou", "ㄈㄢ": "fan", "ㄈㄣ": "fen", "ㄈㄤ": "fang", "ㄈㄥ": "feng", "ㄈㄨ": "fu",

  // ㄉ
  "ㄉㄚ": "da", "ㄉㄜ": "de", "ㄉㄞ": "dai", "ㄉㄟ": "dei", "ㄉㄠ": "dao", "ㄉㄡ": "dou", "ㄉㄢ": "dan", "ㄉㄣ": "den", "ㄉㄤ": "dang", "ㄉㄥ": "deng",
  "ㄉㄧ": "di", "ㄉㄧㄚ": "dia", "ㄉㄧㄝ": "die", "ㄉㄧㄠ": "diao", "ㄉㄧㄡ": "diu", "ㄉㄧㄢ": "dian", "ㄉㄧㄤ": "diang", "ㄉㄧㄥ": "ding",
  "ㄉㄨ": "du", "ㄉㄨㄛ": "duo", "ㄉㄨㄟ": "dui", "ㄉㄨㄢ": "duan", "ㄉㄨㄣ": "dun", "ㄉㄨㄥ": "dong",

  // ㄊ
  "ㄊㄚ": "ta", "ㄊㄜ": "te", "ㄊㄞ": "tai", "ㄊㄠ": "tao", "ㄊㄡ": "tou", "ㄊㄢ": "tan", "ㄊㄤ": "tang", "ㄊㄥ": "teng",
  "ㄊㄧ": "ti", "ㄊㄧㄝ": "tie", "ㄊㄧㄠ": "tiao", "ㄊㄧㄢ": "tian", "ㄊㄧㄥ": "ting",
  "ㄊㄨ": "tu", "ㄊㄨㄛ": "tuo", "ㄊㄨㄟ": "tui", "ㄊㄨㄢ": "tuan", "ㄊㄨㄣ": "tun", "ㄊㄨㄥ": "tong",

  // ㄋ
  "ㄋㄚ": "na", "ㄋㄜ": "ne", "ㄋㄞ": "nai", "ㄋㄟ": "nei", "ㄋㄠ": "nao", "ㄋㄡ": "nou", "ㄋㄢ": "nan", "ㄋㄣ": "nen", "ㄋㄤ": "nang", "ㄋㄥ": "neng",
  "ㄋㄧ": "ni", "ㄋㄧㄝ": "nie", "ㄋㄧㄠ": "niao", "ㄋㄧㄡ": "niu", "ㄋㄧㄢ": "nian", "ㄋㄧㄣ": "nin", "ㄋㄧㄤ": "niang", "ㄋㄧㄥ": "ning",
  "ㄋㄨ": "nu", "ㄋㄨㄛ": "nuo", "ㄋㄨㄢ": "nuan", "ㄋㄨㄣ": "nun", "ㄋㄨㄥ": "nong", "ㄋㄩ": "nü", "ㄋㄩㄝ": "nüe",

  // ㄌ
  "ㄌㄚ": "la", "ㄌㄜ": "le", "ㄌㄞ": "lai", "ㄌㄟ": "lei", "ㄌㄠ": "lao", "ㄌㄡ": "lou", "ㄌㄢ": "lan", "ㄌㄤ": "lang", "ㄌㄥ": "leng",
  "ㄌㄧ": "li", "ㄌㄧㄚ": "lia", "ㄌㄧㄝ": "lie", "ㄌㄧㄠ": "liao", "ㄌㄧㄡ": "liu", "ㄌㄧㄢ": "lian", "ㄌㄧㄣ": "lin", "ㄌㄧㄤ": "liang", "ㄌㄧㄥ": "ling",
  "ㄌㄨ": "lu", "ㄌㄨㄛ": "luo", "ㄌㄨㄢ": "luan", "ㄌㄨㄣ": "lun", "ㄌㄨㄥ": "long", "ㄌㄩ": "lü", "ㄌㄩㄝ": "lüe",

  // ㄍ
  "ㄍㄚ": "ga", "ㄍㄜ": "ge", "ㄍㄞ": "gai", "ㄍㄟ": "gei", "ㄍㄠ": "gao", "ㄍㄡ": "gou", "ㄍㄢ": "gan", "ㄍㄣ": "gen", "ㄍㄤ": "gang", "ㄍㄥ": "geng",
  "ㄍㄨ": "gu", "ㄍㄨㄚ": "gua", "ㄍㄨㄛ": "guo", "ㄍㄨㄞ": "guai", "ㄍㄨㄟ": "gui", "ㄍㄨㄢ": "guan", "ㄍㄨㄣ": "gun", "ㄍㄨㄤ": "guang", "ㄍㄨㄥ": "gong",

  // ㄎ
  "ㄎㄚ": "ka", "ㄎㄜ": "ke", "ㄎㄞ": "kai", "ㄎㄟ": "kei", "ㄎㄠ": "kao", "ㄎㄡ": "kou", "ㄎㄢ": "kan", "ㄎㄣ": "ken", "ㄎㄤ": "kang", "ㄎㄥ": "keng",
  "ㄎㄨ": "ku", "ㄎㄨㄚ": "kua", "ㄎㄨㄛ": "kuo", "ㄎㄨㄞ": "kuai", "ㄎㄨㄟ": "kui", "ㄎㄨㄢ": "kuan", "ㄎㄨㄣ": "kun", "ㄎㄨㄤ": "kuang", "ㄎㄨㄥ": "kong",

  // ㄏ
  "ㄏㄚ": "ha", "ㄏㄜ": "he", "ㄏㄞ": "hai", "ㄏㄟ": "hei", "ㄏㄠ": "hao", "ㄏㄡ": "hou", "ㄏㄢ": "han", "ㄏㄣ": "hen", "ㄏㄤ": "hang", "ㄏㄥ": "heng",
  "ㄏㄨ": "hu", "ㄏㄨㄚ": "hua", "ㄏㄨㄛ": "huo", "ㄏㄨㄞ": "huai", "ㄏㄨㄟ": "hui", "ㄏㄨㄢ": "huan", "ㄏㄨㄣ": "hun", "ㄏㄨㄤ": "huang", "ㄏㄨㄥ": "hong",

  // ㄐ
  "ㄐㄧ": "ji", "ㄐㄧㄚ": "jia", "ㄐㄧㄝ": "jie", "ㄐㄧㄞ": "jiai", "ㄐㄧㄠ": "jiao", "ㄐㄧㄡ": "jiu", "ㄐㄧㄢ": "jian", "ㄐㄧㄣ": "jin", "ㄐㄧㄤ": "jiang", "ㄐㄧㄥ": "jing",
  "ㄐㄩ": "ju", "ㄐㄩㄝ": "jue", "ㄐㄩㄢ": "juan", "ㄐㄩㄣ": "jun", "ㄐㄩㄥ": "jiong",

  // ㄑ
  "ㄑㄧ": "qi", "ㄑㄧㄚ": "qia", "ㄑㄧㄝ": "qie", "ㄑㄧㄠ": "qiao", "ㄑㄧㄡ": "qiu", "ㄑㄧㄢ": "qian", "ㄑㄧㄣ": "qin", "ㄑㄧㄤ": "qiang", "ㄑㄧㄥ": "qing",
  "ㄑㄩ": "qu", "ㄑㄩㄝ": "que", "ㄑㄩㄢ": "quan", "ㄑㄩㄣ": "qun", "ㄑㄩㄥ": "qiong",

  // ㄒ
  "ㄒㄧ": "xi", "ㄒㄧㄚ": "xia", "ㄒㄧㄝ": "xie", "ㄒㄧㄠ": "xiao", "ㄒㄧㄡ": "xiu", "ㄒㄧㄢ": "xian", "ㄒㄧㄣ": "xin", "ㄒㄧㄤ": "xiang", "ㄒㄧㄥ": "xing",
  "ㄒㄩ": "xu", "ㄒㄩㄝ": "xue", "ㄒㄩㄢ": "xuan", "ㄒㄩㄣ": "xun", "ㄒㄩㄥ": "xiong",

  // ㄓ
  "ㄓ": "zhi", "ㄓㄚ": "zha", "ㄓㄜ": "zhe", "ㄓㄞ": "zhai", "ㄓㄟ": "zhei", "ㄓㄠ": "zhao", "ㄓㄡ": "zhou", "ㄓㄢ": "zhan", "ㄓㄣ": "zhen", "ㄓㄤ": "zhang", "ㄓㄥ": "zheng",
  "ㄓㄨ": "zhu", "ㄓㄨㄚ": "zhua", "ㄓㄨㄛ": "zhuo", "ㄓㄨㄞ": "zhuai", "ㄓㄨㄟ": "zhui", "ㄓㄨㄢ": "zhuan", "ㄓㄨㄣ": "zhun", "ㄓㄨㄤ": "zhuang", "ㄓㄨㄥ": "zhong",

  // ㄔ
  "ㄔ": "chi", "ㄔㄚ": "cha", "ㄔㄜ": "che", "ㄔㄞ": "chai", "ㄔㄠ": "chao", "ㄔㄡ": "chou", "ㄔㄢ": "chan", "ㄔㄣ": "chen", "ㄔㄤ": "chang", "ㄔㄥ": "cheng",
  "ㄔㄨ": "chu", "ㄔㄨㄚ": "chua", "ㄔㄨㄛ": "chuo", "ㄔㄨㄞ": "chuai", "ㄔㄨㄟ": "chui", "ㄔㄨㄢ": "chuan", "ㄔㄨㄣ": "chun", "ㄔㄨㄤ": "chuang", "ㄔㄨㄥ": "chong",

  // ㄕ
  "ㄕ": "shi", "ㄕㄚ": "sha", "ㄕㄜ": "she", "ㄕㄞ": "shai", "ㄕㄟ": "shei", "ㄕㄠ": "shao", "ㄕㄡ": "shou", "ㄕㄢ": "shan", "ㄕㄣ": "shen", "ㄕㄤ": "shang", "ㄕㄥ": "sheng",
  "ㄕㄨ": "shu", "ㄕㄨㄚ": "shua", "ㄕㄨㄛ": "shuo", "ㄕㄨㄞ": "shuai", "ㄕㄨㄟ": "shui", "ㄕㄨㄢ": "shuan", "ㄕㄨㄣ": "shun", "ㄕㄨㄤ": "shuang",

  // ㄖ
  "ㄖ": "ri", "ㄖㄜ": "re", "ㄖㄠ": "rao", "ㄖㄡ": "rou", "ㄖㄢ": "ran", "ㄖㄣ": "ren", "ㄖㄤ": "rang", "ㄖㄥ": "reng",
  "ㄖㄨ": "ru", "ㄖㄨㄚ": "rua", "ㄖㄨㄛ": "ruo", "ㄖㄨㄟ": "rui", "ㄖㄨㄢ": "ruan", "ㄖㄨㄣ": "run", "ㄖㄨㄥ": "rong",

  // ㄗ
  "ㄗ": "zi", "ㄗㄚ": "za", "ㄗㄜ": "ze", "ㄗㄞ": "zai", "ㄗㄟ": "zei", "ㄗㄠ": "zao", "ㄗㄡ": "zou", "ㄗㄢ": "zan", "ㄗㄣ": "zen", "ㄗㄤ": "zang", "ㄗㄥ": "zeng",
  "ㄗㄨ": "zu", "ㄗㄨㄛ": "zuo", "ㄗㄨㄟ": "zui", "ㄗㄨㄢ": "zuan", "ㄗㄨㄣ": "zun", "ㄗㄨㄥ": "zong",

  // ㄘ
  "ㄘ": "ci", "ㄘㄚ": "ca", "ㄘㄜ": "ce", "ㄘㄞ": "cai", "ㄘㄠ": "cao", "ㄘㄡ": "cou", "ㄘㄢ": "can", "ㄘㄣ": "cen", "ㄘㄤ": "cang", "ㄘㄥ": "ceng",
  "ㄘㄨ": "cu", "ㄘㄨㄛ": "cuo", "ㄘㄨㄟ": "cui", "ㄘㄨㄢ": "cuan", "ㄘㄨㄣ": "cun", "ㄘㄨㄥ": "cong",

  // ㄙ
  "ㄙ": "si", "ㄙㄚ": "sa", "ㄙㄜ": "se", "ㄙㄞ": "sai", "ㄙㄠ": "sao", "ㄙㄡ": "sou", "ㄙㄢ": "san", "ㄙㄣ": "sen", "ㄙㄤ": "sang", "ㄙㄥ": "seng",
  "ㄙㄨ": "su", "ㄙㄨㄛ": "suo", "ㄙㄨㄟ": "sui", "ㄙㄨㄢ": "suan", "ㄙㄨㄣ": "sun", "ㄙㄨㄥ": "song"
};

function autoConvertZhuyinToPinyin(zhuyinStr) {
  if (!zhuyinStr) return '';
  zhuyinStr = zhuyinStr.trim();
  if (!zhuyinStr) return '';

  const toneSymbols = { 'ˊ': 2, 'ˇ': 3, 'ˋ': 4, '˙': 5 };
  let tone = 1;
  let cleanZh = '';

  if (zhuyinStr.startsWith('˙')) {
    tone = 5;
    cleanZh = zhuyinStr.slice(1);
  } else {
    const lastChar = zhuyinStr[zhuyinStr.length - 1];
    if (toneSymbols[lastChar]) {
      tone = toneSymbols[lastChar];
      cleanZh = zhuyinStr.slice(0, -1);
    } else {
      cleanZh = zhuyinStr;
    }
  }

  let basePy = ZHUYIN_TO_PINYIN_MAP[cleanZh];
  if (!basePy) {
    // 嘗試容錯
    return '';
  }

  if (tone === 5) return basePy; // 輕聲

  const toneVowels = {
    a: ['ā', 'á', 'ǎ', 'à'],
    o: ['ō', 'ó', 'ǒ', 'ò'],
    e: ['ē', 'é', 'ě', 'è'],
    i: ['ī', 'í', 'ǐ', 'ì'],
    u: ['ū', 'ú', 'ǔ', 'ù'],
    ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
    v: ['ǖ', 'ǘ', 'ǚ', 'ǜ']
  };

  const tIdx = tone - 1;
  if (basePy.includes('a')) return basePy.replace('a', toneVowels.a[tIdx]);
  if (basePy.includes('o')) return basePy.replace('o', toneVowels.o[tIdx]);
  if (basePy.includes('e')) return basePy.replace('e', toneVowels.e[tIdx]);
  if (basePy.includes('ui')) return basePy.replace('i', toneVowels.i[tIdx]);
  if (basePy.includes('iu')) return basePy.replace('u', toneVowels.u[tIdx]);
  if (basePy.includes('i')) return basePy.replace('i', toneVowels.i[tIdx]);
  if (basePy.includes('u')) return basePy.replace('u', toneVowels.u[tIdx]);
  if (basePy.includes('ü')) return basePy.replace('ü', toneVowels.ü[tIdx]);
  return basePy;
}




return { convertZhuyinToPinyin: autoConvertZhuyinToPinyin, autoConvertZhuyinToPinyin, ZHUYIN_TO_PINYIN_MAP };
})();

