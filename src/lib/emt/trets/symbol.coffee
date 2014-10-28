EMTret = require "../tret"

class EMTretSymbol extends EMTret
  title: "Специальные символы"

  classes:
    nowrap: 'word-spacing:nowrap;'

  rules:
    tm_replace:
      description: 'Замена (tm) на символ торговой марки'
      pattern: /([\040\t])?\(tm\)/ig
      replacement: '&trade;'
    r_sign_replace:
      description: 'Замена (R) на символ зарегистрированной торговой марки'
      pattern: /(.|^)\(r\)(.|$)/ig
      replacement: '$1&reg;$2'
    copy_replace:
      description: 'Замена (c) на символ копирайт'
      pattern:[
        /\((c|с)\)\s+/ig
        /\((c|с)\)($|\.|,|!|\?)/ig
      ]
      replacement: [
        '&copy;&nbsp;'
        '&copy;$2'
      ]
    apostrophe:
      description: 'Расстановка правильного апострофа в текстах'
      pattern: /(\s|^|\>|\&rsquo\;)([a-zа-яё]{1,})\'([a-zа-яё]+)/gi
      replacement: '$1$2&rsquo;$3'
      cycled: true
    degree_f:
      description: 'Градусы по Фаренгейту'
      pattern: /([0-9]+)F($|\s|\.|\,|\;|\:|\&nbsp\;|\?|\!)/g
      replacement: (match, m) -> @tag("#{m[1]} &deg;F", "span", {class: "nowrap"}) + m[2]
    euro_symbol:
      description: 'Символ евро'
      simple_replace: true
      pattern: '€'
      replacement: '&euro;'
    arrows_symbols:
      description: 'Замена стрелок вправо-влево на html коды'
      pattern: [
        /(\s|\>|\&nbsp\;|^)\-\>($|\s|\&nbsp\;|\<)/g
        /(\s|\>|\&nbsp\;|^|;)\<\-(\s|\&nbsp\;|$)/g
        /→/g
        /←/g
      ]
      replacement: [
        '$1&rarr;$2'
        '$1&larr;$2'
        '&rarr;'
        '&larr;'
      ]

    
module.exports = EMTretSymbol
