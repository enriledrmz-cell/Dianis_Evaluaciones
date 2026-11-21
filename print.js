function imprimirEval(){
  const titulo = document.getElementById('m-title').textContent;
  const cuerpo = document.getElementById('m-body').innerHTML;
  const pa = document.getElementById('print-area');
  const logo = document.querySelector('header img[alt="libélula"]')?.src || '';
  pa.innerHTML = `<div class="print-header">
    ${logo ? `<img class="print-logo" src="${logo}" alt="Logo de libélula">` : ''}
    <div><div class="print-title">Evaluación Preescolar</div><div class="print-subtitle">${esc(titulo)}</div></div>
  </div>${cuerpo}`;
  // Esperar a que el logo termine de cargar antes de abrir el diálogo de impresión.
  const img=pa.querySelector('.print-logo');
  if(img && !img.complete){img.onload=()=>window.print();img.onerror=()=>window.print();}
  else window.print();
}
