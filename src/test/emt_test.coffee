'use strict'

emt = require '../lib/emt.js'

###
======== A Handy Little Mocha Reference ========
https://github.com/visionmedia/should.js
https://github.com/visionmedia/mocha

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

describe 'Awesome', ()->
  describe '#of()', ()->

    it "...Когда В.И.Пупкин увидел в газете ( это была &quot;Газета \"Сермяжная правда\"&quot; №45) рубрику <a>Weather</a>&copy; Forecast(r), он <span>не поверил</span> своим <span=\"test_class\">глазам</span> - температуру обещали +-451F.<p>\"Мы недавно приобрели новый монитор \"Самсунг\" с диагональю 27 дюймов&quot;</p><p>\"Эдиториум.ру\" - сайт, созданный по материалам сборника \"О редактировании и редакторах\" Аркадия Эммануиловича Мильчина, который с 1944 года коллекционировал выдержки из статей, рассказов, фельетонов, пародий, писем и книг, где так или иначе затрагивается тема редакторской работы. Эта коллекция легла в основу обширной антологии, представляющей историю и природу редактирования в первоисточниках.", ()->
      emt.awesome().should.eql('<p>&hellip;Когда <nobr>В. И. Пупкин</nobr> увидел в&nbsp;газете<span style="margin-right:0.3em;"> </span><span style="margin-left:-0.3em;">(</span>это была<span style="margin-right:0.44em;"> </span><span style="margin-left:-0.44em;">&laquo;</span>Газета &bdquo;Сермяжная правда&ldquo;&raquo; &#8470;&thinsp;45) рубрику <a>Weather</a>&copy;&nbsp;Forecast&reg;, он <span>не&nbsp;поверил</span> своим <span=\"test_class\">глазам</span>&nbsp;&mdash; температуру обещали &plusmn;<nobr>451 &deg;F</nobr>.</p>
<p><span style="margin-left:-0.44em;">&laquo;</span>Мы&nbsp;недавно приобрели новый монитор &bdquo;Самсунг&ldquo; с&nbsp;диагональю 27 дюймов&raquo;</p>
<p><p><span style="margin-left:-0.44em;">&laquo;</span>Эдиториум.ру&raquo;&nbsp;&mdash; сайт<span style="margin-right:-0.2em;">,</span><span style="margin-left:0.2em;"> </span>созданный по&nbsp;материалам сборника<span style="margin-right:0.44em;"> </span><span style="margin-left:-0.44em;">&laquo;</span>О&nbsp;редактировании и&nbsp;редакторах&raquo; Аркадия Эммануиловича Мильчина<span style="margin-right:-0.2em;">,</span><span style="margin-left:0.2em;"> </span>который с&nbsp;1944 года коллекционировал выдержки из&nbsp;статей<span style="margin-right:-0.2em;">,</span><span style="margin-left:0.2em;"> </span>рассказов<span style="margin-right:-0.2em;">,</span><span style="margin-left:0.2em;"> </span>фельетонов<span style="margin-right:-0.2em;">,</span><span style="margin-left:0.2em;"> </span>пародий<span style="margin-right:-0.2em;">,</span><span style="margin-left:0.2em;"> </span>писем и&nbsp;книг<span style="margin-right:-0.2em;">,</span><span style="margin-left:0.2em;"> </span>где так или иначе затрагивается тема редакторской работы. Эта коллекция легла в&nbsp;основу обширной антологии<span style="margin-right:-0.2em;">,</span><span style="margin-left:0.2em;"> </span>представляющей историю и&nbsp;природу редактирования в&nbsp;первоисточниках.</p>')

