(function() {
  var EMTLib, EMTret, EMTretOptAlign,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EMTLib = require("../lib");

  EMTret = require("../tret");

  EMTretOptAlign = (function(_super) {
    __extends(EMTretOptAlign, _super);

    function EMTretOptAlign() {
      return EMTretOptAlign.__super__.constructor.apply(this, arguments);
    }

    EMTretOptAlign.prototype.title = "Оптическое выравнивание";

    EMTretOptAlign.prototype.classes = {
      oa_obracket_sp_s: "margin-right:0.3em;",
      oa_obracket_sp_b: "margin-left:-0.3em;",
      oa_obracket_nl_b: "margin-left:-0.3em;",
      oa_comma_b: "margin-right:-0.2em;",
      oa_comma_e: "margin-left:0.2em;",
      oa_oquote_nl: "margin-left:-0.44em;",
      oa_oqoute_sp_s: "margin-right:0.44em;",
      oa_oqoute_sp_q: "margin-left:-0.44em;"
    };

    EMTretOptAlign.prototype.rules = {
      oa_oquote: {
        description: 'Оптическое выравнивание открывающей кавычки',
        pattern: [/([a-zа-яё\-]{3,})(\040|\&nbsp\;|\t)(\&laquo\;)/ig, /(\n|\r|^)(\&laquo\;)/ig],
        replacement: [
          function(match, m) {
            return m[1] + this.tag(m[2], "span", {
              "class": "oa_oqoute_sp_s"
            }) + this.tag(m[3], "span", {
              "class": "oa_oqoute_sp_q"
            });
          }, function(match, m) {
            return m[1] + this.tag(m[2], "span", {
              "class": "oa_oquote_nl"
            });
          }
        ]
      },
      oa_oquote_extra: {
        description: 'Оптическое выравнивание кавычки',
        "function": 'oaquote_extra'
      },
      oa_obracket_coma: {
        description: 'Оптическое выравнивание для пунктуации (скобка и запятая)',
        pattern: [/(\040|\&nbsp\;|\t)\(/g, /(\n|\r|^)\(/g, /([а-яёa-z0-9]+)\,(\040+)/g],
        replacement: [
          function(match, m) {
            return this.tag(m[1], "span", {
              "class": "oa_obracket_sp_s"
            }) + this.tag("(", "span", {
              "class": "oa_obracket_sp_b"
            });
          }, function(match, m) {
            return m[1] + this.tag("(", "span", {
              "class": "oa_obracket_nl_b"
            });
          }, function(match, m) {
            return m[1] + this.tag(",", "span", {
              "class": "oa_comma_b"
            }) + this.tag(" ", "span", {
              "class": "oa_comma_e"
            });
          }
        ]
      }
    };

    EMTretOptAlign.prototype.oaquote_extra = function(text) {
      var self;
      self = this;
      return text.replace(new RegExp("(<" + this.BASE64_PARAGRAPH_TAG + ">)([\\s]+)?(\\&laquo\\;)", 'ig'), function($0, $1, $2, $3) {
        return $1 + self.tag($3, "span", {
          "class": "oa_oquote_nl"
        });
      });
    };

    return EMTretOptAlign;

  })(EMTret);

  module.exports = EMTretOptAlign;

}).call(this);
