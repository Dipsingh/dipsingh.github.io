(function () {
"use strict";
const root = document.querySelector('.visual-primer[data-primer="linear"]');
if (!root) return;

root.classList.add('js');
// Hand-drawn stroke helpers: a line-by-line port of sketch.py, so strokes the
// page redraws match the static SVG fallbacks exactly (same seeds, same wobble).
const Sk=(()=>{
 const TAU=2*Math.PI;
 function mulberry32(seed){
  let a=seed>>>0;
  return ()=>{
   a=(a+0x6D2B79F5)>>>0;
   let t=a;
   t=Math.imul(t^(t>>>15),t|1);
   t=((t+Math.imul(t^(t>>>7),t|61))>>>0)^t;
   return ((t^(t>>>14))>>>0)/4294967296;
  };
 }
 function fmt(v){let s=v.toFixed(1);if(s.endsWith('.0'))s=s.slice(0,-2);return s==='-0'?'0':s;}
 function wobble(x1,y1,x2,y2,seed,amp=null,step=10){
  const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy);
  if(L<0.5)return [[x1,y1],[x2,y2]];
  const r=mulberry32(seed);
  const a=amp===null?Math.min(2.4,0.45+L*0.0055):amp;
  const n=Math.max(2,Math.ceil(L/step));
  const w1=0.35+0.5*r(),w2=1.1+1.3*r()+L/300,p1=TAU*r(),p2=TAU*r();
  const nx=-dy/L,ny=dx/L,pts=[];
  for(let i=0;i<=n;i++){
   const t=i/n,env=Math.sin(Math.PI*t);
   const o=a*env*(0.8*Math.sin(TAU*w1*t+p1)+0.3*Math.sin(TAU*w2*t+p2));
   pts.push([x1+dx*t+nx*o,y1+dy*t+ny*o]);
  }
  return pts;
 }
 const polyD=(pts,close=false)=>'M '+pts.map(([x,y])=>fmt(x)+' '+fmt(y)).join(' L ')+(close?' Z':'');
 function head(x1,y1,x2,y2,size=10,spread=.48){
  const angle=Math.atan2(y2-y1,x2-x1);
  return [[x2-size*Math.cos(angle-spread),y2-size*Math.sin(angle-spread)],
          [x2-size*Math.cos(angle+spread),y2-size*Math.sin(angle+spread)]];
 }
 const headD=(a,tip,b)=>`M ${fmt(a[0])} ${fmt(a[1])} L ${fmt(tip[0])} ${fmt(tip[1])} L ${fmt(b[0])} ${fmt(b[1])}`;
 // Same sub/superscript tspans as sketch.hand_text_markup (the fonts lack ₁, ₂, ᵢ, ᵀ).
 function markup(s,size){
  const sub={'₀':'0','₁':'1','₂':'2','₃':'3','ᵢ':'i'},sup={'²':'2','³':'3','ᵀ':'T'};
  const small=fmt(size*.68),d1=fmt(size*.24),d2=fmt(size*.42);
  return s.replace(/‖/g,'||').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))
   .replace(/([₀₁₂₃ᵢ]+)|([²³ᵀ]+)/g,(m,lo,hi)=>lo
    ?`<tspan font-size="${small}" dy="${d1}">${[...lo].map(c=>sub[c]).join('')}</tspan><tspan dy="-${d1}">​</tspan>`
    :`<tspan font-size="${small}" dy="-${d2}">${[...hi].map(c=>sup[c]).join('')}</tspan><tspan dy="${d2}">​</tspan>`);
 }
 return {TAU,mulberry32,fmt,wobble,polyD,head,headD,markup};
})();

