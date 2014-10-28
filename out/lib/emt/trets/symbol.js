(function() {
  var EMTret, EMTretSymbol,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EMTret = require("../tret");

  EMTretSymbol = (function(_super) {
    __extends(EMTretSymbol, _super);

    function EMTretSymbol() {
      return EMTretSymbol.__super__.constructor.apply(this, arguments);
    }

    EMTretSymbol.prototype.title = "Специальные символы";

    EMTretSymbol.prototype.classes = {
      nowrap: 'word-spacing:nowrap;'
    };

    EMTretSymbol.prototype.rules = {
      tm_replace: {
        description: 'Замена (tm) на символ торговой марки',
        pattern: /([\040\t])?\(tm\)/ig,
        replacement: '&trade;'
      },
      r_sign_replace: {
        description: 'Замена (R) на символ зарегистрированной торговой марки',
        pattern: /(.|^)\(r\)(.|$)/ig,
        replacement: function(match, m) {
          return "" + m[1] + "&reg;" + m[2];
        }
      },
      copy_replace: {
        description: 'Замена (c) на символ копирайт',
        pattern: [/\((c|с)\)\s+/ig, /\((c|с)\)($|\.|,|!|\?)/ig],
        replacement: ['&copy;&nbsp;', '&copy;$2']
      },
      apostrophe: {
        description: 'Расстановка правильного апострофа в текстах',
        pattern: /(\s|^|\>|\&rsquo\;)([a-zа-яё]{1,})\'([a-zа-яё]+)/gi,
        replacement: '$1$2&rsquo;$3',
        cycled: true
      },
      degree_f: {
        description: 'Градусы по Фаренгейту',
        pattern: /([0-9]+)F($|\s|\.|\,|\;|\:|\&nbsp\;|\?|\!)/g,
        replacement: function(match, m) {
          return this.tag("" + m[1] + " &deg;F", "span", {
            "class": "nowrap"
          }) + m[2];
        }
      },
      euro_symbol: {
        description: 'Символ евро',
        simple_replace: true,
        pattern: '€',
        replacement: '&euro;'
      },
      arrows_symbols: {
        description: 'Замена стрелок вправо-влево на html коды',
        pattern: [/(\s|\>|\&nbsp\;|^)\-\>($|\s|\&nbsp\;|\<)/g, /(\s|\>|\&nbsp\;|^|;)\<\-(\s|\&nbsp\;|$)/g, /→/g, /←/g],
        replacement: ['$1&rarr;$2', '$1&larr;$2', '&rarr;', '&larr;']
      }
    };

    return EMTretSymbol;

  })(EMTret);

  module.exports = EMTretSymbol;

}).call(this);
