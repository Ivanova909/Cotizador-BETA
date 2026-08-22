// ═══════════════════════════════════════════════
// FLUJO.JS — Orquestación del flujo conversacional
// (solo cotización, con colores y bonos)
// ═══════════════════════════════════════════════

// Helper para obtener la ruta de la imagen de una moto (por si se usa)
function getMotoImgPath(moto, cat) {
  if (moto.img) return moto.img;
  let slug = moto.modelo
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  const catSlug = cat.toLowerCase().replace(/ /g, "_").replace(/\./g, "");
  return `img/motos/${catSlug}/${slug}.jpg`;
}

// ── Mapa de nombres de color -> color real (para pintar el círculo) ──
const COLOR_HEX_MAP = [
  [/negro/i, '#1c1c1e'],
  [/black/i, '#1c1c1e'],
  [/blanco/i, '#f2f2f2'],
  [/white/i, '#f2f2f2'],
  [/gris/i, '#8a8a92'],
  [/gr[ae]y/i, '#8a8a92'],
  [/plata/i, '#c7c9cf'],
  [/silver/i, '#c7c9cf'],
  [/azul/i, '#1c6ef3'],
  [/blue/i, '#1c6ef3'],
  [/rojo/i, '#e6001e'],
  [/red/i, '#e6001e'],
  [/verde/i, '#2e7d32'],
  [/green/i, '#2e7d32'],
  [/amarillo/i, '#f5c518'],
  [/yellow/i, '#f5c518'],
  [/marr[oó]n/i, '#6b3e26'],
  [/caf[eé]/i, '#6b3e26'],
  [/brown/i, '#6b3e26'],
  [/naranja/i, '#ff7a00'],
  [/orange/i, '#ff7a00'],
  [/vino/i, '#7a1f2b'],
  [/wine/i, '#7a1f2b'],
  [/cyan/i, '#00bcd4'],
  [/morad[oa]/i, '#7c3aed'],
  [/purple/i, '#7c3aed'],
  [/rosa/i, '#ec4899'],
  [/pink/i, '#ec4899'],
];

// Devuelve un color (o degradado) representativo del nombre recibido.
// Si no reconoce ninguna palabra clave (ej. "Tech Kamo", "Ice Fluo"),
// regresa un degradado metálico neutro como respaldo.
function getColorSwatch(name) {
  if (!name) return 'linear-gradient(135deg,#cfd3da,#6d7280)';
  for (const [re, hex] of COLOR_HEX_MAP) {
    if (re.test(name)) return hex;
  }
  return 'linear-gradient(135deg,#cfd3da,#6d7280)';
}

function colorDotHtml(name, size = 12) {
  const bg = getColorSwatch(name);
  return `<span style="display:inline-block;width:${size}px;height:${size}px;border-radius:50%;background:${bg};border:2px solid rgba(255,255,255,0.35);flex-shrink:0;vertical-align:middle;"></span>`;
}

// ── HANDLER DE ENVÍO ──
async function handleSend() {
  const inp = document.getElementById('userInput');
  const v = inp.value.trim();
  if (!v) return;
  inp.value = '';
  await addBubble(v, 'user');
  if (step === 'cotAsesor') {
    state.asesor = v;
    await generarPDF();
  }
}
document.getElementById('userInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSend();
});

// ── BIENVENIDA ──
async function s0_bienvenida() {
  hideInput();
  setProgress(1, 3);
  await typing(800);
  await addBubble(
    'Bienvenido a <strong>De Los Ángeles Motor\'s</strong> — Distribuidor Autorizado Yamaha.<br><small style="color:var(--muted)">Av. Reforma Sur #703 Col. Guadalupe Hidalgo, Tehuacán, Pue.</small>',
    'agent'
  );
  // Directo al catálogo (sin preguntar modo)
  await s1_catalogo();
}

// ── CATÁLOGO ──
async function s1_catalogo() {
  hideInput();
  await addBubble('Selecciona la motocicleta:', 'agent');
  renderCatalog();
}

