(function() {
  var EMTret, EMTretSpace,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  EMTret = require("../tret");

  EMTretSpace = (function(_super) {
    __extends(EMTretSpace, _super);

    function EMTretSpace() {
      return EMTretSpace.__super__.constructor.apply(this, arguments);
    }

    EMTretSpace.prototype.title = "Расстановка и удаление пробелов";

    EMTretSpace.prototype.domain_zones = ['ru', 'ру', 'ком', 'орг', 'уа', 'ua', 'uk', 'co', 'fr', 'lv', 'lt', 'ee', 'eu', 'com', 'net', 'edu', 'gov', 'org', 'mil', 'int', 'info', 'biz', 'info', 'name', 'pro'];

    EMTretSpace.prototype.classes = {
      nowrap: 'word-spacing:nowrap;'
    };

    EMTretSpace.prototype.rules = {
      nobr_twosym_abbr: {
        description: 'Неразрывный перед 2х символьной аббревиатурой',
        pattern: /([a-zA-Zа-яёА-ЯЁ])(\040|\t)+([A-ZА-ЯЁ]{2})([\s\;\.\?\!\:\(\"]|\&(ra|ld)quo\;|$)/g,
        replacement: '$1&nbsp;$3$4'
      },
      remove_space_before_punctuationmarks: {
        description: 'Удаление пробела перед точкой, запятой, двоеточием, точкой с запятой',
        pattern: /((\040|\t|\&nbsp\;)+)([\,\:\.\;\?])(\s+|$)/g,
        replacement: '$3$4'
      },
      autospace_after_comma: {
        description: 'Пробел после запятой',
        pattern: [/(\040|\t|\&nbsp\;)\,([а-яёa-z0-9])/ig, /([^0-9])\,([а-яёa-z0-9])/ig],
        replacement: [', $2', '$1, $2']
      },
      autospace_after_pmarks: {
        description: 'Пробел после знаков пунктуации, кроме точки',
        pattern: /(\040|\t|\&nbsp\;|^|\n)([a-zа-яё0-9]+)(\040|\t|\&nbsp\;)?(\:|\)|\,|\&hellip\;|(?:\!|\?)+)([а-яёa-z])/ig,
        replacement: '$1$2$4 $5'
      },
      autospace_after_dot: {
        description: 'Пробел после точки',
        pattern: [/(\040|\t|\&nbsp\;|^)([a-zа-яё0-9]+)(\040|\t|\&nbsp\;)?\.([а-яёa-z]{5,})($|[^a-zа-яё])/ig, /(\040|\t|\&nbsp\;|^)([a-zа-яё0-9]+)\.([а-яёa-z]{1,4})($|[^a-zа-яё])/ig],
        replacement: [
          function(match, m) {
            return "" + m[1] + m[2] + "." + (m[5] === "." ? "" : " ") + m[4] + m[5];
          }, function(match, m) {
            var _ref;
            return "" + m[1] + m[2] + "." + ((_ref = m[3].toLowerCase(), __indexOf.call(this.domain_zones, _ref) >= 0) ? "" : m[4] === "." ? "" : " ") + m[3] + m[4];
          }
        ]
      },
      autospace_after_hellips: {
        description: 'Пробел после знаков троеточий с вопросительным или восклицательными знаками',
        pattern: /([\?\!]\.\.)([а-яёa-z])/ig,
        replacement: '$1 $2'
      },
      many_spaces_to_one: {
        description: 'Удаление лишних пробельных символов и табуляций',
        pattern: /(\040|\t)+/g,
        replacement: ' '
      },
      clear_percent: {
        description: 'Удаление пробела перед символом процента',
        pattern: /(\d+)([\t\040]+)\%/g,
        replacement: '$1%'
      },
      nbsp_before_open_quote: {
        description: 'Неразрывный пробел перед открывающей скобкой',
        pattern: /(^|\040|\t|>)([a-zа-яё]{1,2})\040(\&laquo\;|\&bdquo\;)/g,
        replacement: '$1$2&nbsp;$3'
      },
      nbsp_before_month: {
        description: 'Неразрывный пробел в датах перед числом и месяцем',
        pattern: /(\d)(\s)+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)([^\<]|$)/ig,
        replacement: '$1&nbsp;$3$4'
      },
      spaces_on_end: {
        description: 'Удаление пробелов в конце текста',
        pattern: /\s+$/,
        replacement: ''
      },
      no_space_posle_hellip: {
        description: 'Отсутстввие пробела после троеточия после открывающей кавычки',
        pattern: /(\&laquo\;|\&bdquo\;)( |\&nbsp\;)?\&hellip\;( |\&nbsp\;)?([a-zа-яё])/ig,
        replacement: '$1&hellip;$4'
      },
      space_posle_goda: {
        description: 'Пробел после года',
        pattern: /(^|\040|\&nbsp\;)([0-9]{3,4})(год([ауе]|ом)?)([^a-zа-яё]|$)/ig,
        replacement: '$1$2 $3$5'
      }
    };

    return EMTretSpace;

  })(EMTret);

  module.exports = EMTretSpace;

}).call(this);
