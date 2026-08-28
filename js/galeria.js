// ═══════════════════════════════════════════════
// GALERIA.JS — Galería por modelo (en pausa)
//
// El botón se queda visible para no perder el lugar que ya
// tiene en el diseño, pero la vista completa (selector +
// fotos por color) se retira hasta que existan las fotografías
// reales. Cuando estén listas, se puede recuperar la versión
// completa (usa moto.imagenes[color] definido en datos.js).
// ═══════════════════════════════════════════════

function abrirGaleria() {
  document.getElementById('galeriaBodyContainer').innerHTML = `
    <div class="gallery-empty">
      <div class="gallery-empty-icon">🖼️</div>
      <div><strong>Muy pronto</strong></div>
      <div>En cuanto tengamos las fotografías por modelo y color, aquí podrás consultarlas.</div>
    </div>`;
  abrirModal('modalGaleria');
}
