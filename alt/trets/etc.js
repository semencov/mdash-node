(function() {
  var Etc, Lib, Tret,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tret = require("../tret");

  Lib = require('../lib');

  module.exports = Etc = (function(_super) {
    __extends(Etc, _super);

    function Etc() {
      return Etc.__super__.constructor.apply(this, arguments);
    }

    Etc.prototype.order = 12;

    Etc.prototype.classes = {
      nowrap: 'white-space:nowrap;'
    };

    Etc.prototype.rules = {
      acute_accent: {
        pattern: [/(у|е|ы|а|о|э|я|и|ю|ё)\`(\w)/gi],
        replacement: [
          function() {
            return "" + $1 + "&#769;" + $2;
          }
        ]
      },
      word_sup: {
        pattern: [/((\s|\&nbsp\;|^)+)\^([a-zа-яё0-9\.\:\,\-]+)(\s|\&nbsp\;|$|\.$)/ig],
        replacement: [
          function() {
            return Lib.tag(Lib.tag($3, "small"), "sup") + $4;
          }
        ]
      },
      century_period: {
        pattern: [/(\s|\t|\&nbsp\;|^)([XIV]{1,5})(-|\&mdash\;)([XIV]{1,5})(( |\&nbsp\;)?(в\.в\.|вв\.|вв|в\.|в))/g],
        replacement: [
          function() {
            return $1 + Lib.tag("" + $2 + "&mdash;" + $4 + " вв.", "nobr");
          }
        ]
      },
      time_interval: {
        pattern: [/([^\d\>]|^)([\d]{1,2}\:[\d]{2})(-|\&mdash\;|\&minus\;)([\d]{1,2}\:[\d]{2})([^\d\<]|$)/ig],
        replacement: [
          function() {
            return $1 + Lib.tag("" + $2 + "&mdash;" + $4, "nobr") + $5;
          }
        ]
      },
      expand_no_nbsp_in_nobr: {
        "function": function(text, rule) {
          var arr, b, e, match, thetag;
          thetag = Lib.tag("###", 'nobr');
          arr = thetag.split("###");
          b = Lib.preg_quote(arr[0], '/');
          e = Lib.preg_quote(arr[1], '/');
          match = new RegExp("(^|[^a-zа-яё])([a-zа-яё]+)\&nbsp\;(" + b + ")", 'gi');
          text = text.replace(match, '$1$3$2 ');
          match = new RegExp("(" + e + ")\&nbsp\;([a-zа-яё]+)($|[^a-zа-яё])", 'gi');
          text = text.replace(match, ' $2$1$3');
          return text = text.replace(new RegExp("" + b + ".*?" + e, 'gi'), function($0) {
            return $0.replace("&nbsp;", " ");
          });
        }
      }
    };

    return Etc;

  })(Tret);

}).call(this);
