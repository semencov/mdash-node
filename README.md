# mdash

This is Node.js port of the original Typograph ([http://mdash.ru](http://mdash.ru)) by Evgeny Muravjev & Alexander Drutsa

## Getting Started
Install the module with: `npm install mdash`

## Usage
```javascript
var mdash = require('mdash');

var a = new mdash("Типографика - это круто!");
console.log(a.format());  // <p>Типографика&nbsp;&mdash; это круто!</p>

var b = new mdash("Типографика - это круто!", {'Text.paragraphs': "off"});
console.log(b.format());  // Типографика&nbsp;&mdash; это круто!

var c = new mdash({'Text.paragraphs': "off"});
console.log(c.format("Типографика - это круто!"));  // Типографика&nbsp;&mdash; это круто!

console.log(mdash.format("Типографика - это круто!", {'Text.paragraphs': "off"}));  // Типографика&nbsp;&mdash; это круто!
```

## Documentation
Currently this is a "dirty" port from PHP library which fully immitates its behavior excluding debuging and custom builds. So you can check the original documentation on [http://mdash.ru](http://mdash.ru). Optimizations and improvements will follow.


## License
Everyone is free to use and to modify this project
