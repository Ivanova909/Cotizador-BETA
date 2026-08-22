// ═══════════════════════════════════════════════
// DATOS.JS — Catálogo de motos con BONO, COLORES y AÑO
// (estructura agrupada por categoría)
// ═══════════════════════════════════════════════

const CATALOGO = {
  "Scooter": [
    { id: "x_max_tech_max", clave: "—", modelo: "X MAX TECH MAX", precio: 178947, icon: "🛵", img: "img/motos/scooter/xmax_tech_max.jpg", bono: 0, anio: 2026, colores: ["Negro", "Gris"], imagenes: {} },
    { id: "x_max_2025", clave: "CZD300BS", modelo: "X MAX (2025)", precio: 170526, icon: "🛵", img: "img/motos/scooter/X MAX (2025).jpg", bono: 2000, anio: 2025, colores: ["Negro", "Gris"], imagenes: {} },
    { id: "x_max_2026", clave: "CZD300BT", modelo: "X MAX (2026)", precio: 172631, icon: "🛵", img: "img/motos/scooter/X MAX (2026).jpg", bono: 2000, anio: 2026, colores: ["Negro", "Gris"], imagenes: {} },
    { id: "fascino", clave: "LCX125BS", modelo: "FASCINO", precio: 49473, icon: "🛵", img: "img/motos/scooter/FASCINO.jpg", bono: 1000, anio: 2025, colores: ["Azul Mate", "Rojo"], imagenes: {} },
    { id: "t_max_2026", clave: "XP560", modelo: "T-MAX (2026)", precio: 387368, icon: "🛵", img: "img/motos/scooter/T-MAX (2025).jpg", bono: 0, anio: 2026, colores: ["Negro", "Gris"], imagenes: {} },
    { id: "n_max_2025", clave: "GPD155BS", modelo: "N-MAX (2025)", precio: 104736, icon: "🛵", img: "img/motos/scooter/N-MAX (2025).jpg", bono: 0, anio: 2025, colores: ["Blanco", "Negro"], imagenes: {} },
    { id: "n_max_2026", clave: "GPD155BT", modelo: "N-MAX (2026)", precio: 105262, icon: "🛵", img: "img/motos/scooter/N-MAX (2026).jpg", bono: 0, anio: 2026, colores: ["Blanco", "Negro"], imagenes: {} },
    { id: "t_max_2025", clave: "XP560DZ4", modelo: "T-MAX (2025)", precio: 385262, icon: "🛵", img: "img/motos/scooter/T-MAX (2025).jpg", bono: 0, anio: 2025, colores: ["Negro", "Gris"], imagenes: {} },
    { id: "ray_zr_125_2025", clave: "LCG125BS", modelo: "RAY ZR 125 (2025)", precio: 57367, icon: "🛵", img: "img/motos/scooter/RAY_ZR_125.jpg", bono: 0, anio: 2025, colores: ["Negro", "Blanco"], imagenes: {} },
    { id: "ray_zr_125_2026", clave: "LCG125BT", modelo: "RAY ZR 125 (2026)", precio: 57894, icon: "🛵", img: "img/motos/scooter/RAY_ZR_125.jpg", bono: 0, anio: 2026, colores: ["Negro", "Blanco"], imagenes: {} },
    { id: "cygnus_ray_zr_2025", clave: "XC115BNS", modelo: "CYGNUS RAY ZR (2025)", precio: 40525, icon: "🛵", img: "img/motos/scooter/CYGNUS_RAY_ZR.jpg", bono: 0, anio: 2025, colores: ["Negro", "Blanco"], imagenes: {} },
    { id: "cygnus_ray_zr_2026", clave: "XC115BNT", modelo: "CYGNUS RAY ZR (2026)", precio: 41052, icon: "🛵", img: "img/motos/scooter/CYGNUS_RAY_ZR.jpg", bono: 0, anio: 2026, colores: ["Negro", "Blanco"], imagenes: {} }
  ],
  "Trabajo": [
    { id: "ybr_125zr_2025", clave: "YB125ZR", modelo: "YBR 125ZR (2025)", precio: 45789, icon: "🏍️", img: "img/motos/trabajo/YBR_125ZR.jpg", bono: 0, anio: 2025, colores: ["Rojo", "Negro"], imagenes: {} },
    { id: "yb_125", clave: "YB125BR", modelo: "YB 125", precio: 39999, icon: "🏍️", img: "img/motos/trabajo/YB_125.jpg", bono: 0, anio: 2025, colores: ["Rojo", "Negro"], imagenes: {} },
    { id: "ybr_125c_express_2025", clave: "YBR125CBS", modelo: "YBR 125C EXPRESS (2025)", precio: 41052, icon: "🏍️", img: "img/motos/trabajo/YBR_125C_EXPRESS.jpg", bono: 0, anio: 2025, colores: ["Blanco", "Rojo"], imagenes: {} },
    { id: "ybr_125c_express_2026", clave: "YBR125CBS", modelo: "YBR 125C EXPRESS (2026)", precio: 41052, icon: "🏍️", img: "img/motos/trabajo/YBR_125C_EXPRESS.jpg", bono: 0, anio: 2026, colores: ["Blanco", "Rojo"], imagenes: {} },
    { id: "crypton_115_fi_2026", clave: "T115CBT", modelo: "CRYPTON 115 FI (2026)", precio: 37894, icon: "🏍️", img: "img/motos/trabajo/CRYPTON_115_FI.jpg", bono: 0, anio: 2026, colores: ["Negro", "Azul"], imagenes: {} }
  ],
  "Street": [
    { id: "fz_s_v3_0_2026", clave: "FZSBT", modelo: "FZ S V3.0 (2026)", precio: 66315, icon: "🏍️", img: "img/motos/street/FZ_S_V3.0.jpg", bono: 1500, anio: 2026, colores: ["Negro Mate", "Azul"], imagenes: {} },
    { id: "fz_s_v4_0_abs_2025", clave: "FZSBR", modelo: "FZ S V4.0 ABS (2025)", precio: 70525, icon: "🏍️", img: "img/motos/street/FZ_S_V4.0_ABS.jpg", bono: 0, anio: 2025, colores: ["Negro", "Azul"], imagenes: {} },
    { id: "fz_s_v4_0_abs_2026", clave: "FZSBR", modelo: "FZ S V4.0 ABS (2026)", precio: 71578, icon: "🏍️", img: "img/motos/street/FZ_S_V4.0_ABS.jpg", bono: 0, anio: 2026, colores: ["Negro", "Azul"], imagenes: {} },
    { id: "fz_25_abs_2025", clave: "FZ25BS6", modelo: "FZ 25 ABS (2025)", precio: 93683, icon: "🏍️", img: "img/motos/street/FZ_25_ABS.jpg", bono: 0, anio: 2025, colores: ["Negro", "Gris"], imagenes: {} },
    { id: "fz_25_abs_2026", clave: "FZ25BS6", modelo: "FZ 25 ABS (2026)", precio: 94736, icon: "🏍️", img: "img/motos/street/FZ_25_ABS.jpg", bono: 0, anio: 2026, colores: ["Negro", "Gris"], imagenes: {} },
    { id: "fz_25_abs_classic_2025", clave: "FZ25BS", modelo: "FZ 25 ABS Classic (2025)", precio: 91578, icon: "🏍️", img: "img/motos/street/FZ_25_ABS_Classic.jpg", bono: 0, anio: 2025, colores: ["Negro", "Gris"], imagenes: {} },
    { id: "fz_s_v2_0_2026", clave: "FZSV2BT", modelo: "FZ S V2.0 (2026)", precio: 59999, icon: "🏍️", img: "img/motos/street/FZ_S_V2.0.jpg", bono: 0, anio: 2026, colores: ["Negro", "Azul"], imagenes: {} }
  ],
  "Deportiva": [
    { id: "mt_15_2025", clave: "MTN155BS", modelo: "MT-15 (2025)", precio: 102105, icon: "🏁", img: "img/motos/deportiva/MT-15.jpg", bono: 0, anio: 2025, colores: ["Cyan Storm", "Ice Fluo"], imagenes: {} },
    { id: "mt_15_2026", clave: "MTN155BT", modelo: "MT-15 (2026)", precio: 103157, icon: "🏁", img: "img/motos/deportiva/MT-15.jpg", bono: 0, anio: 2026, colores: ["Cyan Storm", "Ice Fluo"], imagenes: {} },
    { id: "mt_03_abs_2025", clave: "MTN320BT", modelo: "MT-03 ABS (2025)", precio: 164210, icon: "🏁", img: "img/motos/deportiva/MT-03_ABS.jpg", bono: 3000, anio: 2025, colores: ["Negro", "Azul Icon"], imagenes: {} },
    { id: "mt_03_abs_2026", clave: "MTN320BS", modelo: "MT-03 ABS (2026)", precio: 165262, icon: "🏁", img: "img/motos/deportiva/MT-03_ABS.jpg", bono: 3000, anio: 2026, colores: ["Negro", "Azul Icon"], imagenes: {} },
    { id: "mt_07_2025", clave: "MTN69U1S", modelo: "MT-07 (2025)", precio: 273684, icon: "🏁", img: "img/motos/deportiva/MT-07.jpg", bono: 0, anio: 2025, colores: ["Negro", "Azul"], imagenes: {} },
    { id: "mt_07_2026", clave: "MTN69U1T", modelo: "MT-07 (2026)", precio: 278946, icon: "🏁", img: "img/motos/deportiva/MT-07.jpg", bono: 0, anio: 2026, colores: ["Negro", "Azul"], imagenes: {} },
    { id: "mt_09_2025", clave: "MT9AU9S", modelo: "MT-09 (2025)", precio: 321052, icon: "🏁", img: "img/motos/deportiva/MT-09.jpg", bono: 0, anio: 2025, colores: ["Negro", "Azul"], imagenes: {} },
    { id: "mt_09_2026", clave: "MT9AU9T", modelo: "MT-09 (2026)", precio: 326315, icon: "🏁", img: "img/motos/deportiva/MT-09.jpg", bono: 0, anio: 2026, colores: ["Negro", "Azul"], imagenes: {} }
  ],
  "Super Dep.": [
    { id: "yzf_r15_v4_0_2025", clave: "YZFR15BS", modelo: "YZF-R15 V4.0 (2025)", precio: 107368, icon: "🏎️", img: "img/motos/super_dep/YZF-R15_V4.0.jpg", bono: 0, anio: 2025, colores: ["Racing Blue", "Negro"], imagenes: {} },
    { id: "yzf_r15_v4_0_2026", clave: "YZFR15BT", modelo: "YZF-R15 V4.0 (2026)", precio: 108420, icon: "🏎️", img: "img/motos/super_dep/YZF-R15_V4.0.jpg", bono: 0, anio: 2026, colores: ["Racing Blue", "Negro"], imagenes: {} },
    { id: "yzf_r3_2026", clave: "YZFR3BT", modelo: "YZF-R3 (2026)", precio: 168420, icon: "🏎️", img: "img/motos/super_dep/YZF-R3.jpg", bono: 0, anio: 2026, colores: ["Azul", "Negro"], imagenes: {} },
    { id: "yzf_r7_2026", clave: "YZF69Z", modelo: "YZF-R7 (2026)", precio: 289473, icon: "🏎️", img: "img/motos/super_dep/YZF-R7.jpg", bono: 0, anio: 2026, colores: ["Azul", "Negro"], imagenes: {} },
    { id: "yzf_r9_2026", clave: "YZFR9BT", modelo: "YZF-R9 (2026)", precio: 378947, icon: "🏎️", img: "img/motos/super_dep/YZF-R9.jpg", bono: 0, anio: 2026, colores: ["Negro", "Azul"], imagenes: {} },
    { id: "yzf_r1_2026", clave: "YZFR1SCUM", modelo: "YZF-R1 (2026)", precio: 568420, icon: "🏎️", img: "img/motos/super_dep/YZF-R1.jpg", bono: 0, anio: 2026, colores: ["Negro", "Blanco"], imagenes: {} }
  ],
  "Doble Prop.": [
    { id: "ybr_125g_2025", clave: "YBR125EGBRS", modelo: "YBR 125G (2025)", precio: 51052, icon: "🏕️", img: "img/motos/doble_prop/YBR_125G.jpg", bono: 0, anio: 2025, colores: ["Azul", "Blanco"], imagenes: {} },
    { id: "ybr_125g_2026", clave: "YBR125EGBRT", modelo: "YBR 125G (2026)", precio: 51578, icon: "🏕️", img: "img/motos/doble_prop/YBR_125G.jpg", bono: 0, anio: 2026, colores: ["Azul", "Blanco"], imagenes: {} },
    { id: "xtz_125e_2025", clave: "XTZ125EBS", modelo: "XTZ 125E (2025)", precio: 53157, icon: "🏕️", img: "img/motos/doble_prop/XTZ_125E.jpg", bono: 0, anio: 2025, colores: ["Azul", "Blanco"], imagenes: {} },
    { id: "xtz_125e_2026", clave: "XTZ125EBT", modelo: "XTZ 125E (2026)", precio: 53157, icon: "🏕️", img: "img/motos/doble_prop/XTZ_125E.jpg", bono: 0, anio: 2026, colores: ["Azul", "Blanco"], imagenes: {} },
    { id: "xtz_150_2025", clave: "XTZ150EBS", modelo: "XTZ 150 (2025)", precio: 69999, icon: "🏕️", img: "img/motos/doble_prop/XTZ_150.jpg", bono: 0, anio: 2025, colores: ["Marrón", "Azul"], imagenes: {} },
    { id: "xtz_150_2026", clave: "XTZ150EBT", modelo: "XTZ 150 (2026)", precio: 70526, icon: "🏕️", img: "img/motos/doble_prop/XTZ_150.jpg", bono: 0, anio: 2026, colores: ["Marrón", "Azul"], imagenes: {} },
    { id: "xtz_250_lander", clave: "XTZ250BN", modelo: "XTZ 250 LANDER", precio: 145262, icon: "🏕️", img: "img/motos/doble_prop/XTZ_250_LANDER.jpg", bono: 0, anio: 2026, colores: ["Negro", "Azul"], imagenes: {} },
    { id: "tracer_9_gt", clave: "—", modelo: "TRACER 9 GT", precio: 421052, icon: "🏕️", img: "img/motos/doble_prop/TRACER_9_GT.jpg", bono: 0, anio: 2026, colores: ["Negro", "Azul"], imagenes: {} },
    { id: "tenere_700_2026", clave: "TENERE700", modelo: "Ténéré 700 (2026)", precio: 357894, icon: "🏕️", img: "img/motos/doble_prop/Tenere_700.jpg", bono: 0, anio: 2026, colores: ["Icon Blue", "Tech Kamo"], imagenes: {} },
    { id: "super_tenere_1200z_2024", clave: "XT12UM", modelo: "Super Ténéré 1200Z (2024)", precio: 442105, icon: "🏕️", img: "img/motos/doble_prop/Super_Tenere_1200Z.jpg", bono: 0, anio: 2024, colores: ["Negro", "Azul"], imagenes: {} }
  ],
  "Off Road": [
    { id: "pw50_2025", clave: "PW50FS", modelo: "PW50 (2025)", precio: 59999, icon: "🤸", img: "img/motos/off_road/PW50.jpg", bono: 0, anio: 2025, colores: ["Amarillo", "Negro"], imagenes: {} },
    { id: "yz85_2025", clave: "YZ85LWF5", modelo: "YZ85 (2025)", precio: 149473, icon: "🤸", img: "img/motos/off_road/YZ85.jpg", bono: 0, anio: 2025, colores: ["Azul", "Blanco"], imagenes: {} },
    { id: "yz85_2026", clave: "YZ85LWF6", modelo: "YZ85 (2026)", precio: 149473, icon: "🤸", img: "img/motos/off_road/YZ85.jpg", bono: 0, anio: 2026, colores: ["Azul", "Blanco"], imagenes: {} },
    { id: "yz_125", clave: "YZ125BP", modelo: "YZ 125", precio: 198947, icon: "🤸", img: "img/motos/off_road/YZ_125.jpg", bono: 0, anio: 2026, colores: ["Azul", "Blanco"], imagenes: {} },
    { id: "yz_65", clave: "YZ65BP", modelo: "YZ 65", precio: 127367, icon: "🤸", img: "img/motos/off_road/YZ_65.jpg", bono: 0, anio: 2026, colores: ["Azul", "Blanco"], imagenes: {} },
    { id: "yz250f_2025", clave: "YZ250FF3", modelo: "YZ250F (2025)", precio: 236841, icon: "🤸", img: "img/motos/off_road/YZ250F.jpg", bono: 0, anio: 2025, colores: ["Azul", "Blanco"], imagenes: {} },
    { id: "yz250f_2026", clave: "YZ250FF3", modelo: "YZ250F (2026)", precio: 236841, icon: "🤸", img: "img/motos/off_road/YZ250F.jpg", bono: 0, anio: 2026, colores: ["Azul", "Blanco"], imagenes: {} },
    { id: "yz250fx_2025", clave: "YZ250FXOM", modelo: "YZ250FX (2025)", precio: 242104, icon: "🤸", img: "img/motos/off_road/YZ250FX.jpg", bono: 0, anio: 2025, colores: ["Azul", "Blanco"], imagenes: {} },
    { id: "yz450f_2026", clave: "YZ450FF2", modelo: "YZ450F (2026)", precio: 242104, icon: "🤸", img: "img/motos/off_road/YZ450F.jpg", bono: 0, anio: 2026, colores: ["Azul", "Blanco"], imagenes: {} },
    { id: "yz450fx_2025", clave: "YZ450FXO2", modelo: "YZ450FX (2025)", precio: 242104, icon: "🤸", img: "img/motos/off_road/YZ450FX.jpg", bono: 0, anio: 2025, colores: ["Azul", "Blanco"], imagenes: {} }
  ],
  "ATV": [
    { id: "kodiak_450_2024", clave: "—", modelo: "KODIAK 450 (2024)", precio: 231578, icon: "🚜", img: "img/motos/atv/KODIAK_450.jpg", bono: 0, anio: 2024, colores: ["Verde", "Negro"], imagenes: {} },
    { id: "kodiak_450_2025", clave: "—", modelo: "KODIAK 450 (2025)", precio: 231578, icon: "🚜", img: "img/motos/atv/KODIAK_450.jpg", bono: 0, anio: 2025, colores: ["Verde", "Negro"], imagenes: {} },
    { id: "grizzly_700g_2025", clave: "YFM70GN", modelo: "GRIZZLY 700G (2025)", precio: 315788, icon: "🚜", img: "img/motos/atv/GRIZZLY_700G.jpg", bono: 0, anio: 2025, colores: ["Verde", "Negro"], imagenes: {} },
    { id: "grizzly_700g_eps_xt_r", clave: "YFM70GS", modelo: "GRIZZLY 700G EPS XT-R", precio: 326315, icon: "🚜", img: "img/motos/atv/GRIZZLY_700G_EPS_XT-R.jpg", bono: 0, anio: 2026, colores: ["Verde", "Negro"], imagenes: {} },
    { id: "drive_2_ptv_2025", clave: "DRIVE2PTV", modelo: "DRIVE 2 PTV (2025)", precio: 263157, icon: "🚜", img: "img/motos/atv/DRIVE_2_PTV.jpg", bono: 0, anio: 2025, colores: ["Negro", "Rojo"], imagenes: {} },
    { id: "raptor_110r_2025", clave: "YFM110R", modelo: "RAPTOR 110R (2025)", precio: 93683, icon: "🚜", img: "img/motos/atv/RAPTOR_110R.jpg", bono: 0, anio: 2025, colores: ["Azul", "Blanco"], imagenes: {} },
    { id: "raptor_110r_2026", clave: "YFM110R", modelo: "RAPTOR 110R (2026)", precio: 94735, icon: "🚜", img: "img/motos/atv/RAPTOR_110R.jpg", bono: 0, anio: 2026, colores: ["Azul", "Blanco"], imagenes: {} }
  ]
};
// Exportar (si se usa módulo, pero en el entorno actual es global)
// window.CATALOGO = CATALOGO;