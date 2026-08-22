// ═══════════════════════════════════════════════
// IMPRESION.JS — Generación e impresión del PDF
// (tamaño carta, una sola página, con bono y color)
// ═══════════════════════════════════════════════

// ── FUNCIONES DEL MODAL ──
function abrirModal(id) {
  document.getElementById(id).classList.add('active');
}

function cerrarModal(id) {
  document.getElementById(id).classList.remove('active');
}

function ejecutarImpresion() {
  window.print();
}

async function compartirDoc() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Cotización Yamaha — ${state.moto.modelo}`,
        text: `Cotización para ${state.moto.modelo} en De Los Ángeles Motor's Tehuacán.`
      });
    } catch (e) {}
  } else {
    alert('Usa la opción de imprimir para guardar o compartir como PDF.');
  }
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
  const folio = 'COT-' + Date.now().toString().slice(-6);

  const pBaseContado = pContadoBase(pL);
  const pFinalContado = pContado(pL, bono);
  const saldo = pL - eng;
  const m3 = mensual3(pL, eng);
  const m6 = mensualN(pL, eng, 6);
  const m8 = mensualN(pL, eng, 8);

  const html = `
  <div class="print-paper" id="hojaCartaCot">
    <div style="text-align:center; border-bottom:2px solid #e6001e; padding-bottom:4px; margin-bottom:6px;">
      <div style="font-size:18pt; font-weight:900; color:#e6001e; letter-spacing:-0.5px;">YAMAHA</div>
      <div style="font-size:11pt; font-weight:bold; margin-top:2px;">De Los Ángeles Motor's</div>
      <div style="font-size:7pt; color:#555; margin-top:2px;">Av. Reforma Sur #703 Col. Guadalupe Hidalgo, Tehuacán, Pue. · Tel. (238) 3 922963</div>
      <div style="font-size:7pt; color:#555;">Distribuidor Autorizado · www.yamaha-motor.com.mx</div>
    </div>

    <div style="font-size:10pt; text-align:center; text-transform:uppercase; letter-spacing:0.8px; font-weight:bold; color:#222; margin:4px 0 5px;">Cotización Oficial de Motocicleta</div>

    <div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px solid #e8e8e8;">
      <span style="color:#555;">Modelo / Año</span>
      <span style="font-weight:bold;">${state.moto.modelo} (${state.moto.anio || 2026})</span>
    </div>
    <div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px solid #e8e8e8;">
      <span style="color:#555;">Clave</span>
      <span style="font-weight:bold;">${state.moto.clave}</span>
    </div>
    <div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px solid #e8e8e8;">
      <span style="color:#555;">Color</span>
      <span style="font-weight:bold; color:#0088cc;">${color}</span>
    </div>
    <div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px solid #e8e8e8;">
      <span style="color:#555;">Precio de Lista</span>
      <span style="font-weight:bold;">${fmt(pL)}</span>
    </div>
    <div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px solid #e8e8e8;">
      <span style="color:#555;">Precio de Contado (−5% ${bono > 0 ? '+ Bono' : ''})</span>
      <span style="font-weight:bold; color:#0088cc;">
        ${bono > 0 ? `
          <span style="font-weight:700; font-size:10pt;">${fmt(pFinalContado)}</span>
          <span style="text-decoration:line-through; font-weight:normal; color:#999; margin-left:4px; font-size:8pt;">${fmt(pBaseContado)}</span>
          <span style="font-size:7pt; color:#dc2626; font-weight:bold; margin-left:4px; background:#fee2e2; padding:1px 4px; border-radius:2px;">Bono ${fmt(bono)}</span>
        ` : fmt(pBaseContado)}
      </span>
    </div>
    <div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px solid #e8e8e8;">
      <span style="color:#555;">A 3 Meses (−3%)</span>
      <span style="font-weight:bold;">${fmt(p3meses(pL))}</span>
    </div>

    <div style="background:#f5f5f5; padding:2px 6px; font-weight:bold; font-size:7.5pt; text-transform:uppercase; letter-spacing:0.5px; color:#333; border-left:3px solid #e6001e; margin:5px 0 2px;">Plan de Financiamiento</div>
    <div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px solid #e8e8e8;">
      <span style="color:#555;">Enganche (${Math.round(eng/pL*100)}% de lista)</span>
      <span style="font-weight:bold;">${fmt(eng)}</span>
    </div>
    <div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px solid #e8e8e8;">
      <span style="color:#555;">Saldo Neto a Financiar</span>
      <span style="font-weight:bold;">${fmt(saldo)}</span>
    </div>
    <div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px solid #e8e8e8;">
      <span style="color:#555;">3 Mensualidades (Sin Interés)</span>
      <span style="font-weight:bold; color:#1d4ed8;">${fmt(m3)} / mes</span>
    </div>
    <div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px solid #e8e8e8;">
      <span style="color:#555;">6 Mensualidades (+2% mensual)</span>
      <span style="font-weight:bold; color:#1d4ed8;">${fmt(m6)} / mes</span>
    </div>
    <div style="display:flex; justify-content:space-between; padding:2px 0; border-bottom:1px solid #e8e8e8;">
      <span style="color:#555;">8 Mensualidades (+2% mensual)</span>
      <span style="font-weight:bold; color:#1d4ed8;">${fmt(m8)} / mes</span>
    </div>

    <div style="background:#ecfdf5; border:1px solid #10b981; border-radius:4px; padding:3px 6px; font-size:7pt; color:#047857; margin:4px 0; display:flex; align-items:center; gap:6px;">
      <span style="background:#10b981; color:white; font-weight:800; font-size:6pt; padding:1px 5px; border-radius:3px; text-transform:uppercase; letter-spacing:0.5px; flex-shrink:0;">🎁 PROMOCIÓN</span>
      <span>Recibe un <strong>casco de regalo</strong> o <strong>2° servicio gratuito</strong> (mano de obra).</span>
    </div>

    <div style="background:#f5f5f5; padding:2px 6px; font-weight:bold; font-size:7.5pt; text-transform:uppercase; letter-spacing:0.5px; color:#333; border-left:3px solid #e6001e; margin:5px 0 2px;">Requisitos para Crédito</div>
    <ul style="font-size:6.8pt; color:#333; padding-left:12px; margin:2px 0; line-height:1.3;">
      <li>Identificación oficial vigente (INE/Pasaporte) y CURP / Constancia de Situación Fiscal.</li>
      <li>Comprobante de domicilio reciente (no mayor a 3 meses).</li>
      <li>Garantía prendaria o aval con los mismos requisitos.</li>
    </ul>

    <div style="font-size:6.5pt; color:#555; border-top:1px solid #ddd; padding-top:3px; margin-top:5px; line-height:1.3;">
      <strong>TÉRMINOS:</strong> Precios sujetos a cambio sin previo aviso. Cotización válida por 5 días hábiles. Plan a 6 y 8 meses incluye 2% de interés mensual sobre saldo.
    </div>

    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:6px; padding-top:4px; border-top:1.5px solid #e6001e;">
      <div>
        <div style="font-size:7pt; color:#555;">Fecha: <strong>${TODAY}</strong></div>
        <div style="font-size:7pt; color:#555;">Folio: <strong>${folio}</strong></div>
      </div>
      <div style="text-align:center; min-width:40%;">
        <div style="border-top:1px solid #999; padding-top:2px; font-size:7.5pt; font-weight:bold;">Atendido por: ${asesor}</div>
      </div>
    </div>
  </div>`;

  document.getElementById('printAreaContainer').innerHTML = html;
  abrirModal('modalImpresion');

  // Botones de referencia al final del chat (no dentro del modal)
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