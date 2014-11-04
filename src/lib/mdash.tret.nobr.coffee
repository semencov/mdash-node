# Mdash.Tret = require "./mdash.tret"

class Mdash.Tret.Nobr extends Mdash.Tret
  title: "Неразрывные конструкции"
  
  classes:
    nowrap: 'word-spacing:nowrap;'

  rules:
    super_nbsp:
      description: 'Привязка союзов и предлогов к написанным после словам'
      pattern: /(\s|^|\&(la|bd)quo\;|\>|\(|\&mdash\;\&nbsp\;)([a-zа-яё]{1,2}\s+)([a-zа-яё]{1,2}\s+)?([a-zа-яё0-9\-]{2,}|[0-9])/ig
      replacement: (match, m) -> "#{m[1]}#{m[3].trim()}&nbsp;" + (if m[4] then "#{m[4].trim()}&nbsp;" else "") + m[5]
    nbsp_in_the_end:
      description: 'Привязка союзов и предлогов к предыдущим словам в случае конца предложения'
      pattern: /([a-zа-яё0-9\-]{3,}) ([a-zа-яё]{1,2})\.( [A-ZА-ЯЁ]|$)/g
      replacement: '$1&nbsp;$2.$3'
    phone_builder:
      description: 'Объединение в неразрывные конструкции номеров телефонов'
      pattern: [
        /([^\d\+]|^)([\+]?[0-9]{1,3})( |\&nbsp\;|\&thinsp\;)([0-9]{3,4}|\([0-9]{3,4}\))( |\&nbsp\;|\&thinsp\;)([0-9]{2,3})(-|\&minus\;)([0-9]{2})(-|\&minus\;)([0-9]{2})([^\d]|$)/g
        /([^\d\+]|^)([\+]?[0-9]{1,3})( |\&nbsp\;|\&thinsp\;)([0-9]{3,4}|[0-9]{3,4})( |\&nbsp\;|\&thinsp\;)([0-9]{2,3})(-|\&minus\;)([0-9]{2})(-|\&minus\;)([0-9]{2})([^\d]|$)/g
      ]
      replacement: (match, m) -> m[1] + (if m[1] is ">" or m[1] is "<" then "#{m[2]} #{m[4]} #{m[6]}-#{m[8]}-#{m[1]}" else @tag("#{m[2]} #{m[4]} #{m[6]}-#{m[8]}-#{m[1]}", "span", {class: "nowrap"})) + m[1]
    ip_address:
      description: 'Объединение IP-адресов'
      pattern: /(\s|\&nbsp\;|^)(\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3})/ig
      replacement: (match, m) -> m[1] + @nowrap_ip_address(m[2])
    spaces_nobr_in_surname_abbr:
      description: 'Привязка инициалов к фамилиям'
      pattern: [
        /(\s|^|\.|\,|\;|\:|\?|\!|\&nbsp\;)([А-ЯЁ])\.?(\s|\&nbsp\;)?([А-ЯЁ])(\.(\s|\&nbsp\;)?|(\s|\&nbsp\;))([А-ЯЁ][а-яё]+)(\s|$|\.|\,|\;|\:|\?|\!|\&nbsp\;)/g
        /(\s|^|\.|\,|\;|\:|\?|\!|\&nbsp\;)([А-ЯЁ][а-яё]+)(\s|\&nbsp\;)([А-ЯЁ])\.?(\s|\&nbsp\;)?([А-ЯЁ])\.?(\s|$|\.|\,|\;|\:|\?|\!|\&nbsp\;)/g
      ]
      replacement: [
        (match, m) -> m[1] + @tag("#{m[2]}. #{m[4]}. #{m[8]}", "span", {class: "nowrap"}) + m[9]
        (match, m) -> m[1] + @tag("#{m[2]} #{m[4]}. #{m[6]}.", "span", {class: "nowrap"}) + m[7]
      ]
    nbsp_before_particle:
      description: 'Неразрывный пробел перед частицей'
      pattern: /(\040|\t)+(ли|бы|б|же|ж)(\&nbsp\;|\.|\,|\:|\;|\&hellip\;|\?|\s)/ig
      replacement: (match, m) -> "&nbsp;#{m[2]}" + (if m[3] is "&nbsp;" then " " else m[3])
    nbsp_v_kak_to:
      description: 'Неразрывный пробел в как то'
      pattern: /как то\:/gi
      replacement: 'как&nbsp;то:'
    nbsp_celcius:
      description: 'Привязка градусов к числу'
      pattern: /(\s|^|\>|\&nbsp\;)(\d+)( |\&nbsp\;)?(°|\&deg\;)(C|С)(\s|\.|\!|\?|\,|$|\&nbsp\;|\;)/ig
      replacement: '$1$2&nbsp;$4C$6'
    hyphen_nowrap_in_small_words:
      description: 'Обрамление пятисимвольных слов разделенных дефисом в неразрывные блоки'
      disabled: true
      cycled: true
      pattern: /(\&nbsp\;|\s|\>|^)([a-zа-яё]{1}\-[a-zа-яё]{4}|[a-zа-яё]{2}\-[a-zа-яё]{3}|[a-zа-яё]{3}\-[a-zа-яё]{2}|[a-zа-яё]{4}\-[a-zа-яё]{1}|когда\-то|кое\-как|кой\-кого|вс[её]\-таки|[а-яё]+\-(кась|ка|де))(\s|\.|\,|\!|\?|\&nbsp\;|\&hellip\;|$)/gi
      replacement: (match, m) -> m[1] + @tag(m[2], "span", {class: "nowrap"}) + m[4]
    hyphen_nowrap:
      description: 'Отмена переноса слова с дефисом'
      disabled: true
      cycled: true
      pattern: /(\&nbsp\;|\s|\>|^)([a-zа-яё]+)((\-([a-zа-яё]+)){1,2})(\s|\.|\,|\!|\?|\&nbsp\;|\&hellip\;|$)/gi
      replacement: (match, m) -> m[1] + @tag("#{m[2]}#{m[3]}", "span", {class: "nowrap"}) + m[6]


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

