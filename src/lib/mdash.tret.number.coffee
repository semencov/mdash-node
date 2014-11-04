# Mdash.Tret = require "./mdash.tret"

class Mdash.Tret.Number extends Mdash.Tret
  title: "Числа, дроби, математические знаки"

  rules:
    minus_between_nums:
      description: 'Расстановка знака минус между числами'
      pattern: /(\d+)\-(\d)/gi
      replacement: '$1&minus;$2'
    minus_in_numbers_range:
      description: 'Расстановка знака минус между диапозоном чисел'
      pattern: /(^|\s|\&nbsp\;)(\&minus\;|\-)(\d+)(\.\.\.|\&hellip\;)(\s|\&nbsp\;)?(\+|\-|\&minus\;)?(\d+)/ig
      replacement: (match, m) ->
        "#{m[1]}&minus;#{m[3]}#{m[4]}#{m[5]}" + (if m[6] is "+" then m[6] else "&minus;") + m[7]
    auto_times_x:
      description: 'Замена x на символ × в размерных единицах'
      cycled: true
      pattern: /([^a-zA-Z><]|^)(\&times\;)?(\d+)(\040*)(x|х)(\040*)(\d+)([^a-zA-Z><]|$)/g
      replacement: '$1$2$3&times;$7$8'
    numeric_sub:
      description: 'Нижний индекс'
      pattern: /([a-zа-яё0-9])\_([\d]{1,3})([^а-яёa-z0-9]|$)/ig
      replacement: (match, m) ->
        m[1] + @tag(@tag(m[2], "small"), "sub") + m[3]
    numeric_sup:
      description: 'Верхний индекс'
      pattern: /([a-zа-яё0-9])\^([\d]{1,3})([^а-яёa-z0-9]|$)/ig
      replacement: (match, m) ->
        m[1] + @tag(@tag(m[2], "small"), "sup") + m[3]
    simple_fraction:
      description: 'Замена дробей 1/2, 1/4, 3/4 на соответствующие символы'
      pattern: [
        /(^|\D)1\/(2|4)(\D)/g
        /(^|\D)3\/4(\D)/g
      ]
      replacement:[
        '$1&frac1$2;$3'
        '$1&frac34;$2'
      ]
    math_chars:
      description: 'Математические знаки больше/меньше/плюс минус/неравно'
      pattern:[
        /!=/g
        /\<=/g
        /([^=]|^)\>=/g
        /~=/g
        /\+-/g
      ]
      replacement:[
        '&ne;'
        '&le;'
        '$1&ge;'
        '&cong;'
        '&plusmn;'
      ]
    thinsp_between_number_triads:
      description: 'Объединение триад чисел полупробелом'
      pattern: /([0-9]{1,3}( [0-9]{3}){1,})(.|$)/g
      replacement: (match, m) -> (if m[3] is "-" then match else m[1].replace(" ", "&thinsp;")) + m[3]
    thinsp_between_no_and_number:
      description: 'Пробел между симоволом номера и числом'
      pattern: /(№|\&#8470\;)(\s|&nbsp;)*(\d)/ig
      replacement: '&#8470;&thinsp;$3'
    thinsp_between_sect_and_number:
      description: 'Пробел между параграфом и числом'
      pattern: /(§|\&sect\;)(\s|&nbsp;)*(\d+|[IVX]+|[a-zа-яё]+)/gi
      replacement: '&sect;&thinsp;$3'

