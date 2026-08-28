// ═══════════════════════════════════════════════
// FLUJO.JS — Orquestación del flujo conversacional
// (catálogo → cotización → PDF)
// ═══════════════════════════════════════════════

// ── Candado global anti doble-clic ──────────────
// Todas las funciones que avanzan de paso lo revisan antes de
// hacer nada; así un doble clic (o dos botones distintos casi
// al mismo tiempo) nunca dispara dos flujos a la vez.
let avanzando = false;
async function conCandado(fn) {
  if (avanzando) return;
  avanzando = true;
  try { await fn(); } finally { avanzando = false; }
}

// ── Colores: nombre → color real para pintar el círculo ──────
const COLOR_HEX_MAP = [
  [/negro|black/i, '#1c1c1e'], [/blanco|white/i, '#f2f2f2'],
  [/gris|gr[ae]y/i, '#8a8a92'], [/plata|silver/i, '#c7c9cf'],
  [/azul|blue/i, '#1c6ef3'], [/rojo|red/i, '#e6001e'],
  [/verde|green/i, '#2e7d32'], [/amarillo|yellow/i, '#f5c518'],
  [/marr[oó]n|caf[eé]|brown/i, '#6b3e26'], [/naranja|orange/i, '#ff7a00'],
  [/vino|wine/i, '#7a1f2b'], [/cyan/i, '#00bcd4'],
  [/morad[oa]|purple/i, '#7c3aed'], [/rosa|pink/i, '#ec4899'],
];

// Color (o degradado de respaldo) representativo del nombre recibido.
function getColorSwatch(name) {
  if (!name) return 'linear-gradient(135deg,#cfd3da,#6d7280)';
  const found = COLOR_HEX_MAP.find(([re]) => re.test(name));
  return found ? found[1] : 'linear-gradient(135deg,#cfd3da,#6d7280)';
}

function colorDotHtml(name, size = 12) {
  return `<span style="display:inline-block;width:${size}px;height:${size}px;border-radius:50%;background:${getColorSwatch(name)};border:2px solid rgba(255,255,255,0.35);flex-shrink:0;vertical-align:middle;"></span>`;
}

// Lleva el chat hasta el final del último elemento que se agregó o se
// modificó (catálogo, opciones, resumen de enganche...). Usa
// scrollIntoView sobre ese elemento en vez de mover el scroll de .chat
// a mano: así funciona sin importar si el que realmente tiene la barra
// de scroll es el contenedor .chat o la página completa — que es lo
// que se estaba rompiendo antes. Solo baja, nunca sube.
function scrollChatToBottom() {
  chat.lastElementChild?.scrollIntoView({ behavior: 'auto', block: 'end' });
}

// ── HANDLER DE ENVÍO (input de texto libre, solo para el asesor) ──
async function handleSend() {
  const inp = document.getElementById('userInput');
  const v = inp.value.trim();
  if (!v || step !== 'cotAsesor') return;
  inp.value = '';
  await addBubble(v, 'user');
  state.asesor = v;
  await generarPDF();
}
document.getElementById('userInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSend();
});

// ── PASO 0: BIENVENIDA ──
async function s0_bienvenida() {
  hideInput();
  setProgress(1, 3);
  await typing(800, false);
  await addBubble(
    'Bienvenido a <strong>De Los Ángeles Motor\'s</strong> — Distribuidor Autorizado Yamaha.<br><small style="color:var(--muted)">Av. Reforma Sur #703 Col. Guadalupe Hidalgo, Tehuacán, Pue.</small>',
    'agent', 0, false
  );
  await s1_catalogo(false);
}

// ── PASO 1: CATÁLOGO ──
async function s1_catalogo(scroll = true) {
  hideInput();
  await addBubble('Selecciona la motocicleta:', 'agent', 0, scroll);
  renderCatalog(scroll);
}

// Prioriza la imagen del color elegido; si no existe, usa la genérica.
function imgDeMoto(m, color) {
  return (m.imagenes && m.imagenes[color]) || m.img;
}

