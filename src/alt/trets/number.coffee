Tret = require "../tret"
Lib = require '../lib'

module.exports = class Number extends Tret

  order: 3

  rules:

    # Расстановка знака минус между числами
    minus_between_nums:
      pattern: [
        /(\d+)\-(\d)/gi
      ]
      replacement: [
        -> "#{$1}&minus;#{$2}"
      ]

    # Расстановка знака минус между диапозоном чисел
    minus_in_numbers_range:
      pattern: [
        /(^|\s|\&nbsp\;)(\&minus\;|\-)(\d+)(\.\.\.|\&hellip\;)(\s|\&nbsp\;)?(\+|\-|\&minus\;)?(\d+)/ig
      ]
      replacement: [
        -> "#{$1}&minus;#{$3}#{$4}#{$5}" + (if $6 is "+" then $6 else "&minus;") + $7
      ]

    # Замена x на символ × в размерных единицах
    auto_times_x:
      pattern: [
        /([^a-zA-Z><]|^)(\&times\;)?(\d+)(\s*)(x|х)(\s*)(\d+)([^a-zA-Z><]|$)/g
      ]
      replacement: [
        -> "#{$1}#{$2}#{$3}&times;#{$7}#{$8}"
      ]

    # Нижний индекс
    numeric_sub:
      pattern: [
        /([a-zа-яё0-9])\_([\d]{1,3})([^а-яёa-z0-9]|$)/ig
      ]
      replacement: [
        -> $1 + Lib.tag(Lib.tag($2, "small"), "sub") + $3
      ]

    # Верхний индекс
    numeric_sup:
      pattern: [
        /([a-zа-яё0-9])\^([\d]{1,3})([^а-яёa-z0-9]|$)/ig
      ]
      replacement: [
        -> $1 + Lib.tag(Lib.tag($2, "small"), "sup") + $3
      ]

    # Замена дробей 1/2, 1/4, 3/4 на соответствующие символы
    simple_fraction:
      pattern: [
        /(^|\D)1\/(2|4)(\D)/g
        /(^|\D)3\/4(\D)/g
      ]
      replacement:[
        -> "#{$1}&frac1#{$2};#{$3}"
        -> "#{$1}&frac34;#{$2}"
      ]

    # Математические знаки больше/меньше/плюс минус/неравно
    math_chars:
      pattern:[
        /!=/g
        /\<=/g
        /([^=]|^)\>=/g
        /~=/g
        /\+-/g
      ]
      replacement:[
        -> "&ne;"
        -> "&le;"
        -> "#{$1}&ge;"
        -> "&cong;"
        -> "&plusmn;"
      ]

    # Объединение триад чисел полупробелом
    thinsp_between_number_triads:
      pattern: [
        /([0-9]{1,3}( [0-9]{3}){1,})(.|$)/g
      ]
      replacement: [
        -> (if $3 is "-" then $0 else $1.replace(" ", "&thinsp;")) + $3
      ]

    # Пробел между симоволом номера и числом
    thinsp_between_no_and_number:
      pattern: [
        /(№|\&#8470\;)(\s|&nbsp;)*(\d)/ig
      ]
      replacement: [
        -> "&#8470;&thinsp;#{$3}"
      ]

    # Пробел между параграфом и числом
    thinsp_between_sect_and_number:
      pattern: [
        /(§|\&sect\;)(\s|&nbsp;)*(\d+|[IVX]+|[a-zа-яё]+)/gi
      ]
      replacement: [
        -> "&sect;&thinsp;#{$3}"
      ]

