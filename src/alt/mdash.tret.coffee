class Mdash.Tret
  rules: {}
  classes: {}
  settings: {}
  
  
  BASE64_PARAGRAPH_TAG : 'cA==' # // p
  BASE64_BREAKLINE_TAG : 'YnIgLw==' # // br / (с пробелом и слэшем)
  BASE64_NOBR_OTAG     : 'bm9icg==' # // nobr
  BASE64_NOBR_CTAG     : 'L25vYnI=' # // /nobr
  
  QUOTE_FIRS_OPEN    : '&laquo;'
  QUOTE_FIRS_CLOSE   : '&raquo;'
  QUOTE_CRAWSE_OPEN  : '&bdquo;'
  QUOTE_CRAWSE_CLOSE : '&ldquo;'

  
  constructor: (options) ->
    @set options  if options? and typeof options is 'objects'
    return

  apply: (text) ->
    self = @

    for id, rule of @rules
      if rule.function?
        result = rule.function.call self, text
        if typeof result isnt 'string'
          throw new Error("Custom function returned wrong result")
          return text
        return result

      if rule.patterns?
        for k, pattern of rule.patterns
          replacement = if typeof rule.replacement is 'object' then (rule.replacement[k] or rule.replacement[0]) else rule.replacement

          result = text.replace pattern, if typeof replacement is 'string' then replacement else () ->
            eval("GLOBAL['$#{i}'] = '#{arguments[i]}';")  for i in [0...arguments.length]
            replacement.call self.tret

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


  disable: (name) ->
    @rules[name].disabled = true  if @rules[name]?
    return
  
  enable: (name) ->
    @rules[name].disabled = false  if @rules[name]?
    return

  
  