// HTML de UNA tarjeta de moto (antes vivía inline dentro de renderCatalog).
// Sacarla a su propia función permite reutilizarla sin tener que reconstruir
// la lista completa cada vez que cambia una sola tarjeta.
function renderMotoCardHtml(m) {
  const selColor = (state.coloresSeleccionados && state.coloresSeleccionados[m.id]) || (m.colores && m.colores[0]) || 'Negro';
  const isSelected = state.moto && state.moto.id === m.id;
  const bono = m.bono || 0;

  return `
    <div class="moto-card${isSelected ? ' selected' : ''}" data-moto-id="${m.id}" onclick="seleccionarMoto('${m.id}')">
      <div class="moto-card-header">
        <div class="moto-img-container">
          <img src="${imgDeMoto(m, selColor)}" alt="${m.modelo}"
               onerror="this.style.display='none';this.parentElement.innerHTML='<span class=\\'moto-icon-fallback\\'>${m.icon || '🏍️'}</span>'">
        </div>
        <div class="moto-body">
          <div class="moto-name">${m.modelo}</div>
          <div class="moto-sub">${m.clave} · ${m.anio || 2026}</div>
          <div class="moto-color-dot-wrap" style="margin-top:4px;">${colorDotHtml(selColor, 20)}</div>
        </div>
        <div class="moto-price-col">
          <div class="moto-price">${fmt(pContado(m.precio, bono))}</div>
          ${bono > 0 ? `<div class="bono-tag">Bono ${fmt(bono)}</div>` : ''}
          <div class="moto-price-orig">${fmt(m.precio)}</div>
        </div>
      </div>
      ${m.colores && m.colores.length > 0 ? `
        <div class="color-pills" onclick="event.stopPropagation();">
          ${m.colores.map(c => `
            <button class="color-pill ${c === selColor ? 'active' : ''}" data-color="${c}" title="${c}" onclick="cambiarColorMoto('${m.id}', '${c}')">
              ${colorDotHtml(c, 20)}
            </button>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

// HTML del botón "Continuar con <moto>" (se separa para poder actualizar
// solo su texto sin reconstruir el resto del widget).
function continuarBtnHtml() {
  return state.moto ? `
    <div id="continuarWrap" style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end;">
      <button class="btn-primary" id="btnContinuarCatalogo" style="width:auto;padding:8px 20px;border-radius:20px;font-size:13px;" onclick="conCandado(avanzarDesdeCatalogo)">
        Continuar con ${state.moto.modelo}${state.moto.anio ? ' (' + state.moto.anio + ')' : ''} →
      </button>
    </div>
  ` : '';
}

// Reconstruye TODO el catálogo (categorías + lista completa). Se usa solo
// cuando de verdad cambia la lista entera (primera carga o cambio de
// categoría); para seleccionar una moto o cambiar su color usamos las
// funciones "quirúrgicas" de abajo, que solo tocan la tarjeta afectada.
function renderCatalog(scroll = true) {
  const cats = Object.keys(CATALOGO);
  const catHtml = `<div class="cat-scroll">${cats.map(c =>
    `<button class="cat-btn${c === activeCat ? ' active' : ''}" onclick="filterCat('${c}')">${c}</button>`
  ).join('')}</div>`;

  const listHtml = `<div class="moto-list">${CATALOGO[activeCat].map(renderMotoCardHtml).join('')}</div>`;

  const html = `<div id="catZone">${catHtml}</div><div id="listZone">${listHtml}</div>${continuarBtnHtml()}`;

  const ex = document.getElementById('catalog-widget');
  if (ex) { ex.innerHTML = html; return; }
  const w = document.createElement('div');
  w.className = 'widget';
  w.id = 'catalog-widget';
  w.innerHTML = html;
  chat.appendChild(w);
  if (scroll) w.scrollIntoView({ behavior: 'auto', block: 'end' });
}

function filterCat(cat) {
  activeCat = cat;
  renderCatalog(); // aquí sí cambia la lista completa, hace falta reconstruir todo
}

// Cambia el color de una moto SOLO en su propia tarjeta, sin tocar las
// demás (antes reconstruía las ~10-15 tarjetas del catálogo completo,
// recargando incluso las imágenes que no habían cambiado).
function cambiarColorMoto(motoId, color) {
  if (!state.coloresSeleccionados) state.coloresSeleccionados = {};
  state.coloresSeleccionados[motoId] = color;
  if (state.moto && state.moto.id === motoId) state.moto.colorSeleccionado = color;

  const moto = CATALOGO[activeCat].find(m => m.id === motoId);
  const card = document.querySelector(`.moto-card[data-moto-id="${motoId}"]`);
  if (!moto || !card) { renderCatalog(); return; } // red de seguridad por si algo no cuadra

  const img = card.querySelector('.moto-img-container img');
  if (img) img.src = imgDeMoto(moto, color);
  const dotWrap = card.querySelector('.moto-color-dot-wrap');
  if (dotWrap) dotWrap.innerHTML = colorDotHtml(color, 20);
  card.querySelectorAll('.color-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.color === color);
  });
}

// Selecciona una moto como la elegida para cotizar.
// Antes esto llamaba a renderCatalog() y reconstruía TODO el HTML de la
// lista (todas las tarjetas + todas las imágenes) en cada clic. En una
// tablet, un segundo tap que llegaba mientras el navegador aún estaba
// reemplazando ese bloque completo podía caer sobre un nodo que ya no
// existía, y el clic se perdía — eso era el bug de "a veces no selecciona".
// Ahora solo se tocan las 2 tarjetas realmente afectadas (la anterior y la
// nueva), así que el resto de la lista nunca se destruye ni se re-crea.
function seleccionarMoto(motoId) {
  const moto = CATALOGO[activeCat].find(m => m.id === motoId);
  if (!moto || (state.moto && state.moto.id === motoId)) return; // ya estaba elegida

  const prevId = state.moto ? state.moto.id : null;
  const colorActual = (state.coloresSeleccionados && state.coloresSeleccionados[motoId]) || (moto.colores && moto.colores[0]) || 'Negro';
  state.moto = { ...moto, cat: activeCat, colorSeleccionado: colorActual };

  const listZone = document.getElementById('listZone');
  if (!listZone) { renderCatalog(); return; } // red de seguridad

  if (prevId) {
    listZone.querySelector(`.moto-card[data-moto-id="${prevId}"]`)?.classList.remove('selected');
  }
  listZone.querySelector(`.moto-card[data-moto-id="${motoId}"]`)?.classList.add('selected');

  const existingWrap = document.getElementById('continuarWrap');
  if (existingWrap) {
    const btn = document.getElementById('btnContinuarCatalogo');
    if (btn) btn.textContent = `Continuar con ${state.moto.modelo}${state.moto.anio ? ' (' + state.moto.anio + ')' : ''} →`;
  } else {
    document.getElementById('catalog-widget')?.insertAdjacentHTML('beforeend', continuarBtnHtml());
  }

  scrollChatToBottom();
}

async function avanzarDesdeCatalogo() {
  if (!state.moto) return;
  // Se "congela" visualmente el catálogo (con aviso) para que no
  // parezca interactivo mientras se muestra el resumen de precios.
  document.getElementById('catZone')?.classList.add('locked');
  document.getElementById('listZone')?.classList.add('locked');
  document.getElementById('btnContinuarCatalogo')?.remove();
  document.getElementById('catalog-widget')?.insertAdjacentHTML('beforeend',
    '<div class="catalog-locked-banner">✓ Motocicleta confirmada — usa "Cambiar moto" más abajo si quieres elegir otra</div>');

  step = 2;
  setProgress(2, 3);
  await sCotModalidad();
}

// ── PASO 2: RESUMEN Y MODALIDAD DE COTIZACIÓN ──
async function sCotModalidad() {
  hideInput();
  const pL = state.moto.precio;
  state.enganche = engMin(pL);
  await addBubble(`Resumen de precios — <strong>${state.moto.modelo}${state.moto.anio ? ' ' + state.moto.anio : ''}</strong> (${state.moto.colorSeleccionado || 'Serie'})`, 'agent cot-msg');
  renderCotResumen(pL, state.enganche);
  await addBubble('¿Ajustamos el enganche o generamos el PDF con el mínimo?', 'agent cot-msg');
  await addWidget(`<div class="opts">
    <button class="opt-btn" id="btnAjustarEnganche" onclick="conCandado(cotAjustar)">
      <div class="opt-icon">🎚️</div><div class="opt-info"><div class="opt-name">Ajustar enganche</div><div class="opt-sub">Escribir el monto del enganche</div></div>
    </button>
    <button class="opt-btn" id="btnGenerarPDF" onclick="conCandado(cotPedirAsesor)">
      <div class="opt-icon">📄</div><div class="opt-info"><div class="opt-name">Generar PDF ahora</div><div class="opt-sub">Con enganche mínimo del 40%</div></div>
    </button>
    <button class="opt-btn" id="btnCambiarMoto" onclick="conCandado(volverAlCatalogo)">
      <div class="opt-icon">🔄</div><div class="opt-info"><div class="opt-name">Cambiar moto</div><div class="opt-sub">Seleccionar otra motocicleta</div></div>
    </button>
  </div>`, 0);
  scrollChatToBottom();
}

// Deshabilita un solo botón de opción (por id), dejando los demás activos.
function deshabilitarBoton(id) {
  const b = document.getElementById(id);
  if (b) { b.disabled = true; b.style.opacity = '0.5'; b.style.pointerEvents = 'none'; }
}

// Deshabilita las 3 opciones (ajustar / generar / cambiar) para que solo
// se pueda avanzar por una de ellas a la vez.
function bloquearOpcionesCot() {
  ['btnAjustarEnganche', 'btnGenerarPDF', 'btnCambiarMoto'].forEach(deshabilitarBoton);
}

async function volverAlCatalogo() {
  bloquearOpcionesCot();
  delete state.enganche;
  document.querySelectorAll('.widget, .cot-msg').forEach(w => w.remove());
  await addBubble('🔄 Cambiando de moto...', 'sys');
  step = 1;
  setProgress(1, 3);
  await s1_catalogo();
  scrollChatToBottom();
}

function renderCotResumen(pL, eng) {
  const bono = state.moto.bono || 0;
  const pBaseContado = pContadoBase(pL);
  const pFinalContado = pContado(pL, bono);
  const m3 = mensual3(pL, eng), m6 = mensualN(pL, eng, 6), m8 = mensualN(pL, eng, 8);

  const html = `<div class="cot" id="cotResumen">
    <div class="cot-head">Cotización — ${state.moto.modelo}${state.moto.anio ? ' ' + state.moto.anio : ''} (${state.moto.colorSeleccionado || 'Serie'})</div>
    <div class="cot-body">
      <div class="cot-row"><span class="cot-label">Precio lista</span><span class="cot-val">${fmt(pL)}</span></div>
      <div class="cot-row">
        <span class="cot-label">Contado (−5%${bono ? ' + Bono' : ''})</span>
        <span class="cot-val green">
          ${bono > 0 ? `
            <span style="color:var(--green);font-weight:700;font-size:14px">${fmt(pFinalContado)}</span>
            <span style="color:var(--muted);text-decoration:line-through;margin-left:5px;font-size:11px">${fmt(pBaseContado)}</span>
            <span style="display:inline-block;background:var(--yamaha-red);color:#ffffff;padding:2px 7px;border-radius:4px;font-size:13px;font-weight:700;margin-left:4px">Bono ${fmt(bono)}</span>
          ` : fmt(pBaseContado)}
        </span>
      </div>
      <div class="cot-row"><span class="cot-label">A 3 meses (−3%)</span><span class="cot-val">${fmt(p3meses(pL))}</span></div>
      <div class="cot-row"><span class="cot-label">Enganche (${Math.round(eng / pL * 100)}%)</span><span class="cot-val">${fmt(eng)}</span></div>
      <div class="cot-row"><span class="cot-label">3 mens. sin interés</span><span class="cot-val blue">${fmt(m3)}/mes</span></div>
      <div class="cot-row"><span class="cot-label">6 mens. +2%/mes</span><span class="cot-val blue">${fmt(m6)}/mes</span></div>
      <div class="cot-row"><span class="cot-label">8 mens. +2%/mes</span><span class="cot-val blue">${fmt(m8)}/mes</span></div>
    </div>
  </div>`;
  const ex = document.getElementById('cotResumen');
  if (ex) { ex.outerHTML = html; scrollChatToBottom(); return; }
  const w = document.createElement('div');
  w.className = 'widget';
  w.innerHTML = html;
  chat.appendChild(w);
  w.scrollIntoView({ behavior: 'auto', block: 'end' });
}

// ── AJUSTE DE ENGANCHE ──

// Límites de enganche YA redondeados (una sola vez). Antes se comparaba
// el valor mostrado/redondeado en pantalla contra engMin()/engMax() sin
// redondear, y esa diferencia de centavos hacía que escribir exactamente
// 40% o 80% a veces se marcara como inválido. Ahora todo el flujo usa
// estos mismos dos números: al mostrar, al convertir % → $ y al validar.
function engLimites(pL) {
  return { min: Math.round(engMin(pL)), max: Math.round(engMax(pL)) };
}

async function cotAjustar() {
  deshabilitarBoton('btnAjustarEnganche'); // solo este botón, para no duplicar el widget de enganche;
  await addBubble('Ajustar enganche', 'user'); // "Cambiar moto" y "Generar PDF" siguen activos
  const pL = state.moto.precio;
  const { min, max } = engLimites(pL);
  state.enganche = min;
  await typing(400);
  await addWidget(`<div class="field-wrap" style="gap:8px">
    <div style="display:flex;gap:10px;">
      <div class="field-item" style="flex:1;">
        <label class="field-label">Enganche <span style="color:var(--muted);font-size:10px">(mín. ${fmt(min)} · máx. ${fmt(max)})</span></label>
        <input class="field-input" id="inputEnganche" type="number" min="${min}" max="${max}" value="${min}" oninput="onEngInput(this.value,${pL})">
      </div>
      <div class="field-item" style="width:88px;">
        <label class="field-label">Porcentaje</label>
        <input class="field-input" id="inputEnganchePct" type="number" min="40" max="80" value="40" oninput="onEngPctInput(this.value,${pL})">
      </div>
    </div>
    <div style="font-size:13.5px;color:var(--text);margin-top:-2px;font-weight:500;">
      El enganche debe ser entre <strong style="color:var(--green)">40%</strong> y <strong style="color:var(--green)">80%</strong> del precio de lista.
    </div>
    <div id="engFeedback" style="font-size:12px;padding:7px 10px;border-radius:9px;background:var(--green-soft);color:var(--green)">Calculando...</div>
  </div>
  <button class="btn-primary" id="btnConfEnganche" style="margin-top:8px" onclick="cotConfEngInput(${pL}, this)">Usar este enganche</button>`, 200);
  onEngInput(min, pL);
  hideInput();
}

// Pinta el mensaje de feedback (✓ verde / ✗ rojo) del enganche.
// El caso inválido usa fondo rojo sólido + texto blanco (como el badge
// de "Bono") para que se lea bien — antes era texto rojo sobre un fondo
// rojo muy parecido, difícil de distinguir.
function feedbackEnganche(ok, mensaje) {
  const fb = document.getElementById('engFeedback');
  if (!fb) return;
  fb.style.cssText = ok
    ? 'font-size:12px;padding:7px 10px;border-radius:9px;background:var(--green-soft);color:var(--green)'
    : 'font-size:12px;padding:7px 10px;border-radius:9px;background:var(--yamaha-red);color:#ffffff;font-weight:600;';
  fb.innerHTML = mensaje;
}

function mensajeCuotasOk(pL, eng) {
  return `✓ &nbsp;3 meses: <strong>${fmt(mensual3(pL, eng))}</strong> &nbsp;·&nbsp; 6 meses: <strong>${fmt(mensualN(pL, eng, 6))}</strong> &nbsp;·&nbsp; 8 meses: <strong>${fmt(mensualN(pL, eng, 8))}</strong>`;
}

// Enganche escrito como monto ($). min/max ya redondeados: 40%/80% exactos
// siempre pasan, sin importar los centavos del precio de lista.
function onEngInput(val, pL) {
  val = parseFloat(val) || 0;
  const { min, max } = engLimites(pL);
  if (val < min) return feedbackEnganche(false, `✗ El mínimo es ${fmt(min)} (40%)`);
  if (val > max) return feedbackEnganche(false, `✗ El máximo es ${fmt(max)} (80%)`);
  state.enganche = val;
  const pctInput = document.getElementById('inputEnganchePct');
  if (pctInput) pctInput.value = Math.round(val / pL * 100);
  feedbackEnganche(true, mensajeCuotasOk(pL, val));
  renderCotResumen(pL, val);
}

// Enganche escrito como porcentaje (40 a 80, ambos incluidos).
function onEngPctInput(val, pL) {
  const pct = parseFloat(val);
  if (isNaN(pct) || pct < 40) return feedbackEnganche(false, '✗ El mínimo es 40%');
  if (pct > 80) return feedbackEnganche(false, '✗ El máximo es 80%');
  const { min, max } = engLimites(pL);
  // 40% y 80% exactos usan el mismo número que ya se le mostró al usuario
  // como mínimo/máximo (evita el mismo desfase de redondeo de arriba).
  const monto = pct === 40 ? min : pct === 80 ? max : Math.round(pL * pct / 100);
  const amountInput = document.getElementById('inputEnganche');
  if (amountInput) amountInput.value = monto;
  state.enganche = monto;
  feedbackEnganche(true, mensajeCuotasOk(pL, monto));
  renderCotResumen(pL, monto);
}

async function cotConfEngInput(pL, btn) {
  if (btn.disabled) return;
  btn.disabled = true;
  btn.style.opacity = '0.6';
  btn.textContent = 'Guardando...';

  const val = parseFloat(document.getElementById('inputEnganche')?.value) || 0;
  const { min, max } = engLimites(pL);
  if (val < min || val > max) {
    await addBubble(val < min ? `El enganche mínimo es ${fmt(min)} (40%).` : `El enganche máximo es ${fmt(max)} (80%).`, 'agent');
    btn.disabled = false; btn.style.opacity = '1'; btn.textContent = 'Usar este enganche';
    return;
  }
  state.enganche = val;
  document.getElementById('inputEnganche').disabled = true;
  document.getElementById('inputEnganchePct').disabled = true;
  btn.remove();
  await addBubble(`Enganche: ${fmt(val)}`, 'user');
  await cotPedirAsesor();
}

// ── PASO 3: DATOS DEL ASESOR Y PDF ──
async function cotPedirAsesor() {
  if (step === 'cotAsesor') return; // ya se pidió, evita duplicar el mensaje
  bloquearOpcionesCot();
  disableWidgets();
  step = 'cotAsesor';
  setProgress(3, 3);
  await typing(500);
  await addBubble('¿Quién atiende? Escribe el nombre del asesor:', 'agent');
  showInput('Nombre del asesor...');
}

// (generarPDF vive en impresion.js — abrirAdminCatalogo/abrirGaleria en
// sus propios archivos catalogo-admin.js / galeria.js)

function abrirUltimaCotizacion() {
  // Próximamente: aquí se conectará la última cotización guardada.
}

// ── REINICIO ──
async function reiniciar() {
  state = {};
  step = 0;
  activeCat = Object.keys(CATALOGO)[0];
  chat.innerHTML = '';
  s0_bienvenida();
}

s0_bienvenida();
