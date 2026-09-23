/* ==========================================================================
   ALETHEIA — RETRO 1-BIT OPERATIONAL DASHBOARD LOGIC (app.js)
   An Evidence Integrity & Recovery Layer for SerpApi-Powered AI Agents
   ========================================================================== */

(function () {
  'use strict';

  // --- 1. WEB AUDIO API SYNTHESIZER ---
  let audioCtx = null;
  let systemVolume = 0.7;
  let isMuted = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function play1BitSound(type) {
    if (isMuted) {
      flashMenuBar();
      return;
    }
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(systemVolume * 0.28, now);
    masterGain.connect(audioCtx.destination);

    switch (type) {
      case 'simple-beep': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.16);
        break;
      }
      case 'boing': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(560, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.28);
        gain.gain.setValueAtTime(1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
      case 'clink': {
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc1.type = 'square';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(1760, now);
        osc2.frequency.setValueAtTime(3520, now);
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(masterGain);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.1);
        osc2.stop(now + 0.1);
        break;
      }
      case 'quack': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(240, now + 0.12);
        gain.gain.setValueAtTime(1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      case 'droplet': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(1800, now + 0.06);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.18);
        gain.gain.setValueAtTime(1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      case 'startup-chime': {
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.5, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + idx * 0.04);
          osc.stop(now + 0.85);
        });
        break;
      }
    }
  }

  function flashMenuBar() {
    const menu = document.getElementById('system-menu-bar');
    if (!menu) return;
    menu.style.backgroundColor = '#000000';
    menu.style.color = '#ffffff';
    setTimeout(() => {
      menu.style.backgroundColor = '#ffffff';
      menu.style.color = '#000000';
    }, 120);
  }

  // --- 2. REAL-TIME SYSTEM CLOCK ---
  function updateSystemClock() {
    const clockEl = document.getElementById('system-clock');
    if (!clockEl) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    clockEl.textContent = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }
  setInterval(updateSystemClock, 1000);
  updateSystemClock();

  // --- 3. 8-CATEGORY NAVIGATION RAIL ---
  const categoryRail = document.getElementById('category-rail');
  const prefPanes = document.querySelectorAll('.pref-pane');
  const contentPane = document.getElementById('main-content-pane');

  function switchCategory(targetPaneId) {
    play1BitSound('simple-beep');
    document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
    
    const activeBtn = document.querySelector(`.category-item[data-pane="${targetPaneId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    prefPanes.forEach(pane => {
      if (pane.id === targetPaneId) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    if (contentPane) {
      contentPane.scrollTop = 0;
      updateScrollbarThumb();
    }
  }

  if (categoryRail) {
    categoryRail.addEventListener('click', (e) => {
      const btn = e.target.closest('.category-item');
      if (!btn) return;
      const targetPaneId = btn.dataset.pane;
      switchCategory(targetPaneId);
    });
  }

  // --- 4. CUSTOM 1-BIT SYSTEM SCROLLBAR ---
  const scrollThumb = document.getElementById('scroll-thumb');
  const scrollTrough = document.getElementById('scroll-trough');
  const scrollUp = document.getElementById('scroll-up');
  const scrollDown = document.getElementById('scroll-down');

  function updateScrollbarThumb() {
    if (!contentPane || !scrollThumb || !scrollTrough) return;
    const scrollHeight = contentPane.scrollHeight;
    const clientHeight = contentPane.clientHeight;
    const scrollTop = contentPane.scrollTop;

    if (scrollHeight <= clientHeight) {
      scrollThumb.style.display = 'none';
      return;
    }
    scrollThumb.style.display = 'block';

    const troughHeight = scrollTrough.clientHeight;
    const thumbHeight = Math.max(28, (clientHeight / scrollHeight) * troughHeight);
    const maxTop = troughHeight - thumbHeight;
    const topPos = (scrollTop / (scrollHeight - clientHeight)) * maxTop;

    scrollThumb.style.height = `${thumbHeight}px`;
    scrollThumb.style.top = `${topPos}px`;
  }

  if (contentPane) {
    contentPane.addEventListener('scroll', updateScrollbarThumb);
    window.addEventListener('resize', updateScrollbarThumb);
    setTimeout(updateScrollbarThumb, 100);
  }

  if (scrollUp) {
    scrollUp.addEventListener('click', () => {
      play1BitSound('clink');
      if (contentPane) contentPane.scrollTop -= 45;
    });
  }

  if (scrollDown) {
    scrollDown.addEventListener('click', () => {
      play1BitSound('clink');
      if (contentPane) contentPane.scrollTop += 45;
    });
  }

  // Dragging Scrollbar Thumb
  if (scrollThumb && scrollTrough && contentPane) {
    let isDragging = false;
    let startY = 0;
    let startTop = 0;

    scrollThumb.addEventListener('mousedown', (e) => {
      isDragging = true;
      startY = e.clientY;
      startTop = parseFloat(scrollThumb.style.top) || 0;
      document.body.style.userSelect = 'none';
      e.stopPropagation();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaY = e.clientY - startY;
      const troughHeight = scrollTrough.clientHeight;
      const thumbHeight = scrollThumb.clientHeight;
      const maxTop = troughHeight - thumbHeight;

      let newTop = Math.max(0, Math.min(maxTop, startTop + deltaY));
      scrollThumb.style.top = `${newTop}px`;

      const scrollPercent = newTop / maxTop;
      contentPane.scrollTop = scrollPercent * (contentPane.scrollHeight - contentPane.clientHeight);
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.userSelect = '';
      }
    });

    scrollTrough.addEventListener('click', (e) => {
      if (e.target === scrollThumb) return;
      const rect = scrollTrough.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const troughHeight = scrollTrough.clientHeight;
      const thumbHeight = scrollThumb.clientHeight;
      const maxTop = troughHeight - thumbHeight;
      const targetTop = Math.max(0, Math.min(maxTop, clickY - thumbHeight / 2));
      const scrollPercent = targetTop / maxTop;
      contentPane.scrollTop = scrollPercent * (contentPane.scrollHeight - contentPane.clientHeight);
    });
  }

  // --- 5. SEARCH CONSOLE & PIPELINE EXECUTION ENGINE ---
  const btnExecuteSearch = document.getElementById('btn-execute-search');
  const searchInput = document.getElementById('search-query-input');
  const terminalLogs = document.getElementById('search-terminal-logs');
  const attemptsGroup = document.getElementById('group-attempts-visual');
  const attemptsContainer = document.getElementById('attempts-progression-cards');

  function logTerminalLine(text, isMutedText = false) {
    if (!terminalLogs) return;
    const line = document.createElement('div');
    line.className = isMutedText ? 'log-line text-muted' : 'log-line';
    line.textContent = text;
    terminalLogs.appendChild(line);
    terminalLogs.scrollTop = terminalLogs.scrollHeight;
  }

  function runRetrievalSimulation(query, scenarioType = 'quorum') {
    if (!btnExecuteSearch) return;
    btnExecuteSearch.disabled = true;
    btnExecuteSearch.innerHTML = '<span class="btn-inner-label">&#9654; RETRIEVING...</span>';
    
    if (terminalLogs) terminalLogs.innerHTML = '';
    if (attemptsGroup) attemptsGroup.style.display = 'block';
    if (attemptsContainer) attemptsContainer.innerHTML = '';

    play1BitSound('clink');
    const reqId = 'req-' + Math.random().toString(16).slice(2, 8);
    const agentId = 'agent-langchain-prod-04';

    logTerminalLine(`[01] INCOMING MCP AGENT REQUEST: ${reqId}`);
    logTerminalLine(`[02] AGENT ID: ${agentId} &bull; INTENT: "${query}"`);

    setTimeout(() => {
      play1BitSound('clink');
      logTerminalLine(`[03] DISPATCHING SERPAPI GATEWAY ADAPTER -> ENGINE: google`);
      logTerminalLine(`[04] SERPAPI HTTP 200 OK (384ms latency) -> 12 RAW ITEMS RECEIVED`);
      
      // Attempt 1 Card
      if (scenarioType === 'quorum') {
        renderAttemptCard('ATTEMPT 01', 'Google Search (Raw)', 'DEGRADED', '0.48', 'Initial retrieval diversity low. 1 domain dominate.');
      } else if (scenarioType === 'conflict') {
        renderAttemptCard('ATTEMPT 01', 'Google Search (Query A)', 'SUFFICIENT', '0.78', 'Disagreement detected between Source A & Source B.');
      } else if (scenarioType === 'degraded') {
        renderAttemptCard('ATTEMPT 01', 'Google Search (Empty)', 'DEGRADED', '0.12', 'HTTP 200 but result count is 0. DATA_HEALTH = FAILED.');
      }
    }, 600);

    setTimeout(() => {
      play1BitSound('clink');
      logTerminalLine(`[05] NORMALIZATION: Canonical Schema Mapped & Content Density Scored`);
      logTerminalLine(`[06] VALIDATION: Structure Valid, 0 Captcha Challenges, 2 Syndicated Mirrors Stripped`);

      if (scenarioType === 'degraded') {
        logTerminalLine(`[07] EMPTY RESULT / DEGRADED PAYLOAD DETECTED`);
        logTerminalLine(`[08] POLICY DECISION: REJECT HTTP 200 AS INSUFFICIENT`);
        logTerminalLine(`[09] FINAL STATE: [DEGRADED] -> CIRCUIT METRIC UPDATED`);
        finishSearchExecution('DEGRADED', 0.12, 'Empty HTTP 200 Response Identified as Failed Retrieval');
        return;
      }

      if (scenarioType === 'quorum') {
        logTerminalLine(`[07] EVIDENCE SCORE: 0.48 (FAILS POLICY >= 0.75)`);
        logTerminalLine(`[08] AUTONOMOUS ESCALATION TRIGGERED -> REWRITING RETRIEVAL INTENT`);
        logTerminalLine(`[09] ESCALATED QUERY: "${query} announcement official confirmation 2024"`);
      } else if (scenarioType === 'conflict') {
        logTerminalLine(`[07] CONFLICT DETECTION: Source A claims "Acquired", Source B claims "Independent"`);
        logTerminalLine(`[08] ESCALATING RETRIEVAL TO RESOLVE AMBIGUITY -> ENGINE: google_news`);
      }
    }, 1200);

    setTimeout(() => {
      if (scenarioType === 'degraded') return;
      play1BitSound('clink');
      
      if (scenarioType === 'quorum') {
        logTerminalLine(`[10] SERPAPI ATTEMPT 02 -> ENGINE: google_news HTTP 200 (412ms)`);
        logTerminalLine(`[11] CROSS-SOURCE QUORUM ANALYSIS: 3 INDEPENDENT DOMAINS CONFIRMED`);
        logTerminalLine(`[12] FINAL EVIDENCE SCORE: 0.91 / 1.00 -> QUORUM SATISFIED`);
        logTerminalLine(`[13] FINAL DECISION: [VERIFIED] -> RETURNING GROUNDED EVIDENCE TO AGENT`);
        renderAttemptCard('ATTEMPT 02', 'Google News (Escalated)', 'VERIFIED', '0.91', 'Quorum satisfied with 3 agreeing independent publications.');
        finishSearchExecution('VERIFIED', 0.91, 'Quorum Satisfied Across 3 Independent Domains');
      } else if (scenarioType === 'conflict') {
        logTerminalLine(`[10] SERPAPI ATTEMPT 02 -> MULTI-ENGINE NEWS SEARCH COMPLETE`);
        logTerminalLine(`[11] UNRESOLVED CONFLICT REMAINS BETWEEN PRIMARY REPORTERS`);
        logTerminalLine(`[12] DECISION: FAIL-CLOSED WITHOUT FABRICATION`);
        logTerminalLine(`[13] FINAL DECISION: [CONFLICTING EVIDENCE] -> RETURNING BOTH CLAIMS`);
        renderAttemptCard('ATTEMPT 02', 'Google News (Escalated)', 'CONFLICTING', '0.54', 'Unresolved contradictory claims returned transparently.');
        finishSearchExecution('CONFLICTING', 0.54, 'Contradictory Evidence Maintained Transparently');
      }
    }, 2000);
  }

  function renderAttemptCard(num, engine, state, score, notes) {
    if (!attemptsContainer) return;
    const card = document.createElement('div');
    card.className = 'attempt-card active-attempt';
    card.innerHTML = `
      <div class="attempt-header">
        <span>${num}</span>
        <span>[${state}]</span>
      </div>
      <div class="attempt-query">${engine}</div>
      <div class="attempt-result">Score: <strong>${score}</strong></div>
      <div class="kpi-sub">${notes}</div>
    `;
    attemptsContainer.appendChild(card);
  }

  function finishSearchExecution(finalState, score, summary) {
    if (btnExecuteSearch) {
      btnExecuteSearch.disabled = false;
      btnExecuteSearch.innerHTML = '<span class="btn-inner-label">&#9654; DISPATCH SEARCH</span>';
    }

    if (finalState === 'VERIFIED') play1BitSound('startup-chime');
    else if (finalState === 'CONFLICTING') play1BitSound('quack');
    else play1BitSound('droplet');

    showToast(`Search Finished: [${finalState}] Score: ${score}`);
    updateEvidencePane(finalState, score, summary);
  }

  if (btnExecuteSearch && searchInput) {
    btnExecuteSearch.addEventListener('click', () => {
      const q = searchInput.value.trim() || 'Who acquired Company X in 2024?';
      runRetrievalSimulation(q, 'quorum');
    });
  }

  // --- 6. UPDATE EVIDENCE INSPECTOR PANE ---
  function updateEvidencePane(state, score, summary) {
    const bannerState = document.getElementById('banner-decision-state');
    const bannerScore = document.getElementById('banner-decision-score');
    const headerStatus = document.getElementById('evidence-header-status');
    const evidenceList = document.getElementById('evidence-cards-list');

    if (bannerState) bannerState.textContent = `${state} EVIDENCE`;
    if (bannerScore) bannerScore.textContent = `SCORE: ${score} / 1.00 &bull; ${state === 'VERIFIED' ? 'QUORUM SATISFIED' : 'POLICY NOT MET'}`;
    if (headerStatus) headerStatus.textContent = `[STATUS: ${state}]`;

    if (evidenceList && state === 'CONFLICTING') {
      evidenceList.innerHTML = `
        <div class="evidence-card">
          <div class="card-top">
            <span class="card-rank">#01 [CONTRADICTION CLAIM A]</span>
            <span class="card-domain">wsj.com</span>
            <span class="card-score">Score: 0.78</span>
          </div>
          <h4 class="card-title">Company X Finalizes Acquisition Agreement with Corp Y for $1.2B</h4>
          <div class="card-snippet">"According to sources familiar with the discussions, Company X signed terms to merge with Corp Y..."</div>
          <div class="card-meta"><span>Status: Contradicts Source #02</span></div>
        </div>
        <div class="evidence-card">
          <div class="card-top">
            <span class="card-rank">#02 [CONTRADICTION CLAIM B]</span>
            <span class="card-domain">bloomberg.com</span>
            <span class="card-score">Score: 0.76</span>
          </div>
          <h4 class="card-title">Company X Rebuffs Acquisition Suitors, Plans Independent IPO</h4>
          <div class="card-snippet">"Company X board voted unanimously to terminate takeover talks and pursue independent operation..."</div>
          <div class="card-meta"><span>Status: Contradicts Source #01</span></div>
        </div>
      `;
    }
  }

  // --- 7. QUICK SCENARIO DISPATCHERS ---
  const btnDemo1 = document.getElementById('btn-quick-demo-1');
  const btnDemo2 = document.getElementById('btn-quick-demo-2');
  const btnDemo3 = document.getElementById('btn-quick-demo-3');

  if (btnDemo1) {
    btnDemo1.addEventListener('click', () => {
      switchCategory('pane-search');
      if (searchInput) searchInput.value = 'Who acquired Company X in 2024?';
      runRetrievalSimulation('Who acquired Company X in 2024?', 'quorum');
    });
  }

  if (btnDemo2) {
    btnDemo2.addEventListener('click', () => {
      switchCategory('pane-search');
      if (searchInput) searchInput.value = 'What happened to Target Entity during Q2 restructuring?';
      runRetrievalSimulation('What happened to Target Entity during Q2 restructuring?', 'conflict');
    });
  }

  if (btnDemo3) {
    btnDemo3.addEventListener('click', () => {
      switchCategory('pane-search');
      if (searchInput) searchInput.value = 'Unusual challenge traffic simulation endpoint 2024';
      runRetrievalSimulation('Unusual challenge traffic simulation endpoint 2024', 'degraded');
    });
  }

  // --- 8. LINEAGE PROVENANCE DAG INTERACTION ---
  const dagNodes = document.querySelectorAll('.dag-node');
  const inspectorDetails = document.getElementById('inspector-details');
  const inspectorLegend = document.getElementById('inspector-legend');
  const lineageModal = document.getElementById('modal-lineage-detail');
  const lineageModalTitle = document.getElementById('modal-lineage-title');
  const lineageModalBody = document.getElementById('modal-lineage-body');

  const nodeMetadata = {
    'agent-query': {
      title: '[01] AGENT RESEARCH QUERY',
      hash: 'a1b49f28d8...7710c',
      desc: 'LangChain Agent research request containing natural language intent.',
      records: 'Intent: "Who acquired Company X in 2024?" | Verification Policy: default_strict'
    },
    'mcp-gateway': {
      title: '[02] ALETHEIA MCP GATEWAY',
      hash: 'b3c829e1f4...6621a',
      desc: 'Model Context Protocol (MCP) server validating schema and policy thresholds.',
      records: 'Tool Invoked: aletheia_search | Request ID: req-8f4b-22d9a'
    },
    'orchestrator': {
      title: '[03] RETRIEVAL ORCHESTRATOR',
      hash: 'c5d911a7b2...5532f',
      desc: 'Engine selector & query reformulator routing between SerpApi endpoints.',
      records: 'Engines Targeted: google, google_news | Max Escalation Attempts: 3'
    },
    'serpapi-client': {
      title: '[04] SERPAPI CLIENT ADAPTER',
      hash: 'd7e102f9c8...4413e',
      desc: 'Dedicated SerpApi HTTP adapter executing isolated search queries.',
      records: 'Endpoint: https://serpapi.com/search.json | Status: 200 OK (384ms)'
    },
    'normalizer': {
      title: '[05] EVIDENCE NORMALIZATION',
      hash: 'e9f234a1b0...3324d',
      desc: 'Translating raw JSON response into internal normalized Evidence items.',
      records: '12 Organic Results Mapped | URLs Canonicalized'
    },
    'validator': {
      title: '[06] VALIDATION GATES',
      hash: 'f0a345b2c1...2215c',
      desc: 'Auditing schema integrity, challenge signatures, and tracking parameters.',
      records: 'Status: STRUCTURE_VALID | Zero Challenges Detected | 2 Mirrors Deduplicated'
    },
    'scorer': {
      title: '[07] EVIDENCE SCORING',
      hash: '7f8a3c91d4...1106b',
      desc: '7-Component weighted evidence density, diversity, and freshness model.',
      records: 'Overall Score: 0.91 | Structure: 1.0 | Diversity: 0.83 | Agreement: 0.92'
    },
    'quorum': {
      title: '[08] QUORUM CONSENSUS ENGINE',
      hash: '8a9b4d02e5...0097a',
      desc: 'Verifying minimum independent domain consensus without hallucination.',
      records: 'Quorum Rule: >= 2 Domains | Actual: 3 Domains (Reuters, TechCrunch, Bloomberg)'
    },
    'decision': {
      title: '[09] FINAL VERIFICATION DECISION',
      hash: '9b0c5e13f6...8888f',
      desc: 'Final reliability classification delivered to agent context.',
      records: 'Final State: [VERIFIED EVIDENCE] | Passed Grounding Context to Agent'
    },
    'agent-response': {
      title: '[10] AGENT GROUNDED CONTEXT',
      hash: '0c1d6f24a7...7777e',
      desc: 'AI Agent grounded on verified evidence items with lineage attached.',
      records: 'Downstream Consumer: agent-langchain-prod-04'
    },
    'kafka-telemetry': {
      title: '[11] KAFKA STREAMING EVENT',
      hash: '1d2e7a35b8...6666d',
      desc: 'Telemetry event published to Kafka topic for Spark Structured Streaming.',
      records: 'Topic: aletheia.retrieval.telemetry | Partition: 0 | Offset: 1428'
    }
  };

  dagNodes.forEach(node => {
    node.addEventListener('click', () => {
      play1BitSound('clink');
      dagNodes.forEach(n => n.classList.remove('active-node'));
      node.classList.add('active-node');

      const nodeKey = node.dataset.node;
      const meta = nodeMetadata[nodeKey];
      if (!meta) return;

      if (inspectorLegend) inspectorLegend.textContent = `Node Inspector: ${meta.title}`;
      if (inspectorDetails) {
        inspectorDetails.innerHTML = `
          <div class="inspector-row"><span>Provenance Lineage Hash:</span> <code>${meta.hash}</code></div>
          <div class="inspector-row"><span>Description:</span> <span>${meta.desc}</span></div>
          <div class="inspector-row"><span>Execution Log:</span> <code>${meta.records}</code></div>
        `;
      }

      if (lineageModal && lineageModalTitle && lineageModalBody) {
        lineageModalTitle.textContent = meta.title;
        lineageModalBody.innerHTML = `
          <p style="margin-bottom: 8px;"><strong>Provenance Hash:</strong> <code>${meta.hash}</code></p>
          <p style="margin-bottom: 8px;"><strong>System Role:</strong> ${meta.desc}</p>
          <p><strong>Register Records:</strong><br><code>${meta.records}</code></p>
        `;
        lineageModal.style.display = 'block';
      }
    });
  });

  // --- 9. TELEMETRY CHARTS (1-BIT PIXEL HISTOGRAMS) ---
  const latencyBars = document.getElementById('chart-latency-bars');
  const qualityBars = document.getElementById('chart-quality-bars');

  function initTelemetryCharts() {
    if (latencyBars) {
      latencyBars.innerHTML = '';
      for (let i = 0; i < 30; i++) {
        const col = document.createElement('div');
        col.className = 'chart-col';
        const h = Math.floor(Math.random() * 38) + 12;
        col.style.height = `${h}px`;
        latencyBars.appendChild(col);
      }
    }
    if (qualityBars) {
      qualityBars.innerHTML = '';
      for (let i = 0; i < 30; i++) {
        const col = document.createElement('div');
        col.className = 'chart-col';
        const h = Math.floor(Math.random() * 20) + 40;
        col.style.height = `${h}px`;
        qualityBars.appendChild(col);
      }
    }
  }
  initTelemetryCharts();

  // Shift histograms every 2 seconds
  setInterval(() => {
    if (latencyBars && latencyBars.firstElementChild) {
      latencyBars.removeChild(latencyBars.firstElementChild);
      const col = document.createElement('div');
      col.className = 'chart-col';
      const h = Math.floor(Math.random() * 42) + 10;
      col.style.height = `${h}px`;
      latencyBars.appendChild(col);
    }
    if (qualityBars && qualityBars.firstElementChild) {
      qualityBars.removeChild(qualityBars.firstElementChild);
      const col = document.createElement('div');
      col.className = 'chart-col';
      const h = Math.floor(Math.random() * 18) + 42;
      col.style.height = `${h}px`;
      qualityBars.appendChild(col);
    }

    // Disk activity LED pulse
    const diskDot = document.getElementById('status-disk');
    if (diskDot && Math.random() > 0.5) {
      diskDot.style.backgroundColor = '#ffffff';
      setTimeout(() => {
        diskDot.style.backgroundColor = '#000000';
      }, 140);
    }
  }, 2000);

  // --- 10. CIRCUIT BREAKER CONTROLS ---
  const btnTripOpen = document.getElementById('btn-force-open-circuit');
  const btnTripHalf = document.getElementById('btn-force-half-circuit');
  const btnResetCircuit = document.getElementById('btn-force-close-circuit');

  if (btnTripOpen) {
    btnTripOpen.addEventListener('click', () => {
      play1BitSound('quack');
      showToast('Google Search Circuit Breaker Tripped [OPEN]. Retrieval path avoided.');
      const statusDot = document.getElementById('status-warn');
      if (statusDot) statusDot.style.backgroundColor = '#f37725';
    });
  }

  if (btnTripHalf) {
    btnTripHalf.addEventListener('click', () => {
      play1BitSound('clink');
      showToast('Circuit entered [HALF-OPEN]. Canary requests allowed.');
    });
  }

  if (btnResetCircuit) {
    btnResetCircuit.addEventListener('click', () => {
      play1BitSound('startup-chime');
      showToast('All Circuit Breakers Reset [CLOSED]. Normal operation.');
    });
  }

  // --- 11. DESKTOP DITHER PATTERN PICKER ---
  const ditherPicker = document.getElementById('dither-picker');
  const desktopViewport = document.getElementById('desktop-viewport');

  if (ditherPicker && desktopViewport) {
    ditherPicker.addEventListener('click', (e) => {
      const swatch = e.target.closest('.dither-swatch');
      if (!swatch) return;

      play1BitSound('clink');
      document.querySelectorAll('.dither-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const patternClass = swatch.dataset.pattern;
      for (let i = 1; i <= 8; i++) {
        desktopViewport.classList.remove(`dither-pattern-${i}`);
      }
      desktopViewport.classList.add(patternClass);
      showToast(`Desktop dither texture changed: ${swatch.title}`);
    });
  }

  // --- 12. STEPPERS & SLIDERS ---
  document.querySelectorAll('.stepper-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;

      play1BitSound('clink');
      const min = parseFloat(btn.dataset.min) || 1;
      const max = parseFloat(btn.dataset.max) || 10;
      const step = parseFloat(btn.dataset.step) || 1;
      const dir = parseInt(btn.dataset.dir, 10) || 1;

      let val = parseFloat(input.value) || min;
      val = Math.max(min, Math.min(max, val + dir * step));
      input.value = Number.isInteger(step) ? val : val.toFixed(2);
    });
  });

  const volTrack = document.getElementById('slider-vol-track');
  const volThumb = document.getElementById('slider-vol-thumb');
  if (volTrack && volThumb) {
    volTrack.addEventListener('click', (e) => {
      const rect = volTrack.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      volThumb.style.left = `${pct}%`;
      systemVolume = pct / 100;
      play1BitSound('clink');
    });
  }

  const muteCheckbox = document.getElementById('chk-mute-sound');
  if (muteCheckbox) {
    muteCheckbox.addEventListener('change', (e) => {
      isMuted = e.target.checked;
      if (isMuted) flashMenuBar();
      else play1BitSound('simple-beep');
    });
  }

  const crtCheckbox = document.getElementById('chk-crt-scanlines');
  if (crtCheckbox) {
    crtCheckbox.addEventListener('change', (e) => {
      document.body.classList.toggle('crt-active', e.target.checked);
      play1BitSound('clink');
    });
  }

  // --- 13. ADVANCED DRAWER & ACTION BUTTONS ---
  const disclosureBtn = document.getElementById('btn-disclosure-advanced');
  const advancedDrawer = document.getElementById('advanced-drawer');

  if (disclosureBtn && advancedDrawer) {
    disclosureBtn.addEventListener('click', () => {
      play1BitSound('simple-beep');
      const isOpen = advancedDrawer.classList.toggle('open');
      disclosureBtn.classList.toggle('open', isOpen);
      disclosureBtn.setAttribute('aria-expanded', isOpen);
      setTimeout(updateScrollbarThumb, 100);
    });
  }

  const btnSave = document.getElementById('btn-save');
  const btnRevert = document.getElementById('btn-revert');

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      play1BitSound('startup-chime');
      showToast('ALETHEIA reliability policies committed to PostgreSQL.');
    });
  }

  if (btnRevert) {
    btnRevert.addEventListener('click', () => {
      play1BitSound('quack');
      showToast('Policies restored from defaults.yaml template.');
    });
  }

  // --- 14. TOAST NOTIFICATIONS ---
  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById('system-toast');
    const toastMsg = document.getElementById('toast-msg');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = msg;
    toast.style.display = 'flex';

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.display = 'none';
    }, 2800);
  }

  // --- 15. DESKTOP ICONS & TABLE INTERACTION ---
  document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      play1BitSound('clink');
      document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
    });

    icon.addEventListener('dblclick', () => {
      const name = icon.dataset.name;
      play1BitSound('startup-chime');
      if (name === 'ALETHEIA MCP') {
        const win = document.getElementById('window-preferences');
        if (win) win.style.display = 'flex';
        switchCategory('pane-overview');
      } else if (name === 'SerpApi Bridge') {
        switchCategory('pane-engines');
      } else if (name === 'Kafka Stream') {
        switchCategory('pane-telemetry');
      } else {
        showToast(`Inspecting PostgreSQL: 1,428 search lineage records.`);
      }
    });
  });

  document.querySelectorAll('.table-row-clickable').forEach(row => {
    row.addEventListener('click', () => {
      play1BitSound('clink');
      switchCategory('pane-evidence');
      showToast('Inspecting normalized evidence records for selected retrieval.');
    });
  });

  // --- 16. TOP MENU BAR ACTIONS ---
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      if (!action) return;

      play1BitSound('simple-beep');

      if (action.startsWith('nav-')) {
        const target = action.replace('nav-', 'pane-');
        switchCategory(target);
        return;
      }

      switch (action) {
        case 'about': {
          showToast('ALETHEIA v1.0 — SerpApi Evidence Integrity Layer');
          break;
        }
        case 'mcp-status': {
          showToast('MCP Gateway listening on port 8000 (Ready)');
          break;
        }
        case 'kafka-status': {
          showToast('Kafka Producer Active -> Topic: aletheia.retrieval.telemetry');
          break;
        }
        case 'spark-status': {
          showToast('Spark Structured Streaming: Rolling 5m windows active');
          break;
        }
        case 'calculator': {
          const calc = document.getElementById('modal-calculator');
          if (calc) calc.style.display = 'block';
          break;
        }
        case 'sound-test': {
          play1BitSound('startup-chime');
          break;
        }
        case 'new-query': {
          switchCategory('pane-search');
          break;
        }
        case 'export-evidence': {
          showToast('Evidence JSON exported to /tmp/aletheia-evidence.json');
          break;
        }
        case 'view-lineage': {
          switchCategory('pane-lineage');
          break;
        }
        case 'save-policy': {
          if (btnSave) btnSave.click();
          break;
        }
        case 'run-demo-1': {
          if (btnDemo1) btnDemo1.click();
          break;
        }
        case 'run-demo-2': {
          if (btnDemo2) btnDemo2.click();
          break;
        }
        case 'run-demo-3': {
          if (btnDemo3) btnDemo3.click();
          break;
        }
        case 'invert-theme': {
          document.body.classList.toggle('inverted-display');
          showToast('1-Bit Display Inverted.');
          break;
        }
        case 'crt-flicker': {
          document.body.classList.toggle('crt-active');
          showToast('CRT Scanline Raster Toggled.');
          break;
        }
        case 'trip-circuit': {
          if (btnTripOpen) btnTripOpen.click();
          break;
        }
        case 'reset-circuit': {
          if (btnResetCircuit) btnResetCircuit.click();
          break;
        }
      }
    });
  });

  // --- 17. WINDOW CONTROLS & MODALS ---
  const btnCloseWindow = document.getElementById('btn-close-window');
  if (btnCloseWindow) {
    btnCloseWindow.addEventListener('click', () => {
      play1BitSound('clink');
      const win = document.getElementById('window-preferences');
      if (win) win.style.display = 'none';
      showToast('ALETHEIA console minimized. Double-click ALETHEIA icon to restore.');
    });
  }

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      play1BitSound('clink');
      const modalId = btn.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = 'none';
    });
  });

  // --- 18. DESK CALCULATOR LOGIC ---
  const calcDisplay = document.getElementById('calc-display');
  let currentVal = '0';
  let prevVal = null;
  let currentOp = null;
  let resetNext = false;

  document.querySelectorAll('.calc-key').forEach(keyBtn => {
    keyBtn.addEventListener('click', () => {
      play1BitSound('clink');
      const key = keyBtn.dataset.key;

      if (!isNaN(key)) {
        if (currentVal === '0' || resetNext) {
          currentVal = key;
          resetNext = false;
        } else {
          currentVal += key;
        }
      } else if (key === '.') {
        if (!currentVal.includes('.')) currentVal += '.';
      } else if (key === 'C') {
        currentVal = '0';
        prevVal = null;
        currentOp = null;
      } else if (key === '+/-') {
        currentVal = String(-parseFloat(currentVal));
      } else if (key === '%') {
        currentVal = String(parseFloat(currentVal) / 100);
      } else if (['+', '-', '*', '/'].includes(key)) {
        prevVal = parseFloat(currentVal);
        currentOp = key;
        resetNext = true;
      } else if (key === '=') {
        if (prevVal !== null && currentOp) {
          const a = prevVal;
          const b = parseFloat(currentVal);
          let res = 0;
          if (currentOp === '+') res = a + b;
          if (currentOp === '-') res = a - b;
          if (currentOp === '*') res = a * b;
          if (currentOp === '/') res = b !== 0 ? a / b : 'ERR';
          currentVal = String(res).slice(0, 10);
          prevVal = null;
          currentOp = null;
          resetNext = true;
        }
      }

      if (calcDisplay) calcDisplay.value = currentVal;
    });
  });

  // --- 19. DRAGGABLE WINDOW SYSTEM ---
  function makeDraggable(win, handle) {
    if (!win || !handle) return;
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    handle.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      isDragging = true;
      const rect = win.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      win.style.zIndex = '500';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      win.style.left = `${e.clientX - offsetX}px`;
      win.style.top = `${e.clientY - offsetY}px`;
      win.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) isDragging = false;
    });
  }

  const mainWindow = document.getElementById('window-preferences');
  const mainTitlebar = document.getElementById('main-titlebar');
  if (mainWindow && mainTitlebar) makeDraggable(mainWindow, mainTitlebar);

  const calcModal = document.getElementById('modal-calculator');
  const calcTitlebar = calcModal ? calcModal.querySelector('.window-titlebar') : null;
  if (calcModal && calcTitlebar) makeDraggable(calcModal, calcTitlebar);

  const lineageModalEl = document.getElementById('modal-lineage-detail');
  const lineageTitlebar = lineageModalEl ? lineageModalEl.querySelector('.window-titlebar') : null;
  if (lineageModalEl && lineageTitlebar) makeDraggable(lineageModalEl, lineageTitlebar);

  console.log('ALETHEIA 1-Bit Production Environment Initialized.');
})();
