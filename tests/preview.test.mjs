import test from 'node:test';
import assert from 'node:assert/strict';
import {createPreviewServer} from '../scripts/serve.mjs';
import {validateRepository} from '../scripts/validate.mjs';
test('every current pack and extension is readable and matches its content hashes',async()=>{const result=await validateRepository();assert.equal(result.outfits,5);assert.equal(result.actions,85);});
test('local preview serves assets, blocks private paths and refuses mutations',async()=>{
 const server=createPreviewServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
 try{
  assert.equal((await fetch(base+'/')).status,200);
  assert.equal((await fetch(base+'/catalog.json')).status,200);
  for(const file of ['/.git/config','/node_modules/sharp/package.json','/scripts/serve.mjs','/%2e%2e%5cpackage.json'])assert.equal((await fetch(base+file)).status,404,file);
  assert.equal((await fetch(base+'/catalog.json',{method:'POST'})).status,405);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
