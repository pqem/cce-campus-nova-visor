
(()=>{
const root=document.getElementById('nova-variants');
const assets={logo:"assets/logo-nova-negro.svg","logo-negro":"assets/logo-nova-negro.svg","logo-claro":"assets/logo-nova-claro.svg","logo-vertical-negro":"assets/logo-nova-vertical-negro.svg",facade:"assets/fachada.jpg",classroom:"assets/classroom.jpg",qr:"assets/qr-whatsapp.svg","gen-comunidad":"assets/gen-comunidad.jpg","gen-acompanamiento":"assets/gen-acompanamiento.jpg","gen-ciencias":"assets/gen-ciencias-territorio.jpg","gen-economia":"assets/gen-economia-administracion.jpg","gen-guanaco":"assets/gen-guanaco-al-centro.jpg"};
const pageTemplates=root.querySelector('#nv-pages').content;
const state={progress:0,back:false,reading:false,design:'editorial',scale:1,transitioning:false};
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let drag=null,frame=0,suppressClick=false;

// Shared back cover (face 4) for all six designs: same approved copy (Sumate a la
// primera promoción / cierre / CTA / WhatsApp QR / contacto / auspicio), only the
// facade band photo and QR change size with the page. No per-design headline: the
// old per-design headlines here were invented copy the textos-diptico v2 review cut.
function makeBackCover(){
 const article=document.createElement('article');
 article.className='nv-page back-page';
 article.innerHTML='<h2 data-group="contact">Sumate a la primera<br>promoción.</h2>'
  +'<p class="closing" data-group="contact">Una educación con propósito para un mundo real.</p>'
  +'<p class="cta" data-group="contact">Consultá por el ingreso 2027</p>'
  +'<div class="nova-contact" data-group="contact"><div class="contact-text"><p>Administración Escuela Creciendo</p><p><a href="tel:+5492996236616">+54 9 299 623-6616</a></p><p><a href="mailto:administracioncreciendo@ccesperanza.org">administracioncreciendo@ccesperanza.org</a></p></div><figure class="qr-whatsapp"><img data-asset="qr" alt="Código QR para escribir por WhatsApp a Campus NOVA"><figcaption>Escaneá y escribinos por WhatsApp</figcaption></figure></div>'
  +'<p class="nova-muted sponsor" data-group="contact">Auspicia: Iglesia Centro Cristiano Esperanza</p>'
  +'<figure class="back-band"><img data-asset="facade" alt="Visualización conceptual de la remodelación de la fachada de Campus NOVA"><div class="back-band-scrim" aria-hidden="true"></div></figure>';
 return article;
}

// Design 06 "Una escuela, en concreto": three horizontal bands per page (37.5% /
// 37.5% / 25% of the fixed page height on both pages, per design review), so the
// bands land at the same height and read as one continuous banded spread once
// open. Left page carries identity (Quiénes somos + traits + trajectory); right
// page carries the academic offer (both orientations, English, organization
// facts). Numeric facts are shown as big display numerals, each paired with its
// full sentence as a label — a layout choice over the same approved facts, not
// new content. The right page's closing band is left as a plain arena field
// (no invented content) so both pages keep the same three-band rhythm.
function makeFactsSpread(index){
 const article=document.createElement('article');
 if(index===2){
  article.className='nv-page f-spread f-left';
  article.innerHTML='<div class="f-band f-band-1" data-group="about" data-region="sand-band"><p class="nova-eyebrow">Quiénes somos</p><p class="f-lead">Somos una comunidad educativa cristiana que acompaña, desafía e inspira a cada estudiante a descubrir su propósito, desarrollar sus capacidades y transformar positivamente su entorno.</p></div>'
   +'<div class="f-band f-band-2" data-group="about"><ul class="f-traits"><li>Una escuela construida entre estudiantes, familias, docentes y comunidad.</li><li>Metodologías activas, tecnología y proyectos interdisciplinarios.</li><li>Acompañamiento de trayectorias.</li><li>Desarrollar plenamente lo que hemos recibido.</li></ul></div>'
   +'<div class="f-band f-band-3" data-group="proposal" data-region="sand-band"><p class="f-year">1992</p><p class="f-continuity">Una nueva etapa de Escuela Creciendo, desde 1992.</p></div>';
 }else{
  article.className='nv-page f-spread f-right';
  article.innerHTML='<div class="f-band f-band-1" data-group="proposal" data-region="sand-band"><p class="nova-eyebrow">Nuestra propuesta</p><h3>Bachiller en Ciencias Naturales</h3><h3>Bachiller en Economía y Administración</h3><p class="f-english">Inglés por niveles, con certificación Cambridge</p></div>'
   +'<div class="f-band f-band-2" data-group="proposal"><div class="f-numbers"><div class="f-num"><span class="n">25</span><span class="label">estudiantes por división</span></div><div class="f-num"><span class="n n-compact">13:30</span><span class="label">turno tarde · ingreso</span></div><div class="f-num"><span class="n n-compact">A · B</span><span class="label">1.º año: divisiones</span></div></div></div>'
   +'<div class="f-band f-band-3" data-region="sand-band"></div>';
 }
 return article;
}

// Design 07 "Constelación NOVA": the cover's node network expands into both pages.
// Manual values no longer appear as node labels (design review 2026-09-28): the
// left page's plain nodes now carry the four approved "Cómo es estudiar en NOVA"
// sentences instead, and the right page's two value nodes are replaced by one node
// with the full English line. Each network ends its own side of the fold with a
// node at least 14px (≈3.3% of page width) from the spine, height-matched across
// the gutter (left's last node and right's first node both sit at 66% down), so
// the two halves read as one constellation without depending on the lines actually
// meeting. Body copy is the same p.23 identity sentence and trajectory line used
// on the "Quiénes somos" / "Nuestra propuesta" faces of the other five designs —
// same copy, different layout.
function makeConstellationSpread(index){
 const article=document.createElement('article');
 // Labels sit beside their dot (k-node-side) and the chain zigzags along the left margin,
 // so no line ever runs behind a label; stacked labels made lines look cut off.
 if(index===2){
  article.className='nv-page k-spread k-left';
  article.innerHTML='<div class="k-field" data-group="about"><p class="nova-eyebrow">Quiénes somos</p><p class="k-body">Somos una comunidad educativa cristiana que acompaña, desafía e inspira a cada estudiante a descubrir su propósito, desarrollar sus capacidades y transformar positivamente su entorno.</p></div>'
   +'<div class="k-nodes" data-group="about"><svg class="k-net" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">'
   +'<line x1="6" y1="10" x2="14" y2="30" class="k-line k-line-gold"/>'
   +'<line x1="14" y1="30" x2="5" y2="50" class="k-line k-line-niebla"/>'
   +'<line x1="5" y1="50" x2="13" y2="70" class="k-line k-line-niebla"/>'
   +'<line x1="13" y1="70" x2="6" y2="90" class="k-line k-line-niebla"/></svg>'
   +'<div class="k-node k-node-side k-node-orient" style="left:6%;top:10%"><span class="k-dot k-dot-niebla"></span><h4>Bachiller en Ciencias Naturales</h4></div>'
   +'<div class="k-node k-node-side" style="left:14%;top:30%"><span class="k-dot"></span><p class="k-node-text">Una escuela construida entre estudiantes, familias, docentes y comunidad.</p></div>'
   +'<div class="k-node k-node-side" style="left:5%;top:50%"><span class="k-dot k-dot-niebla"></span><p class="k-node-text">Metodologías activas, tecnología y proyectos interdisciplinarios.</p></div>'
   +'<div class="k-node k-node-side" style="left:13%;top:70%"><span class="k-dot"></span><p class="k-node-text">Acompañamiento de trayectorias.</p></div>'
   +'<div class="k-node k-node-side" style="left:6%;top:90%"><span class="k-dot k-dot-niebla"></span><p class="k-node-text">Desarrollar plenamente lo que hemos recibido.</p></div></div>'
   +'<div class="k-strip" data-group="proposal" data-region="sand-band"><span>25 estudiantes por división</span></div>';
 }else{
  article.className='nv-page k-spread k-right';
  article.innerHTML='<div class="k-field" data-group="proposal"><p class="nova-eyebrow">Nuestra propuesta</p><p class="k-body">Una nueva etapa de Escuela Creciendo, desde 1992.</p></div>'
   +'<div class="k-nodes" data-group="proposal"><svg class="k-net" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">'
   +'<line x1="6" y1="14" x2="14" y2="46" class="k-line k-line-gold"/>'
   +'<line x1="14" y1="46" x2="6" y2="78" class="k-line k-line-niebla"/></svg>'
   +'<div class="k-node k-node-side k-node-orient" style="left:6%;top:14%"><span class="k-dot k-dot-niebla"></span><h4>Bachiller en Economía y Administración</h4></div>'
   +'<div class="k-node k-node-side" style="left:14%;top:46%"><span class="k-dot"></span><p class="k-node-text">Inglés por niveles, con certificación Cambridge</p></div>'
   +'<div class="k-node k-node-side" style="left:6%;top:78%"><span class="k-dot k-dot-niebla"></span></div></div>'
   +'<div class="k-strip" data-group="proposal" data-region="sand-band"><span>Turno tarde · ingreso 13:30</span><span>1.º año: divisiones A y B</span></div>';
 }
 return article;
}

// Design 02 "Umbral": functional regions instead of one flow per face. Each region
// (about, proposal, contact) is a flex column with one shared left edge; photos and the
// generated-image notice are separate regions placed by the page grid. Faces 0, 2 and 3
// only; the cover lives in the #local-covers template (index.html / imprenta.html).
const AI_NOTICE='Imagen ilustrativa generada · No corresponde a instalaciones ni estudiantes reales.';
function makeCurvesBack(){
 const article=document.createElement('article');
 article.className='nv-page c-page c-back';
 article.innerHTML='<section class="c-region c-contact-region" data-group="contact"><h2>Sumate a la primera promoción.</h2>'
  +'<p class="c-closing">Una educación con propósito para un mundo real.</p>'
  +'<p class="c-cta">Consultá por el ingreso 2027</p>'
  +'<div class="nova-contact"><div class="contact-text"><p>Administración Escuela Creciendo</p><p><a href="tel:+5492996236616">+54 9 299 623-6616</a></p><p><a href="mailto:administracioncreciendo@ccesperanza.org">administracioncreciendo@ccesperanza.org</a></p></div><figure class="qr-whatsapp"><img data-asset="qr" alt="Código QR para escribir por WhatsApp a Campus NOVA"><figcaption>Escaneá y escribinos por WhatsApp</figcaption></figure></div>'
  +'<p class="nova-muted sponsor">Auspicia: Iglesia Centro Cristiano Esperanza</p></section>'
  +'<div class="c-band"><img class="c-photo c-photo-walk" data-asset="gen-guanaco" alt="Tres estudiantes caminan por la estepa patagónica al atardecer, con un pozo petrolero al fondo (imagen generada)"><img class="c-photo c-photo-facade" data-asset="facade" alt="Fachada de Campus NOVA">'
  +'<p class="c-notice c-notice-bar" data-group="ai-photo-notice">'+AI_NOTICE+'</p></div>';
 return article;
}
function makeCurvesSpread(index){
 const article=document.createElement('article');
 if(index===2){
  article.className='nv-page c-page c-inside-left';
  article.innerHTML='<section class="c-region c-about" data-group="about"><p class="nova-eyebrow">Quiénes somos</p>'
   +'<p class="c-lead">Somos una comunidad educativa cristiana que acompaña, desafía e inspira a cada estudiante a descubrir su propósito, desarrollar sus capacidades y transformar positivamente su entorno.</p>'
   +'<div class="c-band-sand"><ul class="c-traits"><li>Una escuela construida entre estudiantes, familias, docentes y comunidad.</li><li>Metodologías activas, tecnología y proyectos interdisciplinarios.</li><li>Acompañamiento de trayectorias.</li><li>Desarrollar plenamente lo que hemos recibido.</li></ul></div></section>'
   +'<div class="c-photos"><img class="c-photo c-photo-mentor" data-asset="gen-acompanamiento" alt="Un estudiante conversa con su docente sobre un libro abierto (imagen generada)"><img class="c-photo c-photo-class" data-asset="classroom" alt="Estudiantes y docente observan una planta con una lupa en el aula (imagen generada)"></div>'
   +'<p class="c-notice" data-group="ai-photo-notice">'+AI_NOTICE+'</p>'
   +'<footer class="nova-footer"><span>Centro Cristiano Educativo</span><span>02 / Quiénes somos</span></footer>';
 }else{
  article.className='nv-page c-page c-inside-right';
  article.innerHTML='<section class="c-region c-proposal" data-group="proposal"><p class="nova-eyebrow">Nuestra propuesta</p>'
   +'<div class="c-orient"><div class="c-orient-text"><p class="c-kicker">Bachiller en</p><h3>Ciencias Naturales</h3></div><img class="c-photo c-photo-science" data-asset="gen-ciencias" alt="Estudiantes y una docente toman una muestra de agua en la orilla del río (imagen generada)"></div>'
   +'<div class="c-orient"><div class="c-orient-text"><p class="c-kicker">Bachiller en</p><h3>Economía<br>y Administración</h3></div><img class="c-photo c-photo-economy" data-asset="gen-economia" alt="Una estudiante presenta un prototipo a sus compañeros frente a un pizarrón (imagen generada)"></div>'
   +'<div class="c-band-sand c-facts"><div><p class="c-kicker">Inglés</p><p>Inglés por niveles, con certificación Cambridge</p></div><div><p class="c-kicker">Organización</p><p>25 estudiantes por división<br>Turno tarde · ingreso 13:30<br>1.º año: divisiones A y B</p></div></div>'
   +'<p class="c-trajectory">Una nueva etapa de Escuela Creciendo, desde 1992.</p></section>'
   +'<p class="c-notice" data-group="ai-photo-notice">'+AI_NOTICE+'</p>'
   +'<footer class="nova-footer"><span>Centro Cristiano Educativo</span><span>03 / Nuestra propuesta</span></footer>';
 }
 return article;
}

const SPREAD_DESIGNS=['facts','constellation'];
const COVER_MAP={editorial:'poster',curves:'architecture',institutional:'medallion',immersive:'facade-full',facts:'facts',constellation:'constellation'};

function makePage(index){
 if(index===1){
  const wrapper=document.createElement('div');wrapper.className='local-cover';
  wrapper.append(root.querySelector('#local-covers').content.querySelector('[data-panel="'+COVER_MAP[state.design]+'"]').cloneNode(true));
  return wrapper;
 }
 if(index===0)return state.design==='curves'?makeCurvesBack():makeBackCover();
 if(state.design==='curves')return makeCurvesSpread(index);
 if(SPREAD_DESIGNS.includes(state.design))return state.design==='facts'?makeFactsSpread(index):makeConstellationSpread(index);
 const name=index===2?'identidad':'propuesta';
 const clone=pageTemplates.querySelector('[data-page="'+name+'"]').cloneNode(true);clone.classList.add('nv-page');
 if(index===2&&state.design==='immersive'){
  // Bleed the identity photo to the top/left/right edges instead of leaving it inline mid-page.
  clone.prepend(clone.querySelector('figure'));
 }
 return clone;
}

function page(index){
 const clone=makePage(index);
 clone.querySelectorAll('[data-asset]').forEach(image=>{image.src=assets[image.dataset.asset];image.draggable=false;});
 return clone;
}
function drawIcons(){if(globalThis.lucide)globalThis.lucide.createIcons({attrs:{width:15,height:15}});}

// Reused outside the interactive viewer (imprenta.html builds each printed face by
// calling page(index) directly, since it has no .nv-scene and never runs the block below).
window.NOVA={page,state,drawIcons};

const scene=root.querySelector('.nv-scene');
if(scene){
const PROPOSALS=[
 {key:'editorial',num:'01',name:'Contrapunto',intent:'Una foto grande de estudiantes con el lema encima; el logo va abajo, en una banda clara.',tech:'Foto a sangre, lema sobreimpreso, firma en banda arena.'},
 {key:'curves',num:'02',name:'Umbral',intent:'Un panel claro con el borde curvo y una línea dorada se abre sobre una foto de la comunidad.',tech:'Panel arena con curva y filete dorado sobre foto a sangre.'},
 {key:'institutional',num:'03',name:'Encuentro',intent:'La foto va dentro de un arco y todo lo demás se centra debajo, con el logo como protagonista: el estilo más clásico.',tech:'Foto en arco, composición centrada, logo vertical.'},
 {key:'immersive',num:'04',name:'Envolvente',intent:'El edificio del colegio ocupa toda la tapa y los textos van sobre una sombra oscura.',tech:'Fachada a sangre, texto sobre degradé oscuro.'},
 {key:'facts',num:'06',name:'Una escuela, en concreto',intent:'Una tapa hecha con letras: el año 2027 en grande y una foto del edificio abajo.',tech:'Tapa tipográfica, numeral 2027, banda fotográfica inferior.'},
 {key:'constellation',num:'07',name:'Constelación NOVA',intent:'Fondo oscuro con puntos unidos por líneas y una estrella dorada, como un mapa de estrellas.',tech:'Fondo carbón, red de nodos, estrella dorada.'}
];
const FINALE=PROPOSALS.length;
const VIEW_LABELS={front:'Tapa',back:'Contratapa',inside:'Interior'};
const VIEW_HINTS={front:'Arrastrá el borde hacia la izquierda para abrir.',back:'Elegí Tapa para volver al frente.',inside:'Arrastrá el borde izquierdo para cerrar.'};
const FINALE_STATUS='Las seis propuestas · Elegí una para verla.';
const MOBILE_INTERIOR_HINT='Tocá «Leer ampliado» para leer cómodo.';
const book=root.querySelector('.nv-book'),leaf=root.querySelector('.nv-leaf');
const reading=root.querySelector('.nv-reading'),back=root.querySelector('.nv-back');
const readButton=root.querySelector('#nv-read'),prevButton=root.querySelector('#nv-prev'),nextButton=root.querySelector('#nv-next');
const status=root.querySelector('.vw-status'),viewButtons=[...root.querySelectorAll('[data-view]')];
const viewport=root.querySelector('.vw-viewport'),stage=root.querySelector('.vw-stage'),finale=root.querySelector('.vw-finale');
const marks=Object.fromEntries(['tl','tr','bl','br'].map(corner=>[corner,root.querySelector('.vw-mark-'+corner)])),railNav=root.querySelector('.vw-rail'),coverList=root.querySelector('.vw-covers');
const nameHeading=root.querySelector('.vw-name'),numeral=root.querySelector('.vw-numeral'),intentLine=root.querySelector('.vw-intent'),techLine=root.querySelector('.vw-tech');
const readBar=root.querySelector('.vw-readbar'),readBarLabel=root.querySelector('.vw-readbar-label'),readClose=root.querySelector('#nv-read-close');
const shareButton=root.querySelector('#nv-share'),shareField=root.querySelector('#nv-share-field'),allButton=root.querySelector('#nv-all'),segment=root.querySelector('.vw-seg'),mainRegion=root.querySelector('#vw-main');
const downloadLink=root.querySelector('#nv-download');
const wide=window.matchMedia('(min-width:761px)');
const procession={index:0,visited:new Set([0]),token:0};

function refreshSurfaces(){root.querySelectorAll('[data-face]').forEach(surface=>{surface.querySelector('.nv-page,.local-cover')?.remove();surface.prepend(page(Number(surface.dataset.face)));});drawIcons();}

// The closed cover needs half the book's width, so it scales to fill one page while the
// open book scales to fill two; scale and scene height follow the fold progress. Height caps
// keep the name, intent and controls on the first screen; on desktop closed and open share
// the cap, so nothing below the stage moves. The 24px frame around the paper holds the trim marks.
function layout(){
 const width=scene.clientWidth;
 if(!width)return;
 const heightCap=wide.matches?Math.min(1.25,Math.max(.6,(window.innerHeight-322)/594)):Math.min(1.25,Math.max(.45,(window.innerHeight-464)/594));
 const closed=Math.min(width/480,heightCap),open=Math.min(width/880,heightCap);
 state.scale=closed+(open-closed)*state.progress;
 const bookX=(width-840*state.scale)/2-210*(1-state.progress)*state.scale;
 scene.style.height=(594*state.scale+48)+'px';
 book.style.transform='translate('+bookX+'px,24px) scale('+state.scale+')';
 leaf.style.transform='rotateY('+(-180*state.progress)+'deg)';
 book.style.setProperty('--vw-edge-w',Math.ceil(44/state.scale)+'px');
 const left=bookX+420*state.scale*(1-state.progress),right=bookX+840*state.scale,top=24,bottom=24+594*state.scale;
 [['tl',left,top],['tr',right,top],['bl',left,bottom],['br',right,bottom]].forEach(([corner,x,y])=>{marks[corner].style.transform='translate('+x+'px,'+y+'px)';});
}
function currentView(){return state.progress>=.5?'inside':state.back?'back':'front';}
function hashFor(){
 if(procession.index===FINALE)return '#las-seis';
 return '#'+PROPOSALS[procession.index].num+'-'+currentView().replace('front','tapa').replace('back','contratapa').replace('inside','interior');
}
function updateStatus(){
 shareField.hidden=true;
 if(procession.index===FINALE){status.textContent=FINALE_STATUS;}
 else{
  const view=currentView();
  const hint=state.reading?'Lectura ampliada':(view==='inside'&&!wide.matches?MOBILE_INTERIOR_HINT:VIEW_HINTS[view]);
  status.textContent=VIEW_LABELS[view]+' · '+hint;
 }
 try{history.replaceState(null,'',hashFor());}catch(error){/* sandboxed frames may forbid history changes */}
}
function accessibility(){
 const open=state.progress>=.5;
 root.querySelector('.nv-front').inert=open||state.back;
 root.querySelector('.nv-inside-left').inert=!open||state.back;
 root.querySelector('.nv-stationary').inert=!open||state.back;
 back.inert=!state.back;
 const view=currentView();
 viewButtons.forEach(button=>{
  const pressed=button.dataset.view===view;
  button.setAttribute('aria-pressed',String(pressed));button.tabIndex=pressed?0:-1;
 });
 readButton.classList.toggle('is-cue',view==='inside'&&!state.reading&&!wide.matches);
 readBarLabel.textContent=PROPOSALS[Math.min(procession.index,FINALE-1)].num+' '+PROPOSALS[Math.min(procession.index,FINALE-1)].name+' · '+VIEW_LABELS[view];
 updateStatus();
}
function renderReading(){
 reading.replaceChildren(...(state.progress>=.5?[page(2),page(3)]:[page(state.back?0:1)]));
 drawIcons();
}
function render(){
 back.hidden=!state.back;leaf.hidden=state.back;
 scene.hidden=state.reading;reading.hidden=!state.reading;readBar.hidden=!state.reading;
 readButton.setAttribute('aria-pressed',String(state.reading));
 layout();accessibility();if(state.reading)renderReading();
}
function settle(target,done){
 cancelAnimationFrame(frame);
 state.transitioning=true;
 if(state.back){state.back=false;render();}
 const start=state.progress,startTime=performance.now(),duration=reduced.matches?0:430;
 function tick(now){
  const time=duration?Math.min(1,(now-startTime)/duration):1;
  state.progress=start+(target-start)*(1-Math.pow(1-time,3));layout();
  if(time<1)frame=requestAnimationFrame(tick);else{state.transitioning=false;render();if(done)done();}
 }
 frame=requestAnimationFrame(tick);
}
function setView(view){
 cancelAnimationFrame(frame);
 if(state.reading){
  drag=null;state.transitioning=false;
  state.back=view==='back';state.progress=view==='inside'?1:0;render();return;
 }
 if(view==='back'){
  if(state.progress>0)settle(0,()=>{state.back=true;render();});
  else{state.back=true;render();}
 }else if(view==='front'){
  if(state.back){state.back=false;render();}
  else if(state.progress>0)settle(0);
  else render();
 }else settle(1);
}
function startDrag(event){
 if(event.button!==0||state.back||state.reading)return;
 cancelAnimationFrame(frame);state.transitioning=true;drag={x:event.clientX,progress:state.progress,moved:false};
 event.currentTarget.setPointerCapture(event.pointerId);event.preventDefault();
}
function moveDrag(event){
 if(!drag)return;
 const delta=event.clientX-drag.x;drag.moved=drag.moved||Math.abs(delta)>5;
 state.progress=Math.max(0,Math.min(1,drag.progress-delta/(420*state.scale)));layout();
}
function endDrag(event){
 if(!drag)return;
 const moved=drag.moved;drag=null;suppressClick=moved;
 if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
 if(moved)settle(state.progress>=.5?1:0);else{state.transitioning=false;accessibility();}
}
root.querySelectorAll('.nv-edge').forEach(edge=>{
 edge.addEventListener('pointerdown',startDrag);edge.addEventListener('pointermove',moveDrag);
 edge.addEventListener('pointerup',endDrag);edge.addEventListener('pointercancel',event=>{drag=null;settle(state.progress>=.5?1:0);});
 edge.addEventListener('click',()=>{if(suppressClick){suppressClick=false;return;}settle(state.progress>=.5?0:1);});
});
viewButtons.forEach(button=>button.addEventListener('click',()=>setView(button.dataset.view)));
function setReading(on,returnFocus){
 state.reading=on;render();
 if(returnFocus)readButton.focus();
}
readButton.addEventListener('click',()=>setReading(!state.reading));
readClose.addEventListener('click',()=>setReading(false,true));
wide.addEventListener('change',()=>{layout();accessibility();});
segment.addEventListener('keydown',event=>{
 if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
 event.preventDefault();
 const step=event.key==='ArrowRight'?1:-1,index=(viewButtons.indexOf(document.activeElement)+step+viewButtons.length)%viewButtons.length;
 viewButtons[index].focus();setView(viewButtons[index].dataset.view);
});

const DOWNLOAD_FILES={editorial:'01-contrapunto',curves:'02-umbral',institutional:'03-encuentro',immersive:'04-envolvente',facts:'06-en-concreto',constellation:'07-constelacion'};
function updateDownloadLink(){downloadLink.href='descargas/diptico-'+DOWNLOAD_FILES[state.design]+'-a4.pdf';}
// The published artifact never follows plain download links; it hands files over through
// the `downloads` capability. The local dev server has no window.claude and keeps the link.
downloadLink.addEventListener('click',async event=>{
 if(!globalThis.claude?.use)return;
 event.preventDefault();
 const downloads=await globalThis.claude.use('downloads');
 if(!downloads){status.textContent='La descarga no está disponible en esta vista.';return;}
 const filename=downloadLink.href.split('/').pop();
 try{
  const response=await fetch(downloadLink.href);
  if(!response.ok)throw {code:'unavailable'};
  await downloads.save({filename,data:await response.blob()});
 }catch(error){
  if(error?.code!=='declined')status.textContent='No se pudo descargar el PDF. Probá de nuevo en unos segundos.';
 }
});

// Sharing: the URL hash carries the proposal and view, so a link reopens the same spot.
function shareText(){
 // Any static host shares its own address. Inside a claude.ai artifact the page runs in a
 // sandboxed frame whose address is not shareable, so the public link comes from the optional
 // <meta name="nova-artifact-url"> instead of being hard-coded here.
 const artifactUrl=globalThis.claude?.use?document.querySelector('meta[name="nova-artifact-url"]')?.content:null;
 const base=artifactUrl||location.href.split('#')[0];
 const view=VIEW_LABELS[currentView()];
 const subject=procession.index===FINALE?'las seis propuestas':'la propuesta '+PROPOSALS[procession.index].num+' · '+PROPOSALS[procession.index].name+' ('+view+')';
 return 'Mirá '+subject+' del díptico NOVA: '+base+hashFor();
}
async function share(){
 const text=shareText();
 if(navigator.share){
  try{await navigator.share({text});return;}
  catch(error){if(error?.name==='AbortError')return;}
 }
 try{
  await navigator.clipboard.writeText(text);
  status.textContent='Enlace copiado.';return;
 }catch(error){/* clipboard blocked: fall back to a selectable field */}
 shareField.value=text;shareField.hidden=false;shareField.focus();shareField.select();
 status.textContent='Copiá el texto para compartirlo.';
}
shareButton.addEventListener('click',share);
allButton.addEventListener('click',()=>goTo(FINALE));
function applyHash(){
 const match=/^#(\d\d)-(tapa|contratapa|interior)$/.exec(location.hash);
 if(location.hash==='#las-seis'){showEntry(FINALE);return true;}
 const position=match?PROPOSALS.findIndex(entry=>entry.num===match[1]):-1;
 if(position<0)return false;
 showEntry(position);
 if(match[2]!=='tapa'){state.back=match[2]==='contratapa';state.progress=match[2]==='interior'?1:0;render();}
 paintRail(position);
 return true;
}
window.addEventListener('hashchange',()=>{if(location.hash!==hashFor())applyHash();});

// Procession: order rail, finale and the enter/exit motion between proposals.
function buildRail(){
 const items=PROPOSALS.map((entry,position)=>{
  const item=document.createElement('li'),button=document.createElement('button');
  button.type='button';button.className='vw-step';button.dataset.design=entry.key;
  button.innerHTML='<span class="vw-step-n">'+entry.num+'</span> <span class="vw-step-name">'+entry.name+'</span>';
  button.addEventListener('click',()=>goTo(position));
  item.append(button);return item;
 });
 const last=document.createElement('li'),lastButton=document.createElement('button');
 last.className='vw-rail-finale';lastButton.type='button';lastButton.className='vw-step';lastButton.dataset.design='finale';
 lastButton.innerHTML='<span class="vw-step-name">Las seis</span>';
 lastButton.addEventListener('click',()=>goTo(FINALE));
 last.append(lastButton);
 railNav.querySelector('ol').replaceChildren(...items,last);
 return [...railNav.querySelectorAll('.vw-step')];
}
const railButtons=buildRail();
function paintRail(index){
 railButtons.forEach((button,position)=>{
  button.classList.toggle('is-visited',position!==index&&procession.visited.has(position));
  if(position===index)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');
 });
 if(railNav.scrollWidth>railNav.clientWidth){
  const active=railButtons[index];
  railNav.scrollTo({left:active.offsetLeft-(railNav.clientWidth-active.offsetWidth)/2,behavior:reduced.matches?'auto':'smooth'});
 }
}
// A cover is rebuilt from the same #local-covers template and asset map that page() uses.
function coverFor(key){
 const wrapper=document.createElement('div');wrapper.className='local-cover';
 wrapper.append(root.querySelector('#local-covers').content.querySelector('[data-panel="'+COVER_MAP[key]+'"]').cloneNode(true));
 wrapper.querySelectorAll('[data-asset]').forEach(image=>{image.src=assets[image.dataset.asset];image.draggable=false;});
 return wrapper;
}
function buildFinale(){
 PROPOSALS.forEach((entry,position)=>{
  const item=document.createElement('li'),frameBox=document.createElement('div'),open=document.createElement('button');
  item.className='vw-cover';frameBox.className='vw-cover-frame';frameBox.setAttribute('aria-hidden','true');
  frameBox.append(coverFor(entry.key));
  open.type='button';open.className='vw-cover-open';
  open.innerHTML='<span class="vw-cover-n">'+entry.num+'</span> <span class="vw-cover-name">'+entry.name+'</span>';
  open.addEventListener('click',()=>goTo(position));
  const intent=document.createElement('p');intent.className='vw-cover-intent';intent.textContent=entry.intent;
  const tech=document.createElement('p');tech.className='vw-cover-tech';tech.textContent=entry.tech;
  item.append(frameBox,open,intent,tech);coverList.append(item);
 });
}
function fitCovers(){
 coverList.querySelectorAll('.vw-cover-frame').forEach(frameBox=>{
  if(frameBox.clientWidth)frameBox.firstElementChild.style.setProperty('--vw-cover-scale',frameBox.clientWidth/420);
 });
}
buildFinale();
function showEntry(index){
 procession.index=index;procession.visited.add(index);
 const isFinale=index===FINALE;
 stage.hidden=isFinale;finale.hidden=!isFinale;root.classList.toggle('is-finale',isFinale);
 if(!isFinale){
  const entry=PROPOSALS[index];
  cancelAnimationFrame(frame);drag=null;
  state.design=entry.key;root.dataset.design=entry.key;state.progress=0;state.back=false;state.transitioning=false;
  updateDownloadLink();refreshSurfaces();
  numeral.textContent=entry.num;nameHeading.textContent=entry.name;
  intentLine.textContent=entry.intent;techLine.textContent=entry.tech;
 }
 paintRail(index);
 prevButton.setAttribute('aria-disabled',String(index===0));
 nextButton.setAttribute('aria-disabled',String(isFinale));
 shareButton.textContent=isFinale?'Compartir las seis':'Compartir esta';
 if(isFinale){fitCovers();updateStatus();}else render();
}
async function goTo(target){
 if(target===procession.index||target<0||target>FINALE)return;
 const direction=target>procession.index?1:-1,token=++procession.token;
 viewport.getAnimations().forEach(animation=>animation.cancel());
 if(reduced.matches){showEntry(target);return;}
 paintRail(target);
 try{
  const exit=viewport.animate([{transform:'translateX(0)',opacity:1},{transform:'translateX('+(-direction*48)+'px)',opacity:0}],{duration:170,easing:'cubic-bezier(.5,0,.75,0)',fill:'forwards'});
  await exit.finished;
  if(token!==procession.token)return;
  showEntry(target);
  viewport.animate([{transform:'translateX('+(direction*48)+'px)',opacity:0},{transform:'translateX(0)',opacity:1}],{duration:230,easing:'cubic-bezier(.16,1,.3,1)'});
  exit.cancel();
 }catch(error){
  if(error?.name!=='AbortError')throw error;
 }
}
prevButton.addEventListener('click',()=>goTo(procession.index-1));
nextButton.addEventListener('click',()=>goTo(procession.index+1));
window.addEventListener('keydown',event=>{
 if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
 if(event.key==='Escape'&&state.reading){setReading(false,readBar.contains(document.activeElement));return;}
 if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
 if(event.target.closest('input,select,textarea,.vw-seg,[contenteditable=""],[contenteditable="true"]'))return;
 event.preventDefault();goTo(procession.index+(event.key==='ArrowRight'?1:-1));
});
root.querySelector('.vw-skip')?.addEventListener('click',event=>{event.preventDefault();mainRegion.focus();});
new ResizeObserver(layout).observe(scene);
new ResizeObserver(fitCovers).observe(coverList);
window.addEventListener('resize',layout);
const startedFromHash=applyHash()===true;
if(!startedFromHash)showEntry(0);
// One gentle fold cue per page load: the leaf lifts a few degrees and settles back.
function peek(){
 if(reduced.matches||startedFromHash||procession.index!==0||state.progress!==0||state.back||state.reading||drag)return;
 const startTime=performance.now();
 function tick(now){
  const time=Math.min(1,(now-startTime)/900);
  state.progress=.06*Math.sin(Math.PI*time);layout();
  if(time<1)frame=requestAnimationFrame(tick);else{state.progress=0;layout();}
 }
 frame=requestAnimationFrame(tick);
}
setTimeout(peek,700);
// Live reload only exists on the local dev server; the published artifact has no /__events endpoint.
if(location.hostname==='127.0.0.1'){const reload=new EventSource('/__events');reload.onmessage=event=>{if(event.data==='reload')location.reload();};}
}
})();