function renderCatalog() {
  const cats = Object.keys(CATALOGO);
  const catHtml = `<div class="cat-scroll">${cats.map(c => 
    `<button class="cat-btn${c === activeCat ? ' active' : ''}" onclick="filterCat('${c}')">${c}</button>`
  ).join('')}</div>`;

  // Función para obtener la imagen (prioriza la del color seleccionado si existe)
  function getImgForMoto(moto, color) {
    // Si hay imágenes por color y existe la del color elegido
    if (moto.imagenes && moto.imagenes[color]) {
      return moto.imagenes[color];
    }
    // Si no, usa la imagen genérica (campo img)
    return moto.img || `img/motos/${activeCat.toLowerCase().replace(/ /g,"_")}/default.jpg`;
  }

  const listHtml = `<div class="moto-list">${CATALOGO[activeCat].map((m, i) => {
    // Obtener el color seleccionado para esta moto (o el primero de la lista)
    const selColor = (state.coloresSeleccionados && state.coloresSeleccionados[m.id]) 
      || (m.colores && m.colores[0]) 
      || 'Negro';
    const imgUrl = getImgForMoto(m, selColor);
    const isSelected = state.moto && state.moto.id === m.id;

    // Calcular precio con bono (la función pContado debe recibir bono)
    const bono = m.bono || 0;
    const pFinalContado = pContado(m.precio, bono);

    return `
      <div class="moto-card${isSelected ? ' selected' : ''}" onclick="seleccionarMoto('${m.id}')">
        <div class="moto-card-header">
          <div class="moto-img-container">
            <img src="${imgUrl}" alt="${m.modelo}"
                 onerror="this.style.display='none';this.parentElement.innerHTML='<span class=\\'moto-icon-fallback\\'>${m.icon || '🏍️'}</span>'">
          </div>
          <div class="moto-body">
            <div class="moto-name">${m.modelo}</div>
            <div class="moto-sub">${m.clave} · ${m.anio || 2026}</div>
            <div style="margin-top:4px;">${colorDotHtml(selColor, 20)}</div>
          </div>
          <div class="moto-price-col">
            <div class="moto-price">${fmt(pFinalContado)}</div>
            ${bono > 0 ? `<div class="bono-tag">Bono ${fmt(bono)}</div>` : ''}
            <div class="moto-price-orig">${fmt(m.precio)}</div>
          </div>
        </div>
        ${m.colores && m.colores.length > 0 ? `
          <div class="color-pills" onclick="event.stopPropagation();">
            ${m.colores.map(c => `
              <button class="color-pill ${c === selColor ? 'active' : ''}" title="${c}"
                      onclick="cambiarColorMoto('${m.id}', '${c}')">
                ${colorDotHtml(c, 20)}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }).join('')}</div>`;

  const continueHtml = state.moto ? `
    <div id="continuarWrap" style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end;">
      <button class="btn-primary" style="width:auto;padding:8px 20px;border-radius:20px;font-size:13px;" onclick="avanzarDesdeCatalogo()">
        Continuar con ${state.moto.modelo} →
      </button>
    </div>
  ` : '';

  const html = catHtml + listHtml + continueHtml;

  const ex = document.getElementById('catalog-widget');
  if (ex) {
    ex.innerHTML = html;
    return;
  }
  const w = document.createElement('div');
  w.className = 'widget';
  w.id = 'catalog-widget';
  w.innerHTML = html;
  chat.appendChild(w);
  chat.scrollTop = chat.scrollHeight;
}

function filterCat(cat) {
  activeCat = cat;
  renderCatalog();
}

// Cambiar color de una moto (sin seleccionarla como principal)
function cambiarColorMoto(motoId, color) {
  if (!state.coloresSeleccionados) state.coloresSeleccionados = {};
  state.coloresSeleccionados[motoId] = color;
  // Si esta moto es la que está seleccionada actualmente, actualizamos su color
  if (state.moto && state.moto.id === motoId) {
    state.moto.colorSeleccionado = color;
  }
  renderCatalog();
}

// Seleccionar moto (sin agregar mensaje de confirmación)
async function seleccionarMoto(motoId) {
  const moto = CATALOGO[activeCat].find(m => m.id === motoId);
  if (!moto) return;
  
  // Si ya está seleccionada, no hacemos nada
  if (state.moto && state.moto.id === motoId) return;

  // Obtener el color actual (si ya se había seleccionado para esta moto, lo mantenemos)
  const colorActual = (state.coloresSeleccionados && state.coloresSeleccionados[motoId]) 
    || (moto.colores && moto.colores[0]) 
    || 'Negro';

  state.moto = { 
    ...moto, 
    cat: activeCat,
    colorSeleccionado: colorActual
  };

  renderCatalog(); // actualiza la lista y el botón "Continuar"
  // No se añade mensaje de confirmación para evitar acumulación

  // Bajar la página hasta el botón rojo de "Continuar"
  document.getElementById('continuarWrap')?.scrollIntoView({ behavior: 'auto', block: 'end' });
}

async function avanzarDesdeCatalogo() {
  if (!state.moto) return;
  document.getElementById('catalog-widget').style.pointerEvents = 'none';
  step = 2;
  setProgress(2, 3);
  await sCotModalidad();
}

// ── MODO COTIZACIÓN ──
async function sCotModalidad() {
  hideInput();
  const pL = state.moto.precio;
  const eMin = engMin(pL);
  state.enganche = eMin;
  await addBubble(`Resumen de precios — <strong>${state.moto.modelo}</strong> (${state.moto.colorSeleccionado || 'Serie'})`, 'agent cot-msg');
  renderCotResumen(pL, eMin);
  await addBubble('¿Ajustamos el enganche o generamos el PDF con el mínimo?', 'agent cot-msg');
  await addWidget(`<div class="opts">
    <button class="opt-btn" id="btnAjustarEnganche" onclick="cotAjustar()">
      <div class="opt-icon">🎚️</div><div class="opt-info"><div class="opt-name">Ajustar enganche</div><div class="opt-sub">Escribir el monto del enganche</div></div>
    </button>
    <button class="opt-btn" id="btnGenerarPDF" onclick="cotPedirAsesor()">
      <div class="opt-icon">📄</div><div class="opt-info"><div class="opt-name">Generar PDF ahora</div><div class="opt-sub">Con enganche mínimo del 40%</div></div>
    </button>
    <button class="opt-btn" id="btnCambiarMoto" onclick="volverAlCatalogo()">
      <div class="opt-icon">🔄</div><div class="opt-info"><div class="opt-name">Cambiar moto</div><div class="opt-sub">Seleccionar otra motocicleta</div></div>
    </button>
  </div>`, 0);

  // Bajar la página automáticamente hasta las opciones (enganche / PDF / cambiar moto)
  document.getElementById('btnCambiarMoto')?.scrollIntoView({ behavior: 'auto', block: 'end' });
}

// Función para volver al catálogo desde el resumen
async function volverAlCatalogo() {
  // Limpiar el estado de la cotización (pero mantener la moto seleccionada)
  delete state.enganche;
  // Eliminar widgets de resumen y opciones, Y los mensajes de texto
  // de esa etapa (resumen de precios / pregunta de ajuste), para que
  // no se acumulen cada vez que se cambia de moto
  document.querySelectorAll('.widget, .cot-msg').forEach(w => w.remove());
  // Agregar un mensaje de sistema
  await addBubble('🔄 Cambiando de moto...', 'sys');
  // Restaurar el paso al catálogo
  step = 1;
  setProgress(1, 3);
  // Volver a mostrar el catálogo (se recrea el widget)
  await s1_catalogo();

  // Como ya había una moto elegida, el botón "Continuar" aparece de
  // inmediato — bajamos la página hasta él, igual que al seleccionar
  document.getElementById('continuarWrap')?.scrollIntoView({ behavior: 'auto', block: 'end' });
}

function renderCotResumen(pL, eng) {
  const bono = state.moto.bono || 0;
  const pBaseContado = pContadoBase(pL); // sin bono
  const pFinalContado = pContado(pL, bono); // con bono

  const m3 = mensual3(pL, eng);
  const m6 = mensualN(pL, eng, 6);
  const m8 = mensualN(pL, eng, 8);

  const html = `<div class="cot" id="cotResumen">
    <div class="cot-head">Cotización — ${state.moto.modelo} (${state.moto.colorSeleccionado || 'Serie'})</div>
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
  if (ex) { ex.outerHTML = html; return; }
  const w = document.createElement('div');
  w.className = 'widget';
  w.innerHTML = html;
  chat.appendChild(w);
  chat.scrollTop = chat.scrollHeight;
}

