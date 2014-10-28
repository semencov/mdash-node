(function() {
  var EMTret, EMTretPunctmark,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EMTret = require("../tret");

  EMTretPunctmark = (function(_super) {
    __extends(EMTretPunctmark, _super);

    function EMTretPunctmark() {
      return EMTretPunctmark.__super__.constructor.apply(this, arguments);
    }

    EMTretPunctmark.prototype.title = "Пунктуация и знаки препинания";

    EMTretPunctmark.prototype.rules = {
      auto_comma: {
        description: 'Расстановка запятых перед а, но',
        pattern: /([a-zа-яё])(\s|&nbsp;)(но|а)(\s|&nbsp;)/ig,
        replacement: '$1,$2$3$4'
      },
      punctuation_marks_limit: {
        description: 'Лишние восклицательные, вопросительные знаки и точки',
        pattern: /([\!\.\?]){4,}/g,
        replacement: '$1$1$1'
      },
      punctuation_marks_base_limit: {
        description: 'Лишние запятые, двоеточия, точки с запятой',
        pattern: /([\,]|[\:]|[\;]]){2,}/g,
        replacement: '$1'
      },
      hellip: {
        description: 'Замена трех точек на знак многоточия',
        simple_replace: true,
        pattern: /\.\.\./g,
        replacement: '&hellip;'
      },
      fix_excl_quest_marks: {
        description: 'Замена восклицательного и вопросительного знаков местами',
        pattern: /([a-zа-яё0-9])\!\?(\s|$|\<)/gi,
        replacement: '$1?!$2'
      },
      fix_pmarks: {
        description: 'Замена сдвоенных знаков препинания на одинарные',
        pattern: [/([^\!\?])\.\./g, /([a-zа-яё0-9])(\!|\.)(\!|\.|\?)(\s|$|\<)/gi, /([a-zа-яё0-9])(\?)(\?)(\s|$|\<)/gi],
        replacement: ['$1.', '$1$2$4', '$1$2$4']
      },
      fix_brackets: {
        description: 'Лишние пробелы после открывающей скобочки и перед закрывающей',
        pattern: [/(\()(\040|\t)+/g, /(\040|\t)+(\))/g],
        replacement: ['$1', '$2']
      },
      fix_brackets_space: {
        description: 'Пробел перед открывающей скобочкой',
        pattern: /([a-zа-яё0-9])(\()/ig,
        replacement: '$1 $2'
      },
      dot_on_end: {
        description: 'Точка в конце текста, если её там нет',
        disabled: true,
        pattern: /([a-zа-яё0-9])(\040|\t|\&nbsp\;)*$/gi,
        replacement: '$1.'
      }
    };

    return EMTretPunctmark;

  })(EMTret);

  module.exports = EMTretPunctmark;

}).call(this);
