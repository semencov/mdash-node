(function() {
  var Lib, Symbol, Tret,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tret = require("../tret");

  Lib = require('../lib');

  module.exports = Symbol = (function(_super) {
    __extends(Symbol, _super);

    function Symbol() {
      return Symbol.__super__.constructor.apply(this, arguments);
    }

    Symbol.prototype.classes = {
      nowrap: 'white-space:nowrap;'
    };

    Symbol.prototype.rules = {
      tm_replace: {
        pattern: [/([\s\t])?\(tm\)/ig],
        replacement: [
          function() {
            return "&trade;";
          }
        ]
      },
      r_sign_replace: {
        pattern: [/(.|^)\(r\)(.|$)/ig],
        replacement: [
          function() {
            return "" + $1 + "&reg;" + $2;
          }
        ]
      },
      copy_replace: {
        pattern: [/\((c|с)\)\s+/ig, /\((c|с)\)($|\.|,|!|\?)/ig],
        replacement: [
          function() {
            return "&copy;&nbsp;";
          }, function() {
            return "&copy;" + $2;
          }
        ]
      },
      apostrophe: {
        pattern: [/(\s|^|\>|\&rsquo\;)([a-zа-яё]{1,})\'([a-zа-яё]+)/gi],
        replacement: [
          function() {
            return "" + $1 + $2 + "&rsquo;" + $3;
          }
        ],
        cycled: true
      },
      degree_f: {
        pattern: [/([0-9]+)F($|\s|\.|\,|\;|\:|\&nbsp\;|\?|\!)/g],
        replacement: [
          function() {
            return Lib.tag("" + $1 + " &deg;F", "nobr") + $2;
          }
        ]
      },
      euro_symbol: {
        pattern: ['/€/g'],
        replacement: [
          function() {
            return "&euro;";
          }
        ]
      },
      arrows_symbols: {
        pattern: [/(\s|\>|\&nbsp\;|^)\-\>($|\s|\&nbsp\;|\<)/g, /(\s|\>|\&nbsp\;|^|;)\<\-(\s|\&nbsp\;|$)/g, /→/g, /←/g],
        replacement: [
          function() {
            return "" + $1 + "&rarr;" + $2;
          }, function() {
            return "" + $1 + "&larr;" + $2;
          }, function() {
            return "&rarr;";
          }, function() {
            return "&larr;";
          }
        ]
      }
    };

    return Symbol;

  })(Tret);

}).call(this);
