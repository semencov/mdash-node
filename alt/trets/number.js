(function() {
  var Lib, Number, Tret,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tret = require("../tret");

  Lib = require('../lib');

  module.exports = Number = (function(_super) {
    __extends(Number, _super);

    function Number() {
      return Number.__super__.constructor.apply(this, arguments);
    }

    Number.prototype.order = 3;

    Number.prototype.rules = {
      minus_between_nums: {
        pattern: [/(\d+)\-(\d)/gi],
        replacement: [
          function() {
            return "" + $1 + "&minus;" + $2;
          }
        ]
      },
      minus_in_numbers_range: {
        pattern: [/(^|\s|\&nbsp\;)(\&minus\;|\-)(\d+)(\.\.\.|\&hellip\;)(\s|\&nbsp\;)?(\+|\-|\&minus\;)?(\d+)/ig],
        replacement: [
          function() {
            return ("" + $1 + "&minus;" + $3 + $4 + $5) + ($6 === "+" ? $6 : "&minus;") + $7;
          }
        ]
      },
      auto_times_x: {
        pattern: [/([^a-zA-Z><]|^)(\&times\;)?(\d+)(\s*)(x|х)(\s*)(\d+)([^a-zA-Z><]|$)/g],
        replacement: [
          function() {
            return "" + $1 + $2 + $3 + "&times;" + $7 + $8;
          }
        ]
      },
      numeric_sub: {
        pattern: [/([a-zа-яё0-9])\_([\d]{1,3})([^а-яёa-z0-9]|$)/ig],
        replacement: [
          function() {
            return $1 + Lib.tag(Lib.tag($2, "small"), "sub") + $3;
          }
        ]
      },
      numeric_sup: {
        pattern: [/([a-zа-яё0-9])\^([\d]{1,3})([^а-яёa-z0-9]|$)/ig],
        replacement: [
          function() {
            return $1 + Lib.tag(Lib.tag($2, "small"), "sup") + $3;
          }
        ]
      },
      simple_fraction: {
        pattern: [/(^|\D)1\/(2|4)(\D)/g, /(^|\D)3\/4(\D)/g],
        replacement: [
          function() {
            return "" + $1 + "&frac1" + $2 + ";" + $3;
          }, function() {
            return "" + $1 + "&frac34;" + $2;
          }
        ]
      },
      math_chars: {
        pattern: [/!=/g, /\<=/g, /([^=]|^)\>=/g, /~=/g, /\+-/g],
        replacement: [
          function() {
            return "&ne;";
          }, function() {
            return "&le;";
          }, function() {
            return "" + $1 + "&ge;";
          }, function() {
            return "&cong;";
          }, function() {
            return "&plusmn;";
          }
        ]
      },
      thinsp_between_number_triads: {
        pattern: [/([0-9]{1,3}( [0-9]{3}){1,})(.|$)/g],
        replacement: [
          function() {
            return ($3 === "-" ? $0 : $1.replace(" ", "&thinsp;")) + $3;
          }
        ]
      },
      thinsp_between_no_and_number: {
        pattern: [/(№|\&#8470\;)(\s|&nbsp;)*(\d)/ig],
        replacement: [
          function() {
            return "&#8470;&thinsp;" + $3;
          }
        ]
      },
      thinsp_between_sect_and_number: {
        pattern: [/(§|\&sect\;)(\s|&nbsp;)*(\d+|[IVX]+|[a-zа-яё]+)/gi],
        replacement: [
          function() {
            return "&sect;&thinsp;" + $3;
          }
        ]
      }
    };

    return Number;

  })(Tret);

}).call(this);
