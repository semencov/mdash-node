
/*
* Evgeny Muravjev Typograph, http://mdash.ru
* Version: 3.0 Gold Master
* Release Date: September 28, 2013
* Authors: Evgeny Muravjev & Alexander Drutsa
 */

(function() {
  var EMTBase, EMTLib, EMTypograph, tret,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  process.on('uncaughtException', function(error) {
    console.log("=[uncaughtException]=====================================================");
    console.error(error);
    console.log(error.stack);
    return console.log("=========================================================================");
  });

  EMTLib = require("./emt/lib");

  tret = require("./emt/tret");


  /*
   * Основной класс типографа Евгения Муравьёва
   * реализует основные методы запуска и рабыоты типографа
   *
   */

  EMTBase = (function() {
    function EMTBase() {}

    EMTBase.prototype._text = "";

    EMTBase.prototype.inited = false;


    /*
     * Список Трэтов, которые надо применить к типогрфированию
     *
     * @var array
     */

    EMTBase.prototype.trets = [];

    EMTBase.prototype.trets_index = [];

    EMTBase.prototype.tret_objects = [];

    EMTBase.prototype.ok = false;

    EMTBase.prototype.debug_enabled = false;

    EMTBase.prototype.logging = false;

    EMTBase.prototype.logs = [];

    EMTBase.prototype.errors = [];

    EMTBase.prototype.debug_info = [];

    EMTBase.prototype.use_layout = false;

    EMTBase.prototype.class_layout_prefix = false;

    EMTBase.prototype.use_layout_set = false;

    EMTBase.prototype.disable_notg_replace = false;

    EMTBase.prototype.remove_notg = false;

    EMTBase.prototype.settings = {};

    EMTBase.prototype.log = function(str, data) {
      if (data == null) {
        data = null;
      }
      if (!this.logging) {
        return;
      }
      this.logs.push({
        "class": '',
        info: str,
        data: data
      });
    };

    EMTBase.prototype.tret_log = function(tret, str, data) {
      if (data == null) {
        data = null;
      }
      this.logs.push({
        "class": tret,
        info: str,
        data: data
      });
    };

    EMTBase.prototype.error = function(info, data) {
      if (data == null) {
        data = null;
      }
      this.errors.push({
        "class": '',
        info: info,
        data: data
      });
      this.log("ERROR " + info, data);
    };

    EMTBase.prototype.tret_error = function(tret, info, data) {
      if (data == null) {
        data = null;
      }
      this.errors.push({
        "class": tret,
        info: info,
        data: data
      });
    };

    EMTBase.prototype.debug = function(obj, place, after_text, after_text_raw) {
      if (after_text_raw == null) {
        after_text_raw = "";
      }
      if (!this.debug_enabled) {
        return;
      }
      this.debug_info.push({
        tret: obj === this ? false : true,
        "class": typeof obj === 'object' ? obj.constructor.name : obj,
        place: place,
        text: after_text,
        text_raw: after_text_raw
      });
    };

    EMTBase.prototype._safe_blocks = [];


    /*
     * Включить режим отладки, чтобы посмотреть последовательность вызовов
     * третов и правил после
     *
     */

    EMTBase.prototype.debug_on = function() {
      return this.debug_enabled = true;
    };


    /*
     * Включить режим отладки, чтобы посмотреть последовательность вызовов
     * третов и правил после
     *
     */

    EMTBase.prototype.log_on = function() {
      return this.logging = true;
    };


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

    EMTBase.prototype._add_safe_block = function(id, open, close, tag) {
      this._safe_blocks.push({
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

    EMTBase.prototype.get_all_safe_blocks = function() {
      return this._safe_blocks;
    };


    /*
     * Удаленного блока по его номеру ключа
     *
     * @param   string $id идентифиактор защищённого блока 
     * @return  void
     */

    EMTBase.prototype.remove_safe_block = function(id) {
      var block, k, _ref;
      _ref = this._safe_blocks;
      for (k in _ref) {
        block = _ref[k];
        if (block.id === id) {
          delete this._safe_blocks[k];
        }
      }
    };


    /*
     * Добавление защищенного блока
     *
     * @param   string $tag тэг, который должен быть защищён
     * @return  void
     */

    EMTBase.prototype.add_safe_tag = function(tag) {
      var close, open;
      open = EMTLib.preg_quote("<", '/') + ("" + tag + "[^>]*?") + EMTLib.preg_quote(">", '/');
      close = EMTLib.preg_quote("</" + tag + ">", '/');
      this._add_safe_block(tag, open, close, tag);
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

    EMTBase.prototype.add_safe_block = function(id, open, close, quoted) {
      if (quoted == null) {
        quoted = false;
      }
      open = open.trim();
      close = close.trim();
      if ((open == null) || (close == null)) {
        return false;
      }
      if (quoted === false) {
        open = EMTLib.preg_quote(open, '/');
        close = EMTLib.preg_quote(close, '/');
      }
      this._add_safe_block(id, open, close, "");
      return true;
    };


    /*
     * Сохранение содержимого защищенных блоков
     *
     * @param   string $text
     * @param   bool $safe если true, то содержимое блоков будет сохранено, иначе - раскодировано. 
     * @return  string
     */

    EMTBase.prototype.safe_blocks = function(text, way, show) {
      var block, safeblocks, _i, _len;
      if (show == null) {
        show = true;
      }
      if (this._safe_blocks.length) {
        safeblocks = way === true ? this._safe_blocks : this._safe_blocks.reverse();
        for (_i = 0, _len = safeblocks.length; _i < _len; _i++) {
          block = safeblocks[_i];
          text = text.replace(new RegExp("({" + block.open + "})(.+?)({" + block.close + "})", 'g'), function(match, m1, m2, m3) {
            return m1 + (way === true ? EMTLib.encrypt_tag(m2) : EMTLib.decrypt_tag(m2)) + m3;
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

    EMTBase.prototype.decode_internal_blocks = function(text) {
      return EMTLib.decode_internal_blocks(text);
    };

    EMTBase.prototype.create_object = function(tret) {
      var e, fname, m, obj, tname, tretObj;
      tretObj = null;
      if (typeof tret === 'string') {
        try {
          eval("tret = " + tret);
        } catch (_error) {
          e = _error;
        }
      }
      if (tretObj == null) {
        if (m = tret.match(/^EMTret([a-zA-Z0-9_]+)$/)) {
          tname = m[1];
          fname = tname.replace("_", " ");
          fname = fname.toLowerCase();
          fname = fname.replace(" ", ".");
          tretObj = require("./emt/trets/" + fname + ".js");
        }
      }
      if (tretObj == null) {
        this.error("Класс " + tret + " не найден. Пожалуйста, подргузите нужный файл.");
        return;
      }
      obj = new tretObj();
      obj.logging = this.logging;
      return obj;
    };

    EMTBase.prototype.get_short_tret = function(tretname) {
      var m;
      if (m = tret.match(/^EMTret([a-zA-Z0-9_]+)$/)) {
        return m[1];
      }
      return tretname;
    };

    EMTBase.prototype._init = function() {
      var obj, _i, _len, _ref;
      _ref = this.trets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tret = _ref[_i];
        if (this.tret_objects[tret] != null) {
          continue;
        }
        obj = this.create_object(tret);
        if (obj == null) {
          continue;
        }
        this.tret_objects[tret] = obj;
      }
      if (!this.inited) {
        this.add_safe_tag('pre');
        this.add_safe_tag('script');
        this.add_safe_tag('style');
        this.add_safe_tag('notg');
        this.add_safe_block('span-notg', '<span class="_notg_start"></span>', '<span class="_notg_end"></span>');
      }
      this.inited = true;
    };


    /*
     * Инициализация класса, используется чтобы задать список третов или
     * спсиок защищённых блоков, которые можно использовать.
     * Такде здесь можно отменить защищённые блоки по умлочнаию
     *
     */

    EMTBase.prototype.init = function() {};


    /*
     * Добавить Трэт, 
     *
     * @param mixed $class - имя класса трета, или сам объект
     * @param string $altname - альтернативное имя, если хотим например иметь два одинаоковых терта в обработке
     * @return unknown
     */

    EMTBase.prototype.add_tret = function(classObj, altname) {
      var obj;
      if (altname == null) {
        altname = false;
      }
      if (typeof classObj === 'object') {
        if (!classObj instanceof "EMTret") {
          this.error("You are adding Tret that doesn't inherit base class EMTret", classObj);
          return false;
        }
        classObj.EMT = this;
        classObj.logging = this.logging;
        this.tret_objects[(altname ? altname : classObj.constructor.name)] = classObj;
        this.trets.push((altname ? altname : classObj.constructor.name));
        return true;
      }
      if (typeof classObj === 'string') {
        obj = this.create_object(classObj);
        if (obj == null) {
          return false;
        }
        this.tret_objects[(altname ? altname : classObj)] = obj;
        this.trets.push((altname ? altname : classObj));
        return true;
      }
      this.error("Чтобы добавить трэт необходимо передать имя или объект");
      return false;
    };


    /*
     * Получаем ТРЕТ по идентивикатору, т.е. заванию класса
     *
     * @param unknown_type $name
     */

    EMTBase.prototype.get_tret = function(name) {
      var _i, _len, _ref;
      if (this.tret_objects[name] != null) {
        return this.tret_objects[name];
      }
      _ref = this.trets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tret = _ref[_i];
        if (tret === name) {
          this._init();
          return this.tret_objects[name];
        }
        if (this.get_short_tret(tret) === name) {
          this._init();
          return this.tret_objects[tret];
        }
      }
      this.error("Трэт с идентификатором " + name + " не найден");
      return false;
    };


    /*
     * Задаём текст для применения типографа
     *
     * @param string $text
     */

    EMTBase.prototype.set_text = function(text) {
      return this._text = text;
    };


    /*
     * Запустить типограф на выполнение
     *
     */

    EMTBase.prototype.apply = function(trets) {
      var atrets, di, err, log, repl, unsafetext, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2;
      if (trets == null) {
        trets = null;
      }
      this.ok = false;
      this.init();
      this._init();
      atrets = this.trets;
      if (typeof trets === 'string') {
        atrets = [trets];
      }
      if (Array.isArray(trets)) {
        atrets = trets;
      }
      this.debug(this, 'init', this._text);
      this._text = this.safe_blocks(this._text, true);
      this.debug(this, 'safe_blocks', this._text);
      this._text = EMTLib.safe_tag_chars(this._text, true);
      this.debug(this, 'safe_tag_chars', this._text);
      this._text = EMTLib.clear_special_chars(this._text);
      this.debug(this, 'clear_special_chars', this._text);
      console.log(this._text);
      console.log("--------------------------");
      for (_i = 0, _len = atrets.length; _i < _len; _i++) {
        tret = atrets[_i];
        if (this.use_layout_set) {
          this.tret_objects[tret].set_tag_layout_ifnotset(this.use_layout);
        }
        if (this.class_layout_prefix) {
          this.tret_objects[tret].set_class_layout_prefix(this.class_layout_prefix);
        }
        if (this.debug_enabled) {
          this.tret_objects[tret].debug_on();
        }
        if (this.logging) {
          this.tret_objects[tret].logging = true;
        }
        this.tret_objects[tret].set_text(this._text);
        this._text = this.tret_objects[tret].apply();
        if (tret === "EMTretQuote") {
          console.log(this._text, "\n");
        }
        if (this.tret_objects[tret].errors.length > 0) {
          _ref = this.tret_objects[tret].errors;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            err = _ref[_j];
            this.tret_error(tret, err.info, err.data);
          }
        }
        if (this.logging) {
          if (this.tret_objects[tret].logs.length > 0) {
            _ref1 = this.tret_objects[tret].logs;
            for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
              log = _ref1[_k];
              this.tret_log(tret, log.info, log.data);
            }
          }
        }
        if (this.debug_enabled) {
          _ref2 = this.tret_objects[tret].debug_info;
          for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
            di = _ref2[_l];
            unsafetext = di.text;
            unsafetext = EMTLib.safe_tag_chars(unsafetext, false);
            unsafetext = this.safe_blocks(unsafetext, false);
            this.debug(tret, di.place, unsafetext, di.text);
          }
        }
      }
      this._text = this.decode_internal_blocks(this._text);
      this.debug(this, 'decode_internal_blocks', this._text);
      if (this.is_on('dounicode')) {
        EMTLib.convert_html_entities_to_unicode(this._text);
      }
      this._text = EMTLib.safe_tag_chars(this._text, false);
      this.debug(this, 'unsafe_tag_chars', this._text);
      this._text = this.safe_blocks(this._text, false);
      this.debug(this, 'unsafe_blocks', this._text);
      if (!this.disable_notg_replace) {
        repl = ['<span class="_notg_start"></span>', '<span class="_notg_end"></span>'];
        if (this.remove_notg) {
          repl = "";
        }
        this._text = this._text.replace(['<notg>', '</notg>'], repl);
      }
      this._text = this._text.trim();
      this.ok = this.errors.length === 0;
      return this._text;
    };


    /*
     * Получить содержимое <style></style> при использовании классов
     * 
     * @param bool $list false - вернуть в виде строки для style или как массив
     * @param bool $compact не выводить пустые классы
     * @return string|array
     */

    EMTBase.prototype.get_style = function(list, compact) {
      var arr, classname, clsname, k, res, str, v, _i, _len, _ref;
      if (list == null) {
        list = false;
      }
      if (compact == null) {
        compact = false;
      }
      this._init();
      res = {};
      _ref = this.trets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tret = _ref[_i];
        arr = this.tret_objects[tret].classes;
        if (!Array.isArray(arr)) {
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
     *   EMTLib.LAYOUT_STYLE - с помощью стилей
     *   EMTLib.LAYOUT_CLASS - с помощью классов
     *   EMTLib.LAYOUT_STYLE|EMTLib.LAYOUT_CLASS - оба метода
     *
     * @param int $layout
     */

    EMTBase.prototype.set_tag_layout = function(layout) {
      if (layout == null) {
        layout = EMTLib.LAYOUT_STYLE;
      }
      this.use_layout = layout;
      return this.use_layout_set = true;
    };


    /*
     * Установить префикс для классов
     *
     * @param string|bool $prefix если true то префикс 'emt_', иначе то, что передали
     */

    EMTBase.prototype.set_class_layout_prefix = function(prefix) {
      return this.class_layout_prefix = prefix != null ? "emt_" : prefix;
    };


    /*
     * Включить/отключить правила, согласно карте
     * Формат карты:
     *    'Название трэта 1' => array ( 'правило1', 'правило2' , ...  )
     *    'Название трэта 2' => array ( 'правило1', 'правило2' , ...  )
     *
     * @param array $map
     * @param boolean $disable если ложно, то $map соотвествует тем правилам, которые надо включить
     *                         иначе это список правил, которые надо выключить
     * @param boolean $strict строго, т.е. те которые не в списку будут тоже обработаны
     */

    EMTBase.prototype.set_enable_map = function(map, disable, strict) {
      var list, trets, tretx, _i, _len, _ref;
      if (disable == null) {
        disable = false;
      }
      if (strict == null) {
        strict = true;
      }
      if (!Array.isArray(map)) {
        return;
      }
      trets = [];
      for (tret in map) {
        list = map[tret];
        tretx = this.get_tret(tret);
        if (!tretx) {
          this.log("Трэт " + tret + " не найден при применении карты включаемых правил");
          continue;
        }
        trets.push(tretx);
        if (list === true) {
          tretx.activate([], !disable, true);
        } else if (typeof list === 'string') {
          tretx.activate([list], disable, strict);
        } else if (Array.isArray(list)) {
          tretx.activate(list, disable, strict);
        }
      }
      if (strict) {
        _ref = this.trets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tret = _ref[_i];
          if (__indexOf.call(this.tret_objects[tret], trets) >= 0) {
            continue;
          }
          this.tret_objects[tret].activate([], disable, true);
        }
      }
    };


    /*
     * Установлена ли настройка
     *
     * @param string $key
     */

    EMTBase.prototype.is_on = function(key) {
      var kk;
      if (this.settings[key] == null) {
        return false;
      }
      kk = this.settings[key];
      return kk.toLowerCase() === "on" || kk === "1" || kk === true || kk === 1;
    };


    /*
     * Установить настройку
     *
     * @param mixed $selector
     * @param string $setting
     * @param mixed $value
     */

    EMTBase.prototype.doset = function(selector, key, value) {
      var pa, rule_pattern, rulename, t1, tret_obj, tret_pattern, v, _i, _len, _ref, _ref1, _ref2;
      tret_pattern = false;
      rule_pattern = false;
      if (typeof selector === 'string') {
        if (selector.indexOf(".") === -1) {
          tret_pattern = selector;
        } else {
          pa = selector.split(".");
          tret_pattern = pa[0];
          pa.shift();
          rule_pattern = pa.join(".");
        }
      }
      EMTLib._process_selector_pattern(tret_pattern);
      EMTLib._process_selector_pattern(rule_pattern);
      if (selector === "*") {
        this.settings[key] = value;
      }
      _ref = this.trets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tret = _ref[_i];
        t1 = this.get_short_tret(tret);
        if (!EMTLib._test_pattern(tret_pattern, t1) && !EMTLib._test_pattern(tret_pattern, tret)) {
          continue;
        }
        tret_obj = this.get_tret(tret);
        if (key === "active") {
          _ref1 = tret_obj.rules;
          for (rulename in _ref1) {
            v = _ref1[rulename];
            if (!EMTLib._test_pattern(rule_pattern, rulename)) {
              continue;
            }
            if (value.toLowerCase() === "on" || value === 1 || value === true || value === "1") {
              tret_obj.enable_rule(rulename);
            }
            if (value.toLowerCase() === "off" || value === 0 || value === false || value === "0") {
              tret_obj.disable_rule(rulename);
            }
          }
        } else {
          if (rule_pattern === false) {
            tret_obj.set(key, value);
          } else {
            _ref2 = tret_obj.rules;
            for (rulename in _ref2) {
              v = _ref2[rulename];
              if (!EMTLib._test_pattern(rule_pattern, rulename)) {
                continue;
              }
              tret_obj.set_rule(rulename, key, value);
            }
          }
        }
      }
    };


    /*
     * Установить настройки для тертов и правил
     *  1. если селектор является массивом, то тогда утсановка правил будет выполнена для каждого
     *     элемента этого массива, как отдельного селектора.
     *  2. Если $key не является массивом, то эта настрока будет проставлена согласно селектору
     *  3. Если $key массив - то будет задана группа настроек
     *       - если $value массив , то настройки определяются по ключам из массива $key, а значения из $value
     *       - иначе, $key содержит ключ-значение как массив  
     *
     * @param mixed $selector
     * @param mixed $key
     * @param mixed $value
     */

    EMTBase.prototype.set = function(selector, key, value) {
      var kk, val, vv, x, y, _i, _len;
      if (value == null) {
        value = false;
      }
      if (Array.isArray(selector)) {
        for (_i = 0, _len = selector.length; _i < _len; _i++) {
          val = selector[_i];
          this.set(val, key, value);
        }
        return;
      }
      if (Array.isArray(key)) {
        for (x in key) {
          y = key[x];
          if (Array.isArray(value)) {
            kk = y;
            vv = value[x];
          } else {
            kk = x;
            vv = y;
          }
          this.set(selector, kk, vv);
        }
      }
      this.doset(selector, key, value);
    };


    /*
     * Возвращает список текущих третов, которые установлены
     *
     */

    EMTBase.prototype.get_trets_list = function() {
      return this.trets;
    };


    /*
     * Установка одной метанастройки
     *
     * @param string $name
     * @param mixed $value
     */

    EMTBase.prototype.do_setup = function(name, value) {};


    /*
     * Установить настройки
     *
     * @param array $setupmap
     */

    EMTBase.prototype.setup = function(setupmap) {
      var k, map, v, _i, _len, _ref;
      if (!Array.isArray(setupmap)) {
        return;
      }
      if ((setupmap['map'] != null) || (setupmap['maps'] != null)) {
        if (setupmap['map'] != null) {
          ret['map'] = test['params']['map'];
          ret['disable'] = test['params']['map_disable'];
          ret['strict'] = test['params']['map_strict'];
          test['params']['maps'] = [ret];
          delete setupmap['map'];
          delete setupmap['map_disable'];
          delete setupmap['map_strict'];
        }
        if (Array.isArray(setupmap['maps'])) {
          _ref = setupmap['maps'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            map = _ref[_i];
            this.set_enable_map(map['map'], (map['disable'] != null ? map['disable'] : false), (map['strict'] != null ? map['strict'] : false));
          }
        }
        delete setupmap['maps'];
      }
      for (k in setupmap) {
        v = setupmap[k];
        this.do_setup(k, v);
      }
    };

    return EMTBase;

  })();

  EMTypograph = (function(_super) {
    __extends(EMTypograph, _super);

    function EMTypograph() {
      return EMTypograph.__super__.constructor.apply(this, arguments);
    }

    EMTypograph.prototype.trets = ['EMTretQuote', 'EMTretDash', 'EMTretSymbol', 'EMTretPunctmark', 'EMTretNumber', 'EMTretSpace', 'EMTretAbbr', 'EMTretNobr', 'EMTretDate', 'EMTretOptAlign', 'EMTretEtc', 'EMTretText'];

    EMTypograph.prototype.group_list = {
      'Quote': true,
      'Dash': true,
      'Nobr': true,
      'Symbol': true,
      'Punctmark': true,
      'Number': true,
      'Date': true,
      'Space': true,
      'Abbr': true,
      'OptAlign': true,
      'Text': true,
      'Etc': true
    };

    EMTypograph.prototype.all_options = {
      'Quote.quotes': {
        description: 'Расстановка «кавычек-елочек» первого уровня',
        selector: "Quote.*quote"
      },
      'Quote.quotation': {
        description: 'Внутренние кавычки-лапки',
        selector: "Quote",
        setting: 'no_bdquotes',
        reversed: true
      },
      'Dash.to_libo_nibud': 'direct',
      'Dash.iz_za_pod': 'direct',
      'Dash.ka_de_kas': 'direct',
      'Nobr.super_nbsp': 'direct',
      'Nobr.nbsp_in_the_end': 'direct',
      'Nobr.phone_builder': 'direct',
      'Nobr.ip_address': 'direct',
      'Nobr.spaces_nobr_in_surname_abbr': 'direct',
      'Nobr.nbsp_celcius': 'direct',
      'Nobr.hyphen_nowrap_in_small_words': 'direct',
      'Nobr.hyphen_nowrap': 'direct',
      'Nobr.nowrap': {
        description: 'Nobr (по умолчанию) & nowrap',
        disabled: true,
        selector: '*',
        setting: 'nowrap'
      },
      'Symbol.tm_replace': 'direct',
      'Symbol.r_sign_replace': 'direct',
      'Symbol.copy_replace': 'direct',
      'Symbol.apostrophe': 'direct',
      'Symbol.degree_f': 'direct',
      'Symbol.arrows_symbols': 'direct',
      'Symbol.no_inches': {
        description: 'Расстановка дюйма после числа',
        selector: "Quote",
        setting: 'no_inches',
        reversed: true
      },
      'Punctmark.auto_comma': 'direct',
      'Punctmark.hellip': 'direct',
      'Punctmark.fix_pmarks': 'direct',
      'Punctmark.fix_excl_quest_marks': 'direct',
      'Punctmark.dot_on_end': 'direct',
      'Number.minus_between_nums': 'direct',
      'Number.minus_in_numbers_range': 'direct',
      'Number.auto_times_x': 'direct',
      'Number.simple_fraction': 'direct',
      'Number.math_chars': 'direct',
      'Number.thinsp_between_number_triads': 'direct',
      'Number.thinsp_between_no_and_number': 'direct',
      'Number.thinsp_between_sect_and_number': 'direct',
      'Date.years': 'direct',
      'Date.mdash_month_interval': 'direct',
      'Date.nbsp_and_dash_month_interval': 'direct',
      'Date.nobr_year_in_date': 'direct',
      'Space.many_spaces_to_one': 'direct',
      'Space.clear_percent': 'direct',
      'Space.clear_before_after_punct': {
        description: 'Удаление пробелов перед и после знаков препинания в предложении',
        selector: 'Space.remove_space_before_punctuationmarks'
      },
      'Space.autospace_after': {
        description: 'Расстановка пробелов после знаков препинания',
        selector: 'Space.autospace_after_*'
      },
      'Space.bracket_fix': {
        description: 'Удаление пробелов внутри скобок, а также расстановка пробела перед скобками',
        selector: ['Space.nbsp_before_open_quote', 'Punctmark.fix_brackets']
      },
      'Abbr.nbsp_money_abbr': 'direct',
      'Abbr.nobr_vtch_itd_itp': 'direct',
      'Abbr.nobr_sm_im': 'direct',
      'Abbr.nobr_acronym': 'direct',
      'Abbr.nobr_locations': 'direct',
      'Abbr.nobr_abbreviation': 'direct',
      'Abbr.ps_pps': 'direct',
      'Abbr.nbsp_org_abbr': 'direct',
      'Abbr.nobr_gost': 'direct',
      'Abbr.nobr_before_unit_volt': 'direct',
      'Abbr.nbsp_before_unit': 'direct',
      'OptAlign.all': {
        description: 'Все настройки оптического выравнивания',
        hide: true,
        selector: 'OptAlign.*'
      },
      'OptAlign.oa_oquote': 'direct',
      'OptAlign.oa_obracket_coma': 'direct',
      'OptAlign.oa_oquote_extra': 'direct',
      'OptAlign.layout': {
        description: 'Inline стили или CSS'
      },
      'Text.paragraphs': 'direct',
      'Text.auto_links': 'direct',
      'Text.email': 'direct',
      'Text.breakline': 'direct',
      'Text.no_repeat_words': 'direct',
      'Etc.unicode_convert': {
        description: 'Преобразовывать html-сущности в юникод',
        selector: '*',
        setting: 'dounicode'
      }
    };


    /*
     * Получить список имеющихся опций
     *
     * @return array
     *     all    - полный список
     *     group  - сгруппрованный по группам
     */

    EMTypograph.prototype.get_options_list = function() {
      var bygroup, ginfo, group, info, op, opt, x, _i, _len, _ref, _ref1, _ref2;
      arr['all'] = {};
      bygroup = {};
      _ref = this.all_options;
      for (opt in _ref) {
        op = _ref[opt];
        arr['all'][opt] = this.get_option_info(opt);
        x = opt.split(".");
        if (bygroup[x[0]] == null) {
          bygroup[x[0]] = [];
        }
        bygroup[x[0]].push(opt);
      }
      arr['group'] = {};
      _ref1 = this.group_list;
      for (group in _ref1) {
        ginfo = _ref1[group];
        if (ginfo === true) {
          tret = this.get_tret(group);
          if (tret) {
            info['title'] = tret.title;
          } else {
            info['title'] = "Не определено";
          }
        } else {
          info = ginfo;
        }
        info['name'] = group;
        info['options'] = [];
        if (Array.isArray(bygroup[group])) {
          _ref2 = bygroup[group];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            opt = _ref2[_i];
            info['options'].push(opt);
          }
        }
        arr['group'].push(info);
      }
      return arr;
    };


    /*
     * Получить информацию о настройке
     *
     * @param string $key
     * @return array|false
     */

    EMTypograph.prototype.get_option_info = function(key) {
      var arr, pa, tret_pattern;
      if (this.all_options[key] == null) {
        return false;
      }
      if (Array.isArray(this.all_options[key])) {
        return this.all_options[key];
      }
      if (this.all_options[key] === "direct" || this.all_options[key] === "reverse") {
        pa = key.split(".");
        tret_pattern = pa[0];
        tret = this.get_tret(tret_pattern);
        if (!tret) {
          return false;
        }
        if (tret.rules[pa[1]] == null) {
          return false;
        }
        arr = tret.rules[pa[1]];
        arr['way'] = this.all_options[key];
        return arr;
      }
      return false;
    };


    /*
     * Установка одной метанастройки
     *
     * @param string $name
     * @param mixed $value
     */

    EMTypograph.prototype.do_setup = function(name, value) {
      var settingname;
      if (this.all_options[name] == null) {
        return;
      }
      if (typeof this.all_options[name] === 'string') {
        this.set(name, "active", value);
        return;
      }
      if (Array.isArray(this.all_options[name])) {
        if (this.all_options[name]['selector'] != null) {
          settingname = "active";
          if (this.all_options[name]['setting'] != null) {
            settingname = this.all_options[name]['setting'];
          }
          this.set(this.all_options[name]['selector'], settingname, value);
        }
      }
      if (name === "OptAlign.layout") {
        if (value === "style") {
          this.set_tag_layout(EMTLib.LAYOUT_STYLE);
        }
        if (value === "class") {
          this.set_tag_layout(EMTLib.LAYOUT_CLASS);
        }
      }
    };


    /*
     * Запустить типограф со стандартными параметрами
     *
     * @param string $text
     * @param array $options
     * @return string
     */

    EMTypograph.prototype.fast_apply = function(text, options) {
      var obj;
      if (options == null) {
        options = null;
      }
      obj = new this();
      if (Array.isArray(options)) {
        obj.setup(options);
      }
      obj.set_text(text);
      return obj.apply();
    };

    return EMTypograph;

  })(EMTBase);

  module.exports = EMTypograph;

}).call(this);
