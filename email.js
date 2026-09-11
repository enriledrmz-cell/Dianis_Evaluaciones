// ─── EMAIL ───
function openEmailModal(){
  const evs=gEv();
  if(!evs.length){alert('No hay evaluaciones guardadas para enviar.');return;}
  document.getElementById('email-modal').classList.add('open');
  document.body.style.overflow='hidden';
  document.getElementById('email-status').innerHTML='';
}
function closeEmailModal(){document.getElementById('email-modal').classList.remove('open');document.body.style.overflow='';}
function cEmailModal(e){if(e.target===document.getElementById('email-modal'))closeEmailModal();}

async function enviarResumen(){
  const email=document.getElementById('email-inp').value.trim();
  if(!email||!email.includes('@')){
    document.getElementById('email-status').innerHTML='<span style="color:var(--rojo)">⚠️ Ingresa un correo válido.</span>';
    return;
  }
  const evs=gEv();
  if(!evs.length){document.getElementById('email-status').innerHTML='<span style="color:var(--rojo)">No hay evaluaciones guardadas.</span>';return;}

  // Build text summary
  let resumen='📋 RESUMEN DE EVALUACIONES - Diana\n';
  resumen+='='.repeat(50)+'\n\n';
  const por={};
  evs.forEach(e=>{if(!por[e.al])por[e.al]=[];por[e.al].push(e);});
  Object.entries(por).forEach(([al,list])=>{
    resumen+=`👤 ALUMNO: ${al}\n`;
    resumen+='-'.repeat(40)+'\n';
    list.forEach(ev=>{
      resumen+=`\n📅 ${ev.mes} ${ev.grado?'· '+ev.grado+'° Preescolar':''} · ${ev.fecha}\n`;
      CK.forEach(k=>{
        const filas=Array.isArray(ev.campos[k])?ev.campos[k]:[ev.campos[k]].filter(Boolean);
        filas.forEach(f=>{
          if(!f||(!f.cont&&!f.niv))return;
          resumen+=`\n  🔹 ${CMETA[k].label}\n`;
          if(f.cont) resumen+=`     Contenido: ${f.cont}\n`;
          if(f.pda) resumen+=`     PDA: ${f.pda}\n`;
          if(f.niv) resumen+=`     Nivel: ${NL[f.niv]||f.niv}\n`;
          if(f.nivelTxt) resumen+=`     Descripción: ${f.nivelTxt}\n`;
        });
      });
    });
    resumen+='\n'+'='.repeat(50)+'\n\n';
  });

  const obs=gObs();
  if(obs.length){
    resumen+='📝 OBSERVACIONES\n';
    resumen+='='.repeat(50)+'\n\n';
    const porOb={};
    obs.forEach(o=>{if(!porOb[o.al])porOb[o.al]=[];porOb[o.al].push(o);});
    Object.entries(porOb).forEach(([al,list])=>{
      resumen+=`👤 ALUMNO: ${al}\n`;
      resumen+='-'.repeat(40)+'\n';
      list.forEach(o=>{
        resumen+=`\n📅 ${o.fecha}\n  ${o.txt}\n`;
      });
      resumen+='\n';
    });
    resumen+='='.repeat(50)+'\n\n';
  }

  const st=document.getElementById('email-status');
  st.innerHTML='<span style="color:var(--azul)">⏳ Generando y enviando...</span>';

  try{
    await navigator.clipboard.writeText(resumen);
    st.innerHTML=`<div style="background:var(--vl);border:1.5px solid #86EFAC;border-radius:9px;padding:12px;color:var(--verde);font-size:.85rem;line-height:1.6">✅ Resumen preparado para <strong>${esc(email)}</strong> y copiado al portapapeles.</div>
    <div style="margin-top:10px;padding:10px;background:#F1F5F9;border-radius:8px;font-size:.78rem;color:#64748B">Abre tu correo, pega el contenido y envíatelo. Para conservar todos los datos entre dispositivos, usa <strong>Exportar respaldo</strong> e <strong>Importar respaldo</strong>.</div>`;
  }catch(err){
    st.innerHTML=`<div style="background:var(--nl);border:1.5px solid #FCD34D;border-radius:9px;padding:10px;color:var(--nar);font-size:.85rem">No se pudo acceder al portapapeles. Puedes exportar un respaldo JSON o copiar el resumen manualmente.</div>`;
  }
}
