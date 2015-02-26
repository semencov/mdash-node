(function() {
  var Punctmark, Tret,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tret = require("../tret");

  module.exports = Punctmark = (function(_super) {
    __extends(Punctmark, _super);

    function Punctmark() {
      return Punctmark.__super__.constructor.apply(this, arguments);
    }

    Punctmark.prototype.order = 4;

    Punctmark.prototype.rules = {
      auto_comma: {
        pattern: [/([a-zа-яё])(\s|&nbsp;)(но|а)(\s|&nbsp;)/ig],
        replacement: [
          function() {
            return "" + $1 + "," + $2 + $3 + $4;
          }
        ]
      },
      punctuation_marks_limit: {
        pattern: [/([\!\.\?]){4,}/g],
        replacement: [
          function() {
            return "" + $1 + $1 + $1;
          }
        ]
      },
      punctuation_marks_base_limit: {
        pattern: [/([\,]|[\:]|[\;]]){2,}/g],
        replacement: [
          function() {
            return "$1";
          }
        ]
      },
      hellip: {
        pattern: [/\.\.\./g],
        replacement: [
          function() {
            return "&hellip;";
          }
        ]
      },
      fix_excl_quest_marks: {
        pattern: [/([a-zа-яё0-9])\!\?(\s|$|\<)/gi],
        replacement: [
          function() {
            return "" + $1 + "?!" + $2;
          }
        ]
      },
      fix_pmarks: {
        pattern: [/([^\!\?])\.\./g, /([a-zа-яё0-9])(\!|\.)(\!|\.|\?)(\s|$|\<)/gi, /([a-zа-яё0-9])(\?)(\?)(\s|$|\<)/gi],
        replacement: [
          function() {
            return "" + $1 + ".";
          }, function() {
            return "" + $1 + $2 + $4;
          }, function() {
            return "" + $1 + $2 + $4;
          }
        ]
      },
      fix_brackets: {
        pattern: [/(\()(\s|\t)+/g, /(\s|\t)+(\))/g],
        replacement: [
          function() {
            return "" + $1;
          }, function() {
            return "" + $2;
          }
        ]
      },
      fix_brackets_space: {
        pattern: [/([a-zа-яё0-9])(\()/ig],
        replacement: [
          function() {
            return "" + $1 + " " + $2;
          }
        ]
      },
      dot_on_end: {
        pattern: [/([a-zа-яё0-9])(\s|\t|\&nbsp\;)*$/gi],
        replacement: [
          function() {
            return "" + $1 + ".";
          }
        ]
      }
    };

    return Punctmark;

  })(Tret);

}).call(this);
