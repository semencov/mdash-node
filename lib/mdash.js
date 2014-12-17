var Mdash, fs, path, _;

path = require('path');

fs = require('fs');

_ = require('underscore')._;


/*
* Evgeny Muravjev Typograph, http://mdash.ru
* Version: 3.0 Gold Master
* Release Date: September 28, 2013
* Authors: Evgeny Muravjev & Alexander Drutsa
 */

process.on('uncaughtException', function(error) {
  console.log("=[uncaughtException]=====================================================");
  console.error(error);
  console.log(error.stack);
  return console.log("=========================================================================");
});

Mdash = (function() {
  Mdash.prototype.text = null;

  Mdash.prototype.trets = [];

  Mdash.prototype.all_options = {
    'Quote': {
      no_bdquotes: true,
      no_inches: true
    },
    'Nobr.nowrap': {
      disabled: false,
      selector: '*',
      nowrap: true
    },
    'Space.clear_before_after_punct': {
      selector: 'Space.remove_space_before_punctuationmarks'
    },
    'Space.autospace_after': {
      selector: 'Space.autospace_after_*'
    },
    'Space.bracket_fix': {
      selector: ['Space.nbsp_before_open_quote', 'Punctmark.fix_brackets']
    },
    'OptAlign.layout': {
      selector: 'OptAlign.*',
      description: 'Inline стили или CSS'
    },
    'Etc.unicode_convert': {
      selector: '*',
      dounicode: true,
      disabled: true
    }
  };

  function Mdash(text, options) {
    var mdashrc;
    if (options == null) {
      options = {};
    }
    this.DEBUG = false;
    if (_.isObject(text)) {
      options = text;
      text = null;
    }
    mdashrc = path.dirname(require.main.filename) + "/.mdash";
    options = _.extend(Mdash.Lib.readJSON(mdashrc) || Mdash.Lib.readYAML(mdashrc) || {}, options);
    this.inited = false;
    this.text = text;
    this.tret_objects = {};
    this.use_layout = false;
    this.class_layout_prefix = false;
    this.use_layout_set = false;
    this.disable_notg_replace = false;
    this.remove_notg = false;
    this.settings = {};
    this.blocks = [];
    this.setup(options);
    return;
  }


  /*
   * Добавление защищенного блока
   *
   * <code>
   *  Jare_Typograph_Tool::addCustomBlocks('<span>', '</span>');
   *  Jare_Typograph_Tool::addCustomBlocks('\<nobr\>', '\<\/span\>', true);
   * </code>
   * 
   * @param   string $id идентификатор
   * @param   string $open начало блока
   * @param   string $close конец защищенного блока
   * @param   string $tag тэг
   * @return  void
   */

  Mdash.prototype.push_safe_block = function(id, open, close, tag) {
    this.blocks.push({
      id: id,
      tag: tag,
      open: open,
      close: close
    });
  };


  /*
   * Список защищенных блоков
   *
   * @return  array
   */

  Mdash.prototype.get_allsafe_blocks = function() {
    return this.blocks;
  };


  /*
   * Удаленного блока по его номеру ключа
   *
   * @param   string $id идентифиактор защищённого блока 
   * @return  void
   */

  Mdash.prototype.remove_safe_block = function(id) {
    var block, k, _ref;
    _ref = this.blocks;
    for (k in _ref) {
      block = _ref[k];
      if (block.id === id) {
        delete this.blocks[k];
      }
    }
  };


  /*
   * Добавление защищенного блока
   *
   * @param   string $tag тэг, который должен быть защищён
   * @return  void
   */

  Mdash.prototype.add_safe_tag = function(tag) {
    var close, open;
    open = Mdash.Lib.preg_quote("<" + tag, '/') + "[^>]*?" + Mdash.Lib.preg_quote(">", '/');
    close = Mdash.Lib.preg_quote("</" + tag + ">", '/');
    this.push_safe_block(tag, open, close, tag);
    return true;
  };


  /*
   * Добавление защищенного блока
   *
   * @param   string $open начало блока
   * @param   string $close конец защищенного блока
   * @param   bool $quoted специальные символы в начале и конце блока экранированы
   * @return  void
   */

  Mdash.prototype.add_safe_block = function(id, open, close, quoted) {
    if (quoted == null) {
      quoted = false;
    }
    open = open.trim();
    close = close.trim();
    if ((open == null) || (close == null)) {
      return false;
    }
    if (quoted === false) {
      open = Mdash.Lib.preg_quote(open, '/');
      close = Mdash.Lib.preg_quote(close, '/');
    }
    this.push_safe_block(id, open, close, "");
    return true;
  };


  /*
   * Сохранение содержимого защищенных блоков
   *
   * @param   string $text
   * @param   bool $safe если true, то содержимое блоков будет сохранено, иначе - раскодировано. 
   * @return  string
   */

  Mdash.prototype.safe_blocks = function(text, way) {
    var block, pattern, safeblocks, _i, _len;
    if (this.blocks.length) {
      safeblocks = way === true ? this.blocks : this.blocks.reverse();
      for (_i = 0, _len = safeblocks.length; _i < _len; _i++) {
        block = safeblocks[_i];
        pattern = new RegExp("(" + block.open + ")((?:.|\\n|\\r)*?)(" + block.close + ")", "ig");
        text = text.replace(pattern, function($0, $1, $2, $3) {
          return $1 + (way === true ? Mdash.Lib.encrypt_tag($2) : Mdash.Lib.decrypt_tag($2)) + $3;
        });
      }
    }
    return text;
  };


  /*
   * Декодирование блоков, которые были скрыты в момент типографирования
   *
   * @param   string $text
   * @return  string
   */

  Mdash.prototype.create_object = function(tret) {
    var obj;
    if (typeof tret === 'string') {
      tret = this.get_short_tret(tret);
    }
    obj = typeof tret === 'string' ? new Mdash.Tret[tret]() : new tret();
    if (obj == null) {
      Mdash.Lib.error("Класс " + tret + " не найден. Пожалуйста, подргузите нужный файл.");
      return;
    }
    obj.DEBUG = this.DEBUG;
    return obj;
  };

  Mdash.prototype.get_short_tret = function(tretName) {
    var m;
    if (m = tretName.match(/^Mdash\.Tret\.([a-zA-Z0-9_]+)$/)) {
      return m[1];
    }
    return tretName;
  };

  Mdash.prototype.init = function() {
    var obj, tretName, _i, _len, _ref;
    _ref = this.get_trets_list();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tretName = _ref[_i];
      if (this.tret_objects[tretName] != null) {
        continue;
      }
      obj = this.create_object(tretName);
      if (obj == null) {
        continue;
      }
      this.tret_objects[tretName] = obj;
    }
    if (!this.inited) {
      this.add_safe_tag('pre');
      this.add_safe_tag('code');
      this.add_safe_tag('script');
      this.add_safe_tag('style');
      this.add_safe_tag('notg');
      this.add_safe_block('span-notg', '<span class="_notg_start"></span>', '<span class="_notg_end"></span>');
    }
    this.inited = true;
  };


  /*
   * Получаем ТРЕТ по идентификатору, т.е. заванию класса
   *
   * @param unknown_type $name
   */

  Mdash.prototype.get_tret = function(name) {
    var tret, _i, _len, _ref;
    if (this.tret_objects[name] != null) {
      return this.tret_objects[name];
    }
    _ref = this.get_trets_list();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tret = _ref[_i];
      if (tret === name) {
        this.init();
        return this.tret_objects[name];
      }
      if (this.get_short_tret(tret) === name) {
        this.init();
        return this.tret_objects[tret];
      }
    }
    Mdash.Lib.error("Трэт с идентификатором " + name + " не найден");
    return false;
  };


  /*
   * Задаём текст для применения типографа
   *
   * @param string $text
   */

  Mdash.prototype.set_text = function(text) {
    return this.text = text;
  };


  /*
   * Получить содержимое <style></style> при использовании классов
   * 
   * @param bool $list false - вернуть в виде строки для style или как массив
   * @param bool $compact не выводить пустые классы
   * @return string|array
   */

  Mdash.prototype.get_style = function(list, compact) {
    var arr, classname, clsname, k, res, str, tret, tretObj, v, _i, _len, _ref;
    if (list == null) {
      list = false;
    }
    if (compact == null) {
      compact = false;
    }
    res = {};
    _ref = this.get_trets_list();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tret = _ref[_i];
      tretObj = this.get_tret(tret);
      arr = tretObj.classes;
      if (!_.isArray(arr)) {
        continue;
      }
      for (classname in arr) {
        str = arr[classname];
        if (compact && !str) {
          continue;
        }
        clsname = (this.class_layout_prefix ? this.class_layout_prefix : "") + (this.tret_objects[tret].class_names[classname] != null ? this.tret_objects[tret].class_names[classname] : classname);
        res[clsname] = str;
      }
    }
    if (list) {
      return res;
    }
    str = "";
    for (k in res) {
      v = res[k];
      str += "." + k + " { " + v + " }\n";
    }
    return str;
  };


  /*
   * Установить режим разметки,
   *   Mdash.Lib.LAYOUT_STYLE - с помощью стилей
   *   Mdash.Lib.LAYOUT_CLASS - с помощью классов
   *   Mdash.Lib.LAYOUT_STYLE|Mdash.Lib.LAYOUT_CLASS - оба метода
   *
   * @param int $layout
   */

  Mdash.prototype.set_tag_layout = function(layout) {
    if (layout == null) {
      layout = Mdash.Lib.LAYOUT_STYLE;
    }
    this.use_layout = layout;
    return this.use_layout_set = true;
  };


  /*
   * Установить префикс для классов
   *
   * @param string|bool $prefix если true то префикс 'mdash_', иначе то, что передали
   */

  Mdash.prototype.set_class_layout_prefix = function(prefix) {
    return this.class_layout_prefix = prefix != null ? "mdash_" : prefix;
  };


  /*
   * Установлена ли настройка
   *
   * @param string $key
   */

  Mdash.prototype.is_on = function(key) {
    var _ref, _ref1;
    if (((_ref = this.settings["*"]) != null ? _ref[key] : void 0) == null) {
      return false;
    }
    return (_ref1 = ("" + this.settings["*"][key]).toLowerCase()) === "on" || _ref1 === "true" || _ref1 === "1" || _ref1 === "direct";
  };


  /*
   * Возвращает список текущих третов, которые установлены
   *
   */

  Mdash.prototype.get_trets_list = function(short) {
    if (short == null) {
      short = false;
    }
    return _.chain(Object.keys(Mdash.Tret)).filter(function(name) {
      return _.isEqual(Mdash.Tret[name].__super__, Mdash.Tret.prototype);
    }).map(function(name) {
      if (short) {
        return name;
      } else {
        return "Mdash.Tret." + name;
      }
    }).value();
  };

  Mdash.prototype.get_rules_list = function(mask) {
    var action, result, rule, tret, trets, _i, _len, _ref;
    trets = this.get_trets_list(true);
    result = {};
    for (_i = 0, _len = trets.length; _i < _len; _i++) {
      tret = trets[_i];
      result[tret] = {};
      _ref = Mdash.Tret[tret].prototype.rules;
      for (rule in _ref) {
        action = _ref[rule];
        result[tret][rule] = !((action.disabled != null) && action.disabled) || ((action.enabled != null) && action.enabled) ? "on" : "off";
      }
    }
    if (mask) {
      return this.select_rules(mask, result);
    } else {
      return result;
    }
  };

  Mdash.prototype.select_rules = function(mask, rules) {
    var m, name, pattern, selected, _i, _len;
    if (mask == null) {
      mask = "*";
    }
    if (rules == null) {
      rules = this.get_rules_list();
    }
    selected = {};
    if (_.isString(mask)) {
      mask = [mask];
    }
    for (_i = 0, _len = mask.length; _i < _len; _i++) {
      m = mask[_i];
      m = m.split(".");
      name = m[0];
      pattern = Mdash.Lib.process_selector_pattern(name);
      _.map(Object.keys(rules), function(key) {
        if (key.match(pattern)) {
          selected[key] = rules[key];
        }
      });
      if (m.length > 1 && (selected[name] != null)) {
        selected[name] = this.select_rules(m.slice(1).join("."), rules[name]);
      }
    }
    return selected;
  };

  Mdash.prototype.prepare_settings = function(options, defaults) {
    var select, selector, settings, val, value, _i, _len, _ref, _ref1, _ref2;
    if (options == null) {
      options = {};
    }
    if (defaults == null) {
      defaults = {};
    }
    if (!_.isObject(options)) {
      return options;
    }
    settings = {};
    for (selector in options) {
      value = options[selector];
      if ((_ref = ("" + value).toLowerCase()) === "on" || _ref === "true" || _ref === "1" || _ref === "direct") {
        value = true;
      }
      if ((_ref1 = ("" + value).toLowerCase()) === "off" || _ref1 === "false" || _ref1 === "0") {
        value = false;
      }
      if (_.isBoolean(value)) {
        value = {
          disabled: value === false
        };
      }
      if (_.isObject(value)) {
        if ((defaults[selector] != null) && _.isObject(defaults[selector])) {
          value = _.defaults(_.omit(value, 'selector'), _.omit(defaults[selector], 'disabled'));
        }
        if ('description' in value) {
          delete value['description'];
        }
        if ('hide' in value) {
          delete value['hide'];
        }
        if ('setting' in value) {
          value[value.setting] = true;
          delete value['setting'];
        }
        if (!('disabled' in value) && value.length === 0) {
          value.disabled = false;
        }
        if ('selector' in value) {
          if (_.isString(value.selector)) {
            value.selector = [value.selector];
          }
          val = _.omit(value, 'selector');
          if (_.size(value) > 2) {
            if (value['disabled'] === true) {
              continue;
            } else {
              val = _.omit(val, 'disabled');
            }
          }
          _ref2 = value.selector;
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            select = _ref2[_i];
            settings[select] = _.extend({}, val, settings[select]);
          }
          continue;
        }
        value = _.omit(value, 'selector');
      }
      settings[selector] = _.extend({}, value, settings[selector]);
    }
    return settings;
  };


  /*
   * Установить настройки
   *
   * @param array $setupmap
   */

  Mdash.prototype.setup = function(options) {
    var key, rule, ruleList, selector, tret, tretObj, tretShort, val, value, _i, _len, _ref, _ref1, _ref2, _ref3;
    if (options == null) {
      options = {};
    }
    this.settings = this.prepare_settings(this.all_options);
    options = this.prepare_settings(options, this.all_options);
    for (selector in options) {
      value = options[selector];
      value = _.defaults(value, this.settings[selector] || {}) || {};
      if (_.size(value) > 0) {
        this.settings[selector] = value;
      }
    }
    _ref = this.settings;
    for (selector in _ref) {
      value = _ref[selector];
      ruleList = this.select_rules(selector);
      _ref1 = this.get_trets_list();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tret = _ref1[_i];
        tretShort = this.get_short_tret(tret);
        tretObj = this.get_tret(tret);
        for (rule in tretObj.rules) {
          if ((((_ref2 = ruleList[tret]) != null ? _ref2[rule] : void 0) != null) || (((_ref3 = ruleList[tretShort]) != null ? _ref3[rule] : void 0) != null)) {
            if ((value != null) && _.isObject(value)) {
              for (key in value) {
                val = value[key];
                if (key === "disabled" && val === true) {
                  tretObj.disable_rule(rule);
                  Mdash.Lib.log("setup() | Правило " + tret + "." + rule + " отключено");
                }
                if (key === "enabled" && val === true) {
                  tretObj.enable_rule(rule);
                  Mdash.Lib.log("setup() | Правило " + tret + "." + rule + " включено");
                }
                if (key !== "disabled" && key !== "enabled") {
                  tretObj.set_rule(rule, key, val);
                  if (selector.match(/([a-z0-9_\-\.]*)?(\*)/i)) {
                    tretObj.set(key, val);
                  }
                  Mdash.Lib.log("setup() | Параметр '" + key + ": " + val + "' установлен для правила " + tret + "." + rule);
                }
              }
            }
          }
        }
        this.tret_objects[tret] = tretObj;
      }
    }
  };


  /*
   * Запустить типограф на выполнение
   *
   */

  Mdash.prototype.format = function(text, options) {
    var repl, tret, _i, _len, _ref;
    if (options == null) {
      options = null;
    }
    if (text != null) {
      this.set_text(text);
    }
    if (options != null) {
      this.setup(options);
    }
    this.init();
    Mdash.Lib.debug(this, 'init', this.text);
    this.text = this.safe_blocks(this.text, true);
    Mdash.Lib.debug(this, 'safe_blocks', this.text);
    this.text = Mdash.Lib.safe_tag_chars(this.text, true);
    Mdash.Lib.debug(this, 'safe_tag_chars', this.text);
    this.text = Mdash.Lib.clear_special_chars(this.text);
    Mdash.Lib.debug(this, 'clear_special_chars', this.text);
    _ref = this.get_trets_list();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tret = _ref[_i];
      if (this.use_layout_set) {
        this.tret_objects[tret].set_tag_layout_ifnotset(this.use_layout);
      }
      if (this.class_layout_prefix) {
        this.tret_objects[tret].set_class_layout_prefix(this.class_layout_prefix);
      }
      this.tret_objects[tret].DEBUG = this.DEBUG;
      this.tret_objects[tret].set_text(this.text);
      this.text = this.tret_objects[tret].apply();
    }
    this.text = Mdash.Lib.decode_internal_blocks(this.text);
    Mdash.Lib.debug(this, 'decode_internal_blocks', this.text);
    if (this.is_on('dounicode')) {
      Mdash.Lib.convert_html_entities_to_unicode(this.text);
    }
    this.text = Mdash.Lib.safe_tag_chars(this.text, false);
    Mdash.Lib.debug(this, 'unsafe_tag_chars', this.text);
    this.text = this.safe_blocks(this.text, false);
    Mdash.Lib.debug(this, 'unsafe_blocks', this.text);
    if (!this.disable_notg_replace) {
      repl = ['<span class="_notg_start"></span>', '<span class="_notg_end"></span>'];
      if (this.remove_notg) {
        repl = "";
      }
      this.text = this.text.replace(['<notg>', '</notg>'], repl);
    }
    return this.text.trim();
  };


  /*
   * Запустить типограф со стандартными параметрами
   *
   * @param string $text
   * @param array $options
   * @return string
   */

  Mdash.format = function(text, options) {
    var obj;
    if (options == null) {
      options = {};
    }
    obj = new this(text, options);
    return obj.format();
  };

  Mdash.get_trets_list = function(short) {
    if (short == null) {
      short = true;
    }
    return this.prototype.get_trets_list(short);
  };

  Mdash.get_rules_list = function(mask) {
    return this.prototype.get_rules_list(mask);
  };

  return Mdash;

})();

