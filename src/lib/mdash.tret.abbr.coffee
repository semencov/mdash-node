# Mdash.Tret = require "./mdash.tret"

class Mdash.Tret.Abbr extends Mdash.Tret
  title: "Сокращения"
  domain_zones: ['ru', 'ру', 'com', 'ком', 'org', 'орг', 'уа', 'ua', 'lv', 'lt', 'ee', 'eu']
  
  classes:
    nowrap: 'white-space:nowrap;'

  rules:
    nobr_abbreviation:
      description :  'Расстановка пробелов перед сокращениями dpi, lpi'
      pattern     :  /(\s+|^|\>)(\d+)(\040|\t)*(dpi|lpi)([\s\;\.\?\!\:\(]|$)/ig
      replacement :  '$1$2&nbsp;$4$5'
    nobr_acronym:
      description : 'Расстановка пробелов перед сокращениями гл., стр., рис., илл., ст., п.'
      pattern     : /(\s|^|\>|\()(гл|стр|рис|илл?|ст|п|с)\.(\040|\t)*(\d+)(\&nbsp\;|\s|\.|\,|\?|\!|$)/ig
      replacement : '$1$2.&nbsp;$4$5'
    nobr_sm_im:
      description : 'Расстановка пробелов перед сокращениями см., им.'
      pattern     : /(\s|^|\>|\()(см|им)\.(\040|\t)*([а-яё0-9a-z]+)(\s|\.|\,|\?|\!|$)/ig
      replacement : '$1$2.&nbsp;$4$5'
    nobr_locations:
      description : 'Расстановка пробелов в сокращениях г., ул., пер., д.'
      pattern     : [
        /(\s|^|\>)(г|ул|пер|просп|пл|бул|наб|пр|ш|туп)\.(\040|\t)*([а-яё0-9a-z]+)(\s|\.|\,|\?|\!|$)/ig
        /(\s|^|\>)(б\-р|пр\-кт)(\040|\t)*([а-яё0-9a-z]+)(\s|\.|\,|\?|\!|$)/ig
        /(\s|^|\>)(д|кв|эт)\.(\040|\t)*(\d+)(\s|\.|\,|\?|\!|$)/ig
      ]
      replacement : [
        '$1$2.&nbsp;$4$5'
        '$1$2&nbsp;$4$5'
        '$1$2.&nbsp;$4$5'
      ]
    nbsp_before_unit:
      description : 'Замена символов и привязка сокращений в размерных величинах: м, см, м2…'
      pattern     : [
        /(\s|^|\>|\&nbsp\;|\,)(\d+)( |\&nbsp\;)?(м|мм|см|дм|км|гм|km|dm|cm|mm)(\s|\.|\!|\?|\,|$|\&plusmn\;|\;)/ig
        /(\s|^|\>|\&nbsp\;|\,)(\d+)( |\&nbsp\;)?(м|мм|см|дм|км|гм|km|dm|cm|mm)([32]|&sup3;|&sup2;)(\s|\.|\!|\?|\,|$|\&plusmn\;|\;)/ig
      ]
      replacement : [
        '$1$2&nbsp;$4$5'
        (match, m) -> "#{m[1]}#{m[2]}&nbsp;#{m[4]}" + (if m[5] is "3" or m[5] is "2" then "&sup#{m[5]};" else m[5]) + m[6]
      ]
    nbsp_before_weight_unit:
      description : 'Замена символов и привязка сокращений в весовых величинах: г, кг, мг…'
      pattern     : /(\s|^|\>|\&nbsp\;|\,)(\d+)( |\&nbsp\;)?(г|кг|мг|т)(\s|\.|\!|\?|\,|$|\&nbsp\;|\;)/ig
      replacement : '$1$2&nbsp;$4$5'
    nobr_before_unit_volt:
      description : 'Установка пробельных символов в сокращении вольт'
      pattern     : /(\d+)([вВ]| В)(\s|\.|\!|\?|\,|$)/g
      replacement : '$1&nbsp;В$3'
    ps_pps:
      description : 'Объединение сокращений P.S., P.P.S.'
      pattern     : /(^|\040|\t|\>|\r|\n)(p\.\040?)(p\.\040?)?(s\.)([^\<])/ig
      replacement : (match, m) -> m[1] + @tag("#{m[2].trim()} " + (if m[3] then "#{m[3].trim()} " else "") + m[4], "span", {class: "nowrap"}) + m[5]
    nobr_vtch_itd_itp:
      description : 'Объединение сокращений и т.д., и т.п., в т.ч.'
      cycled      : true
      pattern     : [
        /(^|\s|\&nbsp\;)и( |\&nbsp\;)т\.?[ ]?д(\.|$|\s|\&nbsp\;)/g
        /(^|\s|\&nbsp\;)и( |\&nbsp\;)т\.?[ ]?п(\.|$|\s|\&nbsp\;)/g
        /(^|\s|\&nbsp\;)в( |\&nbsp\;)т\.?[ ]?ч(\.|$|\s|\&nbsp\;)/g
      ]
      replacement : [
        (match, m) -> m[1] + @tag("и т. д.", "span",  {class: "nowrap"}) + (if m[3] isnt "." then m[3] else "")
        (match, m) -> m[1] + @tag("и т. п.", "span",  {class: "nowrap"}) + (if m[3] isnt "." then m[3] else "")
        (match, m) -> m[1] + @tag("в т. ч.", "span",  {class: "nowrap"}) + (if m[3] isnt "." then m[3] else "")
      ]
    nbsp_te:
      description : 'Обработка т.е.'
      pattern     : /(^|\s|\&nbsp\;)([тТ])\.?[ ]?е\./g
      replacement : (match, m) -> m[1] + @tag(m[2] + ". е.", "span", {class: "nowrap"})
    nbsp_money_abbr:
      description : 'Форматирование денежных сокращений (расстановка пробелов и привязка названия валюты к числу)'
      pattern     : /(\d)((\040|\&nbsp\;)?(тыс|млн|млрд)\.?(\040|\&nbsp\;)?)?(\040|\&nbsp\;)?(руб\.|долл\.|евро|€|&euro;|\$|у[\.]? ?е[\.]?)/g
      replacement : (match, m) -> m[1] + (if m[4] then "&nbsp;" + m[4] + (if m[4] == "тыс" then "." else "") else "") + "&nbsp;" + (if not m[7].match(/у[\\\\.]? ?е[\\\\.]?/gi) then m[7] else "у.е.")
    nbsp_org_abbr:
      description : 'Привязка сокращений форм собственности к названиям организаций'
      pattern     : [
        /([^a-zA-Zа-яёА-ЯЁ]|^)(ООО|ЗАО|ОАО|НИИ|ПБОЮЛ) ([a-zA-Zа-яёА-ЯЁ]|\"|\&laquo\;|\&bdquo\;|<)/ig
        /([^a-zA-Zа-яёА-ЯЁ]|^)(SIA|VAS|AAS|AS|IK) ([a-zA-Zа-яёА-ЯЁ]|\"|\&laquo\;|\&bdquo\;|<)/ig  # правило для Латвии
      ]
      replacement : [
        "$1$2&nbsp;$3"
        "$1$2&nbsp;$3"  # правило для Латвии
      ]
    nobr_gost:
      description : 'Привязка сокращения ГОСТ к номеру'
      pattern     : [
        /(\040|\t|\&nbsp\;|^)ГОСТ( |\&nbsp\;)?(\d+)((\-|\&minus\;|\&mdash\;)(\d+))?(( |\&nbsp\;)(\-|\&mdash\;))?/ig
        /(\040|\t|\&nbsp\;|^|\>)ГОСТ( |\&nbsp\;)?(\d+)(\-|\&minus\;|\&mdash\;)(\d+)/ig
        /(\040|\t|\&nbsp\;|^|\>)LVS( |\&nbsp\;)?(\d+)(\:|\-|\&minus\;|\&mdash\;|)(\d+)/ig  # правило для Латвии
        /(\040|\t|\&nbsp\;|^|\>)(RFC|ISO|IEEE)( |\&nbsp\;)?(\d+[.-\/]?\d?)/ig  # правило для международных стандартов
      ]
      replacement : [
        (match, m) -> m[1] + @tag("ГОСТ #{m[3]}" + (if m[6]? then "&ndash;" + m[6] else "") + (if m[7]? then " &mdash;" else ""), "span", {class:"nowrap"})
        (match, m) -> m[1] + "ГОСТ #{m[3]}&ndash;#{m[5]}"
        (match, m) -> m[1] + @tag("LVS #{m[3]}:#{m[5]}", "span", {class:"nowrap"})  # правило для Латвии
        (match, m) -> m[1] + @tag("#{m[2]} #{m[4]}", "span", {class:"nowrap"})  # правило для международных стандартов
      ]