async function cotAjustar() {
  // Solo se deshabilita este botón (para no abrir el formulario dos veces);
  // "Generar PDF ahora" y "Cambiar moto" se quedan activos por si te equivocas
  const btnAjustar = document.getElementById('btnAjustarEnganche');
  if (btnAjustar) {
    btnAjustar.disabled = true;
    btnAjustar.style.opacity = '0.6';
    btnAjustar.style.pointerEvents = 'none';
  }
  await addBubble('Ajustar enganche', 'user');
  const pL = state.moto.precio;
  const min = engMin(pL);
  const max = engMax(pL);
  state.enganche = min;
  await typing(400);
  await addWidget(`<div class="field-wrap" style="gap:8px">
    <div style="display:flex;gap:10px;">
      <div class="field-item" style="flex:1;">
        <label class="field-label">Enganche <span style="color:var(--muted);font-size:10px">(mín. ${fmt(min)} · máx. ${fmt(max)})</span></label>
        <input class="field-input" id="inputEnganche" type="number" min="${min}" max="${max}"
          value="${Math.round(min)}" placeholder="${Math.round(min)}"
          oninput="onEngInput(this.value,${pL})">
      </div>
      <div class="field-item" style="width:88px;">
        <label class="field-label">Porcentaje</label>
        <input class="field-input" id="inputEnganchePct" type="number" min="40" max="80"
          value="40" placeholder="40"
          oninput="onEngPctInput(this.value,${pL})">
      </div>
    </div>
    <div style="font-size:13.5px;color:var(--text);margin-top:-2px;font-weight:500;">
      El enganche debe ser <strong style="color:var(--green)">40%</strong> y <strong style="color:var(--green)">80%</strong> del precio de lista.
    </div>
    <div id="engFeedback" style="font-size:12px;padding:7px 10px;border-radius:9px;background:var(--green-soft);color:var(--green)">
      Calculando...
    </div>
  </div>
  <button class="btn-primary" id="btnConfEnganche" style="margin-top:8px" onclick="cotConfEngInput(${pL}, this)">Usar este enganche</button>`, 200);
  onEngInput(Math.round(min), pL);
  hideInput();
}

