(function() {
  var EMTLib, EMTret, EMTretQuote,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EMTLib = require("../lib");

  EMTret = require("../tret");

  EMTretQuote = (function(_super) {
    __extends(EMTretQuote, _super);

    function EMTretQuote() {
      return EMTretQuote.__super__.constructor.apply(this, arguments);
    }

    EMTretQuote.prototype.title = "Кавычки";

    EMTretQuote.prototype.__ax = 0;

    EMTretQuote.prototype.__ay = 0;

    EMTretQuote.prototype.rules = {
      quotes_outside_a: {
        description: 'Кавычки вне тэга <a>',
        pattern: /(\<\%\%\%\_\_[^\>]+\>)\"(.+?)\"(\<\/\%\%\%\_\_[^\>]+\>)/g,
        replacement: function(match, m) {
          return "&laquo;" + m[1] + m[2] + m[3] + "&raquo;";
        }
      },
      open_quote: {
        description: 'Открывающая кавычка',
        pattern: /(^|\(|\s|\>|-)(\"|\\\"|\&laquo\;)(\S+)/ig,
        replacement: function(match, m) {
          return "" + m[1] + this.QUOTE_FIRS_OPEN + m[3];
        }
      },
      close_quote: {
        description: 'Закрывающая кавычка',
        pattern: /([a-zа-яё0-9]|\.|\&hellip\;|\!|\?|\>|\)|\:)((\"|\\\"|\&raquo\;)+)(\.|\&hellip\;|\;|\:|\?|\!|\,|\s|\)|\<\/|$)/gi,
        replacement: function(match, m) {
          return ("" + m[1]) + this.str_repeat(this.QUOTE_FIRS_CLOSE, (m[2].split("\"").length - 1) + (m[2].split("&raquo;").length - 1)) + ("" + m[4]);
        }
      },
      close_quote_adv: {
        description: 'Закрывающая кавычка особые случаи',
        pattern: [/([a-zа-яё0-9]|\.|\&hellip\;|\!|\?|\>|\)|\:)((\"|\\\"|\&laquo\;)+)(\<[^\>]+\>)(\.|\&hellip\;|\;|\:|\?|\!|\,|\)|\<\/|$| )/gi, /([a-zа-яё0-9]|\.|\&hellip\;|\!|\?|\>|\)|\:)(\s+)((\"|\\\")+)(\s+)(\.|\&hellip\;|\;|\:|\?|\!|\,|\)|\<\/|$| )/gi, /\>(\&laquo\;)\.($|\s|\<)/gi, /\>(\&laquo\;),($|\s|\<|\S)/gi, /\>(\&laquo\;):($|\s|\<|\S)/gi],
        replacement: [
          function(match, m) {
            return ("" + m[1]) + this.str_repeat(this.QUOTE_FIRS_CLOSE, (m[2].split("\"").length - 1) + (m[2].split("&laquo;").length - 1)) + ("" + m[4] + m[5]);
          }, function(match, m) {
            return ("" + m[1] + m[2]) + this.str_repeat(this.QUOTE_FIRS_CLOSE, (m[3].split("\"").length - 1) + (m[3].split("&laquo;").length - 1)) + ("" + m[5] + m[6]);
          }, '>&raquo;.$2', '>&raquo;,$2', '>&raquo;:$2'
        ]
      },
      open_quote_adv: {
        description: 'Открывающая кавычка особые случаи',
        pattern: /(^|\(|\s|\>)(\"|\\\")(\s)(\S+)/gi,
        replacement: function(match, m) {
          return "" + m[1] + this.QUOTE_FIRS_OPEN + m[4];
        }
      },
      quotation: {
        description: 'Внутренние кавычки-лапки и дюймы',
        "function": 'build_sub_quotations'
      }
    };

    EMTretQuote.prototype.str_repeat = function(string, num) {
      return new Array(parseInt(num) + 1).join(string);
    };

    EMTretQuote.prototype.inject_in = function(index, string) {
      return this._text = this._text.substring(0, index) + string + this._text.substring(index + string.length, this._text.length);
    };

    EMTretQuote.prototype.build_sub_quotations = function() {
      var amount, k, level, lokpos, offset, okpos, okposstack, p, self;
      okposstack = [0];
      okpos = 0;
      level = 0;
      offset = 0;
      while (true) {
        p = EMTLib.strpos_ex(this._text, ["&laquo;", "&raquo;"], offset);
        if (p === false) {
          break;
        }
        if (p.str === "&laquo;") {
          if (level > 0 && !this.is_on('no_bdquotes')) {
            this.inject_in(p.pos, this.QUOTE_CRAWSE_OPEN);
          }
          level++;
        }
        if (p.str === "&raquo;") {
          level--;
          if (level > 0 && !this.is_on('no_bdquotes')) {
            this.inject_in(p.pos, this.QUOTE_CRAWSE_CLOSE);
          }
        }
        offset = p.pos + ("" + p.str).length;
        if (level === 0) {
          okpos = offset;
          okposstack.push(okpos);
        } else {
          if (level < 0) {
            if (!this.is_on('no_inches')) {
              amount = 0;
              while (amount === 0 && okposstack.length) {
                lokpos = okposstack.pop();
                k = this._text.substr(lokpos, offset - lokpos);
                k = k.replace(this.QUOTE_CRAWSE_OPEN, this.QUOTE_FIRS_OPEN);
                k = k.replace(this.QUOTE_CRAWSE_CLOSE, this.QUOTE_FIRS_CLOSE);
                amount = 0;
                this.__ax = (k.match(/(^|[^0-9])([0-9]+)\&raquo\;/gi) || []).length;
                this.__ay = 0;
                if (this.__ax) {
                  self = this;
                  k = k.replace(/(^|[^0-9])([0-9]+)\&raquo\;/gi, function($0, $1, $2) {
                    self.__ay++;
                    if (self.__ay === self.__ax) {
                      return "" + $1 + $2 + "&Prime;";
                    }
                    return $0;
                  });
                  amount = 1;
                }
              }
            }
            if (amount === 1) {
              this._text = this._text.substr(0, lokpos) + k + this._text.substr(offset);
              offset = lokpos;
              level = 0;
              continue;
            }
            if (amount === 0) {
              level = 0;
              this._text = this._text.substr(0, p.pos) + '&quot;' + this._text.substr(offset);
              offset = p.pos + "&quot;".length;
              okposstack = [offset];
              continue;
            }
          }
        }
      }
      if (level !== 0) {
        if (level > 0) {
          k = this._text.substr(okpos);
          k = k.replace(this.QUOTE_CRAWSE_OPEN, this.QUOTE_FIRS_OPEN);
          k = k.replace(this.QUOTE_CRAWSE_CLOSE, this.QUOTE_FIRS_CLOSE);
          this._text = this._text.substr(0, okpos) + k;
        }
      }
      return this._text;
    };

    return EMTretQuote;

  })(EMTret);

  module.exports = EMTretQuote;

}).call(this);
