(function() {
  var EMTLib, EMTret,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  EMTLib = require("./lib");


  /*
   * Базовый класс для группы правил обработки текста
   * Класс группы должен наследовать, данный класс и задавать
   * в нём EMTret::rules и EMTret::$name
   *
   */

  EMTret = (function() {

    /*
     * Набор правил в данной группе, который задан изначально
     * Его можно менять динамически добавляя туда правила с помощью put_rule
     *
     * @var unknown_type
     */
    EMTret.prototype.rules = {};

    EMTret.prototype.title = null;

    EMTret.prototype.disabled = {};

    EMTret.prototype.enabled = {};

    EMTret.prototype._text = "";

    EMTret.prototype.logging = false;

    EMTret.prototype.logs = false;

    EMTret.prototype.errors = false;

    EMTret.prototype.debug_enabled = false;

    EMTret.prototype.debug_info = [];

    EMTret.prototype.use_layout = false;

    EMTret.prototype.use_layout_set = false;

    EMTret.prototype.class_layout_prefix = false;

    EMTret.prototype.class_names = [];

    EMTret.prototype.classes = {};

    EMTret.prototype.settings = {};


    /*
     * Защищенные теги
     * 
     * @todo привязать к методам из Jare_Typograph_Tool
     */

    EMTret.prototype.BASE64_PARAGRAPH_TAG = 'cA==';

    EMTret.prototype.BASE64_BREAKLINE_TAG = 'YnIgLw==';

    EMTret.prototype.BASE64_NOBR_OTAG = 'bm9icg==';

    EMTret.prototype.BASE64_NOBR_CTAG = 'L25vYnI=';


    /*
     * Типы кавычек
     */

    EMTret.prototype.QUOTE_FIRS_OPEN = '&laquo;';

    EMTret.prototype.QUOTE_FIRS_CLOSE = '&raquo;';

    EMTret.prototype.QUOTE_CRAWSE_OPEN = '&bdquo;';

    EMTret.prototype.QUOTE_CRAWSE_CLOSE = '&ldquo;';

    function EMTret() {
      return this;
    }

    EMTret.prototype.log = function(str, data) {
      if (data == null) {
        data = null;
      }
      if (!this.logging) {
        return;
      }
      this.logs.push({
        info: str,
        data: data
      });
    };

    EMTret.prototype.error = function(info, data) {
      if (data == null) {
        data = null;
      }
      this.errors.push({
        info: info,
        data: data
      });
      this.log("ERROR: " + info, data);
    };

    EMTret.prototype.debug = function(place, after_text) {
      if (!this.debug_enabled) {
        return;
      }
      this.debug_info.push({
        place: place,
        text: after_text
      });
    };


    /*
     * Установить режим разметки для данного Трэта если не было раньше установлено,
     *   EMTLib::LAYOUT_STYLE - с помощью стилей
     *   EMTLib::LAYOUT_CLASS - с помощью классов
     *
     * @param int $kind
     */

    EMTret.prototype.set_tag_layout_ifnotset = function(layout) {
      if (this.use_layout_set) {
        return;
      }
      this.use_layout = layout;
    };


    /*
     * Установить режим разметки для данного Трэта,
     *   EMTLib::LAYOUT_STYLE - с помощью стилей
     *   EMTLib::LAYOUT_CLASS - с помощью классов
     *   EMTLib::LAYOUT_STYLE|EMTLib::LAYOUT_CLASS - оба метода
     *
     * @param int $kind
     */

    EMTret.prototype.set_tag_layout = function(layout) {
      if (layout == null) {
        layout = this.LAYOUT_STYLE;
      }
      this.use_layout = layout;
      return this.use_layout_set = true;
    };

    EMTret.prototype.set_class_layout_prefix = function(prefix) {
      return this.class_layout_prefix = prefix;
    };

    EMTret.prototype.debug_on = function() {
      this.debug_enabled = true;
    };

    EMTret.prototype.log_on = function() {
      this.debug_enabled = true;
    };

    EMTret.prototype.getmethod = function(name) {
      var _ref;
      if (!name) {
        return false;
      }
      if (_ref = !name, __indexOf.call(this, _ref) >= 0) {
        return false;
      }
      return this[name];
    };

    EMTret.prototype._pre_parse = function() {
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

    EMTret.prototype._post_parse = function() {
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

    EMTret.prototype.rule_order_sort = function(a, b) {
      if (a.order === b.order) {
        return 0;
      }
      if (a.order < b.order) {
        return -1;
      }
      return 1;
    };

    EMTret.prototype.apply_rule = function(rule) {
      var disabled, fn, k, name, pattern, patterns, replacement, self;
      name = rule.id;
      disabled = (this.disabled[rule.id] || rule.disabled) && !this.enabled[rule.id];
      if (disabled) {
        this.log("Правило " + name, "Правило отключено" + (rule.disabled ? " (по умолчанию)" : ""));
        return;
      }
      if (rule["function"] != null) {
        fn = rule["function"];
        if (typeof fn === 'string') {
          fn = this[fn];
          if (typeof fn === 'string' && eval("typeof " + fn) === 'function') {
            fn = eval(fn);
          }
        }
        if (typeof fn === 'function') {
          this.log("Правило " + name, "Используется метод " + rule["function"] + " в правиле");
          this._text = fn.call(this, this._text);
          return;
        }
        this.error("Функция " + rule["function"] + " из правила " + rule.id + " не найдена");
        return;
      } else if (rule.pattern != null) {
        patterns = rule.pattern;
        if (typeof patterns === 'string') {
          patterns = new RegExp(EMTLib.preg_quote(patterns, 'g'));
        }
        if (!Array.isArray(patterns)) {
          patterns = [patterns];
        }
        for (k in patterns) {
          pattern = patterns[k];
          if (typeof pattern === 'string') {
            pattern = new RegExp(EMTLib.preg_quote(pattern, 'g'));
          }
          replacement = Array.isArray(rule.replacement) ? rule.replacement[k] : rule.replacement;
          if (typeof replacement === 'string' && /^[a-z_0-9]+$/i.test(replacement)) {
            this.log("Правило " + name, "Замена с использованием replace с методом " + replacement);
            if ({}.hasOwnProperty.call(this, replacement)) {
              replacement = this[replacement];
            }
            if (eval("typeof " + replacement)) {
              replacement = eval(replacement);
            }
          }
          self = this;
          this._text = this._text.replace(pattern, typeof replacement === 'string' ? replacement : function() {
            var match_all;
            match_all = arguments[0];
            return replacement.call(self, match_all, arguments);
          });
        }
        return;
      }
    };

    EMTret.prototype._apply = function(list) {
      var k, rule, rulelist, _i, _j, _len, _len1;
      this.errors = [];
      this._pre_parse();
      this.log("Применяется набор правил", list.join(","));
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
        this.debug(rule.id, this._text);
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

    EMTret.prototype.tag = function(content, tag, attribute) {
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
      layout = this.use_layout === false ? this.LAYOUT_STYLE : this.use_layout;
      htmlTag = tag;
      if (this.typographSpecificTagId) {
        if (attribute.id != null) {
          attribute.id = 'emt-2' + Math.floor(Math.random() * (9999 - 1000)) + 1000;
        }
      }
      classname = "";
      if (Object.keys(attribute).length) {
        if (layout === this.LAYOUT_STYLE) {
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
      if (layout === this.LAYOUT_CLASS && classname) {
        htmlTag += " class=\"" + classname + "\"";
      }
      return "<" + EMTLib.encrypt_tag(htmlTag) + (">" + content + "</") + EMTLib.encrypt_tag(tag) + ">";
    };


    /*
     * Добавить правило в группу
     *
     * @param string $name
     * @param array $params
     */

    EMTret.prototype.put_rule = function(name, params) {
      this.rules[name] = params;
      return this;
    };


    /*
     * Отключить правило, в обработке
     *
     * @param string $name
     */

    EMTret.prototype.disable_rule = function(name) {
      this.disabled[name] = true;
      delete this.enabled[name];
    };


    /*
     * Включить правило
     *
     * @param string $name
     */

    EMTret.prototype.enable_rule = function(name) {
      this.enabled[name] = true;
      delete this.disabled[name];
    };


    /*
     * Добавить настройку в трет
     *
     * @param string $key ключ
     * @param mixed $value значение
     */

    EMTret.prototype.set = function(key, value) {
      this.settings[key] = value;
    };


    /*
     * Установлена ли настройка
     *
     * @param string $key
     */

    EMTret.prototype.is_on = function(key) {
      var kk;
      if (this.settings[key] == null) {
        return false;
      }
      kk = this.settings[key];
      return kk.toLowerCase() === "on" || kk === "1" || kk === true || kk === 1;
    };


    /*
     * Получить строковое значение настройки
     *
     * @param unknown_type $key
     * @return unknown
     */

    EMTret.prototype.ss = function(key) {
      if (this.settings[key] == null) {
        return "";
      }
      return "" + this.settings[key];
    };


    /*
     * Добавить настройку в правило
     *
     * @param string $rulename идентификатор правила 
     * @param string $key ключ
     * @param mixed $value значение
     */

    EMTret.prototype.set_rule = function(rulename, key, value) {
      this.rules[rulename][key] = value;
    };


    /*
     * Включить правила, согласно списку
     *
     * @param array $list список правил
     * @param boolean $disable выкллючить их или включить
     * @param boolean $strict строго, т.е. те которые не в списку будут тоже обработаны
     */

    EMTret.prototype.activate = function(list, disable, strict) {
      var rulename, v, _i, _len, _ref;
      if (disable == null) {
        disable = false;
      }
      if (strict == null) {
        strict = true;
      }
      if (!Array.isArray(list)) {
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

    EMTret.prototype.set_text = function(text) {
      this._text = text;
      this.debug_info = [];
      this.logs = [];
    };


    /*
     * Применить к тексту
     *
     * @param string $text - текст к которому применить
     * @param mixed $list - список правил, null - все правила
     * @return string
     */

    EMTret.prototype.apply = function(list) {
      var rlist;
      if (list == null) {
        list = null;
      }
      if (typeof list === 'string') {
        rlist = [list];
      } else if (Array.isArray(list)) {
        rlist = list;
      } else {
        rlist = Object.keys(this.rules);
      }
      this._apply(rlist);
      return this._text;
    };


    /*
     * Код, выполняем до того, как применить правила
     *
     */

    EMTret.prototype.pre_parse = function() {};


    /*
     * После выполнения всех правил, выполняется этот метод
     *
     */

    EMTret.prototype.post_parse = function() {};

    return EMTret;

  })();

  module.exports = EMTret;

}).call(this);
