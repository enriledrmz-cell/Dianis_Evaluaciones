function getLogoParaImpresion(){
  const visible=document.querySelector('header .hico img');
  return visible?.getAttribute('src') || (typeof LOGO_MAESTRA_B64!=='undefined'?LOGO_MAESTRA_B64:'');
}
function imprimirEval(){
  const titulo = document.getElementById('m-title').textContent;
  const cuerpo = document.getElementById('m-body').innerHTML;
  const pa = document.getElementById('print-area');
  pa.innerHTML = '<div class="print-header"><div><div class="print-title">📋 Evaluación Preescolar</div><div class="print-subtitle">' + titulo + '</div></div><img src="' + getLogoParaImpresion() + '" class="print-logo" alt="Libélula"></div>' + cuerpo;
  window.print();
}
