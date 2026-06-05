"use strict";

// ============================================================
// MAIN.JS — Entry point del juego El Peso del Poder v12
// Importa y coordina todos los módulos.
// ============================================================

import { CONFIG, IND_META }            from './config.js';
import { EVENTS }                      from './data/events.js';
import { ACHIEVEMENTS, checkAchievements } from './data/achievements.js';

import { G, setG, newState, pickNextEvent,
         updateAdata, pushHistory }    from './engine/state.js';
import { getScore, applyEffects,
         checkDefeat, computeReelection,
         getDiploma }                  from './engine/scoring.js';
import { saveToStorage, loadFromStorage,
         clearSave, hasSave,
         recordGameToGlobal }          from './engine/storage.js';

import { initAudio, resumeAudio, soundClick,
         soundNextTurn, soundWarn, soundCrisis,
         soundAchievement }            from './audio.js';

import { showDifficultyScreen }        from './features/difficulty.js';
import { updateAdvisorCredibility,
         resetAdvisorsForTurn,
         checkEmergencyMeetings,
         markEmergencyShown,
         showEmergencyModal,
         closeEmergencyModal,
         openCabinetModal,
         closeCabinetModal,
         showAdvisorModal }            from './features/advisors.js';
import { updateDangerTracking,
         checkAutoCrises,
         showCrisisWarning }           from './features/crisis-auto.js';

import { showScreen, flashAutosave,
         showNotif, hideNotif,
         toggleRecentLog, addLogEntry,
         renderYearMarkers }           from './ui/screens.js';
import { renderDashboard, updateMandateBar,
         initSparklines, pushSparkline,
         animateIndicatorChanges,
         renderActiveEffects }         from './ui/dashboard.js';
import { renderEvent, onOptionSelected,
         disableOptions, enableOptions } from './ui/event.js';
import { showHeritageScreen, selectMandate,
         confirmHeritage as _confirmHeritage } from './ui/heritage-ui.js';
import { showIdentityScreen,
         confirmIdentity }              from './ui/identity-ui.js';
import { showMinistersScreen,
         confirmMinistersSelection,
         getMinistersSelection }        from './ui/ministers-ui.js';
import { openTrophies, switchTrTab }   from './ui/trophies-ui.js';
import { showEndScreen, showCrisisOverlay,
         hideCrisisOverlay, captureResults } from './ui/endscreen.js';
import { openModal, closeModal,
         initGlosarioTooltips, openManual,
         confirmQuit }                 from './ui/modals.js';
import { generateNews, addToNewsHistory,
         generateInauguralNews }          from './features/news-engine.js';
import { initResignations, openResignConfirm, closeResignConfirm,
         confirmResign, openReplacementModal, closeReplacementModal,
         selectReplacement, getResignationCount }  from './features/resignations.js';
import { initTutorial }                           from './features/tutorial.js';
import { buildWarningEvent, showElectionResult,
         calcElectoralScore }                     from './features/midterm.js';
import { showMinisterModal }                      from './ui/minister-modal.js';
import { initSplash }                             from './ui/splash.js';
import { preloadUpcomingImages }                  from './ui/image-preloader.js';
import { applyInertia, applyActiveEffects,
         addActiveEffect }                        from './engine/effects.js';
import { renderNewsTicker, openNewsRoom,
         closeNewsRoom, switchNrTab }  from './ui/news-ui.js';
import { initTooltips, showTip,
         closeTip }                    from './ui/tooltip.js';

// ── REGISTRAR SERVICE WORKER ──────────────────────────────────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(console.warn);
}

// ── EXPONER A WINDOW para uso desde HTML onclick ──────────────
// (Necesario mientras el HTML use onclick="fn()" inline)
Object.assign(window, {
  startGame, loadGame, doQuit, restartGame, startSecondTerm,
  showScreen,               // usado por todos los botones "← Volver" del HTML
  openTrophies: () => openTrophies(G),
  openManual,
  selectMandate: el => selectMandate(el),
  confirmIdentity,
  confirmHeritage,
  confirmMinistersSelection,
  captureResults,
  closeModal,
  closeAdvisorModal:   () => import('./features/advisors.js').then(m => m.closeAdvisorModal()),
  closeEmergencyModal,
  goToEndScreen,
  toggleRecentLog,
  switchTrTab,
  // switchHistTab: endscreen.js lo expone directamente a window.switchHistTab
  showTip,
  closeTip,
  openNewsRoom: () => { if (G) openNewsRoom(G); },
  closeNewsRoom,
  switchNrTab,
  openCabinetModal: () => { if (G) openCabinetModal(G.currentEvent, G); },
  closeCabinetModal,
});

// ── ESTADO DE SESIÓN ──────────────────────────────────────────
// Nombre de display para la barra de mandato y pantalla final.
// Se forma como "Pte. García · Partido Renovación"
let _displayName   = '';
// Identidad del jugador, capturada en la pantalla de identidad
// y usada al construir el estado en confirmHeritage().
let _pendingIdentity = null;

// ── INIT ──────────────────────────────────────────────────────

// Abre el modal individual del asesor ENCIMA del gabinete (sin cerrarlo)
window.__openAdvisorFromCabinet = function(slotId) {
  if (G && G.currentEvent) {
    showAdvisorModal(slotId, G.currentEvent, G, /* fromCabinet */ true);
  }
};

// ── Sistema de renuncias (expuesto a window para onclick inline) ──
window.__openResignConfirm    = (slotId) => openResignConfirm(slotId);
window.__closeResignConfirm   = () => closeResignConfirm();
window.__confirmResign        = () => confirmResign();
window.__closeReplacementModal = () => closeReplacementModal();
window.__selectReplacement    = (newId) => {
  selectReplacement(newId);
};

