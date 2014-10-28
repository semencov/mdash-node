(function() {
  var EMTLib, EMTret, EMTretEtc,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EMTLib = require("../lib");

  EMTret = require("../tret");

  EMTretEtc = (function(_super) {
    __extends(EMTretEtc, _super);

    function EMTretEtc() {
      return EMTretEtc.__super__.constructor.apply(this, arguments);
    }

    EMTretEtc.prototype.title = "Прочее";

    EMTretEtc.prototype.classes = {
      nowrap: 'word-spacing:nowrap;'
    };

    EMTretEtc.prototype.rules = {
      acute_accent: {
        description: 'Акцент',
        pattern: /(у|е|ы|а|о|э|я|и|ю|ё)\`(\w)/gi,
        replacement: '$1&#769;$1'
      },
      word_sup: {
        description: 'Надстрочный текст после символа ^',
        pattern: /((\s|\&nbsp\;|^)+)\^([a-zа-яё0-9\.\:\,\-]+)(\s|\&nbsp\;|$|\.$)/ig,
        replacement: function(match, m) {
          return this.tag(this.tag(m[3], "small"), "sup") + m[4];
        }
      },
      century_period: {
        description: 'Тире между диапозоном веков',
        pattern: /(\040|\t|\&nbsp\;|^)([XIV]{1,5})(-|\&mdash\;)([XIV]{1,5})(( |\&nbsp\;)?(в\.в\.|вв\.|вв|в\.|в))/g,
        replacement: function(match, m) {
          return m[1] + this.tag(m[2] + "&mdash;" + m[4] + " вв.", "span", {
            "class": "nowrap"
          });
        }
      },
      time_interval: {
        description: 'Тире и отмена переноса между диапозоном времени',
        pattern: /([^\d\>]|^)([\d]{1,2}\:[\d]{2})(-|\&mdash\;|\&minus\;)([\d]{1,2}\:[\d]{2})([^\d\<]|$)/ig,
        replacement: function(match, m) {
          return m[1] + this.tag(m[2] + "&mdash;" + m4, "span", {
            "class": "nowrap"
          }) + m[5];
        }
      },
      expand_no_nbsp_in_nobr: {
        description: 'Удаление nbsp в nobr/nowrap тэгах',
        "function": 'remove_nbsp'
      }
    };

    EMTretEtc.prototype.remove_nbsp = function(text) {
      var arr, b, e, match, thetag;
      thetag = this.tag("###", 'span', {
        "class": "nowrap"
      });
      arr = thetag.split("###");
      b = EMTLib.preg_quote(arr[0], '/');
      e = EMTLib.preg_quote(arr[1], '/');
      match = new RegExp("(^|[^a-zа-яё])([a-zа-яё]+)\&nbsp\;(" + b + ")", 'gi');
      text = text.replace(match, '$1$1$1 ');
      match = new RegExp("(" + e + ")\&nbsp\;([a-zа-яё]+)($|[^a-zа-яё])", 'gi');
      text = text.replace(match, ' $1$1$1');
      return text = text.replace(new RegExp("" + b + ".*?" + e, 'gi'), function(match) {
        return match.replace("&nbsp;", " ");
      });
    };

    return EMTretEtc;

  })(EMTret);

  module.exports = EMTretEtc;

}).call(this);
