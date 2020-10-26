Приложение Express построено на middleware'ах. Это позволяет добавлять и удалять функционал из приложения.
Например, если мы хотим добавить парсер cookie в приложение, то его достаточно установить командой
```
npm install --save cookie-parser
```

Подключить в файле _app.js_
```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
...
```
И подключить middleware
```javascript
...
app.use(cookieParser());
...
```

Если нужно разработать свой middleware, то в корне проекта нужно создать папку _middlewares/_
и в ней создавать свои .js файлы.

Если нужно расширить API, то заходим в файл _./api.js_

Добавить GET
```javascript
router.get('/url', require('./controllers/url_controller').get);
```
Добавить POST
```javascript
router.post('/url', require('./controllers/url_controller').post);
```

Далее нужно создать в папке _controllers/_ свой файл url_controller и реализовать там два метода: get и post.

Для того чтобы изменить алгоритм сравнения дубликатов, для этого нужно создать папку _utils/_.
В этой папке создать свой .js файл, в котором **обязательно** нужно реализовать методы _hash_ и _compare_.
Далее просто нужно зайти в файл _controllers/articles.js_ и заменить строчку кода
```javascript
const btc = require('bloom-text-compare');
```
на 
```javascript
const myAlgo = require('../utils/my-algo.js');
```

и заменить везде в файле **btc** на своё название (myAlgo)