document.addEventListener('DOMContentLoaded', () => {
  // ── Init de UI que no requiere gesto del usuario ─────────────
  initGlosarioTooltips();
  initTooltips();
  renderYearMarkers();

  // Mostrar/ocultar botón de cargar partida
  const loadBtn = document.getElementById('load-btn');
  if (loadBtn) loadBtn.style.display = hasSave() ? '' : 'none';

  // ── Splash screen ─────────────────────────────────────────────
  // onReady se llama al tocar "Continuar" (gesto de usuario).
  // initAudio() requiere gesto → va aquí adentro.
  initSplash(() => {
    initAudio();
    resumeAudio();
  });

  // ── Sonido global para TODOS los botones e interactivos ──────
  // Cubre cualquier button, role=button, tarjetas de selección, tabs, etc.
  // Se excluye m-confirm-btn porque _continueFromModal ya llama soundClick()
  // seguido de soundNextTurn() en _advanceTurn — agregar otro soundClick sería redundante.
  document.addEventListener('click', (e) => {
    resumeAudio();
    const target = e.target.closest([
      'button',
      '[role="button"]',
      '.mandate-opt',
      '.ident-vp-card',
      '.tr-tab',
      '.nr-tab',
      '.rr-card',
      '.news-ticker-more',
      '.recent-log-toggle',
      '.tut-skip-btn',
      '.tut-next-btn',
    ].join(', '));
    if (!target) return;
    if (target.disabled || target.classList.contains('disabled')) return;
    // m-confirm-btn: _continueFromModal ya toca soundClick + soundNextTurn
    if (target.id === 'm-confirm-btn') return;
    soundClick();

    // ── Feedback háptico — Feature 3 ─────────────────────────────
    // Vibración diferenciada: decisiones de evento = más intensas.
    // navigator.vibrate no existe en iOS Safari (se ignora silenciosamente).
    if ('vibrate' in navigator) {
      if (target.classList.contains('option-btn')) navigator.vibrate(18);
      else navigator.vibrate(8);
    }
  });
});

// ── FLUJO DE INICIO ───────────────────────────────────────────

/**
 * Inicia el flujo: Start → Identity → Heritage → Ministers → Difficulty → Game
 */
function startGame() {
  soundClick();
  showIdentityScreen(({ presidentName, partyName, vpId }) => {
    _displayName     = `Pte. ${presidentName.split(' ').slice(-1)[0]} · ${partyName.split('(')[0].trim().substring(0, 22)}`;
    _pendingIdentity = { presidentName, partyName, vpId };
    const identity   = _pendingIdentity;

    showHeritageScreen(({ heritageId, mandateType }) => {
      showMinistersScreen(ministers => {
        showDifficultyScreen(difficulty => {
          const state = newState({ heritageId, mandateType, difficulty, ministers, identity });
          setG(state);
          initSparklines(G.indicadores);
          _startTurn();
        });
      });
    });
  });
}

/**
 * Carga la partida guardada y reanuda el juego.
 */
function loadGame() {
  soundClick();
  const saved = loadFromStorage();
  if (!saved) {
    showNotif('❌ No hay partida guardada.', 'warn');
    return;
  }
  setG(saved);
  // Reconstruir displayName desde la identidad guardada en el estado
  const id = G.identity;
  if (id?.presidentName) {
    _displayName = `Pte. ${id.presidentName.split(' ').slice(-1)[0]} · ${(id.partyName || '').split('(')[0].trim().substring(0, 22)}`;
  } else {
    _displayName = 'Mi Gobierno';
  }
  initSparklines(G.indicadores);
  showScreen('screen-game');
  updateMandateBar(G.turn, CONFIG.TOTAL_TURNS, G.difficulty, _displayName);
  renderDashboard(G.indicadores);
  renderNewsTicker(G);   // restaurar ticker de la última sesión
  _startTurn();
  showNotif('💾 Partida cargada exitosamente.', 'success', 3000);
}

/**
 * Confirma la herencia y avanza a la pantalla de dificultad.
 * Llamado desde HTML onclick="confirmHeritage()".
 */
function confirmHeritage() {
  soundClick();
  import('./ui/heritage-ui.js').then(m => {
    const sel = m.getHeritageSelection();
    showMinistersScreen(ministers => {
      showDifficultyScreen(difficulty => {
        // identity viene de _pendingIdentity (set en showIdentityScreen) o del estado guardado
        const identity = _pendingIdentity ?? G?.identity ?? { presidentName: 'Presidente/a', partyName: 'Partido Nacional', vpId: null };
        const state = newState({ ...sel, difficulty, ministers, identity });
        setG(state);
        initSparklines(G.indicadores);
        _startTurn();
      });
    });
  });
}

// ── CICLO DE TURNO ────────────────────────────────────────────

/**
 * Inicia el turno actual: selecciona evento, renderiza UI y espera decisión.
 */
