function crearBloqueImpresion(titulo,cuerpo,logo){
  const holder=document.createElement('div');
  holder.innerHTML=cuerpo;
  const cards=Array.from(holder.children).filter(el=>el.classList.contains('mc'));
  // Las observaciones escritas no se imprimen; las recomendaciones sí se conservan.
  const otros=Array.from(holder.children).filter(el=>!el.classList.contains('mc')&&!el.classList.contains('print-observations'));
  const tarjetas=cards.map(el=>el.outerHTML).join('');
  let resto=otros.map(el=>el.outerHTML).join('');
  // Respaldo: si el detalle no trae el bloque, recuperarlo directamente del alumno.
  if(!holder.querySelector('.rec-box .rec-item') && typeof recListStaticHTML==='function'){
    const alumno=String(titulo).split(' · ')[0].trim();
    resto+=recListStaticHTML(alumno);
  }
  return `<section class="print-sheet"><div class="print-header">
    <div><div class="print-title">Evaluación Preescolar</div><div class="print-subtitle">${esc(titulo)}</div></div>
    ${logo ? `<img class="print-logo" src="${logo}" alt="Logo de libélula">` : ''}
  </div><div class="print-grid">${tarjetas}</div>${resto}</section>`;
}

function imprimirEval(){
  const titulo=document.getElementById('m-title').textContent;
  const cuerpo=document.getElementById('m-body').innerHTML;
  const pa=document.getElementById('print-area');
  const logo=document.querySelector('header img[alt="libélula"]')?.src||'';
  pa.innerHTML=crearBloqueImpresion(titulo,cuerpo,logo);
  imprimirCuandoListo(pa);
}

function imprimirPorId(id){
  if(typeof openModal!=='function')return;
  openModal(id);
  imprimirEval();
  closeModal();
}

function imprimirFechaEval(){
  const fecha=document.getElementById('print-fecha')?.value||'';
  if(!fecha){alert('Selecciona una fecha antes de imprimir.');return;}
  const evaluaciones=typeof gEv==='function'?gEv().filter(ev=>ev.fecha===fecha):[];
  if(!evaluaciones.length){alert('No hay evaluaciones guardadas para esa fecha.');return;}
  imprimirListaEvaluaciones(evaluaciones);
}

function imprimirTodasEval(){
  const evaluaciones=typeof gEv==='function'?gEv():[];
  imprimirListaEvaluaciones(evaluaciones);
}

function imprimirMesEval(){
  const mes=document.getElementById('print-mes')?.value||'Todos';
  const evaluaciones=typeof gEv==='function'?gEv():[];
  const filtradas=mes==='Todos'?evaluaciones:evaluaciones.filter(ev=>ev.mes===mes);
  if(!filtradas.length){alert(`No hay evaluaciones guardadas de ${mes}.`);return;}
  imprimirListaEvaluaciones(filtradas);
}

function imprimirListaEvaluaciones(evaluaciones){
  if(!evaluaciones.length){alert('Aún no hay evaluaciones guardadas para imprimir.');return;}
  const logo=document.querySelector('header img[alt="libélula"]')?.src||'';
  const pa=document.getElementById('print-area');
  pa.innerHTML='';
  evaluaciones.forEach(ev=>{
    openModal(ev.id);
    const titulo=document.getElementById('m-title').textContent;
    const cuerpo=document.getElementById('m-body').innerHTML;
    pa.insertAdjacentHTML('beforeend',crearBloqueImpresion(titulo,cuerpo,logo));
    closeModal();
  });
  imprimirCuandoListo(pa);
}

function imprimirCuandoListo(pa){
  const imagenes=Array.from(pa.querySelectorAll('.print-logo')).filter(img=>!img.complete);
  if(imagenes.length){
    let pendientes=imagenes.length;
    const terminar=()=>{if(--pendientes===0)window.print();};
    imagenes.forEach(img=>{img.onload=terminar;img.onerror=terminar;});
  }else window.print();
}
