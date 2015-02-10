# mdash

This is Node.js port of the original Typograph ([http://mdash.ru](http://mdash.ru)) by Evgeny Muravjev & Alexander Drutsa

## Getting Started
Install the module with: `npm install mdash-node`

## Documentation
Currently this is a "dirty" port from PHP library which fully immitates its behavior excluding debuging and custom builds. So you can check the original documentation on [http://mdash.ru](http://mdash.ru). Optimizations and improvements will follow.

### Usage
The lib can accept settings either with new instance or as args to the format method.

```javascript
var mdash = require('mdash-node');

var a = new mdash("Типографика - это круто!");
console.log(a.format());  // <p>Типографика&nbsp;&mdash; это круто!</p>

var b = new mdash("Типографика - это круто!", {'Text.paragraphs': "off"});
console.log(b.format());  // Типографика&nbsp;&mdash; это круто!

var c = new mdash({'Text.paragraphs': "off"});
console.log(c.format("Типографика - это круто!"));  // Типографика&nbsp;&mdash; это круто!

console.log(mdash.format("Типографика - это круто!", {'Text.paragraphs': "off"}));  // Типографика&nbsp;&mdash; это круто!
```

Also you can get the list of trets and rules:
```javascript
console.log(mdash.get_trets_list());
//[ 'Abbr',
//  'Dash',
//  'Date',
//  'Etc',
//  'Nobr',
//  'Number',
//  'OptAlign',
//  'Punctmark',
//  'Quote',
//  'Space',
//  'Symbol',
//  'Text' ]

console.log(mdash.get_rules_list());

console.log(mdash.get_rules_list('Dash'));    // Specify a tret as argument
console.log(mdash.get_rules_list('Dash.*'));  // Specify a mask as argument
// { Dash: 
//    { mdash_symbol_to_html_mdash: 'on',
//      mdash: 'on',
//      mdash_2: 'on',
//      mdash_3: 'on',
//      iz_za_pod: 'on',
//      to_libo_nibud: 'on',
//      koe_kak: 'on',
//      ka_de_kas: 'off' } }
```

### Settings
All settings are usualy just the rule names, so mainly you can enable or disable some of them. Also you can specify some options for the rule or specify some virtual settings for different rules. To disable some rule you can pass the arguments object where key is rulename (with namespace — tret name) and the value is anything could be evaluated as `false` (0, '0', 'false', false, 'off'). For example, we want to disable rule `oa_obracket_coma` in namespace `OptAlign`:

```javascript
{
  'OptAlign.oa_obracket_coma': "off"
}
```

Also we can disable all rules in the namespace:

```javascript
{
  'OptAlign': "off"
}
```

Or like this:

```javascript
{
  'OptAlign.*': "off"
}
```

In case we need to specify some options inside the rules or to apply some methods inside the different rules, we can use "virtual" rules. It is just a setting which name does not conflict with real rule name and selects specified rules:

```javascript
{
  'Nobr.nowrap': {
    disabled: false,
    selector: '*',
    nowrap: true
  }
}
```

There is no such rule as `Nobr.nowrap`, however if we will pass this as setting to the lib, the option `nowrap` will be applied to the rules specified in `selector` (to all rules in this case). Also switching `disabled` will either enable or disable it.

There are several predefined "virtual" options:

```javascript
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
  'Etc.unicode_convert': {
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
  "OptAlign.oa_obracket_coma": "off",
  "Text.paragraphs": "off",
  "Text.breakline": "off",
  "Quote": "off"
}
```
This settings will override the default, but will be overriden by options you'll supply to instance.


## License
Everyone is free to use and to modify this project