function _startTurn() {
  if (!G) return;

  // Inicializar sistema de renuncias para este turno
  initResignations(
    G,
    // onApplied: reemplazo confirmado
    (slotId, newId, fx) => _onResignationApplied(slotId, newId, fx),
    // onDefeat: colapso de gabinete
    (slotId) => _onCabinetCollapse(slotId),
  );

  // ── Inercia y efectos persistentes (desde turno 2 en adelante) ──
  // Se aplican ANTES de renderizar el evento, para que el jugador
  // ya vea el estado actualizado al iniciar el turno.
  if (G.turn > 1) {
    const prevIndPersist = { ...G.indicadores };

    const { changed: inertChanged }   = applyInertia(G);
    const { changed: aeChanged, expired } = applyActiveEffects(G);

    if (inertChanged || aeChanged) {
      pushSparkline(G.indicadores);
      animateIndicatorChanges(prevIndPersist, G.indicadores);
      // El renderDashboard completo viene más abajo — aquí solo animamos
    }

    // Notificar efectos expirados
    if (expired.length > 0) {
      const names = expired.map(e => e.sourceTitle).join(', ');
      showNotif(`📌 Finalizó: ${names}`, 'info', 3500);
    }
  }

  // Siempre actualizar el panel de efectos activos
  renderActiveEffects(G.activeEffects || []);

  // Actualizar tracking de crisis automáticas
  updateDangerTracking(G);

  // Verificar si hay crisis automáticas pendientes
  const newCrises = checkAutoCrises(G);
  if (newCrises.length > 0) {
    G.pendingCrises = [...(G.pendingCrises || []), ...newCrises];
    // Aviso visual de crisis inminente
    newCrises.forEach(c => {
      const turns = G.adata.dangerHistory[c._crisisKey] || 0;
      showCrisisWarning(c._crisisKey, turns);
    });
  }

  // Resetear asesores para el nuevo turno
  resetAdvisorsForTurn(G);

  // ── Elecciones de medio término (turno 22: aviso; turno 24: resolución) ──
  if (G.turn === 22 && !G.midtermDone) {
    // Mostrar evento de campaña (reemplaza el evento normal de este turno)
    const warnEvent = buildWarningEvent();
    G.currentEvent = warnEvent;
    showScreen('screen-game');
    updateMandateBar(G.turn, CONFIG.TOTAL_TURNS, G.difficulty, _displayName);
    renderDashboard(G.indicadores);
    renderEvent(warnEvent, G);
    onOptionSelected((idx, option) => _handleDecision(idx, option, warnEvent));
    return;
  }

  if (G.turn === 24 && !G.midtermDone) {
    // Resolución automática: calcular resultado ANTES del evento normal
    G.midtermDone = true;
    showScreen('screen-game');
    updateMandateBar(G.turn, CONFIG.TOTAL_TURNS, G.difficulty, _displayName);
    renderDashboard(G.indicadores);
    showElectionResult(G, (result) => {
      // Aplicar efectos del resultado electoral
      const prevInd = { ...G.indicadores };
      G.indicadores = applyEffects(G.indicadores, result.efectos, G.effectMods || {});
      pushSparkline(G.indicadores);
      animateIndicatorChanges(prevInd, G.indicadores);
      renderDashboard(G.indicadores, prevInd);
      const electionNews = _buildElectionNews(calcElectoralScore(G) + (G.midtermBonus ?? 0) >= 50);
      if (electionNews) { addToNewsHistory(G, electionNews); renderNewsTicker(G); }
      import('./engine/storage.js').then(m => m.saveToStorage(G));
      // Continuar con el evento normal del turno 24
      _resumeTurnAfterMidterm();
    });
    return;
  }

  // Seleccionar evento (crisis auto primero, luego normal)
  let event;
  if (G.pendingCrises && G.pendingCrises.length > 0) {
    event = G.pendingCrises.shift();
  } else {
    event = pickNextEvent(G);
  }

  G.currentEvent = event;

  // ── Eventos especiales: registrar turno y aplicar pre-efectos ──
  if (event.isSpecial) {
    G.lastSpecialEventTurn = G.turn;

    if (event.isExtreme && event.preEffects) {
      // Aplicar daño ANTES de que el jugador decida
      const prevInd = { ...G.indicadores };
      G.indicadores = applyEffects(G.indicadores, event.preEffects, {});
      // Dashboard: mostrar el daño inmediato
      pushSparkline(G.indicadores);
      animateIndicatorChanges(prevInd, G.indicadores);
      renderDashboard(G.indicadores, prevInd);
    }
  }

  // Actualizar UI
  showScreen('screen-game');
  updateMandateBar(G.turn, CONFIG.TOTAL_TURNS, G.difficulty, _displayName);
  if (!event.isExtreme) renderDashboard(G.indicadores); // evitar doble render si ya se hizo arriba

  // Turno 1: generar noticias inaugurales antes de la primera decisión
  if (G.turn === 1 && !G.currentNews) {
    const inaugNews = generateInauguralNews(G);
    addToNewsHistory(G, inaugNews);
    renderNewsTicker(G);
  }

  // Renderizar evento y esperar decisión
  renderEvent(event, G);
  onOptionSelected((idx, option) => _handleDecision(idx, option, event));

  // Tutorial interactivo: solo en el primer turno de una partida nueva
  // (history.length === 0 garantiza que no es una partida cargada)
  // Si el tutorial está pendiente (no visto antes), se muestra y retornamos —
  // el tutorial no bloquea las opciones del evento, solo superpone la guía.
  // try/catch: localStorage puede lanzar SecurityError en iOS Safari privado
  let tutorialSeen = false;
  try { tutorialSeen = !!localStorage.getItem('sdr_v12_tutorial_seen'); } catch (_) {}
  if (G.turn === 1 && (G.history?.length ?? 0) === 0 && !tutorialSeen) {
    setTimeout(() => initTutorial(G), 900);
    // No hacemos return: las alertas extremas siguen funcionando si aplica
  }

  // Eventos especiales graves: mostrar modal de alerta (bloquea interacción)
  if (event.isSpecial && (event.isExtreme || event.isSevere)) {
    setTimeout(() => _showExtremeAlert(event), 300);
  } else {
    // Chequear reuniones de urgencia normales
    setTimeout(() => _checkEmergencyMeetings(event), 500);
  }
}

/**
 * Verifica si algún asesor tiene urgencia nivel 3 y muestra el modal de reunión.
 * Solo el más urgente por turno (VP primero, luego ministros).
 * @param {object} event — evento actual
 */
function _checkEmergencyMeetings(event) {
  if (!G) return;
  const emergencies = checkEmergencyMeetings(G);
  if (emergencies.length === 0) return;

  const { slotId, minister } = emergencies[0];
  markEmergencyShown(slotId, G.turn);
  showEmergencyModal(slotId, minister, event, G);
}

/**
 * Procesa la decisión del jugador.
 * La decisión es inmediata y definitiva — no hay confirmación previa.
 * Después de aplicar los efectos se muestra el modal de consecuencias.
 * @param {number} idx      - índice de la opción elegida
 * @param {object} option   - objeto de la opción
 * @param {object} event    - evento actual
 */
