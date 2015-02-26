
/*

mdash
https://github.com/semencov/mdash-node

Copyright (c) 2015 Yuri Sementsov
Licensed under the MIT license.
 */

(function() {
  'use strict';
  var Lib, Mdash, colors, debug, fs, path, readFile, settingsFile, tretsDir;

  process.on('uncaughtException', function(error) {
    console.log("=[uncaughtException]=====================================================");
    console.error(error);
    console.log(error.stack);
    return console.log("=========================================================================");
  });

  path = require('path');

  fs = require('fs');

  Lib = require('./lib');

  colors = require('colors');

  settingsFile = path.join(process.cwd(), ".mdash");

  tretsDir = path.join(__dirname, './trets');

  debug = function(obj, place, after_text, after_text_raw) {
    if (after_text_raw == null) {
      after_text_raw = "";
    }
    console.info("DEBUG\t " + obj.constructor.name + "\t\t\t", place);
  };

  readFile = function(filepath) {
    var contents, e, result;
    contents = void 0;
    result = void 0;
    try {
      contents = fs.readFileSync(String(filepath));
      try {
        result = JSON.parse(contents);
        console.log("FILE\tFound .mdash file with settings.\n".blue, result);
      } catch (_error) {
        e = _error;
        console.log("ERROR\t".bold.red, e);
        return;
      }
      return result;
    } catch (_error) {
      e = _error;
      return;
    }
  };

  module.exports = Mdash = (function() {
    Mdash.prototype.presets = {
      'Quote': {
        no_bdquotes: false,
        no_inches: false
      },
      'OptAlign': {
        disabled: true
      },
      'Text': {
        disabled: true
      },
      'Dash.ka_de_kas': {
        disabled: true
      },
      'Date.mdash_month_interval': {
        disabled: true
      },
      'Date.nbsp_and_dash_month_interval': {
        disabled: true
      },
      'Nobr.hyphen_nowrap_in_small_words': {
        disabled: true
      },
      'Nobr.hyphen_nowrap': {
        disabled: true
      },
      'Punctmark.dot_on_end': {
        disabled: true
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
      'Etc.unicode': {
        selector: '*',
        dounicode: true,
        disabled: true
      }
    };

    function Mdash(text, options) {
      var self;
      if (options == null) {
        options = {};
      }
      self = this;
      if (typeof text === 'object') {
        options = text;
        text = null;
      }
      options = Lib.merge(readFile(settingsFile) || {}, options);
      this.inited = false;
      this.text = text;
      this.trets = {};
      this.tretsOrder = [];
      fs.readdirSync(tretsDir).forEach(function(file) {
        var e, name, tret;
        try {
          tret = require("" + tretsDir + "/" + file);
          if (tret.__super__.constructor.name === 'Tret') {
            name = tret.prototype.constructor.name;
            if (self.trets[name] == null) {
              self.trets[name] = new tret();
              return self.tretsOrder.push(name);
            }
          }
        } catch (_error) {
          e = _error;
        }
      });
      this.tretsOrder.sort(function(a, b) {
        return self.trets[a].order - self.trets[b].order;
      });
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
     * Задаём текст для применения типографа
     *
     * @param string $text
     */

    Mdash.prototype.setText = function(text) {
      return this.text = text;
    };


    /*
     * Установлена ли настройка
     *
     * @param string $key
     */

    Mdash.prototype.isOn = function(key) {
      var _ref, _ref1;
      if (((_ref = this.settings["*"]) != null ? _ref[key] : void 0) == null) {
        return false;
      }
      return (_ref1 = ("" + this.settings["*"][key]).toLowerCase()) === "on" || _ref1 === "true" || _ref1 === "1" || _ref1 === "direct";
    };

    Mdash.prototype.getTretNames = function() {
      return this.tretsOrder;
    };

    Mdash.prototype.getRuleNames = function(mask) {
      var result, ruleNames, self, tret, tretNames, _i, _len;
      self = this;
      result = {};
      tretNames = this.getTretNames();
      for (_i = 0, _len = tretNames.length; _i < _len; _i++) {
        tret = tretNames[_i];
        ruleNames = this.trets[tret].getRuleNames();
        result[tret] = ruleNames;
      }
      if (mask) {
        return Lib.selectRules(mask, result);
      } else {
        return result;
      }
    };

    Mdash.prototype.getSettings = function() {
      return this.settings;
    };


    /*
     * Установить настройки
     *
     * @param array $setupmap
     */

    Mdash.prototype.setup = function(options) {
      var opts, rule, ruleList, ruleNames, rules, selector, settings, tret, value, _i, _len, _ref, _ref1;
      if (options == null) {
        options = {};
      }
      this.settings = Lib.processSettings(this.presets);
      options = Lib.processSettings(options, this.presets);
      for (selector in options) {
        value = options[selector];
        value = Lib.merge(this.settings[selector] || {}, value) || {};
        if (Object.keys(value).length > 0) {
          this.settings[selector] = value;
        }
      }
      settings = {};
      ruleNames = this.getRuleNames();
      _ref = this.settings;
      for (selector in _ref) {
        value = _ref[selector];
        ruleList = Lib.selectRules(selector, ruleNames);
        for (tret in ruleList) {
          rules = ruleList[tret];
          if (settings[tret] == null) {
            settings[tret] = {};
          }
          for (_i = 0, _len = rules.length; _i < _len; _i++) {
            rule = rules[_i];
            if (value['disabled'] || ((_ref1 = settings[tret][rule]) != null ? _ref1['disabled'] : void 0)) {
              settings[tret][rule] = {
                disabled: true
              };
            } else {
              settings[tret][rule] = (settings[tret][rule] != null ? Lib.merge(settings[tret][rule], value) : value);
            }
          }
        }
      }
      if (!this.inited) {
        this.init();
      }
      for (tret in settings) {
        opts = settings[tret];
        this.trets[tret].set(opts);
      }
    };

    Mdash.prototype.init = function() {
      var self;
      self = this;
      if (!this.inited) {
        this.blocks.push(Lib.addSafeBlock('pre'));
        this.blocks.push(Lib.addSafeBlock('code'));
        this.blocks.push(Lib.addSafeBlock('script'));
        this.blocks.push(Lib.addSafeBlock('style'));
        this.blocks.push(Lib.addSafeBlock('notg'));
        this.blocks.push(Lib.addSafeBlock('span-notg', ['<span class="_notg_start"></span>', '<span class="_notg_end"></span>']));
      }
      this.inited = true;
    };


    /*
     * Prepare text before applying rules:
     * - encrypt HTML tags
     * - encrypt content inside safe tags
     * - normilize special chars and entities
     */

    Mdash.prototype.beforeFormat = function(text) {
      text = Lib.processSafeBlocks(text, this.blocks, Lib.encode);
      text = Lib.processTags(text, Lib.encode);
      text = Lib.clearSpecialChars(text);
      return text.trim();
    };


    /*
     * Clean text after applying rules:
     * - decrypt HTML tags
     * - decript content in safe tags
     */

    Mdash.prototype.afterFormat = function(text) {
      var repl;
      text = Lib.decodeInternalBlocks(text);
      if (this.isOn('dounicode')) {
        text = Lib.convertEntitiesToUnicode(text);
      }
      text = Lib.processTags(text, Lib.decode);
      text = Lib.processSafeBlocks(text, this.blocks, Lib.decode, true);
      if (!this.disable_notg_replace) {
        repl = ['<span class="_notg_start"></span>', '<span class="_notg_end"></span>'];
        if (this.remove_notg) {
          repl = "";
        }
        text = text.replace(['<notg>', '</notg>'], repl);
      }
      return text.trim();
    };


    /*
     * Запустить типограф на выполнение
     *
     */

    Mdash.prototype.format = function(text, options, callback) {
      var tretName, tretObj, _i, _len, _ref;
      if (text != null) {
        this.setText(text);
      }
      if ((options != null) && typeof options === 'object') {
        this.setup(options);
      }
      this.text = this.beforeFormat(this.text);
      _ref = this.tretsOrder;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tretName = _ref[_i];
        tretObj = this.trets[tretName];
        this.text = tretObj.apply(this.text);
      }
      this.text = this.afterFormat(this.text);
      return this.text;
    };


    /*
     * Получить содержимое <style></style> при использовании классов
     * 
     * @param bool $list false - вернуть в виде строки для style или как массив
     * @param bool $compact не выводить пустые классы
     * @return string|array
     */

    Mdash.prototype.getStyle = function(list, compact) {
      var arr, classname, clsname, k, res, str, tret, tretObj, v, _i, _len, _ref;
      if (list == null) {
        list = false;
      }
      if (compact == null) {
        compact = false;
      }
      res = {};
      _ref = this.getTretNames();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tret = _ref[_i];
        tretObj = this.trets[tret];
        arr = tretObj.classes;
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
     * Запустить типограф со стандартными параметрами
     *
     * @param string $text
     * @param array $options
     * @return string
     */

    Mdash.format = function(text, options, callback) {
      var obj;
      if (options == null) {
        options = {};
      }
      obj = new this(text, options);
      return obj.format();
    };

    Mdash.getTretNames = function(short) {
      if (short == null) {
        short = true;
      }
      return this.prototype.getTretNames(short);
    };

    Mdash.getRuleNames = function(mask) {
      return this.prototype.getRuleNames(mask);
    };


    /*
     * Установить режим разметки,
     *   Lib.LAYOUT_STYLE - с помощью стилей
     *   Lib.LAYOUT_CLASS - с помощью классов
     *   Lib.LAYOUT_STYLE|Lib.LAYOUT_CLASS - оба метода
     *
     * @param int $layout
     */

    Mdash.setLayout = function(layout) {
      if (layout == null) {
        layout = Lib.LAYOUT_STYLE;
      }
      return Lib.LAYOUT = layout;
    };


    /*
     * Установить префикс для классов
     *
     * @param string|bool $prefix если true то префикс 'mdash_', иначе то, что передали
     */

    Mdash.setLayoutClassPrefix = function(prefix) {
      if (prefix != null) {
        return Lib.LAYOUT_CLASS_PREFIX = prefix;
      }
    };

    Mdash.getStyles = function() {
      return Lib.getStyles();
    };

    return Mdash;

  })();

}).call(this);
