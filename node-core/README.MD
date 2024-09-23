# unihelper-core

`unihelper-core` 是一个 Node.js 原生插件，提供了一些实用的系统操作功能，如获取和设置环境变量、打开资源管理器等。
目前单适配electron项目

## 安装

要安装此项目，请运行以下命令：

```sh
npm install
```

## 构建
```sh
npm run build
```

## 使用

### 打开资源管理器
```js
const { openExplorer } = require('unihelper-core');

openExplorer('C:\\Path\\To\\Directory');
```

### 获取环境变量
```js
const { getEnvVar } = require('unihelper-core');

const path = getEnvVar('PATH');
console.log(path);
```

### 设置环境变量
```js
const { setEnvVar } = require('unihelper-core');

setEnvVar('MY_VAR', 'my_value');
```

### 获取path环境变量
```js
const { getPathEnvVar } = require('unihelper-core');

const path = getPathEnvVar();
console.log(path);
```

### 设置 PATH 环境变量
```js
const { setPathEnvVar } = require('unihelper-core');

setPathEnvVar('C:\\New\\Path', true); // 覆盖原有 PATH
```

### 执行 Shell 脚本
```js
const { execShell } = require('unihelper-core');

const result = execShell('echo Hello, World!');
console.log(result);
```

```
.gitignore
binding.gyp
build/
lib/
    index.js
package.json
README.MD
src/
    unihelper-core.cc
unihelper-core.d.ts
vite.config.js
```

# 许可证
ISC


# 作者
siriforever.ltd@gmail.com
