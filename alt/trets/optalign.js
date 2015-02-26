(function() {
  var Lib, OptAlign, Tret,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tret = require("../tret");

  Lib = require('../lib');

  module.exports = OptAlign = (function(_super) {
    __extends(OptAlign, _super);

    function OptAlign() {
      return OptAlign.__super__.constructor.apply(this, arguments);
    }

    OptAlign.prototype.order = 11;

    OptAlign.prototype.classes = {
      oa_obracket_sp_s: "margin-right:0.3em;",
      oa_obracket_sp_b: "margin-left:-0.3em;",
      oa_obracket_nl_b: "margin-left:-0.3em;",
      oa_comma_b: "margin-right:-0.2em;",
      oa_comma_e: "margin-left:0.2em;",
      oa_oquote_nl: "margin-left:-0.44em;",
      oa_oqoute_sp_s: "margin-right:0.44em;",
      oa_oqoute_sp_q: "margin-left:-0.44em;"
    };

    OptAlign.prototype.rules = {
      oa_oquote: {
        pattern: [/([a-zа-яё\-]{3,})(\s|\&nbsp\;|\t)(\&laquo\;)/ig, /(\n|\r|^)(\&laquo\;)/ig],
        replacement: [
          function() {
            return $1 + Lib.tag($2, "span", {
              "class": "oa-oqoute-sp-s"
            }) + Lib.tag($3, "span", {
              "class": "oa-oqoute-sp-q"
            });
          }, function() {
            return $1 + Lib.tag($2, "span", {
              "class": "oa-oquote-nl"
            });
          }
        ]
      },
      oa_obracket_coma: {
        pattern: [/(\s|\&nbsp\;|\t)\(/g, /(\n|\r|^)\(/g, /([а-яёa-z0-9]+)\,(\s+)/g],
        replacement: [
          function() {
            return Lib.tag($1, "span", {
              "class": "oa-obracket-sp-s"
            }) + Lib.tag("(", "span", {
              "class": "oa-obracket-sp-b"
            });
          }, function() {
            return $1 + Lib.tag("(", "span", {
              "class": "oa-obracket-nl-b"
            });
          }, function() {
            return $1 + Lib.tag(",", "span", {
              "class": "oa-comma-b"
            }) + Lib.tag(" ", "span", {
              "class": "oa-comma-e"
            });
          }
        ]
      },
      oa_oquote_extra: {
        "function": function(text) {
          var self;
          self = this;
          return text.replace(new RegExp("(<" + Lib.BASE64_PARAGRAPH_TAG + ">)([\\s]+)?(\\&laquo\\;)", 'ig'), function($0, $1, $2, $3) {
            return $1 + Lib.tag($3, "span", {
              "class": "oa-oquote-nl"
            });
          });
        }
      }
    };

    return OptAlign;

  })(Tret);

}).call(this);
