(function () {
"use strict";
const root = document.querySelector('.visual-primer[data-primer="spectral"]');
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
  const sub={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9','ᵢ':'i','ⱼ':'j','ₙ':'n'},sup={'²':'2','³':'3','ᵀ':'T'};
  const small=fmt(size*.68),d1=fmt(size*.24),d2=fmt(size*.42);
  return s.replace(/‖/g,'||').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))
   .replace(/([₀₁₂₃ᵢ]+)|([²³ᵀ]+)/g,(m,lo,hi)=>lo
    ?`<tspan font-size="${small}" dy="${d1}">${[...lo].map(c=>sub[c]).join('')}</tspan><tspan dy="-${d1}">​</tspan>`
    :`<tspan font-size="${small}" dy="-${d2}">${[...hi].map(c=>sup[c]).join('')}</tspan><tspan dy="${d2}">​</tspan>`);
 }
 return {TAU,mulberry32,fmt,wobble,polyD,head,headD,markup};
})();

/* Slider and threshold sweep for figures 06 and 08; adapted from the original primer's interactions.js. */
(function(){
 'use strict';
 root.classList.add('js');
 const graphData=document.getElementById('graph-data');
 if (!graphData) return;
 const data=JSON.parse(graphData.textContent);
 const edges=data.weak.edges, best=(Math.sqrt(5)-1)/2;
 const colors={blue:'#245e9b',orange:'#b65b27',teal:'#177d75',ink:'#1f1f1f',muted:'#5c6670',rule:'#b7c0c7'};  // same values as the pen (sketch.py PAL)
 const write=(id,t)=>{const el=document.getElementById(id);if(el)el.textContent=t;};
 const fmt=(x,n=3)=>(Math.abs(x)<.5*10**(-n)?0:x).toFixed(n).replace('-','−');
 const soft=document.getElementById('soft-t');
 function updateSoft(){
  const t=Number(soft.value),raw=[1,1,t,t,-t,-t,-1,-1],norm=Math.sqrt(raw.reduce((a,x)=>a+x*x,0)),v=raw.map(x=>x/norm);
  const energy=edges.reduce((a,[i,j])=>a+(v[i]-v[j])**2,0),mean=v.reduce((a,x)=>a+x,0)/8,norm2=v.reduce((a,x)=>a+x*x,0);
  const contributions={within:2*(1-t)**2/(1+t*t),between:2*t*t/(1+t*t),total:energy};
  write('t-output',fmt(t));write('soft-energy',fmt(energy));write('soft-mean',fmt(mean));write('soft-norm',fmt(norm2));
  soft.setAttribute('aria-valuetext','Boundary value ratio '+fmt(t)+'; energy within groups '+fmt(contributions.within)+', between groups '+fmt(contributions.between)+', total '+fmt(energy)+'; all patterns have mean zero and length one');
  document.querySelectorAll('svg[data-soft]').forEach(svg=>{
   svg.dataset.values=JSON.stringify(v);svg.dataset.energy=energy;svg.dataset.mean=mean;svg.dataset.norm=norm2;svg.dataset.t=t;
   svg.dataset.withinEnergy=contributions.within;svg.dataset.betweenEnergy=contributions.between;
   v.forEach((x,i)=>{
    const c=Math.abs(x)<1e-10?colors.muted:x>0?colors.blue:colors.orange;
    const n=svg.querySelector('[data-node="'+i+'"]');n.setAttribute('fill',Math.abs(x)<1e-10?'white':x>0?'#eaf1f8':'#f9eee6');n.setAttribute('stroke',c);
    svg.querySelector('[data-node-label="'+i+'"]').setAttribute('fill',c);
    const label=svg.querySelector('[data-value="'+i+'"]');label.textContent=(x>0?'+':'')+fmt(x);label.setAttribute('fill',c);
   });
   svg.querySelectorAll('[data-edge]').forEach(e=>{const [i,j]=e.dataset.edge.split('-').map(Number),gap=Math.abs(v[i]-v[j]),between=(i<4)!==(j<4);e.setAttribute('stroke',gap>1e-9?(between?colors.orange:colors.teal):colors.rule);e.setAttribute('stroke-width',1.5+4*gap);});
   const marker=svg.querySelector('[data-tradeoff-current]'),currentX=Number(marker.dataset.left)+t*Number(marker.dataset.width);
   marker.setAttribute('x1',currentX);marker.setAttribute('x2',currentX);
   Object.entries(contributions).forEach(([kind,value])=>{
    const dot=svg.querySelector('[data-energy-dot="'+kind+'"]');dot.setAttribute('cx',currentX);dot.setAttribute('cy',Number(marker.dataset.baseline)-Number(marker.dataset.energyScale)*value);
    svg.querySelector('[data-energy-value="'+kind+'"]').textContent=fmt(value);
   });
   svg.querySelector('desc').textContent='The graph wiring is fixed. Unit-length node values are '+v.map(x=>fmt(x)).join(', ')+'. Their mean is zero and squared length is one. At boundary ratio '+fmt(t)+', energy within the groups is '+fmt(contributions.within)+', energy between the groups is '+fmt(contributions.between)+', and total energy is '+fmt(energy)+'. Teal edges and the dashed teal curve show within-group disagreement. Orange edges and the dotted orange curve show between-group disagreement. The solid dark curve adds both. The vertical marker and the three dots show the current setting.';
  });
 }
 if (soft) soft.addEventListener('input',updateSoft);
 [['soft-hard',1],['soft-half',.5],['soft-zero',0],['soft-best',best]].forEach(([id,t])=>document.getElementById(id)?.addEventListener('click',()=>{soft.value=t;updateSoft();}));
 const cut=document.getElementById('cut-position'),f=data.weak.fiedler;
 function updateCut(){
  const p=Number(cut.value),threshold=[(-f[0]-f[2])/2,0,(f[0]+f[2])/2][p];
  const chosen=new Set(f.map((v,i)=>v<threshold?i:-1).filter(i=>i>=0));
  const boundary=edges.filter(([i,j])=>chosen.has(i)!==chosen.has(j)).length,smaller=Math.min(chosen.size,8-chosen.size),score=boundary/smaller;
  write('cut-position-output',['First gap','Second gap','Third gap'][p]);write('cut-boundary',boundary);write('cut-smaller',smaller);write('cut-score',fmt(score));
  write('cut-members','Selected nodes: '+[...chosen].map(i=>i+1).join(', ')+'.');
  cut.setAttribute('aria-valuetext',['First','Second','Third'][p]+' gap; '+boundary+' crossing edges; smaller side '+smaller+' nodes; cut score '+fmt(score));
  document.querySelectorAll('svg[data-sweep]').forEach(svg=>{
   svg.dataset.selected=JSON.stringify([...chosen]);svg.dataset.boundary=boundary;svg.dataset.smaller=smaller;svg.dataset.score=score;svg.dataset.threshold=threshold;
   svg.querySelectorAll('[data-edge]').forEach(e=>{const [i,j]=e.dataset.edge.split('-').map(Number),cross=chosen.has(i)!==chosen.has(j);e.setAttribute('stroke',cross?colors.orange:colors.rule);e.setAttribute('stroke-width',cross?4:2.3);});
   ['node','order-node'].forEach(attr=>svg.querySelectorAll('[data-'+attr+']').forEach(n=>{const on=chosen.has(Number(n.getAttribute('data-'+attr)));n.setAttribute('fill',on?'#eaf1f8':'white');n.setAttribute('stroke',on?colors.blue:colors.muted);}));
   svg.querySelectorAll('[data-node-label]').forEach(n=>n.setAttribute('fill',chosen.has(Number(n.dataset.nodeLabel))?colors.blue:colors.muted));
   const line=svg.querySelector('[data-threshold]'),x=Number(line.dataset.origin)+Number(line.dataset.scale)*threshold;line.setAttribute('x1',x);line.setAttribute('x2',x);
   svg.querySelector('desc').textContent='Fiedler threshold '+fmt(threshold)+' selects nodes '+[...chosen].map(i=>i+1).join(', ')+'. There are '+boundary+' crossing edges. The smaller side has '+smaller+' nodes, so edge expansion for this cut is '+fmt(score)+'. Equal values stay together.';
  });
 }
 if (cut) cut.addEventListener('input',updateCut);
 [['cut-first',0],['cut-second',1],['cut-third',2]].forEach(([id,p])=>document.getElementById(id)?.addEventListener('click',()=>{cut.value=p;updateCut();}));
 if (soft) updateSoft(); if (cut) updateCut();
})();

