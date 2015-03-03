colors = require('colors')

exports.LAYOUT_STYLE = LAYOUT_STYLE = 1
exports.LAYOUT_CLASS = LAYOUT_CLASS = 2

exports.LAYOUT              = exports.LAYOUT_STYLE
exports.LAYOUT_CLASS_PREFIX = 'mdash-'
exports.LAYOUT_TAG_ID       = false

exports.BASE64_PARAGRAPH_TAG = 'cA==' # // p
exports.BASE64_BREAKLINE_TAG = 'YnIgLw==' # // br / (с пробелом и слэшем)
exports.BASE64_NOBR_OTAG     = 'bm9icg==' # // nobr
exports.BASE64_NOBR_CTAG     = 'L25vYnI=' # // /nobr

exports.QUOTE_FIRS_OPEN    = '&laquo;'
exports.QUOTE_FIRS_CLOSE   = '&raquo;'
exports.QUOTE_CRAWSE_OPEN  = '&bdquo;'
exports.QUOTE_CRAWSE_CLOSE = '&ldquo;'

exports.INTERNAL_BLOCK_OPEN = INTERNAL_BLOCK_OPEN = '%%%INTBLOCKO235978%%%'
exports.INTERNAL_BLOCK_CLOSE = INTERNAL_BLOCK_CLOSE = '%%%INTBLOCKC235978%%%'


__classes =
  'nowrap'           : "white-space:nowrap;"
  'oa-obracket-sp-s' : "margin-right:0.3em;"
  'oa-obracket-sp-b' : "margin-left:-0.3em;"
  'oa-obracket-nl-b' : "margin-left:-0.3em;"
  'oa-comma-b'       : "margin-right:-0.2em;"
  'oa-comma-e'       : "margin-left:0.2em;"
  'oa-oquote-nl'     : "margin-left:-0.44em;"
  'oa-oqoute-sp-s'   : "margin-right:0.44em;"
  'oa-oqoute-sp-q'   : "margin-left:-0.44em;"

###
 * Таблица символов
 *
 * @var array
###
__charsTable =
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

# // взято с http://www.w3.org/TR/html4/sgml/entities.html
__htmlCharEnts =
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


__stripTags = (input, allowed) ->
  allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')
  tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
  commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi

  input
    .replace commentsAndPhpTags, ''
    .replace tags, ($0, $1) ->
      if allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 then $0 else ''


exports.extend = (object, properties) ->
  object[key] = val  for key, val of properties
  object

exports.merge = (options, overrides) ->
  exports.extend (exports.extend {}, options), overrides

exports.omit = (object, keys) ->
  result = {}
  keys = [keys]  if typeof keys is 'string'

  for key, val of object
    result[key] = val  if key not in keys

  result

# TODO: is it needed at all?
exports.preg_quote = (str, delimiter) ->
  String str
    .replace new RegExp('[.\\\\+*?\\[\\^\\]$(){}!|:\\' + (delimiter || '') + '-]', 'g'), '\\$&'


###
 * Метод, осуществляющий кодирование (сохранение) информации
 * с целью невозможности типографировать ее
 *
 * @param   string $text
 * @return  string
###
exports.encode = (text) ->
  new Buffer(text).toString('base64')

###
 * Метод, осуществляющий декодирование информации
 *
 * @param   string $text
 * @return  string
###
exports.decode = (text) ->
  new Buffer(text, 'base64').toString('utf8')
  


###
 * Удаление кодов HTML из текста
###
exports.clearSpecialChars = (text, mode=null) ->
  mode = [mode]  if typeof mode is 'string'
  mode = ['utf8', 'html']  if not mode?
  return false  if not Array.isArray mode

  moder = []
  moder.push mod  if mod in ['utf8','html']  for mod in mode

  return false  if moder.length is 0

  for char, vals of __charsTable
    for type in mode
      if vals[type]?
        for v in vals[type]
          v = String.fromCharCode(v)  if type is 'utf8' and not isNaN(v)
          v = exports.processTags(v, exports.encode)  if type is 'html' and /<[a-z]+>/gi.test(v)
          text = text.replace(new RegExp(v, 'ig'), char)  if v?

  text