function _handleDecision(idx, option, event) {
  disableOptions();
  soundClick();

  // Mostrar comentario ministerial ANTES de aplicar efectos.
  // El ministro explica las *posibles* consecuencias de forma educativa.
  // "Volver" re-habilita las opciones sin aplicar nada.
  // "Entendido" aplica la decisión y muestra las consecuencias reales.
  showMinisterModal(
    event.id,
    idx,
    G.ministers || {},
    () => _applyDecision(idx, option, event),   // onContinue
    () => enableOptions()                         // onBack
  );
}

/**
 * Aplica la decisión: actualiza estado e historial, muestra consecuencias,
 * y avanza al siguiente turno cuando el jugador toca "Continuar".
 */
function _applyDecision(idx, option, event) {
  const prevInd = { ...G.indicadores };

  // ── Bonus de campaña electoral (turno 22) ──────────────────────
  if (event.isMidtermWarning && option._campaignBonus != null) {
    G.midtermBonus = (G.midtermBonus || 0) + option._campaignBonus;
    showNotif(`🗳️ Estrategia de campaña elegida. El resultado se conocerá en el turno 24.`, 'info', 5000);
  }

  // Aplicar efectos (con modificadores de ministros)
  const newInd = applyEffects(G.indicadores, option.efectos || {}, G.effectMods || {});
  G.indicadores = newInd;

  // Actualizar adata
  updateAdata(G, !!option.corrupta);

  // Registrar efecto persistente si la opción tiene duracion
  addActiveEffect(G, option, event);
  renderActiveEffects(G.activeEffects || []);

  // ── Feature 1: Eventos encadenados — consecuencia diferida ───────
  if (option.chain) {
    G.pendingChainEvents = G.pendingChainEvents || [];
    const triggerAt = G.turn + option.chain.delayTurns;
    const shortTitle = event.titulo.length > 36
      ? event.titulo.substring(0, 34) + '…'
      : event.titulo;
    G.pendingChainEvents.push({
      eventId:       option.chain.eventId,
      triggerAtTurn: triggerAt,
      sourceTitle:   shortTitle,
    });
    showNotif(
      `🔗 Consecuencia diferida: esta decisión tendrá repercusiones en ${option.chain.delayTurns} ${option.chain.delayTurns === 1 ? 'mes' : 'meses'}.`,
      'info', 5000
    );
  }

  // ── Feature 4: Bitácora de decisiones ────────────────────────────
  G.decisionLog = G.decisionLog || [];
  G.decisionLog.push({
    turn:       G.turn,
    eventId:    event.id,
    eventTitle: event.titulo,
    tag:        event.tag,
    opcionIndex: idx,
    opcionText: option.texto.replace(/^[^\s]+\s/, '').substring(0, 80), // sin emoji inicial, max 80 chars
    indBefore:  prevInd,
    indAfter:   { ...G.indicadores },
  });

  // Si era asesor, actualizar credibilidad
  const advisorModal = document.getElementById('advisor-modal');
  if (advisorModal && advisorModal.dataset.advisorId) {
    const aId   = advisorModal.dataset.advisorId;
    const recId = parseInt(advisorModal.dataset.recommended ?? '-1', 10);
    updateAdvisorCredibility(aId, idx, recId, option.efectos || {}, G);
    import('./features/advisors.js').then(m => m.closeAdvisorModal());
  }

  // Registrar logros de asesores
  G.adata.advisorUsed = (G.adata.advisorUsed || 0);

  // Historial
  pushHistory(G, event.id, idx, !!event.isCrisisAuto);
  addLogEntry(G.turn, event.titulo, option.texto, !!event.isCrisisAuto);

  // Actualizar sparklines y dashboard con animación
  pushSparkline(G.indicadores);
  animateIndicatorChanges(prevInd, G.indicadores);
  renderDashboard(G.indicadores, prevInd);

  // Verificar logros
  _checkAndUnlockAchievements();

  // Generar noticias del turno y actualizar ticker
  const newsItems = generateNews(event, idx, option, G);
  addToNewsHistory(G, newsItems);
  renderNewsTicker(G);

  // ── Feature 5: Marcar breaking news en eventos especiales ────────
  if ((event.isExtreme || event.isSevere || event.isCrisisAuto) && newsItems[0]) {
    newsItems[0].isBreaking = true;
  }

  // ── Feature 1: Precargar imágenes mientras el jugador lee el modal ──
  // El modal tarda 3-8 segundos en cerrarse → ventana perfecta para
  // precargar el lote siguiente sin impacto perceptible en el frame.
  preloadUpcomingImages(G);

  // Mostrar modal de consecuencias con titular de prensa — al cerrar, avanza el turno
  const pressHeadline = newsItems[0]?.headline || null;
  openModal(option, () => _advanceTurn(option), pressHeadline);
}

/**
 * Avanza el turno tras cerrar el modal de consecuencias.
 * Verifica derrota/victoria y pasa al siguiente evento.
 * @param {object} option - opción elegida (para notificación y efectos)
 */
function _advanceTurn(option) {
  // Mostrar notificación de resultado del turno
  _showTurnNotif(option.efectos || {});

  // Verificar derrota
  const defeatReason = checkDefeat(G.indicadores);
  if (defeatReason) {
    G.lost       = true;
    G.lostReason = defeatReason;
    saveToStorage(G);
    recordGameToGlobal(G, getScore(G.indicadores));
    clearSave();
    if ('vibrate' in navigator) navigator.vibrate([30, 100, 30, 100, 60]); // ← háptico derrota
    showCrisisOverlay(defeatReason);
    return;
  }

  // Verificar victoria
  if (G.turn >= CONFIG.TOTAL_TURNS) {
    G.won = true;
    // Calcular reelección y almacenar en el estado antes de guardar
    G.reelection = computeReelection(G);
    saveToStorage(G);
    recordGameToGlobal(G, getScore(G.indicadores));
    clearSave();
    if ('vibrate' in navigator) navigator.vibrate([50, 50, 50, 50, 150]); // ← háptico victoria
    setTimeout(() => showEndScreen(G, _displayName), 800);
    return;
  }

  // Autosave y avanzar turno
  G.turn++;
  saveToStorage(G);
  flashAutosave();

  // Sonido de feedback según zona de indicadores
  const hasDanger = IND_META.some(m => _getZoneInline(m.key, G.indicadores[m.key]) === 'danger');
  if (hasDanger) soundCrisis();
  else soundNextTurn();

  // Siguiente turno (pequeño delay para animaciones)
  enableOptions();
  setTimeout(_startTurn, 300);
}

