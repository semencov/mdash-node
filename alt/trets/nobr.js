(function() {
  var Lib, Nobr, Tret,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tret = require("../tret");

  Lib = require('../lib');

  module.exports = Nobr = (function(_super) {
    __extends(Nobr, _super);

    function Nobr() {
      return Nobr.__super__.constructor.apply(this, arguments);
    }

    Nobr.prototype.rules = {
      super_nbsp: {
        pattern: [/(\s|^|\&(la|bd)quo\;|\>|\(|\&mdash\;\&nbsp\;)([a-zа-яё]{1,2}\s+)([a-zа-яё]{1,2}\s+)?([a-zа-яё0-9\-]{2,}|[0-9])/ig],
        replacement: [
          function() {
            return ("" + $1 + ($3.trim()) + "&nbsp;") + (typeof $4 !== "undefined" && $4 !== null ? ("" + $4).trim() + "&nbsp;" : "") + $5;
          }
        ]
      },
      nbsp_in_the_end: {
        pattern: [/([a-zа-яё0-9\-]{3,}) ([a-zа-яё]{1,2})\.( [A-ZА-ЯЁ]|$)/g],
        replacement: [
          function() {
            return "" + $1 + "&nbsp;" + $2 + "." + $3;
          }
        ]
      },
      phone_builder: {
        pattern: [/([^\d\+]|^)([\+]?[0-9]{1,3})( |\&nbsp\;|\&thinsp\;)([0-9]{3,4}|\([0-9]{3,4}\))( |\&nbsp\;|\&thinsp\;)([0-9]{2,3})(-|\&minus\;)([0-9]{2})(-|\&minus\;)([0-9]{2})([^\d]|$)/g, /([^\d\+]|^)([\+]?[0-9]{1,3})( |\&nbsp\;|\&thinsp\;)([0-9]{3,4}|[0-9]{3,4})( |\&nbsp\;|\&thinsp\;)([0-9]{2,3})(-|\&minus\;)([0-9]{2})(-|\&minus\;)([0-9]{2})([^\d]|$)/g],
        replacement: [
          function() {
            return $1 + ($1 === ">" || $1 === "<" ? "" + $2 + " " + $4 + " " + $6 + "-" + $8 + "-" + $1 : Lib.tag("" + $2 + " " + $4 + " " + $6 + "-" + $8 + "-" + $1, "nobr")) + $1;
          }
        ]
      },
      ip_address: {
        pattern: [/(\s|\&nbsp\;|^)(\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3})/ig],
        replacement: [
          function() {
            return $1 + this.nowrap_ip_address($2);
          }
        ]
      },
      spaces_nobr_in_surname_abbr: {
        pattern: [/(\s|^|\.|\,|\;|\:|\?|\!|\&nbsp\;)([А-ЯЁ])\.?(\s|\&nbsp\;)?([А-ЯЁ])(\.(\s|\&nbsp\;)?|(\s|\&nbsp\;))([А-ЯЁ][а-яё]+)(\s|$|\.|\,|\;|\:|\?|\!|\&nbsp\;)/g, /(\s|^|\.|\,|\;|\:|\?|\!|\&nbsp\;)([А-ЯЁ][а-яё]+)(\s|\&nbsp\;)([А-ЯЁ])\.?(\s|\&nbsp\;)?([А-ЯЁ])\.?(\s|$|\.|\,|\;|\:|\?|\!|\&nbsp\;)/g],
        replacement: [
          function() {
            return $1 + Lib.tag("" + $2 + ". " + $4 + ". " + $8, "nobr") + $9;
          }, function() {
            return $1 + Lib.tag("" + $2 + " " + $4 + ". " + $6 + ".", "nobr") + $7;
          }
        ]
      },
      nbsp_before_particle: {
        pattern: [/(\s|\t)+(ли|бы|б|же|ж)(\&nbsp\;|\.|\,|\:|\;|\&hellip\;|\?|\s)/ig],
        replacement: [
          function() {
            return ("&nbsp;" + $2) + ($3 === "&nbsp;" ? " " : $3);
          }
        ]
      },
      nbsp_v_kak_to: {
        pattern: [/как то\:/gi],
        replacement: [
          function() {
            return "как&nbsp;то:";
          }
        ]
      },
      nbsp_celcius: {
        pattern: [/(\s|^|\>|\&nbsp\;)(\d+)( |\&nbsp\;)?(°|\&deg\;)(C|С)(\s|\.|\!|\?|\,|$|\&nbsp\;|\;)/ig],
        replacement: [
          function() {
            return "" + $1 + $2 + "&nbsp;" + $4 + "C" + $6;
          }
        ]
      },
      hyphen_nowrap_in_small_words: {
        pattern: [/(\&nbsp\;|\s|\>|^)([a-zа-яё]{1}\-[a-zа-яё]{4}|[a-zа-яё]{2}\-[a-zа-яё]{3}|[a-zа-яё]{3}\-[a-zа-яё]{2}|[a-zа-яё]{4}\-[a-zа-яё]{1}|когда\-то|кое\-как|кой\-кого|вс[её]\-таки|[а-яё]+\-(кась|ка|де))(\s|\.|\,|\!|\?|\&nbsp\;|\&hellip\;|$)/gi],
        replacement: [
          function() {
            return $1 + Lib.tag($2, "nobr") + $4;
          }
        ]
      },
      hyphen_nowrap: {
        pattern: [/(\&nbsp\;|\s|\>|^)([a-zа-яё]+)((\-([a-zа-яё]+)){1,2})(\s|\.|\,|\!|\?|\&nbsp\;|\&hellip\;|$)/gi],
        replacement: [
          function() {
            return $1 + Lib.tag("" + $2 + $3, "nobr") + $6;
          }
        ]
      }
    };

    Nobr.prototype.nowrap_ip_address = function(triads) {
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
        triads = Lib.tag(triads, 'nobr');
      }
      return triads;
    };

    return Nobr;

  })(Tret);

}).call(this);
