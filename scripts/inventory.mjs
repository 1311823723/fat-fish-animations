import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),files=[];
async function walk(relative){
 for(const entry of await fs.readdir(path.join(root,relative),{withFileTypes:true})){
  const p=relative+'/'+entry.name;
  if(entry.isSymbolicLink())throw Error('拒绝符号链接');
  if(entry.isDirectory())await walk(p);
  else{
   if(!/^(outfits|extensions)\/[a-z0-9_-]+\/[-a-zA-Z0-9_]+\.(json|png|webp)$/.test(p))throw Error('非素材文件: '+p);
   const data=await fs.readFile(path.join(root,p));files.push({path:p,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')});
  }
 }
}
await walk('outfits');await walk('extensions');files.sort((a,b)=>a.path.localeCompare(b.path));
await fs.writeFile(path.join(root,'ASSETS.json'),JSON.stringify({algorithm:'sha256',files},null,2)+'\n');
console.log(JSON.stringify({assetFiles:files.length,megabytes:Number((files.reduce((n,f)=>n+f.bytes,0)/1048576).toFixed(1))}));
