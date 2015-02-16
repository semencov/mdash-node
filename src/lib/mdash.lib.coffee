
class Mdash.Lib
  @DEBUG = false or Mdash.DEBUG

  @LAYOUT_STYLE = 1
  @LAYOUT_CLASS = 2
  
  @INTERNAL_BLOCK_OPEN = '%%%INTBLOCKO235978%%%'
  @INTERNAL_BLOCK_CLOSE = '%%%INTBLOCKC235978%%%'

  ###
   * Таблица символов
   *
   * @var array
  ###
  @charsTable =
    '"':
      html: ["&laquo;", "&raquo;", "&ldquo;", "&lsquo;", "&bdquo;", "&ldquo;", "&quot;", "&#171;", "&#187;"]
      utf8: [0x201E, 0x201C, 0x201F, 0x201D, 0x00AB, 0x00BB]
    ' ':
      html: ["&nbsp;", "&thinsp;", "&#160;"]
      utf8: [0x00A0, 0x2002, 0x2003, 0x2008, 0x2009]
    '-':
      html: ["&ndash;", "&minus;", "&#151;", "&#8212;", "&#8211;"]
      utf8: [0x002D, 0x2010, 0x2012, 0x2013]
    '—':
      html: ["&mdash;"]
      utf8: [0x2014]
    '==':
      html: ["&equiv;"]
      utf8: [0x2261]
    '...':
      html: ["&hellip;", "&#0133;"]
      utf8: [0x2026]
    '!=':
      html: ["&ne;", "&#8800;"]
      utf8: [0x2260]
    '<=':
      html: ["&le;", "&#8804;"]
      utf8: [0x2264]
    '>=':
      html: ["&ge;", "&#8805;"]
      utf8: [0x2265]
    '1/2':
      html: ["&frac12;", "&#189;"]
      utf8: [0x00BD]
    '1/4':
      html: ["&frac14;", "&#188;"]
      utf8: [0x00BC]
    '3/4':
      html: ["&frac34;", "&#190;"]
      utf8: [0x00BE]
    '+-':
      html: ["&plusmn;", "&#177;"]
      utf8: [0x00B1]
    '&':
      html: ["&amp;", "&#38;"]
    '(tm)':
      html: ["&trade;", "&#153;"]
      utf8: [0x2122]
    '(r)':
      html: ["&reg;", "&#174;"]
      utf8: [0x00AE]
    '(c)':
      html: ["&copy;", "&#169;"]
      utf8: [0x00A9]
    '§':
      html: ["&sect;", "&#167;"]
      utf8: [0x00A7]
    '`':
      html: ["&#769;"]
    '\'':
      html: ["&rsquo;", "’"]
    'x':
      html: ["&times;", "&#215;"]
      utf8: [0x00D7]

  ###
   * Добавление к тегам атрибута 'id', благодаря которому
   * при повторном типографирование текста будут удалены теги,
   * расставленные данным типографом
   *
   * @var array
  ###
  @typographSpecificTagId = false

  @log: (str, data=null) ->
    console.log("LOG\t #{@constructor.name}\t\t\t", str, data)  if @DEBUG
    return
  
  @error: (info, data=null) ->
    console.error("ERROR\t #{@constructor.name}\t\t\t", info, data)  if @DEBUG
    return
  
  @debug: (obj, place, after_text, after_text_raw="") ->
    console.info("DEBUG\t #{@constructor.name}\t\t\t", place)  if @DEBUG
    return
  

  # Read a file, return its contents.
  @readFile: (filepath) ->
    contents = undefined
    try
      contents = fs.readFileSync(String(filepath))
      return contents
    catch e
      Mdash.Lib.error("Unable to read '#{filepath}' file (Error code: #{e.code}).", e)
    return

  # Read a file, parse its contents, return an object.
  @readJSON: (filepath) ->
    src = @readFile(filepath)
    result = undefined
    try
      result = JSON.parse(src)
      return result
    catch e
      Mdash.Lib.error("Unable to parse '#{filepath}' file (#{e.message}).", e)
    return

  # Read a YAML file, parse its contents, return an object.
  @readYAML: (filepath) ->
    src = @readFile(filepath)
    result = undefined
    try
      result = YAML.load(src)
      return result
    catch e
      Mdash.Lib.error("Unable to parse '#{filepath}' file (#{e.problem}).", e)
    return


  @preg_quote = (str, delimiter) ->
    String str
      .replace new RegExp('[.\\\\+*?\\[\\^\\]$(){}!|:\\' + (delimiter || '') + '-]', 'g'), '\\$&'


  @strip_tags = (input, allowed) ->
    allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')
    tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi

    input.replace commentsAndPhpTags, ''
      .replace tags, ($0, $1) ->
        if allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 then $0 else ''
  


  ###
   * Костыли для работы с символами UTF-8
   * 
   * @author  somebody?
   * @param int $c код символа в кодировке UTF-8 (например, 0x00AB)
   * @return  bool|string
  ###
  @_getUnicodeChar = (c) ->
    if c <= 0x7F
      return String.fromCharCode(c)
    else if c <= 0x7FF
      return String.fromCharCode(0xC0 | c >> 6) + String.fromCharCode(0x80 | c & 0x3F)
    else if c <= 0xFFFF
      return String.fromCharCode(0xE0 | c >> 12) + String.fromCharCode(0x80 | c >> 6 & 0x3F) + String.fromCharCode(0x80 | c & 0x3F)
    else if c <= 0x10FFFF
      return String.fromCharCode(0xF0 | c >> 18) + String.fromCharCode(0x80 | c >> 12 & 0x3F) + String.fromCharCode(0x80 | c >> 6 & 0x3F) + String.fromCharCode(0x80 | c & 0x3F)
    else
      return false


  ###
   * Удаление кодов HTML из текста
   *
   * <code>
   *  // Remove UTF-8 chars:
   *  $str = Mdash.Lib::clear_special_chars('your text', 'utf8');
   *  // ... or HTML codes only:
   *  $str = Mdash.Lib::clear_special_chars('your text', 'html');
   *  // ... or combo:
   *  $str = Mdash.Lib::clear_special_chars('your text');
   * </code>
   *
   * @param   string $text
   * @param   mixed $mode
   * @return  string|bool
  ###
  @clear_special_chars = (text, mode=null) ->
    mode = [mode]  if _.isString mode
    mode = ['utf8', 'html']  if not mode?
    return false  if not _.isArray mode
    moder = []

    for mod in mode
      moder.push mod  if mod in ['utf8','html']
    return false  if moder.length is 0

    for char, vals of @charsTable
      for type in mode
        if vals[type]?
          for v in vals[type]
            if type is 'utf8' and _.isFinite(v)
              v = @_getUnicodeChar(v)

            if type is 'html'
              if v.match(/<[a-z]+>/gi)
                v = @safe_tag_chars(v, true)

            text = text.replace(new RegExp(v, 'ig'), char)  if v

    return text
  
  ###
   * Удаление тегов HTML из текста
   * Тег <br /> будет преобразов в перенос строки \n, сочетание тегов </p><p> -
   * в двойной перенос
   *
   * @param   string $text
   * @param   array $allowableTag массив из тегов, которые будут проигнорированы
   * @return  string
  ###
  @remove_html_tags = (text, allowableTag=null) ->
    ignore = null
    
    if allowableTag?
      allowableTag = [allowableTag]  if _.isString allowableTag

      if _.isArray allowableTag
        tags = []
        for tag in allowableTag
          continue  if tag.substr(0, 1) isnt '<' or tag.substr(-1, 1) isnt '>'
          continue  if tag.substr(1, 1) is '/'
          tags.push tag

        ignore = tags.join('')

    text = text.replace [/\<br\s*\/?>/gi, /\<\/p\>\s*\<p\>/g], ["\n","\n\n"]
    text = @strip_tags text, ignore
    text
  
  ###
   * Сохраняем содержимое тегов HTML
   *
   * Тег 'a' кодируется со специальным префиксом для дальнейшей
   * возможности выносить за него кавычки.
   * 
   * @param   string $text
   * @param   bool $safe
   * @return  string
  ###
  @safe_tag_chars = (text, way) ->
    self = @
    if way
      text = text.replace /(\<\/?)(.+?)(\>)/g, ($0, $1, $2, $3) ->
        $1 + (if $2.trim().substr(0, 1) is "a" then "%%%__" else "") + self.encrypt_tag($2.trim()) + $3
    else
      text = text.replace /(\<\/?)(.+?)(\>)/g, ($0, $1, $2, $3) ->
        $1 + (if $2.trim().substr(0, 5) is "%%%__" then self.decrypt_tag($2.trim().substr(5)) else self.decrypt_tag($2.trim())) + $3
    text
    
    
  ###
   * Декодриует спец блоки
   *
   * @param   string $text
   * @return  string
  ###
  @decode_internal_blocks = (text="") ->
    self = @
    text = text.replace new RegExp("#{@INTERNAL_BLOCK_OPEN}([a-zA-Z0-9\/=]+?)#{@INTERNAL_BLOCK_CLOSE}", 'g'), ($0, $1) ->
      self.decrypt_tag($1)
    text
    
  ###
   * Кодирует спец блок
   *
   * @param   string $text
   * @return  string
  ###
  @iblock = (text="") ->
    "#{@INTERNAL_BLOCK_OPEN}#{@encrypt_tag(text)}#{@INTERNAL_BLOCK_CLOSE}"
    
    
  ###
   * Создание тега с защищенным содержимым 
   *
   * @param   string $content текст, который будет обрамлен тегом
   * @param   string $tag тэг 
   * @param   array $attribute список атрибутов, где ключ - имя атрибута, а значение - само значение данного атрибута
   * @return  string
  ###
  @build_safe_tag = (content, tag='span', attribute={}, layout=@LAYOUT_STYLE) ->
    htmlTag = tag
  
    if @_typographSpecificTagId
      if not attribute.id?
        attribute.id = 'mdash-2' + mt_rand(1000, 9999)
    
    classname = ""
    if attribute.length
      if layout & @LAYOUT_STYLE
        if attribute.__style?
          if attribute.style?
            st = attribute.style.trim()
            st += ";"  if st.substr(-1) isnt ";"
            st += attribute.__style
            attribute.style = st
          else
            attribute.style = attribute.__style

          delete attribute['__style']

      for attr, value of attribute
        continue  if attr is "__style"
        if attr is "class"
          classname = "#{value}"
          continue

        htmlTag += " #{attr}=\"#{value}\""
      
    if layout & @LAYOUT_CLASS and classname
      htmlTag += " class=\"#{classname}\""
      
    "<#{@encrypt_tag(htmlTag)}>#{content}</#{@encrypt_tag(tag)}>"

    
  ###
   * Метод, осуществляющий кодирование (сохранение) информации
   * с целью невозможности типографировать ее
   *
   * @param   string $text
   * @return  string
  ###
  @encrypt_tag = (text) ->
    new Buffer(text).toString('base64')

  ###
   * Метод, осуществляющий декодирование информации
   *
   * @param   string $text
   * @return  string
  ###
  @decrypt_tag = (text) ->
    new Buffer(text, 'base64').toString('utf8')
    
    
  @strpos_ex = (haystack, needle, offset = null) ->
    if _.isArray needle
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

    
  @process_selector_pattern = (pattern) ->
    return  if pattern is false
    pattern = @preg_quote(pattern, '/')
    pattern = pattern.replace("\\*", "[a-z0-9_\-]*")
    pattern = new RegExp("^#{pattern}$", 'ig')

  @_test_pattern = (pattern, text) ->
    return true  if pattern is false
    return text.match(pattern)

  
  @strtolower = (string) ->
    convert_to = [
      "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", 
      "v", "w", "x", "y", "z", "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", 
      "ð", "ñ", "ò", "ó", "ô", "õ", "ö", "ø", "ù", "ú", "û", "ü", "ý", "а", "б", "в", "г", "д", "е", "ё", "ж", 
      "з", "и", "й", "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы", 
      "ь", "э", "ю", "я" 
    ]
    convert_from = [
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", 
      "V", "W", "X", "Y", "Z", "À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï", 
      "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", 
      "З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ъ", 
      "Ь", "Э", "Ю", "Я" 
    ]
    
    string.replace(convert_from, convert_to)
  

  # // взято с http://www.w3.org/TR/html4/sgml/entities.html
  @html4_char_ents =
    'nbsp': 160
    'iexcl': 161
    'cent': 162
    'pound': 163
    'curren': 164
    'yen': 165
    'brvbar': 166
    'sect': 167
    'uml': 168
    'copy': 169
    'ordf': 170
    'laquo': 171
    'not': 172
    'shy': 173
    'reg': 174
    'macr': 175
    'deg': 176
    'plusmn': 177
    'sup2': 178
    'sup3': 179
    'acute': 180
    'micro': 181
    'para': 182
    'middot': 183
    'cedil': 184
    'sup1': 185
    'ordm': 186
    'raquo': 187
    'frac14': 188
    'frac12': 189
    'frac34': 190
    'iquest': 191
    'Agrave': 192
    'Aacute': 193
    'Acirc': 194
    'Atilde': 195
    'Auml': 196
    'Aring': 197
    'AElig': 198
    'Ccedil': 199
    'Egrave': 200
    'Eacute': 201
    'Ecirc': 202
    'Euml': 203
    'Igrave': 204
    'Iacute': 205
    'Icirc': 206
    'Iuml': 207
    'ETH': 208
    'Ntilde': 209
    'Ograve': 210
    'Oacute': 211
    'Ocirc': 212
    'Otilde': 213
    'Ouml': 214
    'times': 215
    'Oslash': 216
    'Ugrave': 217
    'Uacute': 218
    'Ucirc': 219
    'Uuml': 220
    'Yacute': 221
    'THORN': 222
    'szlig': 223
    'agrave': 224
    'aacute': 225
    'acirc': 226
    'atilde': 227
    'auml': 228
    'aring': 229
    'aelig': 230
    'ccedil': 231
    'egrave': 232
    'eacute': 233
    'ecirc': 234
    'euml': 235
    'igrave': 236
    'iacute': 237
    'icirc': 238
    'iuml': 239
    'eth': 240
    'ntilde': 241
    'ograve': 242
    'oacute': 243
    'ocirc': 244
    'otilde': 245
    'ouml': 246
    'divide': 247
    'oslash': 248
    'ugrave': 249
    'uacute': 250
    'ucirc': 251
    'uuml': 252
    'yacute': 253
    'thorn': 254
    'yuml': 255
    'fnof': 402
    'Alpha': 913
    'Beta': 914
    'Gamma': 915
    'Delta': 916
    'Epsilon': 917
    'Zeta': 918
    'Eta': 919
    'Theta': 920
    'Iota': 921
    'Kappa': 922
    'Lambda': 923
    'Mu': 924
    'Nu': 925
    'Xi': 926
    'Omicron': 927
    'Pi': 928
    'Rho': 929
    'Sigma': 931
    'Tau': 932
    'Upsilon': 933
    'Phi': 934
    'Chi': 935
    'Psi': 936
    'Omega': 937
    'alpha': 945
    'beta': 946
    'gamma': 947
    'delta': 948
    'epsilon': 949
    'zeta': 950
    'eta': 951
    'theta': 952
    'iota': 953
    'kappa': 954
    'lambda': 955
    'mu': 956
    'nu': 957
    'xi': 958
    'omicron': 959
    'pi': 960
    'rho': 961
    'sigmaf': 962
    'sigma': 963
    'tau': 964
    'upsilon': 965
    'phi': 966
    'chi': 967
    'psi': 968
    'omega': 969
    'thetasym': 977
    'upsih': 978
    'piv': 982
    'bull': 8226
    'hellip': 8230
    'prime': 8242
    'Prime': 8243
    'oline': 8254
    'frasl': 8260
    'weierp': 8472
    'image': 8465
    'real': 8476
    'trade': 8482
    'alefsym': 8501
    'larr': 8592
    'uarr': 8593
    'rarr': 8594
    'darr': 8595
    'harr': 8596
    'crarr': 8629
    'lArr': 8656
    'uArr': 8657
    'rArr': 8658
    'dArr': 8659
    'hArr': 8660
    'forall': 8704
    'part': 8706
    'exist': 8707
    'empty': 8709
    'nabla': 8711
    'isin': 8712
    'notin': 8713
    'ni': 8715
    'prod': 8719
    'sum': 8721
    'minus': 8722
    'lowast': 8727
    'radic': 8730
    'prop': 8733
    'infin': 8734
    'ang': 8736
    'and': 8743
    'or': 8744
    'cap': 8745
    'cup': 8746
    'int': 8747
    'there4': 8756
    'sim': 8764
    'cong': 8773
    'asymp': 8776
    'ne': 8800
    'equiv': 8801
    'le': 8804
    'ge': 8805
    'sub': 8834
    'sup': 8835
    'nsub': 8836
    'sube': 8838
    'supe': 8839
    'oplus': 8853
    'otimes': 8855
    'perp': 8869
    'sdot': 8901
    'lceil': 8968
    'rceil': 8969
    'lfloor': 8970
    'rfloor': 8971
    'lang': 9001
    'rang': 9002
    'loz': 9674
    'spades': 9824
    'clubs': 9827
    'hearts': 9829
    'diams': 9830
    'quot': 34
    'amp': 38
    'lt': 60
    'gt': 62
    'OElig': 338
    'oelig': 339
    'Scaron': 352
    'scaron': 353
    'Yuml': 376
    'circ': 710
    'tilde': 732
    'ensp': 8194
    'emsp': 8195
    'thinsp': 8201
    'zwnj': 8204
    'zwj': 8205
    'lrm': 8206
    'rlm': 8207
    'ndash': 8211
    'mdash': 8212
    'lsquo': 8216
    'rsquo': 8217
    'sbquo': 8218
    'ldquo': 8220
    'rdquo': 8221
    'bdquo': 8222
    'dagger': 8224
    'Dagger': 8225
    'permil': 8240
    'lsaquo': 8249
    'rsaquo': 8250
    'euro': 8364
  
  ###
   * Вернуть уникод символ по html entinty
   *
   * @param string $entity
   * @return string
  ###
  @html_char_entity_to_unicode = (entity) ->
    return @_getUnicodeChar(@html4_char_ents[entity])  if @html4_char_ents[entity]?
    return false
  
  ###
   * Сконвериторвать все html entity в соответсвующие юникод символы
   *
   * @param string $text
  ###
  @convert_html_entities_to_unicode = (text) ->
    text = text.replace /\&#([0-9]+)\;/g, (match, m) ->
      Mdash.Lib._getUnicodeChar(parseInt(m))

    text = text.replace /\&#x([0-9A-F]+)\;/g, (match, m) ->
      Mdash.Lib._getUnicodeChar(parseInt(m, 16))

    text = text.replace /\&([a-zA-Z0-9]+)\;/g, (match, m) ->
      r = Mdash.Lib.html_char_entity_to_unicode(m)
      return r or match
    text
  
  @rstrpos = (haystack, needle, offset=0) ->
    if haystack.trim() isnt "" and needle.trim() isnt "" and offset <= haystack.length
      last_pos = offset
      found = false
      while curr_pos = haystack.substr(last_pos).indexOf(needle) isnt false
        found = true
        last_pos = curr_pos + 1
      
      return if found then last_pos - 1 else false
    else
      return false
  
  @ifop = (cond, isTrue, isFalse) ->
    return if cond then isTrue else isFalse