/* Independent, offline interaction for the temporary three-node path. */
(function () {
 'use strict';
 const control = document.getElementById('path-angle');
 if (!control) return;
 root.classList.add('js');
 const v2 = [1 / Math.sqrt(2), 0, -1 / Math.sqrt(2)];
 const v3 = [1 / Math.sqrt(6), -2 / Math.sqrt(6), 1 / Math.sqrt(6)];
 const colors = { blue: '#245e9b', orange: '#b65b27', muted: '#5c6670', rule: '#b7c0c7' };  // same values as the pen
 const clean = n => Math.abs(n) < 1e-12 ? 0 : n;
 const fmt = (n, signed = false) => ((signed && clean(n) > 0 ? '+' : '') + clean(n).toFixed(3)).replace('-', '−');
 const write = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
 function update() {
  const degrees = Number(control.value), angle = degrees * Math.PI / 180;
  const a = clean(Math.cos(angle)), b = clean(Math.sin(angle));
  const values = v2.map((value, i) => a * value + b * v3[i]);
  const energy = a * a + 3 * b * b;
  write('path-angle-output', degrees + '°');
  write('path-share-low', (100 * a * a).toFixed(1) + '%');
  write('path-share-high', (100 * b * b).toFixed(1) + '%');
  write('path-energy', fmt(energy));
  control.setAttribute('aria-valuetext', degrees + ' degrees; energy ' + fmt(energy) + '; mean zero and length one');
  document.querySelectorAll('svg[data-path-search]').forEach(svg => {
   svg.dataset.values = JSON.stringify(values);
   svg.dataset.coefficients = JSON.stringify([a, b]);
   svg.dataset.energy = energy;
   svg.dataset.angle = degrees;
   const radius = svg.querySelector('[data-path-radius]');
   const ox = Number(radius.dataset.originX), oy = Number(radius.dataset.originY), scale = Number(radius.dataset.radius);
   const px = ox + scale * a, py = oy - scale * b;
   radius.setAttribute('x2', px); radius.setAttribute('y2', py);
   const tip = svg.querySelector('[data-path-tip]');
   tip.setAttribute('cx', px); tip.setAttribute('cy', py);
   const horizontal = svg.querySelector('[data-path-guide="horizontal"]');
   horizontal.setAttribute('x1', ox); horizontal.setAttribute('x2', px);
   horizontal.setAttribute('y1', py); horizontal.setAttribute('y2', py);
   const vertical = svg.querySelector('[data-path-guide="vertical"]');
   vertical.setAttribute('x1', px); vertical.setAttribute('x2', px);
   vertical.setAttribute('y1', oy); vertical.setAttribute('y2', py);
   svg.querySelector('[data-path-component="a"]').setAttribute('x2', px);
   const componentB = svg.querySelector('[data-path-component="b"]');
   componentB.setAttribute('x1', px); componentB.setAttribute('x2', px); componentB.setAttribute('y2', py);
   svg.querySelector('[data-path-coordinates]').textContent = '(a, b) = (' + fmt(a, true) + ', ' + fmt(b, true) + ')';
   values.forEach((value, i) => {
    const color = Math.abs(value) < 1e-10 ? colors.muted : value > 0 ? colors.blue : colors.orange;
    const node = svg.querySelector('[data-path-node="' + i + '"]');
    node.setAttribute('stroke', color);
    node.setAttribute('fill', Math.abs(value) < 1e-10 ? 'white' : value > 0 ? '#eaf1f8' : '#f9eee6');
    svg.querySelector('[data-path-node-label="' + i + '"]').setAttribute('fill', color);
    const label = svg.querySelector('[data-path-value="' + i + '"]');
    label.textContent = fmt(value, true); label.setAttribute('fill', color);
    const point = svg.querySelector('[data-path-point="' + i + '"]');
    point.setAttribute('cy', Number(point.dataset.baseline) - Number(point.dataset.scale) * value);
    point.setAttribute('fill', color); point.setAttribute('stroke', color);
   });
   svg.querySelectorAll('[data-path-edge]').forEach(edge => {
    const [i, j] = edge.dataset.pathEdge.split('-').map(Number), gap = Math.abs(values[i] - values[j]);
    edge.setAttribute('stroke', gap > 1e-10 ? colors.orange : colors.rule);
    edge.setAttribute('stroke-width', 1.5 + 2.5 * gap);
   });
   svg.querySelector('desc').textContent = 'A different graph: the three-node path. The eigenvector coordinate point is a equals ' + fmt(a) + ', b equals ' + fmt(b) + '. Its node assignment is ' + values.map(value => fmt(value)).join(', ') + '. The assignment has mean zero and length one. Energy is ' + fmt(energy) + '. Moving the point changes the node values, while the wiring and input length stay fixed.';
  });
 }
 control.addEventListener('input', update);
 [['path-low', 0], ['path-mix', 45], ['path-high', 90]].forEach(([id, angle]) => {
  document.getElementById(id)?.addEventListener('click', () => { control.value = angle; update(); });
 });
 update();
})();

