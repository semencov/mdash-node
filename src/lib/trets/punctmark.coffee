Tret = require "../tret"

module.exports = class Punctmark extends Tret

  order: 4

  rules:

    # Расстановка запятых перед а, но
    auto_comma:
      pattern: [
        /([a-zа-яё])(\s|&nbsp;)(но|а)(\s|&nbsp;)/ig
      ]
      replacement: [
        ($) -> "#{$[1]},#{$[2]}#{$[3]}#{$[4]}"
      ]

    # Лишние восклицательные, вопросительные знаки и точки
    punctuation_marks_limit:
      pattern: [
        /([\!\.\?]){4,}/g
      ]
      replacement: [
        ($) -> "#{$[1]}#{$[1]}#{$[1]}"
      ]

    # Лишние запятые, двоеточия, точки с запятой
    punctuation_marks_base_limit:
      pattern: [
        /([\,]|[\:]|[\;]]){2,}/g
      ]
      replacement: [
        ($) -> "$[1]"
      ]

    # Замена трех точек на знак многоточия
    hellip:
      pattern: [
        /\.\.\./g
      ]
      replacement: [
        ($) -> "&hellip;"
      ]

    # Замена восклицательного и вопросительного знаков местами
    fix_excl_quest_marks:
      pattern: [
        /([a-zа-яё0-9])\!\?(\s|$|\<)/gi
      ]
      replacement: [
        ($) -> "#{$[1]}?!#{$[2]}"
      ]

    # Замена сдвоенных знаков препинания на одинарные
    fix_pmarks:
      pattern: [
        /([^\!\?])\.\./g
        /([a-zа-яё0-9])(\!|\.)(\!|\.|\?)(\s|$|\<)/gi
        /([a-zа-яё0-9])(\?)(\?)(\s|$|\<)/gi
      ]
      replacement: [
        ($) -> "#{$[1]}."
        ($) -> "#{$[1]}#{$[2]}#{$[4]}"
        ($) -> "#{$[1]}#{$[2]}#{$[4]}"
      ]

    # Лишние пробелы после открывающей скобочки и перед закрывающей
    fix_brackets:
      pattern: [
        /(\()(\s|\t)+/g
        /(\s|\t)+(\))/g
      ]
      replacement: [
        ($) -> "#{$[1]}"
        ($) -> "#{$[2]}"
      ]

    # Пробел перед открывающей скобочкой
    fix_brackets_space:
      pattern: [
        /([a-zа-яё0-9])(\()/ig
      ]
      replacement: [
        ($) -> "#{$[1]} #{$[2]}"
      ]

    # Точка в конце текста, если её там нет
    dot_on_end:
      pattern: [
        /([a-zа-яё0-9])(\s|\t|\&nbsp\;)*$/gi
      ]
      replacement: [
        ($) -> "#{$[1]}."
      ]
      
