import path from 'node:path';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {installOutfitPack} from './install-outfit-pack.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const [id,target]=process.argv.slice(2);
if(!/^[a-z][a-z0-9_-]{0,39}$/.test(id||'')||!target){console.error('用法：node scripts/install-to-game.mjs <服装ID> <小屋game目录>');process.exitCode=2;}
else try{
 const catalog=JSON.parse(await fs.readFile(path.join(root,'catalog.json'),'utf8'));
 if(!catalog.outfits.some(o=>o.id===id))throw Error('目录中没有这套服装');
 const installed=await installOutfitPack(path.join(root,'outfits',id),path.resolve(target,'public'));
 console.log('已安装 '+installed.name+'；请在目标小屋构建并按部署方式更新网页与后台。');
}catch(e){console.error(e.message);process.exitCode=1;}
