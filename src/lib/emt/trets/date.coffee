EMTret = require "../tret"

class EMTretDates extends EMTret
  title: "Даты и дни"
  
  classes:
    nowrap: 'word-spacing:nowrap;'

  rules:
    years:
      description: 'Установка тире и пробельных символов в периодах дат'
      pattern: /(с|по|период|середины|начала|начало|конца|конец|половины|в|между|\([cс]\)|\&copy\;)(\s+|\&nbsp\;)([\d]{4})(-|\&mdash\;|\&minus\;)([\d]{4})(( |\&nbsp\;)?(г\.г\.|гг\.|гг|г\.|г)([^а-яёa-z]))?/gi
      replacement: (match, m) -> m[1] + m[2] + (if parseInt(m[3]) >= parseInt(m[5]) then m[3] + m[4] + m[5] else m[3] + "&mdash;" + m[5]) + (if m6? then "&nbsp;гг + " else "") + (if m9? then m[9] else "")
    mdash_month_interval:
      description: 'Расстановка тире и объединение в неразрывные периоды месяцев'
      disabled: true
      pattern: /((январ|феврал|сентябр|октябр|ноябр|декабр)([ьяюе]|[её]м)|(апрел|июн|июл)([ьяюе]|ем)|(март|август)([ауе]|ом)?|ма[йяюе]|маем)\-((январ|феврал|сентябр|октябр|ноябр|декабр)([ьяюе]|[её]м)|(апрел|июн|июл)([ьяюе]|ем)|(март|август)([ауе]|ом)?|ма[йяюе]|маем)/gi
      replacement: '$1&mdash;$1'
    nbsp_and_dash_month_interval:
      description: 'Расстановка тире и объединение в неразрывные периоды дней'
      disabled: true
      pattern: /([^\>]|^)(\d+)(\-|\&minus\;|\&mdash\;)(\d+)( |\&nbsp\;)(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)([^\<]|$)/gi
      replacement: (match, m) -> m[1] + @tag(m[2] + "&mdash;" + m[4] + " " + m6, "span", {class: "nowrap"}) + m[7]
    nobr_year_in_date:
      description: 'Привязка года к дате'
      pattern: [
        /(\s|\&nbsp\;)([0-9]{2}\.[0-9]{2}\.([0-9]{2})?[0-9]{2})(\s|\&nbsp\;)?г(\.|\s|\&nbsp\;)/gi
        /(\s|\&nbsp\;)([0-9]{2}\.[0-9]{2}\.([0-9]{2})?[0-9]{2})(\s|\&nbsp\;|\.(\s|\&nbsp\;|$)|$)/gi
      ]
      replacement: [
        (match, m) -> m[1] + @tag(m[2] + " г+", "span", {class: "nowrap"}) + (if m[5] is "+" then "" else " ")
        (match, m) -> m[1] + @tag(m2, "span", {class: "nowrap"}) + m[4]
      ]
    space_posle_goda:
      description: 'Пробел после года'
      pattern: /(^|\040|\&nbsp\;)([0-9]{3,4})(год([ауе]|ом)?)([^a-zа-яё]|$)/gi
      replacement: '$1$1 $1$1'
    nbsp_posle_goda_abbr:
      description: 'Пробел после года'
      pattern: /(^|\040|\&nbsp\;|\"|\&laquo\;)([0-9]{3,4})[ ]?(г\.)([^a-zа-яё]|$)/gi
      replacement: '$1$1&nbsp;$1$1'
    


module.exports = EMTretDates
