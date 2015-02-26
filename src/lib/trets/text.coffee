Tret = require "../tret"
Lib = require '../lib'

module.exports = class Text extends Tret

  order: 1
    
  rules:

    # Выделение ссылок из текста
    auto_links:
      pattern: [
        /(\s|^)(http|ftp|mailto|https)(:\/\/)([^\s\,\!\<]{4,})(\s|\.|\,|\!|\?|\<|$)/ig
      ]
      replacement: [
        -> $1 + Lib.tag((if $4.substr(id.length-1) is "." then $4.substr(0, id.length-1) else $4), "a", {href: "#{$2}#{$3}" + (if $4.substr(id.length-1) is "." then $4.substr(0, id.length-1) else $4)}) + (if $4.substr(id.length-1) then "." else "") + $5
      ]

    # Выделение эл. почты из текста
    email:
      pattern: [
        /(\s|^|\&nbsp\;|\()([a-z0-9\-\_\.]{2,})\@([a-z0-9\-\.]{2,})\.([a-z]{2,6})(\)|\s|\.|\,|\!|\?|$|\<)/g
      ]
      replacement: [
        -> $1 + Lib.tag("#{$2}@#{$3}.#{$4}", "a", {href: "mailto:#{$2}@#{$3}.#{$4}"}) + $5
      ]

    # Удаление повторяющихся слов
    no_repeat_words:
      pattern: [
        /([а-яё]{3,})( |\t|\&nbsp\;)\1/ig
        /(\s|\&nbsp\;|^|\.|\!|\?)(([А-ЯЁ])([а-яё]{2,}))( |\t|\&nbsp\;)(([а-яё])\4)/g
      ]
      replacement: [
        -> "#{$1}"
        -> $1 + (if $7 is "#{$3}".toLowerCase() then $2 else "#{$2}#{$5}#{$6}")
      ]

    # Простановка параграфов
    paragraphs:
      function: (text) ->
        r = text.indexOf "<#{Lib.BASE64_PARAGRAPH_TAG}>"
        p = text.lastIndexOf "</#{Lib.BASE64_PARAGRAPH_TAG}>"

        if r >= 0 and p >= 0
          beg = text.substr(0, r)
          end = text.substr(p + "</#{Lib.BASE64_PARAGRAPH_TAG}>".length)
          text =
            (if beg.trim() then "#{@do_paragraphs(beg)}\n" else "") + "<#{Lib.BASE64_PARAGRAPH_TAG}>" +
            text.substr(r + "<#{Lib.BASE64_PARAGRAPH_TAG}>".length, p - (r + "<#{Lib.BASE64_PARAGRAPH_TAG}>".length)) + "</#{Lib.BASE64_PARAGRAPH_TAG}>" +
            (if end.trim() then "\n#{@do_paragraphs(end)}" else "")
        else
          text = @do_paragraphs(text)
        text

    # Простановка переносов строк
    breakline:
      function: (text) ->
        text = text.replace new RegExp("(\<\/#{Lib.BASE64_PARAGRAPH_TAG}\>)([\r\n \t]+)(\<#{Lib.BASE64_PARAGRAPH_TAG}\>)", 'g'), ($0, $1, $2, $3) ->
          "#{$1}#{Lib.INTERNAL_BLOCK_OPEN}" + Lib.encode($2) + "#{Lib.INTERNAL_BLOCK_CLOSE}#{$3}"
        
        if !text.match(new RegExp("\<#{Lib.BASE64_BREAKLINE_TAG}\>", 'g'))
          text = text.replace /\r\n/g, "\n"
          text = text.replace /\r/g, "\n"
          text = text.replace /(\n)/g, "<#{Lib.BASE64_BREAKLINE_TAG}>\n"
        text


  do_paragraphs: (text) ->
    text = text.replace /\r\n?/g, "\n"
    text = "<#{Lib.BASE64_PARAGRAPH_TAG}>#{text.trim()}</#{Lib.BASE64_PARAGRAPH_TAG}>"
    text = text.replace /([\s\t]+)?(\n)+([\s\t]*)(\n)+/g, ($0, $1="", $2, $3) ->
      "#{$1}<#{Lib.BASE64_PARAGRAPH_TAG}>#{Lib.INTERNAL_BLOCK_OPEN}" + Lib.encode("#{$2}#{$3}") + "#{Lib.INTERNAL_BLOCK_CLOSE}</#{Lib.BASE64_PARAGRAPH_TAG}>"
    text = text.replace new RegExp("\<#{Lib.BASE64_PARAGRAPH_TAG}\>(#{Lib.INTERNAL_BLOCK_OPEN}[a-zA-Z0-9\/=]+?#{Lib.INTERNAL_BLOCK_CLOSE})?\<\/#{Lib.BASE64_PARAGRAPH_TAG}\>", 'g'), ""
    text


