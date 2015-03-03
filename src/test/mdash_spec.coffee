'use strict'

require 'mocha-cakes'

mdash = require '../lib/mdash.js'

###
======== A Handy Little Mocha-cakes Reference ========
https://github.com/quangv/mocha-cakes
https://github.com/visionmedia/should.js
https://github.com/visionmedia/mocha

Mocha-cakes:
  Feature, Scenario: maps to describe
  Given, When, Then: maps to it,
    but if first message argument is ommited, it'll be a describe
  And, But, I: maps to it,
    but if first message argument is ommited, it'll be a describe

Mocha hooks:
  before ()-> # before describe
  after ()-> # after describe
  beforeEach ()-> # before each it
  afterEach ()-> # after each it

Should assertions:
  should.exist('hello')
  should.fail('expected an error!')
  true.should.be.ok
  true.should.be.true
  false.should.be.false

  (()-> arguments)(1,2,3).should.be.arguments
  [1,2,3].should.eql([1,2,3])
  should.strictEqual(undefined, value)
  user.age.should.be.within(5, 50)
  username.should.match(/^\w+$/)

  user.should.be.a('object')
  [].should.be.an.instanceOf(Array)

  user.should.have.property('age', 15)

  user.age.should.be.above(5)
  user.age.should.be.below(100)
  user.pets.should.have.length(5)

  res.should.have.status(200) #res.statusCode should be 200
  res.should.be.json
  res.should.be.html
  res.should.have.header('Content-Length', '123')

  [].should.be.empty
  [1,2,3].should.include(3)
  'foo bar baz'.should.include('foo')
  { name: 'TJ', pet: tobi }.user.should.include({ pet: tobi, name: 'TJ' })
  { foo: 'bar', baz: 'raz' }.should.have.keys('foo', 'bar')

  (()-> throw new Error('failed to baz')).should.throwError(/^fail.+/)

  user.should.have.property('pets').with.lengthOf(4)
  user.should.be.a('object').and.have.property('name', 'tj')
###

