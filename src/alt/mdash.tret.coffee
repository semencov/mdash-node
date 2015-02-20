class Mdash.Tret
  rules: {}
  classes: {}
  settings: {}
  
  
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

  
  constructor: (@settings={}) ->
    # for id, rule of @rules
    #   rule[key] = val  for key, val of @settings[id]  if @settings[id]? and typeof @settings[id] is 'object'
    #   name = "#{@constructor.name}.#{id}"
    #   @[id] = new Mdash.Rule(name, rule, @classes)
  
    return

  # constructor: (@settings={}) ->
  #   self = @

  #   for id, rule of @rules
  #     self[id] = (text, opts={}) ->
  #       self[id].disabled = false
  #       self[id].patterns = []
  #       self[id].replacement = null
  #       self[id].function = null

  #       settings = rule
  #       settings[key] = val  for key, val of self.settings[id]  if self.settings[id]?
  #       settings[key] = val  for key, val of opts

  #       if settings.disabled?
  #         self[id].disabled = "#{settings.disabled}".toLowerCase() in ["1", "true"]
  #         delete settings['disabled']
          
  #       if settings.enabled?
  #         self[id].disabled = "#{settings.enabled}".toLowerCase() in ["0", "false", "off"]
  #         delete settings['enabled']

  #       if settings.order?
  #         self[id].order = parseInt(settings.order) or 5
  #         delete settings['order']

  #       if settings.function?
  #         fn = settings.function

  #         if typeof fn is 'string'
  #           fn = self[id][fn]  if self[id][fn]?
  #           fn = self[fn]  if self[fn]?
  #           fn = eval(fn)  if eval("typeof " + fn) is 'function'

  #         self[id].function = fn  if typeof fn is 'function'
  #         delete settings['function']

  #       if settings.pattern?
  #         pattern = settings.pattern
  #         pattern = [ pattern ]  if not Array.isArray pattern
  #         self[id].patterns = pattern
  #         delete settings['pattern']

  #       if settings.replacement?
  #         replacement = settings.replacement

  #         if typeof replacement is 'string' and /^[a-z_0-9]+$/i.test(replacement)
  #           replacement = self[id][replacement]  if self[id][replacement]? and typeof self[id][replacement] is 'function'
  #           replacement = self[replacement]  if self[replacement]? and typeof self[replacement] is 'function'
  #           replacement = eval(replacement)  if eval("typeof " + replacement) is 'function'

  #         self[id].replacement = replacement
  #         delete settings['replacement']

  #       self[id][key] = val  for key, val of settings

  #       if self[id].patterns.length and not self[id].replacement? and not self[id].function?
  #         throw new Error("There is no replacement setted for the patterns")
          

  #       # Processing format
  #       return text  if self[id].disabled
  #       self = this

  #       if self[id].function?
  #         result = self[id].function.call self, text
  #         if typeof result isnt 'string'
  #           throw new Error("Custom function returned wrong result")
  #           return text
  #         return result

  #       if self[id].patterns?
  #         for k, pattern of self[id].patterns
  #           replacement = if typeof self[id].replacement is 'object' then (self[id].replacement[k] or self[id].replacement[0]) else self[id].replacement

  #           result = text.replace pattern, if typeof replacement is 'string' then replacement else () ->
  #             eval("GLOBAL['$#{i}'] = '#{arguments[i]}';")  for i in [0...arguments.length]
  #             replacement.call self.tret

  #           text = result  if typeof result is 'string'
  #       text

  #   return

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

    @settings = merge @settings, settings
    return


  apply: (text) ->
    text = @[rule].apply(text)  for rule in Object.getOwnPropertyNames(this)
    text

  
  
  
