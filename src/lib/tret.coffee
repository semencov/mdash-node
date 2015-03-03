Lib = require './lib'

module.exports = class Tret
  rules: {}
  classes: {}
  settings: {}
  order: 5
  
  constructor: (options) ->
    @set options  if options? and typeof options is 'objects'
    return

  apply: (text, options={}) ->
    self = @

    for id in @getRuleNames(options)
      rule = @rules[id]
      opts = options[id] or {}

      continue  if opts['disabled']

      if rule.function?
        result = rule.function.call self, text, opts

        if typeof result isnt 'string'
          throw new Error("Custom function did not return string. Result is #{(typeof result)}")
          continue
        text = result

      if rule.pattern?
        for k, pattern of rule.pattern
          replacement = if typeof rule.replacement is 'object' then (rule.replacement[k] or rule.replacement[0]) else rule.replacement

          result = text.replace pattern, if typeof replacement is 'string' then replacement else () ->
            replacement.call self, arguments, opts

          text = result  if typeof result is 'string'
    text

  getRuleNames: (options={}) ->
    self = @

    Object
      .keys @rules
      .sort (a, b) -> (options[a]?['order'] or 5) - (options[b]?['order'] or 5)
