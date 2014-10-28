EMTret = require "../tret"

class EMTretDash extends EMTret
  title: "Дефисы и тире"

  rules:
    mdash_symbol_to_html_mdash:
      description: 'Замена символа тире на html конструкцию'
      pattern: /—/ig
      replacement: '&mdash;'
    mdash:
      description: 'Тире после кавычек, скобочек, пунктуации'
      pattern: [
        /([a-zа-яё0-9]+|\,|\:|\)|\&(ra|ld)quo\;|\|\"|\>)(\040|\t)(—|\-|\&mdash\;)(\s|$|\<)/gi
        /(\,|\:|\)|\")(—|\-|\&mdash\;)(\s|$|\<)/gi
      ]
      replacement: [
        '$1&nbsp;&mdash;$5'
        '$1&nbsp;&mdash;$3'
      ]
    mdash_2:
      description: 'Тире после переноса строки'
      pattern: /(\n|\r|^|\>)(\-|\&mdash\;)(\t|\040)/gm
      replacement: '$1&mdash;&nbsp;'
    mdash_3:
      description: 'Тире после знаков восклицания, троеточия и прочее'
      pattern: /(\.|\!|\?|\&hellip\;)(\040|\t|\&nbsp\;)(\-|\&mdash\;)(\040|\t|\&nbsp\;)/g
      replacement: '$1 &mdash;&nbsp;'
    iz_za_pod:
      description: 'Расстановка дефисов между из-за, из-под'
      pattern: /(\s|\&nbsp\;|\>|^)(из)(\040|\t|\&nbsp\;)\-?(за|под)([\.\,\!\?\:\;]|\040|\&nbsp\;)/gi
      replacement: (match, m) -> (if m[1] == "&nbsp;" then " " else m[1]) + m[2] + "-" + m[4] + (if m[5] == "&nbsp;" then " " else m[5])
    to_libo_nibud:
      description: 'Автоматическая простановка дефисов в обезличенных местоимениях и междометиях'
      cycled: true
      pattern: /(\s|^|\&nbsp\;|\>)(кто|кем|когда|зачем|почему|как|что|чем|где|чего|кого)\-?(\040|\t|\&nbsp\;)\-?(то|либо|нибудь)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi
      replacement: (match, m) -> (if m[1] == "&nbsp;" then " " else m[1]) + m[2] + "-" + m[4] + (if m[5] == "&nbsp;" then " " else m[5])
    koe_kak:
      description: 'Кое-как, кой-кого, все-таки'
      cycled: true
      pattern: [
        /(\s|^|\&nbsp\;|\>)(кое)\-?(\040|\t|\&nbsp\;)\-?(как)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi
        /(\s|^|\&nbsp\;|\>)(кой)\-?(\040|\t|\&nbsp\;)\-?(кого)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi
        /(\s|^|\&nbsp\;|\>)(вс[её])\-?(\040|\t|\&nbsp\;)\-?(таки)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi
      ]
      replacement: (match, m) -> (if m[1] == "&nbsp;" then " " else m[1]) + m[2] + "-" + m[4] + (if m[5] == "&nbsp;" then " " else m[5])
    ka_de_kas:
      description: 'Расстановка дефисов с частицами ка, де, кась'
      disabled: true
      pattern: [
        /(\s|^|\&nbsp\;|\>)([а-яё]+)(\040|\t|\&nbsp\;)(ка)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi
        /(\s|^|\&nbsp\;|\>)([а-яё]+)(\040|\t|\&nbsp\;)(де)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi
        /(\s|^|\&nbsp\;|\>)([а-яё]+)(\040|\t|\&nbsp\;)(кась)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi
      ]
      replacement: (match, m) -> (if m[1] == "&nbsp;" then " " else m[1]) + m[2] + "-" + m[4] + (if m[5] == "&nbsp;" then " " else m[5])

module.exports = EMTretDash