module.exports = Mdash;

Mdash.Lib = (function() {
  function Lib() {}

  Lib.DEBUG = false || Mdash.DEBUG;

  Lib.LAYOUT_STYLE = 1;

  Lib.LAYOUT_CLASS = 2;

  Lib.INTERNAL_BLOCK_OPEN = '%%%INTBLOCKO235978%%%';

  Lib.INTERNAL_BLOCK_CLOSE = '%%%INTBLOCKC235978%%%';


  /*
   * Таблица символов
   *
   * @var array
   */

  Lib.charsTable = {
    '"': {
      html: ["&laquo;", "&raquo;", "&ldquo;", "&lsquo;", "&bdquo;", "&ldquo;", "&quot;", "&#171;", "&#187;"],
      utf8: [0x201E, 0x201C, 0x201F, 0x201D, 0x00AB, 0x00BB]
    },
    ' ': {
      html: ["&nbsp;", "&thinsp;", "&#160;"],
      utf8: [0x00A0, 0x2002, 0x2003, 0x2008, 0x2009]
    },
    '-': {
      html: ["&ndash;", "&minus;", "&#151;", "&#8212;", "&#8211;"],
      utf8: [0x002D, 0x2010, 0x2012, 0x2013]
    },
    '—': {
      html: ["&mdash;"],
      utf8: [0x2014]
    },
    '==': {
      html: ["&equiv;"],
      utf8: [0x2261]
    },
    '...': {
      html: ["&hellip;", "&#0133;"],
      utf8: [0x2026]
    },
    '!=': {
      html: ["&ne;", "&#8800;"],
      utf8: [0x2260]
    },
    '<=': {
      html: ["&le;", "&#8804;"],
      utf8: [0x2264]
    },
    '>=': {
      html: ["&ge;", "&#8805;"],
      utf8: [0x2265]
    },
    '1/2': {
      html: ["&frac12;", "&#189;"],
      utf8: [0x00BD]
    },
    '1/4': {
      html: ["&frac14;", "&#188;"],
      utf8: [0x00BC]
    },
    '3/4': {
      html: ["&frac34;", "&#190;"],
      utf8: [0x00BE]
    },
    '+-': {
      html: ["&plusmn;", "&#177;"],
      utf8: [0x00B1]
    },
    '&': {
      html: ["&amp;", "&#38;"]
    },
    '(tm)': {
      html: ["&trade;", "&#153;"],
      utf8: [0x2122]
    },
    '(r)': {
      html: ["&reg;", "&#174;"],
      utf8: [0x00AE]
    },
    '(c)': {
      html: ["&copy;", "&#169;"],
      utf8: [0x00A9]
    },
    '§': {
      html: ["&sect;", "&#167;"],
      utf8: [0x00A7]
    },
    '`': {
      html: ["&#769;"]
    },
    '\'': {
      html: ["&rsquo;", "’"]
    },
    'x': {
      html: ["&times;", "&#215;"],
      utf8: [0x00D7]
    }
  };


  /*
   * Добавление к тегам атрибута 'id', благодаря которому
   * при повторном типографирование текста будут удалены теги,
   * расставленные данным типографом
   *
   * @var array
   */

  Lib.typographSpecificTagId = false;

  Lib.log = function(str, data) {
    if (data == null) {
      data = null;
    }
    if (this.DEBUG) {
      console.log("LOG\t " + this.constructor.name + "\t\t\t", str, data);
    }
  };

  Lib.error = function(info, data) {
    if (data == null) {
      data = null;
    }
    if (this.DEBUG) {
      console.error("ERROR\t " + this.constructor.name + "\t\t\t", info, data);
    }
  };

  Lib.debug = function(obj, place, after_text, after_text_raw) {
    if (after_text_raw == null) {
      after_text_raw = "";
    }
    if (this.DEBUG) {
      console.info("DEBUG\t " + this.constructor.name + "\t\t\t", place);
    }
  };

  Lib.readFile = function(filepath) {
    var contents, e;
    contents = void 0;
    try {
      contents = fs.readFileSync(String(filepath));
      return contents;
    } catch (_error) {
      e = _error;
      Mdash.Lib.error("Unable to read '" + filepath + "' file (Error code: " + e.code + ").", e);
    }
  };

  Lib.readJSON = function(filepath) {
    var e, result, src;
    src = this.readFile(filepath);
    result = void 0;
    try {
      result = JSON.parse(src);
      return result;
    } catch (_error) {
      e = _error;
      Mdash.Lib.error("Unable to parse '" + filepath + "' file (" + e.message + ").", e);
    }
  };

  Lib.readYAML = function(filepath) {
    var e, result, src;
    src = this.readFile(filepath);
    result = void 0;
    try {
      result = YAML.load(src);
      return result;
    } catch (_error) {
      e = _error;
      Mdash.Lib.error("Unable to parse '" + filepath + "' file (" + e.problem + ").", e);
    }
  };

  Lib.preg_quote = function(str, delimiter) {
    return String(str).replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}!|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
  };

  Lib.strip_tags = function(input, allowed) {
    var commentsAndPhpTags, tags;
    allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
    tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
      if (allowed.indexOf('<' + $1.toLowerCase() + '>') > -1) {
        return $0;
      } else {
        return '';
      }
    });
  };


  /*
   * Костыли для работы с символами UTF-8
   * 
   * @author  somebody?
   * @param int $c код символа в кодировке UTF-8 (например, 0x00AB)
   * @return  bool|string
   */

  Lib._getUnicodeChar = function(c) {
    if (c <= 0x7F) {
      return String.fromCharCode(c);
    } else if (c <= 0x7FF) {
      return String.fromCharCode(0xC0 | c >> 6) + String.fromCharCode(0x80 | c & 0x3F);
    } else if (c <= 0xFFFF) {
      return String.fromCharCode(0xE0 | c >> 12) + String.fromCharCode(0x80 | c >> 6 & 0x3F) + String.fromCharCode(0x80 | c & 0x3F);
    } else if (c <= 0x10FFFF) {
      return String.fromCharCode(0xF0 | c >> 18) + String.fromCharCode(0x80 | c >> 12 & 0x3F) + String.fromCharCode(0x80 | c >> 6 & 0x3F) + String.fromCharCode(0x80 | c & 0x3F);
    } else {
      return false;
    }
  };


  /*
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
   */

  Lib.clear_special_chars = function(text, mode) {
    var char, mod, moder, type, v, vals, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
    if (mode == null) {
      mode = null;
    }
    if (_.isString(mode)) {
      mode = [mode];
    }
    if (mode == null) {
      mode = ['utf8', 'html'];
    }
    if (!_.isArray(mode)) {
      return false;
    }
    moder = [];
    for (_i = 0, _len = mode.length; _i < _len; _i++) {
      mod = mode[_i];
      if (mod === 'utf8' || mod === 'html') {
        moder.push(mod);
      }
    }
    if (moder.length === 0) {
      return false;
    }
    _ref = this.charsTable;
    for (char in _ref) {
      vals = _ref[char];
      for (_j = 0, _len1 = mode.length; _j < _len1; _j++) {
        type = mode[_j];
        if (vals[type] != null) {
          _ref1 = vals[type];
          for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
            v = _ref1[_k];
            if (type === 'utf8' && _.isFinite(v)) {
              v = this._getUnicodeChar(v);
            }
            if (type === 'html') {
              if (v.match(/<[a-z]+>/gi)) {
                v = this.safe_tag_chars(v, true);
              }
            }
            if (v) {
              text = text.replace(new RegExp(v, 'ig'), char);
            }
          }
        }
      }
    }
    return text;
  };


  /*
   * Удаление тегов HTML из текста
   * Тег <br /> будет преобразов в перенос строки \n, сочетание тегов </p><p> -
   * в двойной перенос
   *
   * @param   string $text
   * @param   array $allowableTag массив из тегов, которые будут проигнорированы
   * @return  string
   */

  Lib.remove_html_tags = function(text, allowableTag) {
    var ignore, tag, tags, _i, _len;
    if (allowableTag == null) {
      allowableTag = null;
    }
    ignore = null;
    if (allowableTag != null) {
      if (_.isString(allowableTag)) {
        allowableTag = [allowableTag];
      }
      if (_.isArray(allowableTag)) {
        tags = [];
        for (_i = 0, _len = allowableTag.length; _i < _len; _i++) {
          tag = allowableTag[_i];
          if (tag.substr(0, 1) !== '<' || tag.substr(-1, 1) !== '>') {
            continue;
          }
          if (tag.substr(1, 1) === '/') {
            continue;
          }
          tags.push(tag);
        }
        ignore = tags.join('');
      }
    }
    text = text.replace([/\<br\s*\/?>/gi, /\<\/p\>\s*\<p\>/g], ["\n", "\n\n"]);
    text = this.strip_tags(text, ignore);
    return text;
  };


  /*
   * Сохраняем содержимое тегов HTML
   *
   * Тег 'a' кодируется со специальным префиксом для дальнейшей
   * возможности выносить за него кавычки.
   * 
   * @param   string $text
   * @param   bool $safe
   * @return  string
   */

  Lib.safe_tag_chars = function(text, way) {
    var self;
    self = this;
    if (way) {
      text = text.replace(/(\<\/?)(.+?)(\>)/g, function($0, $1, $2, $3) {
        return $1 + ($2.trim().substr(0, 1) === "a" ? "%%%__" : "") + self.encrypt_tag($2.trim()) + $3;
      });
    } else {
      text = text.replace(/(\<\/?)(.+?)(\>)/g, function($0, $1, $2, $3) {
        return $1 + ($2.trim().substr(0, 5) === "%%%__" ? self.decrypt_tag($2.trim().substr(5)) : self.decrypt_tag($2.trim())) + $3;
      });
    }
    return text;
  };


  /*
   * Декодриует спец блоки
   *
   * @param   string $text
   * @return  string
   */

  Lib.decode_internal_blocks = function(text) {
    var self;
    self = this;
    return text = text.replace(new RegExp("" + this.INTERNAL_BLOCK_OPEN + "([a-zA-Z0-9\/=]+?)" + this.INTERNAL_BLOCK_CLOSE, 'g'), function($0, $1) {
      return self.decrypt_tag($1);
    });
  };


  /*
   * Кодирует спец блок
   *
   * @param   string $text
   * @return  string
   */

  Lib.iblock = function(text) {
    return "" + this.INTERNAL_BLOCK_OPEN + (this.encrypt_tag(text)) + this.INTERNAL_BLOCK_CLOSE;
  };


  /*
   * Создание тега с защищенным содержимым 
   *
   * @param   string $content текст, который будет обрамлен тегом
   * @param   string $tag тэг 
   * @param   array $attribute список атрибутов, где ключ - имя атрибута, а значение - само значение данного атрибута
   * @return  string
   */

  Lib.build_safe_tag = function(content, tag, attribute, layout) {
    var attr, classname, htmlTag, st, value;
    if (tag == null) {
      tag = 'span';
    }
    if (attribute == null) {
      attribute = {};
    }
    if (layout == null) {
      layout = this.LAYOUT_STYLE;
    }
    htmlTag = tag;
    if (this._typographSpecificTagId) {
      if (attribute.id == null) {
        attribute.id = 'mdash-2' + mt_rand(1000, 9999);
      }
    }
    classname = "";
    if (attribute.length) {
      if (layout & this.LAYOUT_STYLE) {
        if (attribute.__style != null) {
          if (attribute.style != null) {
            st = attribute.style.trim();
            if (st.substr(-1) !== ";") {
              st += ";";
            }
            st += attribute.__style;
            attribute.style = st;
          } else {
            attribute.style = attribute.__style;
          }
          delete attribute['__style'];
        }
      }
      for (attr in attribute) {
        value = attribute[attr];
        if (attr === "__style") {
          continue;
        }
        if (attr === "class") {
          classname = "" + value;
          continue;
        }
        htmlTag += " " + attr + "=\"" + value + "\"";
      }
    }
    if (layout & this.LAYOUT_CLASS && classname) {
      htmlTag += " class=\"" + classname + "\"";
    }
    return "<" + (this.encrypt_tag(htmlTag)) + ">" + content + "</" + (this.encrypt_tag(tag)) + ">";
  };


  /*
   * Метод, осуществляющий кодирование (сохранение) информации
   * с целью невозможности типографировать ее
   *
   * @param   string $text
   * @return  string
   */

  Lib.encrypt_tag = function(text) {
    return new Buffer(text).toString('base64');
  };


  /*
   * Метод, осуществляющий декодирование информации
   *
   * @param   string $text
   * @return  string
   */

  Lib.decrypt_tag = function(text) {
    return new Buffer(text, 'base64').toString('utf8');
  };

  Lib.strpos_ex = function(haystack, needle, offset) {
    var m, n, p, w, _i, _len;
    if (offset == null) {
      offset = null;
    }
    if (_.isArray(needle)) {
      m = -1;
      w = false;
      for (_i = 0, _len = needle.length; _i < _len; _i++) {
        n = needle[_i];
        p = haystack.indexOf(n, offset);
        if (p === -1) {
          continue;
        }
        if (m === -1) {
          m = p;
          w = n;
          continue;
        }
        if (p < m) {
          m = p;
          w = n;
        }
      }
      if (m === -1) {
        return false;
      }
      return {
        pos: m,
        str: w
      };
    }
    return haystack.indexOf(needle, offset);
  };

  Lib.process_selector_pattern = function(pattern) {
    if (pattern === false) {
      return;
    }
    pattern = this.preg_quote(pattern, '/');
    pattern = pattern.replace("\\*", "[a-z0-9_\-]*");
    return pattern = new RegExp("^" + pattern + "$", 'ig');
  };

  Lib._test_pattern = function(pattern, text) {
    if (pattern === false) {
      return true;
    }
    return text.match(pattern);
  };

  Lib.strtolower = function(string) {
    var convert_from, convert_to;
    convert_to = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð", "ñ", "ò", "ó", "ô", "õ", "ö", "ø", "ù", "ú", "û", "ü", "ý", "а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и", "й", "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы", "ь", "э", "ю", "я"];
    convert_from = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï", "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ъ", "Ь", "Э", "Ю", "Я"];
    return string.replace(convert_from, convert_to);
  };

  Lib.html4_char_ents = {
    'nbsp': 160,
    'iexcl': 161,
    'cent': 162,
    'pound': 163,
    'curren': 164,
    'yen': 165,
    'brvbar': 166,
    'sect': 167,
    'uml': 168,
    'copy': 169,
    'ordf': 170,
    'laquo': 171,
    'not': 172,
    'shy': 173,
    'reg': 174,
    'macr': 175,
    'deg': 176,
    'plusmn': 177,
    'sup2': 178,
    'sup3': 179,
    'acute': 180,
    'micro': 181,
    'para': 182,
    'middot': 183,
    'cedil': 184,
    'sup1': 185,
    'ordm': 186,
    'raquo': 187,
    'frac14': 188,
    'frac12': 189,
    'frac34': 190,
    'iquest': 191,
    'Agrave': 192,
    'Aacute': 193,
    'Acirc': 194,
    'Atilde': 195,
    'Auml': 196,
    'Aring': 197,
    'AElig': 198,
    'Ccedil': 199,
    'Egrave': 200,
    'Eacute': 201,
    'Ecirc': 202,
    'Euml': 203,
    'Igrave': 204,
    'Iacute': 205,
    'Icirc': 206,
    'Iuml': 207,
    'ETH': 208,
    'Ntilde': 209,
    'Ograve': 210,
    'Oacute': 211,
    'Ocirc': 212,
    'Otilde': 213,
    'Ouml': 214,
    'times': 215,
    'Oslash': 216,
    'Ugrave': 217,
    'Uacute': 218,
    'Ucirc': 219,
    'Uuml': 220,
    'Yacute': 221,
    'THORN': 222,
    'szlig': 223,
    'agrave': 224,
    'aacute': 225,
    'acirc': 226,
    'atilde': 227,
    'auml': 228,
    'aring': 229,
    'aelig': 230,
    'ccedil': 231,
    'egrave': 232,
    'eacute': 233,
    'ecirc': 234,
    'euml': 235,
    'igrave': 236,
    'iacute': 237,
    'icirc': 238,
    'iuml': 239,
    'eth': 240,
    'ntilde': 241,
    'ograve': 242,
    'oacute': 243,
    'ocirc': 244,
    'otilde': 245,
    'ouml': 246,
    'divide': 247,
    'oslash': 248,
    'ugrave': 249,
    'uacute': 250,
    'ucirc': 251,
    'uuml': 252,
    'yacute': 253,
    'thorn': 254,
    'yuml': 255,
    'fnof': 402,
    'Alpha': 913,
    'Beta': 914,
    'Gamma': 915,
    'Delta': 916,
    'Epsilon': 917,
    'Zeta': 918,
    'Eta': 919,
    'Theta': 920,
    'Iota': 921,
    'Kappa': 922,
    'Lambda': 923,
    'Mu': 924,
    'Nu': 925,
    'Xi': 926,
    'Omicron': 927,
    'Pi': 928,
    'Rho': 929,
    'Sigma': 931,
    'Tau': 932,
    'Upsilon': 933,
    'Phi': 934,
    'Chi': 935,
    'Psi': 936,
    'Omega': 937,
    'alpha': 945,
    'beta': 946,
    'gamma': 947,
    'delta': 948,
    'epsilon': 949,
    'zeta': 950,
    'eta': 951,
    'theta': 952,
    'iota': 953,
    'kappa': 954,
    'lambda': 955,
    'mu': 956,
    'nu': 957,
    'xi': 958,
    'omicron': 959,
    'pi': 960,
    'rho': 961,
    'sigmaf': 962,
    'sigma': 963,
    'tau': 964,
    'upsilon': 965,
    'phi': 966,
    'chi': 967,
    'psi': 968,
    'omega': 969,
    'thetasym': 977,
    'upsih': 978,
    'piv': 982,
    'bull': 8226,
    'hellip': 8230,
    'prime': 8242,
    'Prime': 8243,
    'oline': 8254,
    'frasl': 8260,
    'weierp': 8472,
    'image': 8465,
    'real': 8476,
    'trade': 8482,
    'alefsym': 8501,
    'larr': 8592,
    'uarr': 8593,
    'rarr': 8594,
    'darr': 8595,
    'harr': 8596,
    'crarr': 8629,
    'lArr': 8656,
    'uArr': 8657,
    'rArr': 8658,
    'dArr': 8659,
    'hArr': 8660,
    'forall': 8704,
    'part': 8706,
    'exist': 8707,
    'empty': 8709,
    'nabla': 8711,
    'isin': 8712,
    'notin': 8713,
    'ni': 8715,
    'prod': 8719,
    'sum': 8721,
    'minus': 8722,
    'lowast': 8727,
    'radic': 8730,
    'prop': 8733,
    'infin': 8734,
    'ang': 8736,
    'and': 8743,
    'or': 8744,
    'cap': 8745,
    'cup': 8746,
    'int': 8747,
    'there4': 8756,
    'sim': 8764,
    'cong': 8773,
    'asymp': 8776,
    'ne': 8800,
    'equiv': 8801,
    'le': 8804,
    'ge': 8805,
    'sub': 8834,
    'sup': 8835,
    'nsub': 8836,
    'sube': 8838,
    'supe': 8839,
    'oplus': 8853,
    'otimes': 8855,
    'perp': 8869,
    'sdot': 8901,
    'lceil': 8968,
    'rceil': 8969,
    'lfloor': 8970,
    'rfloor': 8971,
    'lang': 9001,
    'rang': 9002,
    'loz': 9674,
    'spades': 9824,
    'clubs': 9827,
    'hearts': 9829,
    'diams': 9830,
    'quot': 34,
    'amp': 38,
    'lt': 60,
    'gt': 62,
    'OElig': 338,
    'oelig': 339,
    'Scaron': 352,
    'scaron': 353,
    'Yuml': 376,
    'circ': 710,
    'tilde': 732,
    'ensp': 8194,
    'emsp': 8195,
    'thinsp': 8201,
    'zwnj': 8204,
    'zwj': 8205,
    'lrm': 8206,
    'rlm': 8207,
    'ndash': 8211,
    'mdash': 8212,
    'lsquo': 8216,
    'rsquo': 8217,
    'sbquo': 8218,
    'ldquo': 8220,
    'rdquo': 8221,
    'bdquo': 8222,
    'dagger': 8224,
    'Dagger': 8225,
    'permil': 8240,
    'lsaquo': 8249,
    'rsaquo': 8250,
    'euro': 8364
  };


  /*
   * Вернуть уникод символ по html entinty
   *
   * @param string $entity
   * @return string
   */

  Lib.html_char_entity_to_unicode = function(entity) {
    if (this.html4_char_ents[entity] != null) {
      return this._getUnicodeChar(this.html4_char_ents[entity]);
    }
    return false;
  };


  /*
   * Сконвериторвать все html entity в соответсвующие юникод символы
   *
   * @param string $text
   */

  Lib.convert_html_entities_to_unicode = function(text) {
    text = text.replace(/\&#([0-9]+)\;/g, function(match, m) {
      return Mdash.Lib._getUnicodeChar(parseInt(m));
    });
    text = text.replace(/\&#x([0-9A-F]+)\;/g, function(match, m) {
      return Mdash.Lib._getUnicodeChar(parseInt(m, 16));
    });
    text = text.replace(/\&([a-zA-Z0-9]+)\;/g, function(match, m) {
      var r;
      r = Mdash.Lib.html_char_entity_to_unicode(m);
      return r || match;
    });
    return text;
  };

  Lib.rstrpos = function(haystack, needle, offset) {
    var curr_pos, found, last_pos;
    if (offset == null) {
      offset = 0;
    }
    if (haystack.trim() !== "" && needle.trim() !== "" && offset <= haystack.length) {
      last_pos = offset;
      found = false;
      while (curr_pos = haystack.substr(last_pos).indexOf(needle) !== false) {
        found = true;
        last_pos = curr_pos + 1;
      }
      if (found) {
        return last_pos - 1;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  Lib.ifop = function(cond, isTrue, isFalse) {
    if (cond) {
      return isTrue;
    } else {
      return isFalse;
    }
  };

  return Lib;

})();


/*
 * Базовый класс для группы правил обработки текста
 * Класс группы должен наследовать, данный класс и задавать
 * в нём Mdash.Tret::rules и Mdash.Tret::$name
 *
 */
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Mdash.Tret = (function() {

  /*
   * Набор правил в данной группе, который задан изначально
   * Его можно менять динамически добавляя туда правила с помощью put_rule
   *
   * @var unknown_type
   */
  Tret.prototype.rules = {};

  Tret.prototype.title = null;

  Tret.prototype.class_names = [];

  Tret.prototype.classes = {};


  /*
   * Защищенные теги
   * 
   * @todo привязать к методам из Jare_Typograph_Tool
   */

  Tret.prototype.BASE64_PARAGRAPH_TAG = 'cA==';

  Tret.prototype.BASE64_BREAKLINE_TAG = 'YnIgLw==';

  Tret.prototype.BASE64_NOBR_OTAG = 'bm9icg==';

  Tret.prototype.BASE64_NOBR_CTAG = 'L25vYnI=';


  /*
   * Типы кавычек
   */

  Tret.prototype.QUOTE_FIRS_OPEN = '&laquo;';

  Tret.prototype.QUOTE_FIRS_CLOSE = '&raquo;';

  Tret.prototype.QUOTE_CRAWSE_OPEN = '&bdquo;';

  Tret.prototype.QUOTE_CRAWSE_CLOSE = '&ldquo;';

  function Tret(text) {
    this.DEBUG = false;
    this.disabled = {};
    this.enabled = {};
    this.text = text;
    this.use_layout = false;
    this.use_layout_set = false;
    this.class_layout_prefix = false;
    this.settings = {};
    return;
  }


  /*
   * Установить режим разметки для данного Трэта если не было раньше установлено,
   *   Mdash.Lib::LAYOUT_STYLE - с помощью стилей
   *   Mdash.Lib::LAYOUT_CLASS - с помощью классов
   *
   * @param int $kind
   */

  Tret.prototype.set_tag_layout_ifnotset = function(layout) {
    if (this.use_layout_set) {
      return;
    }
    this.use_layout = layout;
  };


  /*
   * Установить режим разметки для данного Трэта,
   *   Mdash.Lib::LAYOUT_STYLE - с помощью стилей
   *   Mdash.Lib::LAYOUT_CLASS - с помощью классов
   *   Mdash.Lib::LAYOUT_STYLE|Mdash.Lib::LAYOUT_CLASS - оба метода
   *
   * @param int $kind
   */

  Tret.prototype.set_tag_layout = function(layout) {
    if (layout == null) {
      layout = Mdash.Lib.LAYOUT_STYLE;
    }
    this.use_layout = layout;
    return this.use_layout_set = true;
  };

  Tret.prototype.set_class_layout_prefix = function(prefix) {
    return this.class_layout_prefix = prefix;
  };

  Tret.prototype.getmethod = function(name) {
    if (!name) {
      return false;
    }
    if (!name in this) {
      return false;
    }
    return this[name];
  };

  Tret.prototype._pre_parse = function() {
    var m, rule, _i, _len, _ref;
    this.pre_parse();
    _ref = this.rules;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      rule = _ref[_i];
      if (rule.init == null) {
        continue;
      }
      m = this.getmethod(rule.init);
      if (!m) {
        continue;
      }
      m.call(this);
    }
  };

  Tret.prototype._post_parse = function() {
    var m, rule, _i, _len, _ref;
    _ref = this.rules;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      rule = _ref[_i];
      if (rule.deinit == null) {
        continue;
      }
      m = this.getmethod(rule.deinit);
      if (!m) {
        continue;
      }
      m.call(this);
    }
    this.post_parse();
  };

  Tret.prototype.rule_order_sort = function(a, b) {
    if (a.order === b.order) {
      return 0;
    }
    if (a.order < b.order) {
      return -1;
    }
    return 1;
  };

  Tret.prototype.apply_rule = function(rule) {
    var fn, isdisabled, k, name, pattern, patterns, replacement, self;
    name = rule.id;
    isdisabled = (this.disabled[rule.id] || rule.disabled) && !this.enabled[rule.id];
    if (isdisabled) {
      Mdash.Lib.log("Правило " + name, "Правило отключено" + (rule.disabled ? " (по умолчанию)" : ""));
      return;
    }
    if (rule["function"] != null) {
      fn = rule["function"];
      if (_.isString(fn)) {
        fn = this[fn];
        if (_.isString(fn) && _.isFunction(eval("typeof " + fn))) {
          fn = eval(fn);
        }
      }
      if (_.isFunction(fn)) {
        Mdash.Lib.log("Правило " + name, "Используется метод " + rule["function"] + " в правиле");
        this.text = fn.call(this, this.text);
        return;
      }
      Mdash.Lib.error("Функция " + rule["function"] + " из правила " + rule.id + " не найдена");
      return;
    } else if (rule.pattern != null) {
      patterns = rule.pattern;
      if (_.isString(patterns)) {
        patterns = new RegExp(Mdash.Lib.preg_quote(patterns, 'g'));
      }
      if (!_.isArray(patterns)) {
        patterns = [patterns];
      }
      for (k in patterns) {
        pattern = patterns[k];
        if (_.isString(pattern)) {
          pattern = new RegExp(Mdash.Lib.preg_quote(pattern, 'g'));
        }
        replacement = _.isArray(rule.replacement) ? rule.replacement[k] : rule.replacement;
        if (_.isString(replacement) && /^[a-z_0-9]+$/i.test(replacement)) {
          Mdash.Lib.log("Правило " + name, "Замена с использованием replace с методом " + replacement);
          if ({}.hasOwnProperty.call(this, replacement)) {
            replacement = this[replacement];
          }
          if (eval("typeof " + replacement)) {
            replacement = eval(replacement);
          }
        }
        self = this;
        this.text = this.text.replace(pattern, _.isString(replacement) ? replacement : function() {
          var match_all;
          match_all = arguments[0];
          return replacement.call(self, match_all, arguments);
        });
      }
      return;
    }
  };

  Tret.prototype._apply = function(list) {
    var k, rule, rulelist, _i, _j, _len, _len1;
    Mdash.Lib.errors = [];
    this._pre_parse();
    Mdash.Lib.log("Применяется набор правил", list.join(","));
    rulelist = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      k = list[_i];
      rule = this.rules[k];
      rule.id = k;
      rule.order = rule.order != null ? rule.order : 5;
      rulelist.push(rule);
    }
    rulelist.sort(this._rule_order_sort);
    for (_j = 0, _len1 = rulelist.length; _j < _len1; _j++) {
      rule = rulelist[_j];
      this.apply_rule(rule);
      Mdash.Lib.debug(rule.id, this.text);
    }
    this._post_parse();
  };


  /*
   * Создание защищенного тега с содержимым
   *
   * @see   EMT_lib::build_safe_tag
   * @param   string $content
   * @param   string $tag
   * @param   array $attribute
   * @return  string
   */

  Tret.prototype.tag = function(content, tag, attribute) {
    var attr, classname, htmlTag, layout, st, style_inline, value;
    if (tag == null) {
      tag = 'span';
    }
    if (attribute == null) {
      attribute = {};
    }
    if (attribute["class"] != null) {
      classname = attribute["class"];
      if (classname === "nowrap") {
        if (!this.is_on('nowrap')) {
          tag = "nobr";
          attribute = {};
          classname = "";
        }
      }
      if (this.classes[classname] != null) {
        style_inline = this.classes[classname];
        if (style_inline) {
          attribute.__style = style_inline;
        }
      }
      classname = this.class_names[classname] != null ? this.class_names[classname] : classname;
      classname = (this.class_layout_prefix ? this.class_layout_prefix : "") + classname;
      attribute["class"] = classname;
    }
    layout = this.use_layout === false ? Mdash.Lib.LAYOUT_STYLE : this.use_layout;
    htmlTag = tag;
    if (this.typographSpecificTagId) {
      if (attribute.id != null) {
        attribute.id = 'emt-2' + Math.floor(Math.random() * (9999 - 1000)) + 1000;
      }
    }
    classname = "";
    if (Object.keys(attribute).length) {
      if (layout === Mdash.Lib.LAYOUT_STYLE) {
        if (attribute.__style != null) {
          if (attribute.style != null) {
            st = attribute.style.trim();
            if (st.slice(-1)(!";")) {
              st += ";";
            }
            st += attribute.__style;
            attribute.style = st;
          } else {
            attribute.style = attribute.__style;
          }
          delete attribute.__style;
        }
      }
      for (attr in attribute) {
        value = attribute[attr];
        if (attr === "__style") {
          continue;
        }
        if (attr === "class") {
          classname = value;
          continue;
        }
        htmlTag += " " + attr + "=\"" + value + "\"";
      }
    }
    if (layout === Mdash.Lib.LAYOUT_CLASS && classname) {
      htmlTag += " class=\"" + classname + "\"";
    }
    return "<" + Mdash.Lib.encrypt_tag(htmlTag) + (">" + content + "</") + Mdash.Lib.encrypt_tag(tag) + ">";
  };


  /*
   * Добавить правило в группу
   *
   * @param string $name
   * @param array $params
   */

  Tret.prototype.put_rule = function(name, params) {
    this.rules[name] = params;
  };


  /*
   * Отключить правило, в обработке
   *
   * @param string $name
   */

  Tret.prototype.disable_rule = function(name) {
    this.disabled[name] = true;
    delete this.enabled[name];
  };


  /*
   * Включить правило
   *
   * @param string $name
   */

  Tret.prototype.enable_rule = function(name) {
    this.enabled[name] = true;
    delete this.disabled[name];
  };


  /*
   * Добавить настройку в трет
   *
   * @param string $key ключ
   * @param mixed $value значение
   */

  Tret.prototype.set = function(key, value) {
    this.settings[key] = value;
  };


  /*
   * Установлена ли настройка
   *
   * @param string $key
   */

  Tret.prototype.is_on = function(key, rule) {
    var _ref, _ref1, _ref2;
    if ((this.settings[key] == null) && (((_ref = this.rules[rule]) != null ? _ref[key] : void 0) == null)) {
      return false;
    }
    return (_ref1 = ("" + (this.settings[key] || ((_ref2 = this.rules[rule]) != null ? _ref2[key] : void 0))).toLowerCase()) === "on" || _ref1 === "1" || _ref1 === "true";
  };


  /*
   * Получить строковое значение настройки
   *
   * @param unknown_type $key
   * @return unknown
   */

  Tret.prototype.ss = function(key) {
    if (this.settings[key] == null) {
      return "";
    } else {
      return "" + this.settings[key];
    }
  };


  /*
   * Добавить настройку в правило
   *
   * @param string $rulename идентификатор правила 
   * @param string $key ключ
   * @param mixed $value значение
   */

  Tret.prototype.set_rule = function(rulename, key, value) {
    var _ref;
    if ((_ref = this.rules[rulename]) != null) {
      _ref[key] = value;
    }
  };


  /*
   * Включить правила, согласно списку
   *
   * @param array $list список правил
   * @param boolean $disable выкллючить их или включить
   * @param boolean $strict строго, т.е. те которые не в списку будут тоже обработаны
   */

  Tret.prototype.activate = function(list, disable, strict) {
    var rulename, v, _i, _len, _ref;
    if (disable == null) {
      disable = false;
    }
    if (strict == null) {
      strict = true;
    }
    if (!_.isArray(list)) {
      return false;
    }
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      rulename = list[_i];
      if (disable) {
        this.disable_rule(rulename);
      } else {
        this.enable_rule(rulename);
      }
    }
    if (strict) {
      _ref = this.rules;
      for (rulename in _ref) {
        v = _ref[rulename];
        if (__indexOf.call(list, rulename) >= 0) {
          continue;
        }
        if (!disable) {
          this.disable_rule(rulename);
        } else {
          this.enable_rule(rulename);
        }
      }
    }
  };

  Tret.prototype.set_text = function(text) {
    this.text = text;
  };


  /*
   * Применить к тексту
   *
   * @param string $text - текст к которому применить
   * @param mixed $list - список правил, null - все правила
   * @return string
   */

  Tret.prototype.apply = function(list) {
    var rlist;
    if (list == null) {
      list = null;
    }
    if (_.isString(list)) {
      rlist = [list];
    } else if (_.isArray(list)) {
      rlist = list;
    } else {
      rlist = Object.keys(this.rules);
    }
    this._apply(rlist);
    return this.text;
  };


  /*
   * Код, выполняем до того, как применить правила
   *
   */

  Tret.prototype.pre_parse = function() {};


  /*
   * После выполнения всех правил, выполняется этот метод
   *
   */

  Tret.prototype.post_parse = function() {};

  return Tret;

})();

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Mdash.Tret.Abbr = (function(_super) {
  __extends(Abbr, _super);

  function Abbr() {
    return Abbr.__super__.constructor.apply(this, arguments);
  }

  Abbr.prototype.title = "Сокращения";

  Abbr.prototype.domain_zones = ['ru', 'ру', 'com', 'ком', 'org', 'орг', 'уа', 'ua', 'lv', 'lt', 'ee', 'eu'];

  Abbr.prototype.classes = {
    nowrap: 'word-spacing:nowrap;'
  };

  Abbr.prototype.rules = {
    nobr_abbreviation: {
      description: 'Расстановка пробелов перед сокращениями dpi, lpi',
      pattern: /(\s+|^|\>)(\d+)(\040|\t)*(dpi|lpi)([\s\;\.\?\!\:\(]|$)/ig,
      replacement: '$1$2&nbsp;$4$5'
    },
    nobr_acronym: {
      description: 'Расстановка пробелов перед сокращениями гл., стр., рис., илл., ст., п.',
      pattern: /(\s|^|\>|\()(гл|стр|рис|илл?|ст|п|с)\.(\040|\t)*(\d+)(\&nbsp\;|\s|\.|\,|\?|\!|$)/ig,
      replacement: '$1$2.&nbsp;$4$5'
    },
    nobr_sm_im: {
      description: 'Расстановка пробелов перед сокращениями см., им.',
      pattern: /(\s|^|\>|\()(см|им)\.(\040|\t)*([а-яё0-9a-z]+)(\s|\.|\,|\?|\!|$)/ig,
      replacement: '$1$2.&nbsp;$4$5'
    },
    nobr_locations: {
      description: 'Расстановка пробелов в сокращениях г., ул., пер., д.',
      pattern: [/(\s|^|\>)(г|ул|пер|просп|пл|бул|наб|пр|ш|туп)\.(\040|\t)*([а-яё0-9a-z]+)(\s|\.|\,|\?|\!|$)/ig, /(\s|^|\>)(б\-р|пр\-кт)(\040|\t)*([а-яё0-9a-z]+)(\s|\.|\,|\?|\!|$)/ig, /(\s|^|\>)(д|кв|эт)\.(\040|\t)*(\d+)(\s|\.|\,|\?|\!|$)/ig],
      replacement: ['$1$2.&nbsp;$4$5', '$1$2&nbsp;$4$5', '$1$2.&nbsp;$4$5']
    },
    nbsp_before_unit: {
      description: 'Замена символов и привязка сокращений в размерных величинах: м, см, м2…',
      pattern: [/(\s|^|\>|\&nbsp\;|\,)(\d+)( |\&nbsp\;)?(м|мм|см|дм|км|гм|km|dm|cm|mm)(\s|\.|\!|\?|\,|$|\&plusmn\;|\;)/ig, /(\s|^|\>|\&nbsp\;|\,)(\d+)( |\&nbsp\;)?(м|мм|см|дм|км|гм|km|dm|cm|mm)([32]|&sup3;|&sup2;)(\s|\.|\!|\?|\,|$|\&plusmn\;|\;)/ig],
      replacement: [
        '$1$2&nbsp;$4$5', function(match, m) {
          return ("" + m[1] + m[2] + "&nbsp;" + m[4]) + (m[5] === "3" || m[5] === "2" ? "&sup" + m[5] + ";" : m[5]) + m[6];
        }
      ]
    },
    nbsp_before_weight_unit: {
      description: 'Замена символов и привязка сокращений в весовых величинах: г, кг, мг…',
      pattern: /(\s|^|\>|\&nbsp\;|\,)(\d+)( |\&nbsp\;)?(г|кг|мг|т)(\s|\.|\!|\?|\,|$|\&nbsp\;|\;)/ig,
      replacement: '$1$2&nbsp;$4$5'
    },
    nobr_before_unit_volt: {
      description: 'Установка пробельных символов в сокращении вольт',
      pattern: /(\d+)([вВ]| В)(\s|\.|\!|\?|\,|$)/g,
      replacement: '$1&nbsp;В$3'
    },
    ps_pps: {
      description: 'Объединение сокращений P.S., P.P.S.',
      pattern: /(^|\040|\t|\>|\r|\n)(p\.\040?)(p\.\040?)?(s\.)([^\<])/ig,
      replacement: function(match, m) {
        return m[1] + this.tag(("" + (m[2].trim()) + " ") + (m[3] ? "" + (m[3].trim()) + " " : "") + m[4], "span", {
          "class": "nowrap"
        }) + m[5];
      }
    },
    nobr_vtch_itd_itp: {
      description: 'Объединение сокращений и т.д., и т.п., в т.ч.',
      cycled: true,
      pattern: [/(^|\s|\&nbsp\;)и( |\&nbsp\;)т\.?[ ]?д(\.|$|\s|\&nbsp\;)/g, /(^|\s|\&nbsp\;)и( |\&nbsp\;)т\.?[ ]?п(\.|$|\s|\&nbsp\;)/g, /(^|\s|\&nbsp\;)в( |\&nbsp\;)т\.?[ ]?ч(\.|$|\s|\&nbsp\;)/g],
      replacement: [
        function(match, m) {
          return m[1] + this.tag("и т. д.", "span", {
            "class": "nowrap"
          }) + (m[3] !== "." ? m[3] : "");
        }, function(match, m) {
          return m[1] + this.tag("и т. п.", "span", {
            "class": "nowrap"
          }) + (m[3] !== "." ? m[3] : "");
        }, function(match, m) {
          return m[1] + this.tag("в т. ч.", "span", {
            "class": "nowrap"
          }) + (m[3] !== "." ? m[3] : "");
        }
      ]
    },
    nbsp_te: {
      description: 'Обработка т.е.',
      pattern: /(^|\s|\&nbsp\;)([тТ])\.?[ ]?е\./g,
      replacement: function(match, m) {
        return m[1] + this.tag(m[2] + ". е.", "span", {
          "class": "nowrap"
        });
      }
    },
    nbsp_money_abbr: {
      description: 'Форматирование денежных сокращений (расстановка пробелов и привязка названия валюты к числу)',
      pattern: /(\d)((\040|\&nbsp\;)?(тыс|млн|млрд)\.?(\040|\&nbsp\;)?)?(\040|\&nbsp\;)?(руб\.|долл\.|евро|€|&euro;|\$|у[\.]? ?е[\.]?)/g,
      replacement: function(match, m) {
        return m[1] + (m[4] ? "&nbsp;" + m[4] + (m[4] === "тыс" ? "." : "") : "") + "&nbsp;" + (!m[7].match(/у[\\\\.]? ?е[\\\\.]?/gi) ? m[7] : "у.е.");
      }
    },
    nbsp_org_abbr: {
      description: 'Привязка сокращений форм собственности к названиям организаций',
      pattern: [/([^a-zA-Zа-яёА-ЯЁ]|^)(ООО|ЗАО|ОАО|НИИ|ПБОЮЛ) ([a-zA-Zа-яёА-ЯЁ]|\"|\&laquo\;|\&bdquo\;|<)/ig, /([^a-zA-Zа-яёА-ЯЁ]|^)(SIA|VAS|AAS|AS|IK) ([a-zA-Zа-яёА-ЯЁ]|\"|\&laquo\;|\&bdquo\;|<)/ig],
      replacement: ["$1$2&nbsp;$3", "$1$2&nbsp;$3"]
    },
    nobr_gost: {
      description: 'Привязка сокращения ГОСТ к номеру',
      pattern: [/(\040|\t|\&nbsp\;|^)ГОСТ( |\&nbsp\;)?(\d+)((\-|\&minus\;|\&mdash\;)(\d+))?(( |\&nbsp\;)(\-|\&mdash\;))?/ig, /(\040|\t|\&nbsp\;|^|\>)ГОСТ( |\&nbsp\;)?(\d+)(\-|\&minus\;|\&mdash\;)(\d+)/ig, /(\040|\t|\&nbsp\;|^|\>)LVS( |\&nbsp\;)?(\d+)(\:|\-|)(\d+)/ig],
      replacement: [
        function(match, m) {
          return m[1] + this.tag(("ГОСТ " + m[3]) + (m[6] != null ? "&ndash;" + m[6] : "") + (m[7] != null ? " &mdash;" : ""), "span", {
            "class": "nowrap"
          });
        }, function(match, m) {
          return m[1] + ("ГОСТ " + m[3] + "&ndash;" + m[5]);
        }, function(match, m) {
          return m[1] + this.tag("LVS " + m[3] + ":" + m[5], "span", {
            "class": "nowrap"
          });
        }
      ]
    }
  };

  return Abbr;

})(Mdash.Tret);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Mdash.Tret.Dash = (function(_super) {
  __extends(Dash, _super);

  function Dash() {
    return Dash.__super__.constructor.apply(this, arguments);
  }

  Dash.prototype.title = "Дефисы и тире";

  Dash.prototype.rules = {
    mdash_symbol_to_html_mdash: {
      description: 'Замена символа тире на html конструкцию',
      pattern: /—/ig,
      replacement: '&mdash;'
    },
    mdash: {
      description: 'Тире после кавычек, скобочек, пунктуации',
      pattern: [/([a-zа-яё0-9]+|\,|\:|\)|\&(ra|ld)quo\;|\|\"|\>)(\040|\t)(—|\-|\&mdash\;)(\s|$|\<)/gi, /(\,|\:|\)|\")(—|\-|\&mdash\;)(\s|$|\<)/gi],
      replacement: ['$1&nbsp;&mdash;$5', '$1&nbsp;&mdash;$3']
    },
    mdash_2: {
      description: 'Тире после переноса строки',
      pattern: /(\n|\r|^|\>)(\-|\&mdash\;)(\t|\040)/gm,
      replacement: '$1&mdash;&nbsp;'
    },
    mdash_3: {
      description: 'Тире после знаков восклицания, троеточия и прочее',
      pattern: /(\.|\!|\?|\&hellip\;)(\040|\t|\&nbsp\;)(\-|\&mdash\;)(\040|\t|\&nbsp\;)/g,
      replacement: '$1 &mdash;&nbsp;'
    },
    iz_za_pod: {
      description: 'Расстановка дефисов между из-за, из-под',
      pattern: /(\s|\&nbsp\;|\>|^)(из)(\040|\t|\&nbsp\;)\-?(за|под)([\.\,\!\?\:\;]|\040|\&nbsp\;)/gi,
      replacement: function(match, m) {
        return (m[1] === "&nbsp;" ? " " : m[1]) + m[2] + "-" + m[4] + (m[5] === "&nbsp;" ? " " : m[5]);
      }
    },
    to_libo_nibud: {
      description: 'Автоматическая простановка дефисов в обезличенных местоимениях и междометиях',
      cycled: true,
      pattern: /(\s|^|\&nbsp\;|\>)(кто|кем|когда|зачем|почему|как|что|чем|где|чего|кого)\-?(\040|\t|\&nbsp\;)\-?(то|либо|нибудь)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi,
      replacement: function(match, m) {
        return (m[1] === "&nbsp;" ? " " : m[1]) + m[2] + "-" + m[4] + (m[5] === "&nbsp;" ? " " : m[5]);
      }
    },
    koe_kak: {
      description: 'Кое-как, кой-кого, все-таки',
      cycled: true,
      pattern: [/(\s|^|\&nbsp\;|\>)(кое)\-?(\040|\t|\&nbsp\;)\-?(как)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi, /(\s|^|\&nbsp\;|\>)(кой)\-?(\040|\t|\&nbsp\;)\-?(кого)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi, /(\s|^|\&nbsp\;|\>)(вс[её])\-?(\040|\t|\&nbsp\;)\-?(таки)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi],
      replacement: function(match, m) {
        return (m[1] === "&nbsp;" ? " " : m[1]) + m[2] + "-" + m[4] + (m[5] === "&nbsp;" ? " " : m[5]);
      }
    },
    ka_de_kas: {
      description: 'Расстановка дефисов с частицами ка, де, кась',
      disabled: true,
      pattern: [/(\s|^|\&nbsp\;|\>)([а-яё]+)(\040|\t|\&nbsp\;)(ка)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi, /(\s|^|\&nbsp\;|\>)([а-яё]+)(\040|\t|\&nbsp\;)(де)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi, /(\s|^|\&nbsp\;|\>)([а-яё]+)(\040|\t|\&nbsp\;)(кась)([\.\,\!\?\;]|\040|\&nbsp\;|$)/gi],
      replacement: function(match, m) {
        return (m[1] === "&nbsp;" ? " " : m[1]) + m[2] + "-" + m[4] + (m[5] === "&nbsp;" ? " " : m[5]);
      }
    }
  };

  return Dash;

})(Mdash.Tret);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Mdash.Tret.Date = (function(_super) {
  __extends(Date, _super);

  function Date() {
    return Date.__super__.constructor.apply(this, arguments);
  }

  Date.prototype.title = "Даты и дни";

  Date.prototype.classes = {
    nowrap: 'word-spacing:nowrap;'
  };

  Date.prototype.rules = {
    years: {
      description: 'Установка тире и пробельных символов в периодах дат',
      pattern: /(с|по|период|середины|начала|начало|конца|конец|половины|в|между|\([cс]\)|\&copy\;)(\s+|\&nbsp\;)([\d]{4})(-|\&mdash\;|\&minus\;)([\d]{4})(( |\&nbsp\;)?(г\.г\.|гг\.|гг|г\.|г)([^а-яёa-z]))?/gi,
      replacement: function(match, m) {
        return m[1] + m[2] + (parseInt(m[3]) >= parseInt(m[5]) ? m[3] + m[4] + m[5] : m[3] + "&mdash;" + m[5]) + (typeof m6 !== "undefined" && m6 !== null ? "&nbsp;гг + " : "") + (typeof m9 !== "undefined" && m9 !== null ? m[9] : "");
      }
    },
    mdash_month_interval: {
      description: 'Расстановка тире и объединение в неразрывные периоды месяцев',
      disabled: true,
      pattern: /((январ|феврал|сентябр|октябр|ноябр|декабр)([ьяюе]|[её]м)|(апрел|июн|июл)([ьяюе]|ем)|(март|август)([ауе]|ом)?|ма[йяюе]|маем)\-((январ|феврал|сентябр|октябр|ноябр|декабр)([ьяюе]|[её]м)|(апрел|июн|июл)([ьяюе]|ем)|(март|август)([ауе]|ом)?|ма[йяюе]|маем)/gi,
      replacement: '$1&mdash;$8'
    },
    nbsp_and_dash_month_interval: {
      description: 'Расстановка тире и объединение в неразрывные периоды дней',
      disabled: true,
      pattern: /([^\>]|^)(\d+)(\-|\&minus\;|\&mdash\;)(\d+)( |\&nbsp\;)(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)([^\<]|$)/gi,
      replacement: function(match, m) {
        return m[1] + this.tag(m[2] + "&mdash;" + m[4] + " " + m6, "span", {
          "class": "nowrap"
        }) + m[7];
      }
    },
    nobr_year_in_date: {
      description: 'Привязка года к дате',
      pattern: [/(\s|\&nbsp\;)([0-9]{2}\.[0-9]{2}\.([0-9]{2})?[0-9]{2})(\s|\&nbsp\;)?г(\.|\s|\&nbsp\;)/gi, /(\s|\&nbsp\;)([0-9]{2}\.[0-9]{2}\.([0-9]{2})?[0-9]{2})(\s|\&nbsp\;|\.(\s|\&nbsp\;|$)|$)/gi],
      replacement: [
        function(match, m) {
          return m[1] + this.tag("" + m[2] + " г.", "span", {
            "class": "nowrap"
          }) + (m[5] === "+" ? "" : " ");
        }, function(match, m) {
          return m[1] + this.tag(m[2], "span", {
            "class": "nowrap"
          }) + m[4];
        }
      ]
    },
    space_posle_goda: {
      description: 'Пробел после года',
      pattern: /(^|\040|\&nbsp\;)([0-9]{3,4})(год([ауе]|ом)?)([^a-zа-яё]|$)/gi,
      replacement: '$1$2 $3$5'
    },
    nbsp_posle_goda_abbr: {
      description: 'Пробел после года',
      pattern: /(^|\040|\&nbsp\;|\"|\&laquo\;)([0-9]{3,4})[ ]?(г\.)([^a-zа-яё]|$)/gi,
      replacement: '$1$2&nbsp;$3$4'
    }
  };

  return Date;

})(Mdash.Tret);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Mdash.Tret.Etc = (function(_super) {
  __extends(Etc, _super);

  function Etc() {
    return Etc.__super__.constructor.apply(this, arguments);
  }

  Etc.prototype.title = "Прочее";

  Etc.prototype.classes = {
    nowrap: 'word-spacing:nowrap;'
  };

  Etc.prototype.rules = {
    acute_accent: {
      description: 'Акцент',
      pattern: /(у|е|ы|а|о|э|я|и|ю|ё)\`(\w)/gi,
      replacement: '$1&#769;$2'
    },
    word_sup: {
      description: 'Надстрочный текст после символа ^',
      pattern: /((\s|\&nbsp\;|^)+)\^([a-zа-яё0-9\.\:\,\-]+)(\s|\&nbsp\;|$|\.$)/ig,
      replacement: function(match, m) {
        return this.tag(this.tag(m[3], "small"), "sup") + m[4];
      }
    },
    century_period: {
      description: 'Тире между диапозоном веков',
      pattern: /(\040|\t|\&nbsp\;|^)([XIV]{1,5})(-|\&mdash\;)([XIV]{1,5})(( |\&nbsp\;)?(в\.в\.|вв\.|вв|в\.|в))/g,
      replacement: function(match, m) {
        return m[1] + this.tag("" + m[2] + "&mdash;" + m[4] + " вв.", "span", {
          "class": "nowrap"
        });
      }
    },
    time_interval: {
      description: 'Тире и отмена переноса между диапозоном времени',
      pattern: /([^\d\>]|^)([\d]{1,2}\:[\d]{2})(-|\&mdash\;|\&minus\;)([\d]{1,2}\:[\d]{2})([^\d\<]|$)/ig,
      replacement: function(match, m) {
        return m[1] + this.tag("" + m[2] + "&mdash;" + m[4], "span", {
          "class": "nowrap"
        }) + m[5];
      }
    },
    expand_no_nbsp_in_nobr: {
      description: 'Удаление nbsp в nobr/nowrap тэгах',
      "function": 'remove_nbsp'
    }
  };

  Etc.prototype.remove_nbsp = function(text) {
    var arr, b, e, match, thetag;
    thetag = this.tag("###", 'span', {
      "class": "nowrap"
    });
    arr = thetag.split("###");
    b = Mdash.Lib.preg_quote(arr[0], '/');
    e = Mdash.Lib.preg_quote(arr[1], '/');
    match = new RegExp("(^|[^a-zа-яё])([a-zа-яё]+)\&nbsp\;(" + b + ")", 'gi');
    text = text.replace(match, '$1$3$2 ');
    match = new RegExp("(" + e + ")\&nbsp\;([a-zа-яё]+)($|[^a-zа-яё])", 'gi');
    text = text.replace(match, ' $2$1$3');
    return text = text.replace(new RegExp("" + b + ".*?" + e, 'gi'), function($0) {
      return $0.replace("&nbsp;", " ");
    });
  };

  return Etc;

})(Mdash.Tret);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Mdash.Tret.Nobr = (function(_super) {
  __extends(Nobr, _super);

  function Nobr() {
    return Nobr.__super__.constructor.apply(this, arguments);
  }

  Nobr.prototype.title = "Неразрывные конструкции";

  Nobr.prototype.classes = {
    nowrap: 'word-spacing:nowrap;'
  };

  Nobr.prototype.rules = {
    super_nbsp: {
      description: 'Привязка союзов и предлогов к написанным после словам',
      pattern: /(\s|^|\&(la|bd)quo\;|\>|\(|\&mdash\;\&nbsp\;)([a-zа-яё]{1,2}\s+)([a-zа-яё]{1,2}\s+)?([a-zа-яё0-9\-]{2,}|[0-9])/ig,
      replacement: function(match, m) {
        return ("" + m[1] + (m[3].trim()) + "&nbsp;") + (m[4] ? "" + (m[4].trim()) + "&nbsp;" : "") + m[5];
      }
    },
    nbsp_in_the_end: {
      description: 'Привязка союзов и предлогов к предыдущим словам в случае конца предложения',
      pattern: /([a-zа-яё0-9\-]{3,}) ([a-zа-яё]{1,2})\.( [A-ZА-ЯЁ]|$)/g,
      replacement: '$1&nbsp;$2.$3'
    },
    phone_builder: {
      description: 'Объединение в неразрывные конструкции номеров телефонов',
      pattern: [/([^\d\+]|^)([\+]?[0-9]{1,3})( |\&nbsp\;|\&thinsp\;)([0-9]{3,4}|\([0-9]{3,4}\))( |\&nbsp\;|\&thinsp\;)([0-9]{2,3})(-|\&minus\;)([0-9]{2})(-|\&minus\;)([0-9]{2})([^\d]|$)/g, /([^\d\+]|^)([\+]?[0-9]{1,3})( |\&nbsp\;|\&thinsp\;)([0-9]{3,4}|[0-9]{3,4})( |\&nbsp\;|\&thinsp\;)([0-9]{2,3})(-|\&minus\;)([0-9]{2})(-|\&minus\;)([0-9]{2})([^\d]|$)/g],
      replacement: function(match, m) {
        return m[1] + (m[1] === ">" || m[1] === "<" ? "" + m[2] + " " + m[4] + " " + m[6] + "-" + m[8] + "-" + m[1] : this.tag("" + m[2] + " " + m[4] + " " + m[6] + "-" + m[8] + "-" + m[1], "span", {
          "class": "nowrap"
        })) + m[1];
      }
    },
    ip_address: {
      description: 'Объединение IP-адресов',
      pattern: /(\s|\&nbsp\;|^)(\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3})/ig,
      replacement: function(match, m) {
        return m[1] + this.nowrap_ip_address(m[2]);
      }
    },
    spaces_nobr_in_surname_abbr: {
      description: 'Привязка инициалов к фамилиям',
      pattern: [/(\s|^|\.|\,|\;|\:|\?|\!|\&nbsp\;)([А-ЯЁ])\.?(\s|\&nbsp\;)?([А-ЯЁ])(\.(\s|\&nbsp\;)?|(\s|\&nbsp\;))([А-ЯЁ][а-яё]+)(\s|$|\.|\,|\;|\:|\?|\!|\&nbsp\;)/g, /(\s|^|\.|\,|\;|\:|\?|\!|\&nbsp\;)([А-ЯЁ][а-яё]+)(\s|\&nbsp\;)([А-ЯЁ])\.?(\s|\&nbsp\;)?([А-ЯЁ])\.?(\s|$|\.|\,|\;|\:|\?|\!|\&nbsp\;)/g],
      replacement: [
        function(match, m) {
          return m[1] + this.tag("" + m[2] + ". " + m[4] + ". " + m[8], "span", {
            "class": "nowrap"
          }) + m[9];
        }, function(match, m) {
          return m[1] + this.tag("" + m[2] + " " + m[4] + ". " + m[6] + ".", "span", {
            "class": "nowrap"
          }) + m[7];
        }
      ]
    },
    nbsp_before_particle: {
      description: 'Неразрывный пробел перед частицей',
      pattern: /(\040|\t)+(ли|бы|б|же|ж)(\&nbsp\;|\.|\,|\:|\;|\&hellip\;|\?|\s)/ig,
      replacement: function(match, m) {
        return ("&nbsp;" + m[2]) + (m[3] === "&nbsp;" ? " " : m[3]);
      }
    },
    nbsp_v_kak_to: {
      description: 'Неразрывный пробел в как то',
      pattern: /как то\:/gi,
      replacement: 'как&nbsp;то:'
    },
    nbsp_celcius: {
      description: 'Привязка градусов к числу',
      pattern: /(\s|^|\>|\&nbsp\;)(\d+)( |\&nbsp\;)?(°|\&deg\;)(C|С)(\s|\.|\!|\?|\,|$|\&nbsp\;|\;)/ig,
      replacement: '$1$2&nbsp;$4C$6'
    },
    hyphen_nowrap_in_small_words: {
      description: 'Обрамление пятисимвольных слов разделенных дефисом в неразрывные блоки',
      disabled: true,
      cycled: true,
      pattern: /(\&nbsp\;|\s|\>|^)([a-zа-яё]{1}\-[a-zа-яё]{4}|[a-zа-яё]{2}\-[a-zа-яё]{3}|[a-zа-яё]{3}\-[a-zа-яё]{2}|[a-zа-яё]{4}\-[a-zа-яё]{1}|когда\-то|кое\-как|кой\-кого|вс[её]\-таки|[а-яё]+\-(кась|ка|де))(\s|\.|\,|\!|\?|\&nbsp\;|\&hellip\;|$)/gi,
      replacement: function(match, m) {
        return m[1] + this.tag(m[2], "span", {
          "class": "nowrap"
        }) + m[4];
      }
    },
    hyphen_nowrap: {
      description: 'Отмена переноса слова с дефисом',
      disabled: true,
      cycled: true,
      pattern: /(\&nbsp\;|\s|\>|^)([a-zа-яё]+)((\-([a-zа-яё]+)){1,2})(\s|\.|\,|\!|\?|\&nbsp\;|\&hellip\;|$)/gi,
      replacement: function(match, m) {
        return m[1] + this.tag("" + m[2] + m[3], "span", {
          "class": "nowrap"
        }) + m[6];
      }
    }
  };

  Nobr.prototype.nowrap_ip_address = function(triads) {
    var addTag, triad, value, _i, _len;
    triad = triads.split('.');
    addTag = true;
    for (_i = 0, _len = triad.length; _i < _len; _i++) {
      value = triad[_i];
      value = parseInt(value);
      if (value > 255) {
        addTag = false;
        break;
      }
    }
    if (addTag === true) {
      triads = this.tag(triads, 'span', {
        "class": "nowrap"
      });
    }
    return triads;
  };

  return Nobr;

})(Mdash.Tret);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Mdash.Tret.Number = (function(_super) {
  __extends(Number, _super);

  function Number() {
    return Number.__super__.constructor.apply(this, arguments);
  }

  Number.prototype.title = "Числа, дроби, математические знаки";

  Number.prototype.rules = {
    minus_between_nums: {
      description: 'Расстановка знака минус между числами',
      pattern: /(\d+)\-(\d)/gi,
      replacement: '$1&minus;$2'
    },
    minus_in_numbers_range: {
      description: 'Расстановка знака минус между диапозоном чисел',
      pattern: /(^|\s|\&nbsp\;)(\&minus\;|\-)(\d+)(\.\.\.|\&hellip\;)(\s|\&nbsp\;)?(\+|\-|\&minus\;)?(\d+)/ig,
      replacement: function(match, m) {
        return ("" + m[1] + "&minus;" + m[3] + m[4] + m[5]) + (m[6] === "+" ? m[6] : "&minus;") + m[7];
      }
    },
    auto_times_x: {
      description: 'Замена x на символ × в размерных единицах',
      cycled: true,
      pattern: /([^a-zA-Z><]|^)(\&times\;)?(\d+)(\040*)(x|х)(\040*)(\d+)([^a-zA-Z><]|$)/g,
      replacement: '$1$2$3&times;$7$8'
    },
    numeric_sub: {
      description: 'Нижний индекс',
      pattern: /([a-zа-яё0-9])\_([\d]{1,3})([^а-яёa-z0-9]|$)/ig,
      replacement: function(match, m) {
        return m[1] + this.tag(this.tag(m[2], "small"), "sub") + m[3];
      }
    },
    numeric_sup: {
      description: 'Верхний индекс',
      pattern: /([a-zа-яё0-9])\^([\d]{1,3})([^а-яёa-z0-9]|$)/ig,
      replacement: function(match, m) {
        return m[1] + this.tag(this.tag(m[2], "small"), "sup") + m[3];
      }
    },
    simple_fraction: {
      description: 'Замена дробей 1/2, 1/4, 3/4 на соответствующие символы',
      pattern: [/(^|\D)1\/(2|4)(\D)/g, /(^|\D)3\/4(\D)/g],
      replacement: ['$1&frac1$2;$3', '$1&frac34;$2']
    },
    math_chars: {
      description: 'Математические знаки больше/меньше/плюс минус/неравно',
      pattern: [/!=/g, /\<=/g, /([^=]|^)\>=/g, /~=/g, /\+-/g],
      replacement: ['&ne;', '&le;', '$1&ge;', '&cong;', '&plusmn;']
    },
    thinsp_between_number_triads: {
      description: 'Объединение триад чисел полупробелом',
      pattern: /([0-9]{1,3}( [0-9]{3}){1,})(.|$)/g,
      replacement: function(match, m) {
        return (m[3] === "-" ? match : m[1].replace(" ", "&thinsp;")) + m[3];
      }
    },
    thinsp_between_no_and_number: {
      description: 'Пробел между симоволом номера и числом',
      pattern: /(№|\&#8470\;)(\s|&nbsp;)*(\d)/ig,
      replacement: '&#8470;&thinsp;$3'
    },
    thinsp_between_sect_and_number: {
      description: 'Пробел между параграфом и числом',
      pattern: /(§|\&sect\;)(\s|&nbsp;)*(\d+|[IVX]+|[a-zа-яё]+)/gi,
      replacement: '&sect;&thinsp;$3'
    }
  };

  return Number;

})(Mdash.Tret);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Mdash.Tret.OptAlign = (function(_super) {
  __extends(OptAlign, _super);

  function OptAlign() {
    return OptAlign.__super__.constructor.apply(this, arguments);
  }

  OptAlign.prototype.title = "Оптическое выравнивание";

  OptAlign.prototype.classes = {
    oa_obracket_sp_s: "margin-right:0.3em;",
    oa_obracket_sp_b: "margin-left:-0.3em;",
    oa_obracket_nl_b: "margin-left:-0.3em;",
    oa_comma_b: "margin-right:-0.2em;",
    oa_comma_e: "margin-left:0.2em;",
    oa_oquote_nl: "margin-left:-0.44em;",
    oa_oqoute_sp_s: "margin-right:0.44em;",
    oa_oqoute_sp_q: "margin-left:-0.44em;"
  };

  OptAlign.prototype.rules = {
    oa_oquote: {
      description: 'Оптическое выравнивание открывающей кавычки',
      pattern: [/([a-zа-яё\-]{3,})(\040|\&nbsp\;|\t)(\&laquo\;)/ig, /(\n|\r|^)(\&laquo\;)/ig],
      replacement: [
        function(match, m) {
          return m[1] + this.tag(m[2], "span", {
            "class": "oa_oqoute_sp_s"
          }) + this.tag(m[3], "span", {
            "class": "oa_oqoute_sp_q"
          });
        }, function(match, m) {
          return m[1] + this.tag(m[2], "span", {
            "class": "oa_oquote_nl"
          });
        }
      ]
    },
    oa_oquote_extra: {
      description: 'Оптическое выравнивание кавычки',
      "function": 'oaquote_extra'
    },
    oa_obracket_coma: {
      description: 'Оптическое выравнивание для пунктуации (скобка и запятая)',
      pattern: [/(\040|\&nbsp\;|\t)\(/g, /(\n|\r|^)\(/g, /([а-яёa-z0-9]+)\,(\040+)/g],
      replacement: [
        function(match, m) {
          return this.tag(m[1], "span", {
            "class": "oa_obracket_sp_s"
          }) + this.tag("(", "span", {
            "class": "oa_obracket_sp_b"
          });
        }, function(match, m) {
          return m[1] + this.tag("(", "span", {
            "class": "oa_obracket_nl_b"
          });
        }, function(match, m) {
          return m[1] + this.tag(",", "span", {
            "class": "oa_comma_b"
          }) + this.tag(" ", "span", {
            "class": "oa_comma_e"
          });
        }
      ]
    }
  };

  OptAlign.prototype.oaquote_extra = function(text) {
    var self;
    self = this;
    return text.replace(new RegExp("(<" + this.BASE64_PARAGRAPH_TAG + ">)([\\s]+)?(\\&laquo\\;)", 'ig'), function($0, $1, $2, $3) {
      return $1 + self.tag($3, "span", {
        "class": "oa_oquote_nl"
      });
    });
  };

  return OptAlign;

})(Mdash.Tret);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Mdash.Tret.Punctmark = (function(_super) {
  __extends(Punctmark, _super);

  function Punctmark() {
    return Punctmark.__super__.constructor.apply(this, arguments);
  }

  Punctmark.prototype.title = "Пунктуация и знаки препинания";

  Punctmark.prototype.rules = {
    auto_comma: {
      description: 'Расстановка запятых перед а, но',
      pattern: /([a-zа-яё])(\s|&nbsp;)(но|а)(\s|&nbsp;)/ig,
      replacement: '$1,$2$3$4'
    },
    punctuation_marks_limit: {
      description: 'Лишние восклицательные, вопросительные знаки и точки',
      pattern: /([\!\.\?]){4,}/g,
      replacement: '$1$1$1'
    },
    punctuation_marks_base_limit: {
      description: 'Лишние запятые, двоеточия, точки с запятой',
      pattern: /([\,]|[\:]|[\;]]){2,}/g,
      replacement: '$1'
    },
    hellip: {
      description: 'Замена трех точек на знак многоточия',
      simple_replace: true,
      pattern: /\.\.\./g,
      replacement: '&hellip;'
    },
    fix_excl_quest_marks: {
      description: 'Замена восклицательного и вопросительного знаков местами',
      pattern: /([a-zа-яё0-9])\!\?(\s|$|\<)/gi,
      replacement: '$1?!$2'
    },
    fix_pmarks: {
      description: 'Замена сдвоенных знаков препинания на одинарные',
      pattern: [/([^\!\?])\.\./g, /([a-zа-яё0-9])(\!|\.)(\!|\.|\?)(\s|$|\<)/gi, /([a-zа-яё0-9])(\?)(\?)(\s|$|\<)/gi],
      replacement: ['$1.', '$1$2$4', '$1$2$4']
    },
    fix_brackets: {
      description: 'Лишние пробелы после открывающей скобочки и перед закрывающей',
      pattern: [/(\()(\040|\t)+/g, /(\040|\t)+(\))/g],
      replacement: ['$1', '$2']
    },
    fix_brackets_space: {
      description: 'Пробел перед открывающей скобочкой',
      pattern: /([a-zа-яё0-9])(\()/ig,
      replacement: '$1 $2'
    },
    dot_on_end: {
      description: 'Точка в конце текста, если её там нет',
      disabled: true,
      pattern: /([a-zа-яё0-9])(\040|\t|\&nbsp\;)*$/gi,
      replacement: '$1.'
    }
  };

  return Punctmark;

})(Mdash.Tret);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Mdash.Tret.Quote = (function(_super) {
  __extends(Quote, _super);

  function Quote() {
    return Quote.__super__.constructor.apply(this, arguments);
  }

  Quote.prototype.title = "Кавычки";

  Quote.prototype.__ax = 0;

  Quote.prototype.__ay = 0;

  Quote.prototype.rules = {
    quotes_outside_a: {
      description: 'Кавычки вне тэга <a>',
      pattern: /(\<\%\%\%\_\_[^\>]+\>)\"(.+?)\"(\<\/\%\%\%\_\_[^\>]+\>)/g,
      replacement: function(match, m) {
        return "&laquo;" + m[1] + m[2] + m[3] + "&raquo;";
      }
    },
    open_quote: {
      description: 'Открывающая кавычка',
      pattern: /(^|\(|\s|\>|-)(\"|\\\"|\&laquo\;)(\S+)/ig,
      replacement: function(match, m) {
        return "" + m[1] + this.QUOTE_FIRS_OPEN + m[3];
      }
    },
    close_quote: {
      description: 'Закрывающая кавычка',
      pattern: /([a-zа-яё0-9]|\.|\&hellip\;|\!|\?|\>|\)|\:)((\"|\\\"|\&raquo\;)+)(\.|\&hellip\;|\;|\:|\?|\!|\,|\s|\)|\<\/|$)/gi,
      replacement: function(match, m) {
        return ("" + m[1]) + this.str_repeat(this.QUOTE_FIRS_CLOSE, (m[2].split("\"").length - 1) + (m[2].split("&raquo;").length - 1)) + ("" + m[4]);
      }
    },
    close_quote_adv: {
      description: 'Закрывающая кавычка особые случаи',
      pattern: [/([a-zа-яё0-9]|\.|\&hellip\;|\!|\?|\>|\)|\:)((\"|\\\"|\&laquo\;)+)(\<[^\>]+\>)(\.|\&hellip\;|\;|\:|\?|\!|\,|\)|\<\/|$| )/gi, /([a-zа-яё0-9]|\.|\&hellip\;|\!|\?|\>|\)|\:)(\s+)((\"|\\\")+)(\s+)(\.|\&hellip\;|\;|\:|\?|\!|\,|\)|\<\/|$| )/gi, /\>(\&laquo\;)\.($|\s|\<)/gi, /\>(\&laquo\;),($|\s|\<|\S)/gi, /\>(\&laquo\;):($|\s|\<|\S)/gi],
      replacement: [
        function(match, m) {
          return ("" + m[1]) + this.str_repeat(this.QUOTE_FIRS_CLOSE, (m[2].split("\"").length - 1) + (m[2].split("&laquo;").length - 1)) + ("" + m[4] + m[5]);
        }, function(match, m) {
          return ("" + m[1] + m[2]) + this.str_repeat(this.QUOTE_FIRS_CLOSE, (m[3].split("\"").length - 1) + (m[3].split("&laquo;").length - 1)) + ("" + m[5] + m[6]);
        }, '>&raquo;.$2', '>&raquo;,$2', '>&raquo;:$2'
      ]
    },
    open_quote_adv: {
      description: 'Открывающая кавычка особые случаи',
      pattern: /(^|\(|\s|\>)(\"|\\\")(\s)(\S+)/gi,
      replacement: function(match, m) {
        return "" + m[1] + this.QUOTE_FIRS_OPEN + m[4];
      }
    },
    quotation: {
      description: 'Внутренние кавычки-лапки и дюймы',
      "function": 'build_sub_quotations'
    }
  };

  Quote.prototype.str_repeat = function(string, num) {
    return new Array(parseInt(num) + 1).join(string);
  };

  Quote.prototype.inject_in = function(index, string) {
    return this.text = this.text.substring(0, index) + string + this.text.substring(index + string.length, this.text.length);
  };

  Quote.prototype.build_sub_quotations = function() {
    var amount, k, level, lokpos, offset, okpos, okposstack, p, self;
    okposstack = [0];
    okpos = 0;
    level = 0;
    offset = 0;
    while (true) {
      p = Mdash.Lib.strpos_ex(this.text, ["&laquo;", "&raquo;"], offset);
      if (p === false) {
        break;
      }
      if (p.str === "&laquo;") {
        if (level > 0 && !this.is_on('no_bdquotes')) {
          this.inject_in(p.pos, this.QUOTE_CRAWSE_OPEN);
        }
        level++;
      }
      if (p.str === "&raquo;") {
        level--;
        if (level > 0 && !this.is_on('no_bdquotes')) {
          this.inject_in(p.pos, this.QUOTE_CRAWSE_CLOSE);
        }
      }
      offset = p.pos + ("" + p.str).length;
      if (level === 0) {
        okpos = offset;
        okposstack.push(okpos);
      } else {
        if (level < 0) {
          if (!this.is_on('no_inches')) {
            amount = 0;
            while (amount === 0 && okposstack.length) {
              lokpos = okposstack.pop();
              k = this.text.substr(lokpos, offset - lokpos);
              k = k.replace(this.QUOTE_CRAWSE_OPEN, this.QUOTE_FIRS_OPEN);
              k = k.replace(this.QUOTE_CRAWSE_CLOSE, this.QUOTE_FIRS_CLOSE);
              amount = 0;
              this.__ax = (k.match(/(^|[^0-9])([0-9]+)\&raquo\;/gi) || []).length;
              this.__ay = 0;
              if (this.__ax) {
                self = this;
                k = k.replace(/(^|[^0-9])([0-9]+)\&raquo\;/gi, function($0, $1, $2) {
                  self.__ay++;
                  if (self.__ay === self.__ax) {
                    return "" + $1 + $2 + "&Prime;";
                  }
                  return $0;
                });
                amount = 1;
              }
            }
          }
          if (amount === 1) {
            this.text = this.text.substr(0, lokpos) + k + this.text.substr(offset);
            offset = lokpos;
            level = 0;
            continue;
          }
          if (amount === 0) {
            level = 0;
            this.text = this.text.substr(0, p.pos) + '&quot;' + this.text.substr(offset);
            offset = p.pos + "&quot;".length;
            okposstack = [offset];
            continue;
          }
        }
      }
    }
    if (level !== 0) {
      if (level > 0) {
        k = this.text.substr(okpos);
        k = k.replace(this.QUOTE_CRAWSE_OPEN, this.QUOTE_FIRS_OPEN);
        k = k.replace(this.QUOTE_CRAWSE_CLOSE, this.QUOTE_FIRS_CLOSE);
        this.text = this.text.substr(0, okpos) + k;
      }
    }
    return this.text;
  };

  return Quote;

})(Mdash.Tret);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Mdash.Tret.Space = (function(_super) {
  __extends(Space, _super);

  function Space() {
    return Space.__super__.constructor.apply(this, arguments);
  }

  Space.prototype.title = "Расстановка и удаление пробелов";

  Space.prototype.domain_zones = ['ru', 'ру', 'ком', 'орг', 'уа', 'ua', 'uk', 'co', 'fr', 'lv', 'lt', 'ee', 'eu', 'com', 'net', 'edu', 'gov', 'org', 'mil', 'int', 'info', 'biz', 'info', 'name', 'pro'];

  Space.prototype.classes = {
    nowrap: 'word-spacing:nowrap;'
  };

  Space.prototype.rules = {
    nobr_twosym_abbr: {
      description: 'Неразрывный перед 2х символьной аббревиатурой',
      pattern: /([a-zA-Zа-яёА-ЯЁ])(\040|\t)+([A-ZА-ЯЁ]{2})([\s\;\.\?\!\:\(\"]|\&(ra|ld)quo\;|$)/g,
      replacement: '$1&nbsp;$3$4'
    },
    remove_space_before_punctuationmarks: {
      description: 'Удаление пробела перед точкой, запятой, двоеточием, точкой с запятой',
      pattern: /((\040|\t|\&nbsp\;)+)([\,\:\.\;\?])(\s+|$)/g,
      replacement: '$3$4'
    },
    autospace_after_comma: {
      description: 'Пробел после запятой',
      pattern: [/(\040|\t|\&nbsp\;)\,([а-яёa-z0-9])/ig, /([^0-9])\,([а-яёa-z0-9])/ig],
      replacement: [', $2', '$1, $2']
    },
    autospace_after_pmarks: {
      description: 'Пробел после знаков пунктуации, кроме точки',
      pattern: /(\040|\t|\&nbsp\;|^|\n)([a-zа-яё0-9]+)(\040|\t|\&nbsp\;)?(\:|\)|\,|\&hellip\;|(?:\!|\?)+)([а-яёa-z])/ig,
      replacement: '$1$2$4 $5'
    },
    autospace_after_dot: {
      description: 'Пробел после точки',
      pattern: [/(\040|\t|\&nbsp\;|^)([a-zа-яё0-9]+)(\040|\t|\&nbsp\;)?\.([а-яёa-z]{5,})($|[^a-zа-яё])/ig, /(\040|\t|\&nbsp\;|^)([a-zа-яё0-9]+)\.([а-яёa-z]{1,4})($|[^a-zа-яё])/ig],
      replacement: [
        function(match, m) {
          return "" + m[1] + m[2] + "." + (m[5] === "." ? "" : " ") + m[4] + m[5];
        }, function(match, m) {
          var _ref, _ref1;
          return "" + m[1] + m[2] + "." + ((_ref = m[3].toLowerCase(), __indexOf.call(this.domain_zones, _ref) >= 0) || /[a-z]{1,12}/.test(m[3].toLowerCase()) ? "" : (_ref1 = m[4]) === "." || _ref1 === "," || _ref1 === ";" || _ref1 === "!" ? "" : " ") + m[3] + m[4];
        }
      ]
    },
    autospace_after_hellips: {
      description: 'Пробел после знаков троеточий с вопросительным или восклицательными знаками',
      pattern: /([\?\!]\.\.)([а-яёa-z])/ig,
      replacement: '$1 $2'
    },
    many_spaces_to_one: {
      description: 'Удаление лишних пробельных символов и табуляций',
      pattern: /(\040|\t)+/g,
      replacement: ' '
    },
    clear_percent: {
      description: 'Удаление пробела перед символом процента',
      pattern: /(\d+)([\t\040]+)\%/g,
      replacement: '$1%'
    },
    nbsp_before_open_quote: {
      description: 'Неразрывный пробел перед открывающей скобкой',
      pattern: /(^|\040|\t|>)([a-zа-яё]{1,2})\040(\&laquo\;|\&bdquo\;)/g,
      replacement: '$1$2&nbsp;$3'
    },
    nbsp_before_month: {
      description: 'Неразрывный пробел в датах перед числом и месяцем',
      pattern: /(\d)(\s)+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)([^\<]|$)/ig,
      replacement: '$1&nbsp;$3$4'
    },
    spaces_on_end: {
      description: 'Удаление пробелов в конце текста',
      pattern: /\s+$/,
      replacement: ''
    },
    no_space_posle_hellip: {
      description: 'Отсутстввие пробела после троеточия после открывающей кавычки',
      pattern: /(\&laquo\;|\&bdquo\;)( |\&nbsp\;)?\&hellip\;( |\&nbsp\;)?([a-zа-яё])/ig,
      replacement: '$1&hellip;$4'
    },
    space_posle_goda: {
      description: 'Пробел после года',
      pattern: /(^|\040|\&nbsp\;)([0-9]{3,4})(год([ауе]|ом)?)([^a-zа-яё]|$)/ig,
      replacement: '$1$2 $3$5'
    }
  };

  return Space;

})(Mdash.Tret);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Mdash.Tret.Symbol = (function(_super) {
  __extends(Symbol, _super);

  function Symbol() {
    return Symbol.__super__.constructor.apply(this, arguments);
  }

  Symbol.prototype.title = "Специальные символы";

  Symbol.prototype.classes = {
    nowrap: 'word-spacing:nowrap;'
  };

  Symbol.prototype.rules = {
    tm_replace: {
      description: 'Замена (tm) на символ торговой марки',
      pattern: /([\040\t])?\(tm\)/ig,
      replacement: '&trade;'
    },
    r_sign_replace: {
      description: 'Замена (R) на символ зарегистрированной торговой марки',
      pattern: /(.|^)\(r\)(.|$)/ig,
      replacement: '$1&reg;$2'
    },
    copy_replace: {
      description: 'Замена (c) на символ копирайт',
      pattern: [/\((c|с)\)\s+/ig, /\((c|с)\)($|\.|,|!|\?)/ig],
      replacement: ['&copy;&nbsp;', '&copy;$2']
    },
    apostrophe: {
      description: 'Расстановка правильного апострофа в текстах',
      pattern: /(\s|^|\>|\&rsquo\;)([a-zа-яё]{1,})\'([a-zа-яё]+)/gi,
      replacement: '$1$2&rsquo;$3',
      cycled: true
    },
    degree_f: {
      description: 'Градусы по Фаренгейту',
      pattern: /([0-9]+)F($|\s|\.|\,|\;|\:|\&nbsp\;|\?|\!)/g,
      replacement: function(match, m) {
        return this.tag("" + m[1] + " &deg;F", "span", {
          "class": "nowrap"
        }) + m[2];
      }
    },
    euro_symbol: {
      description: 'Символ евро',
      simple_replace: true,
      pattern: '€',
      replacement: '&euro;'
    },
    arrows_symbols: {
      description: 'Замена стрелок вправо-влево на html коды',
      pattern: [/(\s|\>|\&nbsp\;|^)\-\>($|\s|\&nbsp\;|\<)/g, /(\s|\>|\&nbsp\;|^|;)\<\-(\s|\&nbsp\;|$)/g, /→/g, /←/g],
      replacement: ['$1&rarr;$2', '$1&larr;$2', '&rarr;', '&larr;']
    }
  };

  return Symbol;

})(Mdash.Tret);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Mdash.Tret.Text = (function(_super) {
  __extends(Text, _super);

  function Text() {
    return Text.__super__.constructor.apply(this, arguments);
  }

  Text.prototype.title = "Текст и абзацы";

  Text.prototype.classes = {
    nowrap: 'word-spacing:nowrap;'
  };

  Text.prototype.rules = {
    auto_links: {
      description: 'Выделение ссылок из текста',
      pattern: /(\s|^)(http|ftp|mailto|https)(:\/\/)([^\s\,\!\<]{4,})(\s|\.|\,|\!|\?|\<|$)/ig,
      replacement: '$m[1] . $this->tag((substr($m[4],-1)=="."?substr($m[4],0,-1):$m[4]), "a", array("href" => $m[2].$m[3].(substr($m[4],-1)=="."?substr($m[4],0,-1):$m[4]))) . (substr($m[4],-1)=="."?".":"") .$m[5]'
    },
    email: {
      description: 'Выделение эл. почты из текста',
      pattern: '/(\s|^|\&nbsp\;|\()([a-z0-9\-\_\.]{2,})\@([a-z0-9\-\.]{2,})\.([a-z]{2,6})(\)|\s|\.|\,|\!|\?|$|\<)/e',
      replacement: function(match, m) {
        return m[1] + this.tag("" + m[2] + "@" + m[3] + "." + m[4], "a", {
          href: "mailto:" + m[2] + "@" + m[3] + "." + m[4]
        }) + m[5];
      }
    },
    no_repeat_words: {
      description: 'Удаление повторяющихся слов',
      disabled: true,
      pattern: [/([а-яё]{3,})( |\t|\&nbsp\;)\1/ig, /(\s|\&nbsp\;|^|\.|\!|\?)(([А-ЯЁ])([а-яё]{2,}))( |\t|\&nbsp\;)(([а-яё])\4)/g],
      replacement: [
        '$1', function(match, m) {
          return m[1] + (m[7] === ("" + m[3]).toLowerCase() ? m[2] : "" + m[2] + m[5] + m[6]);
        }
      ]
    },
    paragraphs: {
      description: 'Простановка параграфов',
      "function": 'build_paragraphs'
    },
    breakline: {
      description: 'Простановка переносов строк',
      "function": 'build_brs'
    }
  };

  Text.prototype.do_paragraphs = function(text) {
    var self;
    self = this;
    text = text.replace(/\r\n/g, "\n");
    text = text.replace(/\r/g, "\n");
    text = "<" + this.BASE64_PARAGRAPH_TAG + ">" + (text.trim()) + "</" + this.BASE64_PARAGRAPH_TAG + ">";
    text = text.replace(/([\040\t]+)?(\n)+([\040\t]*)(\n)+/g, function($0, $1, $2, $3) {
      return ("" + $1 + "</" + self.BASE64_PARAGRAPH_TAG + ">" + Mdash.Lib.INTERNAL_BLOCK_OPEN) + Mdash.Lib.encrypt_tag("" + $2 + $3) + ("" + Mdash.Lib.INTERNAL_BLOCK_CLOSE + "<" + self.BASE64_PARAGRAPH_TAG + ">");
    });
    text = text.replace(new RegExp("\<" + this.BASE64_PARAGRAPH_TAG + "\>(" + this.INTERNAL_BLOCK_OPEN + "[a-zA-Z0-9\/=]+?" + this.INTERNAL_BLOCK_CLOSE + ")?\<\/" + this.BASE64_PARAGRAPH_TAG + "\>", 'g'), "");
    return text;
  };

  Text.prototype.build_paragraphs = function() {
    var beg, end, p, r;
    r = this.text.indexOf("<" + this.BASE64_PARAGRAPH_TAG + ">");
    p = this.text.lastIndexOf("</" + this.BASE64_PARAGRAPH_TAG + ">");
    if (r >= 0 && p >= 0) {
      beg = this.text.substr(0, r);
      end = this.text.substr(p + ("</" + this.BASE64_PARAGRAPH_TAG + ">").length);
      return this.text = (beg.trim() ? "" + (this.do_paragraphs(beg)) + "\n" : "") + ("<" + this.BASE64_PARAGRAPH_TAG + ">") + this.text.substr(r + ("<" + this.BASE64_PARAGRAPH_TAG + ">").length, p - (r + ("<" + this.BASE64_PARAGRAPH_TAG + ">").length)) + ("</" + this.BASE64_PARAGRAPH_TAG + ">") + (end.trim() ? "\n" + (this.do_paragraphs(end)) : "");
    } else {
      return this.text = this.do_paragraphs(this.text);
    }
  };

  Text.prototype.build_brs = function() {
    var self;
    self = this;
    this.text = this.text.replace(new RegExp("(\<\/" + this.BASE64_PARAGRAPH_TAG + "\>)([\r\n \t]+)(\<" + this.BASE64_PARAGRAPH_TAG + "\>)", 'g'), function($0, $1, $2, $3) {
      return ("" + $1 + Mdash.Lib.INTERNAL_BLOCK_OPEN) + Mdash.Lib.encrypt_tag($2) + ("" + Mdash.Lib.INTERNAL_BLOCK_CLOSE + $3);
    });
    if (!this.text.match(new RegExp("\<" + this.BASE64_BREAKLINE_TAG + "\>", 'g'))) {
      this.text = this.text.replace(/\r\n/g, "\n");
      this.text = this.text.replace(/\r/g, "\n");
      return this.text = this.text.replace(/(\n)/g, "<" + this.BASE64_BREAKLINE_TAG + ">\n");
    }
  };

  return Text;

})(Mdash.Tret);
