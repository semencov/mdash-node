###
mdash
https://github.com/semencov/mdash-node

Copyright (c) 2015 Yuri Sementsov
Licensed under the MIT license.
###

'use strict'

path = require 'path'
fs = require 'fs'

Lib = require './lib'

settingsFile = path.join process.cwd(), ".mdash"
tretsDir = path.join __dirname, './trets'

readFile = (filepath) ->
  contents = undefined
  result = undefined
  try
    contents = fs.readFileSync(String(filepath))
    try
      result = JSON.parse(contents)
    catch e
      return {}
    return result
  catch e
    return {}



module.exports = class Mdash

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
    self = @

    if typeof text is 'object'
      options = text
      text = null

    options = Lib.merge readFile(settingsFile), options

    @inited = false
    @text = text

    @trets = {}
    @tretsOrder = []

    fs.readdirSync(tretsDir).forEach (file) ->
      try
        tret = require "#{tretsDir}/#{file}"
        if tret.__super__.constructor.name is 'Tret'
          name = tret::constructor.name
          unless self.trets[name]?
            self.trets[name] = new tret()
            self.tretsOrder.push name
      catch e

    @tretsOrder.sort (a, b) ->
      self.trets[a].order - self.trets[b].order

    @settings = {}
    @blocks = []

    @setup options  if options? and typeof options is 'object'
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
    @tretsOrder

  getRuleNames: (mask) ->
    self = @
    result = {}

    tretNames = @getTretNames()
    for tret in tretNames
      ruleNames = @trets[tret].getRuleNames()
      result[tret] = ruleNames

    if mask then Lib.selectRules(mask, result) else result

  getSettings: () ->
    @settings

  getRuleSettings: () ->
    settings = {}

    ruleNames = @getRuleNames()

    for selector, value of @settings
      ruleList = Lib.selectRules selector, ruleNames

      for tret, rules of ruleList
        settings[tret] = {}  if not settings[tret]?
        for rule in rules
          settings[tret][rule] = (if settings[tret][rule]? then Lib.merge(settings[tret][rule], value) else value)
    settings



  ###
   * Установить настройки
   *
   * @param array $setupmap
  ###
  setup: (options={}) ->
    @settings = Lib.merge Lib.processSettings(@presets), @settings
    options = Lib.processSettings(options, @presets)


    for selector, value of options
      if value['disabled']?
        for k, v of @settings
          if selector isnt "*" and new RegExp("^#{selector}\.?", 'i').test(k) and v['disabled']?
            if Object.keys(v).length is 1
              delete @settings[k]
            else
              @settings[k]['disabled'] = value['disabled']

      value = Lib.merge(@settings[selector] or {}, value) or {}
      @settings[selector] = value   if Object.keys(value).length > 0

    @init()  if not @inited
    return


  init: () ->
    self = @

    if not @inited
      @blocks.push Lib.addSafeBlock 'pre'
      @blocks.push Lib.addSafeBlock 'code'
      @blocks.push Lib.addSafeBlock 'script'
      @blocks.push Lib.addSafeBlock 'style'
      @blocks.push Lib.addSafeBlock 'notg'
      @blocks.push Lib.addSafeBlock 'span-notg', ['<span class="_notg_start"></span>', '<span class="_notg_end"></span>']

    @inited = true
    return
  
  ###
   * Prepare text before applying rules:
   * - encrypt HTML tags
   * - encrypt content inside safe tags
   * - normilize special chars and entities
  ###
  beforeFormat: (text) ->
    throw new Error("Text is undefined")  if not text?

    text = Lib.processSafeBlocks text, @blocks, Lib.encode
    text = Lib.processTags text, Lib.encode
    text = Lib.clearSpecialChars text
    text.trim()

  ###
   * Clean text after applying rules:
   * - decrypt HTML tags
   * - decript content in safe tags
  ###
  afterFormat: (text) ->
    throw new Error("Text is undefined after format")  if not text?

    text = Lib.decodeInternalBlocks text
    text = Lib.convertEntitiesToUnicode text  if @isOn('dounicode')
    text = Lib.processTags text, Lib.decode
    text = Lib.processSafeBlocks text, @blocks, Lib.decode, true

    if not @disable_notg_replace
      repl = ['<span class="_notg_start"></span>', '<span class="_notg_end"></span>']
      repl = ""  if @remove_notg
      text = text.replace(['<notg>','</notg>'], repl)

    text.trim()


  ###
   * Запустить типограф на выполнение
   *
  ###
  format: () ->
    err = null
    args = [].slice.apply arguments

    callback = if typeof args[-1..][0] is 'function' then args.pop() else null
    options = if typeof args[-1..][0] is 'object' then args.pop() else null
    text = if typeof args[-1..][0] is 'string' then args.pop() else null

    try
      @setText(text)   if text?
      @setup(options)  if options? and typeof options is 'object'
      
      @text = @beforeFormat @text

      settings = @getRuleSettings()

      for tretName in @tretsOrder
        tretObj = @trets[tretName]
        @text = tretObj.apply @text, settings[tretName]

      @text = @afterFormat @text

    catch e
      err = e

    if callback? and typeof callback is 'function'
      callback err, @text
    else
      @text


  getStyles: @getStyles = (list=false) ->
    Lib.styles(list)

  ###
   * Установить режим разметки,
   *   Lib.LAYOUT_STYLE - с помощью стилей
   *   Lib.LAYOUT_CLASS - с помощью классов
   *   Lib.LAYOUT_STYLE|Lib.LAYOUT_CLASS - оба метода
   *
   * @param int $layout
  ###
  setLayout: @setLayout = (layout=Lib.LAYOUT_STYLE) ->
    Lib.LAYOUT = layout
  
  ###
   * Установить префикс для классов
   *
   * @param string|bool $prefix если true то префикс 'mdash_', иначе то, что передали
  ###
  setLayoutClassPrefix: @setLayoutClassPrefix = (prefix) ->
    Lib.LAYOUT_CLASS_PREFIX = prefix  if prefix?


  ###
   * Запустить типограф
   *
   * @param string $text
   * @param array $options
   * @return string
  ###
  @format: () ->
    args = [].slice.apply arguments

    inst = new this()
    inst.format.apply(inst, args)

  @getTretNames: (short=true) ->
    @::getTretNames(short)

  @getRuleNames: (mask) ->
    @::getRuleNames(mask)

  @LAYOUT_STYLE: Lib.LAYOUT_STYLE
  @LAYOUT_CLASS: Lib.LAYOUT_CLASS
