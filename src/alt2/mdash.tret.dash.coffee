# Mdash.Tret = require "./mdash.tret"

class Mdash.Tret.Dash extends Mdash.Tret

  rules:

    # Замена символа тире на html конструкцию
    mdash_symbol_to_html_mdash:
      pattern: [
        /—/ig
      ]
      replacement: [
        -> "&mdash;"
      ]

    # Тире после кавычек, скобочек, пунктуации
    mdash:
      pattern: [
        /([a-zа-яё0-9]+|\,|\:|\)|\&(ra|ld)quo\;|\"|\>)(\s|\t)(—|\-|\&mdash\;)(\s|$|\<)/gi
        /(\,|\:|\)|\")(—|\-|\&mdash\;)(\s|$|\<)/gi
      ]
      replacement: [
        -> "#{$1}&nbsp;&mdash;#{$5}"
        -> "#{$1}&nbsp;&mdash;#{$3}"
      ]

    # Тире после переноса строки
    mdash_2:
      pattern: [
        /(\n|\r|^|\>)(\-|\&mdash\;)(\t|\s)/gm
      ]
      replacement: [
        -> "#{$1}&mdash;&nbsp;"
      ]

    # Тире после знаков восклицания, троеточия и прочее
    mdash_3:
      pattern: [
        /(\.|\!|\?|\&hellip\;)(\s|\t|\&nbsp\;)(\-|\&mdash\;)(\s|\t|\&nbsp\;)/g
      ]
      replacement: [
        -> "#{$1} &mdash;&nbsp;"
      ]

    # Расстановка дефисов между из-за, из-под
    iz_za_pod:
      pattern: [
        /(\s|\&nbsp\;|\>|^)(из)(\s|\t|\&nbsp\;)\-?(за|под)([\.\,\!\?\:\;]|\s|\&nbsp\;)/gi
      ]
      replacement: [
        -> (if $1 is "&nbsp;" then " " else $1) + "#{$2}-#{$4}" + (if $5 is "&nbsp;" then " " else $5)
      ]

    # Автоматическая простановка дефисов в обезличенных местоимениях и междометиях
    to_libo_nibud:
      pattern: [
        /(\s|^|\&nbsp\;|\>)(кто|кем|когда|зачем|почему|как|что|чем|где|чего|кого)\-?(\s|\t|\&nbsp\;)\-?(то|либо|нибудь)([\.\,\!\?\;]|\s|\&nbsp\;|$)/gi
      ]
      replacement: [
        -> (if $1 is "&nbsp;" then " " else $1) + "#{$2}-#{$4}" + (if $5 is "&nbsp;" then " " else $5)
      ]

    # Кое-как, кой-кого, все-таки
    koe_kak:
      pattern: [
        /(\s|^|\&nbsp\;|\>)(кое)\-?(\s|\t|\&nbsp\;)\-?(как)([\.\,\!\?\;]|\s|\&nbsp\;|$)/gi
        /(\s|^|\&nbsp\;|\>)(кой)\-?(\s|\t|\&nbsp\;)\-?(кого)([\.\,\!\?\;]|\s|\&nbsp\;|$)/gi
        /(\s|^|\&nbsp\;|\>)(вс[её])\-?(\s|\t|\&nbsp\;)\-?(таки)([\.\,\!\?\;]|\s|\&nbsp\;|$)/gi
      ]
      replacement: [
        -> (if $1 is "&nbsp;" then " " else $1) + "#{$2}-#{$4}" + (if $5 is "&nbsp;" then " " else $5)
      ]

    # Расстановка дефисов с частицами ка, де, кась
    ka_de_kas:
      pattern: [
        /(\s|^|\&nbsp\;|\>)([а-яё]+)(\s|\t|\&nbsp\;)(ка)([\.\,\!\?\;]|\s|\&nbsp\;|$)/gi
        /(\s|^|\&nbsp\;|\>)([а-яё]+)(\s|\t|\&nbsp\;)(де)([\.\,\!\?\;]|\s|\&nbsp\;|$)/gi
        /(\s|^|\&nbsp\;|\>)([а-яё]+)(\s|\t|\&nbsp\;)(кась)([\.\,\!\?\;]|\s|\&nbsp\;|$)/gi
      ]
      replacement: [
        -> (if $1 is "&nbsp;" then " " else $1) + "#{$2}-#{$4}" + (if $5 is "&nbsp;" then " " else $5)
      ]

