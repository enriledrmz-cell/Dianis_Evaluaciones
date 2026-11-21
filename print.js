function imprimirEval(){
  const titulo = document.getElementById('m-title').textContent;
  const cuerpo = document.getElementById('m-body').innerHTML;
  const pa = document.getElementById('print-area');
  const logo = document.querySelector('header img[alt="libélula"]')?.src || '';

  const holder=document.createElement('div');
  holder.innerHTML=cuerpo;
  const cards=Array.from(holder.children).filter(el=>el.classList.contains('mc'));
  const observaciones=Array.from(holder.children).filter(el=>el.classList.contains('print-observations'));
  const otros=Array.from(holder.children).filter(el=>!el.classList.contains('mc')&&!el.classList.contains('print-observations'));
  const tarjetas=cards.map(el=>el.outerHTML).join('');
  const obs=observaciones.map(el=>el.outerHTML).join('');
  const resto=otros.map(el=>el.outerHTML).join('');

  pa.innerHTML = `<div class="print-header">
    <div><div class="print-title">Evaluación Preescolar</div><div class="print-subtitle">${esc(titulo)}</div></div>
    ${logo ? `<img class="print-logo" src="${logo}" alt="Logo de libélula">` : ''}
  </div>
  <div class="print-grid">${tarjetas}</div>${obs}${resto}`;

  const img=pa.querySelector('.print-logo');
  if(img && !img.complete){img.onload=()=>window.print();img.onerror=()=>window.print();}
  else window.print();
}
