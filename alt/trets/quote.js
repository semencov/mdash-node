(function() {
  var Lib, Quote, Tret,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tret = require("../tret");

  Lib = require('../lib');

  module.exports = Quote = (function(_super) {
    __extends(Quote, _super);

    function Quote() {
      return Quote.__super__.constructor.apply(this, arguments);
    }

    Quote.prototype.__ax = 0;

    Quote.prototype.__ay = 0;

    Quote.prototype.order = 3;

    Quote.prototype.rules = {
      quotes_outside_a: {
        pattern: [/(\<\%\%\%\_\_[^\>]+\>)\"(.+?)\"(\<\/\%\%\%\_\_[^\>]+\>)/g],
        replacement: [
          function() {
            return "&laquo;" + $1 + $2 + $3 + "&raquo;";
          }
        ]
      },
      open_quote: {
        pattern: [/(^|\(|\s|\>|-)(\"|\&laquo\;)(\S+)/ig],
        replacement: [
          function() {
            return "" + $1 + Lib.QUOTE_FIRS_OPEN + $3;
          }
        ]
      },
      close_quote: {
        pattern: [/([a-zа-яё0-9]|\.|\&hellip\;|\!|\?|\>|\)|\:)((\"|\&raquo\;)+)(\.|\&hellip\;|\&nbsp\;|\;|\:|\?|\!|\,|\s|\)|\<\/|$)/gi],
        replacement: [
          function() {
            return ("" + $1) + this.str_repeat(Lib.QUOTE_FIRS_CLOSE, ($2.split("\"").length - 1) + ($2.split("&raquo;").length - 1)) + ("" + $4);
          }
        ]
      },
      close_quote_adv: {
        pattern: [/([a-zа-яё0-9]|\.|\&hellip\;|\!|\?|\>|\)|\:)((\"|\&laquo\;)+)(\<[^\>]+\>)(\.|\&hellip\;|\&nbsp\;|\;|\:|\?|\!|\,|\)|\<\/|$| )/gi, /([a-zа-яё0-9]|\.|\&hellip\;|\!|\?|\>|\)|\:)(\s+)(\"+)(\s+)(\.|\&hellip\;|\&nbsp\;|\;|\:|\?|\!|\,|\)|\<\/|$| )/gi, /\>(\&laquo\;)\.($|\s|\<)/gi, /\>(\&laquo\;),($|\s|\<|\S)/gi, /\>(\&laquo\;):($|\s|\<|\S)/gi],
        replacement: [
          function() {
            return ("" + $1) + this.str_repeat(Lib.QUOTE_FIRS_CLOSE, ($2.split("\"").length - 1) + ($2.split("&laquo;").length - 1)) + ("" + $4 + $5);
          }, function() {
            return ("" + $1 + $2) + this.str_repeat(Lib.QUOTE_FIRS_CLOSE, ($3.split("\"").length - 1) + ($3.split("&laquo;").length - 1)) + ("" + $5 + $6);
          }, function() {
            return ">&raquo;." + $2;
          }, function() {
            return ">&raquo;," + $2;
          }, function() {
            return ">&raquo;:" + $2;
          }
        ]
      },
      open_quote_adv: {
        pattern: [/(^|\(|\s|\>)(\"|\\\")(\s)(\S+)/gi],
        replacement: [
          function() {
            return "" + $1 + Lib.QUOTE_FIRS_OPEN + $4;
          }
        ]
      },
      quotation: {
        "function": function(text, rule) {
          var amount, k, level, lokpos, offset, okpos, okposstack, p, self;
          okposstack = [0];
          okpos = 0;
          level = 0;
          offset = 0;
          while (true) {
            p = this.strpos_ex(text, ["&laquo;", "&raquo;"], offset);
            if (p === false) {
              break;
            }
            if (p.str === "&laquo;") {
              if (level > 0 && !rule.no_bdquotes) {
                text = this.inject_in(text, p.pos, Lib.QUOTE_CRAWSE_OPEN);
              }
              level++;
            }
            if (p.str === "&raquo;") {
              level--;
              if (level > 0 && !rule.no_bdquotes) {
                text = this.inject_in(text, p.pos, Lib.QUOTE_CRAWSE_CLOSE);
              }
            }
            offset = p.pos + ("" + p.str).length;
            if (level === 0) {
              okpos = offset;
              okposstack.push(okpos);
            } else {
              if (level < 0) {
                if (!rule.no_inches) {
                  amount = 0;
                  while (amount === 0 && okposstack.length) {
                    lokpos = okposstack.pop();
                    k = text.substr(lokpos, offset - lokpos);
                    k = k.replace(Lib.QUOTE_CRAWSE_OPEN, Lib.QUOTE_FIRS_OPEN);
                    k = k.replace(Lib.QUOTE_CRAWSE_CLOSE, Lib.QUOTE_FIRS_CLOSE);
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
                  text = text.substr(0, lokpos) + k + text.substr(offset);
                  offset = lokpos;
                  level = 0;
                  continue;
                }
                if (amount === 0) {
                  level = 0;
                  text = text.substr(0, p.pos) + '&quot;' + text.substr(offset);
                  offset = p.pos + "&quot;".length;
                  okposstack = [offset];
                  continue;
                }
              }
            }
          }
          if (level !== 0) {
            if (level > 0) {
              k = text.substr(okpos);
              k = k.replace(Lib.QUOTE_CRAWSE_OPEN, Lib.QUOTE_FIRS_OPEN);
              k = k.replace(Lib.QUOTE_CRAWSE_CLOSE, Lib.QUOTE_FIRS_CLOSE);
              text = text.substr(0, okpos) + k;
            }
          }
          return text;
        }
      }
    };

    Quote.prototype.str_repeat = function(string, num) {
      return new Array(parseInt(num) + 1).join(string);
    };

    Quote.prototype.inject_in = function(text, index, string) {
      text = text.substring(0, index) + string + text.substring(index + string.length, text.length);
      return text;
    };

    Quote.prototype.strpos_ex = function(haystack, needle, offset) {
      var m, n, p, w, _i, _len;
      if (offset == null) {
        offset = null;
      }
      if (Array.isArray(needle)) {
        m = -1;
        w = false;
        for (_i = 0, _len = needle.length; _i < _len; _i++) {
          n = needle[_i];
          p = haystack.indexOf(n, offset);
          if (p === -1) {
            continue;
          }
          if (m === -1) {
            m = p;
            w = n;
            continue;
          }
          if (p < m) {
            m = p;
            w = n;
          }
        }
        if (m === -1) {
          return false;
        }
        return {
          pos: m,
          str: w
        };
      }
      return haystack.indexOf(needle, offset);
    };

    return Quote;

  })(Tret);

}).call(this);