function onEngInput(val, pL) {
  val = parseFloat(val) || 0;
  const min = engMin(pL);
  const max = engMax(pL);
  const fb = document.getElementById('engFeedback');
  const pctInput = document.getElementById('inputEnganchePct');
  if (val >= min && val <= max) {
    state.enganche = val;
    if (pctInput) pctInput.value = Math.round(val / pL * 100);
    const m3 = mensual3(pL, val);
    const m6 = mensualN(pL, val, 6);
    const m8 = mensualN(pL, val, 8);
    fb.className = '';
    fb.style.cssText = 'font-size:12px;padding:7px 10px;border-radius:9px;background:var(--green-soft);color:var(--green)';
    fb.innerHTML = `✓ &nbsp;3 meses: <strong>${fmt(m3)}</strong> &nbsp;·&nbsp; 6 meses: <strong>${fmt(m6)}</strong> &nbsp;·&nbsp; 8 meses: <strong>${fmt(m8)}</strong>`;
    renderCotResumen(pL, val);
  } else if (val < min) {
    fb.style.cssText = 'font-size:12px;padding:7px 10px;border-radius:9px;background:rgba(230,0,30,0.1);color:var(--yamaha-red)';
    fb.textContent = `✗ El mínimo es ${fmt(min)} (40%)`;
  } else {
    fb.style.cssText = 'font-size:12px;padding:7px 10px;border-radius:9px;background:rgba(230,0,30,0.1);color:var(--yamaha-red)';
    fb.textContent = `✗ El máximo es ${fmt(max)} (80%)`;
  }
}

