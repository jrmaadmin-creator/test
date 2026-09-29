// Scenario mode: a patient, a monitor, and decisions in order. Each correct
// choice may change what the monitor shows. Feedback cites NH Patient Care
// Protocols v9.3 (adult) or AHA where NH defers to ACLS.

export const SCENARIOS = [
  {
    id: 'brady-inferior',
    title: 'Dizzy after chores',
    dispatch: '68-year-old man, dizzy and weak, nearly passed out in the barn.',
    patient: 'Pale, cool, diaphoretic. Answers slowly and is confused about the day. History: hypertension, takes metoprolol.',
    vitals: { HR: '37', BP: '78/40', RR: '20', SpO2: '94%', Glucose: '118' },
    rhythm: 'avb3',
    steps: [
      { q: 'What is the rhythm?', o: [['Third-degree (complete) AV block', true, 'P waves march through at about 83 while wide escape beats run at about 37 with no relationship.'], ['Second-degree type I', false, 'Type I has lengthening PR intervals before a dropped beat. Here there is no consistent PR at all.'], ['Sinus bradycardia', false, 'Sinus bradycardia has a P wave before every QRS with a constant PR.'], ['Junctional rhythm', false, 'Junctional escape is narrow. These escape beats are wide, and the P waves are unrelated.']] },
      { q: 'Is he hemodynamically unstable?', o: [['Yes: hypotension and altered mental status', true, 'NH 3.5A pearls list hypotension, acutely altered mental status, shock, acute heart failure and ischemic chest pain.'], ['No: heart rate alone does not decide it', false, 'Right idea, but he does have hypotension and confusion.'], ['Only if SpO2 is below 90%', false, 'Oxygen saturation is not one of the listed instability signs.'], ['Only if he has chest pain', false, 'Chest pain is one sign, but hypotension and altered mental status count too.']] },
      { q: 'First medication per NH Bradycardia 3.1A?', o: [['Atropine 1 mg IV (repeat every 3–5 min, max 3 mg)', true, 'NH 3.1A. With a wide escape, the block is likely below the AV node, so atropine may not work: be ready to pace.'], ['Adenosine 6 mg rapid IV push', false, 'Adenosine slows AV conduction. It is for narrow regular tachycardia (3.5A).'], ['Amiodarone 150 mg IV', false, 'Antiarrhythmics can suppress the escape rhythm.'], ['Diltiazem 0.25 mg/kg IV', false, 'Diltiazem slows the heart further.']] },
      { q: 'No change after atropine. Next?', o: [['Transcutaneous pacing, with sedation if feasible', true, 'NH 3.1A: consider transcutaneous pacing; administer procedural sedation before or during pacing if feasible (e.g., midazolam 2.5 mg IV).'], ['Wait 30 minutes for atropine to work', false, 'He is unstable; NH 3.1A moves on to pacing and vasopressors.'], ['Synchronized cardioversion', false, 'Cardioversion treats tachyarrhythmias.'], ['Defibrillate at maximum energy', false, 'He has a pulse. Defibrillation is for VF and pulseless VT.']], rhythm: 'paced', vitals: { HR: '70 (paced)', BP: '82/48' } },
      { q: 'Capture confirmed, but BP is still 82/48. What does NH 3.1A offer next?', o: [['Norepinephrine 1–80 mcg/min or epinephrine 2–10 mcg/min; push-dose epi 10–20 mcg if no pump', true, 'NH 3.1A lists these vasopressors and push-dose epinephrine. Contact Medical Control for expert consultation.'], ['Dopamine 5–20 mcg/kg/min', false, 'Dopamine appears in AHA material but is not listed in NH 3.1A.'], ['Amiodarone 150 mg IV', false, 'Not a pressor, and it may suppress the escape rhythm.'], ['Adenosine 6 mg', false, 'Adenosine has no role here.']] },
    ],
  },
  {
    id: 'svt-gym',
    title: 'Palpitations at the gym',
    dispatch: '24-year-old woman with a racing heart after a workout.',
    patient: 'Alert, anxious, warm and dry. No chest pain. Has had "episodes" before that stopped on their own.',
    vitals: { HR: '180', BP: '118/76', RR: '18', SpO2: '99%' },
    rhythm: 'svt',
    steps: [
      { q: 'What is the rhythm?', o: [['Supraventricular tachycardia', true, 'Regular, narrow, 180, no visible P waves: AVNRT pattern.'], ['Sinus tachycardia', false, 'Sinus tachycardia has visible P waves and rarely reaches 180 at rest in a young adult.'], ['Atrial fibrillation', false, 'A-fib is irregularly irregular. This is regular.'], ['Ventricular tachycardia', false, 'VT is wide. These complexes are narrow.']] },
      { q: 'She is stable. First step per NH 3.5A?', o: [['Vagal maneuvers', true, 'NH 3.5A: for regular rhythms over 150 bpm, perform vagal maneuvers.'], ['Synchronized cardioversion', false, 'Reserved for unstable patients.'], ['Diltiazem 0.25 mg/kg first', false, 'Vagal maneuvers and adenosine come first for a regular narrow tachycardia.'], ['Atropine 1 mg IV', false, 'Atropine speeds the heart.']] },
      { q: 'Vagal maneuvers fail. Next?', o: [['Adenosine 6 mg rapid IVP with a rapid saline flush, antecubital IV', true, 'NH 3.5A: adenosine 6 mg rapid IVP; may repeat 12 mg in 1–2 minutes. Record a strip while you push it.'], ['Adenosine 6 mg slow IV push over 2 minutes', false, 'Adenosine lasts seconds; it must be given rapidly with a flush.'], ['Amiodarone 300 mg IV push', false, '300 mg push is the arrest dose.'], ['Magnesium 2 g IV', false, 'Magnesium is for torsades.']], rhythm: 'nsr', vitals: { HR: '88', BP: '120/78' } },
      { q: 'She converts to sinus rhythm. Now?', o: [['12-lead, monitor, transport; repeat the successful dose if SVT recurs', true, 'NH 3.5A: may repeat the successful dose if the rhythm recurs after conversion. A post-conversion 12-lead helps look for WPW.'], ['Give diltiazem to prevent recurrence', false, 'Not indicated after conversion in the field.'], ['Release without transport', false, 'She needs evaluation and a post-conversion ECG.'], ['Synchronized cardioversion to be safe', false, 'She is already in sinus rhythm.']] },
    ],
  },
  {
    id: 'vf-rink',
    title: 'Collapse at the rink',
    dispatch: '55-year-old man collapsed on the bench at a hockey rink. Bystander CPR in progress.',
    patient: 'Unresponsive, not breathing normally, no pulse.',
    vitals: { HR: '0', BP: '—', RR: 'agonal', SpO2: '—' },
    rhythm: 'vf',
    steps: [
      { q: 'You arrive first. Priority?', o: [['Take over high-performance compressions and apply the AED/defibrillator', true, 'NH 3.2A and Team Focused CPR 3.6: immediate uninterrupted compressions at 100–120/min and early defibrillation.'], ['Intubate first', false, 'NH 3.2A: consider intubation after 4 cycles (8 minutes).'], ['Start an IV first', false, 'IV/IO must never delay compressions or the shock.'], ['Check a blood glucose', false, 'Compressions and defibrillation come first.']] },
      { q: 'How does NH 3.2A want you to ventilate in the first cycles?', o: [['High-flow O2 by NRB (passive) or BVM 1 breath every 10 compressions without pausing', true, 'NH 3.2A ventilation options for cardiac-cause arrest.'], ['30:2 with long pauses for breaths', false, 'NH 3.2A avoids pausing compressions for breaths in adult cardiac arrest.'], ['No oxygen until ROSC', false, 'Oxygen is part of the protocol.'], ['Intubate immediately', false, 'Delay intubation until after 4 cycles.']] },
      { q: 'The monitor shows VF. Energy per NH 3.2A?', o: [['The device’s maximum energy', true, 'NH 3.2A: defibrillate as indicated at the device’s maximum energy. Compress while charging.'], ['50 J and escalate', false, 'That is a cardioversion approach.'], ['Synchronized 100 J', false, 'VF cannot be synchronized.'], ['No shock until epinephrine is given', false, 'Shock first.']] },
      { q: 'When does the AEMT first consider epinephrine?', o: [['After the first 2-minute cycle, then every other cycle', true, 'NH 3.2A AEMT standing order: epinephrine 1 mg IV (0.1 mg/mL) after the first 2-minute cycle; repeat every other cycle.'], ['Before the first shock', false, 'Defibrillation comes first.'], ['Every cycle', false, 'Every other cycle (roughly every 4 minutes).'], ['Only after ROSC', false, 'Epinephrine is an arrest drug.']] },
      { q: 'VF persists after 3 shocks. Paramedic next step?', o: [['Anti-dysrhythmic per ACLS: amiodarone 300 mg IV/IO (then 150 mg) or lidocaine', true, 'NH 3.2A: administer anti-dysrhythmic per ACLS algorithms. For refractory VF also consider Double Sequential Defibrillation (6.2) or a pad vector change.'], ['Amiodarone 150 mg over 10 minutes', false, 'That is the stable-VT dose (3.5A).'], ['Stop and call it', false, 'NH 3.2A: consider resuscitation for up to 60 minutes from dispatch.'], ['Adenosine 6 mg', false, 'No role in VF.']], rhythm: 'nsr', vitals: { HR: '96', BP: '84/50', RR: 'bagged', SpO2: '94%' } },
      { q: 'ROSC. BP 84/50. NH 3.4 target and first step?', o: [['Keep SBP over 90 or MAP 65 or higher; 250 mL fluid boluses (max 2000 mL), then vasopressors', true, 'NH 3.4 Post Resuscitative Care. Get a 12-lead; STEMI criteria means a STEMI Alert.'], ['Hyperventilate to 30 breaths per minute', false, 'NH 3.4 pearl: avoid hyperventilation.'], ['Give amiodarone 300 mg', false, 'That is an arrest dose.'], ['No treatment: pulses are back', false, 'Post-ROSC hypotension needs treatment.']] },
    ],
  },
  {
    id: 'pea-bleed',
    title: 'The bleeding ulcer',
    dispatch: '58-year-old man vomiting blood, then collapsed.',
    patient: 'Pale, unresponsive, no carotid pulse. Monitor shows a fast, narrow, organized rhythm.',
    vitals: { HR: '110 on monitor', BP: '—', RR: 'none', SpO2: '—' },
    rhythm: 'pea',
    steps: [
      { q: 'What is this?', o: [['Pulseless electrical activity (narrow)', true, 'An organized rhythm with no pulse is PEA.'], ['Sinus tachycardia', false, 'The rhythm looks like sinus tachycardia, but there is no pulse.'], ['VF', false, 'VF has no organized complexes.'], ['Asystole', false, 'There is clear electrical activity.']] },
      { q: 'Shock?', o: [['No: start CPR; PEA is not shockable', true, 'NH 3.2A: asystole and PEA get CPR and epinephrine, not defibrillation.'], ['Yes, at maximum energy', false, 'Shocks are for VF and pulseless VT.'], ['Synchronized 50 J', false, 'He has no pulse; this is not a tachycardia with a pulse.'], ['Pace him', false, 'Pacing does not fix a mechanical cause.']] },
      { q: 'Narrow PEA after a GI bleed. What does NH 3.2A point you to?', o: [['A mechanical cause, hypovolemia: IV fluid boluses', true, 'NH 3.2A: narrow complex PEA is often mechanical (hemorrhage/hypovolemia, tension pneumothorax, massive MI, PE).'], ['Calcium and bicarbonate', false, 'That is for wide, metabolic PEA.'], ['Atropine', false, 'Not in NH 3.2A for PEA.'], ['Needle decompression', false, 'Only for suspected tension pneumothorax.']] },
    ],
  },
  {
    id: 'pea-dialysis',
    title: 'Missed dialysis',
    dispatch: '62-year-old woman, dialysis patient who missed two sessions, found unresponsive.',
    patient: 'Unresponsive, no pulse. Family says she felt weak all day.',
    vitals: { HR: '40 on monitor', BP: '—', RR: 'none', SpO2: '—' },
    rhythm: 'pea-wide',
    steps: [
      { q: 'What is this?', o: [['PEA, slow and wide', true, 'Slow wide complexes with no pulse.'], ['Idioventricular rhythm with a pulse', false, 'Check the patient: there is no pulse.'], ['Third-degree AV block', false, 'No P waves are visible, and there is no pulse.'], ['Asystole', false, 'There are complexes.']] },
      { q: 'Most likely cause?', o: [['Hyperkalemia (metabolic)', true, 'NH 3.2A: wide complex PEA is often metabolic, including hyperkalemia and sodium-channel blocker toxicity.'], ['Tension pneumothorax', false, 'Possible, but the history points to potassium.'], ['Hypovolemia', false, 'The history points to potassium.'], ['Vagal response', false, 'Not a cause of PEA.']] },
      { q: 'Specific treatment per NH 3.2A (with CPR and epinephrine)?', o: [['Calcium gluconate 3 g IV or calcium chloride 1 g IV, and sodium bicarbonate 1–2 mEq/kg IV', true, 'NH 3.2A wide complex PEA. Flush between calcium and bicarbonate.'], ['Adenosine 6 mg', false, 'No role.'], ['Amiodarone 300 mg', false, 'For shock-refractory VF/pVT.'], ['Defibrillate', false, 'Not shockable.']] },
    ],
  },
  {
    id: 'vt-stable',
    title: 'Wide and fast, still talking',
    dispatch: '66-year-old man with palpitations. Old heart attack 5 years ago.',
    patient: 'Alert and oriented, mild lightheadedness, no chest pain, skin warm.',
    vitals: { HR: '170', BP: '112/70', RR: '18', SpO2: '96%' },
    rhythm: 'vt',
    steps: [
      { q: 'What is the rhythm?', o: [['Monomorphic ventricular tachycardia', true, 'Regular, wide, identical complexes at 170. With an old MI, scar-related VT is most likely. NH 3.5A: treat wide complex tachycardia as VT until proven otherwise.'], ['SVT', false, 'SVT is narrow unless there is a bundle branch block. Assume VT.'], ['Sinus tachycardia', false, 'No P waves precede the wide complexes.'], ['Torsades', false, 'Torsades twists and changes size. These complexes are identical.']] },
      { q: 'He is stable. Antiarrhythmic per NH 3.5A?', o: [['Amiodarone 150 mg IV in 50–100 mL over 10 minutes (may repeat once)', true, 'NH 3.5A. Adenosine may be considered only if the rhythm is regular and monomorphic. Lidocaine is second line.'], ['Amiodarone 300 mg IV push', false, 'That is the cardiac arrest dose.'], ['Diltiazem 0.25 mg/kg', false, 'Calcium channel blockers can cause collapse in VT.'], ['Atropine 1 mg', false, 'No role.']] },
      { q: 'His BP drops to 72/40 and he becomes confused, still with a pulse.', o: [['Synchronized cardioversion at 100 J, sedate if feasible', true, 'NH 3.5A: wide regular rhythm, 100 J biphasic or monophasic.'], ['Defibrillate at maximum, unsynchronized', false, 'He has a pulse and a regular monomorphic rhythm: synchronize.'], ['Repeat amiodarone and wait', false, 'He is now unstable: electricity.'], ['Adenosine 12 mg', false, 'Unstable patients need cardioversion.']], rhythm: 'nsr', vitals: { HR: '82', BP: '104/66' } },
    ],
  },
  {
    id: 'torsades-methadone',
    title: 'Fainting spells',
    dispatch: '45-year-old woman with repeated fainting today. On methadone; recent vomiting and diarrhea.',
    patient: 'Awake between episodes, weak. Monitor shows runs of twisting wide complexes.',
    vitals: { HR: '230 during runs', BP: '90/60 between runs', RR: '20', SpO2: '97%' },
    rhythm: 'torsades',
    steps: [
      { q: 'What is the rhythm during the runs?', o: [['Torsades de pointes', true, 'Polymorphic VT twisting around the baseline. Methadone and low magnesium or potassium from vomiting and diarrhea prolong the QT.'], ['Monomorphic VT', false, 'The complexes change size and direction.'], ['Coarse VF', false, 'There is an organized twisting pattern, and she has a pulse between runs.'], ['Atrial fibrillation', false, 'These are wide ventricular complexes.']] },
      { q: 'With a pulse, which medication does NH 3.5A list?', o: [['Magnesium sulfate 1–2 g IV over 5 minutes', true, 'NH 3.5A: polymorphic VT/torsades, consider magnesium sulfate 1–2 g IV over 5 minutes.'], ['Amiodarone 150 mg', false, 'Amiodarone prolongs the QT and is not the NH 3.5A choice for torsades.'], ['Adenosine 6 mg', false, 'Only for regular monomorphic complexes.'], ['Metoprolol 5 mg', false, 'Not for torsades.']] },
      { q: 'A run does not stop and she loses her pulse.', o: [['Cardiac arrest 3.2A: CPR and defibrillate at maximum energy', true, 'Pulseless polymorphic VT is treated like VF under NH 3.2A.'], ['Synchronized 100 J', false, 'Polymorphic complexes cannot be synchronized, and she has no pulse.'], ['More magnesium only', false, 'Pulseless: defibrillate.'], ['Atropine', false, 'No role.']], rhythm: 'vf', vitals: { HR: '0', BP: '—', RR: 'agonal' } },
    ],
  },
  {
    id: 'peds-brady-infant',
    peds: true,
    title: 'Floppy infant with RSV',
    dispatch: '6-month-old with a cold for three days, now hard to wake.',
    patient: 'Limp, gray, grunting, poor chest rise. Weight about 8 kg on the length-based tape.',
    vitals: { HR: '48', BP: 'weak brachial', RR: '8, shallow', SpO2: '78%', Weight: '8 kg' },
    rhythm: 'sinus-brady',
    steps: [
      { q: 'What comes first for this bradycardic infant?', o: [['Ventilate and oxygenate with a BVM', true, 'NH 3.1P: consider underlying causes, hypoxia first. In children, bradycardia is usually hypoxic.'], ['Atropine 0.02 mg/kg IV', false, 'NH 3.1P lists atropine for increased vagal tone or AV block. Fix the airway first.'], ['Transcutaneous pacing', false, 'Oxygenation and ventilation come first.'], ['Obtain a 12-lead', false, 'Useful later; it will not fix hypoxia.']] },
      { q: 'After a minute of good BVM ventilation with 100% oxygen, HR is still 48 with poor perfusion.', o: [['Begin CPR', true, 'NH 3.1P: in infants and neonates, begin or continue CPR if the heart rate is under 60 with hypoperfusion despite adequate ventilation and oxygenation.'], ['Keep ventilating and wait for the rate to rise', false, 'Under 60 with hypoperfusion despite adequate ventilation means CPR.'], ['Defibrillate', false, 'Sinus bradycardia is not shockable.'], ['Give adenosine', false, 'Adenosine slows the heart.']] },
      { q: 'Paramedic, IO in place. First drug per NH 3.1P and dose for 8 kg?', o: [['Epinephrine 0.01 mg/kg = 0.08 mg (0.8 mL of 0.1 mg/mL), every 3–5 min', true, 'NH 3.1P: epinephrine 0.01 mg/kg IV (0.1 mL/kg), max single dose 1 mg.'], ['Epinephrine 1 mg', false, 'That is the adult dose, more than 10 times too much for 8 kg.'], ['Atropine 0.5 mg', false, 'Atropine is for increased vagal tone or AV block; 0.5 mg is also the maximum single dose, not the weight-based dose.'], ['Amiodarone 5 mg/kg', false, 'Amiodarone is for VF/pVT or wide tachycardia.']], rhythm: 'sinus-tach', vitals: { HR: '125', BP: 'strong brachial', SpO2: '94%' } },
    ],
  },
  {
    id: 'peds-vf-baseball',
    peds: true,
    title: 'Line drive to the chest',
    dispatch: '10-year-old hit in the chest by a baseball, collapsed on the field. Coach doing CPR.',
    patient: 'Unresponsive, no pulse. About 32 kg on the length-based tape.',
    vitals: { HR: '0', BP: '—', RR: 'none', SpO2: '—', Weight: '32 kg' },
    rhythm: 'vf',
    steps: [
      { q: 'Commotio cordis puts the heart in VF. Which pads does NH 3.2P call for at age 10?', o: [['Adult pads (pediatric pads are for birth to age 8)', true, 'NH 3.2P: from birth to age 8 use pediatric AED pads.'], ['Pediatric pads only', false, 'Pediatric pads are for birth to 8 years.'], ['No AED under age 12', false, 'Use the AED as soon as possible.'], ['Wait for the paramedic monitor', false, 'Early defibrillation is the priority.']] },
      { q: 'Paramedic first shock energy for 32 kg?', o: [['2 J/kg, about 64 J (nearest setting up)', true, 'NH 3.2P: defibrillate at 2 J/kg, then 4 J/kg, then 4 J/kg or more (max 10 J/kg or the adult dose).'], ['Device maximum', false, 'That is the adult 3.2A instruction.'], ['0.5 J/kg synchronized', false, 'That is pediatric cardioversion for a patient with a pulse.'], ['10 J/kg', false, '10 J/kg is the ceiling, not the first dose.']] },
      { q: 'Still VF after the second shock (4 J/kg). Drugs per NH 3.2P for 32 kg?', o: [['Epinephrine 0.32 mg (3.2 mL of 0.1 mg/mL), and consider amiodarone 160 mg', true, 'NH 3.2P: after the second defibrillation, epinephrine 0.01 mg/kg every other cycle; consider amiodarone 5 mg/kg (max 300 mg) or lidocaine 1 mg/kg.'], ['Epinephrine 1 mg and amiodarone 300 mg', false, 'Adult doses. Use weight: 0.01 mg/kg and 5 mg/kg.'], ['Atropine 0.02 mg/kg', false, 'No role in VF.'], ['Adenosine 0.1 mg/kg', false, 'No role in VF.']], rhythm: 'nsr', vitals: { HR: '110', BP: '92/58', RR: 'bagged' } },
    ],
  },
];