###
 * Удаление тегов HTML из текста
 * Тег <br /> будет преобразов в перенос строки \n, сочетание тегов </p><p> -
 * в двойной перенос
 *
 * @param   string $text
 * @param   array $allowableTag массив из тегов, которые будут проигнорированы
 * @return  string
###
exports.removeHtmlTags = (text, allowableTag=null) ->
  ignore = null
  
  if allowableTag?
    allowableTag = [allowableTag]  if typeof allowableTag is 'string'

    if Array.isArray allowableTag
      tags = []
      for tag in allowableTag
        continue  if tag.substr(0, 1) isnt '<' or tag.substr(-1, 1) isnt '>'
        continue  if tag.substr(1, 1) is '/'
        tags.push tag

      ignore = tags.join('')

  text = text.replace [/\<br\s*\/?>/gi, /\<\/p\>\s*\<p\>/g], ["\n","\n\n"]
  text = stripTags text, ignore
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
exports.processTags = (text="", processor=((txt)->txt)) ->
  text.replace /(\<\/?)(.+?)(\>)/gi, ($0, $1, $2, $3) ->
    $2 = "#{$2}".trim()
    
    if $2.trim() is "a"
      $2 = "%%%__" + processor($2)  
    else if $2.substr(0, 5) is "%%%__"
      $2 = processor($2.substr(5))
    else
      $2 = processor($2)

    "#{$1}#{$2}#{$3}"
  
###
 * Add Safe block/tag for exclusion
###
exports.addSafeBlock = (id, tag) ->
  if not tag?
    tag = []
    tag.push "<#{id}[^>]*?>"
    tag.push "</#{id}>"

  tag.map (str) ->
    String(str).replace new RegExp('[.\\\\+*?\\[\\^\\]$(){}!|:\\/-]', 'g'), '\\$&'

  pattern = new RegExp "(#{tag[0]})((?:.|\\n|\\r)*?)(#{tag[1]})", "ig"

  {id: id, pattern: pattern}

exports.processSafeBlocks = (text="", blocks=[], processor=((txt)->txt), reverse=false) ->
  for block in (if reverse then blocks.reverse() else blocks)
    text = text.replace block.pattern, ($0, $1, $2, $3) ->
      $1 + processor($2) + $3
  text

  return text


exports.processSelectorPattern = (pattern) ->
  return  if pattern is false
  pattern = exports.preg_quote(pattern, '/')
  pattern = pattern.replace("\\*", "[a-z0-9_\-]*")
  pattern = new RegExp("^#{pattern}$", 'ig')
  pattern

exports.selectRules = (mask="*", rules={}) ->
  selected = {}
  mask = [mask]  if typeof mask is 'string'

  for m in mask
    m = m.split(".")
    name = m[0]

    # pattern = exports.preg_quote(name, '/')
    pattern = name.replace(/\*/g, "[a-z0-9_\-]*")
    pattern = new RegExp("^#{pattern}$", 'ig')

    names = []

    if typeof rules is 'object'
      if Array.isArray(rules)
        selected = []
        names = rules
      else
        names = Object.keys(rules)

    names.map (key) ->
      if Array.isArray(selected)
        selected.push key  if key.match pattern
      else
        selected[key] = rules[key]  if key.match pattern
      return

    selected[name] = exports.selectRules(m.slice(1).join("."), rules[name])  if m.length > 1 and selected[name]?
  selected

exports.processSettings = (options={}, defaults={}) ->
  return options if typeof options isnt 'object'

  settings = {}

  for selector, value of options
    value = true   if "#{value}".toLowerCase() in ["on", "true", "1", "direct"]
    value = false  if "#{value}".toLowerCase() in ["off", "false", "0"]
    value = {disabled: (value is false)}  if typeof value is 'boolean'

    if typeof value is 'object'
      if defaults[selector]? and typeof defaults[selector] is 'object'
        value = exports.extend(exports.omit(value, 'selector'), exports.omit(defaults[selector], 'disabled'))

      if 'description' of value
        delete value['description']

      if 'hide' of value
        delete value['hide']

      if 'setting' of value
        value[value.setting] = true
        delete value['setting']

      if 'disabled' not of value and Object.keys(value).length is 0
        value.disabled = false

      if 'selector' of value
        continue  if Object.keys(value).length is 1

        value.selector = [value.selector]  if typeof value.selector is 'string'
        val = exports.omit(value, 'selector')

        if Object.keys(value).length > 2
          if value['disabled'] is true
            continue
          else
            val = exports.omit(val, 'disabled')

        for select in value.selector
          settings[select] = exports.merge(val, settings[select])
        continue

      value = exports.omit(value, 'selector')

    settings[selector] = exports.merge(value, settings[selector])
  settings

