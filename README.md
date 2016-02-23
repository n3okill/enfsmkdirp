[![Build Status](https://travis-ci.org/n3okill/enfsmkdirp.svg)](https://travis-ci.org/n3okill/enfsmkdirp)
[![Build status](https://ci.appveyor.com/api/projects/status/9dk56b6mtkdlmm7q?svg=true)](https://ci.appveyor.com/project/n3okill/enfsmkdirp)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/69090ad47de140bbb12d82a2f5a8bed3)](https://www.codacy.com/app/n3okill/enfsmkdirp)
[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=64PYTCDH5UNZ6)

[![NPM](https://nodei.co/npm/enfsmkdirp.png)](https://nodei.co/npm/enfsmkdirp/)

enfsmkdirp
=========
Module that add list functionality to node fs module

**enfs** stands for [E]asy [N]ode [fs]

This module is intended to work as a sub-module of [enfs](https://www.npmjs.com/package/enfs)


Description
-----------
This module will add a method that allows the creation o directories
and sub-directories with one command line. Add mkdir -p functionality to node fs module

- This module will add following methods to node fs module:
  * mkdirp
  * mkdirpSync
  
Usage
-----
`enfsmkdirp`

```js
    var enfsmkdirp = require("enfsmkdirp");
```

Errors
------
All the methods follows the node culture.
- Async: Every async method returns an Error in the first callback parameter
- Sync: Every sync method throws an Error.


Additional Methods
------------------
- [mkdirp](#mkdirp)
- [mkdirpSync](#mkdirpsync)


### mkdirp
  - **mkdirp(path, [options], callback)**

> Asynchronously create multiple directories levels

`path`
The path can be on the form of a string, an array or "brace-string"

[options]:
  * fs (Object): an alternative fs module to use (default will be [enfspatch](https://www.npmjs.com/package/enfspatch))
  * mode (String or Number): the mode that will be attributed to the directory being created


  - Path (String)

```js
    enfsmkdirp.mkdirp("/home/path/to/folder", function(err){
        //do something
    });
```

  - Path (Array)

```js
    enfsmkdirp.mkdirp(["/home/path/to/folder","/var/home/test"], function(err){
        //do something
    });
```

  - Path ("brace-string")

```js
    enfsmkdirp.mkdirp("./project/{development,production}/{public,css,private,test}", function(err){
        //do something
    });
```

### mkdirpSync
  - **mkdirpSync(path, [options])**

> Synchronously create multiple directories levels

`path`
The path can be on the form of a string, an array or "brace-string"

[options]:
  * fs (Object): an alternative fs module to use (default will be [enfspatch](https://www.npmjs.com/package/enfspatch))
  * mode (String or Number): the mode that will be attributed to the directory being created


  - Path (String)

```js
    enfsmkdirp.mkdirpSync("/home/path/to/folder");
```

  - Path (Array)

```js
    enfsmkdirp.mkdirpSync(["/home/path/to/folder","/var/home/test"]);
```

  - Path ("brace-string")

```js
    enfsmkdirp.mkdirpSync("./project/{development,production}/{public,css,private,test}");
```


License
-------

Creative Commons Attribution 4.0 International License

Copyright (c) 2016 Joao Parreira <joaofrparreira@gmail.com> [GitHub](https://github.com/n3okill)

This work is licensed under the Creative Commons Attribution 4.0 International License. 
To view a copy of this license, visit [CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/).


