# 连读翻译 2.1.1 本机验收

日期：2026-10-07（Asia/Shanghai）。环境：macOS，Chrome 155.0.8059.39 / Zhang 测试配置，Node 24.18.1，pnpm 9.14.4。独立扩展 ID：`hknlaoeokajglejfmldmgpocjplfhbod`。陪读蛙和沉浸式翻译在测试配置中关闭，Chrome 自带整页翻译未启用。用户已授权加载本地修改版及网页访问。

构建过程的 v3、v5、v6 是本次 2.1.1 内部快照编号；最终交付为 v6，对应提交另记于交付目录 `VERSION.json`。以下表格说明哪些行为在真实 Chrome 操作中看到，哪些只经过模拟测试。浏览器截图及 AX 观察在本次工具操作记录中，本仓库没有保存截图文件。

## 实际操作与结果

| 样本与操作 | 预期 | 观察结果／范围 |
| --- | --- | --- |
| [Chrome Hello World 英文教程](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=en)，新开页面后按 Option+Q 一次 | 启动前无译文，原文保留，简体在下方 | 通过。标题、正文和导航有双语；截图可见正文与侧栏下方译文。翻译 More 为“更多的”、Home 为“家”等短文本质量有限。 |
| 同教程滚动两屏 | 无需再启用，后面的段落可读 | 通过。这是静态长文章，不单独证明网站新增网络内容加载。 |
| 教程中 `manifest.json`、`"action"` 和 `hello.html` | 行内代码在译文中原样保留，代码块不动 | v3 和 v5 仍遗漏文件名；v6 修复后，真实中文句子包含三个原样名称，代码块保持英文 JSON／HTML。保留修复前失败测试。 |
| [X @ChromiumDev 公开主页](https://x.com/ChromiumDev)，刷新、手动启动一次、滚动两屏 | 原文保留、可见帖子下方中文 | 通过该公开样本。简介、Modern Web Guidance、CSS specificity、较后面的 DevTools 帖子有译文。用户反馈“有显示，合格”。未登录 X，页面的登录遮罩仍存在。 |
| 同 X 主页的 [Modern Web Guidance 帖子](https://x.com/ChromiumDev/status/2107519267633504361)，点击“显示更多”，不再启用 | 新展开文字继续翻译 | 通过。第三条 `Autofill styling as a progressive enhancement` 及结尾链接新增后，对应中文“自动填充样式作为渐进式增强功能”和结尾出现。没有据此宣称回复会话或 X 文章已通过。 |
| X 站内点击 Google for Developers 链接，到 [@googledevs](https://x.com/googledevs)，再浏览器返回 | 新页面与返回后关闭，需重新手动开启 | 通过该站内导航样本。URL 改为 `/googledevs` 后旧译文消失，弹窗“翻译此页”值为 0；返回 `/ChromiumDev` 后复核值仍为 0。其他 X 路由类型另验。 |
| 在 @googledevs 弹窗手动选择 Microsoft，再手动启动 | 备用免账户服务实际可用 | 通过小样本，简介有中文。`ship faster` 译成“更快的发货速度”不适合开发语境；没有给予总体质量保证。试用后选择 Google，回到 @ChromiumDev 复核 Google 选中、开关关闭。 |
| 本地 HTTP 夹具手动开启，点“新增英文帖子”“展开英文回复” | 新增及原先隐藏文字连续翻译 | v3 真实通过：新帖子 1、2 与两个回复出现对应中文，无需再启动。最终 v6 在真实 X 展开文字上也通过。 |
| 夹具编辑、移除重插、检查容器 | 新译文对应新原文，没有重复 | v3 真实通过。编辑句更新；编辑、混合、日语、回复 1／2、重插、标题、新帖子各 1 个容器，纯中文 0。容器检查不替代译文语义与布局检查。 |
| 夹具纯中文、混合中英、日语 | 中文不重复，外语译为简体 | 样本通过；日语译文可读，Google 比 Microsoft 命令行样本自然。不能保证所有混合短词、语言及网站。 |
| 夹具普通锚点、query 路由、`#/` 路由、刷新、新标签 | 锚点继续，其余新页面关闭 | 真实通过；query 变化后弹窗值 0，`#/` 后译文消失，刷新后英文原样，新标签启动前无译文。BFCache 只经模拟测试，尚未专门在真实缓存返回上验收。 |
| 夹具按 Option+Q 关闭，再新增 | 原文恢复，新文字保持原样 | v3 真实通过；关闭后新帖子仅英文。关闭不删除网页原文。 |
| Google URL 暂设本地 `/429`，开启后新增未缓存帖子 3，用 Tab 聚焦错误图标 | 原文保留、错误可查，不付费回退 | 真实通过。看到 HTTP 429 / Too Many Requests / Controlled test: quota exceeded，原文仍在。已缓存帖子 1／2仍有译文，不能当作失败端点请求成功。 |
| 恢复并保存正常 Google URL | 有可执行恢复办法 | 真实通过：帖子 3 随配置重新扫描而出现中文，错误图标消失。没有实际点击恢复后的重试按钮；该按钮行为已模拟测试。没有耗尽真实供应商额度。 |

夹具：源码 `test-pages/index.html`，AI 可运行 `python3 test-pages/server.py`，打开 `http://127.0.0.1:8765/index.html`。中文控制按钮标记为不翻译；人工服务只绑定本机，不记录查询文本。一次旧测试标签出现空白，重新打开 `index.html` 标签成功；未将空白页认定为插件故障原因已定位。

## 构建与回归记录

- 原始上游：固定 `a8c5a6fbe9af2379640a780fea97472e1dadeaa9`，冻结锁文件安装成功，原始 Chrome 构建成功。
- 最终构建：`npm run build:chrome` 退出 0，外层日志 `evidence/lian-du-build-v6.log`；复制到固定交付安装路径，在 Chrome 扩展详情点击重载，显示“已重新加载”。
- 最终全量：`CI=true npm test -- --watchAll=false --runInBand` 退出 0，**202 套件、3564 测试通过**，67.377 秒；外层日志 `evidence/lian-du-full-tests-v6.log`。这是模拟 DOM 和请求回归，不是 3564 个真实网站。
- 文件名复现：含 `.notranslate`／`translate=no` 的新增样本在修复前 1 项失败；修复后核心 4 套件／368 项通过。外层日志 `lian-du-inline-code-notranslate-before.log`、`lian-du-inline-code-notranslate-after.log`。
- 免费端点命令行小样本 Google、Microsoft 均 HTTP 200；1.672782 秒与 1.161171 秒分别是单次请求，不是整页速度。本次浏览器过程没有统一秒表或延迟分位数测量。

## 尚未验证与已知限制

X 回复会话及 X 文章受当前未登录访问条件限制；大量新帖子网络加载、全部 X 路由、真实 BFCache、复杂 iframe／闭合 Shadow DOM、更多语言和站点、固定高度菜单布局、供应商真实额度及长期稳定性仍待验证。X 登录遮罩不会因翻译扩展而消失。图片文字、视频字幕、Chrome 内置／商店受限页、编辑框、代码块为首版范围外。

实际 Chrome 权限界面显示“读取您的浏览记录”“屏蔽所有页面上的内容”，网站访问为所有网站；对应继承的导航与 DNR 权限见安装说明。无痕关闭；最初观察到文件网址开启，已关闭并复核。没有自动同步或统计服务的运行验证，源码关键词检索只发现模板注释；不把该检索当作全面网络审计。公众发布前另做权限裁剪、服务条件与实际打包依赖许可审查。
