path = require 'path'
fs = require 'fs'
_ = require('underscore')._

###
* Evgeny Muravjev Typograph, http://mdash.ru
* Version: 3.0 Gold Master
* Release Date: September 28, 2013
* Authors: Evgeny Muravjev & Alexander Drutsa
###

process.on 'uncaughtException', (error) ->
  console.log "=[uncaughtException]====================================================="
  console.error error
  console.log error.stack
  console.log "========================================================================="

log = (str, data=null) ->
  console.log("LOG\t #{@constructor.name}\t\t\t", str, data)  if @DEBUG
  return

error = (info, data=null) ->
  console.error("ERROR\t #{@constructor.name}\t\t\t", info, data)  if @DEBUG
  return

debug = (obj, place, after_text, after_text_raw="") ->
  console.info("DEBUG\t #{@constructor.name}\t\t\t", place)  if @DEBUG
  return


class Mdash
  text: null
  trets: {}
  
  all_options:
    'Quote':    
      no_bdquotes : true    # Внутренние кавычки-лапки
      no_inches   : true    # Расстановка дюйма после числа
    
    'Nobr.nowrap':
      disabled : false
      selector : '*'
      nowrap   : true       # Nobr (по умолчанию) & nowrap
    
    'Space.clear_before_after_punct':     # Удаление пробелов перед и после знаков препинания в предложении
      selector    : 'Space.remove_space_before_punctuationmarks'
    'Space.autospace_after':            # Расстановка пробелов после знаков препинания
      selector    : 'Space.autospace_after_*'
    'Space.bracket_fix':              # Удаление пробелов внутри скобок, а также расстановка пробела перед скобками
      selector    : ['Space.nbsp_before_open_quote', 'Punctmark.fix_brackets']
        
    'OptAlign.layout':
      selector: 'OptAlign'
      description : 'Inline стили или CSS'
    
    'Etc.unicode_convert':
      selector  : '*'
      dounicode : true      # Преобразовывать html-сущности в юникод
      disabled  : true
  
 
  constructor: (text, options={}) ->
    @DEBUG = false

    if typeof text is 'object'
      options = text
      text = null

    mdashrc = process.cwd() + "/.mdash"
    options = _.extend (Mdash.Lib.readJSON(mdashrc) or Mdash.Lib.readYAML(mdashrc) or {}), options

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
   * Добавление защищенного блока
   *
   * <code>
   *  Jare_Typograph_Tool::addCustomBlocks('<span>', '</span>');
   *  Jare_Typograph_Tool::addCustomBlocks('\<nobr\>', '\<\/span\>', true);
   * </code>
   * 
   * @param   string $id идентификатор
   * @param   string $open начало блока
   * @param   string $close конец защищенного блока
   * @param   string $tag тэг
   * @return  void
  ###
  push_safe_block: (id, open, close, tag) ->
    @blocks.push {id: id, tag: tag, open: open, close: close}
    return
    
  ###
   * Список защищенных блоков
   *
   * @return  array
  ###
  get_allsafe_blocks: () -> @blocks
    
  ###
   * Удаленного блока по его номеру ключа
   *
   * @param   string $id идентифиактор защищённого блока 
   * @return  void
  ###
  remove_safe_block: (id) ->
    for k, block of @blocks
      delete @blocks[k]  if block.id is id
    return
    
    
  ###
   * Добавление защищенного блока
   *
   * @param   string $tag тэг, который должен быть защищён
   * @return  void
  ###
  add_safe_tag: (tag) ->
    open = Mdash.Lib.preg_quote("<#{tag}", '/') + "[^>]*?" + Mdash.Lib.preg_quote(">", '/')
    close = Mdash.Lib.preg_quote("</#{tag}>", '/')
    @push_safe_block(tag, open, close, tag)
    return true
    
  ###
   * Добавление защищенного блока
   *
   * @param   string $open начало блока
   * @param   string $close конец защищенного блока
   * @param   bool $quoted специальные символы в начале и конце блока экранированы
   * @return  void
  ###
  add_safe_block: (id, open, close, quoted=false) ->
    open = open.trim()
    close = close.trim()
    
    return false  if not open? or not close?
    
    if quoted is false
      open = Mdash.Lib.preg_quote(open, '/')
      close = Mdash.Lib.preg_quote(close, '/')
    
    @push_safe_block id, open, close, ""
    return true
    
  ###
   * Сохранение содержимого защищенных блоков
   *
   * @param   string $text
   * @param   bool $safe если true, то содержимое блоков будет сохранено, иначе - раскодировано. 
   * @return  string
  ###
  safe_blocks: (text, way) ->
    if @blocks.length
      safeblocks = if way is true then @blocks else @blocks.reverse()

      for block in safeblocks
        pattern = new RegExp "(#{block.open})((?:.|\\n|\\r)*?)(#{block.close})", "ig"
        text = text.replace pattern, ($0, $1, $2, $3) ->
          $1 + (if way is true then Mdash.Lib.encrypt_tag($2) else Mdash.Lib.decrypt_tag($2)) + $3

    return text
    
  ###
   * Декодирование блоков, которые были скрыты в момент типографирования
   *
   * @param   string $text
   * @return  string
  ###
  # decode_internal_blocks: (text) ->
  #   Mdash.Lib.decode_internal_blocks(text)
  

  create_object: (tret) ->
    tret = @get_short_tret(tret)  if typeof tret is 'string'
    obj = if typeof tret is 'string' then new Mdash.Tret[tret]() else new tret()

    if not obj?
      error("Класс #{tret} не найден. Пожалуйста, подргузите нужный файл.")
      return
    
    obj.DEBUG = @DEBUG
    obj
  
  get_short_tret: (tretName) ->
    if m = tretName.match(/^Mdash\.Tret\.([a-zA-Z0-9_]+)$/)
      return m[1]
    return tretName
  
  
  ###
   * Получаем ТРЕТ по идентификатору, т.е. заванию класса
   *
   * @param unknown_type $name
  ###
  getTret: (name) ->
    return @tret_objects[name]  if @tret_objects[name]?

    for tret in @getTretNames()
      if tret is name
        @init()
        return @tret_objects[name]

      if @get_short_tret(tret) is name
        @init()
        return @tret_objects[tret]

    error("Трэт с идентификатором #{name} не найден")
    return false
  
  ###
   * Задаём текст для применения типографа
   *
   * @param string $text
  ###
  setText: (text) ->
    @text = text
  
  
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
      tretObj = @getTret(tret)
      arr = tretObj.classes
      continue  if not _.isArray arr

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
   * Установить режим разметки,
   *   Mdash.Lib.LAYOUT_STYLE - с помощью стилей
   *   Mdash.Lib.LAYOUT_CLASS - с помощью классов
   *   Mdash.Lib.LAYOUT_STYLE|Mdash.Lib.LAYOUT_CLASS - оба метода
   *
   * @param int $layout
  ###
  set_tag_layout: (layout=Mdash.Lib.LAYOUT_STYLE) ->
    @use_layout = layout
    @use_layout_set = true
  
  ###
   * Установить префикс для классов
   *
   * @param string|bool $prefix если true то префикс 'mdash_', иначе то, что передали
  ###
  set_class_layout_prefix: (prefix) ->
    @class_layout_prefix = if prefix? then "mdash_" else prefix
  
  ###
   * Установлена ли настройка
   *
   * @param string $key
  ###
  is_on: (key) ->
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

    if mask then @selectRules(mask, result) else result

  getSettings: () ->
    @settings

  getTret: (name) ->
    @rules[name]  if @rules[name]?
    return

  selectRules: (mask="*", rules=@getRuleNames()) ->
    selected = {}
    mask = [mask]  if _.isString mask

    for m in mask
      m = m.split(".")
      name = m[0]
      pattern = Mdash.Lib.processSelectorPattern(name)

      Object.keys(rules).map (key) ->
        selected[key] = rules[key]  if key.match pattern
        return

      selected[name] = @selectRules(m.slice(1).join("."), rules[name])  if m.length > 1 and selected[name]?
    selected
  
  prepareSettings: (options={}, defaults={}) ->
    return options if typeof options isnt 'object'

    settings = {}

    for selector, value of options
      value = true   if "#{value}".toLowerCase() in ["on", "true", "1", "direct"]
      value = false  if "#{value}".toLowerCase() in ["off", "false", "0"]
      value = {disabled: (value is false)}  if typeof value is 'boolean'

      if typeof value is 'object'
        if defaults[selector]? and typeof defaults[selector] is 'object'
          # TODO: remove undescore
          value = _.defaults _.omit(value, 'selector'), _.omit(defaults[selector], 'disabled')

        if 'description' of value
          delete value['description']

        if 'hide' of value
          delete value['hide']

        if 'setting' of value
          value[value.setting] = true
          delete value['setting']

        if 'disabled' not of value and Object.keys(value).length is 0
          value.disabled = false

        if 'selector' of value
          continue  if Object.keys(value).length is 1

          value.selector = [value.selector]  if typeof value.selector is 'string'
          val = _.omit(value, 'selector')

          if Object.keys(value).length > 2
            if value['disabled'] is true
              continue
            else
              val = _.omit(val, 'disabled')

          for select in value.selector
            settings[select] = _.extend {}, val, settings[select]
          continue

        value = _.omit(value, 'selector')

      settings[selector] = _.extend {}, value, settings[selector]
    settings


  init: () ->
    for tret in @getTretNames()
      @trets[tret] = new Mdash.Tret[tret](@settings[tret])  unless @trets[tret]?
    
    if not @inited
      @add_safe_tag('pre')
      @add_safe_tag('code')
      @add_safe_tag('script')
      @add_safe_tag('style')
      @add_safe_tag('notg')
      @add_safe_block('span-notg', '<span class="_notg_start"></span>', '<span class="_notg_end"></span>')

    @inited = true
    return
  
  ###
   * Установить настройки
   *
   * @param array $setupmap
  ###
  setup: (options={}) ->
    @settings = @prepareSettings(@all_options)
    options = @prepareSettings(options, @all_options)

    for selector, value of options
      value = _.defaults(value, (@settings[selector] or {})) or {}
      @settings[selector] = value   if _.size(value) > 0

    @init()  if not @inited
    
    for selector, value of @settings
      ruleList = @selectRules selector

      for tret, rules of ruleList
        tretObj = @trets[tret]
        settings = {}

        settings[rule] = value  for rule of rules



      #   tretShort = @get_short_tret(tret)
      #   tretObj = @getTret(tret)

      #   for rule of tretObj.rules
      #     if ruleList[tret]?[rule]? or ruleList[tretShort]?[rule]?
      #       if value? and _.isObject(value)
      #         for key, val of value

      #           if key is "disabled" and val is true
      #             tretObj.disable_rule(rule)
                  
      #             log "setup() | Правило #{tret}.#{rule} отключено"
                
      #           if key is "enabled" and val is true
      #             tretObj.enable_rule(rule)
                  
      #             log "setup() | Правило #{tret}.#{rule} включено"

      #           if key not in ["disabled", "enabled"]
      #             tretObj.set_rule(rule, key, val)
      #             tretObj.set(key, val)  if selector.match /([a-z0-9_\-\.]*)?(\*)/i

      #             log "setup() | Параметр '#{key}: #{val}' установлен для правила #{tret}.#{rule}"

      #   @tret_objects[tret] = tretObj


    return

  ###
   * Запустить типограф на выполнение
   *
  ###
  format: (text, options=null) ->
    @setText(text)  if text?
    @setup(options)  if options?
    
    
    @text = @safe_blocks(@text, true)
    debug(this, 'safe_blocks', @text)

    @text = Mdash.Lib.safe_tag_chars(@text, true)
    debug(this, 'safe_tag_chars', @text)
    
    @text = Mdash.Lib.clear_special_chars(@text)
    debug(this, 'clear_special_chars', @text)

    for tret in @getTretNames()
      # // если установлен режим разметки тэгов то выставим его
      @tret_objects[tret].set_tag_layout_ifnotset(@use_layout)           if @use_layout_set
      @tret_objects[tret].set_class_layout_prefix(@class_layout_prefix)  if @class_layout_prefix
      
      # // влючаем, если нужно
      @tret_objects[tret].DEBUG = @DEBUG

      # // применяем трэт
      @tret_objects[tret].setText(@text)
      @text = @tret_objects[tret].apply()

    @text = Mdash.Lib.decode_internal_blocks(@text)
    debug(this, 'decode_internal_blocks', @text)
    
    if @is_on('dounicode')
      Mdash.Lib.convert_html_entities_to_unicode(@text)
    
    @text = Mdash.Lib.safe_tag_chars(@text, false)
    debug(this, 'unsafe_tag_chars', @text)
    
    @text = @safe_blocks(@text, false)
    debug(this, 'unsafe_blocks', @text)
    
    if not @disable_notg_replace
      repl = ['<span class="_notg_start"></span>', '<span class="_notg_end"></span>']
      repl = ""  if @remove_notg
      @text = @text.replace(['<notg>','</notg>'], repl)

    @text.trim()

  ###
   * Запустить типограф со стандартными параметрами
   *
   * @param string $text
   * @param array $options
   * @return string
  ###
  @format: (text, options={}) ->
    obj = new this(text, options)
    obj.format()

  @getTretNames: (short=true) ->
    @::getTretNames(short)

  @getRuleNames: (mask) ->
    @::getRuleNames(mask)


module.exports = Mdash