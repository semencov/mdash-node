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

EMTLib = require "./emt/lib"
tret = require "./emt/tret"

###
 * Основной класс типографа Евгения Муравьёва
 * реализует основные методы запуска и рабыоты типографа
 *
###
class EMTBase
  _text: ""
  inited: false

  ###
   * Список Трэтов, которые надо применить к типогрфированию
   *
   * @var array
  ###
  trets: []
  trets_index: []
  tret_objects: []

  ok: false
  debug_enabled: false
  logging: false
  logs: []
  errors: []
  debug_info: []
  
  use_layout: false
  class_layout_prefix: false
  use_layout_set: false
  disable_notg_replace: false
  remove_notg: false
  
  settings: {}

  log: (str, data=null) ->
    return  if not @logging
    @logs.push {class: '', info: str, data: data}
    return
  
  tret_log: (tret, str, data=null) ->
    @logs.push {class: tret, info: str, data: data}
    return
    
  error: (info, data=null) ->
    @errors.push {class: '', info: info, data: data}
    @log "ERROR #{info}", data
    return
  
  tret_error: (tret, info, data=null) ->
    @errors.push {class: tret, info: info, data: data}
    return
  
  debug: (obj, place, after_text, after_text_raw="") ->
    return  if not @debug_enabled
    @debug_info.push
      tret: if obj is this then false else true
      class: if typeof obj is 'object' then obj.constructor.name else obj
      place: place
      text: after_text
      text_raw: after_text_raw
    return
  
  _safe_blocks: []
  
  
  ###
   * Включить режим отладки, чтобы посмотреть последовательность вызовов
   * третов и правил после
   *
  ###
  debug_on: ->
    @debug_enabled = true
  
  ###
   * Включить режим отладки, чтобы посмотреть последовательность вызовов
   * третов и правил после
   *
  ###
  log_on: () ->
    @logging = true
  
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
  _add_safe_block: (id, open, close, tag) ->
    @_safe_blocks.push {id: id, tag: tag, open: open, close: close}
    return
    
  ###
   * Список защищенных блоков
   *
   * @return  array
  ###
  get_all_safe_blocks: () -> @_safe_blocks
    
  ###
   * Удаленного блока по его номеру ключа
   *
   * @param   string $id идентифиактор защищённого блока 
   * @return  void
  ###
  remove_safe_block: (id) ->
    for k, block of @_safe_blocks
      delete @_safe_blocks[k]  if block.id is id
    return
    
    
  ###
   * Добавление защищенного блока
   *
   * @param   string $tag тэг, который должен быть защищён
   * @return  void
  ###
  add_safe_tag: (tag) ->
    open = EMTLib.preg_quote("<", '/') + "#{tag}[^>]*?" +  EMTLib.preg_quote(">", '/')
    close = EMTLib.preg_quote("</#{tag}>", '/')
    @_add_safe_block(tag, open, close, tag)
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
      open = EMTLib.preg_quote(open, '/')
      close = EMTLib.preg_quote(close, '/')
    
    @_add_safe_block id, open, close, ""
    return true
    
  ###
   * Сохранение содержимого защищенных блоков
   *
   * @param   string $text
   * @param   bool $safe если true, то содержимое блоков будет сохранено, иначе - раскодировано. 
   * @return  string
  ###
  safe_blocks: (text, way, show=true) ->
    if @_safe_blocks.length
      safeblocks = if way is true then @_safe_blocks else @_safe_blocks.reverse()

      for block in safeblocks
        text = text.replace new RegExp("({#{block.open}})(.+?)({#{block.close}})", 'g'), (match, m1, m2, m3) ->
          m1 + (if way is true then EMTLib.encrypt_tag(m2) else EMTLib.decrypt_tag(m2)) + m3

    return text
    
  ###
   * Декодирование блоков, которые были скрыты в момент типографирования
   *
   * @param   string $text
   * @return  string
  ###
  decode_internal_blocks: (text) ->
    EMTLib.decode_internal_blocks(text)
  
  create_object: (tret) ->
    tretObj = null
    if typeof tret is 'string'
      try
        eval "tret = #{tret}"
      catch e

    if !tretObj?
      if m = tret.match(/^EMTret([a-zA-Z0-9_]+)$/)
        tname = m[1]
        fname = tname.replace "_", " "
        # fname = fname.replace /^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, ($1) -> $1.toUpperCase()
        fname = fname.toLowerCase()
        fname = fname.replace " ", "."

        tretObj = require "./emt/trets/#{fname}.js"

    if not tretObj?
      @error("Класс #{tret} не найден. Пожалуйста, подргузите нужный файл.")
      return
    
    obj = new tretObj()
    obj.logging = @logging
    obj
  
  get_short_tret: (tretname) ->
    if m = tret.match(/^EMTret([a-zA-Z0-9_]+)$/)
      return m[1]
    return tretname
  
  _init: () ->
    for tret in @trets
      continue  if @tret_objects[tret]?
      obj = @create_object(tret)
      continue  if not obj?
      @tret_objects[tret] = obj
    
    if not @inited
      @add_safe_tag('pre')
      @add_safe_tag('script')
      @add_safe_tag('style')
      @add_safe_tag('notg')
      @add_safe_block('span-notg', '<span class="_notg_start"></span>', '<span class="_notg_end"></span>')

    @inited = true
    return
  
  
  ###
   * Инициализация класса, используется чтобы задать список третов или
   * спсиок защищённых блоков, которые можно использовать.
   * Такде здесь можно отменить защищённые блоки по умлочнаию
   *
  ###
  init: () ->
  
  ###
   * Добавить Трэт, 
   *
   * @param mixed $class - имя класса трета, или сам объект
   * @param string $altname - альтернативное имя, если хотим например иметь два одинаоковых терта в обработке
   * @return unknown
  ###
  add_tret: (classObj, altname=false) ->
    if typeof classObj is 'object'
      if not classObj instanceof "EMTret"
        @error("You are adding Tret that doesn't inherit base class EMTret", classObj)
        return false
      
      classObj.EMT = @
      classObj.logging = @logging

      @tret_objects[(if altname then altname else classObj.constructor.name)] = classObj
      @trets.push (if altname then altname else classObj.constructor.name)
      return true

    if typeof classObj is 'string'
      obj = @create_object(classObj)
      return false  if not obj?
        
      @tret_objects[(if altname then altname else classObj)] = obj
      @trets.push (if altname then altname else classObj)
      return true

    @error("Чтобы добавить трэт необходимо передать имя или объект")
    return false
  
  ###
   * Получаем ТРЕТ по идентивикатору, т.е. заванию класса
   *
   * @param unknown_type $name
  ###
  get_tret: (name) ->
    return @tret_objects[name]  if @tret_objects[name]?

    for tret in @trets
      if tret is name
        @_init()
        return @tret_objects[name]

      if @get_short_tret(tret) is name
        @_init()
        return @tret_objects[tret]

    @error("Трэт с идентификатором #{name} не найден")
    return false
  
  ###
   * Задаём текст для применения типографа
   *
   * @param string $text
  ###
  set_text: (text) ->
    @_text = text
  
  
  
  ###
   * Запустить типограф на выполнение
   *
  ###
  apply: (trets=null) ->
    @ok = false
    
    @init()
    @_init()
    
    atrets = @trets
    atrets = [trets]  if typeof trets is 'string'
    atrets = trets  if Array.isArray(trets)

    @debug(@, 'init', @_text)
    
    @_text = @safe_blocks(@_text, true)
    @debug(@, 'safe_blocks', @_text)
    
    @_text = EMTLib.safe_tag_chars(@_text, true)
    @debug(@, 'safe_tag_chars', @_text)
    
    @_text = EMTLib.clear_special_chars(@_text)
    @debug(@, 'clear_special_chars', @_text)

    for tret in atrets
      # // если установлен режим разметки тэгов то выставим его
      @tret_objects[tret].set_tag_layout_ifnotset(@use_layout)           if @use_layout_set
      @tret_objects[tret].set_class_layout_prefix(@class_layout_prefix)  if @class_layout_prefix
      
      # // влючаем, если нужно
      @tret_objects[tret].debug_on()                                     if @debug_enabled
      @tret_objects[tret].logging = true                                 if @logging
            
      # // применяем трэт
      @tret_objects[tret].set_text(@_text)
      @_text = @tret_objects[tret].apply()

      # // соберём ошибки если таковые есть
      if @tret_objects[tret].errors.length > 0
        for err in @tret_objects[tret].errors
          @tret_error(tret, err.info, err.data)
      
      # // логгирование 
      if @logging
        if @tret_objects[tret].logs.length > 0
          for log in @tret_objects[tret].logs
            @tret_log(tret, log.info, log.data)
      
      # // отладка
      if @debug_enabled
        for di in @tret_objects[tret].debug_info
          unsafetext = di.text
          unsafetext = EMTLib.safe_tag_chars(unsafetext, false)
          unsafetext = @safe_blocks(unsafetext, false)
          @debug(tret, di.place, unsafetext, di.text)
    
    
    @_text = @decode_internal_blocks(@_text)
    @debug(@, 'decode_internal_blocks', @_text)
    
    if @is_on('dounicode')
      EMTLib.convert_html_entities_to_unicode(@_text)
    
    @_text = EMTLib.safe_tag_chars(@_text, false)
    @debug(@, 'unsafe_tag_chars', @_text)
    
    @_text = @safe_blocks(@_text, false)
    @debug(@, 'unsafe_blocks', @_text)
    
    if not @disable_notg_replace
      repl = ['<span class="_notg_start"></span>', '<span class="_notg_end"></span>']
      repl = ""  if @remove_notg
      @_text = @_text.replace(['<notg>','</notg>'], repl)

    @_text = @_text.trim()
    @ok = @errors.length is 0
    @_text
  
  ###
   * Получить содержимое <style></style> при использовании классов
   * 
   * @param bool $list false - вернуть в виде строки для style или как массив
   * @param bool $compact не выводить пустые классы
   * @return string|array
  ###
  get_style: (list=false, compact=false) ->
    @_init()
    
    res = {}
    for tret in @trets
      arr = @tret_objects[tret].classes
      continue  if not Array.isArray(arr)

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
   *   EMTLib.LAYOUT_STYLE - с помощью стилей
   *   EMTLib.LAYOUT_CLASS - с помощью классов
   *   EMTLib.LAYOUT_STYLE|EMTLib.LAYOUT_CLASS - оба метода
   *
   * @param int $layout
  ###
  set_tag_layout: (layout=EMTLib.LAYOUT_STYLE) ->
    @use_layout = layout
    @use_layout_set = true
  
  ###
   * Установить префикс для классов
   *
   * @param string|bool $prefix если true то префикс 'emt_', иначе то, что передали
  ###
  set_class_layout_prefix: (prefix) ->
    @class_layout_prefix = if prefix? then "emt_" else prefix
  
  ###
   * Включить/отключить правила, согласно карте
   * Формат карты:
   *    'Название трэта 1' => array ( 'правило1', 'правило2' , ...  )
   *    'Название трэта 2' => array ( 'правило1', 'правило2' , ...  )
   *
   * @param array $map
   * @param boolean $disable если ложно, то $map соотвествует тем правилам, которые надо включить
   *                         иначе это список правил, которые надо выключить
   * @param boolean $strict строго, т.е. те которые не в списку будут тоже обработаны
  ###
  set_enable_map: (map, disable=false, strict=true) ->
    return  if not Array.isArray(map)
    trets = []

    for tret, list of map
      tretx = @get_tret(tret)
      if not tretx
        @log("Трэт #{tret} не найден при применении карты включаемых правил")
        continue

      trets.push tretx
      
      if list is true # // все
        tretx.activate [], not disable, true
      else if typeof list is 'string'
        tretx.activate [list], disable, strict
      else if Array.isArray(list)
        tretx.activate list, disable, strict

    if strict
      for tret in @trets
        continue  if trets in @tret_objects[tret]
        @tret_objects[tret].activate [], disable, true
    
    return
  
  
  ###
   * Установлена ли настройка
   *
   * @param string $key
  ###
  is_on: (key) ->
    return false  if not @settings[key]?
    kk = @settings[key]
    kk.toLowerCase() is "on" or kk is "1" or kk is true or kk is 1
  
  
  ###
   * Установить настройку
   *
   * @param mixed $selector
   * @param string $setting
   * @param mixed $value
  ###
  doset: (selector, key, value) ->
    tret_pattern = false
    rule_pattern = false

    if typeof selector is 'string'
      if selector.indexOf(".") is -1
        tret_pattern = selector
      else
        pa = selector.split(".")
        tret_pattern = pa[0]
        pa.shift()
        rule_pattern = pa.join(".")

    EMTLib._process_selector_pattern(tret_pattern)
    EMTLib._process_selector_pattern(rule_pattern)
    @settings[key] = value  if selector is "*"
    
    for tret in @trets
      t1 = @get_short_tret(tret)
      continue  if not EMTLib._test_pattern(tret_pattern, t1) and not EMTLib._test_pattern(tret_pattern, tret)
      tret_obj = @get_tret(tret)

      if key is "active"
        for rulename, v of tret_obj.rules
          continue  if not EMTLib._test_pattern(rule_pattern, rulename)
          tret_obj.enable_rule(rulename)  if value.toLowerCase() is "on" or value is 1 or value is true or value is "1"
          tret_obj.disable_rule(rulename)  if value.toLowerCase() is "off" or value is 0 or value is false or value is "0"
      else
        if rule_pattern is false
          tret_obj.set(key, value)
        else
          for rulename, v of tret_obj.rules
            continue  if not EMTLib._test_pattern(rule_pattern, rulename)
            tret_obj.set_rule(rulename, key, value)
    return
  
  ###
   * Установить настройки для тертов и правил
   *  1. если селектор является массивом, то тогда утсановка правил будет выполнена для каждого
   *     элемента этого массива, как отдельного селектора.
   *  2. Если $key не является массивом, то эта настрока будет проставлена согласно селектору
   *  3. Если $key массив - то будет задана группа настроек
   *       - если $value массив , то настройки определяются по ключам из массива $key, а значения из $value
   *       - иначе, $key содержит ключ-значение как массив  
   *
   * @param mixed $selector
   * @param mixed $key
   * @param mixed $value
  ###
  set: (selector, key, value=false) ->
    if Array.isArray(selector)
      @set(val, key, value)  for val in selector
      return

    if Array.isArray(key)
      for x, y of key
        if Array.isArray(value)
          kk = y
          vv = value[x]
        else
          kk = x
          vv = y

        @set(selector, kk, vv)
    @doset(selector, key, value)
    return
  
  
  ###
   * Возвращает список текущих третов, которые установлены
   *
  ###
  get_trets_list: () ->
    @trets
  
  ###
   * Установка одной метанастройки
   *
   * @param string $name
   * @param mixed $value
  ###
  do_setup: (name, value) ->
  
  
  ###
   * Установить настройки
   *
   * @param array $setupmap
  ###
  setup: (setupmap) ->
    return  if not Array.isArray(setupmap)
    
    if setupmap['map']? or setupmap['maps']?
      if setupmap['map']?
        ret['map'] = test['params']['map']
        ret['disable'] = test['params']['map_disable']
        ret['strict'] = test['params']['map_strict']
        test['params']['maps'] = [ret]
        delete setupmap['map']
        delete setupmap['map_disable']
        delete setupmap['map_strict']

      if Array.isArray(setupmap['maps'])
        for map in setupmap['maps']
          @set_enable_map map['map'], (if map['disable']? then map['disable'] else false), (if map['strict']? then map['strict'] else false)
      delete setupmap['maps']
    
    @do_setup(k, v)  for k, v of setupmap
    return


class EMTypograph extends EMTBase
  trets: [
    'EMTretQuote'
    'EMTretDash'
    'EMTretSymbol'
    'EMTretPunctmark'
    'EMTretNumber'
    'EMTretSpace'
    'EMTretAbbr'
    'EMTretNobr'
    'EMTretDate'
    'EMTretOptAlign'
    'EMTretEtc'
    'EMTretText'
  ]
  
  group_list:
    'Quote'     : true
    'Dash'      : true
    'Nobr'      : true
    'Symbol'    : true
    'Punctmark' : true
    'Number'    : true
    'Date'      : true
    'Space'     : true
    'Abbr'      : true
    'OptAlign'  : true
    'Text'      : true
    'Etc'       : true

  all_options:
    'Quote.quotes':
      description: 'Расстановка «кавычек-елочек» первого уровня'
      selector: "Quote.*quote"
    'Quote.quotation':
      description: 'Внутренние кавычки-лапки'
      selector: "Quote"
      setting: 'no_bdquotes'
      reversed: true
              
    'Dash.to_libo_nibud'                : 'direct'
    'Dash.iz_za_pod'                    : 'direct'
    'Dash.ka_de_kas'                    : 'direct'
    
    'Nobr.super_nbsp'                   : 'direct'
    'Nobr.nbsp_in_the_end'              : 'direct'
    'Nobr.phone_builder'                : 'direct'
    'Nobr.ip_address'                   : 'direct'
    'Nobr.spaces_nobr_in_surname_abbr'  : 'direct'
    'Nobr.nbsp_celcius'                 : 'direct'
    'Nobr.hyphen_nowrap_in_small_words' : 'direct'
    'Nobr.hyphen_nowrap'                : 'direct'
    'Nobr.nowrap':
      description: 'Nobr (по умолчанию) & nowrap'
      disabled: true
      selector: '*'
      setting: 'nowrap'
    
    'Symbol.tm_replace'     : 'direct'
    'Symbol.r_sign_replace' : 'direct'
    'Symbol.copy_replace'   : 'direct'
    'Symbol.apostrophe'     : 'direct'
    'Symbol.degree_f'       : 'direct'
    'Symbol.arrows_symbols' : 'direct'
    'Symbol.no_inches':
      description: 'Расстановка дюйма после числа'
      selector: "Quote"
      setting: 'no_inches'
      reversed: true
    
    'Punctmark.auto_comma'                  : 'direct'
    'Punctmark.hellip'                      : 'direct'
    'Punctmark.fix_pmarks'                  : 'direct'
    'Punctmark.fix_excl_quest_marks'        : 'direct'
    'Punctmark.dot_on_end'                  : 'direct'
    
    'Number.minus_between_nums'             : 'direct'
    'Number.minus_in_numbers_range'         : 'direct'
    'Number.auto_times_x'                   : 'direct'
    'Number.simple_fraction'                : 'direct'
    'Number.math_chars'                     : 'direct'
    'Number.thinsp_between_number_triads'   : 'direct'
    'Number.thinsp_between_no_and_number'   : 'direct'
    'Number.thinsp_between_sect_and_number' : 'direct'
    
    'Date.years'                            : 'direct'
    'Date.mdash_month_interval'             : 'direct'
    'Date.nbsp_and_dash_month_interval'     : 'direct'
    'Date.nobr_year_in_date'                : 'direct'
    
    'Space.many_spaces_to_one'              : 'direct'
    'Space.clear_percent'                   : 'direct'
    'Space.clear_before_after_punct':
      description: 'Удаление пробелов перед и после знаков препинания в предложении'
      selector: 'Space.remove_space_before_punctuationmarks'
    'Space.autospace_after':
      description: 'Расстановка пробелов после знаков препинания'
      selector: 'Space.autospace_after_*'
    'Space.bracket_fix':
      description: 'Удаление пробелов внутри скобок, а также расстановка пробела перед скобками'
      selector: ['Space.nbsp_before_open_quote', 'Punctmark.fix_brackets']
        
    'Abbr.nbsp_money_abbr'       : 'direct'
    'Abbr.nobr_vtch_itd_itp'     : 'direct'
    'Abbr.nobr_sm_im'            : 'direct'
    'Abbr.nobr_acronym'          : 'direct'
    'Abbr.nobr_locations'        : 'direct'
    'Abbr.nobr_abbreviation'     : 'direct'
    'Abbr.ps_pps'                : 'direct'
    'Abbr.nbsp_org_abbr'         : 'direct'
    'Abbr.nobr_gost'             : 'direct'
    'Abbr.nobr_before_unit_volt' : 'direct'
    'Abbr.nbsp_before_unit'      : 'direct'
    
    'OptAlign.all':
      description: 'Все настройки оптического выравнивания'
      hide: true
      selector: 'OptAlign.*'
    'OptAlign.oa_oquote'        : 'direct'
    'OptAlign.oa_obracket_coma' : 'direct'
    'OptAlign.oa_oquote_extra'  : 'direct'
    'OptAlign.layout':
      description: 'Inline стили или CSS'
    
    'Text.paragraphs'      : 'direct'
    'Text.auto_links'      : 'direct'
    'Text.email'           : 'direct'
    'Text.breakline'       : 'direct'
    'Text.no_repeat_words' : 'direct'
    
    'Etc.unicode_convert':
      description: 'Преобразовывать html-сущности в юникод'
      selector: '*'
      setting: 'dounicode'
      # disabled: false
  
  ###
   * Получить список имеющихся опций
   *
   * @return array
   *     all    - полный список
   *     group  - сгруппрованный по группам
  ###
  get_options_list: () ->
    arr['all'] = {}
    bygroup = {}

    for opt, op of @all_options
      arr['all'][opt] = @get_option_info(opt)
      x = opt.split(".")
      bygroup[x[0]] = []  if not bygroup[x[0]]?
      bygroup[x[0]].push opt

    arr['group'] = {}
    for group, ginfo of @group_list
      if ginfo is true
        tret = @get_tret(group)
        if tret then info['title'] = tret.title else info['title'] = "Не определено"
      else
        info = ginfo

      info['name'] = group
      info['options'] = []
      
      if Array.isArray(bygroup[group])
        for opt in bygroup[group]
          info['options'].push opt
      
      arr['group'].push info
    
    return arr
  
  
  ###
   * Получить информацию о настройке
   *
   * @param string $key
   * @return array|false
  ###
  get_option_info: (key) ->
    return false  if not @all_options[key]?
    return @all_options[key]  if Array.isArray(@all_options[key])
    
    if @all_options[key] is "direct" or @all_options[key] is "reverse"
      pa = key.split(".")
      tret_pattern = pa[0]
      tret = @get_tret(tret_pattern)
      return false  if not tret
      return false  if not tret.rules[pa[1]]?
      arr = tret.rules[pa[1]]
      arr['way'] = @all_options[key]
      return arr
    return false
  
  
  ###
   * Установка одной метанастройки
   *
   * @param string $name
   * @param mixed $value
  ###
  do_setup: (name, value) ->
    return  if not @all_options[name]?
    
    # // эта настрока связана с правилом ядра
    if typeof @all_options[name] is 'string'
      @set(name, "active", value)
      return

    if Array.isArray(@all_options[name])
      if @all_options[name]['selector']?
        settingname = "active"
        settingname = @all_options[name]['setting']  if @all_options[name]['setting']?
        @set(@all_options[name]['selector'], settingname, value)

    if name is "OptAlign.layout"
      @set_tag_layout(EMTLib.LAYOUT_STYLE)  if value is "style"
      @set_tag_layout(EMTLib.LAYOUT_CLASS)  if value is "class"
    return
  
  ###
   * Запустить типограф со стандартными параметрами
   *
   * @param string $text
   * @param array $options
   * @return string
  ###
  fast_apply: (text, options=null) ->
    obj = new this()
    obj.setup(options)  if Array.isArray(options)
    obj.set_text(text)
    obj.apply()



module.exports = EMTypograph