const SECONDS_PER_DECISION = 20;
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

export class ScenarioView {
  constructor(root, { onRhythm, byId, onComplete }) {
    this.root = root;
    this.onRhythm = onRhythm;
    this.byId = byId;
    this.onComplete = onComplete;
    this.current = null;
    try {
      this.stats = JSON.parse(localStorage.getItem('hcl:scen')) || {};
    } catch {
      this.stats = {};
    }
    try {
      this.timed = localStorage.getItem('hcl:scenTimed') === '1';
    } catch {
      this.timed = false;
    }
    this.showList();
  }

  stopTimer() {
    clearInterval(this.timer);
    this.timer = null;
  }

  startTimer() {
    this.stopTimer();
    const c = this.current;
    c.deadline = performance.now() + SECONDS_PER_DECISION * 1000;
    this.timer = setInterval(() => {
      const left = Math.max(0, (c.deadline - performance.now()) / 1000);
      const t = this.root.querySelector('#case-timer');
      if (t) {
        t.textContent = `${Math.ceil(left)} s`;
        t.dataset.low = left < 6 ? '1' : '';
      }
      if (left <= 0) {
        this.stopTimer();
        const step = c.s.steps[c.step];
        c.misses += 1;
        c.timedOut = true;
        c.answered = true;
        c.picked = step.o.findIndex((o) => o[1]);
        if (step.rhythm) this.onRhythm(step.rhythm);
        if (step.vitals) Object.assign(c.vitals, step.vitals);
        this.render();
      }
    }, 200);
  }

