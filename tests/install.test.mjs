import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {installOutfitPack} from '../scripts/install-outfit-pack.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
test('an exported pack installs independently, preserves origin and refuses an existing outfit',async()=>{
 const temp=await fs.mkdtemp(path.join(os.tmpdir(),'fatfish-asset-install-'));
 try{
  const publicRoot=path.join(temp,'public');await fs.mkdir(path.join(publicRoot,'assets'),{recursive:true});await fs.writeFile(path.join(publicRoot,'assets/outfits-v1.json'),'{"outfits":[]}');
  const source=path.join(root,'outfits/cat_paw'),installed=await installOutfitPack(source,publicRoot);
  assert.equal(installed.id,'cat_paw');assert.equal(installed.name,'蓝绒猫爪套装');assert.equal(installed.inspiration,'《怪物猎人》呆猫 COS');
  for(const a of Object.values(installed.actions))await fs.access(path.join(publicRoot,a.file.slice(1)));
  await assert.rejects(installOutfitPack(source,publicRoot),/ID 已存在/);
 }finally{
  const resolved=path.resolve(temp);if(path.dirname(resolved)!==path.resolve(os.tmpdir())||!path.basename(resolved).startsWith('fatfish-asset-install-'))throw Error('Unexpected test directory');
  await fs.rm(resolved,{recursive:true,force:true,maxRetries:8,retryDelay:100});
 }
});
