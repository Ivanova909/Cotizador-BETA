// ═══════════════════════════════════════════════
// FUNCIONES.JS — Fórmulas puras de cálculo
// (reciben datos, regresan un resultado; no tocan
// el HTML ni la pantalla directamente)
// ═══════════════════════════════════════════════

// funciones.js
const pContadoBase = p => Math.round(p * 0.95);          // descuento base sin bono
const pContado = (p, bono = 0) => Math.max(0, Math.round(p * 0.95 - bono));
const p3meses = p => p * 0.97;
const engMin = p => p * 0.40;
const engMax = p => Math.floor(p * 0.80);
const mensual3 = (p, e) => (p3meses(p) - e) / 3;
const mensualN = (p, e, n) => ((p - e) * (1 + 0.02 * n)) / n;
const fmt = n => '$' + Math.round(n).toLocaleString('es-MX');
const TODAY = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });