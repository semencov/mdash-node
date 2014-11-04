path = require('path')
fs = require('fs')

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


class Mdash
  text: null

  trets: [
    'Mdash.Tret.Quote'
    'Mdash.Tret.Dash'
    'Mdash.Tret.Symbol'
    'Mdash.Tret.Punctmark'
    'Mdash.Tret.Number'
    'Mdash.Tret.Space'
    'Mdash.Tret.Abbr'
    'Mdash.Tret.Nobr'
    'Mdash.Tret.Date'
    'Mdash.Tret.OptAlign'
    'Mdash.Tret.Etc'
    'Mdash.Tret.Text'
  ]
  
  all_options:
    'Quote.quotes':
      description : 'Расстановка «кавычек-елочек» первого уровня'
      selector    : "Quote.*quote"
    'Quote.quotation':
      description : 'Внутренние кавычки-лапки'
      selector    : "Quote"
      setting     : 'no_bdquotes'
      reversed    : true
              
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
      description : 'Nobr (по умолчанию) & nowrap'
      disabled    : true
      selector    : '*'
      setting     : 'nowrap'
    
    'Symbol.tm_replace'     : 'direct'
    'Symbol.r_sign_replace' : 'direct'
    'Symbol.copy_replace'   : 'direct'
    'Symbol.apostrophe'     : 'direct'
    'Symbol.degree_f'       : 'direct'
    'Symbol.arrows_symbols' : 'direct'
    'Symbol.no_inches':
      description : 'Расстановка дюйма после числа'
      selector    : "Quote"
      setting     : 'no_inches'
      reversed    : true
    
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
      description : 'Удаление пробелов перед и после знаков препинания в предложении'
      selector    : 'Space.remove_space_before_punctuationmarks'
    'Space.autospace_after':
      description : 'Расстановка пробелов после знаков препинания'
      selector    : 'Space.autospace_after_*'
    'Space.bracket_fix':
      description : 'Удаление пробелов внутри скобок, а также расстановка пробела перед скобками'
      selector    : ['Space.nbsp_before_open_quote', 'Punctmark.fix_brackets']
        
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
      description : 'Все настройки оптического выравнивания'
      hide        : true
      selector    : 'OptAlign.*'
    'OptAlign.oa_oquote'        : 'direct'
    'OptAlign.oa_obracket_coma' : 'direct'
    'OptAlign.oa_oquote_extra'  : 'direct'
    'OptAlign.layout':
      description : 'Inline стили или CSS'
    
    'Text.paragraphs'      : 'direct'
    'Text.auto_links'      : 'direct'
    'Text.email'           : 'direct'
    'Text.breakline'       : 'direct'
    'Text.no_repeat_words' : 'direct'
    
    'Etc.unicode_convert':
      description : 'Преобразовывать html-сущности в юникод'
      selector    : '*'
      setting     : 'dounicode'
      disabled    : false
  

  constructor: (text, options={}) ->
    @DEBUG = false

    if typeof text is 'object'
      options = text
      text = null

    mdashrc_path = path.dirname(require.main.filename) + "/.mdash"
    mdashrc = @readJSON(mdashrc_path) or @readYAML(mdashrc_path) or {}

    mdashrc[key] = val  for key, val of options
    options = mdashrc

    @inited = false
    @text = text
    @tret_objects = {}
    
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
  get_allsafe_blocks: () -> @safe_blocks
    
  ###
   * Удаленного блока по его номеру ключа
   *
   * @param   string $id идентифиактор защищённого блока 
   * @return  void
  ###
  remove_safe_block: (id) ->
    for k, block of @safe_blocks
      delete @safe_blocks[k]  if block.id is id
    return
    
    
  ###
   * Добавление защищенного блока
   *
   * @param   string $tag тэг, который должен быть защищён
   * @return  void
  ###
  add_safe_tag: (tag) ->
    open = Mdash.Lib.preg_quote("<", '/') + "#{tag}[^>]*?" +  Mdash.Lib.preg_quote(">", '/')
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
  safe_blocks: (text, way, show=true) ->
    if @blocks.length
      safeblocks = if way is true then @blocks else @blocks.reverse()

      for block in safeblocks
        text = text.replace new RegExp("({#{block.open}})(.+?)({#{block.close}})", 'g'), (match, m1, m2, m3) ->
          m1 + (if way is true then Mdash.Lib.encrypt_tag(m2) else Mdash.Lib.decrypt_tag(m2)) + m3

    return text
    
  ###
   * Декодирование блоков, которые были скрыты в момент типографирования
   *
   * @param   string $text
   * @return  string
  ###
  decode_internal_blocks: (text) ->
    Mdash.Lib.decode_internal_blocks(text)
  
  create_object: (tret) ->
    tret = @get_short_tret(tret)  if typeof tret is 'string'
    obj = if typeof tret is 'string' then new Mdash.Tret[tret]() else new tret()

    if not obj?
      Mdash.Lib.error("Класс #{tret} не найден. Пожалуйста, подргузите нужный файл.")
      return
    
    obj.DEBUG = @DEBUG
    obj
  
  get_short_tret: (tretName) ->
    if m = tretName.match(/^Mdash\.Tret\.([a-zA-Z0-9_]+)$/)
      return m[1]
    return tretName
  
  init: () ->
    for tretName in @trets
      continue  if @tret_objects[tretName]?
      obj = @create_object(tretName)
      continue  if not obj?
      @tret_objects[tretName] = obj
    
    if not @inited
      @add_safe_tag('pre')
      @add_safe_tag('script')
      @add_safe_tag('style')
      @add_safe_tag('notg')
      @add_safe_block('span-notg', '<span class="_notg_start"></span>', '<span class="_notg_end"></span>')

    @inited = true
    return
  
  
  ###
   * Добавить Трэт, 
   *
   * @param mixed $class - имя класса трета, или сам объект
   * @param string $altname - альтернативное имя, если хотим например иметь два одинаоковых терта в обработке
   * @return unknown
  ###
  add_tret: (tretClass, altname=false) ->
    if typeof tretClass is 'object'
      if not tretClass instanceof "Mdash.Tret"
        Mdash.Lib.error("You are adding Tret that doesn't inherit base class Mdash.Tret", tretClass)
        return false
      
      # tretClass.mdash = @
      tretClass.DEBUG = @DEBUG

      @tret_objects[(if altname then altname else tretClass.constructor.name)] = tretClass
      @trets.push (if altname then altname else tretClass.constructor.name)
      return true

    if typeof tretClass is 'string'
      obj = @create_object(tretClass)
      return false  if not obj?
        
      @tret_objects[(if altname then altname else tretClass)] = obj
      @trets.push (if altname then altname else tretClass)
      return true

    Mdash.Lib.error("Чтобы добавить трэт необходимо передать имя или объект")
    return false
  
  ###
   * Получаем ТРЕТ по идентификатору, т.е. заванию класса
   *
   * @param unknown_type $name
  ###
  get_tret: (name) ->
    return @tret_objects[name]  if @tret_objects[name]?

    for tret in @trets
      if tret is name
        @init()
        return @tret_objects[name]

      if @get_short_tret(tret) is name
        @init()
        return @tret_objects[tret]

    Mdash.Lib.error("Трэт с идентификатором #{name} не найден")
    return false
  
  ###
   * Задаём текст для применения типографа
   *
   * @param string $text
  ###
  set_text: (text) ->
    @text = text
  
  
  
  ###
   * Запустить типограф на выполнение
   *
  ###
  format: (text, options=null) ->
    @set_text(text)  if text?
    @setup(options)  if options?
    
    @init()

    Mdash.Lib.debug(this, 'init', @text)
    
    @text = @safe_blocks(@text, true)
    Mdash.Lib.debug(this, 'safe_blocks', @text)
    
    @text = Mdash.Lib.safe_tag_chars(@text, true)
    Mdash.Lib.debug(this, 'safe_tag_chars', @text)
    
    @text = Mdash.Lib.clear_special_chars(@text)
    Mdash.Lib.debug(this, 'clear_special_chars', @text)

    for tret in @trets
      # // если установлен режим разметки тэгов то выставим его
      @tret_objects[tret].set_tag_layout_ifnotset(@use_layout)           if @use_layout_set
      @tret_objects[tret].set_class_layout_prefix(@class_layout_prefix)  if @class_layout_prefix
      
      # // влючаем, если нужно
      @tret_objects[tret].DEBUG = @DEBUG
            
      # // применяем трэт
      @tret_objects[tret].set_text(@text)
      @text = @tret_objects[tret].apply()

    @text = @decode_internal_blocks(@text)
    Mdash.Lib.debug(this, 'decode_internal_blocks', @text)
    
    if @is_on('dounicode')
      Mdash.Lib.convert_html_entities_to_unicode(@text)
    
    @text = Mdash.Lib.safe_tag_chars(@text, false)
    Mdash.Lib.debug(this, 'unsafe_tag_chars', @text)
    
    @text = @safe_blocks(@text, false)
    Mdash.Lib.debug(this, 'unsafe_blocks', @text)
    
    if not @disable_notg_replace
      repl = ['<span class="_notg_start"></span>', '<span class="_notg_end"></span>']
      repl = ""  if @remove_notg
      @text = @text.replace(['<notg>','</notg>'], repl)

    @text.trim()
  
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
        Mdash.Lib.log("Трэт #{tret} не найден при применении карты включаемых правил")
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

    tret_pattern = Mdash.Lib._process_selector_pattern(tret_pattern)
    rule_pattern = Mdash.Lib._process_selector_pattern(rule_pattern)

    @settings[key] = value  if selector is "*"

    for tret in @trets
      t1 = @get_short_tret(tret)
      continue  if not Mdash.Lib._test_pattern(tret_pattern, t1) and not Mdash.Lib._test_pattern(tret_pattern, tret)
      tret_obj = @get_tret(tret)

      if key is "active"
        for rulename, v of tret_obj.rules
          continue  if not Mdash.Lib._test_pattern(rule_pattern, rulename)
          tret_obj.enable_rule(rulename)  if value.toLowerCase() is "on" or value is 1 or value is true or value is "1"
          tret_obj.disable_rule(rulename)  if value.toLowerCase() is "off" or value is 0 or value is false or value is "0"
      else
        if rule_pattern is false
          tret_obj.set(key, value)
        else
          for rulename, v of tret_obj.rules
            continue  if not Mdash.Lib._test_pattern(rule_pattern, rulename)
            tret_obj.set_rule(rulename, key, value)

      @tret_objects[tret] = tret_obj
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
    return  if not @all_options[name]?
    
    # // эта настройка связана с правилом ядра
    if typeof @all_options[name] is 'string'
      @set(name, "active", value)
      return

    if Array.isArray(@all_options[name])
      if @all_options[name].selector?
        settingname = "active"
        settingname = @all_options[name].setting  if @all_options[name].setting?
        @set(@all_options[name].selector, settingname, value)

    if name is "OptAlign.layout"
      @set_tag_layout(Mdash.Lib.LAYOUT_STYLE)  if value is "style"
      @set_tag_layout(Mdash.Lib.LAYOUT_CLASS)  if value is "class"

    return
  
  # Read a file, return its contents.
  readFile: (filepath) ->
    contents = undefined
    try
      contents = fs.readFileSync(String(filepath))
      return contents
    catch e
      Mdash.Lib.error("Unable to read '#{filepath}' file (Error code: #{e.code}).", e)
    return

  # Read a file, parse its contents, return an object.
  readJSON: (filepath) ->
    src = @readFile(filepath)
    result = undefined
    try
      result = JSON.parse(src)
      return result
    catch e
      Mdash.Lib.error("Unable to parse '#{filepath}' file (#{e.message}).", e)
    return

  # Read a YAML file, parse its contents, return an object.
  readYAML: (filepath) ->
    src = @readFile(filepath)
    result = undefined
    try
      result = YAML.load(src)
      return result
    catch e
      Mdash.Lib.error("Unable to parse '#{filepath}' file (#{e.problem}).", e)
    return

  ###
   * Установить настройки
   *
   * @param array $setupmap
  ###
  setup: (setupmap={}) ->
    return  if typeof setupmap isnt 'object'
    
    if 'map' of setupmap or 'maps' of setupmap
      if setupmap.map?
        ret.map = test.params.map
        ret.disable = test.params.map_disable
        ret.strict = test.params.map_strict
        test.params.maps = [ret]
        delete setupmap.map
        delete setupmap.map_disable
        delete setupmap.map_strict

      if Array.isArray(setupmap.maps)
        for map in setupmap.maps
          @set_enable_map map.map, (if map.disable? then map.disable else false), (if map.strict? then map.strict else false)
      delete setupmap.maps
    
    @do_setup(k, v)  for k, v of setupmap
    return


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



module.exports = Mdash