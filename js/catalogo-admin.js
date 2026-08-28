// ═══════════════════════════════════════════════
// CATALOGO-ADMIN.JS — Administración del catálogo
// (candado con clave, editar en modal, eliminar)
//
// No reemplaza a CATALOGO (definido en datos.js): lo
// complementa. Los cambios se guardan en localStorage
// y se reaplican sobre CATALOGO en cada carga, para no
// perder el trabajo del asesor entre sesiones.
// ═══════════════════════════════════════════════

const ADMIN_PASSWORD = 'admin'; // clave temporal, solo para pruebas
const ADMIN_STORAGE_KEY = 'betha_catalogo_overrides';

let adminUnlocked = false;
let adminCatActiva = null;
let adminEditandoId = null; // moto que está abierta en el modal de edición

// ── Persistencia de ediciones/eliminaciones ──
function leerOverridesAdmin() {
  try {
    const { edits = {}, deleted = [] } = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY)) || {};
    return { edits, deleted };
  } catch (e) { return { edits: {}, deleted: [] }; }
}

function guardarOverridesAdmin(overrides) {
  try { localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(overrides)); } catch (e) { /* localStorage no disponible: sigue funcionando solo en esta sesión */ }
}

// Se ejecuta una sola vez, justo después de cargar datos.js.
(function aplicarOverridesAlCargar() {
  const { edits, deleted } = leerOverridesAdmin();
  Object.keys(CATALOGO).forEach(cat => {
    CATALOGO[cat] = CATALOGO[cat].filter(m => !deleted.includes(m.id));
    CATALOGO[cat].forEach(m => { if (edits[m.id]) Object.assign(m, edits[m.id]); });
  });
})();

function encontrarMotoYCategoria(id) {
  for (const cat of Object.keys(CATALOGO)) {
    const m = CATALOGO[cat].find(x => x.id === id);
    if (m) return { moto: m, cat };
  }
  return null;
}

function refrescarCatalogoSiVisible() {
  if (typeof renderCatalog === 'function' && document.getElementById('catalog-widget')) renderCatalog();
}

// ── ABRIR / CANDADO ──
function abrirAdminCatalogo() {
  adminUnlocked = false;
  renderAdminGate();
  abrirModal('modalAdmin');
}

function renderAdminGate() {
  document.getElementById('adminBodyContainer').innerHTML = `
    <div class="admin-gate">
      <div class="admin-gate-icon">🔒</div>
      <div class="admin-gate-title">Acceso protegido</div>
      <div class="admin-gate-sub">Ingresa la clave para editar precios, bonos, unidades, año, color o eliminar motocicletas del catálogo.</div>
      <div class="field-wrap" style="width:100%;max-width:260px;">
        <input class="field-input" type="password" id="adminPassInput" placeholder="Clave de acceso" onkeydown="if(event.key==='Enter') intentarAccesoAdmin()">
        <div class="admin-error" id="adminGateError"></div>
      </div>
      <button class="btn-primary" style="max-width:260px;" onclick="intentarAccesoAdmin()">Entrar</button>
    </div>`;
  setTimeout(() => document.getElementById('adminPassInput')?.focus(), 50);
}

function intentarAccesoAdmin() {
  const val = document.getElementById('adminPassInput')?.value || '';
  if (val !== ADMIN_PASSWORD) {
    document.getElementById('adminGateError').textContent = 'Clave incorrecta, intenta de nuevo.';
    return;
  }
  adminUnlocked = true;
  renderAdminPanel();
}

// ── LISTADO POR CATEGORÍA ──
function renderAdminPanel() {
  if (!adminCatActiva) adminCatActiva = Object.keys(CATALOGO)[0];
  const cats = Object.keys(CATALOGO);
  const catsHtml = `<div class="admin-cats">${cats.map(c =>
    `<button class="admin-cat-btn${c === adminCatActiva ? ' active' : ''}" onclick="adminCatActiva='${c}';renderAdminPanel();">${c}</button>`
  ).join('')}</div>`;

  const itemsHtml = CATALOGO[adminCatActiva].map(renderAdminItem).join('') ||
    `<div class="gallery-empty">No hay motocicletas en esta categoría.</div>`;

  document.getElementById('adminBodyContainer').innerHTML = `${catsHtml}<div>${itemsHtml}</div>`;
}