Feature "Abbr",
  "Расстановка пробелов перед сокращениями dpi, lpi",
  "Расстановка пробелов перед сокращениями гл., стр., рис., илл., ст., п.",
  "Расстановка пробелов перед сокращениями см., им.",
  "Расстановка пробелов в сокращениях г., ул., пер., д.",
  "Замена символов и привязка сокращений в размерных величинах: м, см, м2.",
  "Замена символов и привязка сокращений в весовых величинах: г, кг, мг.",
  "Установка пробельных символов в сокращении вольт",
  "Объединение сокращений P.S., P.P.S.",
  "Объединение сокращений и т.д., и т.п., в т.ч.",
  "Обработка т.е.",
  "Форматирование денежных сокращений (расстановка пробелов и привязка названия валюты к числу)",
  "Привязка сокращений форм собственности к названиям организаций",
  "Привязка сокращения ГОСТ к номеру", ->

    Scenario "Расстановка пробелов перед сокращениями dpi, lpi", ->
      text = null
      typo = null

      Given "Как правильно: 10dpi или 12 lpi?", ->
        typo = new mdash("Как правильно: 10dpi или 12 lpi?", {'*': false})
      When "format", ->
        text = typo.format({'Abbr.nobr_abbreviation': true})
      Then "text should be 'Как правильно: 10&nbsp;dpi или 12&nbsp;lpi?'", ->
        text.should.eql "Как правильно: 10&nbsp;dpi или 12&nbsp;lpi?"

    Scenario "Расстановка пробелов перед сокращениями гл., стр., рис., илл., ст., п.", ->
      text = null
      typo = null

      Given "Для понимания смотрите рис.1 в стр. 34.", ->
        typo = new mdash("Для понимания смотрите рис.1 в стр. 34.", {'*': false})
      When "format", ->
        text = typo.format({'Abbr.nobr_acronym': true})
      Then "text should be 'Для понимания смотрите рис.&nbsp;1 в стр.&nbsp;34.'", ->
        text.should.eql "Для понимания смотрите рис.&nbsp;1 в стр.&nbsp;34."

    Scenario "Расстановка пробелов перед сокращениями см., им.", ->
      text = null
      typo = null

      Given "Завод им. Ильича (см. приложение 1).", ->
        typo = new mdash("Завод им. Ильича (см. приложение 1).", {'*': false})
      When "format", ->
        text = typo.format({'Abbr.nobr_sm_im': true})
      Then "text should be 'Завод им.&nbsp;Ильича (см.&nbsp;приложение 1).'", ->
        text.should.eql "Завод им.&nbsp;Ильича (см.&nbsp;приложение 1)."

    Scenario "Расстановка пробелов в сокращениях г., ул., пер., д.", ->
      text = null
      typo = null

      Given "Угол ул. Новый Арбат и Крестовоздвиженского пер., д. 6, г.Москва.", ->
        typo = new mdash("Угол ул. Новый Арбат и Крестовоздвиженского пер., д. 6, г.Москва.", {'*': false})
      When "format", ->
        text = typo.format({'Abbr.nobr_locations': true})
      Then "text should be 'Угол ул.&nbsp;Новый Арбат и Крестовоздвиженского пер., д.&nbsp;6, г.&nbsp;Москва.'", ->
        text.should.eql "Угол ул.&nbsp;Новый Арбат и Крестовоздвиженского пер., д.&nbsp;6, г.&nbsp;Москва."

    Scenario "Замена символов и привязка сокращений в размерных величинах: м, см, м2.", ->
      text = null
      typo = null

      Given "В 1м2 = 1 mm2, 32cm", ->
        typo = new mdash("В 1м2 = 1 mm2, 32cm", {'*': false})
      When "format", ->
        text = typo.format({'Abbr.nbsp_before_unit': true})
      Then "text should be 'В 1&nbsp;м&sup2; = 1&nbsp;mm&sup2;, 32&nbsp;cm'", ->
        text.should.eql "В 1&nbsp;м&sup2; = 1&nbsp;mm&sup2;, 32&nbsp;cm"

    Scenario "Замена символов и привязка сокращений в весовых величинах: г, кг, мг.", ->
      text = null
      typo = null

      Given "В 1кг = 1000 г = 1000000мг", ->
        typo = new mdash("В 1кг = 1000 г = 1000000мг", {'*': false})
      When "format", ->
        text = typo.format({'Abbr.nbsp_before_weight_unit': true})
      Then "text should be 'В 1&nbsp;кг = 1000&nbsp;г = 1000000&nbsp;мг'", ->
        text.should.eql "В 1&nbsp;кг = 1000&nbsp;г = 1000000&nbsp;мг"

    Scenario "Установка пробельных символов в сокращении вольт", ->
      text = null
      typo = null

      Given "Удар был не сильный, около 50в.", ->
        typo = new mdash("Удар был не сильный, около 50в.", {'*': false})
      When "format", ->
        text = typo.format({'Abbr.nobr_before_unit_volt': true})
      Then "text should be 'Удар был не сильный, около 50&nbsp;В.'", ->
        text.should.eql "Удар был не сильный, около 50&nbsp;В."

    Scenario "Объединение сокращений P.S., P.P.S.", ->
      text = null
      typo = null

      Given "P.S. Не забудь оплатить счета. P.P.S. И мои тоже.", ->
        typo = new mdash("P.S. Не забудь оплатить счета. P.P.S. И мои тоже.", {'*': false})
      When "format", ->
        text = typo.format({'Abbr.ps_pps': true})
      Then "text should be '<nobr>P. S.</nobr> Не забудь оплатить счета. <nobr>P. P. S.</nobr> И мои тоже.'", ->
        text.should.eql "<nobr>P. S.</nobr> Не забудь оплатить счета. <nobr>P. P. S.</nobr> И мои тоже."

    Scenario "Объединение сокращений и т.д., и т.п., в т.ч.", ->
      text = null
      typo = null

      Given "Либералы, эссеры, анархисты и тд и тп, в т.ч представители маргинальных слоёв общества.", ->
        typo = new mdash("Либералы, эссеры, анархисты и тд и тп, в т.ч представители маргинальных слоёв общества.", {'*': false})
      When "format", ->
        text = typo.format({'Abbr.nobr_vtch_itd_itp': true})
      Then "text should be 'Либералы, эссеры, анархисты <nobr>и т. д.</nobr> <nobr>и т. п.</nobr>, <nobr>в т. ч.</nobr> представители маргинальных слоёв общества.'", ->
        text.should.eql "Либералы, эссеры, анархисты <nobr>и т. д.</nobr> <nobr>и т. п.</nobr>, <nobr>в т. ч.</nobr> представители маргинальных слоёв общества."

    Scenario "Обработка т.е.", ->
      text = null
      typo = null

      Given "Ночь подходила к концу, те. вечеринка была в самом разгаре.", ->
        typo = new mdash("Ночь подходила к концу, те. вечеринка была в самом разгаре.", {'*': false})
      When "format", ->
        text = typo.format({'Abbr.nbsp_te': true})
      Then "text should be 'Ночь подходила к концу, <nobr>т. е.</nobr> вечеринка была в самом разгаре.'", ->
        text.should.eql "Ночь подходила к концу, <nobr>т. е.</nobr> вечеринка была в самом разгаре."

    Scenario "Форматирование денежных сокращений (расстановка пробелов и привязка названия валюты к числу)", ->
      text = null
      typo = null

      Given "На чёрном рынке за 1уе. дают уже по 7 тыс руб. наличными.", ->
        typo = new mdash("На чёрном рынке за 100уе. дают уже по 7 тыс руб. наличными.", {'*': false})
      When "format", ->
        text = typo.format({'Abbr.nbsp_money_abbr': true})
      Then "text should be 'На чёрном рынке за 100&nbsp;у.е. дают уже по 7&nbsp;тыс.&nbsp;руб. наличными.'", ->
        text.should.eql "На чёрном рынке за 100&nbsp;у.е. дают уже по 7&nbsp;тыс.&nbsp;руб. наличными."

    Scenario "Привязка сокращений форм собственности к названиям организаций", ->
      text = null
      typo = null

      Given "На дверях красовалась табличка с названием: ООО Рога и копыта.", ->
        typo = new mdash("На дверях красовалась табличка с названием: ООО Рога и копыта.", {'*': false})
      When "format", ->
        text = typo.format({'Abbr.nbsp_org_abbr': true})
      Then "text should be 'На дверях красовалась табличка с названием: ООО&nbsp;Рога и копыта.'", ->
        text.should.eql "На дверях красовалась табличка с названием: ООО&nbsp;Рога и копыта."

    Scenario "Привязка сокращения ГОСТ к номеру", ->
      text = null
      typo = null

      Given "В своей работе они неукоснительно следовали ГОСТ 7.1-2003 и ‎ISO 9001:2008, LVS EN 12368:2000 и LVS 370:2004.", ->
        typo = new mdash("В своей работе они неукоснительно следовали ГОСТ 7.1-2003 и ‎ISO 9001:2008, LVS EN 12368:2000 и LVS 370:2004.", {'*': false})
      When "format", ->
        text = typo.format({'Abbr.nobr_gost': true})
      Then "text should be 'В своей работе они неукоснительно следовали <nobr>ГОСТ 7.1&ndash;2003</nobr> и ‎<nobr>ISO 9001:2008</nobr>, <nobr>LVS EN 12368:2000</nobr> и <nobr>LVS 370:2004</nobr>.'", ->
        text.should.eql "В своей работе они неукоснительно следовали <nobr>ГОСТ 7.1&ndash;2003</nobr> и ‎<nobr>ISO 9001:2008</nobr>, <nobr>LVS EN 12368:2000</nobr> и <nobr>LVS 370:2004</nobr>."


