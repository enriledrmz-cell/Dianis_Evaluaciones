function crearBloqueImpresion(titulo,cuerpo,logo){
  const holder=document.createElement('div');
  holder.innerHTML=cuerpo;
  const cards=Array.from(holder.children).filter(el=>el.classList.contains('mc'));
  const observaciones=Array.from(holder.children).filter(el=>el.classList.contains('print-observations'));
  const otros=Array.from(holder.children).filter(el=>!el.classList.contains('mc')&&!el.classList.contains('print-observations'));
  const tarjetas=cards.map(el=>el.outerHTML).join('');
  const obs=observaciones.map(el=>el.outerHTML).join('');
  const resto=otros.map(el=>el.outerHTML).join('');
  return `<section class="print-sheet"><div class="print-header">
    <div><div class="print-title">Evaluación Preescolar</div><div class="print-subtitle">${esc(titulo)}</div></div>
    ${logo ? `<img class="print-logo" src="${logo}" alt="Logo de libélula">` : ''}
  </div><div class="print-grid">${tarjetas}</div>${obs}${resto}</section>`;
}

function imprimirEval(){
  const titulo=document.getElementById('m-title').textContent;
  const cuerpo=document.getElementById('m-body').innerHTML;
  const pa=document.getElementById('print-area');
  const logo=document.querySelector('header img[alt="libélula"]')?.src||'';
  pa.innerHTML=crearBloqueImpresion(titulo,cuerpo,logo);
  imprimirCuandoListo(pa);
}

function imprimirTodasEval(){
  const evaluaciones=typeof gEv==='function'?gEv():[];
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
