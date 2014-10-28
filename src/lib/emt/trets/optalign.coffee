EMTLib = require "../lib"
EMTret = require "../tret"

class EMTretOptAlign extends EMTret
  title: "Оптическое выравнивание"

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
    oa_oquote:
      description: 'Оптическое выравнивание открывающей кавычки'
      pattern: [
        /([a-zа-яё\-]{3,})(\040|\&nbsp\;|\t)(\&laquo\;)/ig
        /(\n|\r|^)(\&laquo\;)/ig
      ]
      replacement: [
        (match, m) -> m[1] + @tag(m[2], "span", {class: "oa_oqoute_sp_s"}) + @tag(m[3], "span", {class: "oa_oqoute_sp_q"})
        (match, m) -> m[1] + @tag(m[2], "span", {class: "oa_oquote_nl"})
      ]
    oa_oquote_extra:
      description: 'Оптическое выравнивание кавычки'
      function: 'oaquote_extra'
    oa_obracket_coma:
      description: 'Оптическое выравнивание для пунктуации (скобка и запятая)'
      pattern: [
        /(\040|\&nbsp\;|\t)\(/g
        /(\n|\r|^)\(/g
        /([а-яёa-z0-9]+)\,(\040+)/g
      ]
      replacement: [
        (match, m) -> @tag(m[1], "span", {class: "oa_obracket_sp_s"}) + @tag("(", "span", {class: "oa_obracket_sp_b"})
        (match, m) -> m[1] + @tag("(", "span", {class: "oa_obracket_nl_b"})
        (match, m) -> m[1] + @tag(",", "span", {class: "oa_comma_b"}) + @tag(" ", "span", {class: "oa_comma_e"})
      ]

  oaquote_extra: (text) ->
    self = @
    text.replace new RegExp("(<#{@BASE64_PARAGRAPH_TAG}>)([\\s]+)?(\\&laquo\\;)", 'ig'), ($0, $1, $2, $3) ->
      $1 + self.tag($3, "span", {class: "oa_oquote_nl"})

    
module.exports = EMTretOptAlign
