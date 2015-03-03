Tret = require "../tret"
Lib = require '../lib'

module.exports = class Etc extends Tret

  order: 12
  
  rules:

    # Акцент
    acute_accent:
      pattern: [
        /(у|е|ы|а|о|э|я|и|ю|ё)\`([а-яё]+)/gi
      ]
      replacement: [
        ($) -> "#{$[1]}&#769;#{$[2]}"
      ]

    # Надстрочный текст после символа ^
    word_sup:
      pattern: [
        /((\s|\&nbsp\;|^)+)\^([a-zа-яё0-9\.\:\,\-\*]+)(\s|\&nbsp\;|$|\.$)/ig
      ]
      replacement: [
        ($) -> Lib.tag(Lib.tag($[3], "small"), "sup") + $[4]
      ]

    # Тире и отмена переноса между диапозоном времени
    time_interval:
      pattern: [
        /([^\d\>]|^)([\d]{1,2}\:[\d]{2})(-|\&mdash\;|\&minus\;)([\d]{1,2}\:[\d]{2})([^\d\<]|$)/ig
      ]
      replacement: [
        ($) -> $[1] + Lib.tag("#{$[2]}&mdash;#{$[4]}", "nobr") + $[5]
      ]

    # Удаление nbsp в nobr/nowrap тэгах
    expand_no_nbsp_in_nobr:
      function: (text, opts) ->
        thetag = Lib.tag("###", 'nobr')
        arr = thetag.split("###")
        b = Lib.preg_quote(arr[0], '/')
        e = Lib.preg_quote(arr[1], '/')
        
        match = new RegExp "(^|[^a-zа-яё])([a-zа-яё]+)\&nbsp\;(#{b})", 'gi'
        text = text.replace match, '$1$3$2 '

        match = new RegExp "(#{e})\&nbsp\;([a-zа-яё]+)($|[^a-zа-яё])", 'gi'
        text = text.replace match, ' $2$1$3'

        text = text.replace new RegExp("#{b}.*?#{e}", 'gi'), ($0) -> $0.replace("&nbsp;", " ")
    