/**
 * Muestra la notificación de resultado del turno (igual al original v11).
 * @param {object} efectos - efectos de la opción elegida (pre-multiplicador)
 */
function _showTurnNotif(efectos) {
  let goods = 0, bads = 0;
  const BAD = new Set(['ipc','deuda','riesgo','pobreza','desocupacion']);
  Object.entries(efectos).forEach(([key, raw]) => {
    if (raw === 0) return;
    const real = raw * CONFIG.EFFECT_MULTIPLIER;
    if ((BAD.has(key) && real < 0) || (!BAD.has(key) && real > 0)) goods++;
    else bads++;
  });
  if      (goods > bads + 1)  showNotif('✅ ¡Buena decisión! Varios indicadores mejoraron este mes.',     'success', 3500);
  else if (bads > goods + 1)  showNotif('⚠️ Decisión difícil. Algunos indicadores empeoraron este mes.',  'warn',    3500);
  else                        showNotif('📊 Decisión tomada. Los indicadores se han actualizado.',          'info',    3000);
}

/**
 * Calcula la zona de un indicador (inline para evitar imports async).
 * @param {string} k - clave del indicador
 * @param {number} v - valor actual
 * @returns {'safe'|'warn'|'danger'}
 */
function _getZoneInline(k, v) {
  const t = CONFIG.THRESHOLDS[k];
  if (!t) return 'safe';
  if (t.low_bad) { if (v <= t.danger) return 'danger'; if (v <= t.warn) return 'warn'; return 'safe'; }
  if (v >= t.danger) return 'danger'; if (v >= t.warn) return 'warn'; return 'safe';
}

/**
 * Verifica y desbloquea logros nuevos.
 */
function _checkAndUnlockAchievements() {
  const ctxSync = { getScore, getZone: _getZoneInline, IND_META };
  const newUnlocked = checkAchievements(G, ctxSync)
    .filter(id => !G.unlockedAchievements.includes(id));

  if (newUnlocked.length > 0) {
    G.unlockedAchievements.push(...newUnlocked);
    soundAchievement();

    const ach = ACHIEVEMENTS.find(a => a.id === newUnlocked[0]);
    if (ach) {
      showNotif(`🏅 <strong>¡Logro desbloqueado!</strong> ${ach.icon} ${ach.name}`, 'success', 4000);
    }
  }
}

// ── SISTEMA DE RENUNCIAS — CALLBACKS ─────────────────────────

/**
 * Callback tras confirmar un reemplazo de gabinete.
 * Actualiza el dashboard, muestra notificación y guarda.
 */
function _onResignationApplied(slotId, newId, fx) {
  // 1. Cerrar el modal del asesor/ministro despedido
  import('./features/advisors.js').then(m => m.closeAdvisorModal());

  // 2. Actualizar visuales de indicadores
  const prevInd = { ...G.indicadores }; // ya actualizado por resignations.js
  pushSparkline(G.indicadores);
  animateIndicatorChanges(prevInd, G.indicadores);
  renderDashboard(G.indicadores, prevInd);

  // 3. Refrescar el panel de asesores (nombres, estrellas, botones)
  import('./features/advisors.js').then(m => {
    const advPanel = document.getElementById('advisors-panel-container');
    if (advPanel) advPanel.innerHTML = m.buildAdvisorsHTML(G);
  });

  // 4. Regenerar noticias sobre la renuncia
  const resignNews = _buildResignationNews(slotId, newId);
  if (resignNews) {
    addToNewsHistory(G, resignNews);
    renderNewsTicker(G);
  }

  // 5. Actualizar modal de gabinete si está abierto
  const cabinetOverlay = document.getElementById('cabinet-overlay');
  if (cabinetOverlay?.classList.contains('open') && G.currentEvent) {
    openCabinetModal(G.currentEvent, G);
  }

  // Autosave
  import('./engine/storage.js').then(m => m.saveToStorage(G));

  // Notificación
  const count = getResignationCount(slotId, G);
  const warn  = count >= 2 ? ' ⚠️ Este es el último reemplazo posible.' : '';
  showNotif(`✅ Reemplazo de gabinete confirmado. Los indicadores reflejan el impacto.${warn}`, 'warn', 5000);
}

/**
 * Genera 3 noticias sobre la renuncia/reemplazo.
 */
function _buildResignationNews(slotId, newId) {
  const id   = G.identity || {};
  const p    = (id.presidentName || 'el Presidente').split(' ').slice(-1)[0];
  const par  = (id.partyName || 'el Partido').split('(')[0].trim().substring(0, 28);

  const slotLabels = {
    vp:'Vicepresidencia', economia:'Ministerio de Economía',
    social:'Ministerio de Desarrollo Social', gabinete:'Jefatura de Gabinete',
    produccion:'Ministerio de Producción',
  };
  const label = slotLabels[slotId] || slotId;

  const headlines = [
    { source:'cronista', sourceName:'El Cronista Nacional', sourceIcon:'🗞️', sourceType:'paper', sourceColor:'#5b8dee',
      headline:`${p} reestructura el gabinete: cambios en la ${label}`,
      body:`El gobierno del ${par} anunció el reemplazo del titular de la ${label}. Fuentes oficiales señalan "diferencias estratégicas" como motivo del alejamiento.`,
      isForecast:false, forecastTag:null },
    { source:'tribuna', sourceName:'Tribuna Libre', sourceIcon:'⚡', sourceType:'paper', sourceColor:'#e74c3c',
      headline:`Crisis interna en el ${par}: nuevo cambio de gabinete bajo ${p}`,
      body:`La remoción del ministro o ministra pone en evidencia tensiones internas en la coalición gobernante. La oposición señala "inestabilidad crónica" y pide explicaciones.`,
      isForecast:false, forecastTag:null },
    { source:'tendencias', sourceName:'@TendenciasPol', sourceIcon:'🐦', sourceType:'social', sourceColor:'#1da1f2',
      headline:`#CambioDeGabinete trending: ¿qué pasa en el gobierno de ${p}?`,
      body:`Las redes explotan con el cambio. "¿Cuántos van?" preguntan los usuarios. El movimiento en la ${label} es el tema del día.`,
      isForecast:false, forecastTag:null },
  ];
  return headlines;
}