###
 * Декодриует спец блоки
 *
 * @param   string $text
 * @return  string
###
exports.decodeInternalBlocks = (text="") ->
  text.replace new RegExp("#{INTERNAL_BLOCK_OPEN}([a-zA-Z0-9\/=]+?)#{INTERNAL_BLOCK_CLOSE}", 'g'), ($0, $1) -> exports.decode($1)
  
###
 * Кодирует спец блок
 *
 * @param   string $text
 * @return  string
###
exports.iblock = (text="") ->
  "#{INTERNAL_BLOCK_OPEN}#{exports.encode(text)}#{INTERNAL_BLOCK_CLOSE}"
  
  
###
 * Создание тега с защищенным содержимым 
 *
 * @param   string $content текст, который будет обрамлен тегом
 * @param   string $tag тэг 
 * @param   array $attribute список атрибутов, где ключ - имя атрибута, а значение - само значение данного атрибута
 * @return  string
###
exports.tag = (content="", tag='span', attribute={}) ->
  # style = attribute.style or ""
  
  if attribute.class? and attribute.class is "nowrap"
    tag = "nobr"
    attribute = {}

  if attribute.class?
    classname = attribute.class

    if exports.LAYOUT & exports.LAYOUT_STYLE
      style = __classes[classname]  if __classes[classname]
      if attribute.style?
        st = attribute.style?.trim()
        st += ";"  if st.slice(-1) not ";"
        st += style
        style = st
      else
        style = style

    if exports.LAYOUT & exports.LAYOUT_CLASS
      classname = (exports.LAYOUT_CLASS_PREFIX or "") + classname

  if attribute.id? and exports.LAYOUT_TAG_ID
    attribute.id = 'mdash-3' + Math.floor(Math.random() * (9999 - 1000)) + 1000
  
  openTag = closeTag = tag
  openTag += " #{attr}=\"#{value}\""  for attr, value of exports.omit(attribute, ['class', 'style'])
  openTag += " style=\"#{style}\""  if exports.LAYOUT & exports.LAYOUT_STYLE and style?
  openTag += " class=\"#{classname}\""  if exports.LAYOUT & exports.LAYOUT_CLASS and classname?

  "<#{exports.encode(openTag)}>#{content}</#{exports.encode(closeTag)}>"

###
 * Получить содержимое <style></style> при использовании классов
 * 
 * @param bool $list false - вернуть в виде строки для style или как массив
 * @param bool $compact не выводить пустые классы
 * @return string|array
###
exports.styles = (list=false) ->
  res = {}

  for classname, style of __classes
    classname = (exports.LAYOUT_CLASS_PREFIX or "") + classname
    res[classname] = style

  return res  if list

  css = ""
  css += ".#{k} { #{v} }\n"  for k, v of res
  return css

###
 * Сконвериторвать все html entity в соответсвующие юникод символы
 *
 * @param string $text
###
exports.convertEntitiesToUnicode = (text="") ->
  text = text.replace /\&#([0-9]+)\;/g, (match, m) ->
    String.fromCharCode(parseInt(m))
  text = text.replace /\&#x([0-9A-F]+)\;/g, (match, m) ->
    String.fromCharCode(parseInt(m, 16))
  text = text.replace /\&([a-zA-Z0-9]+)\;/g, (match, m) ->
    r = String.fromCharCode(__htmlCharEnts[m])  if __htmlCharEnts[m]?
    r or match
  text

exports.rstrpos = (haystack, needle, offset=0) ->
  if haystack.trim() isnt "" and needle.trim() isnt "" and offset <= haystack.length
    last_pos = offset
    found = false
    while curr_pos = haystack.substr(last_pos).indexOf(needle) isnt false
      found = true
      last_pos = curr_pos + 1
    
    return if found then last_pos - 1 else false
  else
    return false

exports.ifop = (cond, isTrue, isFalse) ->
  return if cond then isTrue else isFalse


