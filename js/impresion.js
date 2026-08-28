// ═══════════════════════════════════════════════
// IMPRESION.JS — Generación e impresión del PDF
// (tamaño carta, una sola página, con bono y color)
// ═══════════════════════════════════════════════

const PRINT_BLUE = '#155C9E'; // único azul usado en toda la hoja impresa

// ── FUNCIONES DEL MODAL ──
function abrirModal(id) { document.getElementById(id).classList.add('active'); }
function cerrarModal(id) { document.getElementById(id).classList.remove('active'); }
function ejecutarImpresion() { window.print(); }

async function compartirDoc() {
  if (!navigator.share) { alert('Usa la opción de imprimir para guardar o compartir como PDF.'); return; }
  try {
    await navigator.share({
      title: `Cotización Yamaha — ${state.moto.modelo}`,
      text: `Cotización para ${state.moto.modelo} en De Los Ángeles Motor's Tehuacán.`
    });
  } catch (e) { /* el usuario canceló el compartir: no hay nada que hacer */ }
}

// Una fila "etiqueta / valor" de la hoja impresa (evita repetir el
// mismo bloque de estilos más de 10 veces en la plantilla).
function filaImpresion(label, valorHtml, destacado = false) {
  return `<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid #e8e8e8;">
    <span style="color:#555;">${label}</span>
    <span style="font-weight:bold;${destacado ? `color:${PRINT_BLUE};` : ''}">${valorHtml}</span>
  </div>`;
}