Feature "Dash",
  "Замена символа тире на html конструкцию",
  "Тире после кавычек, скобочек, пунктуации",
  "Тире после переноса строки",
  "Тире после знаков восклицания, троеточия и прочее",
  "Расстановка дефисов между из-за, из-под",
  "Автоматическая простановка дефисов в обезличенных местоимениях и междометиях",
  "Кое-как, кой-кого, все-таки",
  "Расстановка дефисов с частицами ка, де, кась", ->

    Scenario "Замена символа тире на html конструкцию", ->
      text = null
      typo = null

      Given "Замена символа — тире на html конструкцию", ->
        typo = new mdash("Замена символа — тире на html конструкцию", {'*': false})
      When "format", ->
        text = typo.format({'Dash.mdash_symbol_to_html_mdash': true})
      Then "text should be 'Замена символа &mdash; тире на html конструкцию'", ->
        text.should.eql "Замена символа &mdash; тире на html конструкцию"

    Scenario "Тире после кавычек, скобочек, пунктуации", ->
      text = null
      typo = null

      Given "\"Замена символа\" - тире на html конструкцию\n(Замена символа) — тире на html конструкцию\nЗамена символа, — тире на html конструкцию", ->
        typo = new mdash("\"Замена символа\" - тире на html конструкцию\n(Замена символа) — тире на html конструкцию\nЗамена символа, — тире на html конструкцию", {'*': false})
      When "format", ->
        text = typo.format({'Dash.mdash': true})
      Then "text should be '\"Замена символа\"&nbsp;&mdash; тире на html конструкцию\n(Замена символа)&nbsp;&mdash; тире на html конструкцию\nЗамена символа,&nbsp;&mdash; тире на html конструкцию'", ->
        text.should.eql "\"Замена символа\"&nbsp;&mdash; тире на html конструкцию\n(Замена символа)&nbsp;&mdash; тире на html конструкцию\nЗамена символа,&nbsp;&mdash; тире на html конструкцию"

    Scenario "Тире после переноса строки", ->
      text = null
      typo = null

      Given "Замена символа\n- тире на html конструкцию", ->
        typo = new mdash("Замена символа\n- тире на html конструкцию", {'*': false})
      When "format", ->
        text = typo.format({'Dash.mdash_2': true})
      Then "text should be 'Замена символа\n&mdash;&nbsp;тире на html конструкцию'", ->
        text.should.eql "Замена символа\n&mdash;&nbsp;тире на html конструкцию"

    Scenario "Тире после знаков восклицания, троеточия и прочее", ->
      text = null
      typo = null

      Given "Дурак! - сказал один. Сам виноват... - ответил другой", ->
        typo = new mdash("Дурак! - сказал один. Сам виноват... - ответил другой", {'*': false})
      When "format", ->
        text = typo.format({'Dash.mdash_3': true})
      Then "text should be 'Дурак! &mdash;&nbsp;сказал один. Сам виноват... &mdash;&nbsp;ответил другой'", ->
        text.should.eql "Дурак! &mdash;&nbsp;сказал один. Сам виноват... &mdash;&nbsp;ответил другой"

    Scenario "Расстановка дефисов между из-за, из-под", ->
      text = null
      typo = null

      Given "Из за нелепой ошибки, из под стола вылез чёрт.", ->
        typo = new mdash("Из за нелепой ошибки, из под стола вылез чёрт.", {'*': false})
      When "format", ->
        text = typo.format({'Dash.iz_za_pod': true})
      Then "text should be 'Из-за нелепой ошибки, из-под стола вылез чёрт.'", ->
        text.should.eql "Из-за нелепой ошибки, из-под стола вылез чёрт."

    Scenario "Автоматическая простановка дефисов в обезличенных местоимениях и междометиях", ->
      text = null
      typo = null

      Given "Кто то кем то почему то пообедал как то раз.", ->
        typo = new mdash("Кто то кем то почему то пообедал как то раз.", {'*': false})
      When "format", ->
        text = typo.format({'Dash.to_libo_nibud': true})
      Then "text should be 'Кто-то кем-то почему-то пообедал как-то раз.'", ->
        text.should.eql "Кто-то кем-то почему-то пообедал как-то раз."

    Scenario "Кое-как, кой-кого, все-таки", ->
      text = null
      typo = null

      Given "Если кое как у нас кой кого всё таки припрятал...", ->
        typo = new mdash("Если кое как у нас кой кого всё таки припрятал...", {'*': false})
      When "format", ->
        text = typo.format({'Dash.koe_kak': true})
      Then "text should be 'Если кое-как у нас кой-кого всё-таки припрятал...'", ->
        text.should.eql "Если кое-как у нас кой-кого всё-таки припрятал..."

    Scenario "Расстановка дефисов с частицами ка, де, кась", ->
      text = null
      typo = null

      Given "А ну кась взялись ка за вёсла!", ->
        typo = new mdash("А ну кась взялись ка за вёсла!", {'*': false})
      When "format", ->
        text = typo.format({'Dash.ka_de_kas': true})
      Then "text should be 'А ну-кась взялись-ка за вёсла!'", ->
        text.should.eql "А ну-кась взялись-ка за вёсла!"


