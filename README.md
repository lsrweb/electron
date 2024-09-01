由于 uniapp 离线打包每次都要打开 Android studio,很麻烦
由于公司内 uniapp 的项目太多,管理打理起来不方便,很麻烦,所以我需要本地记录 uniapp 项目的 uniappid,uniappcloud 秘钥,包名等信息
由于密钥库文件生成太过麻烦,于是我打算弄一个可视化界面脚本生成不同的测试密钥库,并且进行统一管理
由于,等我想想

<!-- https://pic.20988.xyz/2024-07-05/1720196267-239253-wallhaven-zyv3wg.png -->

0: 成功（Success）
1: 一般错误（General error）
2: 错误的用法（Misuse of shell builtins）
126: 命令不可执行（Command invoked cannot execute）
127: 命令未找到（Command not found）
128: 无效的退出参数（Invalid exit argument）
130: 脚本被用户中断（Script terminated by Control-C）
255: 退出状态超出范围（Exit status out of range）

// 以下内容都是 Github copilot 写的..

```markdown
# Vite Electron uniapp 离线打包桌面程序

这是一个基于 Electron 和 Vite 的桌面应用程序项目。

## 项目结构
```

````

### 主要文件和目录

- **src/**: 源代码目录
- **package.json**: 项目配置文件，包含依赖和脚本
- **tsconfig.json**: TypeScript 配置文件
- **vite.base.config.ts**: Vite 基础配置
- **vite.main.config.ts**: Vite 主进程配置
- **vite.only.render.ts**: Vite 渲染进程配置
- **vite.preload.config.ts**: Vite 预加载脚本配置
- **vite.renderer.config.ts**: Vite 渲染器配置

## 安装

首先，克隆项目到本地：

```sh
git clone <repository-url>
cd <repository-directory>
````

然后，安装依赖：

```sh
npm install
```

## 开发

启动开发服务器：

```sh
npm run start
```

启动渲染进程开发服务器：

```sh
npm run dev-render
```

## 构建

构建渲染进程：

```sh
npm run build-render
```

打包应用程序：

```sh
npm run package
```

## 脚本

- [`npm run start`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22d%3A%5C%5CCode___%5C%5CElectorn%5C%5Cmy-new-app%5C%5Cpackage.json%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fd%253A%2FCode___%2FElectorn%2Fmy-new-app%2Fpackage.json%22%2C%22path%22%3A%22%2Fd%3A%2FCode___%2FElectorn%2Fmy-new-app%2Fpackage.json%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A7%2C%22character%22%3A5%7D%7D%2C%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22d%3A%5C%5CCode___%5C%5CElectorn%5C%5Cmy-new-app%5C%5Cvite.base.config.ts%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fd%253A%2FCode___%2FElectorn%2Fmy-new-app%2Fvite.base.config.ts%22%2C%22path%22%3A%22%2Fd%3A%2FCode___%2FElectorn%2Fmy-new-app%2Fvite.base.config.ts%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A94%2C%22character%22%3A27%7D%7D%5D%5D "Go to definition"): 启动 Electron 应用程序
- [`npm run package`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22d%3A%5C%5CCode___%5C%5CElectorn%5C%5Cmy-new-app%5C%5C.gitignore%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fd%253A%2FCode___%2FElectorn%2Fmy-new-app%2F.gitignore%22%2C%22path%22%3A%22%2Fd%3A%2FCode___%2FElectorn%2Fmy-new-app%2F.gitignore%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A37%2C%22character%22%3A5%7D%7D%2C%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22d%3A%5C%5CCode___%5C%5CElectorn%5C%5Cmy-new-app%5C%5Cpackage.json%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fd%253A%2FCode___%2FElectorn%2Fmy-new-app%2Fpackage.json%22%2C%22path%22%3A%22%2Fd%3A%2FCode___%2FElectorn%2Fmy-new-app%2Fpackage.json%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A8%2C%22character%22%3A5%7D%7D%2C%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22d%3A%5C%5CCode___%5C%5CElectorn%5C%5Cmy-new-app%5C%5Cvite.base.config.ts%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fd%253A%2FCode___%2FElectorn%2Fmy-new-app%2Fvite.base.config.ts%22%2C%22path%22%3A%22%2Fd%3A%2FCode___%2FElectorn%2Fmy-new-app%2Fvite.base.config.ts%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A4%2C%22character%22%3A19%7D%7D%5D%5D "Go to definition"): 打包应用程序
- [`npm run make`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22d%3A%5C%5CCode___%5C%5CElectorn%5C%5Cmy-new-app%5C%5Cpackage.json%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fd%253A%2FCode___%2FElectorn%2Fmy-new-app%2Fpackage.json%22%2C%22path%22%3A%22%2Fd%3A%2FCode___%2FElectorn%2Fmy-new-app%2Fpackage.json%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A9%2C%22character%22%3A5%7D%7D%5D%5D "Go to definition"): 创建可分发的安装包
- [`npm run publish`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22d%3A%5C%5CCode___%5C%5CElectorn%5C%5Cmy-new-app%5C%5Cpackage.json%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fd%253A%2FCode___%2FElectorn%2Fmy-new-app%2Fpackage.json%22%2C%22path%22%3A%22%2Fd%3A%2FCode___%2FElectorn%2Fmy-new-app%2Fpackage.json%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A10%2C%22character%22%3A5%7D%7D%5D%5D "Go to definition"): 发布应用程序
- [`npm run lint`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22d%3A%5C%5CCode___%5C%5CElectorn%5C%5Cmy-new-app%5C%5C.gitignore%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fd%253A%2FCode___%2FElectorn%2Fmy-new-app%2F.gitignore%22%2C%22path%22%3A%22%2Fd%3A%2FCode___%2FElectorn%2Fmy-new-app%2F.gitignore%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A48%2C%22character%22%3A13%7D%7D%2C%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22d%3A%5C%5CCode___%5C%5CElectorn%5C%5Cmy-new-app%5C%5Cpackage.json%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fd%253A%2FCode___%2FElectorn%2Fmy-new-app%2Fpackage.json%22%2C%22path%22%3A%22%2Fd%3A%2FCode___%2FElectorn%2Fmy-new-app%2Fpackage.json%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A11%2C%22character%22%3A5%7D%7D%5D%5D "Go to definition"): 运行 ESLint 进行代码检查
- [`npm run dev-render`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22d%3A%5C%5CCode___%5C%5CElectorn%5C%5Cmy-new-app%5C%5Cforge.env.d.ts%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fd%253A%2FCode___%2FElectorn%2Fmy-new-app%2Fforge.env.d.ts%22%2C%22path%22%3A%22%2Fd%3A%2FCode___%2FElectorn%2Fmy-new-app%2Fforge.env.d.ts%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A9%2C%22character%22%3A31%7D%7D%2C%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22d%3A%5C%5CCode___%5C%5CElectorn%5C%5Cmy-new-app%5C%5Cpackage.json%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fd%253A%2FCode___%2FElectorn%2Fmy-new-app%2Fpackage.json%22%2C%22path%22%3A%22%2Fd%3A%2FCode___%2FElectorn%2Fmy-new-app%2Fpackage.json%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A12%2C%22character%22%3A5%7D%7D%5D%5D "Go to definition"): 启动渲染进程开发服务器
- [`npm run build-render`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22d%3A%5C%5CCode___%5C%5CElectorn%5C%5Cmy-new-app%5C%5C.gitignore%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fd%253A%2FCode___%2FElectorn%2Fmy-new-app%2F.gitignore%22%2C%22path%22%3A%22%2Fd%3A%2FCode___%2FElectorn%2Fmy-new-app%2F.gitignore%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A33%2C%22character%22%3A0%7D%7D%2C%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22d%3A%5C%5CCode___%5C%5CElectorn%5C%5Cmy-new-app%5C%5Cpackage.json%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fd%253A%2FCode___%2FElectorn%2Fmy-new-app%2Fpackage.json%22%2C%22path%22%3A%22%2Fd%3A%2FCode___%2FElectorn%2Fmy-new-app%2Fpackage.json%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A5%2C%22character%22%3A17%7D%7D%2C%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22d%3A%5C%5CCode___%5C%5CElectorn%5C%5Cmy-new-app%5C%5Cvite.base.config.ts%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fd%253A%2FCode___%2FElectorn%2Fmy-new-app%2Fvite.base.config.ts%22%2C%22path%22%3A%22%2Fd%3A%2FCode___%2FElectorn%2Fmy-new-app%2Fvite.base.config.ts%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A24%2C%22character%22%3A4%7D%7D%5D%5D "Go to definition"): 构建渲染进程
- [`npm run preview`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22d%3A%5C%5CCode___%5C%5CElectorn%5C%5Cmy-new-app%5C%5Cpackage.json%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fd%253A%2FCode___%2FElectorn%2Fmy-new-app%2Fpackage.json%22%2C%22path%22%3A%22%2Fd%3A%2FCode___%2FElectorn%2Fmy-new-app%2Fpackage.json%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A14%2C%22character%22%3A5%7D%7D%5D%5D "Go to definition"): 预览生产环境构建

## 贡献

欢迎贡献代码！请提交 Pull Request 或报告问题。

## 许可证

此项目使用 [MIT 许可证](LICENSE)。

```

根据你的项目需求，你可以进一步修改和扩展这个 `README.md` 文件。
```