/* Figure 39: subtract the same amount from every node of (3, 2, 1) and watch the point drop onto the mean-zero plane. */
(function () {
 'use strict';
 const control = document.getElementById('level-c');
 if (!control) return;
 root.classList.add('js');
 const start = [3, 2, 1];
 const colors = { blue: '#245e9b', orange: '#b65b27', muted: '#5c6670' };  // same values as the pen
 const colorOf = v => Math.abs(v) < 1e-9 ? colors.muted : v > 0 ? colors.blue : colors.orange;
 const fillOf = v => Math.abs(v) < 1e-9 ? 'white' : v > 0 ? '#eaf1f8' : '#f9eee6';
 const fmt = v => (Math.abs(v) < 1e-9 ? '0' : Number.isInteger(v) ? String(v) : v.toFixed(1)).replace('-', '−');
 const write = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
 function update() {
  const c = Number(control.value), values = start.map(v => v - c);
  const mean = values.reduce((a, b) => a + b, 0) / 3;
  const variation = values.reduce((a, v) => a + (v - mean) ** 2, 0);
  const gaps = [values[0] - values[1], values[1] - values[2]];
  write('level-c-output', fmt(c));
  write('level-values', '(' + values.map(fmt).join(', ') + ')');
  write('level-mean', fmt(mean));
  write('level-gaps', fmt(gaps[0]) + ' and ' + fmt(gaps[1]));
  write('level-var', fmt(variation));
  control.setAttribute('aria-valuetext', 'subtract ' + fmt(c) + ' from every node; values ' + values.map(fmt).join(', ') + '; mean ' + fmt(mean) + '; edge differences ' + gaps.map(fmt).join(' and ') + '; variation ' + fmt(variation));
  document.querySelectorAll('svg[data-level]').forEach(svg => {
   svg.dataset.values = JSON.stringify(values);
   svg.dataset.c = c; svg.dataset.mean = mean; svg.dataset.variation = variation;
   const yOf = (el, v) => Number(el.dataset.base) - Number(el.dataset.scale) * v;
   const beads = values.map((v, i) => svg.querySelector('[data-level-bead="' + i + '"]'));
   values.forEach((v, i) => {
    const bead = beads[i], cy = yOf(bead, v);
    bead.setAttribute('cy', cy); bead.setAttribute('fill', fillOf(v)); bead.setAttribute('stroke', colorOf(v));
    const id = svg.querySelector('[data-level-id="' + i + '"]');
    id.setAttribute('y', cy + 5); id.setAttribute('fill', colorOf(v));
    const label = svg.querySelector('[data-level-value="' + i + '"]');
    label.setAttribute('y', cy - 15); label.textContent = fmt(v); label.setAttribute('fill', colorOf(v));
   });
   svg.querySelectorAll('[data-level-edge]').forEach(edge => {
    const [i, j] = edge.dataset.levelEdge.split('-').map(Number);
    edge.setAttribute('y1', yOf(beads[i], values[i])); edge.setAttribute('y2', yOf(beads[j], values[j]));
    const gap = svg.querySelector('[data-level-gap="' + i + '-' + j + '"]');
    if (gap) gap.setAttribute('y', (yOf(beads[i], values[i]) + yOf(beads[j], values[j])) / 2 + 26);
   });
   const meanLine = svg.querySelector('[data-level-mean]'), my = yOf(meanLine, mean);
   meanLine.setAttribute('y1', my); meanLine.setAttribute('y2', my);
   const meanLabel = svg.querySelector('[data-level-mean-label]');
   meanLabel.setAttribute('y', my - 6); meanLabel.textContent = 'mean ' + fmt(mean);
   const point = svg.querySelector('[data-level-pt]'), py = Number(point.dataset.y0) + Number(point.dataset.step) * c;
   point.setAttribute('cy', py);
   svg.querySelector('[data-level-drop]').setAttribute('y1', py);
   const coords = svg.querySelector('[data-level-coords]');
   coords.setAttribute('y', py + 5); coords.textContent = '(' + values.map(fmt).join(', ') + ')';
   svg.querySelector('desc').textContent = 'Subtracting ' + fmt(c) + ' from every node of the pattern 3, 2, 1 gives ' + values.map(fmt).join(', ') + '. The mean is ' + fmt(mean) + ', the two edge differences are ' + gaps.map(fmt).join(' and ') + ', and the variation is ' + fmt(variation) + '. On the left the three beads slide down together; on the right the point drops straight down toward the mean-zero plane, which it reaches at 2.';
  });
 }
 control.addEventListener('input', update);
 [['level-start', 0], ['level-half', 1], ['level-centred', 2]].forEach(([id, c]) => {
  document.getElementById(id)?.addEventListener('click', () => { control.value = c; update(); });
 });
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
