(function() {
  var EMTret, EMTretDates,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EMTret = require("../tret");

  EMTretDates = (function(_super) {
    __extends(EMTretDates, _super);

    function EMTretDates() {
      return EMTretDates.__super__.constructor.apply(this, arguments);
    }

    EMTretDates.prototype.title = "Даты и дни";

    EMTretDates.prototype.classes = {
      nowrap: 'word-spacing:nowrap;'
    };

    EMTretDates.prototype.rules = {
      years: {
        description: 'Установка тире и пробельных символов в периодах дат',
        pattern: /(с|по|период|середины|начала|начало|конца|конец|половины|в|между|\([cс]\)|\&copy\;)(\s+|\&nbsp\;)([\d]{4})(-|\&mdash\;|\&minus\;)([\d]{4})(( |\&nbsp\;)?(г\.г\.|гг\.|гг|г\.|г)([^а-яёa-z]))?/gi,
        replacement: function(match, m) {
          return m[1] + m[2] + (parseInt(m[3]) >= parseInt(m[5]) ? m[3] + m[4] + m[5] : m[3] + "&mdash;" + m[5]) + (typeof m6 !== "undefined" && m6 !== null ? "&nbsp;гг + " : "") + (typeof m9 !== "undefined" && m9 !== null ? m[9] : "");
        }
      },
      mdash_month_interval: {
        description: 'Расстановка тире и объединение в неразрывные периоды месяцев',
        disabled: true,
        pattern: /((январ|феврал|сентябр|октябр|ноябр|декабр)([ьяюе]|[её]м)|(апрел|июн|июл)([ьяюе]|ем)|(март|август)([ауе]|ом)?|ма[йяюе]|маем)\-((январ|феврал|сентябр|октябр|ноябр|декабр)([ьяюе]|[её]м)|(апрел|июн|июл)([ьяюе]|ем)|(март|август)([ауе]|ом)?|ма[йяюе]|маем)/gi,
        replacement: '$1&mdash;$8'
      },
      nbsp_and_dash_month_interval: {
        description: 'Расстановка тире и объединение в неразрывные периоды дней',
        disabled: true,
        pattern: /([^\>]|^)(\d+)(\-|\&minus\;|\&mdash\;)(\d+)( |\&nbsp\;)(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)([^\<]|$)/gi,
        replacement: function(match, m) {
          return m[1] + this.tag(m[2] + "&mdash;" + m[4] + " " + m6, "span", {
            "class": "nowrap"
          }) + m[7];
        }
      },
      nobr_year_in_date: {
        description: 'Привязка года к дате',
        pattern: [/(\s|\&nbsp\;)([0-9]{2}\.[0-9]{2}\.([0-9]{2})?[0-9]{2})(\s|\&nbsp\;)?г(\.|\s|\&nbsp\;)/gi, /(\s|\&nbsp\;)([0-9]{2}\.[0-9]{2}\.([0-9]{2})?[0-9]{2})(\s|\&nbsp\;|\.(\s|\&nbsp\;|$)|$)/gi],
        replacement: [
          function(match, m) {
            return m[1] + this.tag("" + m[2] + " г.", "span", {
              "class": "nowrap"
            }) + (m[5] === "+" ? "" : " ");
          }, function(match, m) {
            return m[1] + this.tag(m[2], "span", {
              "class": "nowrap"
            }) + m[4];
          }
        ]
      },
      space_posle_goda: {
        description: 'Пробел после года',
        pattern: /(^|\040|\&nbsp\;)([0-9]{3,4})(год([ауе]|ом)?)([^a-zа-яё]|$)/gi,
        replacement: '$1$2 $3$5'
      },
      nbsp_posle_goda_abbr: {
        description: 'Пробел после года',
        pattern: /(^|\040|\&nbsp\;|\"|\&laquo\;)([0-9]{3,4})[ ]?(г\.)([^a-zа-яё]|$)/gi,
        replacement: '$1$2&nbsp;$3$4'
      }
    };

    return EMTretDates;

  })(EMTret);

  module.exports = EMTretDates;

}).call(this);
