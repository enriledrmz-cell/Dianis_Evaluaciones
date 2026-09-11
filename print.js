function imprimirEval(){
  const titulo = document.getElementById('m-title').textContent;
  const cuerpo = document.getElementById('m-body').innerHTML;
  const pa = document.getElementById('print-area');
  pa.innerHTML = '<div class="print-header"><div><div class="print-title">📋 Evaluación Preescolar</div><div class="print-subtitle">' + titulo + '</div></div></div>' + cuerpo;
  window.print();
}
