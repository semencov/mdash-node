(function() {
  var Lib, Tret;

  Lib = require('./lib');

  module.exports = Tret = (function() {
    Tret.prototype.rules = {};

    Tret.prototype.classes = {};

    Tret.prototype.settings = {};

    Tret.prototype.order = 5;

    function Tret(options) {
      if ((options != null) && typeof options === 'objects') {
        this.set(options);
      }
      return;
    }

    Tret.prototype.apply = function(text) {
      var id, k, pattern, replacement, result, rule, self, _ref, _ref1;
      self = this;
      console.log(("\nTRET\t" + this.constructor.name + "...").yellow);
      _ref = this.rules;
      for (id in _ref) {
        rule = _ref[id];
        if (rule.disabled) {
          console.log(("RULE\t" + id + "...\tDisabled.").grey);
        } else {
          console.log(("RULE\t" + id + "...").green);
        }
        if (rule.disabled) {
          continue;
        }
        if (rule["function"] != null) {
          result = rule["function"].call(self, text, rule);
          console.log("\t# Custom function");
          if (typeof result !== 'string') {
            throw new Error("Custom function returned wrong result");
            continue;
          }
          text = result;
        }
        if (rule.pattern != null) {
          _ref1 = rule.pattern;
          for (k in _ref1) {
            pattern = _ref1[k];
            replacement = typeof rule.replacement === 'object' ? rule.replacement[k] || rule.replacement[0] : rule.replacement;
            result = text.replace(pattern, typeof replacement === 'string' ? replacement : function() {
              var i, _i, _ref2;
              for (i = _i = 0, _ref2 = arguments.length; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
                global["$" + i] = arguments[i];
              }
              console.log(("\t# Matched pattern #" + k + "\t'") + $0.dim.white + "' → '" + replacement.call(self).dim.white + "'");
              return replacement.call(self);
            });
            if (typeof result === 'string') {
              text = result;
            }
          }
        }
      }
      return text;
    };

    Tret.prototype.set = function() {
      var argn, fn, id, key, opts, pattern, replacement, rule, settings, val, value, _ref, _ref1, _ref2;
      argn = arguments.length;
      settings = {};
      if (arguments.length >= 3) {
        rule = arguments[0], key = arguments[1], value = arguments[2];
        settings[rule][key] = value;
      } else if (arguments.length === 2) {
        key = arguments[0], value = arguments[1];
        for (rule in this.rules) {
          if (settings[rule] == null) {
            settings[rule] = {};
          }
          settings[rule][key] = value;
        }
      } else if (arguments.length === 1 && typeof arguments[0] === 'object') {
        settings = arguments[0];
      }
      _ref = this.rules;
      for (id in _ref) {
        rule = _ref[id];
        if (settings[id] == null) {
          continue;
        }
        opts = rule;
        if (settings[id] != null) {
          opts = Lib.merge(opts, settings[id]);
        }
        rule = {};
        if (rule.disabled == null) {
          rule.disabled = false;
        }
        if (rule.pattern == null) {
          rule.pattern = [];
        }
        if (rule.replacement == null) {
          rule.replacement = null;
        }
        if (rule["function"] == null) {
          rule["function"] = null;
        }
        if (opts.disabled != null) {
          rule.disabled = (_ref1 = ("" + opts.disabled).toLowerCase()) === "1" || _ref1 === "true";
          delete opts['disabled'];
        }
        if (opts.enabled != null) {
          rule.disabled = (_ref2 = ("" + opts.enabled).toLowerCase()) === "0" || _ref2 === "false" || _ref2 === "off";
          delete opts['enabled'];
        }
        if (opts.order != null) {
          rule.order = parseInt(opts.order) || 5;
          delete opts['order'];
        }
        if (opts["function"] != null) {
          fn = opts["function"];
          if (typeof fn === 'string') {
            if (this[fn] != null) {
              fn = this[fn];
            }
            if (eval("typeof " + fn) === 'function') {
              fn = eval(fn);
            }
          }
          if (typeof fn === 'function') {
            rule["function"] = fn;
          }
          delete opts['function'];
        }
        if (opts.pattern != null) {
          pattern = opts.pattern;
          if (!Array.isArray(pattern)) {
            pattern = [pattern];
          }
          rule.pattern = pattern;
          delete opts['pattern'];
        }
        if (opts.replacement != null) {
          replacement = opts.replacement;
          if (typeof replacement === 'string' && /^[a-z_0-9]+$/i.test(replacement)) {
            if ((this[replacement] != null) && typeof this[replacement] === 'function') {
              replacement = this[replacement];
            }
            if (eval("typeof " + replacement) === 'function') {
              replacement = eval(replacement);
            }
          }
          rule.replacement = replacement;
          delete opts['replacement'];
        }
        for (key in opts) {
          val = opts[key];
          rule[key] = val;
        }
        if (rule.pattern.length && (rule.replacement == null) && (rule["function"] == null)) {
          throw new Error("There is no replacement setted for the patterns");
        }
        this.rules[id] = rule;
      }
    };

    Tret.prototype.disable = function(name) {
      if (this.rules[name] != null) {
        this.set(name, disabled, true);
      }
    };

    Tret.prototype.enable = function(name) {
      if (this.rules[name] != null) {
        this.set(name, disabled, false);
      }
    };

    Tret.prototype.getRuleNames = function() {
      var self;
      self = this;
      return Object.keys(this.rules).sort(function(a, b) {
        return (self.rules[a].order || 5) - (self.rules[b].order || 5);
      });
    };

    return Tret;

  })();

}).call(this);
