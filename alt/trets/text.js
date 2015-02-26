(function() {
  var Lib, Text, Tret,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tret = require("../tret");

  Lib = require('../lib');

  module.exports = Text = (function(_super) {
    __extends(Text, _super);

    function Text() {
      return Text.__super__.constructor.apply(this, arguments);
    }

    Text.prototype.order = 1;

    Text.prototype.rules = {
      auto_links: {
        pattern: [/(\s|^)(http|ftp|mailto|https)(:\/\/)([^\s\,\!\<]{4,})(\s|\.|\,|\!|\?|\<|$)/ig],
        replacement: [
          function() {
            return $1 + Lib.tag(($4.substr(id.length - 1) === "." ? $4.substr(0, id.length - 1) : $4), "a", {
              href: ("" + $2 + $3) + ($4.substr(id.length - 1) === "." ? $4.substr(0, id.length - 1) : $4)
            }) + ($4.substr(id.length - 1) ? "." : "") + $5;
          }
        ]
      },
      email: {
        pattern: [/(\s|^|\&nbsp\;|\()([a-z0-9\-\_\.]{2,})\@([a-z0-9\-\.]{2,})\.([a-z]{2,6})(\)|\s|\.|\,|\!|\?|$|\<)/g],
        replacement: [
          function() {
            return $1 + Lib.tag("" + $2 + "@" + $3 + "." + $4, "a", {
              href: "mailto:" + $2 + "@" + $3 + "." + $4
            }) + $5;
          }
        ]
      },
      no_repeat_words: {
        pattern: [/([а-яё]{3,})( |\t|\&nbsp\;)\1/ig, /(\s|\&nbsp\;|^|\.|\!|\?)(([А-ЯЁ])([а-яё]{2,}))( |\t|\&nbsp\;)(([а-яё])\4)/g],
        replacement: [
          function() {
            return "" + $1;
          }, function() {
            return $1 + ($7 === ("" + $3).toLowerCase() ? $2 : "" + $2 + $5 + $6);
          }
        ]
      },
      paragraphs: {
        "function": function(text) {
          var beg, end, p, r;
          r = text.indexOf("<" + Lib.BASE64_PARAGRAPH_TAG + ">");
          p = text.lastIndexOf("</" + Lib.BASE64_PARAGRAPH_TAG + ">");
          if (r >= 0 && p >= 0) {
            beg = text.substr(0, r);
            end = text.substr(p + ("</" + Lib.BASE64_PARAGRAPH_TAG + ">").length);
            text = (beg.trim() ? "" + (this.do_paragraphs(beg)) + "\n" : "") + ("<" + Lib.BASE64_PARAGRAPH_TAG + ">") + text.substr(r + ("<" + Lib.BASE64_PARAGRAPH_TAG + ">").length, p - (r + ("<" + Lib.BASE64_PARAGRAPH_TAG + ">").length)) + ("</" + Lib.BASE64_PARAGRAPH_TAG + ">") + (end.trim() ? "\n" + (this.do_paragraphs(end)) : "");
          } else {
            text = this.do_paragraphs(text);
          }
          return text;
        }
      },
      breakline: {
        "function": function(text) {
          text = text.replace(new RegExp("(\<\/" + Lib.BASE64_PARAGRAPH_TAG + "\>)([\r\n \t]+)(\<" + Lib.BASE64_PARAGRAPH_TAG + "\>)", 'g'), function($0, $1, $2, $3) {
            return ("" + $1 + Lib.INTERNAL_BLOCK_OPEN) + Lib.encode($2) + ("" + Lib.INTERNAL_BLOCK_CLOSE + $3);
          });
          if (!text.match(new RegExp("\<" + Lib.BASE64_BREAKLINE_TAG + "\>", 'g'))) {
            text = text.replace(/\r\n/g, "\n");
            text = text.replace(/\r/g, "\n");
            text = text.replace(/(\n)/g, "<" + Lib.BASE64_BREAKLINE_TAG + ">\n");
          }
          return text;
        }
      }
    };

    Text.prototype.do_paragraphs = function(text) {
      text = text.replace(/\r\n?/g, "\n");
      text = "<" + Lib.BASE64_PARAGRAPH_TAG + ">" + (text.trim()) + "</" + Lib.BASE64_PARAGRAPH_TAG + ">";
      text = text.replace(/([\s\t]+)?(\n)+([\s\t]*)(\n)+/g, function($0, $1, $2, $3) {
        if ($1 == null) {
          $1 = "";
        }
        return ("" + $1 + "<" + Lib.BASE64_PARAGRAPH_TAG + ">" + Lib.INTERNAL_BLOCK_OPEN) + Lib.encode("" + $2 + $3) + ("" + Lib.INTERNAL_BLOCK_CLOSE + "</" + Lib.BASE64_PARAGRAPH_TAG + ">");
      });
      text = text.replace(new RegExp("\<" + Lib.BASE64_PARAGRAPH_TAG + "\>(" + Lib.INTERNAL_BLOCK_OPEN + "[a-zA-Z0-9\/=]+?" + Lib.INTERNAL_BLOCK_CLOSE + ")?\<\/" + Lib.BASE64_PARAGRAPH_TAG + "\>", 'g'), "");
      return text;
    };

    return Text;

  })(Tret);

}).call(this);
