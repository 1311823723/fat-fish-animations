const $=id=>document.getElementById(id),canvas=$('stage'),ctx=canvas.getContext('2d');
const labels={idle:'站立',walk_left:'向左走',walk_right:'向右走',sleep:'睡觉',wake:'醒来',tea:'喝饮料',eat_taiyaki:'吃鲷鱼烧',expr_smile:'开心',expr_sad:'难过',expr_angry:'生气',expr_sleepy:'困倦',read:'翻翻书',sing:'哼首歌',eat_rice:'吃白米饭',headpat:'被摸头',spin:'开心转圈'};
let packs=[],manifest,directory='',image,animation,elapsed=0,last=0,paused=false,request=0;
async function read(url){const r=await fetch(url);if(!r.ok)throw Error('无法读取 '+url);return r.json();}
function reset(){elapsed=0;last=0;paused=false;$('pause').textContent='暂停';}
async function selectAction(){
 const version=++request;reset();image=null;animation=manifest.actions[$('action').value];$('loop').checked=!animation.once;$('status').textContent='正在加载动作…';$('info').textContent='';
 const next=new Image();next.src=new URL(animation.file,new URL(directory,location.href)).href;
 try{await next.decode();if(version!==request)return;image=next;$('info').textContent=`${animation.frames} 帧 · ${animation.fps} fps · ${animation.once?'单次动作':'循环动作'} · ${animation.grid?'矩形网格':'256×256 标准帧'}`;}
 catch{if(version===request)$('status').textContent='图片加载失败，请检查文件或重试。';}
}
async function selectPack(){
 const version=++request,item=packs.find(p=>p.id===$('pack').value);image=null;$('status').textContent='正在读取动作…';
 try{const m=await read(item.manifest);if(version!==request)return;manifest=m;directory=item.manifest.slice(0,item.manifest.lastIndexOf('/')+1);$('action').replaceChildren(...Object.keys(m.actions).map(id=>new Option(labels[id]||id,id)));document.querySelectorAll('[data-pack]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pack===item.id)));await selectAction();}
 catch(e){if(version===request)$('status').textContent=e.message;}
}
function draw(time){
 if(!last)last=time;if(!paused)elapsed+=Math.min(time-last,100)*Number($('speed').value);last=time;ctx.clearRect(0,0,canvas.width,canvas.height);
 if(image&&animation){
  const raw=Math.floor(elapsed*animation.fps/1000),frame=$('loop').checked?raw%animation.frames:Math.min(raw,animation.frames-1),g=animation.grid||{columns:Math.min(8,animation.frames),columnStep:256,offsetY:0,rowStep:256,width:256,height:256};
  const x=Math.floor(frame%g.columns*g.columnStep),y=g.offsetY+Math.floor(frame/g.columns)*g.rowStep,s=Math.min(520/g.width,550/g.height);
  ctx.drawImage(image,x,y,g.width,g.height,(canvas.width-g.width*s)/2,(canvas.height-g.height*s)/2,g.width*s,g.height*s);$('status').textContent=`${labels[$('action').value]||$('action').value} · 第 ${frame+1} / ${animation.frames} 帧`;
 }requestAnimationFrame(draw);
}
$('pack').addEventListener('change',selectPack);$('action').addEventListener('change',selectAction);
$('pause').onclick=()=>{paused=!paused;$('pause').textContent=paused?'继续':'暂停';};$('replay').onclick=reset;
$('step').onclick=()=>{if(!animation)return;paused=true;$('pause').textContent='继续';const raw=Math.floor(elapsed*animation.fps/1000),current=$('loop').checked?raw%animation.frames:Math.min(raw,animation.frames-1);elapsed=((current+1)%animation.frames)*1000/animation.fps+.001;};
document.addEventListener('visibilitychange',()=>{last=0;});
try{
 const catalog=await read('catalog.json');packs=[...catalog.outfits,...catalog.extensions];$('pack').replaceChildren(...packs.map(p=>new Option(p.name,p.id)));
 for(const p of catalog.outfits){const b=document.createElement('button'),img=document.createElement('img');b.dataset.pack=p.id;b.title=p.name;b.setAttribute('aria-label',p.name);b.setAttribute('aria-pressed','false');img.src=p.preview;img.alt='';img.loading='lazy';b.append(img);b.onclick=()=>{$('pack').value=p.id;selectPack();};$('outfits').append(b);}
 await selectPack();requestAnimationFrame(draw);
}catch(e){$('status').textContent=e.message;}
