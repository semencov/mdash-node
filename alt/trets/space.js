(function() {
  var Space, Tret,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Tret = require("../tret");

  module.exports = Space = (function(_super) {
    __extends(Space, _super);

    function Space() {
      return Space.__super__.constructor.apply(this, arguments);
    }

    Space.prototype.order = 2;

    Space.prototype.domain_zones = ['ru', 'ру', 'ком', 'орг', 'уа', 'ua', 'uk', 'co', 'fr', 'lv', 'lt', 'ee', 'eu', 'com', 'net', 'edu', 'gov', 'org', 'mil', 'int', 'info', 'biz', 'info', 'name', 'pro'];

    Space.prototype.rules = {
      nobr_twosym_abbr: {
        pattern: [/([a-zA-Zа-яёА-ЯЁ])(\s|\t)+([A-ZА-ЯЁ]{2})([\s\;\.\?\!\:\(\"]|\&(ra|ld)quo\;|$)/g],
        replacement: [
          function() {
            return "" + $1 + "&nbsp;" + $3 + $4;
          }
        ]
      },
      remove_space_before_punctuationmarks: {
        pattern: [/((\s|\t|\&nbsp\;)+)([\,\:\.\;\?])(\s+|$)/g],
        replacement: [
          function() {
            return "" + $3 + $4;
          }
        ]
      },
      autospace_after_comma: {
        pattern: [/(\s|\t|\&nbsp\;)\,([а-яёa-z0-9])/ig, /([^0-9])\,([а-яёa-z0-9])/ig],
        replacement: [
          function() {
            return ", " + $2;
          }, function() {
            return "" + $1 + ", " + $2;
          }
        ]
      },
      autospace_after_pmarks: {
        pattern: [/(\s|\t|\&nbsp\;|^|\n)([a-zа-яё0-9]+)(\s|\t|\&nbsp\;)?(\:|\)|\,|\&hellip\;|(?:\!|\?)+)([а-яёa-z])/ig],
        replacement: [
          function() {
            return "" + $1 + $2 + $4 + " " + $5;
          }
        ]
      },
      autospace_after_dot: {
        pattern: [/(\s|\t|\&nbsp\;|^)([a-zа-яё0-9]+)(\s|\t|\&nbsp\;)?\.([а-яёa-z]{5,})($|[^a-zа-яё])/ig, /(\s|\t|\&nbsp\;|^)([a-zа-яё0-9]+)\.([а-яёa-z]{1,4})($|[^a-zа-яё])/ig],
        replacement: [
          function() {
            return ("" + $1 + $2 + ".") + ($5 === "." ? "" : " ") + ("" + $4 + $5);
          }, function() {
            var _ref;
            return ("" + $1 + $2 + ".") + ((_ref = $3.toLowerCase(), __indexOf.call(this.domain_zones, _ref) >= 0) || /[a-z]{1,12}/.test($3.toLowerCase()) ? "" : $4 === "." || $4 === "," || $4 === ";" || $4 === "!" ? "" : " ") + ("" + $3 + $4);
          }
        ]
      },
      autospace_after_hellips: {
        pattern: [/([\?\!]\.\.)([а-яёa-z])/ig],
        replacement: [
          function() {
            return "" + $1 + " " + $2;
          }
        ]
      },
      many_spaces_to_one: {
        pattern: [/(\s|\t)+/g],
        replacement: [
          function() {
            return ' ';
          }
        ]
      },
      clear_percent: {
        pattern: [/(\d+)([\t\s]+)\%/g],
        replacement: [
          function() {
            return "" + $1 + "%";
          }
        ]
      },
      nbsp_before_open_quote: {
        pattern: [/(^|\s|\t|>)([a-zа-яё]{1,2})\s(\&laquo\;|\&bdquo\;)/g],
        replacement: [
          function() {
            return "" + $1 + $2 + "&nbsp;" + $3;
          }
        ]
      },
      nbsp_before_month: {
        pattern: [/(\d)(\s)+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)([^\<]|$)/ig],
        replacement: [
          function() {
            return "" + $1 + "&nbsp;" + $3 + $4;
          }
        ]
      },
      spaces_on_end: {
        pattern: [/\s+$/],
        replacement: [
          function() {
            return '';
          }
        ]
      },
      no_space_posle_hellip: {
        pattern: [/(\&laquo\;|\&bdquo\;)( |\&nbsp\;)?\&hellip\;( |\&nbsp\;)?([a-zа-яё])/ig],
        replacement: [
          function() {
            return "" + $1 + "&hellip;" + $4;
          }
        ]
      },
      space_posle_goda: {
        pattern: [/(^|\s|\&nbsp\;)([0-9]{3,4})(год([ауе]|ом)?)([^a-zа-яё]|$)/ig],
        replacement: [
          function() {
            return "" + $1 + $2 + " " + $3 + $5;
          }
        ]
      }
    };

    return Space;

  })(Tret);

}).call(this);
