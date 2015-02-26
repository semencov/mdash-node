(function() {
  var Abbr, Lib, Tret,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tret = require("../tret");

  Lib = require('../lib');

  module.exports = Abbr = (function(_super) {
    __extends(Abbr, _super);

    function Abbr() {
      return Abbr.__super__.constructor.apply(this, arguments);
    }

    Abbr.prototype.order = 7;

    Abbr.prototype.rules = {
      nobr_abbreviation: {
        pattern: [/(\s+|^|\>)(\d+)(\s|\t)*(dpi|lpi)([\s\;\.\?\!\:\(]|$)/ig],
        replacement: [
          function() {
            return "" + $1 + $2 + "&nbsp;" + $4 + $5;
          }
        ]
      },
      nobr_acronym: {
        pattern: [/(\s|^|\>|\()(гл|стр|рис|илл?|ст|п|с)\.(\s|\t)*(\d+)(\&nbsp\;|\s|\.|\,|\?|\!|\)|$)/ig],
        replacement: [
          function() {
            return "" + $1 + $2 + ".&nbsp;" + $4 + $5;
          }
        ]
      },
      nobr_sm_im: {
        pattern: [/(\s|^|\>|\()(см|им)\.(\s|\t)*([а-яё0-9a-z]+)(\s|\.|\,|\?|\!|\)|$)/ig],
        replacement: [
          function() {
            return "" + $1 + $2 + ".&nbsp;" + $4 + $5;
          }
        ]
      },
      nobr_locations: {
        pattern: [/(\s|^|\>)(г|ул|пер|просп|пл|бул|наб|пр|ш|туп)\.(\s|\t)*([а-яё0-9a-z]+)(\s|\.|\,|\?|\!|$)/ig, /(\s|^|\>)(б\-р|пр\-кт)(\s|\t)*([а-яё0-9a-z]+)(\s|\.|\,|\?|\!|$)/ig, /(\s|^|\>)(д|кв|эт)\.(\s|\t)*(\d+)(\s|\.|\,|\?|\!|$)/ig],
        replacement: [
          function() {
            return "" + $1 + $2 + ".&nbsp;" + $4 + $5;
          }, function() {
            return "" + $1 + $2 + "&nbsp;" + $4 + $5;
          }, function() {
            return "" + $1 + $2 + ".&nbsp;" + $4 + $5;
          }
        ]
      },
      nbsp_before_unit: {
        pattern: [/(\s|^|\>|\&nbsp\;|\,)(\d+)( |\&nbsp\;)?(м|мм|см|дм|км|гм|km|dm|cm|mm)(\s|\.|\!|\?|\,|$|\&plusmn\;|\;)/ig, /(\s|^|\>|\&nbsp\;|\,)(\d+)( |\&nbsp\;)?(м|мм|см|дм|км|гм|km|dm|cm|mm)([32]|&sup3;|&sup2;)(\s|\.|\!|\?|\,|$|\&plusmn\;|\;)/ig],
        replacement: [
          function() {
            return "" + $1 + $2 + "&nbsp;" + $4 + $5;
          }, function() {
            return ("" + $1 + $2 + "&nbsp;" + $4) + ($5 === "3" || $5 === "2" ? "&sup" + $5 + ";" : $5) + $6;
          }
        ]
      },
      nbsp_before_weight_unit: {
        pattern: [/(\s|^|\>|\&nbsp\;|\,)(\d+)( |\&nbsp\;)?(г|кг|мг|т)(\s|\.|\!|\?|\,|$|\&nbsp\;|\;)/ig],
        replacement: [
          function() {
            return "" + $1 + $2 + "&nbsp;" + $4 + $5;
          }
        ]
      },
      nobr_before_unit_volt: {
        pattern: [/(\d+)([вВ]| В)(\s|\.|\!|\?|\,|$)/g],
        replacement: [
          function() {
            return "" + $1 + "&nbsp;В" + $3;
          }
        ]
      },
      ps_pps: {
        pattern: [/(^|\s|\t|\>|\r|\n)(p\.\s?)(p\.\s?)?(s\.)([^\<])/ig],
        replacement: [
          function() {
            return $1 + Lib.tag(("" + ($2.trim()) + " ") + (typeof $3 !== "undefined" && $3 !== null ? "" + ($3.trim()) + " " : "") + $4, "nobr") + $5;
          }
        ]
      },
      nobr_vtch_itd_itp: {
        pattern: [/(^|\s|\&nbsp\;)и( |\&nbsp\;)т\.?[ ]?д(\.|$|\s|\&nbsp\;)/g, /(^|\s|\&nbsp\;)и( |\&nbsp\;)т\.?[ ]?п(\.|$|\s|\&nbsp\;)/g, /(^|\s|\&nbsp\;)в( |\&nbsp\;)т\.?[ ]?ч(\.|$|\s|\&nbsp\;)/g],
        replacement: [
          function() {
            return $1 + Lib.tag("и т. д.", "nobr") + ($3 !== "." ? $3 : "");
          }, function() {
            return $1 + Lib.tag("и т. п.", "nobr") + ($3 !== "." ? $3 : "");
          }, function() {
            return $1 + Lib.tag("в т. ч.", "nobr") + ($3 !== "." ? $3 : "");
          }
        ]
      },
      nbsp_te: {
        pattern: [/(^|\s|\&nbsp\;)([тТ])\.?[ ]?е\./g],
        replacement: [
          function() {
            return $1 + Lib.tag($2 + ". е.", "nobr");
          }
        ]
      },
      nbsp_money_abbr: {
        pattern: [/(\d)((\s|\&nbsp\;)?(тыс|млн|млрд)\.?(\s|\&nbsp\;)?)?(\s|\&nbsp\;)?(руб\.|долл\.|евро|€|&euro;|\$|у[\.]? ?е[\.]?)/g],
        replacement: [
          function() {
            return $1 + (typeof $4 !== "undefined" && $4 !== null ? "&nbsp;" + $4 + ($4 === "тыс" ? "." : "") : "") + "&nbsp;" + (!$7.match(/у[\\\\.]? ?е[\\\\.]?/gi) ? $7 : "у.е.");
          }
        ]
      },
      nbsp_org_abbr: {
        pattern: [/([^a-zA-Zа-яёА-ЯЁ]|^)(ООО|ЗАО|ОАО|НИИ|ПБОЮЛ) ([a-zA-Zа-яёА-ЯЁ]|\"|\&laquo\;|\&bdquo\;|<)/ig, /([^a-zA-Zа-яёА-ЯЁ]|^)(SIA|VAS|AAS|AS|IK) ([a-zA-Zа-яёА-ЯЁ]|\"|\&laquo\;|\&bdquo\;|<)/ig],
        replacement: [
          function() {
            return "" + $1 + $2 + "&nbsp;" + $3;
          }, function() {
            return "" + $1 + $2 + "&nbsp;" + $3;
          }
        ]
      },
      nobr_gost: {
        pattern: [/(\s|\t|\&nbsp\;|^)ГОСТ( |\&nbsp\;)?(\d+\.?\d*)((\-|\&minus\;|\&mdash\;)(\d+))?(( |\&nbsp\;)(\-|\&mdash\;))?/ig, /(\s|\t|\&nbsp\;|^|\>)ГОСТ( |\&nbsp\;)?(\d+\.?\d*)(\-|\&minus\;|\&mdash\;)(\d+)/ig, /(\s|\t|\&nbsp\;|^|\>)LVS( |\&nbsp\;)?(\d+)(\:|\-|\&minus\;|\&mdash\;|)(\d+)/ig, /(\s|\t|\&nbsp\;|^|\>)(RFC|ISO|IEEE)( |\&nbsp\;)?(\d+[.-\/]?\d?)/ig],
        replacement: [
          function() {
            return $1 + Lib.tag(("ГОСТ " + $3) + (typeof $6 !== "undefined" && $6 !== null ? "&ndash;" + $6 : "") + (typeof $7 !== "undefined" && $7 !== null ? " &mdash;" : ""), "nobr");
          }, function() {
            return "" + $1 + "ГОСТ " + $3 + "&ndash;" + $5;
          }, function() {
            return $1 + Lib.tag("LVS " + $3 + ":" + $5, "nobr");
          }, function() {
            return $1 + Lib.tag("" + $2 + " " + $4, "nobr");
          }
        ]
      }
    };

    return Abbr;

  })(Tret);

}).call(this);
