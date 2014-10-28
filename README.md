# EMT [![Build Status](https://secure.travis-ci.org/semencov/node-emt.png?branch=master)](http://travis-ci.org/semencov/node-emt)

This is Node.js port of the original Evgeny Muravjev Typograph ([http://mdash.ru](http://mdash.ru)) by Evgeny Muravjev & Alexander Drutsa

## Getting Started
Install the module with: `npm install node-emt`

```javascript
var EMT = require('emt');
var a = new EMT();
a.set_text("Типографика - это круто!");
console.log(a.apply());
```

## Documentation
Currently this is a "dirty" port from PHP library which fully immitates its behavior excluding debuging and custom builds. So you can check the original documentation on [http://mdash.ru](http://mdash.ru). Optimizations and improvements will follow.

## License
Copyright (c) 2014 Yuri Sementsov. Licensed under the MIT license.