// ── GENERAR Y MOSTRAR EL PDF EN EL MODAL ──
async function generarPDF() {
  hideInput();
  await typing(700);
  await addBubble('Cotización generada. Abriendo vista previa...', 'agent');

  const pL = state.moto.precio;
  const eng = state.enganche || engMin(pL);
  const bono = state.moto.bono || 0;
  const color = state.moto.colorSeleccionado || 'Serie';
  const asesor = state.asesor || 'Atención en Piso';

  const pBaseContado = pContadoBase(pL);
  const pFinalContado = pContado(pL, bono);
  const saldo = pL - eng;
  const m3 = mensual3(pL, eng), m6 = mensualN(pL, eng, 6), m8 = mensualN(pL, eng, 8);

  const precioContadoHtml = bono > 0
    ? `<span style="font-size:10pt;">${fmt(pFinalContado)}</span>
       <span style="text-decoration:line-through;font-weight:normal;color:#999;margin-left:4px;font-size:8pt;">${fmt(pBaseContado)}</span>
       <span style="font-size:7pt;color:#dc2626;font-weight:bold;margin-left:4px;background:#fee2e2;padding:1px 4px;border-radius:2px;">Bono ${fmt(bono)}</span>`
    : fmt(pBaseContado);

  const html = `
  <div class="print-paper" id="hojaCartaCot">
    <div style="border-bottom:2px solid #DD0916;padding-bottom:4px;margin-bottom:6px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <span>
          <img src="img/logos/logo2.png" alt="De Los Ángeles Motor's" style="height:28px;object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='inline-block'">
          <span style="display:none;font-size:10.5pt;font-weight:bold;color:#222;">De Los Ángeles Motor's</span>
        </span>
        <span>
          <img src="img/logos/logo1.png" alt="Yamaha" style="height:28px;object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='inline-block'">
          <span style="display:none;font-size:17pt;font-weight:900;color:#DD0916;letter-spacing:-0.5px;">YAMAHA</span>
        </span>
      </div>
      <div style="text-align:center;font-size:7pt;color:#555;margin-top:3px;">Av. Reforma Sur #703 Col. Guadalupe Hidalgo, Tehuacán, Pue. · Tel. (238) 3 922963</div>
      <div style="text-align:center;font-size:7pt;color:#555;">Distribuidor Autorizado · www.yamaha-motor.com.mx</div>
    </div>

    <div style="font-size:10pt;text-align:center;text-transform:uppercase;letter-spacing:0.8px;font-weight:bold;color:#222;margin:4px 0 5px;">Cotización Oficial de Motocicleta</div>

    ${filaImpresion('Modelo / Año', `${state.moto.modelo} (${state.moto.anio || 2026})`)}
    ${filaImpresion('Clave', state.moto.clave)}
    ${filaImpresion('Color', color, true)}
    ${filaImpresion('Precio de Lista', fmt(pL))}
    ${filaImpresion(`Precio de Contado (−5% ${bono > 0 ? '+ Bono' : ''})`, precioContadoHtml, true)}
    ${filaImpresion('A 3 Meses (−3%)', fmt(p3meses(pL)))}

    <div style="background:#f5f5f5;padding:2px 6px;font-weight:bold;font-size:7.5pt;text-transform:uppercase;letter-spacing:0.5px;color:#333;border-left:3px solid #DD0916;margin:5px 0 2px;">Plan de Financiamiento</div>
    ${filaImpresion(`Enganche (${Math.round(eng / pL * 100)}% de lista)`, fmt(eng))}
    ${filaImpresion('Saldo Neto a Financiar', fmt(saldo))}
    ${filaImpresion('3 Mensualidades (Sin Interés)', fmt(m3) + ' / mes', true)}
    ${filaImpresion('6 Mensualidades (+2% mensual)', fmt(m6) + ' / mes', true)}
    ${filaImpresion('8 Mensualidades (+2% mensual)', fmt(m8) + ' / mes', true)}

    <div style="background:#f5f5f5;padding:2px 6px;font-weight:bold;font-size:7.5pt;text-transform:uppercase;letter-spacing:0.5px;color:#333;border-left:3px solid #DD0916;margin:5px 0 2px;">Requisitos para Crédito</div>
    <ul style="font-size:6.8pt;color:#333;padding-left:12px;margin:3px 0;line-height:1.3;">
      <li>Enganche mínimo del 40%.</li>
      <li>INE original vigente.</li>
      <li>CURP.</li>
      <li>Número de teléfono.</li>
      <li>Correo electrónico.</li>
      <li>Comprobante de domicilio original (con una antigüedad no mayor a 3 meses).</li>
      <li>Garantía que respalde el crédito solicitado por el total más un 30% adicional. Puede ser: escritura de propiedad con predial pagado y carta de libertad de gravamen; o factura de automóvil o motocicleta endosada, acompañada de la tarjeta de circulación vigente.</li>
    </ul>

    <div style="font-size:6.5pt;color:#555;border-top:1px solid #ddd;padding-top:3px;margin-top:5px;line-height:1.3;">
      <strong>TÉRMINOS:</strong> Precios sujetos a cambio sin previo aviso. Cotización válida por 5 días hábiles. Plan a 6 y 8 meses incluye 2% de interés mensual sobre saldo.
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;padding-top:4px;border-top:1.5px solid #DD0916;">
      <div style="font-size:7pt;color:#555;">Fecha: <strong>${TODAY}</strong></div>
      <div style="font-size:7pt;color:#555;">Atendido por: <strong>${asesor}</strong></div>
    </div>
  </div>`;

  document.getElementById('printAreaContainer').innerHTML = html;
  abrirModal('modalImpresion');

  await addWidget(`<div class="opts">
    <button class="opt-btn" onclick="abrirModal('modalImpresion')">
      <div class="opt-icon">👁️</div><div class="opt-info"><div class="opt-name">Ver vista previa</div><div class="opt-sub">Volver a abrir la cotización en PDF</div></div>
    </button>
    <button class="opt-btn" onclick="reiniciar()">
      <div class="opt-icon">🔄</div><div class="opt-info"><div class="opt-name">Reiniciar</div><div class="opt-sub">Empezar una cotización nueva</div></div>
    </button>
    <button class="opt-btn" onclick="abrirUltimaCotizacion()">
      <div class="opt-icon">📂</div><div class="opt-info"><div class="opt-name">Abrir últimas cotizaciónes</div><div class="opt-sub">Solo de referencia (próximamente)</div></div>
    </button>
  </div>`, 0);
}
