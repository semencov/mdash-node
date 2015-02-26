
class Mdash.Tret.Etc extends Mdash.Tret

  order: 12
  
  classes:
    nowrap: 'white-space:nowrap;'

  rules:

    # Акцент
    acute_accent:
      pattern: [
        /(у|е|ы|а|о|э|я|и|ю|ё)\`(\w)/gi
      ]
      replacement: [
        -> "#{$1}&#769;#{$2}"
      ]

    # Надстрочный текст после символа ^
    word_sup:
      pattern: [
        /((\s|\&nbsp\;|^)+)\^([a-zа-яё0-9\.\:\,\-]+)(\s|\&nbsp\;|$|\.$)/ig
      ]
      replacement: [
        -> Mdash.Lib.tag(Mdash.Lib.tag($3, "small"), "sup") + $4
      ]

    # Тире между диапозоном веков
    century_period:
      pattern: [
        /(\s|\t|\&nbsp\;|^)([XIV]{1,5})(-|\&mdash\;)([XIV]{1,5})(( |\&nbsp\;)?(в\.в\.|вв\.|вв|в\.|в))/g
      ]
      replacement: [
        -> $1 + Mdash.Lib.tag("#{$2}&mdash;#{$4} вв.", "nobr")
      ]

    # Тире и отмена переноса между диапозоном времени
    time_interval:
      pattern: [
        /([^\d\>]|^)([\d]{1,2}\:[\d]{2})(-|\&mdash\;|\&minus\;)([\d]{1,2}\:[\d]{2})([^\d\<]|$)/ig
      ]
      replacement: [
        -> $1 + Mdash.Lib.tag("#{$2}&mdash;#{$4}", "nobr") + $5
      ]

    # Удаление nbsp в nobr/nowrap тэгах
    expand_no_nbsp_in_nobr:
      function: (text, rule) ->
        thetag = Mdash.Lib.tag("###", 'nobr')
        arr = thetag.split("###")
        b = Mdash.Lib.preg_quote(arr[0], '/')
        e = Mdash.Lib.preg_quote(arr[1], '/')
        
        match = new RegExp "(^|[^a-zа-яё])([a-zа-яё]+)\&nbsp\;(#{b})", 'gi'
        text = text.replace match, '$1$3$2 '

        match = new RegExp "(#{e})\&nbsp\;([a-zа-яё]+)($|[^a-zа-яё])", 'gi'
        text = text.replace match, ' $2$1$3'

        text = text.replace new RegExp("#{b}.*?#{e}", 'gi'), ($0) -> $0.replace("&nbsp;", " ")
    