  showList() {
    this.stopTimer();
    this.current = null;
    this.root.innerHTML = `<p class="eyebrow">Scenarios</p><h2>Run a call</h2>
      <p>Read the dispatch, watch the monitor, and make each decision in order. Answers are graded against the NH Patient Care Protocols v9.3, adult and pediatric.</p>
      <label class="toggle"><input type="checkbox" id="case-timed"> <span>Timed: ${SECONDS_PER_DECISION} seconds per decision</span></label>
      <ul class="case-list" id="case-list"></ul>`;
    const tog = this.root.querySelector('#case-timed');
    tog.checked = this.timed;
    tog.addEventListener('change', () => {
      this.timed = tog.checked;
      try {
        localStorage.setItem('hcl:scenTimed', tog.checked ? '1' : '0');
      } catch {
        /* storage unavailable */
      }
    });
    const ul = this.root.querySelector('#case-list');
    for (const s of SCENARIOS) {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'struct';
      const t = document.createElement('strong');
      t.textContent = s.title;
      if (s.peds) {
        const tag = document.createElement('small');
        tag.textContent = 'Pediatric';
        t.appendChild(tag);
      }
      const d = document.createElement('span');
      d.textContent = s.dispatch;
      b.append(t, d);
      const st = this.stats[s.id];
      if (st) {
        const r = document.createElement('span');
        r.className = 'case-record';
        r.textContent = `Run ${st.runs}× · ${st.clean} clean${st.best != null ? ` · best ${fmt(st.best)}` : ''}`;
        b.appendChild(r);
      }
      b.addEventListener('click', () => this.start(s.id));
      li.appendChild(b);
      ul.appendChild(li);
    }
  }

