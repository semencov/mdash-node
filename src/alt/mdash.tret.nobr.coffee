# Mdash.Tret = require "./mdash.tret"

class Mdash.Tret.Nobr extends Mdash.Tret
  
  classes:
    nowrap: 'white-space:nowrap;'

  rules:

    # Привязка союзов и предлогов к написанным после словам
    super_nbsp:
      pattern: [
        /(\s|^|\&(la|bd)quo\;|\>|\(|\&mdash\;\&nbsp\;)([a-zа-яё]{1,2}\s+)([a-zа-яё]{1,2}\s+)?([a-zа-яё0-9\-]{2,}|[0-9])/ig
      ]
      replacement: [
        -> "#{$1}#{$3.trim()}&nbsp;" + (if $4? then "#{$4}".trim() + "&nbsp;" else "") + $5
      ]

    # Привязка союзов и предлогов к предыдущим словам в случае конца предложения
    nbsp_in_the_end:
      pattern: [
        /([a-zа-яё0-9\-]{3,}) ([a-zа-яё]{1,2})\.( [A-ZА-ЯЁ]|$)/g
      ]
      replacement: [
        -> "#{$1}&nbsp;#{$2}.#{$3}"
      ]

    # Объединение в неразрывные конструкции номеров телефонов
    phone_builder:
      pattern: [
        /([^\d\+]|^)([\+]?[0-9]{1,3})( |\&nbsp\;|\&thinsp\;)([0-9]{3,4}|\([0-9]{3,4}\))( |\&nbsp\;|\&thinsp\;)([0-9]{2,3})(-|\&minus\;)([0-9]{2})(-|\&minus\;)([0-9]{2})([^\d]|$)/g
        /([^\d\+]|^)([\+]?[0-9]{1,3})( |\&nbsp\;|\&thinsp\;)([0-9]{3,4}|[0-9]{3,4})( |\&nbsp\;|\&thinsp\;)([0-9]{2,3})(-|\&minus\;)([0-9]{2})(-|\&minus\;)([0-9]{2})([^\d]|$)/g
      ]
      replacement: [
        -> $1 + (if $1 is ">" or $1 is "<" then "#{$2} #{$4} #{$6}-#{$8}-#{$1}" else @tag("#{$2} #{$4} #{$6}-#{$8}-#{$1}", "span", {class: "nowrap"})) + $1
      ]

    # Объединение IP-адресов
    ip_address:
      pattern: [
        /(\s|\&nbsp\;|^)(\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3})/ig
      ]
      replacement: [
        -> $1 + @nowrap_ip_address($2)
      ]

    # Привязка инициалов к фамилиям
    spaces_nobr_in_surname_abbr:
      pattern: [
        /(\s|^|\.|\,|\;|\:|\?|\!|\&nbsp\;)([А-ЯЁ])\.?(\s|\&nbsp\;)?([А-ЯЁ])(\.(\s|\&nbsp\;)?|(\s|\&nbsp\;))([А-ЯЁ][а-яё]+)(\s|$|\.|\,|\;|\:|\?|\!|\&nbsp\;)/g
        /(\s|^|\.|\,|\;|\:|\?|\!|\&nbsp\;)([А-ЯЁ][а-яё]+)(\s|\&nbsp\;)([А-ЯЁ])\.?(\s|\&nbsp\;)?([А-ЯЁ])\.?(\s|$|\.|\,|\;|\:|\?|\!|\&nbsp\;)/g
      ]
      replacement: [
        -> $1 + @tag("#{$2}. #{$4}. #{$8}", "span", {class: "nowrap"}) + $9
        -> $1 + @tag("#{$2} #{$4}. #{$6}.", "span", {class: "nowrap"}) + $7
      ]

    # Неразрывный пробел перед частицей
    nbsp_before_particle:
      pattern: [
        /(\040|\t)+(ли|бы|б|же|ж)(\&nbsp\;|\.|\,|\:|\;|\&hellip\;|\?|\s)/ig
      ]
      replacement: [
        -> "&nbsp;#{$2}" + (if $3 is "&nbsp;" then " " else $3)
      ]

    # Неразрывный пробел в как то
    nbsp_v_kak_to:
      pattern: [
        /как то\:/gi
      ]
      replacement: [
        -> "как&nbsp;то:"
      ]

    # Привязка градусов к числу
    nbsp_celcius:
      pattern: [
        /(\s|^|\>|\&nbsp\;)(\d+)( |\&nbsp\;)?(°|\&deg\;)(C|С)(\s|\.|\!|\?|\,|$|\&nbsp\;|\;)/ig
      ]
      replacement: [
        -> "#{$1}#{$2}&nbsp;#{$4}C#{$6}"
      ]

    # Обрамление пятисимвольных слов разделенных дефисом в неразрывные блоки
    hyphen_nowrap_in_small_words:
      disabled: true
      cycled: true
      pattern: [
        /(\&nbsp\;|\s|\>|^)([a-zа-яё]{1}\-[a-zа-яё]{4}|[a-zа-яё]{2}\-[a-zа-яё]{3}|[a-zа-яё]{3}\-[a-zа-яё]{2}|[a-zа-яё]{4}\-[a-zа-яё]{1}|когда\-то|кое\-как|кой\-кого|вс[её]\-таки|[а-яё]+\-(кась|ка|де))(\s|\.|\,|\!|\?|\&nbsp\;|\&hellip\;|$)/gi
      ]
      replacement: [
        -> $1 + @tag($2, "span", {class: "nowrap"}) + $4
      ]

    # Отмена переноса слова с дефисом
    hyphen_nowrap:
      disabled: true
      cycled: true
      pattern: [
        /(\&nbsp\;|\s|\>|^)([a-zа-яё]+)((\-([a-zа-яё]+)){1,2})(\s|\.|\,|\!|\?|\&nbsp\;|\&hellip\;|$)/gi
      ]
      replacement: [
        -> $1 + @tag("#{$2}#{$3}", "span", {class: "nowrap"}) + $6
      ]


  nowrap_ip_address: (triads) ->
    triad = triads.split('.')
    addTag = true
    
    for value in triad
      value = parseInt value
      if value > 255
        addTag = false
        break
    
    if addTag is true
      triads = @tag(triads, 'span', {class: "nowrap"})
    
    return triads

