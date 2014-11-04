# Mdash.Lib = require "./mdash.lib"

###
 * Базовый класс для группы правил обработки текста
 * Класс группы должен наследовать, данный класс и задавать
 * в нём Mdash.Tret::rules и Mdash.Tret::$name
 * 
###
class Mdash.Tret
  ###
   * Набор правил в данной группе, который задан изначально
   * Его можно менять динамически добавляя туда правила с помощью put_rule
   *
   * @var unknown_type
  ###
  rules       : {}
  title       : null
  
  class_names : []
  classes     : {}
  
  
  ###
   * Защищенные теги
   * 
   * @todo привязать к методам из Jare_Typograph_Tool
  ###
  BASE64_PARAGRAPH_TAG : 'cA==' # // p
  BASE64_BREAKLINE_TAG : 'YnIgLw==' # // br / (с пробелом и слэшем)
  BASE64_NOBR_OTAG     : 'bm9icg==' # // nobr
  BASE64_NOBR_CTAG     : 'L25vYnI=' # // /nobr
  
  ###
   * Типы кавычек
  ###
  QUOTE_FIRS_OPEN    : '&laquo;'
  QUOTE_FIRS_CLOSE   : '&raquo;'
  QUOTE_CRAWSE_OPEN  : '&bdquo;'
  QUOTE_CRAWSE_CLOSE : '&ldquo;'
  

  constructor: (text) ->
    @DEBUG = false

    @disabled = {}
    @enabled = {}
    @text = text

    @use_layout = false
    @use_layout_set = false
    @class_layout_prefix = false

    @settings = {}
    return


  ###
   * Установить режим разметки для данного Трэта если не было раньше установлено,
   *   Mdash.Lib::LAYOUT_STYLE - с помощью стилей
   *   Mdash.Lib::LAYOUT_CLASS - с помощью классов
   *
   * @param int $kind
  ###
  set_tag_layout_ifnotset: (layout) ->
    return  if @use_layout_set
    @use_layout = layout
    return
  
  ###
   * Установить режим разметки для данного Трэта,
   *   Mdash.Lib::LAYOUT_STYLE - с помощью стилей
   *   Mdash.Lib::LAYOUT_CLASS - с помощью классов
   *   Mdash.Lib::LAYOUT_STYLE|Mdash.Lib::LAYOUT_CLASS - оба метода
   *
   * @param int $kind
  ###
  set_tag_layout: (layout=Mdash.Lib.LAYOUT_STYLE) ->
    @use_layout = layout
    @use_layout_set = true
  
  set_class_layout_prefix: (prefix) ->
    @class_layout_prefix = prefix
  
  getmethod: (name) ->
    return false  if not name
    return false  if not name in this
    return this[name]
  
  _pre_parse: () ->
    @pre_parse()

    for rule in @rules
      continue  if not rule.init?
      m = @getmethod(rule.init)
      continue  if not m
      m.call(this)
    return

  _post_parse: () ->
    for rule in @rules
      continue  if not rule.deinit?
      m = @getmethod(rule.deinit)
      continue  if not m
      m.call(@)

    @post_parse()
    return
  
  rule_order_sort: (a, b) ->
    return 0  if a.order is b.order
    return -1  if a.order < b.order
    return 1
  
  apply_rule: (rule) ->
    name = rule.id
    isdisabled = (@disabled[rule.id] or rule.disabled) and !@enabled[rule.id]

    if isdisabled
      Mdash.Lib.log "Правило #{name}", "Правило отключено" + (if rule.disabled then " (по умолчанию)" else "")
      return

    if rule.function?
      fn = rule.function

      if typeof fn is 'string'
        fn = @[fn]
        fn = eval(fn)  if typeof fn is 'string' and eval("typeof " + fn) is 'function'

      if typeof fn is 'function'
        Mdash.Lib.log "Правило #{name}", "Используется метод #{rule.function} в правиле"
        @text = fn.call(@, @text)
        return

      Mdash.Lib.error "Функция #{rule.function} из правила #{rule.id} не найдена"
      return
    else if rule.pattern?
      patterns = rule.pattern
      patterns = new RegExp(Mdash.Lib.preg_quote patterns, 'g')  if typeof patterns is 'string'
      patterns = [ patterns ]  if !Array.isArray patterns

      for k, pattern of patterns
        pattern = new RegExp(Mdash.Lib.preg_quote pattern, 'g')  if typeof pattern is 'string'
        replacement = if Array.isArray(rule.replacement) then rule.replacement[k] else rule.replacement

        if typeof replacement is 'string' and /^[a-z_0-9]+$/i.test replacement
          Mdash.Lib.log "Правило #{name}", "Замена с использованием replace с методом #{replacement}"
          replacement = @[replacement]  if {}.hasOwnProperty.call(@, replacement)
          replacement = eval(replacement)  if eval("typeof " + replacement)

        self = this
        @text = @text.replace pattern, if typeof replacement is 'string' then replacement else () ->
          match_all = arguments[0]
          replacement.call self, match_all, arguments
      return
    return
  
  
  _apply: (list) ->
    Mdash.Lib.errors = []
    @_pre_parse()
    
    Mdash.Lib.log "Применяется набор правил", list.join(",")
    
    rulelist = []
    for k in list
      rule = @rules[k]
      rule.id = k
      rule.order = if rule.order? then rule.order else 5
      rulelist.push rule
    
    rulelist.sort @_rule_order_sort

    for rule in rulelist
      @apply_rule rule
      Mdash.Lib.debug rule.id, @text
    
    @_post_parse()
    return

  
  
  ###
   * Создание защищенного тега с содержимым
   *
   * @see   EMT_lib::build_safe_tag
   * @param   string $content
   * @param   string $tag
   * @param   array $attribute
   * @return  string
  ###
  tag: (content, tag='span', attribute={}) ->
    if attribute.class?
      classname = attribute.class
      if classname is "nowrap"
        if !@is_on('nowrap')
          tag = "nobr"
          attribute = {}
          classname = ""

      if @classes[classname]?
        style_inline = @classes[classname]
        attribute.__style = style_inline  if style_inline

      classname = if @class_names[classname]? then @class_names[classname] else classname
      classname = (if @class_layout_prefix then @class_layout_prefix else "") + classname
      attribute.class = classname
    
    layout = if @use_layout is false then Mdash.Lib.LAYOUT_STYLE else @use_layout

    htmlTag = tag
  
    if @typographSpecificTagId
      if attribute.id?
        attribute.id = 'emt-2' + Math.floor(Math.random() * (9999 - 1000)) + 1000
    
    classname = ""
    if Object.keys(attribute).length
      if layout is Mdash.Lib.LAYOUT_STYLE
        if attribute.__style?
          if attribute.style?
            st = attribute.style.trim()
            st += ";"  if st.slice(-1) not ";"
            st += attribute.__style
            attribute.style = st
          else
            attribute.style = attribute.__style
          delete attribute.__style

      for attr, value of attribute
        continue  if attr is "__style"
        
        if attr is "class"
          classname = value
          continue

        htmlTag += " #{attr}=\"#{value}\""
      
    if layout is Mdash.Lib.LAYOUT_CLASS and classname
      htmlTag += " class=\"#{classname}\""
    
    "<" + Mdash.Lib.encrypt_tag(htmlTag) + ">#{content}</" + Mdash.Lib.encrypt_tag(tag) + ">"
  
  
  ###
   * Добавить правило в группу
   *
   * @param string $name
   * @param array $params
  ###
  put_rule: (name, params) ->
    @rules[name] = params
    return

  ###
   * Отключить правило, в обработке
   *
   * @param string $name
  ###
  disable_rule: (name) ->
    @disabled[name] = true
    delete @enabled[name]
    return
  
  ###
   * Включить правило
   *
   * @param string $name
  ###
  enable_rule: (name) ->
    @enabled[name] = true
    delete @disabled[name]
    return
  
  ###
   * Добавить настройку в трет
   *
   * @param string $key ключ
   * @param mixed $value значение
  ###
  set: (key, value) ->
    @settings[key] = value
    return
  
  ###
   * Установлена ли настройка
   *
   * @param string $key
  ###
  is_on: (key) ->
    return false  if not @settings[key]?
    kk = @settings[key]
    return kk.toLowerCase() is "on" or kk is "1" or kk is true or kk is 1
  
  ###
   * Получить строковое значение настройки
   *
   * @param unknown_type $key
   * @return unknown
  ###
  ss: (key) ->
    return ""  if not @settings[key]?
    return "#{@settings[key]}"
  
  ###
   * Добавить настройку в правило
   *
   * @param string $rulename идентификатор правила 
   * @param string $key ключ
   * @param mixed $value значение
  ###
  set_rule: (rulename, key, value) ->
    @rules[rulename][key] = value
    return
  
  ###
   * Включить правила, согласно списку
   *
   * @param array $list список правил
   * @param boolean $disable выкллючить их или включить
   * @param boolean $strict строго, т.е. те которые не в списку будут тоже обработаны
  ###
  activate: (list, disable=false, strict=true) ->
    return false if not Array.isArray(list)
    
    for rulename in list
      if disable then @disable_rule(rulename) else @enable_rule(rulename)
    
    if strict
      for rulename, v of @rules
        continue  if rulename in list
        if not disable then @disable_rule(rulename) else @enable_rule(rulename)

    return

  
  set_text: (text) ->
    @text = text
    return
  

  ###
   * Применить к тексту
   *
   * @param string $text - текст к которому применить
   * @param mixed $list - список правил, null - все правила
   * @return string
  ###
  apply: (list=null) ->
    if typeof list is 'string'
      rlist = [list]
    else if Array.isArray(list)
      rlist = list
    else
      rlist = Object.keys(@rules)

    @_apply(rlist)
    return @text
  
  
  ###
   * Код, выполняем до того, как применить правила
   *
  ###
  pre_parse: () ->
  
  ###
   * После выполнения всех правил, выполняется этот метод
   *
  ###
  post_parse: () ->