  start(id) {
    const s = SCENARIOS.find((x) => x.id === id);
    const shuffle = (n) => {
      const a = [...Array(n).keys()];
      for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    this.current = { s, step: 0, misses: 0, picked: null, done: false, orders: s.steps.map((st) => shuffle(st.o.length)), t0: performance.now(), timed: this.timed, vitals: { ...s.vitals } };
    this.onRhythm(s.rhythm);
    this.render();
    if (this.current.timed) this.startTimer();
  }

  pick(i) {
    const c = this.current;
    const step = c.s.steps[c.step];
    const [, ok] = step.o[i];
    c.picked = i;
    if (ok) {
      c.answered = true;
      this.stopTimer();
      if (step.rhythm) this.onRhythm(step.rhythm);
      if (step.vitals) Object.assign(c.vitals, step.vitals);
    } else {
      c.misses += 1;
    }
    this.render();
  }

  advance() {
    const c = this.current;
    c.step += 1;
    c.picked = null;
    c.answered = false;
    c.timedOut = false;
    if (c.step >= c.s.steps.length) {
      c.done = true;
      this.stopTimer();
      c.secs = (performance.now() - c.t0) / 1000;
      const st = this.stats[c.s.id] || { runs: 0, clean: 0, best: null };
      st.runs += 1;
      if (!c.misses) st.clean += 1;
      if (c.timed && !c.misses) st.best = st.best == null ? c.secs : Math.min(st.best, c.secs);
      this.stats[c.s.id] = st;
      try {
        localStorage.setItem('hcl:scen', JSON.stringify(this.stats));
      } catch {
        /* storage unavailable */
      }
      this.onComplete?.(this.stats);
    }
    this.render();
    if (!c.done && c.timed) this.startTimer();
  }

  render() {
    const c = this.current;
    if (!c) return this.showList();
    const { s } = c;
    const el = (tag, cls, text) => {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      return n;
    };
    this.root.replaceChildren();
    const back = el('button', 'btn-link case-back', '← All scenarios');
    back.type = 'button';
    back.addEventListener('click', () => this.showList());
    this.root.append(back, el('p', 'eyebrow', 'Scenario'), el('h2', null, s.title));
    const card = el('div', 'case-card');
    card.append(el('p', null, s.dispatch), el('p', 'muted', s.patient));
    const dl = el('dl', 'vitals');
    for (const [k, v] of Object.entries(c.vitals)) {
      const d = el('div');
      d.append(el('dt', null, k), el('dd', null, v));
      dl.appendChild(d);
    }
    card.appendChild(dl);
    this.root.appendChild(card);

    if (c.done) {
      const total = s.steps.length;
      const res = el('div', 'quiz-result');
      res.dataset.state = c.misses ? 'wrong' : 'right';
      res.append(
        el('p', 'quiz-verdict', 'Call complete'),
        el('p', 'quiz-name', c.misses ? `${total} decisions, ${c.misses} wrong turn${c.misses > 1 ? 's' : ''}` : `${total} for ${total}`),
        el('p', 'quiz-score', `Time ${fmt(c.secs)}${c.timed ? ' (timed)' : ''}`),
        el('p', 'quiz-tip', 'Review the Treatment tab in Learn mode for the full protocol steps.'),
      );
      const again = el('button', 'btn btn-primary', 'Run it again');
      again.type = 'button';
      again.addEventListener('click', () => this.start(s.id));
      const list = el('button', 'btn', 'Pick another call');
      list.type = 'button';
      list.addEventListener('click', () => this.showList());
      const row = el('div', 'quiz-actions');
      row.append(again, list);
      res.appendChild(row);
      this.root.appendChild(res);
      return;
    }

    const step = s.steps[c.step];
    const head = el('p', 'quiz-score', `Decision ${c.step + 1} of ${s.steps.length}`);
    if (c.timed && !c.answered) {
      const t = el('span', 'case-timer', `${SECONDS_PER_DECISION} s`);
      t.id = 'case-timer';
      head.append(' · ', t);
    }
    this.root.append(head, el('h3', 'case-q', step.q));
    const opts = el('div', 'quiz-options');
    c.orders[c.step].forEach((i, pos) => {
      const [text, ok] = step.o[i];
      const b = el('button', 'quiz-opt');
      b.type = 'button';
      b.append(el('kbd', null, String(pos + 1)), el('span', null, text));
      if (c.answered) b.disabled = true;
      if (c.picked === i) b.dataset.state = ok ? 'right' : 'wrong';
      if (c.answered && ok) b.dataset.state = 'right';
      b.addEventListener('click', () => this.pick(i));
      opts.appendChild(b);
    });
    this.root.appendChild(opts);
    if (c.picked != null) {
      const [, ok, fb] = step.o[c.picked];
      const res = el('div', 'quiz-result');
      res.dataset.state = ok ? 'right' : 'wrong';
      res.append(el('p', 'quiz-verdict', c.timedOut ? 'Time’s up' : ok ? 'Correct' : 'Try again'), el('p', null, fb));
      if (ok || c.timedOut) {
        const next = el('button', 'btn btn-primary', c.step + 1 < s.steps.length ? 'Next decision' : 'Finish');
        next.type = 'button';
        next.addEventListener('click', () => this.advance());
        const row = el('div', 'quiz-actions');
        row.appendChild(next);
        res.appendChild(row);
      }
      this.root.appendChild(res);
    }
  }

  key(e) {
    const c = this.current;
    if (!c || c.done) return false;
    if (!c.answered && /^[1-4]$/.test(e.key)) {
      const i = c.orders[c.step][Number(e.key) - 1];
      if (i != null) this.pick(i);
      return true;
    }
    if (c.answered && e.key === 'Enter') {
      this.advance();
      return true;
    }
    return false;
  }
}
