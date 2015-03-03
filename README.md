# mdash

[![NPM](https://nodei.co/npm/mdash-node.png?downloads=true&stars=true)](https://nodei.co/npm/mdash-node/)

This is Node.js port of the original Russian Typograph ([mdash.ru](http://mdash.ru/)) by Evgeny Muravjev

## Getting Started
Install the module with:
```bash
npm install mdash-node
```

## Documentation

Currently this is a port from PHP library which fully immitates its behavior excluding debuging and custom builds. So you can check the original documentation on [mdash.ru](http://mdash.ru/). Optimizations and improvements will follow. All formatting rules can be found on [mdash.ru/rules.html](http://mdash.ru/rules.html) (Russian).

### Usage

The module can accept rules settings either with new instance or as args to the format method.

```javascript
var Mdash = require('mdash-node');

var tp = new Mdash("Типографика - это круто!");
var txt = tp.format();  // Типографика&nbsp;&mdash; это круто!
```

Rule settings can be suplied to instance.

```javascript
var tp = new Mdash("Типографика - это круто!", {'Text.paragraphs': true});
var txt = tp.format();  // <p>Типографика&nbsp;&mdash; это круто!</p>

txt = tp.format("Типографика - это круто!", {
  'Text.paragraphs': false
});  // Типографика&nbsp;&mdash; это круто!
```

You can also pass a callback to the method `format`:

```javascript
Mdash.format("Типографика - это круто!", {'Text.paragraphs': true}, function(err, text) {
  console.log(text);  // <p>Типографика&nbsp;&mdash; это круто!</p>
});

Mdash.format("Типографика - это круто!", function(err, text) {
  console.log(text);  // Типографика&nbsp;&mdash; это круто!
});
```

Also you can get the list of trets (in order of appliance):

```javascript
var typo = new Mdash();
var trets = typo.getTretNames();

// [ 'Text',
//   'Space',
//   'Number',
//   'Quote',
//   'Punctmark',
//   'Date',
//   'Symbol',
//   'Nobr',
//   'Dash',
//   'Abbr',
//   'OptAlign',
//   'Etc' ]
```

Get rules for all tret or specific one:

```javascript
var typo = new Mdash();
var allRules = typo.getRuleNames();  // Get all rules

var dashRules = typo.getRuleNames('Dash');    // Specify a tret as argument

// { Dash:
//    [ 'mdash_symbol_to_html_mdash',
//      'mdash',
//      'mdash_2',
//      'mdash_3',
//      'iz_za_pod',
//      'to_libo_nibud',
//      'koe_kak',
//      'ka_de_kas' ] }
```

You can get current settings of the typograph:

```javascript
var typo = new Mdash();
var settings = typo.getSettings();

// { Quote: { no_bdquotes: false, no_inches: false },
//   OptAlign: { disabled: true },
//   Text: { disabled: true },
//   'Dash.ka_de_kas': { disabled: true },
//   'Date.mdash_month_interval': { disabled: true },
//   'Date.nbsp_and_dash_month_interval': { disabled: true },
//   'Nobr.hyphen_nowrap_in_small_words': { disabled: true },
//   'Nobr.hyphen_nowrap': { disabled: true },
//   'Punctmark.dot_on_end': { disabled: true },
//   'OptAlign.oa_obracket_coma': { disabled: true } }
```

### Module Settings

By default some rules (eg. rules for Optical Alignment) put additional HTML tags in your text with inline styles. If you would like to put styles in separate classes, use this:

```javascript
Mdash.setLayout(Mdash.LAYOUT_CLASS);
```

Or you can set styles to go both inline and in class:

```javascript
Mdash.setLayout(Mdash.LAYOUT_STYLE|Mdash.LAYOUT_CLASS);
```

And to set class prefix (by default it is `'mdash-'`):

```javascript
Mdash.setLayoutClassPrefix('typo-');
```

### Rules Settings
All settings are usualy just the rule names with tret name as the namespace, so mainly you can enable or disable some of them. Also you can specify some options for the rule or specify some virtual settings for different rules. To disable some rule you can pass the arguments object where key is rulename (with namespace — tret name) and the value is `false`. For example, we want to disable rule `oa_obracket_coma` in namespace `OptAlign`:

```javascript
{
  'OptAlign.oa_obracket_coma': false
}
```

Also we can disable all rules in the namespace:

```javascript
{
  'OptAlign': false
}
```

In case we need to specify some options inside the rules or to apply some methods inside the different rules, we can use "virtual" rules. It is just a setting which name does not conflict with real rule name and selects specified rules:

```javascript
{
  'Space.autospace_after': {
    selector: 'Space.autospace_after_*'
  },
  'Etc.unicode': {
    selector: '*',
    dounicode: true,
    disabled: true
  }
}
```

There is no such rule as `Etc.unicode`, however if we will pass this as setting to the lib, the option `dounicode` will be applied to the rules specified in `selector` (to all rules in this case). Also switching `disabled` will either enable or disable it.

For example, to turn on convertion of the HTML entities in unicode characters we can put this in settings:

```javascript
var typo = new Mdash({
  'Etc.unicode': true
});
```

Or if we would like to disable all rules which puts space after punctuation marks:

```javascript
var typo = new Mdash({
  'Space.autospace_after': false
});
```

Which is equal to this settings for the real rules:

```javascript
var typo = new Mdash({
  'Space.autospace_after_comma': false,
  'Space.autospace_after_pmarks': false,
  'Space.autospace_after_dot': false,
  'Space.autospace_after_hellips': false
});
```


There are several presets and predefined "virtual" options:

```javascript
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
```

### .mdash

You can specify global settings by putting simple JSON file `.mdash` in the root of your project:

```javascript
{
  "OptAlign.oa_obracket_coma": false,
  "Text.paragraphs": false,
  "Text.breakline": false,
  "Quote": false
}
```

This settings will override the default, but will be overriden by options you'll pass to instance.


## License

This package is licensed under the MIT license.