Feature "Date",
  "Установка тире и пробельных символов в периодах дат",
  "Расстановка тире и объединение в неразрывные периоды месяцев",
  "Расстановка тире и объединение в неразрывные периоды дней",
  "Тире между диапозоном веков",
  "Привязка года к дате",
  "Пробел после года",
  "Пробел после сокращения года", ->

    Scenario "Установка тире и пробельных символов в периодах дат", ->
      text = null
      typo = null

      Given "В период 1941-1945гг.", ->
        typo = new mdash("В период 1941-1945гг.", {'*': false})
      When "format", ->
        text = typo.format({'Date.years': true})
      Then "text should be 'В период 1941&mdash;1945&nbsp;гг.'", ->
        text.should.eql "В период 1941&mdash;1945&nbsp;гг."

    Scenario "Расстановка тире и объединение в неразрывные периоды месяцев", ->
      text = null
      typo = null

      Given "Основной курортный сезон в нашем городе — май-сентябрь.", ->
        typo = new mdash("Основной курортный сезон в нашем городе — май-сентябрь.", {'*': false})
      When "format", ->
        text = typo.format({'Date.mdash_month_interval': true})
      Then "text should be 'Основной курортный сезон в нашем городе — май&mdash;сентябрь.'", ->
        text.should.eql "Основной курортный сезон в нашем городе — май&mdash;сентябрь."

    Scenario "Расстановка тире и объединение в неразрывные периоды дней", ->
      text = null
      typo = null

      Given "1-14 января смотрите во всех кинотеатрах страны.", ->
        typo = new mdash("1-14 января смотрите во всех кинотеатрах страны.", {'*': false})
      When "format", ->
        text = typo.format({'Date.nbsp_and_dash_month_interval': true})
      Then "text should be '<nobr>1&mdash;14 января</nobr> смотрите во всех кинотеатрах страны.'", ->
        text.should.eql "<nobr>1&mdash;14 января</nobr> смотрите во всех кинотеатрах страны."

    Scenario "Привязка года к дате", ->
      text = null
      typo = null

      Given "Замечательный филосов IX-X вв как-то упоминал об этом в своих трудах.", ->
        typo = new mdash("Замечательный филосов IX-X вв как-то упоминал об этом в своих трудах.", {'*': false})
      When "format", ->
        text = typo.format({'Date.century_period': true})
      Then "text should be 'Замечательный филосов <nobr>IX&mdash;X вв.</nobr> как-то упоминал об этом в своих трудах.'", ->
        text.should.eql "Замечательный филосов <nobr>IX&mdash;X вв.</nobr> как-то упоминал об этом в своих трудах."

    Scenario "Привязка года к дате", ->
      text = null
      typo = null

      Given "Заявление было подписано 02.03.2015.", ->
        typo = new mdash("Заявление было подписано 02.03.2015.", {'*': false})
      When "format", ->
        text = typo.format({'Date.nobr_year_in_date': true})
      Then "text should be 'Заявление было подписано <nobr>02.03.2015</nobr>.'", ->
        text.should.eql "Заявление было подписано <nobr>02.03.2015</nobr>."

    Scenario "Пробел после года", ->
      text = null
      typo = null

      Given "С Новым 1982годом!", ->
        typo = new mdash("С Новым 1982годом!", {'*': false})
      When "format", ->
        text = typo.format({'Date.space_posle_goda': true})
      Then "text should be 'С Новым 1982 годом!'", ->
        text.should.eql "С Новым 1982 годом!"

    Scenario "Пробел после сокращения года", ->
      text = null
      typo = null

      Given "Шёл 2015г. от Рождества Христова.", ->
        typo = new mdash("Шёл 2015г. от Рождества Христова.", {'*': false})
      When "format", ->
        text = typo.format({'Date.nbsp_posle_goda_abbr': true})
      Then "text should be 'Шёл 2015&nbsp;г. от Рождества Христова.'", ->
        text.should.eql "Шёл 2015&nbsp;г. от Рождества Христова."