// Show a single application of M by interpolating between v and Mv.
// At progress t the whole plane uses (1-t)I+tM, not successive powers of M.
// The grid's wobble lives in plane coordinates, so M deforms the drawing itself.
(()=>{
 const figure=document.getElementById('eigen-transformation');
 if(!figure)return;
 const grid=figure.querySelector('#tf-grid');
 const O=[Number(grid.dataset.originX),Number(grid.dataset.originY)];
 const S=Number(grid.dataset.scale);
 const CLIP=[66,104,626,394],AMP=0.03,TAU=Sk.TAU;
 const slider=document.getElementById('tf-progress');
 const output=document.getElementById('tf-progress-output');
 const play=document.getElementById('tf-play');
 const reset=document.getElementById('tf-reset');
 const announcement=document.getElementById('tf-announcement');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const map=(x,y,t)=>[O[0]+S*((1+t)*x+t*y),O[1]-S*(t*x+(1+t)*y)];
 const lines=[...grid.querySelectorAll('path[data-family]')].map(el=>{
  const family=Number(el.dataset.family),k=Number(el.dataset.k),r=Sk.mulberry32(7000+family*100+k+50);
  return {el,family,k,l1:6+3*r(),l2:2.2+1.2*r(),p1:TAU*r(),p2:TAU*r()};
 });
 function gridD(g,t){
  const [x0,y0,w,h]=CLIP,pts=[],inside=[];
  for(let i=0;i<161;i++){
   const s=-20+i*0.25;
   const o=AMP*(0.8*Math.sin(TAU*s/g.l1+g.p1)+0.3*Math.sin(TAU*s/g.l2+g.p2));
   const p=g.family===0?map(g.k+o,s,t):map(s,g.k+o,t);
   pts.push(p);
   inside.push(p[0]>=x0-30&&p[0]<=x0+w+30&&p[1]>=y0-30&&p[1]<=y0+h+30);
  }
  const runs=[];let cur=[];
  pts.forEach((p,i)=>{
   if(inside[i]||(i>0&&inside[i-1])||(i+1<pts.length&&inside[i+1]))cur.push(p);
   else if(cur.length){runs.push(cur);cur=[];}
  });
  if(cur.length)runs.push(cur);
  return runs.filter(r=>r.length>1).map(r=>Sk.polyD(r)).join(' ');
 }
 const vectors=[['x',3,1,501],['q2',1,1,502],['q1',1,-1,503]].map(([id,x,y,seed])=>{
  const r=Sk.mulberry32(seed);
  return {id,x,y,w1:.35+.5*r(),w2:1.1+1.3*r(),p1:TAU*r(),p2:TAU*r(),
   line:document.getElementById('tf-vector-'+id),head:document.getElementById('tf-head-'+id),
   label:document.getElementById('tf-label-'+id)};
 });
 function shaft(v,t){
  const len=Math.hypot(v.x,v.y),amp=Math.min(0.06,0.02+0.012*len),nx=-v.y/len,ny=v.x/len,pts=[];
  for(let i=0;i<=24;i++){
   const u=i/24,o=amp*Math.sin(Math.PI*u)*(0.8*Math.sin(TAU*v.w1*u+v.p1)+0.3*Math.sin(TAU*v.w2*u+v.p2));
   pts.push(map(u*v.x+o*nx,u*v.y+o*ny,t));
  }
  return pts;
 }
 let progress=1,frame=null,running=false;
 const format=n=>Number(n.toFixed(2)).toString().replace('-','−');
 const plain={x:'x',q1:'q₁',q2:'q₂'},final={x:'Mx',q1:'Mq₁ = q₁',q2:'Mq₂ = 3q₂'};
 function playLabel(){
  play.textContent=running?'Pause':reduced.matches?'Apply M':(progress>0&&progress<1?'Continue':'Play transformation');
 }
 function draw(t){
  progress=Math.max(0,Math.min(1,t));
  figure.dataset.progress=progress;
  for(const g of lines)g.el.setAttribute('d',gridD(g,progress));
  for(const v of vectors){
   const pts=shaft(v,progress),tip=pts[pts.length-1];
   v.line.setAttribute('d',Sk.polyD(pts));
   const [a,b]=Sk.head(O[0],O[1],tip[0],tip[1],12,.46);
   v.head.setAttribute('d',Sk.headD(a,tip,b));
   v.label.setAttribute('x',Sk.fmt(tip[0]+Number(v.label.dataset.labelDx)));
   v.label.setAttribute('y',Sk.fmt(tip[1]+Number(v.label.dataset.labelDy)));
   v.label.innerHTML=Sk.markup(progress===1?final[v.id]:plain[v.id],21);
  }
  document.getElementById('tf-position-output').textContent=`${progress===1?'Output Mx':progress===0?'Input x':'Moving arrow'}: (${format(3+4*progress)}, ${format(1+4*progress)})`;
  document.getElementById('tf-length-output').innerHTML=Sk.markup(`q₂: length × ${format(1+2*progress)}`,18);
  figure.querySelector('svg desc').textContent=`${progress===1?'After applying M':progress===0?'Before applying M':'Partway through one application of M'}. The vector originally (3, 1) is now (${format(3+4*progress)}, ${format(1+4*progress)}). The vector q1 stays at (1, −1). The vector originally (1, 1) is now (${format(1+2*progress)}, ${format(1+2*progress)}), on the same diagonal line. Ordinary coordinate axes stay fixed while the grid moves.`;
  slider.value=String(Math.round(progress*100));
  output.textContent=Math.round(progress*100)+'%';
  slider.setAttribute('aria-valuetext',progress===0?'Before applying M':progress===1?'After applying M':`${Math.round(progress*100)} percent through the transformation`);
 }
 function stop(){
  if(frame!==null)cancelAnimationFrame(frame);
  frame=null;running=false;playLabel();
 }
 function animate(){
  if(running){stop();announcement.textContent=`Paused at ${Math.round(progress*100)} percent.`;return;}
  if(reduced.matches){draw(1);playLabel();announcement.textContent='Applied M. q₁ is unchanged; q₂ is three times as long; x has turned.';return;}
  if(progress===1)draw(0);
  const start=performance.now(),from=progress,duration=4000*(1-from);
  running=true;playLabel();announcement.textContent='Showing one application of M.';
  const tick=now=>{
   if(!running)return;
   const fraction=Math.min(1,(now-start)/duration);
   draw(from+(1-from)*fraction);
   if(fraction===1){stop();announcement.textContent='Transformation complete. q₁ is unchanged; q₂ is three times as long; x has turned.';}
   else frame=requestAnimationFrame(tick);
  };
  frame=requestAnimationFrame(tick);
 }
 play.addEventListener('click',animate);
 reset.addEventListener('click',()=>{stop();draw(0);playLabel();announcement.textContent='Reset to the original grid and vectors.';});
 slider.addEventListener('input',()=>{stop();draw(Number(slider.value)/100);playLabel();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 reduced.addEventListener('change',()=>{stop();playLabel();});
 let beforePrint=1;
 window.addEventListener('beforeprint',()=>{beforePrint=progress;stop();draw(1);});
 window.addEventListener('afterprint',()=>{draw(beforePrint);playLabel();});
 draw(1);playLabel();
})();

// Turn a unit input around the circle. The page redraws the same hand-drawn
// strokes as the static SVG (same seeds, same wobble), in both responsive copies.
(()=>{
 const angleControl=document.getElementById('turn-angle');
 const lengthControl=document.getElementById('input-length');
 const diagrams=[...document.querySelectorAll('svg[data-unit-experiment]')];
 if(!angleControl||!diagrams.length)return;
 const initialDegrees=Math.atan2(1,3)*180/Math.PI,sqrt2=Math.sqrt(2);
 const round=(v,d=2)=>{const c=Math.abs(v)<.5*Math.pow(10,-d)?0:v;return c.toFixed(d).replace(/\.0+$/,'').replace(/(\.\d*?)0+$/,'$1');};
 const write=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
 const set=(el,attrs)=>{if(!el)return;for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);};
 function arrow(svg,role,start,end,head=11){
  const shaft=svg.querySelector(`[data-role="${role}"]`),hd=svg.querySelector(`[data-role="${role}-head"]`);
  const L=Math.hypot(end[0]-start[0],end[1]-start[1]);
  const pts=L>=14?Sk.wobble(start[0],start[1],end[0],end[1],Number(shaft.dataset.seed)):[start,end];
  const [bx,by]=pts.length>2?pts[pts.length-2]:start;
  const [a,b]=Sk.head(bx,by,end[0],end[1],head,.48);
  shaft.setAttribute('d',Sk.polyD(pts));
  hd.setAttribute('d',Sk.headD(a,end,b));
  return L;
 }
 const show=(svg,role,on)=>{for(const el of svg.querySelectorAll(`[data-role="${role}"],[data-role="${role}-head"]`))el.setAttribute('opacity',on?1:0);};
 function update(){
  const degrees=Number(angleControl.value),theta=degrees*Math.PI/180;
  const vx=Math.cos(theta),vy=Math.sin(theta);
  const mx=2*vx+vy,my=vx+2*vy;
  const score=vx*mx+vy*my;
  const c1=(vx-vy)/sqrt2,c2=(vx+vy)/sqrt2,share1=c1*c1,share2=c2*c2;
  const length=lengthControl?Number(lengthControl.value):1,norm=length*length;
  write('angle-output',round(degrees,1)+'°');
  write('unit-score-output',round(score,3));
  write('length-output',round(length,2));
  write('norm-output',round(norm,3));
  write('score-output',round(norm*score,3));
  write('ratio-output',round(score,3));
  write('component-shares',round(share1*100,1)+'% of squared length along u₁; '+round(share2*100,1)+'% along u₂');
  angleControl.setAttribute('aria-valuetext',round(degrees,1)+' degrees from the positive horizontal axis; unit-input score '+round(score,3));
  if(lengthControl)lengthControl.setAttribute('aria-valuetext','Copy length '+round(length,2)+'; raw score '+round(norm*score,3)+'; quotient '+round(score,3));
  for(const svg of diagrams){
   const role=n=>svg.querySelector(`[data-role="${n}"]`);
   const plot=role('output-plot'),O=[Number(plot.dataset.originX),Number(plot.dataset.originY)],S=Number(plot.dataset.scale);
   const p=(x,y)=>[O[0]+S*x,O[1]-S*y];
   const input=p(vx,vy),output=p(mx,my),projected=p(score*vx,score*vy);
   arrow(svg,'input',O,input);
   arrow(svg,'output',O,output);
   arrow(svg,'projection',O,projected);
   set(role('projection-underlay'),{d:'M '+O.join(' ')+' L '+Sk.fmt(projected[0])+' '+Sk.fmt(projected[1])});
   const rem=arrow(svg,'remainder',projected,output,9),visible=rem>.05;
   show(svg,'remainder',visible);
   const [rx,ry]=visible?[(output[0]-projected[0])/rem,(output[1]-projected[1])/rem]:[0,0];
   const qa=[projected[0]-9*vx,projected[1]+9*vy],qb=[qa[0]+9*rx,qa[1]+9*ry],qc=[projected[0]+9*rx,projected[1]+9*ry];
   set(role('right-angle'),{d:'M '+qa.map(Sk.fmt).join(' ')+' L '+qb.map(Sk.fmt).join(' ')+' L '+qc.map(Sk.fmt).join(' '),opacity:visible?1:0});
   // Labels lean toward the middle of the canvas; the output and projection labels sit on
   // opposite sides of their tips so they stay apart when the two arrows coincide.
   const leftSide=vx<0;
   set(role('input-label'),{x:Sk.fmt(input[0]+(leftSide?-10:10)),y:Sk.fmt(input[1]+21),'text-anchor':leftSide?'end':'start'});
   set(role('output-label'),{x:Sk.fmt(output[0]+(mx<0?10:-10)),y:Sk.fmt(output[1]-12),'text-anchor':mx<0?'start':'end'});
   set(role('projection-label'),{x:Sk.fmt(projected[0]+(leftSide?-9:9)),y:Sk.fmt(projected[1]+25),'text-anchor':leftSide?'end':'start'});
   const cplot=role('component-plot'),CO=[Number(cplot.dataset.originX),Number(cplot.dataset.originY)],CS=Number(cplot.dataset.scale);
   const cp=(x,y)=>[CO[0]+CS*x,CO[1]-CS*y];
   const first=cp(c1/sqrt2,-c1/sqrt2),tip=cp(vx,vy);
   arrow(svg,'component-1',CO,first);show(svg,'component-1',Math.abs(c1)>.003);
   arrow(svg,'component-2',first,tip);show(svg,'component-2',Math.abs(c2)>.003);
   arrow(svg,'component-input',CO,tip);
   const m1=[(CO[0]+first[0])/2,(CO[1]+first[1])/2],m2=[(first[0]+tip[0])/2,(first[1]+tip[1])/2];
   set(role('component-1-label'),{x:Sk.fmt(m1[0]-9),y:Sk.fmt(m1[1]+24),opacity:Math.abs(c1)>.10?1:0});
   set(role('component-2-label'),{x:Sk.fmt(m2[0]+16),y:Sk.fmt(m2[1]+24),opacity:Math.abs(c2)>.10?1:0});
   set(role('component-input-label'),{x:Sk.fmt(tip[0]+(leftSide?-10:10)),y:Sk.fmt(tip[1]+(vy<0?24:-12)),'text-anchor':leftSide?'end':'start'});
   role('coefficient-1').innerHTML=Sk.markup('c₁ = '+round(c1,3),19);
   role('coefficient-2').innerHTML=Sk.markup('c₂ = '+round(c2,3),19);
   role('share-1').textContent=round(share1*100,1)+'%';
   role('share-2').textContent=round(share2*100,1)+'%';
   role('unit-score').textContent='Unit-input score: '+round(score,3);
   const pointer=role('score-pointer');
   set(pointer,{cx:Sk.fmt(Number(pointer.dataset.left)+share2*(Number(pointer.dataset.right)-Number(pointer.dataset.left)))});
   const strip=role('score-strip');
   if(strip){
    const L=Number(strip.dataset.left),R=Number(strip.dataset.right),B=Number(strip.dataset.base),K=Number(strip.dataset.unit);
    const sx=L+(degrees+180)/360*(R-L),sy=B-K*score;
    set(role('score-dot'),{cx:Sk.fmt(sx),cy:Sk.fmt(sy)});
    set(role('score-hair'),{d:'M '+Sk.fmt(sx)+' '+Sk.fmt(B)+' L '+Sk.fmt(sx)+' '+Sk.fmt(sy)});
   }
   Object.assign(svg.dataset,{angle:String(degrees),vx:String(vx),vy:String(vy),score:String(score),c1:String(c1),c2:String(c2),share1:String(share1),share2:String(share2),copyLength:String(length),copyScore:String(norm*score)});
   const desc=svg.querySelector('desc');
   if(desc)desc.textContent='The dot on the score chart sits at '+round(degrees,1)+' degrees and height '+round(score,3)+'. The unit input v has ordinary coordinates ('+round(vx,3)+', '+round(vy,3)+'). Its output Mv is ('+round(mx,3)+', '+round(my,3)+'). The output component along v is '+round(score,3)+' times v. The perpendicular remainder starts at that component’s tip and ends at Mv. The signed eigenvector coefficients are '+round(c1,3)+' and '+round(c2,3)+'; their squared-length shares are '+round(share1*100,1)+' percent and '+round(share2*100,1)+' percent. The unit-input score is '+round(score,3)+'. The closer view shows the same unit input. The optional resized copy has length '+round(length,2)+' and raw score '+round(norm*score,3)+', with the same quotient '+round(score,3)+'; it does not alter the unit-input picture.';
  }
 }
 angleControl.addEventListener('input',update);
 if(lengthControl)lengthControl.addEventListener('input',update);
 for(const [id,degrees] of [['turn-u1',-45],['turn-running',initialDegrees],['turn-u2',45]]){
  const button=document.getElementById(id);
  if(button)button.addEventListener('click',()=>{angleControl.value=String(degrees);update();});
 }
 update();
})();

// Footnote pop-ups. Without JavaScript the bracketed numbers are plain links to
// the list at the end of the page; with it, the note pops up next to the number.
(()=>{
 const pop=document.getElementById('fn-pop');
 if(!pop)return;
 const body=pop.querySelector('.fn-body'),close=pop.querySelector('.fn-close');
 let current=null;
 function hide(restore=true){
  if(pop.hidden)return;
  pop.hidden=true;
  if(current){current.setAttribute('aria-expanded','false');if(restore)current.focus({preventScroll:true});}
  current=null;
 }
 function show(link){
  const note=document.querySelector('#fn-'+link.dataset.fn+' .fn-text');
  if(!note)return;
  if(current===link){hide();return;}
  if(current)current.setAttribute('aria-expanded','false');
  current=link;
  link.setAttribute('aria-expanded','true');
  body.innerHTML=note.innerHTML;
  pop.hidden=false;
  const r=link.getBoundingClientRect(),vw=document.documentElement.clientWidth,width=Math.min(360,vw-24);
  pop.style.width=width+'px';
  const left=Math.max(12,Math.min(r.left+r.width/2-width/2,vw-width-12));
  pop.style.left=(left+window.scrollX)+'px';
  pop.style.top=(r.bottom+window.scrollY+8)+'px';
  pop.focus({preventScroll:true});
 }
 document.addEventListener('click',e=>{
  const link=e.target.closest('a[data-fn]');
  if(link){e.preventDefault();show(link);return;}
  if(!pop.hidden&&!pop.contains(e.target))hide(false);
 });
 close.addEventListener('click',()=>hide());
 document.addEventListener('keydown',e=>{if(e.key==='Escape')hide();});
 window.addEventListener('resize',()=>hide(false));
})();


})();
