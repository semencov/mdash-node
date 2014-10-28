(function() {
  var EMTret, EMTretNobr,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EMTret = require("../tret");

  EMTretNobr = (function(_super) {
    __extends(EMTretNobr, _super);

    function EMTretNobr() {
      return EMTretNobr.__super__.constructor.apply(this, arguments);
    }

    EMTretNobr.prototype.title = "Неразрывные конструкции";

    EMTretNobr.prototype.classes = {
      nowrap: 'word-spacing:nowrap;'
    };

    EMTretNobr.prototype.rules = {
      super_nbsp: {
        description: 'Привязка союзов и предлогов к написанным после словам',
        pattern: /(\s|^|\&(la|bd)quo\;|\>|\(|\&mdash\;\&nbsp\;)([a-zа-яё]{1,2}\s+)([a-zа-яё]{1,2}\s+)?([a-zа-яё0-9\-]{2,}|[0-9])/ig,
        replacement: function(match, m) {
          return m[1] + m[3].trim() + "&nbsp;" + (m[4] ? m[4].trim() + "&nbsp;" : "") + m[5];
        }
      },
      nbsp_in_the_end: {
        description: 'Привязка союзов и предлогов к предыдущим словам в случае конца предложения',
        pattern: /([a-zа-яё0-9\-]{3,}) ([a-zа-яё]{1,2})\.( [A-ZА-ЯЁ]|$)/g,
        replacement: '$1&nbsp;$1.$1'
      },
      phone_builder: {
        description: 'Объединение в неразрывные конструкции номеров телефонов',
        pattern: [/([^\d\+]|^)([\+]?[0-9]{1,3})( |\&nbsp\;|\&thinsp\;)([0-9]{3,4}|\([0-9]{3,4}\))( |\&nbsp\;|\&thinsp\;)([0-9]{2,3})(-|\&minus\;)([0-9]{2})(-|\&minus\;)([0-9]{2})([^\d]|$)/g, /([^\d\+]|^)([\+]?[0-9]{1,3})( |\&nbsp\;|\&thinsp\;)([0-9]{3,4}|[0-9]{3,4})( |\&nbsp\;|\&thinsp\;)([0-9]{2,3})(-|\&minus\;)([0-9]{2})(-|\&minus\;)([0-9]{2})([^\d]|$)/g],
        replacement: function(match, m) {
          return m[1] + (m[1] === ">" || m[1] === "<" ? "" + m[2] + " " + m[4] + " " + m[6] + "-" + m[8] + "-" + m[1] : this.tag("" + m[2] + " " + m[4] + " " + m[6] + "-" + m[8] + "-" + m[1], "span", {
            "class": "nowrap"
          })) + m[1];
        }
      },
      ip_address: {
        description: 'Объединение IP-адресов',
        pattern: /(\s|\&nbsp\;|^)(\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3})/ig,
        replacement: function(match, m) {
          return m[1] + this.nowrap_ip_address(m[2]);
        }
      },
      spaces_nobr_in_surname_abbr: {
        description: 'Привязка инициалов к фамилиям',
        pattern: [/(\s|^|\.|\,|\;|\:|\?|\!|\&nbsp\;)([А-ЯЁ])\.?(\s|\&nbsp\;)?([А-ЯЁ])(\.(\s|\&nbsp\;)?|(\s|\&nbsp\;))([А-ЯЁ][а-яё]+)(\s|$|\.|\,|\;|\:|\?|\!|\&nbsp\;)/g, /(\s|^|\.|\,|\;|\:|\?|\!|\&nbsp\;)([А-ЯЁ][а-яё]+)(\s|\&nbsp\;)([А-ЯЁ])\.?(\s|\&nbsp\;)?([А-ЯЁ])\.?(\s|$|\.|\,|\;|\:|\?|\!|\&nbsp\;)/g],
        replacement: [
          function(match, m) {
            return m[1] + this.tag("" + m[2] + ". " + m[4] + ". " + m[8], "span", {
              "class": "nowrap"
            }) + m[9];
          }, function(match, m) {
            return m[1] + this.tag("" + m[2] + " " + m[4] + ". " + m[6] + ".", "span", {
              "class": "nowrap"
            }) + m[7];
          }
        ]
      },
      nbsp_before_particle: {
        description: 'Неразрывный пробел перед частицей',
        pattern: /(\040|\t)+(ли|бы|б|же|ж)(\&nbsp\;|\.|\,|\:|\;|\&hellip\;|\?|\s)/ig,
        replacement: function(match, m) {
          return ("&nbsp;" + m[2]) + (m[3] === "&nbsp;" ? " " : m[3]);
        }
      },
      nbsp_v_kak_to: {
        description: 'Неразрывный пробел в как то',
        pattern: /как то\:/gi,
        replacement: 'как&nbsp;то:'
      },
      nbsp_celcius: {
        description: 'Привязка градусов к числу',
        pattern: /(\s|^|\>|\&nbsp\;)(\d+)( |\&nbsp\;)?(°|\&deg\;)(C|С)(\s|\.|\!|\?|\,|$|\&nbsp\;|\;)/ig,
        replacement: '$1$1&nbsp;$1C$1'
      },
      hyphen_nowrap_in_small_words: {
        description: 'Обрамление пятисимвольных слов разделенных дефисом в неразрывные блоки',
        disabled: true,
        cycled: true,
        pattern: /(\&nbsp\;|\s|\>|^)([a-zа-яё]{1}\-[a-zа-яё]{4}|[a-zа-яё]{2}\-[a-zа-яё]{3}|[a-zа-яё]{3}\-[a-zа-яё]{2}|[a-zа-яё]{4}\-[a-zа-яё]{1}|когда\-то|кое\-как|кой\-кого|вс[её]\-таки|[а-яё]+\-(кась|ка|де))(\s|\.|\,|\!|\?|\&nbsp\;|\&hellip\;|$)/gi,
        replacement: function(match, m) {
          return m[1] + this.tag(m[2], "span", {
            "class": "nowrap"
          }) + m[4];
        }
      },
      hyphen_nowrap: {
        description: 'Отмена переноса слова с дефисом',
        disabled: true,
        cycled: true,
        pattern: /(\&nbsp\;|\s|\>|^)([a-zа-яё]+)((\-([a-zа-яё]+)){1,2})(\s|\.|\,|\!|\?|\&nbsp\;|\&hellip\;|$)/gi,
        replacement: function(match, m) {
          return m[1] + this.tag("" + m[2] + m[3], "span", {
            "class": "nowrap"
          }) + m[6];
        }
      }
    };

    EMTretNobr.prototype.nowrap_ip_address = function(triads) {
      var addTag, triad, value, _i, _len;
      triad = triads.split('.');
      addTag = true;
      for (_i = 0, _len = triad.length; _i < _len; _i++) {
        value = triad[_i];
        value = parseInt(value);
        if (value > 255) {
          addTag = false;
          break;
        }
      }
      if (addTag === true) {
        triads = this.tag(triads, 'span', {
          "class": "nowrap"
        });
      }
      return triads;
    };

    return EMTretNobr;

  })(EMTret);

  module.exports = EMTretNobr;

}).call(this);
