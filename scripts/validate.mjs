import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {ACTIONS,checkOutfitPack} from './check-outfit-pack.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export async function validateRepository(){
 const catalog=JSON.parse(await fs.readFile(path.join(root,'catalog.json'),'utf8')),ids=new Set();let count=0;
 for(const item of catalog.outfits){
  if(ids.has(item.id)||!/^[-a-z0-9_]+$/.test(item.id)||item.manifest!==`outfits/${item.id}/outfit.json`)throw Error('目录无效或重复ID');ids.add(item.id);
  const dir=path.join(root,'outfits',item.id),checked=await checkOutfitPack(dir);
  if(!checked.ok)throw Error(item.id+': '+checked.errors.join(', '));
  const m=checked.manifest;if(m.id!==item.id||m.name!==item.name||item.actions!==ACTIONS.length)throw Error('目录与清单不一致');
  if(item.preview!==`outfits/${item.id}/${m.preview}`)throw Error('预览路径不一致');
  count+=Object.keys(m.actions).length;
 }
 for(const item of catalog.extensions){
  if(item.manifest!==`extensions/${item.id}/animations.json`)throw Error('扩展路径无效');
  const dir=path.join(root,'extensions',item.id),m=JSON.parse(await fs.readFile(path.join(root,item.manifest),'utf8'));
  if(m.id!==item.id||Object.keys(m.actions).length!==item.actions)throw Error('扩展数量不一致');
  for(const a of Object.values(m.actions)){
   if(!/^[-a-z0-9_]+\.webp$/.test(a.file)||!Number.isInteger(a.frames)||a.frames<1||!Number.isFinite(a.fps)||a.fps<1)throw Error('扩展参数无效');
   const image=await sharp(path.join(dir,a.file)).metadata();
   if(!image.hasAlpha||image.width<Math.min(8,a.frames)*256||image.height<Math.ceil(a.frames/8)*256)throw Error('扩展图集无效');
  }count+=Object.keys(m.actions).length;
 }
 const inventory=JSON.parse(await fs.readFile(path.join(root,'ASSETS.json'),'utf8'));
 for(const item of inventory.files){
  if(!/^(outfits|extensions)\/[a-z0-9_-]+\/[-a-zA-Z0-9_]+\.(json|png|webp)$/.test(item.path))throw Error('文件清单越界');
  const data=await fs.readFile(path.join(root,item.path));if(data.length!==item.bytes||crypto.createHash('sha256').update(data).digest('hex')!==item.sha256)throw Error('文件校验失败: '+item.path);
 }
 return {outfits:catalog.outfits.length,actions:count,assetFiles:inventory.files.length};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))try{console.log(JSON.stringify({ok:true,...await validateRepository()}));}catch(e){console.error(e.message);process.exitCode=1;}
