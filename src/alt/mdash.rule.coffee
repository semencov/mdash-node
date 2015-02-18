class Mdash.Rule

  name: null
  disabled: false
  order: 5
  classes: {}
  patterns: []
  replacement: null
  function: null

  constructor: (@name, opts, @classes={}) ->
    if opts.disabled?
      @disabled = "#{opts.disabled}".toLowerCase() in ["1", "true"]
      delete opts['disabled']

    if opts.order?
      @order = parseInt(opts.order) or 5
      delete opts['order']

    if opts.function?
      fn = opts.function

      if typeof fn is 'string'
        fn = @[fn]  if @[fn]?
        fn = eval(fn)  if eval("typeof " + fn) is 'function'

      @function = fn  if typeof fn is 'function'
      delete opts['function']

    if opts.pattern?
      pattern = opts.pattern
      pattern = [ pattern ]  if not Array.isArray pattern
      @patterns = pattern
      delete opts['pattern']

    if opts.replacement?
      replacement = opts.replacement

      if typeof replacement is 'string' and /^[a-z_0-9]+$/i.test(replacement)
        replacement = @[replacement]  if @[replacement]? and typeof @[replacement] is 'function'
        replacement = eval(replacement)  if eval("typeof " + replacement) is 'function'

      @replacement = replacement
      delete opts['replacement']

    @[key] = val  for key, val of opts

    if @patterns.length and not @replacement? and not @function?
      throw new Error("There is no replacement setted for the patterns")

    return this

  apply: (text, opts={}) ->
    console.log "Running #{@name}..."
    console.log " - Rule #{@name} is disabled. Skipping..."  if @disabled
    return text  if @disabled
    self = this

    if @function?
      console.log " - Rule #{@name} has custom function. Applying..."
      result = fn.call @tret, text
      if typeof result isnt 'string'
        throw new Error("Custom function returned wrong result")
        return text
      return result

    if @patterns?
      for k, pattern of @patterns
        replacement = if typeof @replacement is 'object' then (@replacement[k] or @replacement[0]) else @replacement

        result = text.replace pattern, if typeof replacement is 'string' then replacement else () ->
          eval("GLOBAL['$#{i}'] = '#{arguments[i]}';")  for i in [0...arguments.length]
          console.log " - Rule #{self.name} matched pattern. Applying to '#{$0}'..."
          replacement.call self

        text = result  if typeof result is 'string'
    text
  
  disable: ->
    @disabled = true
    return
  
  enable: ->
    @disabled = false
    return
  