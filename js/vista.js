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
function addBubble(html, type = 'agent', delay = 0) {
  return new Promise(res => {
    setTimeout(() => {
      const b = document.createElement('div');
      b.className = 'bubble ' + type;
      b.innerHTML = html;
      chat.appendChild(b);
      chat.scrollTop = chat.scrollHeight;
      res();
    }, delay);
  });
}

// ── WIDGETS (componentes incrustados en el chat) ──
function addWidget(html, delay = 0) {
  return new Promise(res => {
    setTimeout(() => {
      const w = document.createElement('div');
      w.className = 'widget';
      w.innerHTML = html;
      chat.appendChild(w);
      chat.scrollTop = chat.scrollHeight;
      res();
    }, delay);
  });
}

// ── ANIMACIÓN DE ESCRITURA (typing) ──
function typing(ms = 250) {
  return new Promise(res => {
    const id = 'tp' + Date.now();
    const t = document.createElement('div');
    t.className = 'typing';
    t.id = id;
    t.innerHTML = '<span></span><span></span><span></span>';
    chat.appendChild(t);
    chat.scrollTop = chat.scrollHeight;
    setTimeout(() => {
      document.getElementById(id)?.remove();
      res();
    }, ms);
  });
}

// ── DESHABILITAR WIDGETS (evitar múltiples clics) ──
function disableWidgets() {
  document.querySelectorAll('.opt-btn, .cat-btn, .moto-card, .color-pill').forEach(el => {
    el.disabled = true;
    el.style.pointerEvents = 'none';
    el.style.opacity = '0.6';
  });
}

// ── REINICIO (función vacía, se implementa en flujo.js) ──
// Esta función se sobrescribe en flujo.js
async function reiniciar() {
  state = {};
  step = 0;
  activeCat = Object.keys(CATALOGO)[0];
  chat.innerHTML = '';
  s0_bienvenida(); // definida en flujo.js
}