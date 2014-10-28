(function() {
  var EMTLib, EMTret, EMTretText,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EMTLib = require("../lib");

  EMTret = require("../tret");

  EMTretText = (function(_super) {
    __extends(EMTretText, _super);

    function EMTretText() {
      return EMTretText.__super__.constructor.apply(this, arguments);
    }

    EMTretText.prototype.title = "Текст и абзацы";

    EMTretText.prototype.classes = {
      nowrap: 'word-spacing:nowrap;'
    };

    EMTretText.prototype.rules = {
      auto_links: {
        description: 'Выделение ссылок из текста',
        pattern: /(\s|^)(http|ftp|mailto|https)(:\/\/)([^\s\,\!\<]{4,})(\s|\.|\,|\!|\?|\<|$)/ig,
        replacement: '$m[1] . $this->tag((substr($m[4],-1)=="."?substr($m[4],0,-1):$m[4]), "a", array("href" => $m[2].$m[3].(substr($m[4],-1)=="."?substr($m[4],0,-1):$m[4]))) . (substr($m[4],-1)=="."?".":"") .$m[5]'
      },
      email: {
        description: 'Выделение эл. почты из текста',
        pattern: '/(\s|^|\&nbsp\;|\()([a-z0-9\-\_\.]{2,})\@([a-z0-9\-\.]{2,})\.([a-z]{2,6})(\)|\s|\.|\,|\!|\?|$|\<)/e',
        replacement: function(match, m) {
          return m[1] + this.tag("" + m[2] + "@" + m[3] + "." + m[4], "a", {
            href: "mailto:" + m[2] + "@" + m[3] + "." + m[4]
          }) + m[5];
        }
      },
      no_repeat_words: {
        description: 'Удаление повторяющихся слов',
        disabled: true,
        pattern: [/([а-яё]{3,})( |\t|\&nbsp\;)\1/ig, /(\s|\&nbsp\;|^|\.|\!|\?)(([А-ЯЁ])([а-яё]{2,}))( |\t|\&nbsp\;)(([а-яё])\4)/g],
        replacement: [
          '$1', function(match, m) {
            return m[1] + (m[7] === ("" + m[3]).toLowerCase() ? m[2] : "" + m[2] + m[5] + m[6]);
          }
        ]
      },
      paragraphs: {
        description: 'Простановка параграфов',
        "function": 'build_paragraphs'
      },
      breakline: {
        description: 'Простановка переносов строк',
        "function": 'build_brs'
      }
    };

    EMTretText.prototype.do_paragraphs = function(text) {
      var self;
      self = this;
      text = text.replace(/\r\n/g, "\n");
      text = text.replace(/\r/g, "\n");
      text = "<" + this.BASE64_PARAGRAPH_TAG + ">" + (text.trim()) + "</" + this.BASE64_PARAGRAPH_TAG + ">";
      text = text.replace(/([\040\t]+)?(\n)+([\040\t]*)(\n)+/g, function($0, $1, $2, $3) {
        return ("" + $1 + "</" + self.BASE64_PARAGRAPH_TAG + ">" + EMTLib.INTERNAL_BLOCK_OPEN) + EMTLib.encrypt_tag("" + $2 + $3) + ("" + EMTLib.INTERNAL_BLOCK_CLOSE + "<" + self.BASE64_PARAGRAPH_TAG + ">");
      });
      text = text.replace(new RegExp("\<" + this.BASE64_PARAGRAPH_TAG + "\>(" + this.INTERNAL_BLOCK_OPEN + "[a-zA-Z0-9\/=]+?" + this.INTERNAL_BLOCK_CLOSE + ")?\<\/" + this.BASE64_PARAGRAPH_TAG + "\>", 'g'), "");
      return text;
    };

    EMTretText.prototype.build_paragraphs = function() {
      var beg, end, p, r;
      r = this._text.indexOf("<" + this.BASE64_PARAGRAPH_TAG + ">");
      p = this._text.lastIndexOf("</" + this.BASE64_PARAGRAPH_TAG + ">");
      if (r >= 0 && p >= 0) {
        beg = this._text.substr(0, r);
        end = this._text.substr(p + ("</" + this.BASE64_PARAGRAPH_TAG + ">").length);
        return this._text = (beg.trim() ? "" + (this.do_paragraphs(beg)) + "\n" : "") + ("<" + this.BASE64_PARAGRAPH_TAG + ">") + this._text.substr(r + ("<" + this.BASE64_PARAGRAPH_TAG + ">").length, p - (r + ("<" + this.BASE64_PARAGRAPH_TAG + ">").length)) + ("</" + this.BASE64_PARAGRAPH_TAG + ">") + (end.trim() ? "\n" + (this.do_paragraphs(end)) : "");
      } else {
        return this._text = this.do_paragraphs(this._text);
      }
    };

    EMTretText.prototype.build_brs = function() {
      var self;
      self = this;
      this._text = this._text.replace(new RegExp("(\<\/" + this.BASE64_PARAGRAPH_TAG + "\>)([\r\n \t]+)(\<" + this.BASE64_PARAGRAPH_TAG + "\>)", 'g'), function($0, $1, $2, $3) {
        return ("" + $1 + EMTLib.INTERNAL_BLOCK_OPEN) + EMTLib.encrypt_tag($2) + ("" + EMTLib.INTERNAL_BLOCK_CLOSE + $3);
      });
      if (!this._text.match(new RegExp("\<" + this.BASE64_BREAKLINE_TAG + "\>", 'g'))) {
        this._text = this._text.replace(/\r\n/g, "\n");
        this._text = this._text.replace(/\r/g, "\n");
        return this._text = this._text.replace(/(\n)/g, "<" + this.BASE64_BREAKLINE_TAG + ">\n");
      }
    };

    return EMTretText;

  })(EMTret);

  module.exports = EMTretText;

}).call(this);
