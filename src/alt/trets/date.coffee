Tret = require "../tret"
Lib = require '../lib'

module.exports = class Date extends Tret

  order: 5

  rules:

    # Установка тире и пробельных символов в периодах дат
    years:
      pattern: [
        /(с|по|период|середины|начала|начало|конца|конец|половины|в|между|\([cс]\)|\&copy\;)(\s+|\&nbsp\;)([\d]{4})(-|\&mdash\;|\&minus\;)([\d]{4})(( |\&nbsp\;)?(г\.г\.|гг\.|гг|г\.|г)([^а-яёa-z]))?/gi
      ]
      replacement: [
        -> "#{$1}#{$2}" + (if parseInt($3) >= parseInt($5) then "#{$3}#{$4}#{$5}" else "#{$3}&mdash;#{$5}") + (if $6? then "&nbsp;гг" else "") + (if $9? then $9 else "")
      ]
    
    # Расстановка тире и объединение в неразрывные периоды месяцев
    mdash_month_interval:
      pattern: [
        /((январ|феврал|сентябр|октябр|ноябр|декабр)([ьяюе]|[её]м)|(апрел|июн|июл)([ьяюе]|ем)|(март|август)([ауе]|ом)?|ма[йяюе]|маем)\-((январ|феврал|сентябр|октябр|ноябр|декабр)([ьяюе]|[её]м)|(апрел|июн|июл)([ьяюе]|ем)|(март|август)([ауе]|ом)?|ма[йяюе]|маем)/gi
      ]
      replacement: [
        -> "#{$1}&mdash;#{$8}"
      ]
    
    # Расстановка тире и объединение в неразрывные периоды дней
    nbsp_and_dash_month_interval:
      pattern: [
        /([^\>]|^)(\d+)(\-|\&minus\;|\&mdash\;)(\d+)( |\&nbsp\;)(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)([^\<]|$)/gi
      ]
      replacement: [
        -> $1 + Lib.tag("#{$2}&mdash;#{$4} #{$6}", "nobr") + $7
      ]
    
    # Привязка года к дате
    nobr_year_in_date:
      pattern: [
        /(\s|\&nbsp\;)([0-9]{2}\.[0-9]{2}\.([0-9]{2})?[0-9]{2})(\s|\&nbsp\;)?г(\.|\s|\&nbsp\;)/gi
        /(\s|\&nbsp\;)([0-9]{2}\.[0-9]{2}\.([0-9]{2})?[0-9]{2})(\s|\&nbsp\;|\.(\s|\&nbsp\;|$)|$)/gi
      ]
      replacement: [
        -> $1 + Lib.tag("#{$2} г.", "nobr") + (if $5 is "+" then "" else " ")
        -> $1 + Lib.tag($2, "nobr") + $4
      ]
    
    # Пробел после года
    space_posle_goda:
      pattern: [
        /(^|\s|\&nbsp\;)([0-9]{3,4})(год([ауе]|ом)?)([^a-zа-яё]|$)/gi
      ]
      replacement: [
        -> "#{$1}#{$2} #{$3}#{$5}"
      ]
    
    # Пробел после сокращения года
    nbsp_posle_goda_abbr:
      pattern: [
        /(^|\s|\&nbsp\;|\"|\&laquo\;)([0-9]{3,4})[ ]?(г\.)([^a-zа-яё]|$)/gi
      ]
      replacement: [
        -> "#{$1}#{$2}&nbsp;#{$3}#{$4}"
      ]
    
