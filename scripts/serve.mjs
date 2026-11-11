import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.webp':'image/webp','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8'};
export function createPreviewServer(root=ROOT){
 return http.createServer(async(req,res)=>{
  try{
   if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
   const url=new URL(req.url,'http://127.0.0.1'),p=decodeURIComponent(url.pathname),relative=p==='/'?'index.html':p.slice(1);
   if(relative.split(/[\\/]/).some(x=>x.startsWith('.')||['node_modules','state','backups'].includes(x))||relative.includes('\\'))throw Error('blocked');
   const file=path.resolve(root,relative);if(!file.startsWith(path.resolve(root)+path.sep))throw Error('outside root');
   const real=await fs.realpath(file);if(!real.startsWith(path.resolve(root)+path.sep))throw Error('outside root');
   const type=mime[path.extname(file)];if(!type)throw Error('not public');
   const data=await fs.readFile(real);res.writeHead(200,{'Content-Type':type,'Content-Length':data.length,'X-Content-Type-Options':'nosniff','Cache-Control':'no-cache','Content-Security-Policy':"default-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; frame-ancestors 'none'"});res.end(req.method==='HEAD'?undefined:data);
  }catch{res.writeHead(404);res.end('Not found');}
 });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const server=createPreviewServer();server.on('error',e=>{console.error(e.code==='EADDRINUSE'?'4175 端口被占用，请关闭已有预览后重试':e.message);process.exitCode=1;});
 server.listen(4175,'127.0.0.1',()=>console.log('动画预览：http://127.0.0.1:4175/（仅本机）'));
}