Feature "Etc",
  "Акцент",
  "Надстрочный текст после символа ^",
  "Тире и отмена переноса между диапозоном времени",
  "Удаление nbsp в nobr/nowrap тэгах", ->

    Scenario "Акцент", ->
      text = null
      typo = null

      Given "Ле`туаль", ->
        typo = new mdash("Ле`туаль", {'*': false})
      When "format", ->
        text = typo.format({'Etc.acute_accent': true})
      Then "text should be 'Ле&#769;туаль'", ->
        text.should.eql "Ле&#769;туаль"

    Scenario "Надстрочный текст после символа ^", ->
      text = null
      typo = null

      Given "На площади всего 30 ^m2 умудриться мостроить храм уюта ^*", ->
        typo = new mdash("На площади всего 30 ^m2 умудриться мостроить храм уюта ^*", {'*': false})
      When "format", ->
        text = typo.format({'Etc.word_sup': true})
      Then "text should be 'На площади всего 30<sup><small>m2</small></sup> умудриться мостроить храм уюта<sup><small>*</small></sup>'", ->
        text.should.eql "На площади всего 30<sup><small>m2</small></sup> умудриться мостроить храм уюта<sup><small>*</small></sup>"

    Scenario "Тире и отмена переноса между диапозоном времени", ->
      text = null
      typo = null

      Given "Рабочее время магазина 09:00-18:00 с перерывом на обед.", ->
        typo = new mdash("Рабочее время магазина 09:00-18:00 с перерывом на обед.", {'*': false})
      When "format", ->
        text = typo.format({'Etc.time_interval': true})
      Then "text should be 'Рабочее время магазина <nobr>09:00&mdash;18:00</nobr> с перерывом на обед.'", ->
        text.should.eql "Рабочее время магазина <nobr>09:00&mdash;18:00</nobr> с перерывом на обед."

    Scenario "Тире и отмена переноса между диапозоном времени", ->
      text = null
      typo = null

      Given "В период <nobr>1941-1945&nbsp;гг.</nobr>", ->
        typo = new mdash("В период <nobr>1941-1945&nbsp;гг.</nobr>", {'*': false})
      When "format", ->
        text = typo.format({'Etc.expand_no_nbsp_in_nobr': true})
      Then "text should be 'В период <nobr>1941-1945 гг.</nobr>'", ->
        text.should.eql "В период <nobr>1941-1945 гг.</nobr>"