function renderAdminItem(m) {
  return `
    <div class="admin-item">
      <div class="admin-item-row">
        <div>
          <div class="admin-item-name">${m.modelo}</div>
          <div class="admin-item-sub">${m.clave} · Año ${m.anio || '—'} · Precio ${fmt(m.precio)} · ${m.unidades ?? 0} unid.</div>
        </div>
        <div class="admin-item-actions">
          <button class="admin-mini-btn" onclick="abrirEdicionMoto('${m.id}')">✏️ Editar</button>
          <button class="admin-mini-btn danger" onclick="confirmarEliminarMoto('${m.id}')">🗑️ Eliminar</button>
        </div>
      </div>
    </div>`;
}

// ── MODAL DE EDICIÓN (apilado sobre "Administrar catálogo") ──
function abrirEdicionMoto(id) {
  const found = encontrarMotoYCategoria(id);
  if (!found) return;
  adminEditandoId = id;
  const m = found.moto;
  document.getElementById('editMotoBody').innerHTML = `
    <div class="admin-edit-form">
      <div class="field-item full">
        <label class="field-label">Modelo</label>
        <input class="field-input" id="edit-modelo">
      </div>
      <div class="field-item">
        <label class="field-label">Precio de lista</label>
        <input class="field-input" type="number" id="edit-precio">
      </div>
      <div class="field-item">
        <label class="field-label">Bono</label>
        <input class="field-input" type="number" id="edit-bono">
      </div>
      <div class="field-item">
        <label class="field-label">Unidades</label>
        <input class="field-input" type="number" id="edit-unidades">
      </div>
      <div class="field-item">
        <label class="field-label">Año</label>
        <input class="field-input" type="number" id="edit-anio">
      </div>
      <div class="field-item full">
        <label class="field-label">Colores (separados por coma)</label>
        <input class="field-input" id="edit-colores">
      </div>
      <div class="admin-error field-item full" id="editMotoError"></div>
    </div>`;
  // Se llenan los valores por separado para no romper el HTML si el
  // modelo o los colores llegaran a incluir comillas.
  document.getElementById('edit-modelo').value = m.modelo;
  document.getElementById('edit-precio').value = m.precio;
  document.getElementById('edit-bono').value = m.bono || 0;
  document.getElementById('edit-unidades').value = m.unidades ?? 0;
  document.getElementById('edit-anio').value = m.anio || '';
  document.getElementById('edit-colores').value = (m.colores || []).join(', ');

  document.getElementById('modalEditarMotoTitulo').textContent = `Editar — ${m.modelo}`;
  abrirModal('modalEditarMoto');
}

function guardarEdicionMoto() {
  const found = encontrarMotoYCategoria(adminEditandoId);
  if (!found) return;

  const modelo = document.getElementById('edit-modelo').value.trim();
  const precio = parseFloat(document.getElementById('edit-precio').value);
  const errorBox = document.getElementById('editMotoError');

  // Validaciones mínimas para no guardar datos inválidos por error de captura
  if (!modelo) { errorBox.textContent = 'El modelo no puede quedar vacío.'; return; }
  if (isNaN(precio) || precio <= 0) { errorBox.textContent = 'El precio de lista debe ser mayor a $0.'; return; }
  errorBox.textContent = '';

  const cambios = {
    modelo,
    precio,
    bono: parseFloat(document.getElementById('edit-bono').value) || 0,
    unidades: parseInt(document.getElementById('edit-unidades').value, 10) || 0,
    anio: parseInt(document.getElementById('edit-anio').value, 10) || found.moto.anio,
    colores: document.getElementById('edit-colores').value.split(',').map(c => c.trim()).filter(Boolean),
  };
  Object.assign(found.moto, cambios);

  const overrides = leerOverridesAdmin();
  overrides.edits[adminEditandoId] = { ...(overrides.edits[adminEditandoId] || {}), ...cambios };
  guardarOverridesAdmin(overrides);

  cerrarModal('modalEditarMoto');
  renderAdminPanel();
  refrescarCatalogoSiVisible();
}

function confirmarEliminarMoto(id) {
  const found = encontrarMotoYCategoria(id);
  if (!found) return;
  if (!confirm(`¿Deseas eliminar "${found.moto.modelo}" del catálogo? Esta acción no se puede deshacer.`)) return;

  CATALOGO[found.cat] = CATALOGO[found.cat].filter(m => m.id !== id);

  const overrides = leerOverridesAdmin();
  if (!overrides.deleted.includes(id)) overrides.deleted.push(id);
  delete overrides.edits[id];
  guardarOverridesAdmin(overrides);

  renderAdminPanel();
  refrescarCatalogoSiVisible();
}
