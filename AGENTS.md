# 连读翻译开发约定

- 本项目是 KISS Translator 的 GPLv3 修改版，基于 `a8c5a6fbe9af2379640a780fea97472e1dadeaa9`，保留 LICENSE、上游署名及构建产物中的依赖许可文件。不要引入未经确认的专有依赖。
- 第一版：Chrome、免费服务优先、简体中文双语、手动当前页面开关、滚动及动态文字继续翻译。跨页或 SPA 路由变化后关闭；普通文章锚点不算新页面。同页内容加载或 body 替换保留开启状态。
- 开发分支 `feat/manual-zh-reading`；上游 remote `upstream`，个人 fork remote `origin`。不向上游提交贡献，不发布 Chrome 商店版本。
- 当前环境 Node 24.18.1、pnpm 9.14.4（上游 .pnpm-version）。使用锁文件安装；Chrome 构建命令 `npm run build:chrome`，产物 `build/chrome/`。
- 核心回归：`CI=true npm test -- --watchAll=false --runInBand src/libs/translator.test.js src/libs/translatorManager.test.js src/apis/trans.translate.test.js`。涉及启动流程还需运行 `src/common.blacklistStartup.test.js`，涉及规则还需运行规则相关测试。
- 自动测试中使用模拟翻译响应验证 DOM、动态内容和故障行为；翻译质量、真实服务可达性及 X 实际页面另做浏览器实测，不混为同一种证据。
- 新需求、选择、规则和长期记忆写入 AGENTS.md。当前本地工作目录的上一级 AGENTS.md、试用记录.md 保存用户需求与实测记录；远程仓库说明以 README.md、FORK-NOTICE.md 为准。
- 不记录密钥、私人网页、私信或完整请求日志。记录实际版本、样本、操作、预期、结果和未验证项；每次实质推进后更新本地试用记录。
- 本轮默认只启用免账户 Google / Microsoft，不保留共享预设凭据；其他提供商仅保留可显式配置的停用预设，不自动切换或付费。
- 依赖许可记录脚本 `node scripts/collect-licenses.cjs` 生成 `legal/`，包括元数据、可取得的随包声明及未修改 webextension-polyfill 源码。清单不是完整法务审查；公众发布前核对实际打包范围与缺少声明文件的包。
- 安装和维护说明为 LOCAL-INSTALL.md / MAINTENANCE.md；公开人工夹具 `python3 test-pages/server.py` 仅绑定 127.0.0.1:8765，含控制性 429 端点，不输出翻译文字或完整请求路径。运行服务可能需要沙盒联网／端口许可。
- 2026-10-07 最终浏览器修复构建通过；全量模拟回归 202 套件／3564 项通过。用户已授权安装和网页访问；Chrome Zhang 配置的独立 ID 为 `hknlaoeokajglejfmldmgpocjplfhbod`。刷新或重载后的页面须先核对真实开启状态再验收，避免缓存译文误判故障请求。
- `src/common.js` 装配运行配置，`src/libs/translatorManager.js` 管页面会话，`src/libs/translator.js` 管扫描、译文与错误，`src/apis/` 管服务；`test-pages/` 为公开夹具。修改后把构建复制到已加载目录，再通过 Chrome 扩展管理页重载并刷新样本页。
- 行内代码包括 `.notranslate`／`translate=no` 文件名须在整句译文中原样保留；代码块与编辑框仍跳过。错误浮层可能包含查询文本，提交复现记录时只保留状态、服务名、公开样本与已脱敏原因。