Feature "Nobr",
  "Привязка союзов и предлогов к написанным после словам",
  "Привязка союзов и предлогов к предыдущим словам в случае конца предложения",
  "Объединение в неразрывные конструкции номеров телефонов",
  "Объединение IP-адресов",
  "Привязка инициалов к фамилиям",
  "Неразрывный пробел перед частицей",
  "Неразрывный пробел в как то",
  "Привязка градусов к числу",
  "Обрамление пятисимвольных слов разделенных дефисом в неразрывные блоки",
  "Отмена переноса слова с дефисом", ->

    Scenario "Привязка союзов и предлогов к написанным после словам", ->
      text = null
      typo = null

      Given "Он шёл в направлении заходящего за горизонт солнца к славному городу Санкт-Петербургу.", ->
        typo = new mdash("Он шёл в направлении заходящего за горизонт солнца к славному городу Санкт-Петербургу.", {'*': false})
      When "format", ->
        text = typo.format({'Nobr.super_nbsp': true})
      Then "text should be 'Он&nbsp;шёл в&nbsp;направлении заходящего за&nbsp;горизонт солнца к&nbsp;славному городу Санкт-Петербургу.'", ->
        text.should.eql "Он&nbsp;шёл в&nbsp;направлении заходящего за&nbsp;горизонт солнца к&nbsp;славному городу Санкт-Петербургу."

    Scenario "Привязка союзов и предлогов к предыдущим словам в случае конца предложения", ->
      text = null
      typo = null

      Given "В воздухе стояло негласное да.", ->
        typo = new mdash("В воздухе стояло негласное да.", {'*': false})
      When "format", ->
        text = typo.format({'Nobr.nbsp_in_the_end': true})
      Then "text should be 'В воздухе стояло негласное&nbsp;да.'", ->
        text.should.eql "В воздухе стояло негласное&nbsp;да."

    Scenario "Объединение в неразрывные конструкции номеров телефонов", ->
      text = null
      typo = null

      Given "Для дополнительной информации звоните по номерам 8 (800) 700-00-10, +7 800 700-00-10, +371 2 970 71 75.", ->
        typo = new mdash("Для дополнительной информации звоните по номерам 8 (800) 700-00-10, +7 800 700-00-10, +371 2 970 71 75.", {'*': false})
      When "format", ->
        text = typo.format({'Nobr.phone_builder': true})
      Then "text should be 'Для дополнительной информации звоните по номерам <nobr>8 (800) 700-00-10</nobr>  <nobr>+7 800 700-00-10</nobr>  <nobr>+371 2 970 71 75</nobr>'", ->
        text.should.eql "Для дополнительной информации звоните по номерам <nobr>8 (800) 700-00-10</nobr>  <nobr>+7 800 700-00-10</nobr>  <nobr>+371 2 970 71 75</nobr>"

    Scenario "Объединение IP-адресов", ->
      text = null
      typo = null

      Given "Адрес маршрутизатора будет 192.168.1.1 в нашей сети, а маска - 255.255.255.0.", ->
        typo = new mdash("Адрес маршрутизатора будет 192.168.1.1 в нашей сети, а маска - 255.255.255.0", {'*': false})
      When "format", ->
        text = typo.format({'Nobr.ip_address': true})
      Then "text should be 'Адрес маршрутизатора будет <nobr>192.168.1.1</nobr> в нашей сети, а маска - <nobr>255.255.255.0</nobr>'", ->
        text.should.eql "Адрес маршрутизатора будет <nobr>192.168.1.1</nobr> в нашей сети, а маска - <nobr>255.255.255.0</nobr>"

    Scenario "Привязка инициалов к фамилиям", ->
      text = null
      typo = null

      Given "На выходных всем читать Пушкина А.С.!", ->
        typo = new mdash("На выходных всем читать Пушкина А.С.!", {'*': false})
      When "format", ->
        text = typo.format({'Nobr.spaces_nobr_in_surname_abbr': true})
      Then "text should be 'На выходных всем читать <nobr>Пушкина А. С.</nobr>!'", ->
        text.should.eql "На выходных всем читать <nobr>Пушкина А. С.</nobr>!"

    Scenario "Неразрывный пробел перед частицей", ->
      text = null
      typo = null

      Given "Это же ерунда какая-то, то ли дело у нас в деревне.", ->
        typo = new mdash("Это же ерунда какая-то, то ли дело у нас в деревне.", {'*': false})
      When "format", ->
        text = typo.format({'Nobr.nbsp_before_particle': true})
      Then "text should be 'Это&nbsp;же ерунда какая-то, то&nbsp;ли дело у нас в деревне.'", ->
        text.should.eql "Это&nbsp;же ерунда какая-то, то&nbsp;ли дело у нас в деревне."

    Scenario "Неразрывный пробел в как то", ->
      text = null
      typo = null

      Given "Разные вкусности, как то: конфеты, пироженые, торты.", ->
        typo = new mdash("Разные вкусности, как то: конфеты, пироженые, торты.", {'*': false})
      When "format", ->
        text = typo.format({'Nobr.nbsp_v_kak_to': true})
      Then "text should be 'Разные вкусности, как&nbsp;то: конфеты, пироженые, торты.'", ->
        text.should.eql "Разные вкусности, как&nbsp;то: конфеты, пироженые, торты."

    Scenario "Привязка градусов к числу", ->
      text = null
      typo = null

      Given "На улице было около 30°C в тени.", ->
        typo = new mdash("На улице было около 30°C в тени.", {'*': false})
      When "format", ->
        text = typo.format({'Nobr.nbsp_celcius': true})
      Then "text should be 'На улице было около 30&nbsp;°C в тени.'", ->
        text.should.eql "На улице было около 30&nbsp;°C в тени."

    Scenario "Обрамление пятисимвольных слов разделенных дефисом в неразрывные блоки", ->
      text = null
      typo = null

      Given "Так-то тик-то тут-та.", ->
        typo = new mdash("Так-то тик-то тут-та.", {'*': false})
      When "format", ->
        text = typo.format({'Nobr.hyphen_nowrap_in_small_words': true})
      Then "text should be '<nobr>Так-то</nobr> <nobr>тик-то</nobr> <nobr>тут-та</nobr>.'", ->
        text.should.eql "<nobr>Так-то</nobr> <nobr>тик-то</nobr> <nobr>тут-та</nobr>."

    Scenario "Отмена переноса слова с дефисом", ->
      text = null
      typo = null

      Given "Чёрно-белое кино ещё долго останется в нашихсердцах-душах.", ->
        typo = new mdash("Чёрно-белое кино ещё долго останется в нашихсердцах-душах.", {'*': false})
      When "format", ->
        text = typo.format({'Nobr.hyphen_nowrap': true})
      Then "text should be '<nobr>Чёрно-белое</nobr> кино ещё долго останется в <nobr>нашихсердцах-душах</nobr>.'", ->
        text.should.eql "<nobr>Чёрно-белое</nobr> кино ещё долго останется в <nobr>нашихсердцах-душах</nobr>."

