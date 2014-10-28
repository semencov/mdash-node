(function() {
  var EMTret, EMTretAbbr,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EMTret = require("../tret");

  EMTretAbbr = (function(_super) {
    __extends(EMTretAbbr, _super);

    function EMTretAbbr() {
      return EMTretAbbr.__super__.constructor.apply(this, arguments);
    }

    EMTretAbbr.prototype.title = "Сокращения";

    EMTretAbbr.prototype.domain_zones = ['ru', 'ру', 'com', 'ком', 'org', 'орг', 'уа', 'ua', 'lv', 'lt', 'ee', 'eu'];

    EMTretAbbr.prototype.classes = {
      nowrap: 'word-spacing:nowrap;'
    };

    EMTretAbbr.prototype.rules = {
      nobr_abbreviation: {
        description: 'Расстановка пробелов перед сокращениями dpi, lpi',
        pattern: /(\s+|^|\>)(\d+)(\040|\t)*(dpi|lpi)([\s\;\.\?\!\:\(]|$)/ig,
        replacement: '$1$1&nbsp;$1$1'
      },
      nobr_acronym: {
        description: 'Расстановка пробелов перед сокращениями гл., стр., рис., илл., ст., п.',
        pattern: /(\s|^|\>|\()(гл|стр|рис|илл?|ст|п|с)\.(\040|\t)*(\d+)(\&nbsp\;|\s|\.|\,|\?|\!|$)/ig,
        replacement: '$1$1.&nbsp;$1$1'
      },
      nobr_sm_im: {
        description: 'Расстановка пробелов перед сокращениями см., им.',
        pattern: /(\s|^|\>|\()(см|им)\.(\040|\t)*([а-яё0-9a-z]+)(\s|\.|\,|\?|\!|$)/ig,
        replacement: '$1$1.&nbsp;$1$1'
      },
      nobr_locations: {
        description: 'Расстановка пробелов в сокращениях г., ул., пер., д.',
        pattern: [/(\s|^|\>)(г|ул|пер|просп|пл|бул|наб|пр|ш|туп)\.(\040|\t)*([а-яё0-9a-z]+)(\s|\.|\,|\?|\!|$)/ig, /(\s|^|\>)(б\-р|пр\-кт)(\040|\t)*([а-яё0-9a-z]+)(\s|\.|\,|\?|\!|$)/ig, /(\s|^|\>)(д|кв|эт)\.(\040|\t)*(\d+)(\s|\.|\,|\?|\!|$)/ig],
        replacement: ['$1$1.&nbsp;$1$1', '$1$1&nbsp;$1$1', '$1$1.&nbsp;$1$1']
      },
      nbsp_before_unit: {
        description: 'Замена символов и привязка сокращений в размерных величинах: м, см, м2…',
        pattern: [/(\s|^|\>|\&nbsp\;|\,)(\d+)( |\&nbsp\;)?(м|мм|см|дм|км|гм|km|dm|cm|mm)(\s|\.|\!|\?|\,|$|\&plusmn\;|\;)/ig, /(\s|^|\>|\&nbsp\;|\,)(\d+)( |\&nbsp\;)?(м|мм|см|дм|км|гм|km|dm|cm|mm)([32]|&sup3;|&sup2;)(\s|\.|\!|\?|\,|$|\&plusmn\;|\;)/ig],
        replacement: [
          '$1$1&nbsp;$1$1', function(match, m) {
            return m[1] + m[2] + "&nbsp;" + m[4] + (m[5] === "3" || m[5] === "2" ? "&sup" + m[5] + ";" : m[5]) + m[6];
          }
        ]
      },
      nbsp_before_weight_unit: {
        description: 'Замена символов и привязка сокращений в весовых величинах: г, кг, мг…',
        pattern: /(\s|^|\>|\&nbsp\;|\,)(\d+)( |\&nbsp\;)?(г|кг|мг|т)(\s|\.|\!|\?|\,|$|\&nbsp\;|\;)/ig,
        replacement: '$1$1&nbsp;$1$1'
      },
      nobr_before_unit_volt: {
        description: 'Установка пробельных символов в сокращении вольт',
        pattern: /(\d+)([вВ]| В)(\s|\.|\!|\?|\,|$)/g,
        replacement: '$1&nbsp;В$1'
      },
      ps_pps: {
        description: 'Объединение сокращений P.S., P.P.S.',
        pattern: /(^|\040|\t|\>|\r|\n)(p\.\040?)(p\.\040?)?(s\.)([^\<])/ig,
        replacement: function(match, m) {
          return m[1] + this.tag(("" + (m[2].trim()) + " ") + (m[3] ? "" + (m[3].trim()) + " " : "") + m[4], "span", {
            "class": "nowrap"
          }) + m[5];
        }
      },
      nobr_vtch_itd_itp: {
        description: 'Объединение сокращений и т.д., и т.п., в т.ч.',
        cycled: true,
        pattern: [/(^|\s|\&nbsp\;)и( |\&nbsp\;)т\.?[ ]?д(\.|$|\s|\&nbsp\;)/g, /(^|\s|\&nbsp\;)и( |\&nbsp\;)т\.?[ ]?п(\.|$|\s|\&nbsp\;)/g, /(^|\s|\&nbsp\;)в( |\&nbsp\;)т\.?[ ]?ч(\.|$|\s|\&nbsp\;)/g],
        replacement: [
          function(match, m) {
            return m[1] + this.tag("и т. д.", "span", {
              "class": "nowrap"
            }) + (m[3] !== "." ? m[3] : "");
          }, function(match, m) {
            return m[1] + this.tag("и т. п.", "span", {
              "class": "nowrap"
            }) + (m[3] !== "." ? m[3] : "");
          }, function(match, m) {
            return m[1] + this.tag("в т. ч.", "span", {
              "class": "nowrap"
            }) + (m[3] !== "." ? m[3] : "");
          }
        ]
      },
      nbsp_te: {
        description: 'Обработка т.е.',
        pattern: /(^|\s|\&nbsp\;)([тТ])\.?[ ]?е\./g,
        replacement: function(match, m) {
          return m[1] + this.tag(m[2] + ". е.", "span", {
            "class": "nowrap"
          });
        }
      },
      nbsp_money_abbr: {
        description: 'Форматирование денежных сокращений (расстановка пробелов и привязка названия валюты к числу)',
        pattern: /(\d)((\040|\&nbsp\;)?(тыс|млн|млрд)\.?(\040|\&nbsp\;)?)?(\040|\&nbsp\;)?(руб\.|долл\.|евро|€|&euro;|\$|у[\.]? ?е[\.]?)/g,
        replacement: function(match, m) {
          return m[1] + (m[4] ? "&nbsp;" + m[4] + (m[4] === "тыс" ? "." : "") : "") + "&nbsp;" + (!m[7].match(/у[\\\\.]? ?е[\\\\.]?/gi) ? m[7] : "у.е.");
        }
      },
      nbsp_org_abbr: {
        description: 'Привязка сокращений форм собственности к названиям организаций',
        pattern: /([^a-zA-Zа-яёА-ЯЁ]|^)(ООО|ЗАО|ОАО|НИИ|ПБОЮЛ) ([a-zA-Zа-яёА-ЯЁ]|\"|\&laquo\;|\&bdquo\;|<)/g,
        replacement: '$1$1&nbsp;$1'
      },
      nobr_gost: {
        description: 'Привязка сокращения ГОСТ к номеру',
        pattern: [/(\040|\t|\&nbsp\;|^)ГОСТ( |\&nbsp\;)?(\d+)((\-|\&minus\;|\&mdash\;)(\d+))?(( |\&nbsp\;)(\-|\&mdash\;))?/ig, /(\040|\t|\&nbsp\;|^|\>)ГОСТ( |\&nbsp\;)?(\d+)(\-|\&minus\;|\&mdash\;)(\d+)/ig],
        replacement: [
          function(match, m) {
            return m[1] + this.tag("ГОСТ " + m[3] + (m[6] != null ? "&ndash;" + m[6] : "") + (m[7] != null ? " &mdash;" : ""), "span", {
              "class": "nowrap"
            });
          }, function(match, m) {
            return m[1] + "ГОСТ " + m[3] + "&ndash;" + m[5];
          }
        ]
      }
    };

    return EMTretAbbr;

  })(EMTret);

  module.exports = EMTretAbbr;

}).call(this);
