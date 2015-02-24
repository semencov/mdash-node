# Mdash.Lib = require "./mdash.lib"
# Mdash.Tret = require "./mdash.tret"

class Mdash.Tret.OptAlign extends Mdash.Tret

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
        /([a-zа-яё\-]{3,})(\040|\&nbsp\;|\t)(\&laquo\;)/ig
        /(\n|\r|^)(\&laquo\;)/ig
      ]
      replacement: [
        -> $1 + @tag($2, "span", {class: "oa_oqoute_sp_s"}) + @tag($3, "span", {class: "oa_oqoute_sp_q"})
        -> $1 + @tag($2, "span", {class: "oa_oquote_nl"})
      ]

    # Оптическое выравнивание для пунктуации (скобка и запятая)
    oa_obracket_coma:
      pattern: [
        /(\040|\&nbsp\;|\t)\(/g
        /(\n|\r|^)\(/g
        /([а-яёa-z0-9]+)\,(\040+)/g
      ]
      replacement: [
        -> @tag($1, "span", {class: "oa_obracket_sp_s"}) + @tag("(", "span", {class: "oa_obracket_sp_b"})
        -> $1 + @tag("(", "span", {class: "oa_obracket_nl_b"})
        -> $1 + @tag(",", "span", {class: "oa_comma_b"}) + @tag(" ", "span", {class: "oa_comma_e"})
      ]

    # Оптическое выравнивание кавычки
    oa_oquote_extra:
      function: (text) ->
        self = @
        text.replace new RegExp("(<#{@BASE64_PARAGRAPH_TAG}>)([\\s]+)?(\\&laquo\\;)", 'ig'), ($0, $1, $2, $3) ->
          $1 + self.tag($3, "span", {class: "oa_oquote_nl"})

    
