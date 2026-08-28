// ═══════════════════════════════════════════════
// VISTA.JS — Estado global + funciones de vista
// (burbujas, widgets, barra de progreso, input)
// ═══════════════════════════════════════════════

let step = 0;
let state = {};
let activeCat = Object.keys(CATALOGO)[0];
let selectedPlazo = 6;
let appMode = '';

const chat = document.getElementById('chat');
const inputArea = document.getElementById('inputArea');

// ── BARRA DE PROGRESO ──
function setProgress(s, total = 3) {
  document.getElementById('stepLabel').textContent = s;
  document.getElementById('stepTotal').textContent = total;
  document.getElementById('progressBar').style.width = (s / total * 100) + '%';
}

// ── MOSTRAR/OCULTAR INPUT ──
function hideInput() {
  inputArea.style.display = 'none';
}

function showInput(ph = 'Escribe aquí...') {
  inputArea.style.display = 'flex';
  const inp = document.getElementById('userInput');
  inp.placeholder = ph;
  inp.value = '';
  inp.focus();
}

// ── BURBUJAS DE CHAT ──
function addBubble(html, type = 'agent', delay = 0, scroll = true) {
  return new Promise(res => {
    setTimeout(() => {
      const b = document.createElement('div');
      b.className = 'bubble ' + type;
      b.innerHTML = html;
      chat.appendChild(b);
      if (scroll) b.scrollIntoView({ behavior: 'auto', block: 'end' });
      res();
    }, delay);
  });
}

// ── WIDGETS (componentes incrustados en el chat) ──
function addWidget(html, delay = 0, scroll = true) {
  return new Promise(res => {
    setTimeout(() => {
      const w = document.createElement('div');
      w.className = 'widget';
      w.innerHTML = html;
      chat.appendChild(w);
      if (scroll) w.scrollIntoView({ behavior: 'auto', block: 'end' });
      res();
    }, delay);
  });
}

// ── ANIMACIÓN DE ESCRITURA (typing) ──
function typing(ms = 250, scroll = true) {
  return new Promise(res => {
    const id = 'tp' + Date.now();
    const t = document.createElement('div');
    t.className = 'typing';
    t.id = id;
    t.innerHTML = '<span></span><span></span><span></span>';
    chat.appendChild(t);
    if (scroll) t.scrollIntoView({ behavior: 'auto', block: 'end' });
    setTimeout(() => {
      document.getElementById(id)?.remove();
      res();
    }, ms);
  });
}

// ── DESHABILITAR WIDGETS (evitar múltiples clics) ──
function disableWidgets() {
  document.querySelectorAll('.opt-btn, .cat-btn, .moto-card, .color-pill, .field-input, #btnConfEnganche').forEach(el => {
    el.disabled = true;
    el.style.pointerEvents = 'none';
    el.style.opacity = '0.6';
  });
}

// Nota: reiniciar() vive en flujo.js (ahí se orquesta todo el flujo).