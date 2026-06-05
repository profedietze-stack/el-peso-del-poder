"use strict";

export const HERITAGE_PROFILES = [
  {
    id: 'populista',
    emoji: '📣',
    name: 'Gobierno Populista',
    desc: 'Cuatro años de gasto público sin freno, subsidios masivos y emisión monetaria. Alta popularidad, pero las cuentas no cierran.',
    flavor: 'Asumís con el corazón de la gente, pero el Banco Central sin reservas y la inflación disparada.',
    delta: { ipc:+22, deuda:+18, reservas:-20, riesgo:+15, pobreza:-8, desocupacion:-4, produccion:+5, confianza:+10 },
    bars: [
      { label:'Inflación', val:72, color:'#e74c3c' },
      { label:'Deuda',     val:58, color:'#e74c3c' },
      { label:'Reservas',  val:40, color:'#f39c12' },
      { label:'Confianza', val:75, color:'#27ae60' },
    ]
  },
  {
    id: 'ortodoxo',
    emoji: '📊',
    name: 'Gobierno Ortodoxo',
    desc: 'Ajuste fiscal severo, acuerdo con el FMI y apertura comercial. Las cuentas equilibradas, pero la pobreza y el desempleo son la herida abierta.',
    flavor: 'Asumís con reservas sólidas y riesgo país bajo, pero millones de familias en la cuerda floja social.',
    delta: { ipc:-10, deuda:-8, reservas:+18, riesgo:-12, pobreza:+14, desocupacion:+8, produccion:-8, confianza:-12 },
    bars: [
      { label:'Inflación', val:40, color:'#27ae60' },
      { label:'Reservas',  val:78, color:'#27ae60' },
      { label:'Pobreza',   val:49, color:'#e74c3c' },
      { label:'Desempleo', val:20, color:'#e74c3c' },
    ]
  },
  {
    id: 'crisis',
    emoji: '🆘',
    name: 'Herencia de Crisis',
    desc: 'El gobierno anterior colapsó antes de terminar su mandato. Corrida cambiaria, default técnico y un país paralizado.',
    flavor: 'Asumís en emergencia: todo está en rojo. La ciudadanía pide un milagro y los mercados, garantías.',
    delta: { ipc:+30, deuda:+25, reservas:-30, riesgo:+30, pobreza:+18, desocupacion:+10, produccion:-18, confianza:-5 },
    bars: [
      { label:'Inflación', val:80, color:'#e74c3c' },
      { label:'Reservas',  val:30, color:'#e74c3c' },
      { label:'Riesgo',    val:65, color:'#e74c3c' },
      { label:'Producción',val:42, color:'#f39c12' },
    ]
  },
  {
    id: 'estable',
    emoji: '⚖️',
    name: 'Herencia Equilibrada',
    desc: 'Un gobierno de transición sin grandes logros ni grandes desastres. Indicadores en zona media, sin deudas urgentes pero sin impulso.',
    flavor: 'Asumís sin fuego que apagar, pero también sin viento a favor. Todo depende de tus decisiones.',
    delta: { ipc:0, deuda:0, reservas:0, riesgo:0, pobreza:0, desocupacion:0, produccion:0, confianza:0 },
    bars: [
      { label:'Inflación', val:50, color:'#f39c12' },
      { label:'Reservas',  val:60, color:'#27ae60' },
      { label:'Pobreza',   val:35, color:'#f39c12' },
      { label:'Confianza', val:65, color:'#27ae60' },
    ]
  },
];

export const MANDATE_MODS = {
  amplio:    { confianza: +10, deuda: 0,  reservas: 0  },
  ajustado:  { confianza: -5,  deuda: 0,  reservas: 0  },
  coalicion: { confianza: +3,  deuda: +4, reservas: +5 },
};
