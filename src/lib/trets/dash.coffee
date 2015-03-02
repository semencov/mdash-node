Tret = require "../tret"

module.exports = class Dash extends Tret

  order: 6

  rules:

    # Замена символа тире на html конструкцию
    mdash_symbol_to_html_mdash:
      pattern: [
        /—/ig
      ]
      replacement: [
        ($) -> "&mdash;"
      ]

    # Тире после кавычек, скобочек, пунктуации
    mdash:
      pattern: [
        /([a-zа-яё0-9]+|\,|\:|\)|\&(ra|ld)quo\;|\"|\>)(\s)(—|\-|\&mdash\;)(\s|$|\<)/gi
        /(\,|\:|\)|\")(—|\-|\&mdash\;)(\s|$|\<)/gi
      ]
      replacement: [
        ($) -> "#{$[1]}&nbsp;&mdash;#{$[5]}"
        ($) -> "#{$[1]}&nbsp;&mdash;#{$[3]}"
      ]

    # Тире после переноса строки
    mdash_2:
      pattern: [
        /(\n|\r|^|\>)(\-|\&mdash\;)(\s)/gm
      ]
      replacement: [
        ($) -> "#{$[1]}&mdash;&nbsp;"
      ]

    # Тире после знаков восклицания, троеточия и прочее
    mdash_3:
      pattern: [
        /(\.|\!|\?|\&hellip\;)(\s|\t|\&nbsp\;)(\-|\&mdash\;)(\s|\t|\&nbsp\;)/g
      ]
      replacement: [
        ($) -> "#{$[1]} &mdash;&nbsp;"
      ]

    # Расстановка дефисов между из-за, из-под
    iz_za_pod:
      pattern: [
        /(\B)(из)(\s|\&nbsp\;)\-?(за|под)(\B)/gi
      ]
      replacement: [
        ($) -> (if $[1] is "&nbsp;" then " " else $[1]) + "#{$[2]}-#{$[4]}" + (if $[5] is "&nbsp;" then " " else $[5])
      ]

    # Автоматическая простановка дефисов в обезличенных местоимениях и междометиях
    to_libo_nibud:
      pattern: [
        /(\B)(кто|кем|когда|зачем|почему|как|что|чем|где|чего|кого)\-?(\s|\&nbsp\;)\-?(то|либо|нибудь)(\B)/gi
      ]
      replacement: [
        ($) -> (if $[1] is "&nbsp;" then " " else $[1]) + "#{$[2]}-#{$[4]}" + (if $[5] is "&nbsp;" then " " else $[5])
      ]

    # Кое-как, кой-кого, все-таки
    koe_kak:
      pattern: [
        /(\B)(кое)\-?(\s|\&nbsp\;)\-?(как)(\B)/gi
        /(\B)(кой)\-?(\s|\&nbsp\;)\-?(кого)(\B)/gi
        /(\B)(вс[её])\-?(\s|\&nbsp\;)\-?(таки)(\B)/gi
      ]
      replacement: [
        ($) -> (if $[1] is "&nbsp;" then " " else $[1]) + "#{$[2]}-#{$[4]}" + (if $[5] is "&nbsp;" then " " else $[5])
      ]

    # Расстановка дефисов с частицами ка, де, кась
    ka_de_kas:
      pattern: [
        /(\B)([а-яё]+)(\s|\&nbsp\;)(ка)(\B)/gi
        /(\B)([а-яё]+)(\s|\&nbsp\;)(де)(\B)/gi
        /(\B)([а-яё]+)(\s|\&nbsp\;)(кась)(\B)/gi
      ]
      replacement: [
        ($) -> (if $[1] is "&nbsp;" then " " else $[1]) + "#{$[2]}-#{$[4]}" + (if $[5] is "&nbsp;" then " " else $[5])
      ]

