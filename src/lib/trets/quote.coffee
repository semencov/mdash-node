Tret = require "../tret"
Lib = require '../lib'

module.exports = class Quote extends Tret

  __ax: 0
  __ay: 0

  order: 3
  
  rules:

    # Кавычки вне тэга <a>
    quotes_outside_a:
      pattern: [
        /(\<\%\%\%\_\_[^\>]+\>)\"(.+?)\"(\<\/\%\%\%\_\_[^\>]+\>)/g
      ]
      replacement: [
        ($) -> "&laquo;#{$[1]}#{$[2]}#{$[3]}&raquo;"
      ]

    # Открывающая кавычка
    open_quote:
      pattern: [
        /(^|\(|\s|\>|-)(\"|\&laquo\;)(\S+)/ig
      ]
      replacement: [
        ($) -> "#{$[1]}#{Lib.QUOTE_FIRS_OPEN}#{$[3]}"
      ]
    
    # Закрывающая кавычка
    close_quote:
      pattern: [
        /([a-zа-яё0-9]|\.|\&hellip\;|\!|\?|\>|\)|\:)((\"|\&raquo\;)+)(\.|\&hellip\;|\&nbsp\;|\;|\:|\?|\!|\,|\s|\)|\<\/|$)/gi
      ]
      replacement: [
        ($) -> $[1] + @str_repeat(Lib.QUOTE_FIRS_CLOSE, ($[2].split("\"").length - 1) + ($[2].split("&raquo;").length - 1)) + $[4]
      ]

    # Закрывающая кавычка особые случаи
    close_quote_adv:
      pattern: [
        /([a-zа-яё0-9]|\.|\&hellip\;|\!|\?|\>|\)|\:)((\"|\&laquo\;)+)(\<[^\>]+\>)(\.|\&hellip\;|\&nbsp\;|\;|\:|\?|\!|\,|\)|\<\/|$| )/gi
        /([a-zа-яё0-9]|\.|\&hellip\;|\!|\?|\>|\)|\:)(\s+)(\"+)(\s+)(\.|\&hellip\;|\&nbsp\;|\;|\:|\?|\!|\,|\)|\<\/|$| )/gi
        /\>(\&laquo\;)\.($|\s|\<)/gi
        /\>(\&laquo\;),($|\s|\<|\S)/gi
        /\>(\&laquo\;):($|\s|\<|\S)/gi
      ]
      replacement: [
        ($) -> $[1] + @str_repeat(Lib.QUOTE_FIRS_CLOSE, ($[2].split("\"").length - 1) + ($[2].split("&laquo;").length - 1)) + "#{$[4]}#{$[5]}"
        ($) -> "#{$[1]}#{$[2]}" + @str_repeat(Lib.QUOTE_FIRS_CLOSE,($[3].split("\"").length - 1) + ($[3].split("&laquo;").length - 1)) + "#{$[5]}#{$[6]}"
        ($) -> ">&raquo;.#{$[2]}"
        ($) -> ">&raquo;,#{$[2]}"
        ($) -> ">&raquo;:#{$[2]}"
      ]

    # Открывающая кавычка особые случаи
    open_quote_adv:
      pattern: [
        /(^|\(|\s|\>)(\"|\\\")(\s)(\S+)/gi
      ]
      replacement: [
        ($) -> "#{$[1]}#{Lib.QUOTE_FIRS_OPEN}#{$[4]}"
      ]

    # Внутренние кавычки-лапки и дюймы
    quotation:
      function: (text, opts) ->
        okposstack = [0]
        okpos = 0
        level = 0
        offset = 0

        while (true)
          p = @strpos_ex text, ["&laquo;", "&raquo;"], offset
          break  if p is false

          if p.str is "&laquo;"
            text = @inject_in text, p.pos, Lib.QUOTE_CRAWSE_OPEN  if level > 0 and not opts.no_bdquotes
            level++

          if p.str is "&raquo;"
            level--
            text = @inject_in text, p.pos, Lib.QUOTE_CRAWSE_CLOSE  if level > 0 and not opts.no_bdquotes

          offset = p.pos + "#{p.str}".length

          if level is 0
            okpos = offset
            okposstack.push okpos
          else
            if level < 0
              if not opts.no_inches
                amount = 0
                while amount is 0 and okposstack.length
                  lokpos = okposstack.pop()

                  k = text.substr lokpos, offset-lokpos
                  k = k.replace Lib.QUOTE_CRAWSE_OPEN, Lib.QUOTE_FIRS_OPEN
                  k = k.replace Lib.QUOTE_CRAWSE_CLOSE, Lib.QUOTE_FIRS_CLOSE

                  amount = 0
                  @__ax = (k.match(/(^|[^0-9])([0-9]+)\&raquo\;/gi) or []).length
                  @__ay = 0

                  if @__ax
                    self = @
                    k = k.replace /(^|[^0-9])([0-9]+)\&raquo\;/gi, ($0, $1, $2) ->
                      self.__ay++
                      return "#{$1}#{$2}&Prime;"  if self.__ay is self.__ax
                      return $0
                    amount = 1

              if amount is 1
                text = text.substr(0, lokpos) + k + text.substr(offset)
                offset = lokpos
                level = 0
                continue

              if amount is 0
                level = 0
                text = text.substr(0, p.pos) + '&quot;' + text.substr(offset)
                offset = p.pos + "&quot;".length
                okposstack = [offset]
                continue

        if level isnt 0
          if level > 0
            k = text.substr okpos
            k = k.replace Lib.QUOTE_CRAWSE_OPEN, Lib.QUOTE_FIRS_OPEN
            k = k.replace Lib.QUOTE_CRAWSE_CLOSE, Lib.QUOTE_FIRS_CLOSE
            text = text.substr(0, okpos) + k

        return text


  str_repeat: (string, num) ->
    new Array(parseInt(num) + 1).join(string)

  inject_in: (text, index, string) ->
    text = text.substring(0, index) + string + text.substring(index + string.length, text.length)
    text

  strpos_ex: (haystack, needle, offset = null) ->
    if Array.isArray needle
      m = -1
      w = false

      for n in needle
        p = haystack.indexOf n, offset

        continue  if p is -1

        if m is -1
          m = p
          w = n
          continue

        if p < m
          m = p
          w = n

      return false  if m is -1
      return {pos: m, str: w}
    haystack.indexOf needle, offset

