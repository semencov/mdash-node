###

mdash
https://github.com/semencov/mdash-node

Copyright (c) 2015 Yuri Sementsov
Licensed under the MIT license.

###

'use strict'

path = require 'path'
fs = require 'fs'
_ = require('underscore')._

colors = require('colors')

mdashrc = path.join process.cwd(), ".mdash"

process.on 'uncaughtException', (error) ->
  console.log "=[uncaughtException]====================================================="
  console.error error
  console.log error.stack
  console.log "========================================================================="

debug = (obj, place, after_text, after_text_raw="") ->
  console.info("DEBUG\t #{obj.constructor.name}\t\t\t", place)
  return

extend = (object, properties) ->
  for key, val of properties
    object[key] = val
  object

merge = (options, overrides) ->
  extend (extend {}, options), overrides

readFile = (filepath) ->
  contents = undefined
  result = undefined
  try
    contents = fs.readFileSync(String(filepath))
    try
      result = JSON.parse(contents)
      console.log "FILE\tFound .mdash file with settings.\n".blue, result
    catch e
      console.log "ERROR\t".bold.red, e
      return
    return result
  catch e
    return
  return



module.exports = class Mdash
  text: null
  trets: {}
  
  presets:
    'Quote':    
      no_bdquotes : false    # Внутренние кавычки-лапки
      no_inches   : false    # Расстановка дюйма после числа
    
    'OptAlign':
      disabled: true
    'Text':
      disabled: true
    'Dash.ka_de_kas':
      disabled: true
    'Date.mdash_month_interval':
      disabled: true
    'Date.nbsp_and_dash_month_interval':
      disabled: true
    'Nobr.hyphen_nowrap_in_small_words':
      disabled: true
    'Nobr.hyphen_nowrap':
      disabled: true
    'Punctmark.dot_on_end':
      disabled: true

    'Space.clear_before_after_punct':     # Удаление пробелов перед и после знаков препинания в предложении
      selector    : 'Space.remove_space_before_punctuationmarks'
    'Space.autospace_after':            # Расстановка пробелов после знаков препинания
      selector    : 'Space.autospace_after_*'
    'Space.bracket_fix':              # Удаление пробелов внутри скобок, а также расстановка пробела перед скобками
      selector    : ['Space.nbsp_before_open_quote', 'Punctmark.fix_brackets']
        
    'Etc.unicode':
      selector  : '*'
      dounicode : true      # Преобразовывать html-сущности в юникод
      disabled  : true
 
  constructor: (text, options={}) ->
    if typeof text is 'object'
      options = text
      text = null

    options = merge (readFile(mdashrc) or {}), options

    @inited = false
    @text = text
    
    @use_layout = false
    @class_layout_prefix = false
    @use_layout_set = false
    @disable_notg_replace = false
    @remove_notg = false
    
    @settings = {}
    @blocks = []

    @setup options
    return

  
  ###
   * Задаём текст для применения типографа
   *
   * @param string $text
  ###
  setText: (text) ->
    @text = text
  
  ###
   * Установлена ли настройка
   *
   * @param string $key
  ###
  isOn: (key) ->
    return false  if not @settings["*"]?[key]?
    "#{@settings["*"][key]}".toLowerCase() in ["on", "true", "1", "direct"]

  getTretNames: () ->
    Object.keys(Mdash.Tret)
      .filter (tret) ->
        Mdash.Tret[tret].__super__ is Mdash.Tret::

  getRuleNames: (mask) ->
    self = @
    result = {}

    for tret in @getTretNames()
      result[tret] = {}
      Object.keys(Mdash.Tret[tret]::rules or {})
        .map (name) ->
          rule = Mdash.Tret[tret]::rules[name]
          result[tret][name] = (rule.disabled isnt true or rule.enabled is true)
          return

    if mask then Mdash.Lib.selectRules(mask, result) else result

  getSettings: () ->
    @settings


  ###
   * Установить настройки
   *
   * @param array $setupmap
  ###
  setup: (options={}) ->
    @settings = Mdash.Lib.processSettings(@presets)
    options = Mdash.Lib.processSettings(options, @presets)

    for selector, value of options
      value = merge(@settings[selector] or {}, value) or {}
      @settings[selector] = value   if Object.keys(value).length > 0

    settings = {}

    for selector, value of @settings
      ruleList = Mdash.Lib.selectRules selector, @getRuleNames()

      for tret, rules of ruleList
        settings[tret] = {}  if not settings[tret]?
        for rule, val of rules
          if (value['disabled']) or settings[tret][rule]?['disabled']
            settings[tret][rule] = {disabled: true}
          else
            settings[tret][rule] = (if settings[tret][rule]? then merge(settings[tret][rule], value) else value)
      settings

    @init()  if not @inited
    @trets[tret].set opts  for tret, opts of settings
      
    return


  init: () ->
    for tret in @getTretNames()
      @trets[tret] = new Mdash.Tret[tret](@settings[tret])  unless @trets[tret]?
    
    if not @inited
      @blocks.push Mdash.Lib.addSafeBlock 'pre'
      @blocks.push Mdash.Lib.addSafeBlock 'code'
      @blocks.push Mdash.Lib.addSafeBlock 'script'
      @blocks.push Mdash.Lib.addSafeBlock 'style'
      @blocks.push Mdash.Lib.addSafeBlock 'notg'
      @blocks.push Mdash.Lib.addSafeBlock 'span-notg', ['<span class="_notg_start"></span>', '<span class="_notg_end"></span>']

    @inited = true
    return
  
  ###
   * Prepare text before applying rules:
   * - encrypt HTML tags
   * - encrypt content inside safe tags
   * - normilize special chars and entities
  ###
  beforeFormat: (text) ->
    text = Mdash.Lib.processSafeBlocks text, @blocks, Mdash.Lib.encode
    text = Mdash.Lib.processTags text, Mdash.Lib.encode
    text = Mdash.Lib.clearSpecialChars text
    text.trim()

  ###
   * Clean text after applying rules:
   * - decrypt HTML tags
   * - decript content in safe tags
  ###
  afterFormat: (text) ->
    text = Mdash.Lib.decodeInternalBlocks text
    text = Mdash.Lib.convertEntitiesToUnicode text  if @isOn('dounicode')
    text = Mdash.Lib.processTags text, Mdash.Lib.decode
    text = Mdash.Lib.processSafeBlocks text, @blocks, Mdash.Lib.decode, true

    if not @disable_notg_replace
      repl = ['<span class="_notg_start"></span>', '<span class="_notg_end"></span>']
      repl = ""  if @remove_notg
      text = text.replace(['<notg>','</notg>'], repl)

    text.trim()


  ###
   * Запустить типограф на выполнение
   *
  ###
  format: (text, options, callback) ->
    @setText(text)   if text?
    @setup(options)  if options? and typeof options is 'object'
    
    @text = @beforeFormat @text
    @text = tretObj.apply @text  for tretName, tretObj of @trets
    @text = @afterFormat @text

    @text


  ###
   * Получить содержимое <style></style> при использовании классов
   * 
   * @param bool $list false - вернуть в виде строки для style или как массив
   * @param bool $compact не выводить пустые классы
   * @return string|array
  ###
  getStyle: (list=false, compact=false) ->
    res = {}
    for tret in @getTretNames()
      tretObj = @trets[tret]
      arr = tretObj.classes
      continue  if not Array.isArray arr

      for classname, str of arr
        continue  if compact and not str
        clsname = (if @class_layout_prefix then @class_layout_prefix else "" ) + (if @tret_objects[tret].class_names[classname]? then @tret_objects[tret].class_names[classname] else classname)
        res[clsname] = str

    return res  if list
    str = ""

    for k, v of res
      str += ".#{k} { #{v} }\n"
    return str

  ###
   * Запустить типограф со стандартными параметрами
   *
   * @param string $text
   * @param array $options
   * @return string
  ###
  @format: (text, options={}, callback) ->
    obj = new this(text, options)
    obj.format()

  @getTretNames: (short=true) ->
    @::getTretNames(short)

  @getRuleNames: (mask) ->
    @::getRuleNames(mask)

  ###
   * Установить режим разметки,
   *   Mdash.Lib.LAYOUT_STYLE - с помощью стилей
   *   Mdash.Lib.LAYOUT_CLASS - с помощью классов
   *   Mdash.Lib.LAYOUT_STYLE|Mdash.Lib.LAYOUT_CLASS - оба метода
   *
   * @param int $layout
  ###
  @setLayout: (layout=Mdash.Lib.LAYOUT_STYLE) ->
    Mdash.Lib.layout = layout
  
  ###
   * Установить префикс для классов
   *
   * @param string|bool $prefix если true то префикс 'mdash_', иначе то, что передали
  ###
  @setLayoutClassPrefix: (prefix) ->
    Mdash.Lib.layoutClassPrefix = if not prefix? then "mdash-" else prefix

  @getStyles: () ->