/**
 * Callback cuando el jugador intenta la 3.a renuncia del mismo slot.
 * Activa la derrota por colapso de gabinete con cobertura de prensa dramática.
 */
function _onCabinetCollapse(slotId) {
  if (!G) return;

  const slotLabels = {
    vp:'la Vicepresidencia', economia:'Economía', social:'Desarrollo Social',
    gabinete:'Jefatura de Gabinete', produccion:'Producción',
  };
  const label = slotLabels[slotId] || slotId;

  G.lost      = true;
  G.lostReason = `CRISIS TERMINAL DE GABINETE — Tercer reemplazo en ${label}`;
  G.cabinetCollapse = {
    slot: slotId,
    pressLines: [
      `🗞️ EL CRONISTA: "${p()} se queda sin gabinete: renuncia masiva fuerza elecciones anticipadas"`,
      `⚡ TRIBUNA LIBRE: "El fin de un gobierno: la crisis de ${label} derribó al ${par()}"`,
      `🐦 @TENDENCIASSPOL: "#GabinetoColapsado — El país pide elecciones YA. El gobierno de ${p()} termina antes de tiempo."`,
    ],
  };

  import('./engine/storage.js').then(({ saveToStorage, recordGameToGlobal, clearSave }) => {
    saveToStorage(G);
    recordGameToGlobal(G, 0);
    clearSave();
  });

  _showCabinetCollapseDefeat();
}

function p() {
  return (G?.identity?.presidentName || 'el Presidente').split(' ').slice(-1)[0];
}
function par() {
  return (G?.identity?.partyName || 'el Partido').split('(')[0].trim().substring(0, 22);
}

/**
 * Muestra la pantalla de derrota por colapso de gabinete
 * con cobertura de prensa dramática.
 */
function _showCabinetCollapseDefeat() {
  // Cerrar todos los modales abiertos
  closeResignConfirm();
  closeReplacementModal();
  import('./features/advisors.js').then(m => m.closeAdvisorModal());

  const overlay = document.getElementById('crisis-overlay');
  const icon    = document.getElementById('cr-icon');
  const title   = document.getElementById('cr-title');
  const desc    = document.getElementById('cr-desc');

  if (icon)  icon.textContent  = '💀';
  if (title) title.textContent = 'CRISIS TERMINAL — FIN DEL MANDATO';
  if (desc) {
    const pressLines = G.cabinetCollapse?.pressLines || [];
    desc.innerHTML = `
      <strong>El gabinete renunció en pleno. El Congreso forzó elecciones anticipadas.</strong><br><br>
      La incapacidad de sostener un equipo de gobierno estable llevó al colapso institucional.
      El mandato termina antes de tiempo.<br><br>
      ${pressLines.length > 0
        ? `<div class="cr-press-coverage">
            <div class="cr-press-title">📰 Cobertura de prensa:</div>
            ${pressLines.map(l => `<div class="cr-press-line">${l}</div>`).join('')}
          </div>`
        : ''}
    `;
  }

  import('./audio.js').then(m => m.soundDefeat());
  if (overlay) overlay.classList.add('open');
}

// ── ALERTA DE EVENTO EXTREMO ──────────────────────────────────

/**
 * Muestra el modal de alerta para eventos isExtreme o isSevere.
 * Bloquea la interacción hasta que el jugador lo cierra.
 * @param {object} event — evento actual
 */
