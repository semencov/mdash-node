
class Mdash.Tret.Text extends Mdash.Tret

  BASE64_PARAGRAPH_TAG : 'cA==' # // p
  BASE64_BREAKLINE_TAG : 'YnIgLw==' # // br / (с пробелом и слэшем)
  BASE64_NOBR_OTAG     : 'bm9icg==' # // nobr
  BASE64_NOBR_CTAG     : 'L25vYnI=' # // /nobr
  
  classes:
    nowrap: 'white-space:nowrap;'

  rules:

    # Выделение ссылок из текста
    auto_links:
      pattern: [
        /(\s|^)(http|ftp|mailto|https)(:\/\/)([^\s\,\!\<]{4,})(\s|\.|\,|\!|\?|\<|$)/ig
      ]
      replacement: [
        -> $1 + @tag((if $4.substr(id.length-1) is "." then $4.substr(0, id.length-1) else $4), "a", {href: "#{$2}#{$3}" + (if $4.substr(id.length-1) is "." then $4.substr(0, id.length-1) else $4)}) + (if $4.substr(id.length-1) then "." else "") + $5
      ]

    # Выделение эл. почты из текста
    email:
      pattern: [
        /(\s|^|\&nbsp\;|\()([a-z0-9\-\_\.]{2,})\@([a-z0-9\-\.]{2,})\.([a-z]{2,6})(\)|\s|\.|\,|\!|\?|$|\<)/g
      ]
      replacement: [
        -> $1 + @tag("#{$2}@#{$3}.#{$4}", "a", {href: "mailto:#{$2}@#{$3}.#{$4}"}) + $5
      ]

    # Удаление повторяющихся слов
    no_repeat_words:
      disabled: true
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
        r = text.indexOf "<#{@BASE64_PARAGRAPH_TAG}>"
        p = text.lastIndexOf "</#{@BASE64_PARAGRAPH_TAG}>"

        if r >= 0 and p >= 0
          beg = text.substr(0, r)
          end = text.substr(p + "</#{@BASE64_PARAGRAPH_TAG}>".length)

          text =
            (if beg.trim() then "#{@do_paragraphs(beg)}\n" else "") + "<#{@BASE64_PARAGRAPH_TAG}>" +
            text.substr(r + "<#{@BASE64_PARAGRAPH_TAG}>".length, p - (r + "<#{@BASE64_PARAGRAPH_TAG}>".length)) + "</#{@BASE64_PARAGRAPH_TAG}>" +
            (if end.trim() then "\n#{@do_paragraphs(end)}" else "")
        else
          text = @do_paragraphs(text)
        text

    # Простановка переносов строк
    breakline:
      function: (text) ->
        self = @
        text = text.replace new RegExp("(\<\/#{@BASE64_PARAGRAPH_TAG}\>)([\r\n \t]+)(\<#{@BASE64_PARAGRAPH_TAG}\>)", 'g'), ($0, $1, $2, $3) ->
          "#{$1}#{Mdash.Lib.INTERNAL_BLOCK_OPEN}" + Mdash.Lib.encrypt_tag($2) + "#{Mdash.Lib.INTERNAL_BLOCK_CLOSE}#{$3}"
        
        if !text.match(new RegExp("\<#{@BASE64_BREAKLINE_TAG}\>", 'g'))
          text = text.replace /\r\n/g, "\n"
          text = text.replace /\r/g, "\n"
          text = text.replace /(\n)/g, "<#{@BASE64_BREAKLINE_TAG}>\n"
        text


  do_paragraphs: (text) ->
    self = @
    text = text.replace /\r\n?/g, "\n"
    text = "<#{@BASE64_PARAGRAPH_TAG}>#{text.trim()}</#{@BASE64_PARAGRAPH_TAG}>"
    text = text.replace /([\040\t]+)?(\n)+([\040\t]*)(\n)+/g, ($0, $1="", $2, $3) ->
      "#{$1}<#{self.BASE64_PARAGRAPH_TAG}>#{Mdash.Lib.INTERNAL_BLOCK_OPEN}" + Mdash.Lib.encrypt_tag("#{$2}#{$3}") + "#{Mdash.Lib.INTERNAL_BLOCK_CLOSE}</#{self.BASE64_PARAGRAPH_TAG}>"
    text = text.replace new RegExp("\<#{@BASE64_PARAGRAPH_TAG}\>(#{@INTERNAL_BLOCK_OPEN}[a-zA-Z0-9\/=]+?#{@INTERNAL_BLOCK_CLOSE})?\<\/#{@BASE64_PARAGRAPH_TAG}\>", 'g'), ""
    text


