(function() {
  var Date, Lib, Tret,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tret = require("../tret");

  Lib = require('../lib');

  module.exports = Date = (function(_super) {
    __extends(Date, _super);

    function Date() {
      return Date.__super__.constructor.apply(this, arguments);
    }

    Date.prototype.order = 5;

    Date.prototype.rules = {
      years: {
        pattern: [/(с|по|период|середины|начала|начало|конца|конец|половины|в|между|\([cс]\)|\&copy\;)(\s+|\&nbsp\;)([\d]{4})(-|\&mdash\;|\&minus\;)([\d]{4})(( |\&nbsp\;)?(г\.г\.|гг\.|гг|г\.|г)([^а-яёa-z]))?/gi],
        replacement: [
          function() {
            return ("" + $1 + $2) + (parseInt($3) >= parseInt($5) ? "" + $3 + $4 + $5 : "" + $3 + "&mdash;" + $5) + (typeof $6 !== "undefined" && $6 !== null ? "&nbsp;гг" : "") + (typeof $9 !== "undefined" && $9 !== null ? $9 : "");
          }
        ]
      },
      mdash_month_interval: {
        pattern: [/((январ|феврал|сентябр|октябр|ноябр|декабр)([ьяюе]|[её]м)|(апрел|июн|июл)([ьяюе]|ем)|(март|август)([ауе]|ом)?|ма[йяюе]|маем)\-((январ|феврал|сентябр|октябр|ноябр|декабр)([ьяюе]|[её]м)|(апрел|июн|июл)([ьяюе]|ем)|(март|август)([ауе]|ом)?|ма[йяюе]|маем)/gi],
        replacement: [
          function() {
            return "" + $1 + "&mdash;" + $8;
          }
        ]
      },
      nbsp_and_dash_month_interval: {
        pattern: [/([^\>]|^)(\d+)(\-|\&minus\;|\&mdash\;)(\d+)( |\&nbsp\;)(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)([^\<]|$)/gi],
        replacement: [
          function() {
            return $1 + Lib.tag("" + $2 + "&mdash;" + $4 + " " + $6, "nobr") + $7;
          }
        ]
      },
      nobr_year_in_date: {
        pattern: [/(\s|\&nbsp\;)([0-9]{2}\.[0-9]{2}\.([0-9]{2})?[0-9]{2})(\s|\&nbsp\;)?г(\.|\s|\&nbsp\;)/gi, /(\s|\&nbsp\;)([0-9]{2}\.[0-9]{2}\.([0-9]{2})?[0-9]{2})(\s|\&nbsp\;|\.(\s|\&nbsp\;|$)|$)/gi],
        replacement: [
          function() {
            return $1 + Lib.tag("" + $2 + " г.", "nobr") + ($5 === "+" ? "" : " ");
          }, function() {
            return $1 + Lib.tag($2, "nobr") + $4;
          }
        ]
      },
      space_posle_goda: {
        pattern: [/(^|\s|\&nbsp\;)([0-9]{3,4})(год([ауе]|ом)?)([^a-zа-яё]|$)/gi],
        replacement: [
          function() {
            return "" + $1 + $2 + " " + $3 + $5;
          }
        ]
      },
      nbsp_posle_goda_abbr: {
        pattern: [/(^|\s|\&nbsp\;|\"|\&laquo\;)([0-9]{3,4})[ ]?(г\.)([^a-zа-яё]|$)/gi],
        replacement: [
          function() {
            return "" + $1 + $2 + "&nbsp;" + $3 + $4;
          }
        ]
      }
    };

    return Date;

  })(Tret);

}).call(this);