function _showExtremeAlert(event) {
  const overlay = document.getElementById('extreme-alert-overlay');
  if (!overlay) return;

  // ── Contenido dinámico ───────────────────────────────────────
  const isExtreme = !!event.isExtreme;

  // Título y badge
  const titleEl   = document.getElementById('ea-title');
  const badgeEl   = document.getElementById('ea-severity-badge');
  const iconEl    = document.getElementById('ea-icon');
  const descEl    = document.getElementById('ea-desc');

  if (titleEl)  titleEl.textContent  = event.titulo;
  if (badgeEl) {
    if (isExtreme)               badgeEl.textContent = '⚠️ CRISIS GRAVÍSIMA — IMPACTO INMEDIATO';
    else if (event.isVPCrisis)   badgeEl.textContent = '💀 CRISIS DE VICEPRESIDENCIA';
    else if (event.isCabinetCorruption) badgeEl.textContent = '🔴 ESCÁNDALO DE GABINETE';
    else                         badgeEl.textContent = '⚡ EVENTO DE ALTA GRAVEDAD';
    badgeEl.className = `extreme-alert-severity ${isExtreme ? 'severity-extreme' : event.isVPCrisis ? 'severity-vp' : event.isCabinetCorruption ? 'severity-corruption' : 'severity-severe'}`;
  }
  if (iconEl)  iconEl.textContent = _getExtremeIcon(event);
  if (descEl) {
    // Descripción corta (primeras 2 oraciones)
    const shortDesc = event.descripcion.split(/[.!?]/).slice(0, 2).join('. ').trim() + '.';
    descEl.textContent = shortDesc;
  }

  // ── Pre-efectos (solo eventos isExtreme) ─────────────────────
  const preEffectsWrap = document.getElementById('ea-preeffects');
  const preEffectsList = document.getElementById('ea-preeffects-list');
  if (preEffectsWrap && preEffectsList) {
    if (isExtreme && event.preEffects && Object.keys(event.preEffects).length > 0) {
      preEffectsWrap.style.display = '';
      const IND_LABELS = {
        ipc:'Inflación', deuda:'Deuda', reservas:'Reservas', riesgo:'Riesgo País',
        pobreza:'Pobreza', desocupacion:'Desempleo', produccion:'Producción', confianza:'Confianza',
      };
      preEffectsList.innerHTML = Object.entries(event.preEffects)
        .filter(([, v]) => v !== 0)
        .map(([k, v]) => {
          const BAD = new Set(['ipc','deuda','riesgo','pobreza','desocupacion']);
          const isBad = (BAD.has(k) && v > 0) || (!BAD.has(k) && v < 0);
          const sign  = v > 0 ? '+' : '';
          return `<span class="ea-preeffect-item ${isBad ? 'bad' : 'good'}">
            ${IND_LABELS[k] || k} <strong>${sign}${v}</strong>
          </span>`;
        }).join('');
    } else {
      preEffectsWrap.style.display = 'none';
    }
  }

  // ── Advertencias de asesores ──────────────────────────────────
  const advisorList = document.getElementById('ea-advisor-list');
  if (advisorList && G) {
    const warnings = _getAdvisorWarnings(event, G);
    advisorList.innerHTML = warnings.map(w =>
      `<div class="ea-advisor-warn">
        <span class="ea-advisor-avatar">${w.avatar}</span>
        <span class="ea-advisor-msg">${w.msg}</span>
      </div>`
    ).join('');
  }

  // ── Clase del overlay según severidad ────────────────────────
  overlay.className = `modal-overlay extreme-alert-overlay ${isExtreme ? 'extreme-alert-extreme' : 'extreme-alert-severe'} open`;

  // Háptico para crisis extremas/graves
  if ('vibrate' in navigator) {
    navigator.vibrate(isExtreme ? [20, 50, 20, 50, 20] : [20, 40, 20]);
  }

  // Bloquear opciones del evento hasta que se cierre la alerta
  disableOptions();
}

/**
 * Cierra el modal de alerta extrema y habilita las opciones.
 * Llamado por el botón "Entendido" del modal.
 */
window.__closeExtremeAlert = function() {
  const overlay = document.getElementById('extreme-alert-overlay');
  if (overlay) overlay.classList.remove('open');
  enableOptions();
  // Chequear reuniones de urgencia normales
  if (G && G.currentEvent) {
    setTimeout(() => _checkEmergencyMeetings(G.currentEvent), 200);
  }
};

/**
 * Devuelve un icono representativo para el evento.
 * @param {object} event
 * @returns {string}
 */
function _getExtremeIcon(event) {
  const iconMap = {
    '🌍 Guerra Mundial':    '☢️', '☣️ Pandemia Global': '☣️',
    '🌍 Crisis Global':     '📉', '⚔️ Conflicto Bélico': '⚔️',
    '✊ Golpe de Estado':   '🪖', '🌋 Catástrofe Natural': '🌋',
    '☢️ Accidente Nuclear': '☢️', '💻 Ciberataque Masivo': '💻',
    '🌊 Catástrofe Climática': '🌊', '💀 Traición Interna': '💀',
    '🔴 Escándalo de Gabinete': '🔴', '⚡ Dilema Sin Salida': '⚡',
  };
  return iconMap[event.tag] || '⚠️';
}

/**
 * Genera mensajes de advertencia de los asesores para un evento especial.
 * @param {object} event
 * @param {object} state
 * @returns {Array<{avatar,msg}>}
 */
function _getAdvisorWarnings(event, state) {
  const warnings = [];
  const id       = state.identity || {};
  const vpId     = id.vpId || 'vp-moreno';

  // VP siempre advierte en eventos especiales
  const vpWarnings = _getVPWarning(event, vpId);
  warnings.push(vpWarnings);

  // Ministro más relevante según el tag
  const minWarning = _getMinisterWarning(event, state);
  if (minWarning) warnings.push(minWarning);

  return warnings;
}

function _getVPWarning(event, vpId) {
  const vpNames = {
    'vp-moreno':'Moreno', 'vp-santos':'Santos', 'vp-gutiérrez':'Gutiérrez',
    'vp-castro':'Castro', 'vp-herrera':'Herrera',
  };
  const name = vpNames[vpId] || 'Vicepresidente/a';

  if (event.isExtreme) {
    return { avatar:'🏛️', msg:`${name} (VP): "Esta es la peor crisis que enfrentamos. Los indicadores ya recibieron el impacto. Cada decisión que tomemos ahora definirá el futuro del gobierno."` };
  }
  if (event.isVPCrisis) {
    return { avatar:'🏛️', msg:`${name} (VP): "Señor/a Presidente/a — la situación en la Vicepresidencia es extremadamente delicada. Cualquier error ahora puede fracturar la coalición de gobierno."` };
  }
  if (event.isCabinetCorruption) {
    return { avatar:'🏛️', msg:`${name} (VP): "Este escándalo puede arrastrarnos a todos. Mi recomendación es actuar con absoluta transparencia, cueste lo que cueste políticamente."` };
  }
  return { avatar:'🏛️', msg:`${name} (VP): "Debemos actuar con máxima prudencia. Las opciones disponibles tienen consecuencias graves sin importar cuál elijamos."` };
}

function _getMinisterWarning(event, state) {
  const tag = event.tag;
  const economicTags = new Set(['🌍 Crisis Global','🌍 Guerra Mundial','☣️ Pandemia Global','⚡ Dilema Sin Salida','⚡ Colapso Energético']);
  const securityTags = new Set(['✊ Golpe de Estado','⚔️ Conflicto Bélico','💻 Ciberataque Masivo','⚡ Dilema Sin Salida']);
  const socialTags   = new Set(['🌍 Crisis Humanitaria','🌋 Catástrofe Natural','🌊 Catástrofe Climática','☢️ Accidente Nuclear']);

  if (economicTags.has(tag)) {
    return { avatar:'📊', msg:`Ministerio de Economía: "Las proyecciones fiscales cambiaron completamente. Necesitamos rever todo el programa antes de decidir."` };
  }
  if (securityTags.has(tag)) {
    return { avatar:'🛡️', msg:`Ministerio de Interior: "Las fuerzas de seguridad están en alerta máxima. Cualquier decisión debe contemplar el riesgo de escalada."` };
  }
  if (socialTags.has(tag)) {
    return { avatar:'❤️', msg:`Ministerio de Desarrollo Social: "El impacto sobre la población vulnerable ya es visible. Necesitamos respuesta inmediata de emergencia social."` };
  }
  return null;
}

