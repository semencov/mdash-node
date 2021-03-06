Tret = require "../tret"
Lib = require '../lib'

module.exports = class Symbol extends Tret

  rules:

    # Замена (tm) на символ торговой марки
    tm_replace:
      pattern: [
        /([\s\t])?\(tm\)/ig
      ]
      replacement: [
        ($) -> "&trade;"
      ]

    # Замена (R) на символ зарегистрированной торговой марки
    r_sign_replace:
      pattern: [
        /(.|^)\(r\)(.|$)/ig
      ]
      replacement: [
        ($) -> "#{$[1]}&reg;#{$[2]}"
      ]

    # Замена (c) на символ копирайт
    copy_replace:
      pattern: [
        /\((c|с)\)\s+/ig
        /\((c|с)\)($|\.|,|!|\?)/ig
      ]
      replacement: [
        ($) -> "&copy;&nbsp;"
        ($) -> "&copy;#{$[2]}"
      ]

    # Расстановка правильного апострофа в текстах
    apostrophe:
      pattern: [
        /(\s|^|\>|\&rsquo\;)([a-zа-яё]{1,})\'([a-zа-яё]+)/gi
      ]
      replacement: [
        ($) -> "#{$[1]}#{$[2]}&rsquo;#{$[3]}"
      ]

    # Градусы по Фаренгейту
    degree_f:
      pattern: [
        /([0-9]+)F($|\s|\.|\,|\;|\:|\&nbsp\;|\?|\!)/g
      ]
      replacement: [
        ($) -> Lib.tag("#{$[1]} &deg;F", "nobr") + $[2]
      ]

    # Символ евро
    euro_symbol:
      pattern: [
        '/€/g'
      ]
      replacement: [
        ($) -> "&euro;"
      ]

    # Замена стрелок вправо-влево на html коды
    arrows_symbols:
      pattern: [
        /(\s|\>|\&nbsp\;|^)\-\>($|\s|\&nbsp\;|\<)/g
        /(\s|\>|\&nbsp\;|^|;)\<\-(\s|\&nbsp\;|$)/g
        /→/g
        /←/g
      ]
      replacement: [
        ($) -> "#{$[1]}&rarr;#{$[2]}"
        ($) -> "#{$[1]}&larr;#{$[2]}"
        ($) -> "&rarr;"
        ($) -> "&larr;"
      ]

