EMTLib = require "../lib"
EMTret = require "../tret"

class EMTretEtc extends EMTret
  title: "Прочее"
  
  classes:
    nowrap: 'word-spacing:nowrap;'

  rules:
    acute_accent:
      description: 'Акцент'
      pattern: /(у|е|ы|а|о|э|я|и|ю|ё)\`(\w)/gi
      replacement: '$1&#769;$2'
    word_sup:
      description: 'Надстрочный текст после символа ^'
      pattern: /((\s|\&nbsp\;|^)+)\^([a-zа-яё0-9\.\:\,\-]+)(\s|\&nbsp\;|$|\.$)/ig
      replacement: (match, m) -> @tag(@tag(m[3], "small"), "sup") + m[4]
    century_period:
      description: 'Тире между диапозоном веков'
      pattern: /(\040|\t|\&nbsp\;|^)([XIV]{1,5})(-|\&mdash\;)([XIV]{1,5})(( |\&nbsp\;)?(в\.в\.|вв\.|вв|в\.|в))/g
      replacement: (match, m) -> m[1]  + @tag("#{m[2]}&mdash;#{m[4]} вв.", "span", {class: "nowrap"})
    time_interval:
      description: 'Тире и отмена переноса между диапозоном времени'
      pattern: /([^\d\>]|^)([\d]{1,2}\:[\d]{2})(-|\&mdash\;|\&minus\;)([\d]{1,2}\:[\d]{2})([^\d\<]|$)/ig
      replacement: (match, m) -> m[1] + @tag("#{m[2]}&mdash;#{m[4]}", "span", {class: "nowrap"}) + m[5]
    expand_no_nbsp_in_nobr:
      description: 'Удаление nbsp в nobr/nowrap тэгах'
      function: 'remove_nbsp'


  remove_nbsp: (text) ->
    thetag = @tag("###", 'span', {class: "nowrap"})
    arr = thetag.split("###")
    b = EMTLib.preg_quote(arr[0], '/')
    e = EMTLib.preg_quote(arr[1], '/')
    
    match = new RegExp "(^|[^a-zа-яё])([a-zа-яё]+)\&nbsp\;(#{b})", 'gi'
    text = text.replace match, '$1$3$2 '

    match = new RegExp "(#{e})\&nbsp\;([a-zа-яё]+)($|[^a-zа-яё])", 'gi'
    text = text.replace match, ' $2$1$3'

    text = text.replace new RegExp("#{b}.*?#{e}", 'gi'), ($0) ->
      $0.replace("&nbsp;", " ")
    
module.exports = EMTretEtc
