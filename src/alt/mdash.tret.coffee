class Mdash.Tret
  rules: {}
  classes: {}
  settings: {}
  order: 5
  
  
  constructor: (options) ->
    @set options  if options? and typeof options is 'objects'
    return

  apply: (text) ->
    self = @

    console.log "\nTRET\t#{@constructor.name}...".yellow

    for id, rule of @rules
      if rule.disabled
        console.log "RULE\t#{id}...\tDisabled.".grey
      else
        console.log "RULE\t#{id}...".green
      continue  if rule.disabled

      if rule.function?
        result = rule.function.call self, text, rule
        console.log "\t# Custom function"

        if typeof result isnt 'string'
          throw new Error("Custom function returned wrong result")
          continue
        text = result

      if rule.pattern?
        for k, pattern of rule.pattern
          replacement = if typeof rule.replacement is 'object' then (rule.replacement[k] or rule.replacement[0]) else rule.replacement

          result = text.replace pattern, if typeof replacement is 'string' then replacement else () ->
            global["$#{i}"] = arguments[i]  for i in [0...arguments.length]

            console.log "\t# Matched pattern ##{k}\t'"+ $0.dim.white + "' → '" + replacement.call(self).dim.white + "'"
            replacement.call self

          text = result  if typeof result is 'string'
    text

  set: () ->
    argn = arguments.length
    settings = {}
    # argn = Object.keys(arguments).length
    if arguments.length >= 3
      [rule, key, value] = arguments

      settings[rule][key] = value
    else if arguments.length is 2
      [key, value] = arguments

      for rule of @rules
        settings[rule] = {}  if not settings[rule]?
        settings[rule][key] = value
    else if arguments.length is 1 and typeof arguments[0] is 'object'
      settings = arguments[0]

    for id, rule of @rules
      continue  if not settings[id]?

      opts = rule
      opts = merge opts, settings[id]  if settings[id]?

      rule = {}
      rule.disabled = false  if not rule.disabled?
      rule.pattern = []  if not rule.pattern?
      rule.replacement = null  if not rule.replacement?
      rule.function = null  if not rule.function?

      if opts.disabled?
        rule.disabled = "#{opts.disabled}".toLowerCase() in ["1", "true"]
        delete opts['disabled']

      if opts.enabled?
        rule.disabled = "#{opts.enabled}".toLowerCase() in ["0", "false", "off"]
        delete opts['enabled']
        
      if opts.order?
        rule.order = parseInt(opts.order) or 5
        delete opts['order']

      if opts.function?
        fn = opts.function

        if typeof fn is 'string'
          fn = @[fn]  if @[fn]?
          fn = eval(fn)  if eval("typeof " + fn) is 'function'

        rule.function = fn  if typeof fn is 'function'
        delete opts['function']

      if opts.pattern?
        pattern = opts.pattern
        pattern = [ pattern ]  if not Array.isArray pattern
        rule.pattern = pattern
        delete opts['pattern']

      if opts.replacement?
        replacement = opts.replacement

        if typeof replacement is 'string' and /^[a-z_0-9]+$/i.test(replacement)
          replacement = @[replacement]  if @[replacement]? and typeof @[replacement] is 'function'
          replacement = eval(replacement)  if eval("typeof " + replacement) is 'function'

        rule.replacement = replacement
        delete opts['replacement']

      rule[key] = val  for key, val of opts

      if rule.pattern.length and not rule.replacement? and not rule.function?
        throw new Error("There is no replacement setted for the patterns")

      @rules[id] = rule

    return

  is_on: (key) ->
    return false  if not @rules[key]?
    "#{@rules[key]}".toLowerCase() in ["on", "true", "1", "direct"]

  disable: (name) ->
    @rules[name].disabled = true  if @rules[name]?
    return
  
  enable: (name) ->
    @rules[name].disabled = false  if @rules[name]?
    return

  tag: (content, tag='span', attribute={}) ->
    if attribute.class?
      classname = attribute.class
      if classname is "nowrap"
        if not @is_on('nowrap')
          tag = "nobr"
          attribute = {}
          classname = ""

      if @classes[classname]?
        style_inline = @classes[classname]
        attribute.__style = style_inline  if style_inline

      # classname = if @class_names[classname]? then @class_names[classname] else classname
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
