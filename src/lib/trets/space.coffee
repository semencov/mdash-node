Tret = require "../tret"

module.exports = class Space extends Tret

  order: 2

  domain_zones: ['ru','ру','ком','орг', 'уа', 'ua', 'uk', 'co', 'fr', 'lv', 'lt', 'ee', 'eu'
    'com', 'net', 'edu', 'gov', 'org', 'mil', 'int', 'info', 'biz', 'info', 'name', 'pro']

  rules:

    # Неразрывный перед 2х символьной аббревиатурой
    nobr_twosym_abbr:
      pattern: [
        /([a-zA-Zа-яёА-ЯЁ])(\s|\t)+([A-ZА-ЯЁ]{2})([\s\;\.\?\!\:\(\"]|\&(ra|ld)quo\;|$)/g
      ]
      replacement: [
        ($) -> "#{$[1]}&nbsp;#{$[3]}#{$[4]}"
      ]

    # Удаление пробела перед точкой, запятой, двоеточием, точкой с запятой
    remove_space_before_punctuationmarks:
      pattern: [
        /((\s|\t|\&nbsp\;)+)([\,\:\.\;\?])(\s+|$)/g
      ]
      replacement: [
        ($) -> "#{$[3]}#{$[4]}"
      ]

    # Пробел после запятой
    autospace_after_comma:
      pattern: [
        /(\s|\t|\&nbsp\;)\,([а-яёa-z0-9])/ig
        /([^0-9])\,([а-яёa-z0-9])/ig
      ]
      replacement: [
        ($) -> ", #{$[2]}"
        ($) -> "#{$[1]}, #{$[2]}"
      ]

    # Пробел после знаков пунктуации, кроме точки
    autospace_after_pmarks:
      pattern: [
        /(\s|\t|\&nbsp\;|^|\n)([a-zа-яё0-9]+)(\s|\t|\&nbsp\;)?(\:|\)|\,|\&hellip\;|(?:\!|\?)+)([а-яёa-z])/ig
      ]
      replacement: [
        ($) -> "#{$[1]}#{$[2]}#{$[4]} #{$[5]}"
      ]

    # Пробел после точки
    autospace_after_dot:
      pattern: [
        /(\s|\t|\&nbsp\;|^)([a-zа-яё0-9]+)(\s|\t|\&nbsp\;)?\.([а-яёa-z]{5,})($|[^a-zа-яё])/ig
        /(\s|\t|\&nbsp\;|^)([a-zа-яё0-9]+)\.([а-яёa-z]{1,4})($|[^a-zа-яё])/ig
      ]
      replacement: [
        ($) -> "#{$[1]}#{$[2]}." + (if $[5] is "." then "" else " ") + "#{$[4]}#{$[5]}"
        ($) -> "#{$[1]}#{$[2]}." + (if $[3].toLowerCase() in @domain_zones or /[a-z]{1,12}/.test($[3].toLowerCase()) then "" else if $[4] in [".",",",";","!"] then "" else " ") + "#{$[3]}#{$[4]}"
      ]

    # Пробел после знаков троеточий с вопросительным или восклицательными знаками
    autospace_after_hellips:
      pattern: [
        /([\?\!]\.\.)([а-яёa-z])/ig
      ]
      replacement: [
        ($) -> "#{$[1]} #{$[2]}"
      ]

    # Удаление лишних пробельных символов и табуляций
    many_spaces_to_one:
      pattern: [
        /(\s|\t)+/g
      ]
      replacement: [
        ($) -> ' '
      ]

    # Удаление пробела перед символом процента
    clear_percent:
      pattern: [
        /(\d+)([\t\s]+)\%/g
      ]
      replacement: [
        ($) -> "#{$[1]}%"
      ]

    # Неразрывный пробел перед открывающей скобкой
    nbsp_before_open_quote:
      pattern: [
        /(^|\s|\t|>)([a-zа-яё]{1,2})\s(\&laquo\;|\&bdquo\;)/g
      ]
      replacement: [
        ($) -> "#{$[1]}#{$[2]}&nbsp;#{$[3]}"
      ]

    # Неразрывный пробел в датах перед числом и месяцем
    nbsp_before_month:
      pattern: [
        /(\d)(\s)+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)([^\<]|$)/ig
      ]
      replacement: [
        ($) -> "#{$[1]}&nbsp;#{$[3]}#{$[4]}"
      ]

    # Удаление пробелов в конце текста
    spaces_on_end:
      pattern: [
        /\s+$/
      ]
      replacement: [
        ($) -> ''
      ]

    # Отсутстввие пробела после троеточия после открывающей кавычки
    no_space_posle_hellip:
      pattern: [
        /(\&laquo\;|\&bdquo\;)( |\&nbsp\;)?\&hellip\;( |\&nbsp\;)?([a-zа-яё])/ig
      ]
      replacement: [
        ($) -> "#{$[1]}&hellip;#{$[4]}"
      ]

    # Пробел после года
    space_posle_goda:
      pattern: [
        /(^|\s|\&nbsp\;)([0-9]{3,4})(год([ауе]|ом)?)([^a-zа-яё]|$)/ig
      ]
      replacement: [
        ($) -> "#{$[1]}#{$[2]} #{$[3]}#{$[5]}"
      ]

