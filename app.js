const CK=['lenguajes','pensamiento','etica','humano'];
const CMETA={
  lenguajes:{label:'Lenguajes',emoji:'🗣',color:'#2E7D5A'},
  pensamiento:{label:'Pensamiento Científico',emoji:'🔬',color:'#2563A8'},
  etica:{label:'Ética, Naturaleza y Sociedades',emoji:'🌎',color:'#9D174D'},
  humano:{label:'De lo Humano y lo Comunitario',emoji:'💛',color:'#D97706'}
};
const NL={'1':'Requiere apoyo','2':'En proceso','3':'Esperado'};
const NB={'1':'b1','2':'b2','3':'b3'};
const NR={'1':'r1','2':'r2','3':'r3'};
const NE={'1':'🔴','2':'🟡','3':'🟢'};

// Estado por campo
const estado={};
CK.forEach(k=>{estado[k]={cont:null,pdaIdx:null,nivel:null}});

function gAl(){try{return JSON.parse(localStorage.getItem('d_al')||'[]')}catch(e){return[]}}
function sAl(a){localStorage.setItem('d_al',JSON.stringify(a))}
function gEv(){try{return JSON.parse(localStorage.getItem('d_ev')||'[]')}catch(e){return[]}}
function sEv(a){localStorage.setItem('d_ev',JSON.stringify(a))}
function gObs(){try{return JSON.parse(localStorage.getItem('d_ob')||'[]')}catch(e){return[]}}
function sObs(a){localStorage.setItem('d_ob',JSON.stringify(a))}
function gRec(){try{const r=JSON.parse(localStorage.getItem('d_rec')||'{}');Object.keys(r).forEach(k=>{if(typeof r[k]==='string'){r[k]=r[k]?r[k].split('\n').map(s=>s.replace(/^•\s*/,'').trim()).filter(Boolean):[];}});return r;}catch(e){return{}}}
function sRec(o){localStorage.setItem('d_rec',JSON.stringify(o))}
function recListStaticHTML(al){
  const arr=(gRec()[al]||[]);
  if(!arr.length)return'';
  return `<div class="rec-box">
      <div class="rec-lbl">💡 Recomendaciones</div>
      <div class="rec-list">${arr.map(texto=>`<div class="rec-item rec-item-ro"><span>${texto.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span></div>`).join('')}</div>
    </div>`;
}
function recBoxHTML(idx,al){
  const alEsc=al.replace(/"/g,'&quot;');
  const alJs=alEsc.replace(/'/g,"\\'");
  return `<div class="rec-box">
      <div class="rec-lbl">💡 Recomendaciones</div>
      <select class="rec-sel no-print" id="rec-sel-${idx}" onchange="agregarRecSugerida('${idx}','${alJs}',this)">
        <option value="">➕ Elegir una recomendación...</option>
        ${CK.map(k=>`<optgroup label="${CMETA[k].emoji} ${CMETA[k].label}">${RECS_ALL[k].map((g,gi)=>g.items.map((it,ii)=>`<option value="${k}|${gi}|${ii}">${it.replace(/"/g,'&quot;').slice(0,90)}${it.length>90?'…':''}</option>`).join('')).join('')}</optgroup>`).join('')}
      </select>
      <div class="rec-list" id="rec-list-${idx}"></div>
    </div>`;
}
function pintarRecList(idx,al){
  const cont=document.getElementById('rec-list-'+idx);
  if(!cont)return;
  const arr=(gRec()[al]||[]);
  if(!arr.length){cont.innerHTML='<div class="rec-empty">Aún no has agregado recomendaciones. Elígelas de la lista de arriba.</div>';return;}
  cont.innerHTML=arr.map((texto,i)=>`<div class="rec-item"><span>${texto.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span><button type="button" class="rec-del no-print" onclick="quitarRecItem('${idx}','${al.replace(/'/g,"\\'")}',${i})" title="Quitar">✕</button></div>`).join('');
}
function agregarRecSugerida(idx,al,sel){
  const v=sel.value;
  if(!v)return;
  const [campo,gi,ii]=v.split('|');
  const texto=RECS_ALL[campo][Number(gi)].items[Number(ii)];
  const r=gRec();
  if(!r[al])r[al]=[];
  if(!r[al].includes(texto))r[al].push(texto);
  sRec(r);
  pintarRecList(idx,al);
  sel.value='';
}
function quitarRecItem(idx,al,i){
  const r=gRec();
  if(r[al]){r[al].splice(i,1);sRec(r);}
  pintarRecList(idx,al);
}

// ─── OBSERVACIONES ───
function guardarObs(){
  const al=document.getElementById('ob-al').value;
  const txt=document.getElementById('ob-txt').value.trim();
  if(!al){alert('Selecciona un alumno antes de guardar.');return;}
  if(!txt){alert('Escribe una observación antes de guardar.');return;}
  const fecha=new Date().toLocaleDateString('es-MX');
  const reg={id:Date.now(),al,fecha,txt};
  const obs=gObs();obs.push(reg);window.sObs(obs);
  document.getElementById('ob-txt').value='';
  alert(`✅ Observación de ${al} guardada.`);
  buildOb();
}

function buildOb(){
  const obs=gObs();
  const c=document.getElementById('ob-cont');
  if(!c)return;
  if(!obs.length){c.innerHTML='<p class="nd">Aún no hay observaciones guardadas.</p>';return;}
  const por={};
  obs.forEach(o=>{if(!por[o.al])por[o.al]=[];por[o.al].push(o);});
  Object.values(por).forEach(list=>list.sort((a,b)=>b.id-a.id));
  let h='';
  Object.entries(por).forEach(([al,list])=>{
    h+=`<div class="al-g"><div class="al-n">👤 ${esc(al)}<span class="al-c">${list.length} observación${list.length>1?'es':''}</span></div><div class="ev-list">`;
    list.forEach(o=>{
      h+=`<div class="ev-item" style="cursor:default">
        <div class="ev-h" style="position:relative"><div class="ev-hl">📅 ${o.fecha}</div><div class="ev-hr"></div><button onclick="borrarObs(${o.id})" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:7px;padding:3px 8px;font-size:.75rem;cursor:pointer;font-family:Nunito,sans-serif;font-weight:700" title="Eliminar esta observación">🗑</button></div>
        <div style="padding:10px 14px;font-size:.88rem;color:var(--tx);line-height:1.5;white-space:pre-wrap">${o.txt}</div>
      </div>`;
    });
    h+=`</div></div>`;
  });
  c.innerHTML=h;
}

function borrarObs(id){if(!confirm('¿Eliminar esta observación?'))return;window.sObs(gObs().filter(o=>o.id!==id));buildOb();}
function borrarTodoObs(){if(!confirm('¿Borrar todas las observaciones?'))return;window.sObs([]);buildOb();}

function showTab(t,btn){
  document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('tab-'+t).classList.add('active');
  btn.classList.add('active');
  if(t==='ev')buildForm();
  if(t==='rs')buildRS();
  if(t==='as')buildAsistencia();
  if(t==='ob')buildOb();
}

// ─── ASISTENCIA ───
const AS_ALUMNOS_DEFAULT=[
  {n:1,nombre:'Arevalo Montoya Angel Saul',sep:null,oct:null,nov:14,dic:8,ene:8,feb:11,mzo:14,abr:14,may:12,jun:null,jul:null,estado:'o'},
  {n:2,nombre:'Arevalo Montoya Angela Sarahi',sep:null,oct:null,nov:14,dic:8,ene:8,feb:11,mzo:14,abr:14,may:12,jun:null,jul:null,estado:'a'},
  {n:3,nombre:'Bolaños Noyola Dario',sep:18,oct:15,nov:11,dic:10,ene:6,feb:9,mzo:8,abr:10,may:7,jun:null,jul:null,estado:'o'},
  {n:4,nombre:'Bolaños Rodriguez Leah Natalia',sep:15,oct:17,nov:11,dic:11,ene:8,feb:8,mzo:11,abr:null,may:null,jun:null,jul:null,estado:'x'},
  {n:5,nombre:'Escamilla Reyes Hannia',sep:17,oct:18,nov:12,dic:13,ene:11,feb:6,mzo:14,abr:13,may:12,jun:null,jul:null,estado:'a'},
  {n:6,nombre:'González Vera Vanessa Evangeline',sep:null,oct:null,nov:0,dic:6,ene:2,feb:0,mzo:0,abr:null,may:null,jun:null,jul:null,estado:'x'},
  {n:7,nombre:'Guadarrama Salazar Eli Judai',sep:19,oct:19,nov:15,dic:15,ene:13,feb:10,mzo:14,abr:14,may:11,jun:null,jul:null,estado:'o'},
  {n:8,nombre:'Gutierrez Gachuzo Vanessa',sep:18,oct:16,nov:12,dic:12,ene:5,feb:8,mzo:0,abr:null,may:null,jun:null,jul:null,estado:'x'},
  {n:9,nombre:'Islas Reyes Dayri',sep:4,oct:20,nov:10,dic:11,ene:4,feb:5,mzo:11,abr:13,may:9,jun:null,jul:null,estado:'o'},
  {n:10,nombre:'Mendez Lopez Jose Luis',sep:15,oct:18,nov:9,dic:13,ene:8,feb:7,mzo:8,abr:11,may:11,jun:null,jul:null,estado:'o'},
  {n:11,nombre:'Montes Alvarado Allison Noemi',sep:14,oct:16,nov:10,dic:7,ene:3,feb:5,mzo:12,abr:11,may:8,jun:null,jul:null,estado:'a'},
  {n:12,nombre:'Morales Yañez Leonardo Javier',sep:13,oct:12,nov:8,dic:9,ene:11,feb:11,mzo:10,abr:null,may:null,jun:null,jul:null,estado:'x'},
  {n:13,nombre:'Orellana Velazquez Joseph Alexis',sep:11,oct:18,nov:11,dic:11,ene:9,feb:11,mzo:15,abr:14,may:11,jun:null,jul:null,estado:'o'},
  {n:14,nombre:'Ortega Sotelo Esteban Emiliano',sep:14,oct:18,nov:11,dic:8,ene:9,feb:4,mzo:10,abr:13,may:7,jun:null,jul:null,estado:'o'},
  {n:15,nombre:'Perez Hernández Erick Damian',sep:null,oct:null,nov:3,dic:15,ene:14,feb:11,mzo:17,abr:14,may:15,jun:null,jul:null,estado:'o'},
  {n:16,nombre:'Ranirez Martinez Cristian Martin',sep:18,oct:21,nov:16,dic:11,ene:9,feb:5,mzo:13,abr:12,may:15,jun:null,jul:null,estado:'o'},
  {n:17,nombre:'Rivadeneyra Torres Daniela Nicole',sep:17,oct:18,nov:15,dic:11,ene:9,feb:11,mzo:15,abr:13,may:14,jun:null,jul:null,estado:'a'},
  {n:18,nombre:'Rodriguez Flores Leah Isabella',sep:16,oct:17,nov:8,dic:8,ene:7,feb:9,mzo:10,abr:11,may:7,jun:null,jul:null,estado:'a'},
  {n:19,nombre:'Ruiz Hernández Meyrabel Abigail',sep:null,oct:null,nov:0,dic:2,ene:4,feb:5,mzo:3,abr:8,may:2,jun:null,jul:null,estado:'a'},
  {n:20,nombre:'Mellano Ramírez Cesar Samuel',sep:null,oct:null,nov:null,dic:null,ene:null,feb:2,mzo:0,abr:null,may:null,jun:null,jul:null,estado:'x'},
  {n:21,nombre:'Ayala Valladares Kelly Adele',sep:null,oct:null,nov:null,dic:null,ene:null,feb:4,mzo:11,abr:9,may:7,jun:null,jul:null,estado:'a'}
];
const AS_TOTALES_DEFAULT={sep:19,oct:21,nov:17,dic:15,ene:14,feb:11,mzo:17,abr:14,may:15,jun:null,jul:null};

function gAs(){try{return JSON.parse(localStorage.getItem('d_as')||'null')}catch(e){return null}}
function sAs(d){localStorage.setItem('d_as',JSON.stringify(d))}
window.sAl=sAl; window.sEv=sEv; window.sAs=sAs; window.sObs=sObs;

function buildAsistencia(){
  const listaActual=gAl();
  let data=gAs()||{alumnos:[],totales:AS_TOTALES_DEFAULT};

  if(listaActual.length===0){
    document.getElementById('as-body').innerHTML='<tr><td colspan="21" style="text-align:center;padding:32px;color:var(--tx2);font-size:.9rem">Sin alumnos registrados. Agrega alumnos en la pestaña <strong>&#128105;&#8205;&#127891; Alumnos</strong> primero.</td></tr>';
    document.getElementById('as-foot').innerHTML='';
    return;
  }

  const mapaExistente={};
  data.alumnos.forEach(a=>{ mapaExistente[a.nombre]=a; });
  data.alumnos=listaActual.map((nombre,i)=>{
    if(mapaExistente[nombre]) return {...mapaExistente[nombre], n:i+1, nombre, sexo:mapaExistente[nombre].sexo||''};
    return {n:i+1,nombre,sep:null,oct:null,nov:null,dic:null,ene:null,feb:null,mzo:null,abr:null,may:null,jun:null,jul:null,estado:'o',sexo:''};
  });
  window.sAs(data);
  renderAsistencia(data);
}

function estadoBadge(e){
  if(e==='o')return '<span style="background:var(--vl);color:var(--verde);border-radius:6px;padding:2px 8px;font-weight:700;font-family:Nunito,sans-serif">o</span>';
  if(e==='a')return '<span style="background:var(--al);color:var(--azul);border-radius:6px;padding:2px 8px;font-weight:700;font-family:Nunito,sans-serif">a</span>';
  if(e==='x')return '<span style="background:var(--rl);color:var(--rojo);border-radius:6px;padding:2px 8px;font-weight:700;font-family:Nunito,sans-serif">x</span>';
  return '';
}

function celda(val,editable,key,idx,total){
  const bg=val===null?'#F8FAFC':'#fff';
  const inputStyle=`width:44px;border:1.5px solid var(--bd);border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit;background:${bg}`;
  if(!editable) return `<td style="text-align:center;padding:5px 4px;background:#F0F4F8;font-weight:700;color:var(--tx)">${val!==null?val:''}</td>`;
  return `<td style="padding:4px 3px;text-align:center"><input type="number" min="0" style="${inputStyle}" value="${val!==null?val:''}" onchange="updateAs(${idx},'${key}',this.value)"></td>`;
}

function calcAsist1(a){const s=(a.sep||0)+(a.oct||0);return s;}
function calcInasist1(a,tot){return (tot.sep||0)+(tot.oct||0)-calcAsist1(a);}
function calcAsist2(a){return (a.nov||0)+(a.dic||0)+(a.ene||0)+(a.feb||0);}
function calcInasist2(a,tot){return (tot.nov||0)+(tot.dic||0)+(tot.ene||0)+(tot.feb||0)-calcAsist2(a);}
function calcAsist3(a){return (a.mzo||0)+(a.abr||0)+(a.may||0)+(a.jun||0)+(a.jul||0);}
function calcInasist3(a,tot){return (tot.mzo||0)+(tot.abr||0)+(tot.may||0)+(tot.jun||0)+(tot.jul||0)-calcAsist3(a);}

function renderAsistencia(data){
  const alumnos=data.alumnos, tot=data.totales;
  const MESES=['sep','oct','nov','dic','ene','feb','mzo','abr','may','jun','jul'];
  const cellStyle='padding:5px 4px;text-align:center;border:1px solid #e2e8f0';
  const stickyA='position:sticky;left:0;background:#fff;z-index:1;padding:5px 8px;border:1px solid #e2e8f0;font-size:.75rem;font-weight:700;min-width:32px;text-align:center';
  const stickyB='position:sticky;left:40px;background:#fff;z-index:1;padding:5px 8px;border:1px solid #e2e8f0;font-size:.76rem;min-width:150px';

  document.getElementById('as-body').innerHTML=alumnos.map((a,i)=>{
    const in1=calcInasist1(a,tot),as1=calcAsist1(a);
    const in2=calcInasist2(a,tot),as2=calcAsist2(a);
    const in3=calcInasist3(a,tot),as3=calcAsist3(a);
    const rowBg=a.estado==='x'?'background:#FFF5F5':'';
    return `<tr style="${rowBg}">
      <td style="${stickyA}">${a.n}</td>
      <td style="${stickyB}">${a.nombre}</td>
      <td style="${cellStyle}"><input type="number" min="0" style="width:42px;border:1.5px solid var(--bd);border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit" value="${a.sep!==null?a.sep:''}" onchange="updateAs(${i},'sep',this.value)"></td>
      <td style="${cellStyle}"><input type="number" min="0" style="width:42px;border:1.5px solid var(--bd);border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit" value="${a.oct!==null?a.oct:''}" onchange="updateAs(${i},'oct',this.value)"></td>
      <td style="${cellStyle};background:#d1fae5;font-weight:700;color:#065f46">${in1>=0?in1:''}</td>
      <td style="${cellStyle};background:#d1fae5;font-weight:700;color:#065f46">${as1||''}</td>
      <td style="${cellStyle}"><input type="number" min="0" style="width:42px;border:1.5px solid var(--bd);border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit" value="${a.nov!==null?a.nov:''}" onchange="updateAs(${i},'nov',this.value)"></td>
      <td style="${cellStyle}"><input type="number" min="0" style="width:42px;border:1.5px solid var(--bd);border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit" value="${a.dic!==null?a.dic:''}" onchange="updateAs(${i},'dic',this.value)"></td>
      <td style="${cellStyle}"><input type="number" min="0" style="width:42px;border:1.5px solid var(--bd);border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit" value="${a.ene!==null?a.ene:''}" onchange="updateAs(${i},'ene',this.value)"></td>
      <td style="${cellStyle}"><input type="number" min="0" style="width:42px;border:1.5px solid var(--bd);border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit" value="${a.feb!==null?a.feb:''}" onchange="updateAs(${i},'feb',this.value)"></td>
      <td style="${cellStyle};background:#dbeafe;font-weight:700;color:#1e40af">${in2>=0?in2:''}</td>
      <td style="${cellStyle};background:#dbeafe;font-weight:700;color:#1e40af">${as2||''}</td>
      <td style="${cellStyle}"><input type="number" min="0" style="width:42px;border:1.5px solid var(--bd);border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit" value="${a.mzo!==null?a.mzo:''}" onchange="updateAs(${i},'mzo',this.value)"></td>
      <td style="${cellStyle}"><input type="number" min="0" style="width:42px;border:1.5px solid var(--bd);border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit" value="${a.abr!==null?a.abr:''}" onchange="updateAs(${i},'abr',this.value)"></td>
      <td style="${cellStyle}"><input type="number" min="0" style="width:42px;border:1.5px solid var(--bd);border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit" value="${a.may!==null?a.may:''}" onchange="updateAs(${i},'may',this.value)"></td>
      <td style="${cellStyle}"><input type="number" min="0" style="width:42px;border:1.5px solid var(--bd);border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit" value="${a.jun!==null?a.jun:''}" onchange="updateAs(${i},'jun',this.value)"></td>
      <td style="${cellStyle}"><input type="number" min="0" style="width:42px;border:1.5px solid var(--bd);border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit" value="${a.jul!==null?a.jul:''}" onchange="updateAs(${i},'jul',this.value)"></td>
      <td style="${cellStyle};background:#fce7d6;font-weight:700;color:#92400e">${in3>=0?in3:''}</td>
      <td style="${cellStyle};background:#fce7d6;font-weight:700;color:#92400e">${as3||''}</td>
      <td style="${cellStyle};text-align:center">
        <select onchange="updateAsEstado(${i},this.value)" style="border:1.5px solid var(--bd);border-radius:6px;padding:3px 5px;font-size:.78rem;font-family:inherit;background:#fff">
          <option value="o"${a.estado==='o'?' selected':''}>o</option>
          <option value="a"${a.estado==='a'?' selected':''}>a</option>
          <option value="x"${a.estado==='x'?' selected':''}>x</option>
        </select>
      </td>
      <td style="${cellStyle};text-align:center">
        <select onchange="updateAsSexo(${i},this.value)" style="border:1.5px solid #c4b5fd;border-radius:6px;padding:3px 5px;font-size:.78rem;font-family:inherit;background:#f5f3ff;color:#6D28D9;font-weight:700">
          <option value=""${!a.sexo?' selected':''}>–</option>
          <option value="H"${a.sexo==='H'?' selected':''}>H</option>
          <option value="M"${a.sexo==='M'?' selected':''}>M</option>
        </select>
      </td>
    </tr>`;
  }).join('');

  // Footer con totales
  const tot1=(tot.sep||0)+(tot.oct||0);
  const tot2=(tot.nov||0)+(tot.dic||0)+(tot.ene||0)+(tot.feb||0);
  const tot3=(tot.mzo||0)+(tot.abr||0)+(tot.may||0)+(tot.jun||0)+(tot.jul||0);
  const footStyle='background:#1B4F72;color:#fff;padding:6px 4px;text-align:center;font-weight:700;font-family:Nunito,sans-serif;font-size:.78rem;border:1px solid #163d5a';
  document.getElementById('as-foot').innerHTML=`<tr>
    <td style="${footStyle};position:sticky;left:0;z-index:2"></td>
    <td style="${footStyle};position:sticky;left:40px;z-index:2;text-align:left;min-width:150px">Total días clase</td>
    <td style="${footStyle}"><input type="number" min="0" style="width:42px;border:none;border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit;background:rgba(255,255,255,.2);color:#fff" value="${tot.sep!==null?tot.sep:''}" onchange="updateAsTot('sep',this.value)"></td>
    <td style="${footStyle}"><input type="number" min="0" style="width:42px;border:none;border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit;background:rgba(255,255,255,.2);color:#fff" value="${tot.oct!==null?tot.oct:''}" onchange="updateAsTot('oct',this.value)"></td>
    <td style="${footStyle}">${tot1}</td><td style="${footStyle}">${tot1}</td>
    <td style="${footStyle}"><input type="number" min="0" style="width:42px;border:none;border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit;background:rgba(255,255,255,.2);color:#fff" value="${tot.nov!==null?tot.nov:''}" onchange="updateAsTot('nov',this.value)"></td>
    <td style="${footStyle}"><input type="number" min="0" style="width:42px;border:none;border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit;background:rgba(255,255,255,.2);color:#fff" value="${tot.dic!==null?tot.dic:''}" onchange="updateAsTot('dic',this.value)"></td>
    <td style="${footStyle}"><input type="number" min="0" style="width:42px;border:none;border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit;background:rgba(255,255,255,.2);color:#fff" value="${tot.ene!==null?tot.ene:''}" onchange="updateAsTot('ene',this.value)"></td>
    <td style="${footStyle}"><input type="number" min="0" style="width:42px;border:none;border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit;background:rgba(255,255,255,.2);color:#fff" value="${tot.feb!==null?tot.feb:''}" onchange="updateAsTot('feb',this.value)"></td>
    <td style="${footStyle}">${tot2}</td><td style="${footStyle}">${tot2}</td>
    <td style="${footStyle}"><input type="number" min="0" style="width:42px;border:none;border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit;background:rgba(255,255,255,.2);color:#fff" value="${tot.mzo!==null?tot.mzo:''}" onchange="updateAsTot('mzo',this.value)"></td>
    <td style="${footStyle}"><input type="number" min="0" style="width:42px;border:none;border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit;background:rgba(255,255,255,.2);color:#fff" value="${tot.abr!==null?tot.abr:''}" onchange="updateAsTot('abr',this.value)"></td>
    <td style="${footStyle}"><input type="number" min="0" style="width:42px;border:none;border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit;background:rgba(255,255,255,.2);color:#fff" value="${tot.may!==null?tot.may:''}" onchange="updateAsTot('may',this.value)"></td>
    <td style="${footStyle}"><input type="number" min="0" style="width:42px;border:none;border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit;background:rgba(255,255,255,.2);color:#fff" value="${tot.jun!==null?tot.jun:''}" onchange="updateAsTot('jun',this.value)"></td>
    <td style="${footStyle}"><input type="number" min="0" style="width:42px;border:none;border-radius:6px;padding:3px 4px;text-align:center;font-size:.78rem;font-family:inherit;background:rgba(255,255,255,.2);color:#fff" value="${tot.jul!==null?tot.jul:''}" onchange="updateAsTot('jul',this.value)"></td>
    <td style="${footStyle}">${tot3}</td><td style="${footStyle}">${tot3}</td>
    <td style="${footStyle}"></td>
    <td style="background:#6D28D9;color:#fff;padding:6px 4px;text-align:center;font-weight:700;font-family:Nunito,sans-serif;font-size:.78rem;border:1px solid #5b21b6">
      👦${alumnos.filter(a=>a.sexo==='H').length} / 👧${alumnos.filter(a=>a.sexo==='M').length}
    </td>
  </tr>
  <tr>
    <td colspan="2" style="background:#6D28D9;color:#fff;padding:7px 10px;font-weight:800;font-family:Nunito,sans-serif;font-size:.82rem;border:1px solid #5b21b6;position:sticky;left:0;z-index:2">👦 Hombres: ${alumnos.filter(a=>a.sexo==='H').length} &nbsp;&nbsp; 👧 Mujeres: ${alumnos.filter(a=>a.sexo==='M').length} &nbsp;&nbsp; 📋 Total: ${alumnos.length}</td>
    <td colspan="19" style="background:#6D28D9;color:#fff;padding:7px 10px;font-family:Nunito,sans-serif;font-size:.78rem;border:1px solid #5b21b6"></td>
  </tr>`;
}

function updateAs(idx,key,val){
  let data=gAs()||{alumnos:[],totales:AS_TOTALES_DEFAULT};
  data.alumnos[idx][key]=val===''?null:parseInt(val);
  window.sAs(data);
  renderAsistencia(data);
}
function updateAsEstado(idx,val){
  let data=gAs()||{alumnos:[],totales:AS_TOTALES_DEFAULT};
  data.alumnos[idx].estado=val;
  window.sAs(data);
  renderAsistencia(data);
}
function updateAsSexo(idx,val){
  let data=gAs()||{alumnos:[],totales:AS_TOTALES_DEFAULT};
  data.alumnos[idx].sexo=val;
  window.sAs(data);
  renderAsistencia(data);
}
function updateAsTot(key,val){
  let data=gAs()||{alumnos:[],totales:AS_TOTALES_DEFAULT};
  data.totales[key]=val===''?null:parseInt(val);
  window.sAs(data);
  renderAsistencia(data);
}
function guardarAsistencia(){
  let data=gAs()||{alumnos:[],totales:AS_TOTALES_DEFAULT};
  window.sAs(data);
  alert('✅ Asistencia guardada correctamente.');
}
function exportarAsistencia(){
  let data=gAs()||{alumnos:[],totales:AS_TOTALES_DEFAULT};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='asistencia_diana.json';a.click();
  URL.revokeObjectURL(url);
}

// ─── ALUMNOS ───
function renderAl(){
  const al=gAl();
  document.getElementById('al-list').innerHTML=al.map((a,i)=>
    `<li class="atag">${esc(a)} <button aria-label="Eliminar a ${esc(a)}" onclick="delAl(${i})">✕</button></li>`).join('');
  document.getElementById('al-cnt').textContent=al.length?`${al.length} alumno${al.length>1?'s':''} registrado${al.length>1?'s':''}.`:'Sin alumnos registrados.';
  const sel=document.getElementById('s-al'),cur=new Set(Array.from(sel.selectedOptions||[]).map(o=>o.value));
  sel.innerHTML='<option value="">— Selecciona —</option>'+al.map(a=>`<option value="${esc(a)}"${cur.has(a)?' selected':''}>${esc(a)}</option>`).join('');
  const selOb=document.getElementById('ob-al');
  if(selOb){
    const curOb=selOb.value;
    selOb.innerHTML='<option value="">— Selecciona —</option>'+al.map(a=>`<option value="${esc(a)}"${a===curOb?' selected':''}>${esc(a)}</option>`).join('');
  }
}
function addAl(){
  const inp=document.getElementById('al-inp'),n=inp.value.trim();
  if(!n)return;
  const al=gAl();
  if(al.includes(n)){alert('Ese alumno ya está en la lista.');return;}
  al.push(n);window.sAl(al);inp.value='';renderAl();
}
function delAl(i){
  const al=gAl();
  if(!confirm(`¿Eliminar a "${al[i]}"?`))return;
  al.splice(i,1);window.sAl(al);renderAl();
}

// ─── FORM ───
// Estado: por campo, array de filas [{cont, pdaIdx, nivel}]
CK.forEach(k=>{estado[k]=[]});

function buildForm(){
  const w=document.getElementById('campos-wrap');
  w.innerHTML='';
  CK.forEach(k=>{
    estado[k]=[{cont:null,pdaIdx:null,nivel:null}]; // empezar con 1 fila
    renderCampo(k);
  });
  onEvAlumnoChange();
}
function getSelectedAlumnos(){
  const sel=document.getElementById('s-al');
  return sel ? Array.from(sel.selectedOptions).map(o=>o.value).filter(Boolean) : [];
}

function onEvAlumnoChange(){
  const alumnos=getSelectedAlumnos();
  const al=alumnos[0]||'';
  const wrap=document.getElementById('ev-rec-wrap');
  if(!wrap)return;
  if(!al){wrap.innerHTML='';return;}
  wrap.innerHTML=recBoxHTML('ev',al);
  pintarRecList('ev',al);
}

function renderCampo(k){
  const w=document.getElementById('campos-wrap');
  const m=CMETA[k];
  const conts=D[k];
  const contOpts=conts.map((c,i)=>`<option value="${i}">${c.nombre}</option>`).join('');

  // Eliminar card existente si hay
  const old=document.getElementById(`card-${k}`);
  if(old) old.remove();

  const div=document.createElement('div');
  div.className='cc';
  div.id=`card-${k}`;

  // Filas actuales
  const filasHTML=estado[k].map((fila,fi)=>`
    <div class="fila-eval" id="fila-${k}-${fi}" style="border:1.5px solid var(--bd);border-radius:10px;padding:10px;margin-bottom:8px;position:relative">
      ${estado[k].length>1?`<button onclick="delFila('${k}',${fi})" style="position:absolute;top:6px;right:8px;background:none;border:none;color:#94A3B8;font-size:1rem;cursor:pointer;line-height:1" title="Eliminar">✕</button>`:''}
      <div style="margin-bottom:8px">
        <div class="fl">Contenido</div>
        <select class="sc" id="c-${k}-${fi}" onchange="onCont('${k}',${fi})">
          <option value="">— Selecciona contenido —</option>${contOpts}
        </select>
      </div>
      <div style="margin-bottom:8px">
        <div class="fl">Proceso de Desarrollo y Aprendizaje</div>
        <select class="sc" id="p-${k}-${fi}">
          <option value="">— Selecciona primero el contenido —</option>
        </select>
      </div>
      <div>
        <div class="fl">Nivel de Desempeño</div>
        <div class="nv-row">
          <button class="nv-btn" id="nb-${k}-${fi}-1" onclick="setNivel('${k}',${fi},1)">1<small>Req. apoyo</small></button>
          <button class="nv-btn" id="nb-${k}-${fi}-2" onclick="setNivel('${k}',${fi},2)">2<small>En proceso</small></button>
          <button class="nv-btn" id="nb-${k}-${fi}-3" onclick="setNivel('${k}',${fi},3)">3<small>Esperado</small></button>
        </div>
        <div class="nv-result" id="nr-${k}-${fi}"></div>
      </div>
    </div>`).join('');

  div.innerHTML=`
    <div class="cc-head" style="background:${m.color}">${m.emoji} ${m.label}</div>
    <div class="cc-body">
      <div id="filas-${k}">${filasHTML}</div>
      <button onclick="addFila('${k}')" style="width:100%;padding:8px;border:2px dashed ${m.color};border-radius:9px;background:none;color:${m.color};font-family:Nunito,sans-serif;font-weight:700;font-size:.83rem;cursor:pointer;margin-top:4px">+ Agregar otro contenido</button>
    </div>`;
  w.appendChild(div);

  // Restaurar selects si ya tenían valor
  estado[k].forEach((fila,fi)=>{
    if(fila.cont!==null){
      const cSel=document.getElementById(`c-${k}-${fi}`);
      if(cSel){cSel.value=fila.cont; onCont(k,fi,true);}
      if(fila.pdaIdx!==null){
        const pSel=document.getElementById(`p-${k}-${fi}`);
        if(pSel) pSel.value=fila.pdaIdx;
      }
      if(fila.nivel) setNivel(k,fi,fila.nivel,true);
    }
  });
}

function addFila(k){
  estado[k].push({cont:null,pdaIdx:null,nivel:null});
  renderCampo(k);
  // Scroll a la nueva fila
  const card=document.getElementById(`card-${k}`);
  if(card) card.scrollIntoView({behavior:'smooth',block:'end'});
}

function delFila(k,fi){
  estado[k].splice(fi,1);
  renderCampo(k);
}

function onCont(k,fi,restore=false){
  const idx=document.getElementById(`c-${k}-${fi}`)?.value;
  if(!restore){
    estado[k][fi].cont=idx===''?null:parseInt(idx);
    estado[k][fi].pdaIdx=null;
    estado[k][fi].nivel=null;
    [1,2,3].forEach(n=>{ const b=document.getElementById(`nb-${k}-${fi}-${n}`); if(b)b.className='nv-btn'; });
    const nr=document.getElementById(`nr-${k}-${fi}`); if(nr){nr.className='nv-result';nr.innerHTML='';}
  }
  const pSel=document.getElementById(`p-${k}-${fi}`);
  if(!pSel) return;
  if(!idx||idx===''){pSel.innerHTML='<option value="">— Selecciona primero el contenido —</option>';return;}
  const np=GRADO_NP[gradoActual];
  const allPdas=D[k][parseInt(idx)].pdas;
  const pdas=allPdas.filter(p=>p.nivel_proceso===np);
  if(pdas.length===0){pSel.innerHTML='<option value="">— Sin PDAs para este grado —</option>';return;}
  pSel.innerHTML='<option value="">— Selecciona PDA —</option>'+
    pdas.map(p=>{const origIdx=allPdas.indexOf(p);return`<option value="${origIdx}">${p.texto}</option>`;}).join('');
}

function onPDA(k,fi){
  const pSel=document.getElementById(`p-${k}-${fi}`);
  if(!pSel) return;
  const pIdx=pSel.value;
  estado[k][fi].pdaIdx=pIdx===''?null:parseInt(pIdx);
  if(estado[k][fi].nivel) setNivel(k,fi,estado[k][fi].nivel);
}

function setNivel(k,fi,n,restore=false){
  estado[k][fi].nivel=n;
  [1,2,3].forEach(i=>{ const b=document.getElementById(`nb-${k}-${fi}-${i}`); if(b)b.className='nv-btn'; });
  const btn=document.getElementById(`nb-${k}-${fi}-${n}`);
  if(btn)btn.className=`nv-btn s${n}`;

  let texto='';
  const contIdx=estado[k][fi].cont;
  // Leer pdaIdx del estado o del select (por si no se actualizó)
  let pdaIdx=estado[k][fi].pdaIdx;
  if(pdaIdx===null){
    const pSel=document.getElementById(`p-${k}-${fi}`);
    if(pSel && pSel.value!=='') pdaIdx=parseInt(pSel.value);
  }

  if(contIdx!==null && pdaIdx!==null){
    const pda=D[k][contIdx].pdas[pdaIdx];
    if(pda) texto=pda[String(n)]||'';
  } else if(contIdx!==null){
    // Sin PDA seleccionado: mostrar texto genérico del nivel, no de un PDA específico
    texto='';
  }

  const nr=document.getElementById(`nr-${k}-${fi}`);
  if(!nr) return;
  if(!texto){
    const gen={1:'Requiere apoyo constante del docente para alcanzar los aprendizajes esperados.',
               2:'Avanza hacia los aprendizajes esperados con orientación del docente.',
               3:'Alcanza los aprendizajes esperados de manera autónoma.'};
    texto=gen[n];
  }
  nr.className=`nv-result show ${NR[n]}`;
  nr.innerHTML=`<strong>${NE[n]} ${NL[n]}:</strong> ${texto}`;
}

function limpiar(){
  CK.forEach(k=>{
    estado[k]=[{cont:null,pdaIdx:null,nivel:null}];
    renderCampo(k);
  });
}

function guardar(){
  const alumnos=getSelectedAlumnos();
  const mes=document.getElementById('s-mes').value;
  if(!alumnos.length){alert('Selecciona al menos un alumno antes de guardar.');return;}
  const campos={};
  CK.forEach(k=>{
    campos[k]=estado[k].map(fila=>{
      const contIdx=fila.cont;
      const pdaIdx=fila.pdaIdx;
      const niv=fila.nivel;
      const contNombre=contIdx!==null?D[k][contIdx].nombre:'';
      const pdaTxt=contIdx!==null&&pdaIdx!==null?D[k][contIdx].pdas[pdaIdx].texto:'';
      let nivelTxt='';
      if(contIdx!==null&&pdaIdx!==null&&niv) nivelTxt=D[k][contIdx].pdas[pdaIdx][String(niv)]||'';
      return{cont:contNombre,pda:pdaTxt,niv:niv?String(niv):'',nivelTxt};
    }).filter(f=>f.cont||f.pda||f.niv);
  });
  const evs=gEv();
  alumnos.forEach(al=>evs.push({al,mes,grado:gradoActual,fecha:new Date().toLocaleDateString('es-MX'),id:Date.now()+Math.floor(Math.random()*100000),campos:JSON.parse(JSON.stringify(campos))}));
  window.sEv(evs);
  alert(`✅ Evaluación guardada para ${alumnos.length} alumno${alumnos.length>1?'s':''}.`);
  limpiar();
}

// ─── RESUMEN ───
function buildRS(){
  const evs=gEv();
  const c=document.getElementById('rs-cont');
  if(!evs.length){c.innerHTML='<p class="nd">Aún no hay evaluaciones guardadas.</p>';return;}
  const por={};
  evs.forEach(e=>{if(!por[e.al])por[e.al]=[];por[e.al].push(e);});
  let h='';
  Object.entries(por).forEach(([al,list],idx)=>{
    h+=`<div class="al-g"><div class="al-n">👤 ${esc(al)}<span class="al-c">${list.length} evaluación${list.length>1?'es':''}</span></div><div class="ev-list">`;
    list.forEach(ev=>{
      const badges=CK.map(k=>{
        const filas=Array.isArray(ev.campos[k])?ev.campos[k]:[ev.campos[k]].filter(Boolean);
        const niveles=filas.map(f=>f?.niv).filter(n=>n&&n!=='');
        const n=niveles.length>0?niveles[0]:null;
        if(!n)return`<span class="ebadge bn">${CMETA[k].emoji} —</span>`;
        return`<span class="ebadge ${NB[n]}">${CMETA[k].emoji} ${NE[n]} ${NL[n]}</span>`;
      }).join('');
      h+=`<div class="ev-item" onclick="openModal(${ev.id})">
        <div class="ev-h" style="position:relative"><div class="ev-hl">📅 ${esc(ev.mes)}</div><div class="ev-hr">${esc(ev.fecha)} · ver detalle →</div><button onclick="event.stopPropagation();borrarUna(${ev.id})" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:7px;padding:3px 8px;font-size:.75rem;cursor:pointer;font-family:Nunito,sans-serif;font-weight:700" title="Eliminar esta evaluación">🗑</button></div>
        <div class="ev-prev">${badges}</div>
      </div>`;
    });
    h+=`</div>`;
    h+=`</div>`;
  });
  c.innerHTML=h;
}

function openModal(id){
  const ev=gEv().find(e=>e.id===id);
  if(!ev)return;
  const gradoLabel=ev.grado?`${ev.grado}° Preescolar`:'';
  document.getElementById('m-title').textContent=`${ev.al} · ${ev.mes}${gradoLabel?' · '+gradoLabel:''} · ${ev.fecha}`;
  let h='';
  CK.forEach(k=>{
    // Normalizar siempre a array
    let filas=[];
    if(Array.isArray(ev.campos[k])){
      filas=ev.campos[k];
    } else if(ev.campos[k] && typeof ev.campos[k]==='object'){
      filas=[ev.campos[k]];
    }
    // Filtrar filas que tengan al menos algún dato
    filas=filas.filter(f=>f && (f.cont||f.pda||f.niv));
    if(!filas.length) return;
    const m=CMETA[k];
    h+=`<div class="mc"><div class="mch" style="background:${m.color}">${m.emoji} ${m.label}</div><div class="mcb">`;
    filas.forEach((f,fi)=>{
      const n=f.niv||'';
      const nb=n?`<span class="mnb ${NB[n]||''}">${NE[n]||''} ${NL[n]||n}</span>`:'<span style="color:#94A3B8">Sin evaluar</span>';
      if(filas.length>1) h+=`<div style="font-family:Nunito,sans-serif;font-weight:800;font-size:.72rem;color:#94A3B8;margin:${fi>0?'10px':0} 0 6px;border-top:${fi>0?'1px solid #EEF2F7':''};padding-top:${fi>0?'10px':'0'}">— Registro ${fi+1} —</div>`;
      if(f.cont) h+=`<div class="mr"><div class="ml">Contenido</div><div class="mv">${esc(f.cont)}</div></div>`;
      // Usar datos guardados; fallback solo si ambos están vacíos
      let pdaMostrar=f.pda||'';
      let nivelMostrar=f.nivelTxt||'';
      if(!pdaMostrar && !nivelMostrar && f.cont && n){
        const np=ev.grado?GRADO_NP[ev.grado]:'III';
        for(const cont of (D[k]||[])){
          if(cont.nombre===f.cont){
            const pdas=cont.pdas.filter(p=>p.nivel_proceso===np);
            if(pdas.length>0){
              pdaMostrar=pdas[0].texto;
              nivelMostrar=pdas[0][n]||'';
            }
            break;
          }
        }
      }
      if(pdaMostrar) h+=`<div class="mr"><div class="ml">Proceso de Desarrollo y Aprendizaje</div><div class="mv">${esc(pdaMostrar)}</div></div>`;
      if(nivelMostrar) h+=`<div class="mr"><div class="ml">Observaciones</div><div class="mv" style="font-style:italic;color:#475569;background:#F8FAFC;padding:8px 10px;border-radius:7px;border-left:3px solid ${CMETA[k].color}">${esc(nivelMostrar)}</div></div>`;
    });
    h+=`</div></div>`;
  });
  if(!h) h='<p style="color:#94A3B8;text-align:center;padding:20px">Esta evaluación no tiene datos registrados.</p>';
  h+=recListStaticHTML(ev.al);
  // Agregar nombre al final
  h+=`<div style="margin-top:20px;padding:14px 18px;border-top:2px solid #DDE3ED;text-align:center">
    <div style="font-family:Nunito,sans-serif;font-weight:800;font-size:.9rem;color:#1B4F72">Lic. Diana Evelyn Ramírez Lara</div>
    <div style="font-size:.75rem;color:#64748B;margin-top:2px">Docente de Educación Preescolar</div>
  </div>`;
  document.getElementById('m-body').innerHTML=h;
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow='hidden';
}
function cModal(e){if(e.target===document.getElementById('modal'))closeModal();}
function closeModal(){document.getElementById('modal').classList.remove('open');document.body.style.overflow='';}
function borrarTodo(){if(!confirm('¿Borrar todas las evaluaciones?'))return;window.sEv([]);buildRS();}
function borrarUna(id){if(!confirm('¿Eliminar esta evaluación?'))return;window.sEv(gEv().filter(e=>e.id!==id));buildRS();}

function exportarJSON(){
  const datos={alumnos:gAl(),evaluaciones:gEv(),observaciones:gObs(),recomendaciones:gRec()};
  const blob=new Blob([JSON.stringify(datos,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  const fecha=new Date().toLocaleDateString('es-MX').replace(/\//g,'-');
  a.href=url;a.download=`respaldo_evaluaciones_${fecha}.json`;
  a.click();URL.revokeObjectURL(url);
}

function importarJSON(e){
  const file=e.target.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=function(ev){
    try{
      const datos=JSON.parse(ev.target.result);
      if(!datos.evaluaciones)throw new Error('Formato inválido');
      const evActuales=gEv();
      const alActuales=gAl();
      const obActuales=gObs();
      // Merge: evitar duplicados por id
      const idsActuales=new Set(evActuales.map(e=>e.id));
      const nuevasEvs=datos.evaluaciones.filter(e=>!idsActuales.has(e.id));
      const idsObActuales=new Set(obActuales.map(o=>o.id));
      const nuevasObs=(datos.observaciones||[]).filter(o=>!idsObActuales.has(o.id));
      const todosAl=[...new Set([...alActuales,...(datos.alumnos||[])])];
      window.sAl(todosAl);
      window.sEv([...evActuales,...nuevasEvs]);
      window.sObs([...obActuales,...nuevasObs]);
      sRec({...gRec(),...(datos.recomendaciones||{})});
      renderAl();buildRS();buildOb();
      alert(`✅ Importado: ${nuevasEvs.length} evaluación(es) nueva(s), ${nuevasObs.length} observación(es) nueva(s) y ${todosAl.length} alumno(s).`);
    }catch(err){
      alert('❌ Archivo inválido. Asegúrate de usar un respaldo exportado desde esta app.');
    }
    e.target.value='';
  };
  reader.readAsText(file);
}

// ─── GRADO ───
let gradoActual = 3; // default 3°

function setGrado(g){
  gradoActual = g;
  // Actualizar botones
  [1,2,3].forEach(i=>{
    const b=document.getElementById('g'+i);
    if(!b)return;
    if(i===g){
      b.style.background='#7EDCB0';b.style.color='#1B4F72';
    } else {
      b.style.background='transparent';b.style.color='#7EDCB0';
    }
  });
  document.getElementById('grado-label').textContent=`· Mostrando PDAs de ${g}° Preescolar`;
  // Reconstruir form con nuevo grado
  buildForm();
}

const GRADO_NP = {1:'I', 2:'II', 3:'III'};


// Dynamic sticky positioning
function updateStickyHeights(){
  const header=document.querySelector('header');
  const gradoBar=document.getElementById('grado-bar');
  const hH=header?header.offsetHeight:76;
  const gH=gradoBar?gradoBar.offsetHeight:44;
  document.documentElement.style.setProperty('--header-h', hH+'px');
  document.documentElement.style.setProperty('--tabs-top', (hH+gH)+'px');
}
updateStickyHeights();
window.addEventListener('resize', updateStickyHeights);

renderAl();
buildForm();
