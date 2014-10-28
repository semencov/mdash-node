(function() {
  var EMTret, EMTretDash,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EMTret = require("../tret");

  EMTretDash = (function(_super) {
    __extends(EMTretDash, _super);

    function EMTretDash() {
      return EMTretDash.__super__.constructor.apply(this, arguments);
    }

    EMTretDash.prototype.title = "Дефисы и тире";

    EMTretDash.prototype.rules = {
      mdash_symbol_to_html_mdash: {
        description: 'Замена символа тире на html конструкцию',
        pattern: /—/ig,
        replacement: '&mdash;'
      },
      mdash: {
        description: 'Тире после кавычек, скобочек, пунктуации',
        pattern: [/([a-zа-яё0-9]+|\,|\:|\)|\&(ra|ld)quo\;|\|\"|\>)(\040|\t)(—|\-|\&mdash\;)(\s|$|\<)/gi, /(\,|\:|\)|\")(—|\-|\&mdash\;)(\s|$|\<)/gi],
        replacement: ['$1&nbsp;&mdash;$5', '$1&nbsp;&mdash;$3']
      },
      mdash_2: {
        description: 'Тире после переноса строки',
        pattern: /(\n|\r|^|\>)(\-|\&mdash\;)(\t|\040)/gm,
        replacement: '$1&mdash;&nbsp;'
      },
      mdash_3: {
        description: 'Тире после знаков восклицания, троеточия и прочее',
        pattern: /(\.|\!|\?|\&hellip\;)(\040|\t|\&nbsp\;)(\-|\&mdash\;)(\040|\t|\&nbsp\;)/g,
        replacement: '$1 &mdash;&nbsp;'
      },
      iz_za_pod: {
        description: 'Расстановка дефисов между из-за, из-под',
        pattern: /(\s|\&nbsp\;|\>|^)(из)(\040|\t|\&nbsp\;)\-?(за|под)([\.\,\!\?\:\;]|\040|\&nbsp\;)/gi,
        replacement: function(match, m) {
          return (m[1] === "&nbsp;" ? " " : m[1]) + m[2] + "-" + m[4] + (m[5] === "&nbsp;" ? " " : m[5]);
        }
      },
      to_libo_nibud: {
        description: 'Автоматическая простановка дефисов в обезличенных местоимениях и междометиях',
        cycled: true,
        pattern: /(\s|^|\&nbsp\;|\>)(кто|кем|когда|зачем|почему|как|что|чем|где|чего|кого)\-?(\040|\t|\&nbsp\;)\-?(то|либо|нибудь)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi,
        replacement: function(match, m) {
          return (m[1] === "&nbsp;" ? " " : m[1]) + m[2] + "-" + m[4] + (m[5] === "&nbsp;" ? " " : m[5]);
        }
      },
      koe_kak: {
        description: 'Кое-как, кой-кого, все-таки',
        cycled: true,
        pattern: [/(\s|^|\&nbsp\;|\>)(кое)\-?(\040|\t|\&nbsp\;)\-?(как)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi, /(\s|^|\&nbsp\;|\>)(кой)\-?(\040|\t|\&nbsp\;)\-?(кого)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi, /(\s|^|\&nbsp\;|\>)(вс[её])\-?(\040|\t|\&nbsp\;)\-?(таки)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi],
        replacement: function(match, m) {
          return (m[1] === "&nbsp;" ? " " : m[1]) + m[2] + "-" + m[4] + (m[5] === "&nbsp;" ? " " : m[5]);
        }
      },
      ka_de_kas: {
        description: 'Расстановка дефисов с частицами ка, де, кась',
        disabled: true,
        pattern: [/(\s|^|\&nbsp\;|\>)([а-яё]+)(\040|\t|\&nbsp\;)(ка)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi, /(\s|^|\&nbsp\;|\>)([а-яё]+)(\040|\t|\&nbsp\;)(де)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi, /(\s|^|\&nbsp\;|\>)([а-яё]+)(\040|\t|\&nbsp\;)(кась)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi],
        replacement: function(match, m) {
          return (m[1] === "&nbsp;" ? " " : m[1]) + m[2] + "-" + m[4] + (m[5] === "&nbsp;" ? " " : m[5]);
        }
      }
    };

    return EMTretDash;

  })(EMTret);

  module.exports = EMTretDash;

}).call(this);
