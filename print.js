function imprimirEval(){
  const titulo = document.getElementById('m-title').textContent;
  const cuerpo = document.getElementById('m-body').innerHTML;
  const pa = document.getElementById('print-area');
  pa.innerHTML = '<div class="print-header"><div><div class="print-title">📋 Evaluación Preescolar</div><div class="print-subtitle">' + titulo + '</div></div><img src="' + (typeof LOGO_MAESTRA_B64!=='undefined'?LOGO_MAESTRA_B64:'') + '" class="print-logo" alt=""></div>' + cuerpo;
  window.print();
}