// ── ELECCIONES DE MEDIO TÉRMINO ──────────────────────────────

/**
 * Continúa el turno 24 con un evento normal, luego del modal de resultado.
 */
function _resumeTurnAfterMidterm() {
  if (!G) return;
  let event;
  if (G.pendingCrises && G.pendingCrises.length > 0) {
    event = G.pendingCrises.shift();
  } else {
    event = pickNextEvent(G);
  }
  G.currentEvent = event;
  renderEvent(event, G);
  onOptionSelected((idx, option) => _handleDecision(idx, option, event));
  setTimeout(() => _checkEmergencyMeetings(event), 500);
}

/**
 * Genera noticias sobre el resultado electoral.
 * @param {boolean} won
 */
function _buildElectionNews(won) {
  const id  = G.identity || {};
  const p   = (id.presidentName || 'el Presidente').split(' ').slice(-1)[0];
  const par = (id.partyName || 'el Partido').split('(')[0].trim().substring(0, 28);

  if (won) {
    return [
      { source:'cronista', sourceName:'El Cronista Nacional', sourceIcon:'🗞️', sourceType:'paper', sourceColor:'#5b8dee',
        headline:`${p} triunfa en las legislativas: el oficialismo retiene la mayoría`,
        body:`El bloque del ${par} logró mantener el control del Congreso. Analistas señalan que la gestión económica y la imagen presidencial fueron claves para el resultado.`,
        isForecast:false, forecastTag:null },
      { source:'tendencias', sourceName:'@TendenciasPol', sourceIcon:'🐦', sourceType:'social', sourceColor:'#1da1f2',
        headline:`#VictoriaLegislativa: el oficialismo celebra. ¿Qué viene ahora?`,
        body:`Las redes explotan de reacciones. El triunfo del ${par} despeja el camino para la segunda mitad del mandato de ${p}.`,
        isForecast:false, forecastTag:null },
    ];
  }
  return [
    { source:'cronista', sourceName:'El Cronista Nacional', sourceIcon:'🗞️', sourceType:'paper', sourceColor:'#5b8dee',
      headline:`Derrota legislativa: la oposición toma el control del Congreso`,
      body:`La elección dejó al gobierno de ${p} sin mayoría parlamentaria. El ${par} deberá negociar cada proyecto de ley en la segunda mitad del mandato.`,
      isForecast:false, forecastTag:null },
    { source:'tribuna', sourceName:'Tribuna Libre', sourceIcon:'⚡', sourceType:'paper', sourceColor:'#e74c3c',
      headline:`Congreso opositor: el mandato de ${p} entra en una zona de alta turbulencia`,
      body:`Con la oposición en el Congreso, el ejecutivo perderá iniciativa legislativa. Economistas advierten sobre posibles bloqueos al presupuesto.`,
      isForecast:false, forecastTag:null },
  ];
}

// ── CONTROLES GLOBALES ────────────────────────────────────────

/**
 * Pregunta y sale al menú principal.
 */
function doQuit() {
  confirmQuit(() => {
    if (G) saveToStorage(G);
    setG(null);
    showScreen('screen-start');
    const loadBtn = document.getElementById('load-btn');
    if (loadBtn) loadBtn.style.display = hasSave() ? '' : 'none';
  });
}

/**
 * Va a la pantalla de resultados desde el overlay de crisis.
 */
function goToEndScreen() {
  hideCrisisOverlay();
  if (G) showEndScreen(G, _displayName);
}

/**
 * Reinicia el juego desde la pantalla de resultados.
 */
function restartGame() {
  soundClick();
  clearSave();
  setG(null);
  showScreen('screen-start');
}

// ── RESET TOTAL DE PROGRESO ───────────────────────────────────

window.__openResetModal = function() {
  document.getElementById('reset-modal-overlay')?.classList.add('open');
};

window.__closeResetModal = function() {
  document.getElementById('reset-modal-overlay')?.classList.remove('open');
};

window.__confirmReset = function() {
  // Borrar todas las claves del juego
  ['sdr_save', 'sdr_global', 'sdr_v12_tutorial_seen'].forEach(k => {
    localStorage.removeItem(k);
  });
  // Reinicio completo
  location.reload();
};

/**
 * Inicia el segundo mandato directamente desde la pantalla de resultados.
 * Mantiene la misma identidad, ministros, VP y dificultad.
 * Los indicadores de partida son los del final del primer mandato.
 */
function startSecondTerm() {
  soundClick();
  if (!G?.reelection?.reelected) return;

  const firstTermData = {
    score:         getScore(G.indicadores),
    diploma:       getDiploma(getScore(G.indicadores)),
    reelection:    G.reelection,
    turn:          G.turn,
  };

  const prevIndicadores = { ...G.indicadores };
  const identity        = G.identity;
  const ministers       = G.ministers;
  const difficulty      = G.difficulty;
  const heritageId      = G.heritageId;

  const state = newState({
    heritageId,
    mandateType:     'ajustado',    // Segundo mandato: oposición más fuerte desde el día 1
    difficulty,
    ministers,
    identity,
    isSecondTerm:    true,
    firstTermData,
    prevIndicadores,
  });

  clearSave();
  setG(state);
  initSparklines(G.indicadores);
  showNotif('🏛️ ¡Segundo Mandato! Arrancás donde dejaste.', 'success', 4000);
  _startTurn();
}
