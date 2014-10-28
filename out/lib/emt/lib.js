(function() {
  var Base64, EMTLib;

  Base64 = require('js-base64').Base64;

  EMTLib = (function() {
    function EMTLib() {}

    EMTLib.LAYOUT_STYLE = 1;

    EMTLib.LAYOUT_CLASS = 2;

    EMTLib.INTERNAL_BLOCK_OPEN = '%%%INTBLOCKO235978%%%';

    EMTLib.INTERNAL_BLOCK_CLOSE = '%%%INTBLOCKC235978%%%';


    /*
     * Таблица символов
     *
     * @var array
     */

    EMTLib.charsTable = {
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


    /*
     * Добавление к тегам атрибута 'id', благодаря которому
     * при повторном типографирование текста будут удалены теги,
     * расставленные данным типографом
     *
     * @var array
     */

    EMTLib._typographSpecificTagId = false;

    EMTLib.isInt = function(num) {
      return typeof num === "number" && isFinite(num) && num % 1 === 0;
    };

    EMTLib.preg_quote = function(str, delimiter) {
      return String(str).replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
    };

    EMTLib.strip_tags = function(input, allowed) {
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


    /*
     * Костыли для работы с символами UTF-8
     * 
     * @author  somebody?
     * @param int $c код символа в кодировке UTF-8 (например, 0x00AB)
     * @return  bool|string
     */

    EMTLib._getUnicodeChar = function(c) {
      if (c <= 0x7F) {
        return String.fromCharCode(c);
      } else if (c <= 0x7FF) {
        return String.fromCharCode(0xC0 | c >> 6) + String.fromCharCode(0x80 | c & 0x3F);
      } else if (c <= 0xFFFF) {
        return String.fromCharCode(0xE0 | c >> 12) + String.fromCharCode(0x80 | c >> 6 & 0x3F) + String.fromCharCode(0x80 | c & 0x3F);
      } else if (c <= 0x10FFFF) {
        return String.fromCharCode(0xF0 | c >> 18) + String.fromCharCode(0x80 | c >> 12 & 0x3F) + String.fromCharCode(0x80 | c >> 6 & 0x3F) + String.fromCharCode(0x80 | c & 0x3F);
      } else {
        return false;
      }
    };


    /*
     * Удаление кодов HTML из текста
     *
     * <code>
     *  // Remove UTF-8 chars:
     *  $str = EMTLib::clear_special_chars('your text', 'utf8');
     *  // ... or HTML codes only:
     *  $str = EMTLib::clear_special_chars('your text', 'html');
     *  // ... or combo:
     *  $str = EMTLib::clear_special_chars('your text');
     * </code>
     *
     * @param   string $text
     * @param   mixed $mode
     * @return  string|bool
     */

    EMTLib.clear_special_chars = function(text, mode) {
      var char, mod, moder, type, v, vals, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
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
      for (_i = 0, _len = mode.length; _i < _len; _i++) {
        mod = mode[_i];
        if (mod === 'utf8' || mod === 'html') {
          moder.push(mod);
        }
      }
      if (moder.length === 0) {
        return false;
      }
      _ref = this.charsTable;
      for (char in _ref) {
        vals = _ref[char];
        for (_j = 0, _len1 = mode.length; _j < _len1; _j++) {
          type = mode[_j];
          if (vals[type] != null) {
            _ref1 = vals[type];
            for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
              v = _ref1[_k];
              if (type === 'utf8' && this.isInt(v)) {
                v = this._getUnicodeChar(v);
              }
              if (type === 'html') {
                if (v.match(/<[a-z]+>/gi)) {
                  v = this.safe_tag_chars(v, true);
                }
              }
              if (v) {
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

    EMTLib.remove_html_tags = function(text, allowableTag) {
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
      text = this.strip_tags(text, ignore);
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

    EMTLib.safe_tag_chars = function(text, way) {
      var self;
      self = this;
      if (way) {
        text = text.replace(/(\<\/?)(.+?)(\>)/g, function($0, $1, $2, $3) {
          return $1 + ($2.trim().substr(0, 1) === "a" ? "%%%__" : "") + self.encrypt_tag($2.trim()) + $3;
        });
      } else {
        text = text.replace(/(\<\/?)(.+?)(\>)/g, function($0, $1, $2, $3) {
          return $1 + ($2.trim().substr(0, 5) === "%%%__" ? self.decrypt_tag($2.trim().substr(5)) : self.decrypt_tag($2.trim())) + $3;
        });
      }
      return text;
    };


    /*
     * Декодриует спец блоки
     *
     * @param   string $text
     * @return  string
     */

    EMTLib.decode_internal_blocks = function(text) {
      var self;
      self = this;
      return text = text.replace(new RegExp("" + this.INTERNAL_BLOCK_OPEN + "([a-zA-Z0-9\/=]+?)" + this.INTERNAL_BLOCK_CLOSE, 'g'), function($0, $1) {
        return self.decrypt_tag($1);
      });
    };


    /*
     * Кодирует спец блок
     *
     * @param   string $text
     * @return  string
     */

    EMTLib.iblock = function(text) {
      return "" + this.INTERNAL_BLOCK_OPEN + (this.encrypt_tag(text)) + this.INTERNAL_BLOCK_CLOSE;
    };


    /*
     * Создание тега с защищенным содержимым 
     *
     * @param   string $content текст, который будет обрамлен тегом
     * @param   string $tag тэг 
     * @param   array $attribute список атрибутов, где ключ - имя атрибута, а значение - само значение данного атрибута
     * @return  string
     */

    EMTLib.build_safe_tag = function(content, tag, attribute, layout) {
      var attr, classname, htmlTag, st, value;
      if (tag == null) {
        tag = 'span';
      }
      if (attribute == null) {
        attribute = {};
      }
      if (layout == null) {
        layout = this.LAYOUT_STYLE;
      }
      htmlTag = tag;
      if (this._typographSpecificTagId) {
        if (attribute.id == null) {
          attribute.id = 'emt-2' + mt_rand(1000, 9999);
        }
      }
      classname = "";
      if (attribute.length) {
        if (layout & this.LAYOUT_STYLE) {
          if (attribute.__style != null) {
            if (attribute.style != null) {
              st = attribute.style.trim();
              if (st.substr(-1) !== ";") {
                st += ";";
              }
              st += attribute.__style;
              attribute.style = st;
            } else {
              attribute.style = attribute.__style;
            }
            delete attribute['__style'];
          }
        }
        for (attr in attribute) {
          value = attribute[attr];
          if (attr === "__style") {
            continue;
          }
          if (attr === "class") {
            classname = "" + value;
            continue;
          }
          htmlTag += " " + attr + "=\"" + value + "\"";
        }
      }
      if (layout & this.LAYOUT_CLASS && classname) {
        htmlTag += " class=\"" + classname + "\"";
      }
      return "<" + (this.encrypt_tag(htmlTag)) + ">" + content + "</" + (this.encrypt_tag(tag)) + ">";
    };


    /*
     * Метод, осуществляющий кодирование (сохранение) информации
     * с целью невозможности типографировать ее
     *
     * @param   string $text
     * @return  string
     */

    EMTLib.encrypt_tag = function(text) {
      return Base64.encode(text);
    };


    /*
     * Метод, осуществляющий декодирование информации
     *
     * @param   string $text
     * @return  string
     */

    EMTLib.decrypt_tag = function(text) {
      return Base64.decode(text);
    };

    EMTLib.strpos_ex = function(haystack, needle, offset) {
      var m, n, p, w, _i, _len;
      if (offset == null) {
        offset = null;
      }
      if (Array.isArray(needle)) {
        m = -1;
        w = false;
        for (_i = 0, _len = needle.length; _i < _len; _i++) {
          n = needle[_i];
          p = haystack.indexOf(n, offset);
          if (p === -1) {
            continue;
          }
          if (m === -1) {
            m = p;
            w = n;
            continue;
          }
          if (p < m) {
            m = p;
            w = n;
          }
        }
        if (m === -1) {
          return false;
        }
        return {
          pos: m,
          str: w
        };
      }
      return haystack.indexOf(needle, offset);
    };

    EMTLib._process_selector_pattern = function(pattern) {
      if (pattern === false) {
        return;
      }
      pattern = this.preg_quote(pattern, '/');
      pattern = pattern.replace("\\*", "[a-z0-9_\-]*");
      return pattern = new RegExp(pattern, 'ig');
    };

    EMTLib._test_pattern = function(pattern, text) {
      if (pattern === false) {
        return true;
      }
      return text.match(pattern);
    };

    EMTLib.strtolower = function(string) {
      var convert_from, convert_to;
      convert_to = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð", "ñ", "ò", "ó", "ô", "õ", "ö", "ø", "ù", "ú", "û", "ü", "ý", "а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и", "й", "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы", "ь", "э", "ю", "я"];
      convert_from = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï", "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ъ", "Ь", "Э", "Ю", "Я"];
      return string.replace(convert_from, convert_to);
    };

    EMTLib.html4_char_ents = {
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


    /*
     * Вернуть уникод символ по html entinty
     *
     * @param string $entity
     * @return string
     */

    EMTLib.html_char_entity_to_unicode = function(entity) {
      if (this.html4_char_ents[entity] != null) {
        return this._getUnicodeChar(this.html4_char_ents[entity]);
      }
      return false;
    };


    /*
     * Сконвериторвать все html entity в соответсвующие юникод символы
     *
     * @param string $text
     */

    EMTLib.convert_html_entities_to_unicode = function(text) {
      text = text.replace(/\&#([0-9]+)\;/g, function(match, m) {
        return _getUnicodeChar(parseInt(m));
      });
      text = text.replace(/\&#x([0-9A-F]+)\;/g, function(match, m) {
        return _getUnicodeChar(parseInt(m, 16));
      });
      text = text.replace(/\&([a-zA-Z0-9]+)\;/g, function(match, m) {
        var r;
        r = html_char_entity_to_unicode(m);
        return r || match;
      });
      return text;
    };

    EMTLib.rstrpos = function(haystack, needle, offset) {
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

    EMTLib.ifop = function(cond, isTrue, isFalse) {
      if (cond) {
        return isTrue;
      } else {
        return isFalse;
      }
    };

    return EMTLib;

  })();

  module.exports = EMTLib;

}).call(this);
