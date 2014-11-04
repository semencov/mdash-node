# Mdash.Lib = require "./mdash.lib"
# Mdash.Tret = require "./mdash.tret"

class Mdash.Tret.Quote extends Mdash.Tret
  title: "Кавычки"

  __ax: 0
  __ay: 0
  
  rules:
    quotes_outside_a:
      description: 'Кавычки вне тэга <a>'
      pattern: /(\<\%\%\%\_\_[^\>]+\>)\"(.+?)\"(\<\/\%\%\%\_\_[^\>]+\>)/g
      replacement: (match, m) -> "&laquo;#{m[1]}#{m[2]}#{m[3]}&raquo;"
    open_quote:
      description: 'Открывающая кавычка'
      pattern: /(^|\(|\s|\>|-)(\"|\\\"|\&laquo\;)(\S+)/ig
      replacement: (match, m) -> "#{m[1]}#{@QUOTE_FIRS_OPEN}#{m[3]}"
    close_quote:
      description: 'Закрывающая кавычка'
      pattern: /([a-zа-яё0-9]|\.|\&hellip\;|\!|\?|\>|\)|\:)((\"|\\\"|\&raquo\;)+)(\.|\&hellip\;|\;|\:|\?|\!|\,|\s|\)|\<\/|$)/gi
      replacement: (match, m) ->
        "#{m[1]}" + @str_repeat(@QUOTE_FIRS_CLOSE, (m[2].split("\"").length - 1) + (m[2].split("&raquo;").length - 1)) + "#{m[4]}"
    close_quote_adv:
      description: 'Закрывающая кавычка особые случаи'
      pattern: [
        /([a-zа-яё0-9]|\.|\&hellip\;|\!|\?|\>|\)|\:)((\"|\\\"|\&laquo\;)+)(\<[^\>]+\>)(\.|\&hellip\;|\;|\:|\?|\!|\,|\)|\<\/|$| )/gi
        /([a-zа-яё0-9]|\.|\&hellip\;|\!|\?|\>|\)|\:)(\s+)((\"|\\\")+)(\s+)(\.|\&hellip\;|\;|\:|\?|\!|\,|\)|\<\/|$| )/gi
        /\>(\&laquo\;)\.($|\s|\<)/gi
        /\>(\&laquo\;),($|\s|\<|\S)/gi
        /\>(\&laquo\;):($|\s|\<|\S)/gi
      ]
      replacement: [
        (match, m) -> "#{m[1]}" + @str_repeat(@QUOTE_FIRS_CLOSE, (m[2].split("\"").length - 1) + (m[2].split("&laquo;").length - 1)) + "#{m[4]}#{m[5]}"
        (match, m) -> "#{m[1]}#{m[2]}" + @str_repeat(@QUOTE_FIRS_CLOSE,(m[3].split("\"").length - 1) + (m[3].split("&laquo;").length - 1)) + "#{m[5]}#{m[6]}"
        '>&raquo;.$2'
        '>&raquo;,$2'
        '>&raquo;:$2'
      ]
    open_quote_adv:
      description: 'Открывающая кавычка особые случаи'
      pattern: /(^|\(|\s|\>)(\"|\\\")(\s)(\S+)/gi
      replacement: (match, m) -> "#{m[1]}#{@QUOTE_FIRS_OPEN}#{m[4]}"
    quotation:
      # disabled: true
      description: 'Внутренние кавычки-лапки и дюймы'
      function: 'build_sub_quotations'


  str_repeat: (string, num) ->
    new Array(parseInt(num) + 1).join(string)

  inject_in: (index, string) ->
    @text = @text.substring(0, index) + string + @text.substring(index + string.length, @text.length)

  build_sub_quotations: () ->
    okposstack = [0]
    okpos = 0
    level = 0
    offset = 0

    while(true)
      p = Mdash.Lib.strpos_ex @text, ["&laquo;", "&raquo;"], offset
      break  if p is false
      
      if p.str is "&laquo;"
        @inject_in p.pos, @QUOTE_CRAWSE_OPEN  if level > 0 and not @is_on('no_bdquotes')
        level++

      if p.str is "&raquo;"
        level--
        @inject_in p.pos, @QUOTE_CRAWSE_CLOSE  if level > 0 and not @is_on('no_bdquotes')

      offset = p.pos + "#{p.str}".length

      if level is 0
        okpos = offset
        okposstack.push okpos
      else
        if level < 0
          if not @is_on('no_inches')
            amount = 0
            while amount is 0 and okposstack.length
              lokpos = okposstack.pop()

              k = @text.substr lokpos, offset-lokpos
              k = k.replace @QUOTE_CRAWSE_OPEN, @QUOTE_FIRS_OPEN
              k = k.replace @QUOTE_CRAWSE_CLOSE, @QUOTE_FIRS_CLOSE

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
            @text = @text.substr(0, lokpos) + k + @text.substr(offset)
            offset = lokpos
            level = 0
            continue

          if amount is 0
            level = 0
            @text = @text.substr(0, p.pos) + '&quot;' + @text.substr(offset)
            offset = p.pos + "&quot;".length
            okposstack = [offset]
            continue

    if level isnt 0
      if level > 0
        k = @text.substr okpos
        k = k.replace @QUOTE_CRAWSE_OPEN, @QUOTE_FIRS_OPEN
        k = k.replace @QUOTE_CRAWSE_CLOSE, @QUOTE_FIRS_CLOSE
        @text = @text.substr(0, okpos) + k

    return @text

