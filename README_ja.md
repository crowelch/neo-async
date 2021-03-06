# Neo-Async
[![npm](https://img.shields.io/npm/v/neo-async.svg)](https://www.npmjs.com/package/neo-async)
[![Travis](https://img.shields.io/travis/suguru03/neo-async.svg)](https://travis-ci.org/suguru03/neo-async)
[![Codecov](https://img.shields.io/codecov/c/github/suguru03/neo-async.svg)](https://codecov.io/github/suguru03/neo-async?branch=master)
[![Dependency Status](https://gemnasium.com/suguru03/neo-async.svg)](https://gemnasium.com/suguru03/neo-async)
[![npm](https://img.shields.io/npm/dm/neo-async.svg)](https://www.npmjs.com/package/neo-async)

Neo-Asyncは[Async](https://github.com/caolan/async)にほぼ完全に互換性があり、より速く、高機能な非同期処理ライブラリです。

![Neo-Async](https://raw.githubusercontent.com/wiki/suguru03/neo-async/images/neo_async.png)

![nodei](https://nodei.co/npm/neo-async.png?downloads=true&downloadRank=true)

## 速度比較

* async v0.9.0
* neo-async v0.4.9

### フロントエンドの速度比較

フロントエンドの速度計測にはjsPerfを用いて計測しました。
計測環境は以下の３つです。

* Chrome 40.0.2214
* FireFox 34.0
* Safari 8.0.2

![waterfall](https://raw.githubusercontent.com/wiki/suguru03/neo-async/images/jsperf_waterfall.png)
* 図1: waterfallの実行例

数値は1秒間の実行回数の比(Neo-Async/Async)になります。

|function|Chrome|FireFox|Safari|url|
|---|---|---|---|---|
|waterfall|2.18|2.20|2.36|http://jsperf.com/async-waterfall/7|
|series|1.50|1.31|1.10|http://jsperf.com/async-series/8|
|parallel|15.67|10.17|5.01|http://jsperf.com/async-parallel/5|
|parallelLimit|1.35|1.41|1.11|http://jsperf.com/async-parallel-limit/2|

### サーバサイドの速度比較

サーバサイドのベンチマーク計測には[簡易計測ツール](https://github.com/suguru03/func-comparator)を作って調べました。
ツールの仕様は以下の通りです。

* n回試行
* 毎回順番がランダム
* 毎回gcを走らせる
* n回の平均速度[μs]を計測

__demo.js__

```js
var comparator = require('func-comparator'); // 今回作った計測ツール
var _ = require('lodash');
var async = require('async');
var neo_async = require('neo-async');

var count = 10; // parallelのtasks数
var times = 1000; // 試行回数
var array = _.shuffle(_.times(count));
var tasks = _.map(array, function(n) {
    return function(next) {
        next(null, n);
    };
});

// ここのfuncsを交互ではなく毎回ランダムで実行する
var funcs = {
    'async': function(callback) {
        async.parallel(tasks, callback);
    },
    'neo-async': function(callback) {
        neo_async.parallel(tasks, callback);
    }
};

comparator
.set(funcs)
.option({
    async: true,
    times: times
})
.start()
.result(console.log);
```

__実行__

task数10で1000回実行した平均速度を比較します。
実行環境は以下の通りです。
* node v0.10.35
* iojs v1.0.2

```bash
$ node --expose_gc demo.js // gcを使わずに実行も可能
$ iojs --expose_gc demo.js
```
__結果__

数値はn回の平均速度の比(Async/Neo-Async)になります。

|function|node|iojs|
|---|---|---|
|waterfall|3.47|12.05|
|series|1.98|6.38|
|parallel|2.94|8.94|
|paralellLimit|2.88|6.13|

node・iojsでもレスポンス改善が期待できます。

## 利便性の向上

underscoreやLo-DashではObjectをArrayのforEachのように実行することが当たり前のようにサポートされていますが、
Asyncではサポートされていません。
Neo-Asyncではほとんどのfunctionでサポートしており、これは何かと便利な機能だと思います。

```js
var object = {
    HOGE: 'hoge',
    FUGA: 'fuga',
    PIYO: 'piyo'
};

async.each(Object.keys(object), function(key, done) {
    var str = object[key];
    /* 処理 */
    done();
}, callback);

neo_async.each(object, function(str, done) {
    /* 処理 */
    done();
}, callback, thisArg);
```

## Installation

### In a browser
```html
<script src="async.min.js"></script>
```

### In an AMD loader
```js
require(['async'], function(async) {});
```

### Node.js

#### standard

```bash
$ npm install neo-async
```
```js
var async = require('neo-async');
```

#### replacement
```bash
$ npm install neo-async
$ ln -s ./node_modules/neo-async ./node_modules/async
```
```js
var async = require('async');
```

### Bower

```bash
bower install neo-async
```

## Feature *not* in Async

### Collections

* [`concatLimit`](#concatLimit)
* [`detectLimit`](#detectLimit)
* [`everySeries`](#everySeries)
* [`everyLimit`](#everyLimit)
* [`filterLimit`](#filterLimit)
* [`pick`](#pick)
* [`pickSeries`](#pickSeries)
* [`pickLimit`](#pickLimit)
* [`rejectLimit`](#rejectLimit)
* [`selectLimit`](#filterLimit)
* [`someSeries`](#someSeries)
* [`someLimit`](#someLimit)
* [`sortBySeries`](#sortBySeries)
* [`sortByLimit`](#sortByLimit)
* [`transform`](#transform)
* [`transformSeries`](#transformSeries)
* [`transformLimit`](#transformLimit)

### Control Flow

* [`timesLimit`](#timesLimit)

### Utils

* [`eventEmitter`](#eventEmitter)