// Enganche escrito como porcentaje (40 a 80, ambos incluidos)
function onEngPctInput(val, pL) {
  const pct = parseFloat(val);
  const fb = document.getElementById('engFeedback');
  const amountInput = document.getElementById('inputEnganche');
  if (!isNaN(pct) && pct >= 40 && pct <= 80) {
    const monto = Math.round(pL * pct / 100);
    if (amountInput) amountInput.value = monto;
    state.enganche = monto;
    const m3 = mensual3(pL, monto);
    const m6 = mensualN(pL, monto, 6);
    const m8 = mensualN(pL, monto, 8);
    fb.style.cssText = 'font-size:12px;padding:7px 10px;border-radius:9px;background:var(--green-soft);color:var(--green)';
    fb.innerHTML = `✓ &nbsp;3 meses: <strong>${fmt(m3)}</strong> &nbsp;·&nbsp; 6 meses: <strong>${fmt(m6)}</strong> &nbsp;·&nbsp; 8 meses: <strong>${fmt(m8)}</strong>`;
    renderCotResumen(pL, monto);
  } else if (isNaN(pct) || pct < 40) {
    fb.style.cssText = 'font-size:12px;padding:7px 10px;border-radius:9px;background:rgba(230,0,30,0.1);color:var(--yamaha-red)';
    fb.textContent = `✗ El mínimo es 40%`;
  } else {
    fb.style.cssText = 'font-size:12px;padding:7px 10px;border-radius:9px;background:rgba(230,0,30,0.1);color:var(--yamaha-red)';
    fb.textContent = `✗ El máximo es 80%`;
  }
}

async function cotConfEngInput(pL, btn) {
  // Evitar doble clic: se deshabilita de inmediato al presionar
  if (btn) {
    if (btn.disabled) return;
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.textContent = 'Guardando...';
  }
  const val = parseFloat(document.getElementById('inputEnganche')?.value) || 0;
  const min = engMin(pL);
  const max = engMax(pL);
  if (val < min) {
    await addBubble(`El enganche mínimo es ${fmt(min)} (40%).`, 'agent');
    if (btn) { btn.disabled = false; btn.style.opacity = '1'; btn.textContent = 'Usar este enganche'; }
    return;
  }
  if (val > max) {
    await addBubble(`El enganche máximo es ${fmt(max)} (80%).`, 'agent');
    if (btn) { btn.disabled = false; btn.style.opacity = '1'; btn.textContent = 'Usar este enganche'; }
    return;
  }
  state.enganche = val;
  document.getElementById('inputEnganche').disabled = true;
  document.getElementById('inputEnganchePct').disabled = true;
  // Se quita el botón por completo para que no se pueda volver a picar
  if (btn) btn.remove();
  await addBubble(`Enganche: ${fmt(val)}`, 'user');
  await cotPedirAsesor();
}

async function cotPedirAsesor() {
  disableWidgets();
  step = 'cotAsesor';
  setProgress(3, 3);
  await typing(500);
  await addBubble('¿Quién atiende? Escribe el nombre del asesor:', 'agent');
  showInput('Nombre del asesor...');
}

// (La función generarPDF real vive en impresion.js — aquí ya no se
// vuelve a declarar para no pisarla con una versión que no funciona)

// ── CATÁLOGO (placeholder, se implementa después) ──
function abrirCatalogo() {
  // Todavía no hace nada — aquí se conectará la función de
  // administración del catálogo más adelante.
}

// ── ÚLTIMA COTIZACIÓN (placeholder, se implementa después) ──
function ultimaCotizacion() {
  // Todavía no hace nada — solo referencia visual por ahora.
  // Aquí se conectará la función para mostrar la última cotización guardada.
}

// ── ABRIR ÚLTIMA COTIZACIÓN (placeholder, se implementa después) ──
function abrirUltimaCotizacion() {
  // Todavía no hace nada — solo referencia visual por ahora.
  // Aquí se conectará la función para abrir/recuperar la última cotización guardada.
}

// ── REINICIO ──
async function reiniciar() {
  state = {};
  step = 0;
  activeCat = Object.keys(CATALOGO)[0];
  chat.innerHTML = '';
  s0_bienvenida();
}

// Iniciar
s0_bienvenida();