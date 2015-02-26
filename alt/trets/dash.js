(function() {
  var Dash, Tret,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tret = require("../tret");

  module.exports = Dash = (function(_super) {
    __extends(Dash, _super);

    function Dash() {
      return Dash.__super__.constructor.apply(this, arguments);
    }

    Dash.prototype.order = 6;

    Dash.prototype.rules = {
      mdash_symbol_to_html_mdash: {
        pattern: [/—/ig],
        replacement: [
          function() {
            return "&mdash;";
          }
        ]
      },
      mdash: {
        pattern: [/([a-zа-яё0-9]+|\,|\:|\)|\&(ra|ld)quo\;|\"|\>)(\s|\t)(—|\-|\&mdash\;)(\s|$|\<)/gi, /(\,|\:|\)|\")(—|\-|\&mdash\;)(\s|$|\<)/gi],
        replacement: [
          function() {
            return "" + $1 + "&nbsp;&mdash;" + $5;
          }, function() {
            return "" + $1 + "&nbsp;&mdash;" + $3;
          }
        ]
      },
      mdash_2: {
        pattern: [/(\n|\r|^|\>)(\-|\&mdash\;)(\t|\s)/gm],
        replacement: [
          function() {
            return "" + $1 + "&mdash;&nbsp;";
          }
        ]
      },
      mdash_3: {
        pattern: [/(\.|\!|\?|\&hellip\;)(\s|\t|\&nbsp\;)(\-|\&mdash\;)(\s|\t|\&nbsp\;)/g],
        replacement: [
          function() {
            return "" + $1 + " &mdash;&nbsp;";
          }
        ]
      },
      iz_za_pod: {
        pattern: [/(\s|\&nbsp\;|\>|^)(из)(\s|\t|\&nbsp\;)\-?(за|под)([\.\,\!\?\:\;]|\s|\&nbsp\;)/gi],
        replacement: [
          function() {
            return ($1 === "&nbsp;" ? " " : $1) + ("" + $2 + "-" + $4) + ($5 === "&nbsp;" ? " " : $5);
          }
        ]
      },
      to_libo_nibud: {
        pattern: [/(\s|^|\&nbsp\;|\>)(кто|кем|когда|зачем|почему|как|что|чем|где|чего|кого)\-?(\s|\t|\&nbsp\;)\-?(то|либо|нибудь)([\.\,\!\?\;]|\s|\&nbsp\;|$)/gi],
        replacement: [
          function() {
            return ($1 === "&nbsp;" ? " " : $1) + ("" + $2 + "-" + $4) + ($5 === "&nbsp;" ? " " : $5);
          }
        ]
      },
      koe_kak: {
        pattern: [/(\s|^|\&nbsp\;|\>)(кое)\-?(\s|\t|\&nbsp\;)\-?(как)([\.\,\!\?\;]|\s|\&nbsp\;|$)/gi, /(\s|^|\&nbsp\;|\>)(кой)\-?(\s|\t|\&nbsp\;)\-?(кого)([\.\,\!\?\;]|\s|\&nbsp\;|$)/gi, /(\s|^|\&nbsp\;|\>)(вс[её])\-?(\s|\t|\&nbsp\;)\-?(таки)([\.\,\!\?\;]|\s|\&nbsp\;|$)/gi],
        replacement: [
          function() {
            return ($1 === "&nbsp;" ? " " : $1) + ("" + $2 + "-" + $4) + ($5 === "&nbsp;" ? " " : $5);
          }
        ]
      },
      ka_de_kas: {
        pattern: [/(\s|^|\&nbsp\;|\>)([а-яё]+)(\s|\t|\&nbsp\;)(ка)([\.\,\!\?\;]|\s|\&nbsp\;|$)/gi, /(\s|^|\&nbsp\;|\>)([а-яё]+)(\s|\t|\&nbsp\;)(де)([\.\,\!\?\;]|\s|\&nbsp\;|$)/gi, /(\s|^|\&nbsp\;|\>)([а-яё]+)(\s|\t|\&nbsp\;)(кась)([\.\,\!\?\;]|\s|\&nbsp\;|$)/gi],
        replacement: [
          function() {
            return ($1 === "&nbsp;" ? " " : $1) + ("" + $2 + "-" + $4) + ($5 === "&nbsp;" ? " " : $5);
          }
        ]
      }
    };

    return Dash;

  })(Tret);

}).call(this);
