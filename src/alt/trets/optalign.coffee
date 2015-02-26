Tret = require "../tret"
Lib = require '../lib'

module.exports = class OptAlign extends Tret

  order: 11

  classes:
    oa_obracket_sp_s : "margin-right:0.3em;"
    oa_obracket_sp_b : "margin-left:-0.3em;"
    oa_obracket_nl_b : "margin-left:-0.3em;"
    oa_comma_b       : "margin-right:-0.2em;"
    oa_comma_e       : "margin-left:0.2em;"
    oa_oquote_nl     : "margin-left:-0.44em;"
    oa_oqoute_sp_s   : "margin-right:0.44em;"
    oa_oqoute_sp_q   : "margin-left:-0.44em;"

  rules:

    # Оптическое выравнивание открывающей кавычки
    oa_oquote:
      pattern: [
        /([a-zа-яё\-]{3,})(\s|\&nbsp\;|\t)(\&laquo\;)/ig
        /(\n|\r|^)(\&laquo\;)/ig
      ]
      replacement: [
        -> $1 + Lib.tag($2, "span", {class: "oa-oqoute-sp-s"}) + Lib.tag($3, "span", {class: "oa-oqoute-sp-q"})
        -> $1 + Lib.tag($2, "span", {class: "oa-oquote-nl"})
      ]

    # Оптическое выравнивание для пунктуации (скобка и запятая)
    oa_obracket_coma:
      pattern: [
        /(\s|\&nbsp\;|\t)\(/g
        /(\n|\r|^)\(/g
        /([а-яёa-z0-9]+)\,(\s+)/g
      ]
      replacement: [
        -> Lib.tag($1, "span", {class: "oa-obracket-sp-s"}) + Lib.tag("(", "span", {class: "oa-obracket-sp-b"})
        -> $1 + Lib.tag("(", "span", {class: "oa-obracket-nl-b"})
        -> $1 + Lib.tag(",", "span", {class: "oa-comma-b"}) + Lib.tag(" ", "span", {class: "oa-comma-e"})
      ]

    # Оптическое выравнивание кавычки
    oa_oquote_extra:
      function: (text) ->
        self = @
        text.replace new RegExp("(<#{Lib.BASE64_PARAGRAPH_TAG}>)([\\s]+)?(\\&laquo\\;)", 'ig'), ($0, $1, $2, $3) ->
          $1 + Lib.tag($3, "span", {class: "oa-oquote-nl"})

    
