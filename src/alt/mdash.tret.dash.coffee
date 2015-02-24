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
        /([a-zа-яё0-9]+|\,|\:|\)|\&(ra|ld)quo\;|\|\"|\>)(\040|\t)(—|\-|\&mdash\;)(\s|$|\<)/gi
        /(\,|\:|\)|\")(—|\-|\&mdash\;)(\s|$|\<)/gi
      ]
      replacement: [
        -> "#{$1}&nbsp;&mdash;#{$5}"
        -> "#{$1}&nbsp;&mdash;#{$3}"
      ]

    # Тире после переноса строки
    mdash_2:
      pattern: [
        /(\n|\r|^|\>)(\-|\&mdash\;)(\t|\040)/gm
      ]
      replacement: [
        -> "#{$1}&mdash;&nbsp;"
      ]

    # Тире после знаков восклицания, троеточия и прочее
    mdash_3:
      pattern: [
        /(\.|\!|\?|\&hellip\;)(\040|\t|\&nbsp\;)(\-|\&mdash\;)(\040|\t|\&nbsp\;)/g
      ]
      replacement: [
        -> "#{$1} &mdash;&nbsp;"
      ]

    # Расстановка дефисов между из-за, из-под
    iz_za_pod:
      pattern: [
        /(\s|\&nbsp\;|\>|^)(из)(\040|\t|\&nbsp\;)\-?(за|под)([\.\,\!\?\:\;]|\040|\&nbsp\;)/gi
      ]
      replacement: [
        -> (if $1 is "&nbsp;" then " " else $1) + "#{$2}-#{$4}" + (if $5 is "&nbsp;" then " " else $5)
      ]

    # Автоматическая простановка дефисов в обезличенных местоимениях и междометиях
    to_libo_nibud:
      cycled: true
      pattern: [
        /(\s|^|\&nbsp\;|\>)(кто|кем|когда|зачем|почему|как|что|чем|где|чего|кого)\-?(\040|\t|\&nbsp\;)\-?(то|либо|нибудь)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi
      ]
      replacement: [
        -> (if $1 is "&nbsp;" then " " else $1) + "#{$2}-#{$4}" + (if $5 is "&nbsp;" then " " else $5)
      ]

    # Кое-как, кой-кого, все-таки
    koe_kak:
      cycled: true
      pattern: [
        /(\s|^|\&nbsp\;|\>)(кое)\-?(\040|\t|\&nbsp\;)\-?(как)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi
        /(\s|^|\&nbsp\;|\>)(кой)\-?(\040|\t|\&nbsp\;)\-?(кого)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi
        /(\s|^|\&nbsp\;|\>)(вс[её])\-?(\040|\t|\&nbsp\;)\-?(таки)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi
      ]
      replacement: [
        -> (if $1 is "&nbsp;" then " " else $1) + "#{$2}-#{$4}" + (if $5 is "&nbsp;" then " " else $5)
      ]

    # Расстановка дефисов с частицами ка, де, кась
    ka_de_kas:
      disabled: true
      pattern: [
        /(\s|^|\&nbsp\;|\>)([а-яё]+)(\040|\t|\&nbsp\;)(ка)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi
        /(\s|^|\&nbsp\;|\>)([а-яё]+)(\040|\t|\&nbsp\;)(де)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi
        /(\s|^|\&nbsp\;|\>)([а-яё]+)(\040|\t|\&nbsp\;)(кась)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi
      ]
      replacement: [
        -> (if $1 is "&nbsp;" then " " else $1) + "#{$2}-#{$4}" + (if $5 is "&nbsp;" then " " else $5)
      ]

