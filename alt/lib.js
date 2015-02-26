(function() {
  var INTERNAL_BLOCK_CLOSE, INTERNAL_BLOCK_OPEN, LAYOUT_CLASS, LAYOUT_STYLE, colors, __charsTable, __classes, __htmlCharEnts, __stripTags,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  colors = require('colors');

  exports.LAYOUT_STYLE = LAYOUT_STYLE = 1;

  exports.LAYOUT_CLASS = LAYOUT_CLASS = 2;

  exports.LAYOUT = exports.LAYOUT_STYLE;

  exports.LAYOUT_CLASS_PREFIX = 'mdash-';

  exports.LAYOUT_TAG_ID = false;

  exports.BASE64_PARAGRAPH_TAG = 'cA==';

  exports.BASE64_BREAKLINE_TAG = 'YnIgLw==';

  exports.BASE64_NOBR_OTAG = 'bm9icg==';

  exports.BASE64_NOBR_CTAG = 'L25vYnI=';

  exports.QUOTE_FIRS_OPEN = '&laquo;';

  exports.QUOTE_FIRS_CLOSE = '&raquo;';

  exports.QUOTE_CRAWSE_OPEN = '&bdquo;';

  exports.QUOTE_CRAWSE_CLOSE = '&ldquo;';

  exports.INTERNAL_BLOCK_OPEN = INTERNAL_BLOCK_OPEN = '%%%INTBLOCKO235978%%%';

  exports.INTERNAL_BLOCK_CLOSE = INTERNAL_BLOCK_CLOSE = '%%%INTBLOCKC235978%%%';

  __classes = {
    'nowrap': "white-space:nowrap;",
    'oa-obracket-sp-s': "margin-right:0.3em;",
    'oa-obracket-sp-b': "margin-left:-0.3em;",
    'oa-obracket-nl-b': "margin-left:-0.3em;",
    'oa-comma-b': "margin-right:-0.2em;",
    'oa-comma-e': "margin-left:0.2em;",
    'oa-oquote-nl': "margin-left:-0.44em;",
    'oa-oqoute-sp-s': "margin-right:0.44em;",
    'oa-oqoute-sp-q': "margin-left:-0.44em;"
  };


  /*
   * Таблица символов
   *
   * @var array
   */

  __charsTable = {
    '"': {
      html: ["&laquo;", "&raquo;", "&ldquo;", "&lsquo;", "&bdquo;", "&ldquo;", "&quot;", "&#171;", "&#187;"],
      utf8: [0x201E, 0x201C, 0x201F, 0x201D, 0x00AB, 0x00BB]
    },
    ' ': {
      html: ["&nbsp;", "&thinsp;", "&#160;"],
      utf8: [0x00A0, 0x2002, 0x2003, 0x2008, 0x2009]
    },
    '-': {
      html: ["&ndash;", "&minus;", "&#151;", "&#8212;", "&#8211;"],
      utf8: [0x002D, 0x2010, 0x2012, 0x2013]
    },
    '—': {
      html: ["&mdash;"],
      utf8: [0x2014]
    },
    '==': {
      html: ["&equiv;"],
      utf8: [0x2261]
    },
    '...': {
      html: ["&hellip;", "&#0133;"],
      utf8: [0x2026]
    },
    '!=': {
      html: ["&ne;", "&#8800;"],
      utf8: [0x2260]
    },
    '<=': {
      html: ["&le;", "&#8804;"],
      utf8: [0x2264]
    },
    '>=': {
      html: ["&ge;", "&#8805;"],
      utf8: [0x2265]
    },
    '1/2': {
      html: ["&frac12;", "&#189;"],
      utf8: [0x00BD]
    },
    '1/4': {
      html: ["&frac14;", "&#188;"],
      utf8: [0x00BC]
    },
    '3/4': {
      html: ["&frac34;", "&#190;"],
      utf8: [0x00BE]
    },
    '+-': {
      html: ["&plusmn;", "&#177;"],
      utf8: [0x00B1]
    },
    '&': {
      html: ["&amp;", "&#38;"]
    },
    '(tm)': {
      html: ["&trade;", "&#153;"],
      utf8: [0x2122]
    },
    '(r)': {
      html: ["&reg;", "&#174;"],
      utf8: [0x00AE]
    },
    '(c)': {
      html: ["&copy;", "&#169;"],
      utf8: [0x00A9]
    },
    '§': {
      html: ["&sect;", "&#167;"],
      utf8: [0x00A7]
    },
    '`': {
      html: ["&#769;"]
    },
    '\'': {
      html: ["&rsquo;", "’"]
    },
    'x': {
      html: ["&times;", "&#215;"],
      utf8: [0x00D7]
    }
  };

  __htmlCharEnts = {
    'nbsp': 160,
    'iexcl': 161,
    'cent': 162,
    'pound': 163,
    'curren': 164,
    'yen': 165,
    'brvbar': 166,
    'sect': 167,
    'uml': 168,
    'copy': 169,
    'ordf': 170,
    'laquo': 171,
    'not': 172,
    'shy': 173,
    'reg': 174,
    'macr': 175,
    'deg': 176,
    'plusmn': 177,
    'sup2': 178,
    'sup3': 179,
    'acute': 180,
    'micro': 181,
    'para': 182,
    'middot': 183,
    'cedil': 184,
    'sup1': 185,
    'ordm': 186,
    'raquo': 187,
    'frac14': 188,
    'frac12': 189,
    'frac34': 190,
    'iquest': 191,
    'Agrave': 192,
    'Aacute': 193,
    'Acirc': 194,
    'Atilde': 195,
    'Auml': 196,
    'Aring': 197,
    'AElig': 198,
    'Ccedil': 199,
    'Egrave': 200,
    'Eacute': 201,
    'Ecirc': 202,
    'Euml': 203,
    'Igrave': 204,
    'Iacute': 205,
    'Icirc': 206,
    'Iuml': 207,
    'ETH': 208,
    'Ntilde': 209,
    'Ograve': 210,
    'Oacute': 211,
    'Ocirc': 212,
    'Otilde': 213,
    'Ouml': 214,
    'times': 215,
    'Oslash': 216,
    'Ugrave': 217,
    'Uacute': 218,
    'Ucirc': 219,
    'Uuml': 220,
    'Yacute': 221,
    'THORN': 222,
    'szlig': 223,
    'agrave': 224,
    'aacute': 225,
    'acirc': 226,
    'atilde': 227,
    'auml': 228,
    'aring': 229,
    'aelig': 230,
    'ccedil': 231,
    'egrave': 232,
    'eacute': 233,
    'ecirc': 234,
    'euml': 235,
    'igrave': 236,
    'iacute': 237,
    'icirc': 238,
    'iuml': 239,
    'eth': 240,
    'ntilde': 241,
    'ograve': 242,
    'oacute': 243,
    'ocirc': 244,
    'otilde': 245,
    'ouml': 246,
    'divide': 247,
    'oslash': 248,
    'ugrave': 249,
    'uacute': 250,
    'ucirc': 251,
    'uuml': 252,
    'yacute': 253,
    'thorn': 254,
    'yuml': 255,
    'fnof': 402,
    'Alpha': 913,
    'Beta': 914,
    'Gamma': 915,
    'Delta': 916,
    'Epsilon': 917,
    'Zeta': 918,
    'Eta': 919,
    'Theta': 920,
    'Iota': 921,
    'Kappa': 922,
    'Lambda': 923,
    'Mu': 924,
    'Nu': 925,
    'Xi': 926,
    'Omicron': 927,
    'Pi': 928,
    'Rho': 929,
    'Sigma': 931,
    'Tau': 932,
    'Upsilon': 933,
    'Phi': 934,
    'Chi': 935,
    'Psi': 936,
    'Omega': 937,
    'alpha': 945,
    'beta': 946,
    'gamma': 947,
    'delta': 948,
    'epsilon': 949,
    'zeta': 950,
    'eta': 951,
    'theta': 952,
    'iota': 953,
    'kappa': 954,
    'lambda': 955,
    'mu': 956,
    'nu': 957,
    'xi': 958,
    'omicron': 959,
    'pi': 960,
    'rho': 961,
    'sigmaf': 962,
    'sigma': 963,
    'tau': 964,
    'upsilon': 965,
    'phi': 966,
    'chi': 967,
    'psi': 968,
    'omega': 969,
    'thetasym': 977,
    'upsih': 978,
    'piv': 982,
    'bull': 8226,
    'hellip': 8230,
    'prime': 8242,
    'Prime': 8243,
    'oline': 8254,
    'frasl': 8260,
    'weierp': 8472,
    'image': 8465,
    'real': 8476,
    'trade': 8482,
    'alefsym': 8501,
    'larr': 8592,
    'uarr': 8593,
    'rarr': 8594,
    'darr': 8595,
    'harr': 8596,
    'crarr': 8629,
    'lArr': 8656,
    'uArr': 8657,
    'rArr': 8658,
    'dArr': 8659,
    'hArr': 8660,
    'forall': 8704,
    'part': 8706,
    'exist': 8707,
    'empty': 8709,
    'nabla': 8711,
    'isin': 8712,
    'notin': 8713,
    'ni': 8715,
    'prod': 8719,
    'sum': 8721,
    'minus': 8722,
    'lowast': 8727,
    'radic': 8730,
    'prop': 8733,
    'infin': 8734,
    'ang': 8736,
    'and': 8743,
    'or': 8744,
    'cap': 8745,
    'cup': 8746,
    'int': 8747,
    'there4': 8756,
    'sim': 8764,
    'cong': 8773,
    'asymp': 8776,
    'ne': 8800,
    'equiv': 8801,
    'le': 8804,
    'ge': 8805,
    'sub': 8834,
    'sup': 8835,
    'nsub': 8836,
    'sube': 8838,
    'supe': 8839,
    'oplus': 8853,
    'otimes': 8855,
    'perp': 8869,
    'sdot': 8901,
    'lceil': 8968,
    'rceil': 8969,
    'lfloor': 8970,
    'rfloor': 8971,
    'lang': 9001,
    'rang': 9002,
    'loz': 9674,
    'spades': 9824,
    'clubs': 9827,
    'hearts': 9829,
    'diams': 9830,
    'quot': 34,
    'amp': 38,
    'lt': 60,
    'gt': 62,
    'OElig': 338,
    'oelig': 339,
    'Scaron': 352,
    'scaron': 353,
    'Yuml': 376,
    'circ': 710,
    'tilde': 732,
    'ensp': 8194,
    'emsp': 8195,
    'thinsp': 8201,
    'zwnj': 8204,
    'zwj': 8205,
    'lrm': 8206,
    'rlm': 8207,
    'ndash': 8211,
    'mdash': 8212,
    'lsquo': 8216,
    'rsquo': 8217,
    'sbquo': 8218,
    'ldquo': 8220,
    'rdquo': 8221,
    'bdquo': 8222,
    'dagger': 8224,
    'Dagger': 8225,
    'permil': 8240,
    'lsaquo': 8249,
    'rsaquo': 8250,
    'euro': 8364
  };

  __stripTags = function(input, allowed) {
    var commentsAndPhpTags, tags;
    allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
    tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
      if (allowed.indexOf('<' + $1.toLowerCase() + '>') > -1) {
        return $0;
      } else {
        return '';
      }
    });
  };

  exports.extend = function(object, properties) {
    var key, val;
    for (key in properties) {
      val = properties[key];
      object[key] = val;
    }
    return object;
  };

  exports.merge = function(options, overrides) {
    return exports.extend(exports.extend({}, options), overrides);
  };

  exports.omit = function(object, keys) {
    var key, result, val;
    result = {};
    if (typeof keys === 'string') {
      keys = [keys];
    }
    for (key in object) {
      val = object[key];
      if (__indexOf.call(keys, key) < 0) {
        result[key] = val;
      }
    }
    return result;
  };

  exports.preg_quote = function(str, delimiter) {
    return String(str).replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}!|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
  };


  /*
   * Метод, осуществляющий кодирование (сохранение) информации
   * с целью невозможности типографировать ее
   *
   * @param   string $text
   * @return  string
   */

  exports.encode = function(text) {
    return new Buffer(text).toString('base64');
  };


  /*
   * Метод, осуществляющий декодирование информации
   *
   * @param   string $text
   * @return  string
   */

  exports.decode = function(text) {
    return new Buffer(text, 'base64').toString('utf8');
  };


  /*
   * Удаление кодов HTML из текста
   */

  exports.clearSpecialChars = function(text, mode) {
    var char, mod, moder, type, v, vals, _i, _j, _len, _len1, _ref;
    if (mode == null) {
      mode = null;
    }
    if (typeof mode === 'string') {
      mode = [mode];
    }
    if (mode == null) {
      mode = ['utf8', 'html'];
    }
    if (!Array.isArray(mode)) {
      return false;
    }
    moder = [];
    if ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = mode.length; _i < _len; _i++) {
        mod = mode[_i];
        _results.push(mod === 'utf8' || mod === 'html');
      }
      return _results;
    })()) {
      moder.push(mod);
    }
    if (moder.length === 0) {
      return false;
    }
    for (char in __charsTable) {
      vals = __charsTable[char];
      for (_i = 0, _len = mode.length; _i < _len; _i++) {
        type = mode[_i];
        if (vals[type] != null) {
          _ref = vals[type];
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            v = _ref[_j];
            if (type === 'utf8' && !isNaN(v)) {
              v = String.fromCharCode(v);
            }
            if (type === 'html' && /<[a-z]+>/gi.test(v)) {
              v = exports.processTags(v, exports.encode);
            }
            if (v != null) {
              text = text.replace(new RegExp(v, 'ig'), char);
            }
          }
        }
      }
    }
    return text;
  };


  /*
   * Удаление тегов HTML из текста
   * Тег <br /> будет преобразов в перенос строки \n, сочетание тегов </p><p> -
   * в двойной перенос
   *
   * @param   string $text
   * @param   array $allowableTag массив из тегов, которые будут проигнорированы
   * @return  string
   */

  exports.removeHtmlTags = function(text, allowableTag) {
    var ignore, tag, tags, _i, _len;
    if (allowableTag == null) {
      allowableTag = null;
    }
    ignore = null;
    if (allowableTag != null) {
      if (typeof allowableTag === 'string') {
        allowableTag = [allowableTag];
      }
      if (Array.isArray(allowableTag)) {
        tags = [];
        for (_i = 0, _len = allowableTag.length; _i < _len; _i++) {
          tag = allowableTag[_i];
          if (tag.substr(0, 1) !== '<' || tag.substr(-1, 1) !== '>') {
            continue;
          }
          if (tag.substr(1, 1) === '/') {
            continue;
          }
          tags.push(tag);
        }
        ignore = tags.join('');
      }
    }
    text = text.replace([/\<br\s*\/?>/gi, /\<\/p\>\s*\<p\>/g], ["\n", "\n\n"]);
    text = stripTags(text, ignore);
    return text;
  };


  /*
   * Сохраняем содержимое тегов HTML
   *
   * Тег 'a' кодируется со специальным префиксом для дальнейшей
   * возможности выносить за него кавычки.
   * 
   * @param   string $text
   * @param   bool $safe
   * @return  string
   */

  exports.processTags = function(text, processor) {
    if (processor == null) {
      processor = (function(txt) {
        return txt;
      });
    }
    return text.replace(/(\<\/?)(.+?)(\>)/gi, function($0, $1, $2, $3) {
      $2 = ("" + $2).trim();
      if ($2.substr(0, 1) === "a") {
        $2 = "%%%__" + processor($2);
      } else if ($2.substr(0, 5) === "%%%__") {
        $2 = processor($2.substr(5));
      } else {
        $2 = processor($2);
      }
      return "" + $1 + $2 + $3;
    });
  };


  /*
   * Add Safe block/tag for exclusion
   */

  exports.addSafeBlock = function(id, tag) {
    var pattern;
    if (tag == null) {
      tag = [];
      tag.push("<" + id + "[^>]*?>");
      tag.push("</" + id + ">");
    }
    tag.map(function(str) {
      return String(str).replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}!|:\\/-]', 'g'), '\\$&');
    });
    pattern = new RegExp("(" + tag[0] + ")((?:.|\\n|\\r)*?)(" + tag[1] + ")", "ig");
    return {
      id: id,
      pattern: pattern
    };
  };

  exports.processSafeBlocks = function(text, blocks, processor, reverse) {
    var block, _i, _len, _ref;
    if (blocks == null) {
      blocks = [];
    }
    if (processor == null) {
      processor = (function(txt) {
        return txt;
      });
    }
    if (reverse == null) {
      reverse = false;
    }
    _ref = (reverse ? blocks.reverse() : blocks);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      block = _ref[_i];
      text = text.replace(block.pattern, function($0, $1, $2, $3) {
        return $1 + processor($2) + $3;
      });
    }
    text;
    return text;
  };

  exports.processSelectorPattern = function(pattern) {
    if (pattern === false) {
      return;
    }
    pattern = exports.preg_quote(pattern, '/');
    pattern = pattern.replace("\\*", "[a-z0-9_\-]*");
    pattern = new RegExp("^" + pattern + "$", 'ig');
    return pattern;
  };

  exports.selectRules = function(mask, rules) {
    var m, name, names, pattern, selected, _i, _len;
    if (mask == null) {
      mask = "*";
    }
    if (rules == null) {
      rules = {};
    }
    selected = {};
    if (typeof mask === 'string') {
      mask = [mask];
    }
    for (_i = 0, _len = mask.length; _i < _len; _i++) {
      m = mask[_i];
      m = m.split(".");
      name = m[0];
      pattern = name.replace(/\*/g, "[a-z0-9_\-]*");
      pattern = new RegExp("^" + pattern + "$", 'ig');
      names = [];
      if (typeof rules === 'object') {
        if (Array.isArray(rules)) {
          selected = [];
          names = rules;
        } else {
          names = Object.keys(rules);
        }
      }
      names.map(function(key) {
        if (Array.isArray(selected)) {
          if (key.match(pattern)) {
            selected.push(key);
          }
        } else {
          if (key.match(pattern)) {
            selected[key] = rules[key];
          }
        }
      });
      if (m.length > 1 && (selected[name] != null)) {
        selected[name] = exports.selectRules(m.slice(1).join("."), rules[name]);
      }
    }
    return selected;
  };

  exports.processSettings = function(options, defaults) {
    var select, selector, settings, val, value, _i, _len, _ref, _ref1, _ref2;
    if (options == null) {
      options = {};
    }
    if (defaults == null) {
      defaults = {};
    }
    if (typeof options !== 'object') {
      return options;
    }
    settings = {};
    for (selector in options) {
      value = options[selector];
      if ((_ref = ("" + value).toLowerCase()) === "on" || _ref === "true" || _ref === "1" || _ref === "direct") {
        value = true;
      }
      if ((_ref1 = ("" + value).toLowerCase()) === "off" || _ref1 === "false" || _ref1 === "0") {
        value = false;
      }
      if (typeof value === 'boolean') {
        value = {
          disabled: value === false
        };
      }
      if (typeof value === 'object') {
        if ((defaults[selector] != null) && typeof defaults[selector] === 'object') {
          value = exports.extend(exports.omit(value, 'selector'), exports.omit(defaults[selector], 'disabled'));
        }
        if ('description' in value) {
          delete value['description'];
        }
        if ('hide' in value) {
          delete value['hide'];
        }
        if ('setting' in value) {
          value[value.setting] = true;
          delete value['setting'];
        }
        if (!('disabled' in value) && Object.keys(value).length === 0) {
          value.disabled = false;
        }
        if ('selector' in value) {
          if (Object.keys(value).length === 1) {
            continue;
          }
          if (typeof value.selector === 'string') {
            value.selector = [value.selector];
          }
          val = exports.omit(value, 'selector');
          if (Object.keys(value).length > 2) {
            if (value['disabled'] === true) {
              continue;
            } else {
              val = exports.omit(val, 'disabled');
            }
          }
          _ref2 = value.selector;
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            select = _ref2[_i];
            settings[select] = exports.merge(val, settings[select]);
          }
          continue;
        }
        value = exports.omit(value, 'selector');
      }
      settings[selector] = exports.merge(value, settings[selector]);
    }
    return settings;
  };


  /*
   * Декодриует спец блоки
   *
   * @param   string $text
   * @return  string
   */

  exports.decodeInternalBlocks = function(text) {
    return text.replace(new RegExp("" + INTERNAL_BLOCK_OPEN + "([a-zA-Z0-9\/=]+?)" + INTERNAL_BLOCK_CLOSE, 'g'), function($0, $1) {
      return exports.decode($1);
    });
  };


  /*
   * Кодирует спец блок
   *
   * @param   string $text
   * @return  string
   */

  exports.iblock = function(text) {
    if (text == null) {
      text = "";
    }
    return "" + INTERNAL_BLOCK_OPEN + (exports.encode(text)) + INTERNAL_BLOCK_CLOSE;
  };


  /*
   * Создание тега с защищенным содержимым 
   *
   * @param   string $content текст, который будет обрамлен тегом
   * @param   string $tag тэг 
   * @param   array $attribute список атрибутов, где ключ - имя атрибута, а значение - само значение данного атрибута
   * @return  string
   */

  exports.tag = function(content, tag, attribute) {
    var attr, classname, closeTag, openTag, st, style, value, _ref, _ref1;
    if (tag == null) {
      tag = 'span';
    }
    if (attribute == null) {
      attribute = {};
    }
    if ((attribute["class"] != null) && attribute["class"] === "nowrap") {
      tag = "nobr";
      attribute = {};
    }
    if (attribute["class"] != null) {
      classname = attribute["class"];
      if (exports.LAYOUT & exports.LAYOUT_STYLE) {
        if (__classes[classname]) {
          style = __classes[classname];
        }
        if (attribute.style != null) {
          st = (_ref = attribute.style) != null ? _ref.trim() : void 0;
          if (st.slice(-1)(!";")) {
            st += ";";
          }
          st += style;
          style = st;
        } else {
          style = style;
        }
      }
      if (exports.LAYOUT & exports.LAYOUT_CLASS) {
        classname = (exports.LAYOUT_CLASS_PREFIX || "") + classname;
      }
    }
    if ((attribute.id != null) && exports.LAYOUT_TAG_ID) {
      attribute.id = 'mdash-3' + Math.floor(Math.random() * (9999 - 1000)) + 1000;
    }
    openTag = closeTag = tag;
    _ref1 = exports.omit(attribute, ['class', 'style']);
    for (attr in _ref1) {
      value = _ref1[attr];
      openTag += " " + attr + "=\"" + value + "\"";
    }
    if (exports.LAYOUT & exports.LAYOUT_STYLE && (style != null)) {
      openTag += " style=\"" + style + "\"";
    }
    if (exports.LAYOUT & exports.LAYOUT_CLASS && (classname != null)) {
      openTag += " class=\"" + classname + "\"";
    }
    return "<" + (exports.encode(openTag)) + ">" + content + "</" + (exports.encode(closeTag)) + ">";
  };


  /*
   * Сконвериторвать все html entity в соответсвующие юникод символы
   *
   * @param string $text
   */

  exports.convertEntitiesToUnicode = function(text) {
    text = text.replace(/\&#([0-9]+)\;/g, function(match, m) {
      return String.fromCharCode(parseInt(m));
    });
    text = text.replace(/\&#x([0-9A-F]+)\;/g, function(match, m) {
      return String.fromCharCode(parseInt(m, 16));
    });
    text = text.replace(/\&([a-zA-Z0-9]+)\;/g, function(match, m) {
      var r;
      if (htmlCharEnts[m] != null) {
        r = String.fromCharCode(htmlCharEnts[m]);
      }
      return r || match;
    });
    return text;
  };

  exports.rstrpos = function(haystack, needle, offset) {
    var curr_pos, found, last_pos;
    if (offset == null) {
      offset = 0;
    }
    if (haystack.trim() !== "" && needle.trim() !== "" && offset <= haystack.length) {
      last_pos = offset;
      found = false;
      while (curr_pos = haystack.substr(last_pos).indexOf(needle) !== false) {
        found = true;
        last_pos = curr_pos + 1;
      }
      if (found) {
        return last_pos - 1;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  exports.ifop = function(cond, isTrue, isFalse) {
    if (cond) {
      return isTrue;
    } else {
      return isFalse;
    }
  };

}).call(this);
