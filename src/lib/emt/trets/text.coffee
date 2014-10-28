EMTLib = require "../lib"
EMTret = require "../tret"

class EMTretText extends EMTret
  title: "Текст и абзацы"

  classes:
    nowrap: 'word-spacing:nowrap;'

  rules:
    auto_links:
      description: 'Выделение ссылок из текста'
      pattern: /(\s|^)(http|ftp|mailto|https)(:\/\/)([^\s\,\!\<]{4,})(\s|\.|\,|\!|\?|\<|$)/ig
      replacement: '$m[1] . $this->tag((substr($m[4],-1)=="."?substr($m[4],0,-1):$m[4]), "a", array("href" => $m[2].$m[3].(substr($m[4],-1)=="."?substr($m[4],0,-1):$m[4]))) . (substr($m[4],-1)=="."?".":"") .$m[5]'
    email:
      description: 'Выделение эл. почты из текста'
      pattern: '/(\s|^|\&nbsp\;|\()([a-z0-9\-\_\.]{2,})\@([a-z0-9\-\.]{2,})\.([a-z]{2,6})(\)|\s|\.|\,|\!|\?|$|\<)/e',
      replacement: (match, m) -> m[1] + @tag("#{m[2]}@#{m[3]}.#{m[4]}", "a", {href: "mailto:#{m[2]}@#{m[3]}.#{m[4]}"}) + m[5]
    no_repeat_words:
      description: 'Удаление повторяющихся слов'
      disabled: true
      pattern: [
        /([а-яё]{3,})( |\t|\&nbsp\;)\1/ig
        /(\s|\&nbsp\;|^|\.|\!|\?)(([А-ЯЁ])([а-яё]{2,}))( |\t|\&nbsp\;)(([а-яё])\4)/g
      ]
      replacement: [
        '$1'
        (match, m) -> m[1] + (if m[7] is "#{m[3]}".toLowerCase() then m[2] else "#{m[2]}#{m[5]}#{m[6]}")
      ]
    paragraphs:
      description: 'Простановка параграфов'
      function: 'build_paragraphs'
    breakline:
      description: 'Простановка переносов строк'
      function: 'build_brs'

  do_paragraphs: (text) ->
    self = @
    text = text.replace /\r\n/g, "\n"
    text = text.replace /\r/g, "\n"
    text = "<#{@BASE64_PARAGRAPH_TAG}>#{text.trim()}</#{@BASE64_PARAGRAPH_TAG}>"
    text = text.replace /([\040\t]+)?(\n)+([\040\t]*)(\n)+/g, ($0, $1, $2, $3) ->
      "#{$1}</#{self.BASE64_PARAGRAPH_TAG}>#{EMTLib.INTERNAL_BLOCK_OPEN}" + EMTLib.encrypt_tag("#{$2}#{$3}") + "#{EMTLib.INTERNAL_BLOCK_CLOSE}<#{self.BASE64_PARAGRAPH_TAG}>"
    text = text.replace new RegExp("\<#{@BASE64_PARAGRAPH_TAG}\>(#{@INTERNAL_BLOCK_OPEN}[a-zA-Z0-9\/=]+?#{@INTERNAL_BLOCK_CLOSE})?\<\/#{@BASE64_PARAGRAPH_TAG}\>", 'g'), ""
    text

  build_paragraphs: () ->
    r = @_text.indexOf "<#{@BASE64_PARAGRAPH_TAG}>"
    p = @_text.lastIndexOf "</#{@BASE64_PARAGRAPH_TAG}>"

    if r >= 0 and p >= 0
      beg = @_text.substr(0, r)
      end = @_text.substr(p + "</#{@BASE64_PARAGRAPH_TAG}>".length)

      @_text =
        (if beg.trim() then "#{@do_paragraphs(beg)}\n" else "") + "<#{@BASE64_PARAGRAPH_TAG}>" +
        @_text.substr(r + "<#{@BASE64_PARAGRAPH_TAG}>".length, p - (r + "<#{@BASE64_PARAGRAPH_TAG}>".length)) + "</#{@BASE64_PARAGRAPH_TAG}>" +
        (if end.trim() then "\n#{@do_paragraphs(end)}" else "")
    else
      @_text = @do_paragraphs(@_text)

  build_brs: () ->
    self = @
    @_text = @_text.replace new RegExp("(\<\/#{@BASE64_PARAGRAPH_TAG}\>)([\r\n \t]+)(\<#{@BASE64_PARAGRAPH_TAG}\>)", 'g'), ($0, $1, $2, $3) ->
      "#{$1}#{EMTLib.INTERNAL_BLOCK_OPEN}" + EMTLib.encrypt_tag($2) + "#{EMTLib.INTERNAL_BLOCK_CLOSE}#{$3}"
    
    if !@_text.match(new RegExp("\<#{@BASE64_BREAKLINE_TAG}\>", 'g'))
      @_text = @_text.replace /\r\n/g, "\n"
      @_text = @_text.replace /\r/g, "\n"
      @_text = @_text.replace /(\n)/g, "<#{@BASE64_BREAKLINE_TAG}>\n"

    
module.exports = EMTretText
