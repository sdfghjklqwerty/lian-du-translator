// Capture installed dependency declarations and available notices for this build.
// This inventory is evidence, not a conclusion that every transitive license is cleared.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'legal');
fs.mkdirSync(path.join(out, 'dependencies'), { recursive: true });
const direct = new Set(Object.keys(require(path.join(root, 'package.json')).dependencies || {}));
const packages = new Map();
function collectPackage(dir) {
  const metadata = path.join(dir, 'package.json');
  if (!fs.existsSync(metadata)) return;
  const p = JSON.parse(fs.readFileSync(metadata, 'utf8'));
  if (!p.name || !p.version) return;
  const id = `${p.name}@${p.version}`;
  if (packages.has(id)) return;
  const dest = path.join(out, 'dependencies', id.replace(/[^a-z0-9@._-]/gi, '_'));
  const notices = fs.readdirSync(dir).filter(f => /^(license|licence|copying|notice)([._-]|$)/i.test(f) && fs.statSync(path.join(dir, f)).isFile());
  if (notices.length) {
    fs.mkdirSync(dest, { recursive: true });
    notices.forEach(f => fs.copyFileSync(path.join(dir, f), path.join(dest, f)));
  }
  packages.set(id, { name:p.name, version:p.version, license:p.license || p.licenses || 'UNKNOWN', direct:direct.has(p.name), repository:p.repository || null, notices:notices.map(f => path.relative(root, path.join(dest, f))) });
}
const store = path.join(root, 'node_modules', '.pnpm');
for (const entry of fs.readdirSync(store)) {
  const modules = path.join(store, entry, 'node_modules');
  if (!fs.existsSync(modules) || !fs.statSync(modules).isDirectory()) continue;
  for (const item of fs.readdirSync(modules)) {
    const itemPath = path.join(modules, item);
    if (!fs.lstatSync(itemPath).isDirectory()) continue;
    if (item.startsWith('@')) {
      for (const child of fs.readdirSync(itemPath)) {
        const childPath=path.join(itemPath,child);
        if (fs.lstatSync(childPath).isDirectory()) collectPackage(childPath);
      }
    } else collectPackage(itemPath);
  }
}
const entries = [...packages.values()].sort((a,b)=>`${a.name}@${a.version}`.localeCompare(`${b.name}@${b.version}`));
fs.writeFileSync(path.join(out, 'dependency-inventory.json'), JSON.stringify({date:'2026-10-07', node:process.version, note:'Includes build and runtime packages; not a bundle reachability analysis.', packages:entries}, null, 2)+'\n');
const rows=entries.map(p=>`| ${p.name}@${p.version} | ${typeof p.license==='string'?p.license:JSON.stringify(p.license)} | ${p.direct?'直接运行依赖':'传递／构建依赖'} | ${p.notices.length?'已复制':'无随包声明文件'} |`);
fs.writeFileSync(path.join(out, 'THIRD-PARTY-NOTICES.md'), '# 已安装依赖许可清单\n\n核验日期 2026-10-07。此清单包括构建依赖，不代表所有项目都会打包进 Chrome；license 字段和随包文本是证据，不能替代逐项法务结论。保留现有打包产物中的 `LICENSE.txt`。\n\nDOMPurify 按其 Apache-2.0 选项保留随包许可；webextension-polyfill 为 MPL-2.0，配套未修改源码保存于 `legal/source/`。公众发布前还需审查缺失声明和实际打包范围。\n\n| 依赖版本 | 元数据声明 | 范围 | 文本 |\n| --- | --- | --- | --- |\n'+rows.join('\n')+'\n');
fs.mkdirSync(path.join(out, 'source'), { recursive: true });
fs.copyFileSync(path.join(root,'node_modules/webextension-polyfill/dist/browser-polyfill.js'), path.join(out,'source/webextension-polyfill-0.10.0.js'));
console.log(JSON.stringify({packages:entries.length, direct:entries.filter(p=>p.direct).length, unknown:entries.filter(p=>p.license==='UNKNOWN').map(p=>`${p.name}@${p.version}`), output:'legal/'}));
