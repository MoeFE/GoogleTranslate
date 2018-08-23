<p align="center">
  <a href="https://github.com/MoeFE/GoogleTranslate">
    <img alt="Google Translate" src="https://i.loli.net/2018/07/01/5b38a1b1dcc25.png" width="600">
  </a>
</p>

<p align="center">
  <a href="https://github.com/MoeFE/GoogleTranslate/releases"><img alt="GitHub release" src="https://img.shields.io/github/release/MoeFE/GoogleTranslate.svg?style=for-the-badge"></a>
  <a href="https://travis-ci.org/MoeFE/GoogleTranslate"><img alt="Build Status" src="https://img.shields.io/travis/MoeFE/GoogleTranslate/dev.svg?style=for-the-badge"></a>
  <a href="./LICENSE"><img alt="LICENSE GPL" src="https://img.shields.io/badge/license-gpl-yellow.svg?style=for-the-badge"></a>
  <a href="https://github.com/prettier/prettier"><img alt="Code Style: Prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge"></a>
</p>

> 🌐 Google 翻译 Mac 客户端（这是 2.0 版本的分支）

## 状态：重写中

新版本使用 [`@vue/cli`](https://cli.vuejs.org) 3.x 和 [`vue-cli-plugin-electron-builder`](https://github.com/nklayman/vue-cli-plugin-electron-builder) 构建，将修复[所有已知问题](https://github.com/MoeFE/GoogleTranslate/issues)。

## 预览

<img alt="预览动态图" src="https://i.loli.net/2018/07/17/5b4dfbda30200.gif" width="420">
<img alt="更改语言" src="https://i.loli.net/2018/07/17/5b4dfc253a5d7.png" width="420">
<img alt="应用程序设置" src="https://i.loli.net/2018/07/17/5b4dfc25357a1.png" width="420">

## 功能

- [x] 基本翻译
- [x] 语音朗读
- [x] 顶端显示
- [x] 开机启动
- [x] ~~自动更新~~
- [x] 全局快捷键呼出
- [x] 内置多种翻译引擎

## 下载

您可以在[这里](https://github.com/MoeFE/GoogleTranslate/releases/latest)手动下载最新版本

## FAQ

Q：Electron 不是跨平台的吗？为什么只有 Mac 版本？  
A：因为 UI 的交互设计不适用于其他操作系统

Q：为什么不能自动更新？  
A：因为我没有加入 [Apple Developer Program](https://developer.apple.com/programs/)（需要缴纳年费），无法进行[代码签名](https://electronjs.org/docs/tutorial/code-signing)，所以无法使用自动更新功能

Q：所有翻译引擎都提示当前翻译接口不可用？  
A：在新版本中，无论你使用哪种翻译引擎，都会先调用国内谷歌翻译的检测语言接口。出现这种情况一般是你的代理节点出现流量异常，导致请求被谷歌拦截，需要输入验证码（你还可以使用 <kbd>option</kbd> + <kbd>command</kbd> + <kbd>I</kbd> 打开调试工具查看请求结果是否正确）所以如果出现这个问题，请更换你的代理节点或不使用代理直接使用国内谷歌引擎。

## 参与贡献

1.  Fork it!
2.  将自己添加为贡献者：`npm run contributors`
3.  创建功能分支：`git checkout -b my-new-feature`
4.  提交你的更改：`git commit -am 'Add some feature'`
5.  推送这个分支：`git push origin my-new-feature`
6.  提交一个拉取请求 :D

## 贡献者

感谢这些美好的人 ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/20062482?v=4" width="100px;"/><br /><sub><b>さくら</b></sub>](https://qwq.cat)<br />[💻](https://github.com/MoeFE/GoogleTranslate/commits?author=u3u "Code") [📖](https://github.com/MoeFE/GoogleTranslate/commits?author=u3u "Documentation") [🎨](#design-u3u "Design") [🤔](#ideas-u3u "Ideas, Planning, & Feedback") | [<img src="https://avatars1.githubusercontent.com/u/9591690?v=4" width="100px;"/><br /><sub><b>Batur</b></sub>](https://github.com/Batur24)<br />[💬](#question-Batur24 "Answering Questions") [🐛](https://github.com/MoeFE/GoogleTranslate/issues?q=author%3ABatur24 "Bug reports") [🤔](#ideas-Batur24 "Ideas, Planning, & Feedback") [⚠️](https://github.com/MoeFE/GoogleTranslate/commits?author=Batur24 "Tests") |
| :---: | :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

该项目遵循 [all-contributors](https://github.com/kentcdodds/all-contributors) 规范，欢迎任何形式的贡献！

## 协议

[GNU General Public License v3.0](./LICENSE)  
本项目仅供学习交流和私人使用，禁止商业用途

> [qwq.cat](https://qwq.cat) · GitHub [@u3u](https://github.com/u3u) · Twitter [@hanser0v0](https://twitter.com/hanser0v0)
