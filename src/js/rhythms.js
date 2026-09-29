// Rhythm library: teaching content + a generator for each rhythm.
// `expect` is checked by scripts/check-rhythms.mjs so the generated strip
// always matches the criteria printed beside it.

import {
  act,
  addComps,
  avNode,
  caption,
  chamber,
  ectopicAtria,
  interval,
  junctionalFire,
  label,
  ripple,
  sinusAtria,
  sinusBeat,
  ventricles,
  ventricularFocus,
} from './engine.js';
import { comp, DIR, SHAPES, fibVector, flutterVector, vfVector, asystoleVector, norm, neg } from './ecg.js';

export const GROUPS = [
  'Sinus',
  'Atrial & supraventricular',
  'Junctional',
  'AV blocks',
  'Ventricular',
  'Cardiac arrest',
  'Bundle branch & pre-excitation',
  'Paced',
  'Monitor artifacts',
];

const FILTER = { at: 0.55, kind: 'filter' };
const BLOCK = { at: 0.6, kind: 'block' };

export const RHYTHMS = [
  // ---------------------------------------------------------------- Sinus
  {
    id: 'nsr',
    name: 'Normal sinus rhythm',
    short: 'NSR',
    group: 'Sinus',
    summary: 'The reference rhythm. Every beat starts in the SA node and follows the full pathway on time.',
    criteria: {
      rate: '60–100/min (shown: 75)',
      rhythm: 'Regular',
      p: 'Upright in II, one before every QRS, all the same shape',
      pr: '0.12–0.20 s, constant',
      qrs: 'Narrow, under 0.12 s',
    },
    mechanism:
      'The SA node fires 60–100 times a minute. Each impulse spreads across both atria (P wave), is held briefly in the AV node (PR segment) so the atria can finish filling the ventricles, then races down the bundle of His, the bundle branches and the Purkinje fibers so both ventricles contract together (narrow QRS). The T wave is the ventricles resetting.',
    watch: 'Follow one impulse from the SA node to the ventricles. Match each glow to the wave being drawn on the strip.',
    causes: ['Normal finding'],
    significance:
      'This is the baseline to compare every other rhythm against. A normal rhythm on the monitor does not prove a pulse (PEA), so always check the patient.',
    tip: 'Answer all five questions every time: rate, rhythm, P waves, PR interval, QRS width.',
    expect: { vRate: [72, 78], pr: [0.12, 0.2], qrs: [0, 0.11], regular: true },
    next(b, s) {
      const rr = 0.8 + (s.rng() - 0.5) * 0.03;
      sinusBeat(b, s.t, 0.16, { rr });
      s.t += rr;
    },
  },
  {
    id: 'sinus-brady',
    name: 'Sinus bradycardia',
    short: 'Sinus brady',
    group: 'Sinus',
    summary: 'Normal pathway, normal complexes, but the SA node fires slower than 60 per minute.',
    criteria: {
      rate: 'Under 60/min (shown: 48)',
      rhythm: 'Regular',
      p: 'Normal, one before every QRS',
      pr: '0.12–0.20 s, constant',
      qrs: 'Narrow, under 0.12 s',
    },
    mechanism:
      'The SA node is still the pacemaker and the pathway is normal. It fires slower, usually because vagal (parasympathetic) tone is high or the node itself is depressed. Each complex is normal; only the gap between beats is longer.',
    watch: 'The pathway lights up exactly as in normal sinus rhythm. The pause between SA node firings is what changed.',
    causes: [
      'Athletic conditioning, sleep',
      'Vagal stimulation: vomiting, bearing down, carotid pressure',
      'Beta blockers, calcium channel blockers, digoxin',
      'Hypoxia (a late, ominous sign, especially in children)',
      'Inferior MI (the right coronary artery supplies the SA node in most people)',
      'Increased intracranial pressure (Cushing’s triad), hypothermia, hypothyroidism, hyperkalemia',
    ],
    significance:
      'Treat the patient, not the number. A fit runner at 48 can be normal. The same rate with hypotension, altered mental status, chest pain or signs of shock is unstable bradycardia. In children, bradycardia is hypoxia until proven otherwise.',
    tip: 'Everything is normal, just far apart.',
    expect: { vRate: [45, 51], pr: [0.12, 0.2], qrs: [0, 0.11], regular: true },
    next(b, s) {
      const rr = 1.25 + (s.rng() - 0.5) * 0.04;
      sinusBeat(b, s.t, 0.18, { rr });
      s.t += rr;
    },
  },
  {
    id: 'sinus-tach',
    name: 'Sinus tachycardia',
    short: 'Sinus tach',
    group: 'Sinus',
    summary: 'Normal pathway, but the SA node fires faster than 100 per minute, usually in response to a need.',
    criteria: {
      rate: '101–150/min typical in adults (shown: 125)',
      rhythm: 'Regular',
      p: 'Normal, one before every QRS; may sit close to the previous T wave',
      pr: '0.12–0.20 s, often at the short end',
      qrs: 'Narrow, under 0.12 s',
    },
    mechanism:
      'Sympathetic stimulation and circulating catecholamines make the SA node fire faster. Conduction is normal. As the rate climbs, the time between the T wave and the next P wave shrinks first, which cuts ventricular filling time.',
    watch: 'Same pathway as normal sinus rhythm with less rest between beats. The ventricles barely finish resetting before the next impulse arrives.',
    causes: [
      'Pain, anxiety, fever, exercise',
      'Hypovolemia and blood loss, sepsis',
      'Hypoxia, pulmonary embolism, anemia',
      'Stimulants: cocaine, amphetamines, caffeine, nicotine',
      'Alcohol or benzodiazepine withdrawal, hyperthyroidism',
    ],
    significance:
      'Sinus tachycardia is almost always compensation for something. Find and treat the cause instead of trying to slow the rate. In an adult, a rate above about 150 at rest should make you consider SVT or atrial flutter.',
    tip: 'Ask why the body needs the speed.',
    expect: { vRate: [121, 129], pr: [0.12, 0.2], qrs: [0, 0.11], regular: true },
    next(b, s) {
      const rr = 0.48 + (s.rng() - 0.5) * 0.02;
      sinusBeat(b, s.t, 0.13, { rr });
      s.t += rr;
    },
  },
  {
    id: 'sinus-arrhythmia',
    name: 'Sinus arrhythmia',
    short: 'Sinus arrhythmia',
    group: 'Sinus',
    summary: 'Every beat is a normal sinus beat, but the rate speeds up and slows down with breathing.',
    criteria: {
      rate: 'Usually 60–100/min, varies (shown: about 55–90)',
      rhythm: 'Irregular in a repeating, gradual pattern',
      p: 'Normal, one before every QRS, all the same shape',
      pr: '0.12–0.20 s, constant',
      qrs: 'Narrow, under 0.12 s',
    },
    mechanism:
      'Breathing changes vagal tone. Inhaling reduces vagal tone and the SA node speeds up; exhaling increases it and the SA node slows down. The pathway itself is normal.',
    watch: 'The SA node keeps firing normally but the spacing stretches and compresses in a slow wave, about one breath every 4–5 seconds.',
    causes: ['Normal in children, young adults and athletes', 'Can be exaggerated by digoxin or morphine'],
    significance: 'Benign. Recognize it so it is not mistaken for PACs or atrial fibrillation.',
    tip: 'Irregular, but every beat is a normal sinus beat. Watch the patient breathe while you watch the monitor.',
    expect: { vRate: [60, 85], pr: [0.12, 0.2], qrs: [0, 0.11], regular: false },
    next(b, s) {
      const rr = 0.86 + 0.2 * Math.sin((2 * Math.PI * s.t) / 4.6);
      sinusBeat(b, s.t, 0.16, { rr });
      s.t += rr;
    },
  },

  // --------------------------------------------- Atrial & supraventricular
  {
    id: 'pac',
    name: 'Premature atrial contractions',
    short: 'PACs',
    group: 'Atrial & supraventricular',
    summary: 'An irritable spot in the atria fires early. The early beat has an odd P wave but a normal, narrow QRS.',
    criteria: {
      rate: 'Underlying rhythm’s rate (shown: sinus at 75, every 5th beat early)',
      rhythm: 'Irregular where the early beat occurs',
      p: 'Early P wave with a different shape; can hide in the previous T wave',
      pr: 'Normal or slightly different on the early beat',
      qrs: 'Narrow, under 0.12 s',
    },
    mechanism:
      'An irritable atrial cell fires before the SA node is due. The impulse spreads across the atria by a different route (different P shape), then uses the normal AV node and His-Purkinje pathway (narrow QRS). The early impulse also resets the SA node, so the next sinus beat comes one normal cycle after the PAC. The pause is usually not fully compensatory.',
    watch: 'A violet ripple starts in the right atrial wall instead of the SA node. From the AV node down, the pathway is normal.',
    causes: [
      'Caffeine, nicotine, alcohol, stimulants',
      'Stress, fatigue',
      'Hypoxia, low potassium or magnesium',
      'Atrial stretch: heart failure, valve disease, COPD',
    ],
    significance:
      'Usually benign. Frequent PACs can trigger atrial fibrillation, atrial flutter or SVT, so note how often they occur.',
    tip: 'Early beat, odd P wave, narrow QRS.',
    expect: { vRate: [70, 90], qrs: [0, 0.11], regular: false },
    init(s) {
      s.lastP = 0;
    },
    next(b, s) {
      if (s.n % 5 === 4) {
        const t = s.lastP + 0.52;
        const avIn = ectopicAtria(b, t);
        const q = t + 0.15;
        avNode(b, avIn, q - 0.045, { kind: 'ectopic' });
        ventricles(b, q, { rr: 0.52, kind: 'ectopic' });
        interval(b, 'PR', t, q);
        s.lastP = t;
        s.t = t + 0.8;
      } else {
        sinusBeat(b, s.t, 0.16, { rr: 0.8 });
        s.lastP = s.t;
        s.t += 0.8;
      }
    },
  },
  {
    id: 'aflutter',
    name: 'Atrial flutter',
    short: 'A-flutter',
    group: 'Atrial & supraventricular',
    summary: 'One large reentry loop circles the right atrium about 300 times a minute, drawing sawtooth flutter waves.',
    criteria: {
      rate: 'Atrial 250–350/min; ventricular depends on the ratio (shown: 300 atrial, 4:1, 75 ventricular)',
      rhythm: 'Usually regular; irregular if the ratio varies',
      p: 'None. Sawtooth flutter (F) waves, best seen in II, III, aVF',
      pr: 'Not measurable',
      qrs: 'Narrow, under 0.12 s',
    },
    mechanism:
      'A single large reentry circuit loops around the tricuspid valve in the right atrium. Each lap depolarizes the atria and draws one flutter wave. The AV node cannot conduct 300 impulses a minute, so it lets only some through, commonly every 2nd, 3rd or 4th.',
    watch: 'A violet pulse circles the tricuspid ring continuously. Three of every four impulses fade inside the AV node; the fourth goes through.',
    causes: [
      'Coronary artery disease, heart failure, valve disease',
      'COPD, pulmonary embolism',
      'Hyperthyroidism, alcohol',
      'After cardiac surgery',
    ],
    significance:
      'With 2:1 conduction the ventricular rate is about 150 and flutter waves hide in the T waves. A regular, narrow rhythm at almost exactly 150 should make you think flutter. Like atrial fibrillation, it raises stroke risk.',
    tip: 'Sawtooth baseline. Count flutter waves per QRS to get the ratio.',
    show: ['flutterLoop'],
    loop: { seg: 'flutterLoop', period: 0.2 },
    baseline: (t) => flutterVector(t, 0.2, 0.35),
    noKick: true,
    expect: { vRate: [73, 77], aRate: [290, 310], qrs: [0, 0.11], regular: true },
    next(b, s) {
      const t0 = s.t;
      for (let k = 0; k < 4; k++) {
        const tf = t0 + k * 0.2;
        chamber(b, 'RA', tf, tf + 0.1, tf + 0.12, tf + 0.19);
        chamber(b, 'LA', tf + 0.03, tf + 0.12, tf + 0.14, tf + 0.2);
        if (k !== 1) label(b, tf + 0.14, 'F', 'ectopic'); // the 2nd F wave sits inside the QRS
        b.p.push(tf);
        if (k === 0) {
          const q = tf + 0.27;
          avNode(b, tf + 0.06, q - 0.045, { caption: 'One flutter impulse gets through the AV node.', kind: 'ectopic' });
          ventricles(b, q, { rr: 0.8, kind: 'ectopic' });
        } else {
          avNode(b, tf + 0.06, tf + 0.19, { block: FILTER, kind: 'ectopic' });
        }
      }
      caption(b, t0 + 0.4, 'The AV node filters the flutter impulses: only one in four reaches the ventricles.');
      s.t = t0 + 0.8;
    },
  },
  {
    id: 'afib',
    name: 'Atrial fibrillation',
    short: 'A-fib',
    group: 'Atrial & supraventricular',
    summary: 'Chaotic electrical activity across the atria. No P waves, and the QRS complexes come at random.',
    criteria: {
      rate: 'Atrial 350–600+/min (not countable); ventricular varies (shown: about 85). Over 100 is rapid ventricular response (RVR).',
      rhythm: 'Irregularly irregular',
      p: 'None. Wavy fibrillatory baseline',
      pr: 'None',
      qrs: 'Narrow, under 0.12 s',
    },
    mechanism:
      'Many small wavelets fire across the atria at once, so the atria quiver instead of contracting. The AV node is bombarded with impulses and lets them through at random intervals, which makes the R-to-R spacing irregularly irregular.',
    watch: 'Sparks flicker across both atria with no pattern. Most impulses fade in the AV node; the ones that get through arrive at random times.',
    causes: [
      'Hypertension, coronary artery disease, heart failure',
      'Valve disease (especially mitral), increasing age',
      'Alcohol (“holiday heart”), hyperthyroidism',
      'Sepsis, pulmonary embolism, COPD, obesity and sleep apnea',
      'After cardiac or thoracic surgery',
    ],
    significance:
      'Loss of the atrial “kick” reduces cardiac output (the kick supplies roughly 20–30% of ventricular filling). Blood pools in the quivering atria and can clot, raising stroke risk. Watch for RVR, and ask about blood thinners, which matter in trauma and bleeding.',
    tip: 'Irregularly irregular with no P waves is atrial fibrillation until proven otherwise.',
    ambient: { chaos: 'atria' },
    baseline: fibVector,
    noKick: true,
    seed: 23,
    expect: { vRate: [75, 100], qrs: [0, 0.11], regular: false },
    next(b, s) {
      const rr = 0.42 + s.rng() * 0.55;
      const q = s.t;
      avNode(b, q - 0.13, q - 0.045, { caption: 'One of the chaotic impulses happens to get through the AV node.', kind: 'ectopic' });
      ventricles(b, q, { rr, kind: 'ectopic' });
      const filtered = 1 + Math.floor(s.rng() * 3);
      for (let k = 0; k < filtered; k++) {
        const tf = q + 0.12 + s.rng() * Math.max(rr - 0.3, 0.05);
        avNode(b, tf, tf + 0.08, { block: FILTER, kind: 'ectopic' });
      }
      s.t += rr;
    },
  },
  {
    id: 'svt',
    name: 'Supraventricular tachycardia (AVNRT)',
    short: 'SVT',
    group: 'Atrial & supraventricular',
    summary: 'A tiny reentry loop in the AV node drives the heart at 150–250 per minute. Regular, narrow and fast.',
    criteria: {
      rate: '150–250/min (shown: 180)',
      rhythm: 'Regular',
      p: 'Usually not visible; buried in the QRS or just after it',
      pr: 'Not measurable',
      qrs: 'Narrow, under 0.12 s',
    },
    mechanism:
      'The AV node region has two pathways, one fast and one slow. A well-timed early beat can travel down one and back up the other, creating a small loop that keeps circling. Each lap sends an impulse down to the ventricles and back up to the atria at nearly the same moment, so the P wave hides inside the QRS. It starts and stops abruptly.',
    watch: 'A violet pulse circles a small loop at the AV node. Each lap fires the ventricles and, at the same moment, travels backward into the atria.',
    causes: [
      'Often no structural heart disease',
      'Triggers: caffeine, stimulants, stress, fatigue, alcohol, dehydration',
      'Accessory pathways (WPW) cause a related loop called AVRT',
    ],
    significance:
      'The fast rate shortens filling time, causing palpitations, lightheadedness, chest pain or hypotension. Vagal maneuvers and adenosine work by briefly blocking the AV node, which breaks the loop.',
    tip: 'Regular, narrow, too fast to see P waves, and does not drift up and down the way sinus tachycardia does.',
    show: ['avnrtLoop'],
    loop: { seg: 'avnrtLoop', period: 1 / 3 },
    noKick: true,
    expect: { vRate: [176, 184], qrs: [0, 0.11], regular: true },
    next(b, s) {
      const q = s.t;
      const rr = 1 / 3;
      ventricles(b, q, {
        rr,
        kind: 'ectopic',
        tAmp: 0.24,
        qrsCaption: 'The loop in the AV node fires the ventricles down the normal pathway.',
      });
      for (const seg of ['intAnt', 'intMid', 'intPost']) act(b, seg, q - 0.03, q + 0.02, { rev: true, kind: 'ectopic' });
      chamber(b, 'RA', q - 0.02, q + 0.06, q + 0.16, q + 0.26);
      chamber(b, 'LA', q, q + 0.08, q + 0.18, q + 0.28);
      addComps(b, [comp(q + 0.075, 0.06, 0.012, 0.012, DIR.pRetro)]);
      caption(b, q + 0.02, 'The same lap travels back up into the atria. The P wave is buried in the QRS.');
      s.t += rr;
    },
  },

  // ------------------------------------------------------------ Junctional
  {
    id: 'junctional',
    name: 'Junctional rhythm',
    short: 'Junctional',
    group: 'Junctional',
    summary: 'The SA node has failed or slowed, so the AV junction takes over as backup pacemaker at 40–60 per minute.',
    criteria: {
      rate: '40–60/min (shown: 50). Accelerated junctional 60–100; junctional tachycardia over 100',
      rhythm: 'Regular',
      p: 'Inverted in II: just before the QRS, hidden in it, or just after it',
      pr: 'Under 0.12 s when the P comes first',
      qrs: 'Narrow, under 0.12 s',
    },
    mechanism:
      'Every part of the pathway can pace the heart, but slower the lower you go. When the SA node stops or slows below about 60, the AV junction fires at its own built-in rate of 40–60. The impulse travels down the normal pathway (narrow QRS) and backward up into the atria, so the P wave points the wrong way in lead II.',
    watch: 'The SA node stays dark. A violet ripple starts at the AV junction and spreads both down and backward up into the atria.',
    causes: [
      'SA node disease (sick sinus syndrome)',
      'Inferior MI',
      'Digoxin toxicity, beta blockers, calcium channel blockers',
      'High vagal tone, hypoxia, after cardiac surgery',
    ],
    significance:
      'A rate of 40–60 may not maintain perfusion, and the atria may contract at the wrong moment, losing the atrial kick. Assess for signs of poor perfusion.',
    tip: 'Narrow QRS, inverted or missing P wave, rate 40–60.',
    noKick: true,
    expect: { vRate: [48, 52], pr: [0.06, 0.119], qrs: [0, 0.11], regular: true },
    next(b, s) {
      const t = s.t;
      junctionalFire(b, t);
      const q = t + 0.1;
      ventricles(b, q, { rr: 1.2, kind: 'ectopic' });
      interval(b, 'PR', t, q);
      s.t += 1.2;
    },
  },

  // ------------------------------------------------------------- AV blocks
  {
    id: 'avb1',
    name: 'First-degree AV block',
    short: '1° AV block',
    group: 'AV blocks',
    summary: 'Every impulse gets through the AV node, but each one is held too long. A delay, not a true block.',
    criteria: {
      rate: 'Underlying rate, usually 60–100 (shown: 70)',
      rhythm: 'Regular',
      p: 'Normal, one before every QRS',
      pr: 'Longer than 0.20 s, constant (shown: 0.28 s)',
      qrs: 'Usually narrow',
    },
    mechanism:
      'Conduction through the AV node is slowed. Each impulse still arrives at the ventricles, just later than normal, so the PR interval is long but the same every beat.',
    watch: 'The impulse lingers in the AV node noticeably longer than in normal sinus rhythm, every single beat.',
    causes: [
      'High vagal tone, athletes',
      'Beta blockers, calcium channel blockers, digoxin, amiodarone',
      'Inferior MI, hyperkalemia',
      'Lyme disease, age-related conduction disease',
    ],
    significance: 'Usually benign by itself. Note it and watch for progression, especially with MI or new medications.',
    tip: '“If the R is far from P, then you have a first degree.”',
    expect: { vRate: [68, 72], pr: [0.21, 0.3], qrs: [0, 0.11], regular: true },
    next(b, s) {
      const rr = 0.857;
      sinusBeat(b, s.t, 0.28, {
        rr,
        avCaption: 'The AV node holds the impulse longer than normal: PR over 0.20 s.',
      });
      s.t += rr;
    },
  },
  {
    id: 'avb2-1',
    name: 'Second-degree AV block, type I (Wenckebach)',
    short: '2° type I',
    group: 'AV blocks',
    summary: 'The PR interval gets longer with each beat until one P wave is not conducted. Then the cycle repeats.',
    criteria: {
      rate: 'Atrial normal (shown: 80); ventricular slightly slower',
      rhythm: 'Irregular in a repeating pattern (grouped beating)',
      p: 'Normal and regular; some not followed by a QRS',
      pr: 'Lengthens each beat until a QRS is dropped, then resets (shown: 0.18 → 0.28 → 0.34 → dropped)',
      qrs: 'Usually narrow',
    },
    mechanism:
      'The AV node tires with each impulse and takes longer to recover. Each PR gets longer until one impulse arrives while the node is still refractory and is blocked. The pause lets the node recover, and the pattern starts over. The block is usually in the AV node itself.',
    watch: 'Watch the AV node: the impulse is held a little longer every beat, then one dies there (red ×) and the cycle restarts.',
    causes: [
      'Inferior MI',
      'High vagal tone (athletes, sleep)',
      'Beta blockers, calcium channel blockers, digoxin',
      'Myocarditis, after cardiac surgery',
    ],
    significance: 'Usually transient and stable, and it rarely progresses. Assess perfusion like any bradycardia.',
    tip: '“Longer, longer, longer, drop. Then you have a Wenckebach.”',
    expect: { vRate: [58, 64], aRate: [78, 82], pr: [0.17, 0.35], qrs: [0, 0.11], regular: false },
    next(b, s) {
      const k = s.n % 4;
      const PRS = [0.18, 0.28, 0.34];
      if (k < 3) {
        sinusBeat(b, s.t, PRS[k], {
          rr: 0.8,
          avCaption: ['The AV node conducts, PR 0.18 s.', 'The AV node is slower to recover: PR lengthens.', 'Slower still: PR lengthens again.'][k],
        });
      } else {
        const avIn = sinusAtria(b, s.t, { pKind: 'blocked' });
        avNode(b, avIn, avIn + 0.2, {
          block: { at: 0.8, kind: 'block' },
          blockCaption: 'The AV node is still refractory. This impulse is blocked: dropped QRS.',
        });
      }
      s.t += 0.75;
    },
  },
  {
    id: 'avb2-2',
    name: 'Second-degree AV block, type II (Mobitz II)',
    short: '2° type II',
    group: 'AV blocks',
    summary: 'Conducted beats have the same PR, then a P wave suddenly fails to conduct. The block is below the AV node.',
    criteria: {
      rate: 'Atrial normal (shown: 80); ventricular slower',
      rhythm: 'Irregular when the ratio varies; regular with a fixed ratio',
      p: 'Normal and regular; some not followed by a QRS',
      pr: 'Constant on conducted beats (shown: 0.18 s)',
      qrs: 'Often wide, because the disease is in the bundles (shown: 0.12 s)',
    },
    mechanism:
      'The AV node works normally. The block is lower, in the bundle of His or both bundle branches. Conduction there is all-or-nothing: beats either pass with the same PR or are blocked without warning.',
    watch: 'The AV node passes every impulse on time. One impulse then dies in the His bundle (red ×) with no warning.',
    causes: [
      'Anterior MI (septal damage)',
      'Degenerative conduction system disease',
      'Cardiomyopathy, myocarditis',
      'After cardiac surgery',
    ],
    significance:
      'Unstable and unpredictable. It can progress suddenly to third-degree block. Atropine acts on the SA and AV nodes, so it often does little for a block below the node; be ready to pace.',
    tip: '“If some P’s don’t get through, then you have Mobitz II.” Constant PR, then a sudden drop.',
    expect: { vRate: [58, 62], aRate: [78, 82], pr: [0.17, 0.19], qrs: [0.115, 0.13], regular: false },
    next(b, s) {
      const k = s.n % 4;
      if (k < 3) {
        sinusBeat(b, s.t, 0.18, { rr: 0.75, shape: 'slurred' });
      } else {
        const avIn = sinusAtria(b, s.t, { pKind: 'blocked' });
        const q = s.t + 0.18;
        avNode(b, avIn, q - 0.045);
        ventricles(b, q, {
          hisBlock: { at: 0.45, kind: 'block' },
          blockCaption: 'The AV node passed it on time, but the impulse is blocked in the His bundle: dropped QRS.',
        });
      }
      s.t += 0.75;
    },
  },
  {
    id: 'avb3',
    name: 'Third-degree (complete) AV block',
    short: '3° AV block',
    group: 'AV blocks',
    summary: 'No impulses cross from atria to ventricles. Atria and ventricles each beat at their own rate.',
    criteria: {
      rate: 'Atrial 60–100 (shown: 83). Ventricular 40–60 junctional escape or 20–40 ventricular escape (shown: 37)',
      rhythm: 'P-P regular and R-R regular, but unrelated to each other',
      p: 'Normal; they march through the QRS complexes and T waves',
      pr: 'No true PR; the P-to-QRS distance varies at random',
      qrs: 'Wide with a ventricular escape (shown); narrow with a junctional escape',
    },
    mechanism:
      'The SA node keeps pacing the atria, but every impulse is blocked. With nothing arriving from above, a backup pacemaker below the block fires the ventricles at its own slow rate. The two run independently: AV dissociation.',
    watch: 'Every SA impulse dies at the AV node (red ×). Separately, a violet ripple in the ventricles fires them on its own slow schedule.',
    causes: [
      'MI: inferior (often at the AV node, narrow escape, may be temporary) or anterior (below the node, wide escape)',
      'Degenerative conduction disease',
      'Digoxin, beta blocker or calcium channel blocker toxicity; hyperkalemia',
      'Lyme carditis, congenital',
    ],
    significance:
      'Often symptomatic and unstable. A wide ventricular escape is slow and unreliable. Expect to pace.',
    tip: '“If P’s and Q’s don’t agree, then you have a third degree.” Map the P waves with calipers: they keep a steady beat straight through everything.',
    noKick: true,
    init(s) {
      s.ta = 0.35;
      s.tv = 0.9;
    },
    expect: { vRate: [35, 39], aRate: [81, 85], qrs: [0.14, 0.18], regular: true },
    next(b, s) {
      if (s.ta <= s.tv) {
        const avIn = sinusAtria(b, s.ta, { pKind: 'blocked', caption: 'SA node fires on schedule and the atria depolarize.' });
        avNode(b, avIn, avIn + 0.15, { block: BLOCK, blockCaption: 'Complete block: the impulse never reaches the ventricles.' });
        s.ta += 0.72;
      } else {
        ventricularFocus(b, s.tv, {
          at: 'escape',
          first: 'LV',
          rr: 1.62,
          amp: 1.1,
          caption: 'A backup pacemaker in the ventricles fires on its own slow schedule: wide escape beat.',
        });
        s.tv += 1.62;
      }
      s.t = Math.min(s.ta, s.tv);
    },
  },

  // ----------------------------------------------------------- Ventricular
  {
    id: 'pvc',
    name: 'Premature ventricular contractions',
    short: 'PVCs',
    group: 'Ventricular',
    summary: 'An irritable spot in a ventricle fires early. Wide, bizarre QRS with no P wave, followed by a pause.',
    criteria: {
      rate: 'Underlying rhythm’s rate (shown: sinus at 75, every 4th beat a PVC)',
      rhythm: 'Irregular where the early beat occurs',
      p: 'None before the PVC; the sinus P is usually hidden in it',
      pr: 'None on the PVC',
      qrs: 'Wide (0.12 s or more), bizarre; T wave points the opposite way',
    },
    mechanism:
      'A ventricular cell fires before the next sinus beat is due. It starts outside the His-Purkinje highway, so the impulse crawls cell to cell and the QRS is wide. The SA node is not reset. Its next impulse arrives while the ventricles are still refractory and is blocked, so the next normal beat lands exactly two cycles after the last one: a full compensatory pause.',
    watch: 'A violet ripple starts in the right ventricle wall and spreads slowly. The next SA impulse fades because the ventricles are still busy.',
    causes: [
      'Hypoxia, ischemia or MI',
      'Low potassium or magnesium, acidosis',
      'Stimulants: caffeine, cocaine, amphetamines',
      'Heart failure, digoxin toxicity, stress',
    ],
    significance:
      'Isolated PVCs are common. Concern rises when they are frequent, come in pairs (couplets) or runs (3 or more in a row is VT), come from several foci (multiform), or land on the T wave (R-on-T), especially with chest pain or hypoxia.',
    tip: 'Wide, early, no P wave, then a pause.',
    init(s) {
      s.tp = 0.35;
      s.lastQ = 0;
    },
    expect: { vRate: [72, 78], qrs: [0, 0.17], regular: false },
    next(b, s) {
      if (s.n % 4 === 3) {
        const tv = s.lastQ + 0.48;
        ventricularFocus(b, tv, { at: 'pvc', first: 'RV', rr: 0.8, label: 'PVC' });
        const avIn = sinusAtria(b, s.tp, {
          pKind: 'hidden',
          caption: 'The SA node fires on schedule, but its P wave is hidden in the PVC.',
        });
        avNode(b, avIn, avIn + 0.1, { block: FILTER });
        s.tp += 0.8;
      } else {
        s.lastQ = sinusBeat(b, s.tp, 0.16, { rr: 0.8 });
        s.tp += 0.8;
      }
      s.t = s.tp;
    },
  },
  {
    id: 'ivr',
    name: 'Idioventricular rhythm',
    short: 'Idioventricular',
    group: 'Ventricular',
    summary: 'Higher pacemakers have failed. The ventricles pace themselves at 20–40 per minute with wide complexes.',
    criteria: {
      rate: '20–40/min (shown: 35). Accelerated idioventricular 40–100',
      rhythm: 'Usually regular',
      p: 'None',
      pr: 'None',
      qrs: 'Wide, 0.12 s or more',
    },
    mechanism:
      'Both the SA node and the AV junction have failed. The ventricles fall back on their own built-in rate of 20–40 and the impulse spreads muscle to muscle, so the QRS is wide.',
    watch: 'Nothing fires above the ventricles. A violet ripple near the apex starts each slow beat.',
    causes: [
      'Severe hypoxia, massive MI',
      'The dying heart (often seen late in arrest)',
      'Hyperkalemia, drug overdose',
      'Accelerated form: common after reperfusion (clot-busting drugs or cath lab)',
    ],
    significance:
      'A last-resort escape rhythm that often does not perfuse well. Never suppress it with an antiarrhythmic: it may be the only thing keeping the heart beating.',
    tip: 'Slow, wide, no P waves.',
    expect: { vRate: [33, 37], qrs: [0.14, 0.18], regular: true },
    next(b, s) {
      ventricularFocus(b, s.t, {
        at: 'ivr',
        first: 'LV',
        rr: 1.7,
        amp: 0.95,
        caption: 'With no higher pacemaker, a ventricular cell fires at the ventricles’ own slow rate.',
      });
      s.t += 1.7;
    },
  },
  {
    id: 'vt',
    name: 'Ventricular tachycardia (monomorphic)',
    short: 'V-tach',
    group: 'Ventricular',
    summary: 'A fast circuit in the ventricle fires wide, identical complexes. The atria may beat separately.',
    criteria: {
      rate: 'Over 100, usually 150–250/min (shown: 170)',
      rhythm: 'Regular',
      p: 'Usually not seen; if seen, unrelated to the QRS (AV dissociation)',
      pr: 'None',
      qrs: 'Wide (0.12 s or more), all the same shape',
    },
    mechanism:
      'A reentry circuit, usually around scar tissue from an old MI, or a single irritable focus fires rapidly inside the ventricle. Each impulse spreads muscle to muscle, so every QRS is wide. The SA node may keep pacing the atria on its own schedule.',
    watch: 'A violet pulse circles the dark scar near the left ventricle apex. Each lap fires the ventricles. The SA node keeps firing, but its impulses fade in the AV node.',
    causes: [
      'Ischemia, acute MI, old MI scar',
      'Cardiomyopathy, heart failure',
      'Low potassium or magnesium',
      'Drug toxicity, stimulants, long QT',
    ],
    significance:
      'Can occur with or without a pulse. Pulseless VT is cardiac arrest and is treated like VF. With a pulse, whether the patient is stable or unstable decides the treatment. Treat any wide-complex tachycardia as VT until proven otherwise.',
    tip: 'Wide and fast is VT until proven otherwise.',
    show: ['vtLoop', 'scar'],
    loop: { seg: 'vtLoop', period: 60 / 170 },
    init(s) {
      s.tp = 0.5;
    },
    expect: { vRate: [168, 172], qrs: [0.14, 0.18], regular: true },
    next(b, s) {
      const rr = 60 / 170;
      const q = s.t;
      ventricularFocus(b, q, {
        at: 'vt',
        first: 'LV',
        rr,
        amp: 1.35,
        caption: s.n % 3 === 0 ? 'Each lap of the circuit exits and fires the ventricles through muscle: wide QRS.' : false,
      });
      while (s.tp < q + rr) {
        const avIn = sinusAtria(b, s.tp, { pKind: 'hidden', caption: 'The SA node still fires, independent of the ventricles (AV dissociation).' });
        avNode(b, avIn, avIn + 0.1, { block: FILTER });
        s.tp += 0.8;
      }
      s.t += rr;
    },
  },
  {
    id: 'torsades',
    name: 'Torsades de pointes',
    short: 'Torsades',
    group: 'Ventricular',
    summary: 'Polymorphic VT tied to a long QT. The complexes twist around the baseline, growing and shrinking.',
    criteria: {
      rate: '200–250/min (shown: about 230)',
      rhythm: 'Irregular',
      p: 'None',
      pr: 'None',
      qrs: 'Wide, changing size and direction in a twisting, spindle pattern',
    },
    mechanism:
      'When ventricular repolarization is delayed (long QT), a cell can fire again before it has fully reset. That early beat lands on the T wave and starts a rapidly shifting circuit whose path rotates around the ventricles, so the QRS axis twists.',
    watch: 'The circuit around the ventricles keeps turning. As its direction rotates, the strip twists above and below the baseline.',
    causes: [
      'Long QT: congenital or acquired',
      'Low magnesium, low potassium',
      'QT-prolonging drugs: some antiarrhythmics (sotalol, amiodarone), haloperidol, methadone, ondansetron, macrolide and fluoroquinolone antibiotics',
      'Bradycardia, alcohol use disorder, malnutrition',
    ],
    significance:
      'Often degenerates into VF. Magnesium is used because it suppresses the early afterdepolarizations that trigger it. Pulseless torsades is treated as cardiac arrest.',
    tip: 'A twisting ribbon. Think long QT and low magnesium.',
    show: ['twistLoop'],
    loop: { seg: 'twistLoop', period: 0.26, twist: 2.6 },
    ambient: { chaos: 'ventricles', chaosRate: 40 },
    ambientCaption: 'A rapidly shifting circuit rotates around the ventricles. No P waves; the ventricles cannot fill.',
    seed: 5,
    expect: { vRate: [215, 245], regular: false },
    next(b, s) {
      const q = s.t;
      const rr = 0.26 + (s.rng() - 0.5) * 0.09;
      // The wavefront's direction rotates, so each lead sees the complexes grow,
      // shrink through zero and flip: the "twisting of the points".
      const ph = (2 * Math.PI * q) / 2.6;
      const v = norm(Math.cos(ph), Math.sin(ph), 0.3 * Math.sin(ph / 2));
      addComps(b, [comp(q + 0.065, 1.05, 0.042, 0.045, v), comp(q + 0.175, 0.55, 0.045, 0.045, neg(v))], true);
      b.wide = true;
      chamber(b, 'LV', q, q + 0.1, q + 0.12, q + 0.24);
      chamber(b, 'RV', q + 0.02, q + 0.12, q + 0.14, q + 0.25);
      b.qrs = q;
      s.t += rr;
    },
  },
  {
    id: 'vf',
    name: 'Ventricular fibrillation',
    short: 'V-fib',
    group: 'Cardiac arrest',
    pulseless: true,
    summary: 'Chaotic, disorganized electrical activity in the ventricles. No complexes, no pumping, no pulse.',
    criteria: {
      rate: 'None; not countable',
      rhythm: 'Chaotic',
      p: 'None',
      pr: 'None',
      qrs: 'None. Irregular waves, coarse (shown) or fine',
    },
    mechanism:
      'Thousands of disorganized impulses fire across the ventricles at once. There is no coordinated depolarization, so the ventricles quiver and pump no blood.',
    watch: 'Sparks fire everywhere in the ventricles with no pathway involved. Nothing organized is happening.',
    causes: [
      'Ischemia and MI (the most common cause of sudden cardiac death)',
      'Untreated VT',
      'Electrolyte imbalance, drug toxicity',
      'Electrocution, drowning, hypothermia, commotio cordis (a blow to the chest)',
    ],
    significance:
      'Cardiac arrest. Survival depends on high-quality CPR and early defibrillation. Coarse VF tends to become fine VF over time, which can look like asystole.',
    tip: 'Confirm the patient is pulseless. A loose lead or patient movement can mimic VF.',
    ambient: { chaos: 'ventricles', chaosRate: 160 },
    ambientCaption: 'Chaotic impulses fire across the ventricles. No organized depolarization, no cardiac output.',
    baseline: vfVector,
    expect: { vRate: [0, 0] },
    next(b, s) {
      s.t += 1;
    },
  },
  {
    id: 'asystole',
    name: 'Asystole',
    short: 'Asystole',
    group: 'Cardiac arrest',
    pulseless: true,
    summary: 'No electrical activity. A nearly flat line.',
    criteria: {
      rate: 'None',
      rhythm: 'None',
      p: 'None (P waves alone with no QRS is ventricular standstill)',
      pr: 'None',
      qrs: 'None',
    },
    mechanism:
      'The SA node, the AV junction and the ventricles have all stopped firing. There is no depolarization, so there is nothing to draw.',
    watch: 'Nothing fires anywhere.',
    causes: [
      'Prolonged cardiac arrest (the end stage of VF or PEA)',
      'Severe hypoxia, acidosis, hyperkalemia, hypothermia',
      'Drug overdose, massive MI',
      'Look for the reversible H’s and T’s',
    ],
    significance:
      'Cardiac arrest, not shockable. Before calling it asystole, confirm in a second lead, check that the leads are connected, and turn up the gain: fine VF can look flat.',
    tip: 'Flatline protocol: check leads, gain, and a second lead.',
    baseline: asystoleVector,
    noNoise: true,
    ambientCaption: 'No electrical activity anywhere in the heart.',
    expect: { vRate: [0, 0] },
    next(b, s) {
      s.t += 1;
    },
  },

  {
    id: 'pea',
    name: 'Pulseless electrical activity (PEA)',
    short: 'PEA',
    group: 'Cardiac arrest',
    pulseless: true,
    summary: 'The monitor shows an organized rhythm, but the heart produces no pulse. Electrical activity without effective pumping.',
    criteria: {
      rate: 'Any (shown: sinus at 110)',
      rhythm: 'Any organized rhythm other than VF, VT or asystole',
      p: 'May be present and normal',
      pr: 'May be normal',
      qrs: 'Narrow or wide (shown: narrow). Pulse: none',
    },
    mechanism:
      'The conduction system still fires in order, so the monitor looks organized. The problem is mechanical: either the heart muscle cannot contract (severe acidosis, hyperkalemia, massive MI, toxins) or the heart cannot fill or empty (hypovolemia, tension pneumothorax, cardiac tamponade, pulmonary embolism). Electricity without a pulse is cardiac arrest.',
    watch: 'The conduction system lights up on schedule and the strip looks almost normal, but the chambers do not squeeze and the pulse line stays flat.',
    causes: [
      'Hypovolemia, hypoxia, hydrogen ion (acidosis)',
      'Hypo- or hyperkalemia, hypothermia',
      'Tension pneumothorax, cardiac tamponade',
      'Toxins, thrombosis (pulmonary embolism or coronary)',
    ],
    significance:
      'Cardiac arrest, not shockable. Start CPR. Survival depends on finding and fixing the cause. A narrow, fast PEA suggests a mechanical cause (hypovolemia, tamponade, tension pneumothorax, PE); a slow, wide PEA suggests a metabolic or muscle cause (hyperkalemia, acidosis, massive MI, toxins).',
    tip: 'A rhythm that should have a pulse but does not is PEA. Treat the patient, not the monitor.',
    expect: { vRate: [108, 112], pr: [0.12, 0.2], qrs: [0, 0.11], regular: true },
    next(b, s) {
      const rr = 60 / 110;
      sinusBeat(b, s.t, 0.14, {
        rr,
        qrsCaption: 'The ventricles depolarize normally, but the muscle produces no pulse.',
      });
      s.t += rr;
    },
  },

  // ------------------------------------------ Bundle branch & pre-excitation
  {
    id: 'rbbb',
    name: 'Right bundle branch block',
    short: 'RBBB',
    group: 'Bundle branch & pre-excitation',
    lead: 'V1',
    summary: 'The right bundle is blocked, so the right ventricle is activated late. Shown in V1, where the pattern is clearest.',
    criteria: {
      rate: 'Underlying rate (shown: 75, sinus)',
      rhythm: 'Regular',
      p: 'Normal',
      pr: '0.12–0.20 s',
      qrs: '0.12 s or more; rSR′ (“rabbit ears”) in V1–V2, wide S wave in I and V6',
    },
    mechanism:
      'The left ventricle depolarizes normally through the left bundle. The impulse then spreads slowly, muscle to muscle, across the septum into the right ventricle. That late right-ventricle activation draws the second peak (R′) in V1 and widens the QRS.',
    watch: 'The impulse dies in the right bundle (red ×). The left side fires first; the right ventricle lights up late.',
    causes: [
      'Can be a normal variant',
      'Right heart strain: pulmonary embolism, cor pulmonale',
      'Coronary artery disease, MI',
      'Degenerative disease, congenital heart disease, after cardiac surgery',
    ],
    significance:
      'Often benign when old. A new RBBB with chest pain or shortness of breath should raise concern for PE or MI.',
    tip: 'Turn-signal rule: last deflection of the QRS in V1 points up, so the right “turn signal” is on.',
    expect: { vRate: [73, 77], pr: [0.12, 0.2], qrs: [0.12, 0.14], regular: true },
    next(b, s) {
      sinusBeat(b, s.t, 0.16, { rr: 0.8, shape: 'rbbb', rbbb: true });
      s.t += 0.8;
    },
  },
  {
    id: 'lbbb',
    name: 'Left bundle branch block',
    short: 'LBBB',
    group: 'Bundle branch & pre-excitation',
    lead: 'V1',
    summary: 'The left bundle is blocked, so the large left ventricle is activated late and slowly. Shown in V1.',
    criteria: {
      rate: 'Underlying rate (shown: 75, sinus)',
      rhythm: 'Regular',
      p: 'Normal',
      pr: '0.12–0.20 s',
      qrs: '0.12 s or more; deep, broad QS or rS in V1; broad notched R in I and V6',
    },
    mechanism:
      'The right ventricle and septum activate first, from the right side. The impulse then crawls across to the left ventricle through muscle. The left ventricle is large, so its slow activation dominates the QRS: a deep, wide negative complex in V1.',
    watch: 'The impulse dies in the left bundle (red ×). The right ventricle fires first; the left ventricle fills in slowly.',
    causes: [
      'Hypertension, coronary artery disease, MI',
      'Cardiomyopathy, aortic stenosis',
      'Degenerative conduction disease',
    ],
    significance:
      'Almost always a sign of underlying heart disease. LBBB also distorts the ST segments, which makes a heart attack hard to read on a 12-lead; physicians use the Sgarbossa criteria for this.',
    tip: 'Turn-signal rule: last deflection of the QRS in V1 points down, so the left “turn signal” is on.',
    expect: { vRate: [73, 77], pr: [0.12, 0.2], qrs: [0.14, 0.16], regular: true },
    next(b, s) {
      sinusBeat(b, s.t, 0.16, { rr: 0.8, shape: 'lbbb', lbbb: true });
      s.t += 0.8;
    },
  },
  {
    id: 'wpw',
    name: 'Wolff-Parkinson-White (pre-excitation)',
    short: 'WPW',
    group: 'Bundle branch & pre-excitation',
    summary: 'An extra pathway lets the impulse skip the AV node delay. Short PR, delta wave, wide QRS.',
    criteria: {
      rate: 'Underlying rate (shown: 75, sinus)',
      rhythm: 'Regular',
      p: 'Normal',
      pr: 'Short, under 0.12 s (shown: 0.10 s)',
      qrs: 'Wide (shown: 0.12 s) with a slurred upstroke: the delta wave',
    },
    mechanism:
      'An accessory pathway (bundle of Kent) connects atrium and ventricle directly, bypassing the AV node’s delay. Part of the ventricle is activated early, slowly, through muscle: that is the delta wave and the short PR. Then the normal impulse arrives through the AV node and finishes the job. The QRS is a fusion of the two.',
    watch: 'The impulse takes two routes. The accessory pathway on the left side reaches the ventricle first (violet ripple); the normal route through the AV node arrives a moment later.',
    causes: ['Congenital: the extra pathway is present from birth'],
    significance:
      'The extra pathway can form a reentry loop (AVRT, a type of SVT). If atrial fibrillation develops, the pathway can pass impulses to the ventricles extremely fast, which can become VF. AV-node blocking drugs (adenosine, calcium channel blockers, beta blockers, digoxin) can be dangerous in pre-excited atrial fibrillation because they push more impulses down the accessory pathway.',
    tip: 'Short PR, delta wave, wide QRS.',
    show: ['kent'],
    expect: { vRate: [73, 77], pr: [0.09, 0.11], qrs: [0.11, 0.13], regular: true },
    next(b, s) {
      const t = s.t;
      const avIn = sinusAtria(b, t);
      const q = t + 0.1;
      act(b, 'kent', t + 0.05, t + 0.095);
      ripple(b, 'kentV', q, q + 0.16, 'ectopic');
      caption(b, t + 0.05, 'The accessory pathway skips the AV node delay and reaches the ventricle early.');
      avNode(b, avIn, t + 0.115, { caption: false });
      act(b, 'his', t + 0.115, t + 0.14);
      act(b, 'rbb', t + 0.14, t + 0.17);
      act(b, 'lbb', t + 0.14, t + 0.155);
      act(b, 'laf', t + 0.155, t + 0.175);
      act(b, 'lpf', t + 0.155, t + 0.175);
      act(b, 'purkR', t + 0.165, t + 0.195);
      act(b, 'purkL', t + 0.16, t + 0.19);
      chamber(b, 'LV', q, q + 0.1, q + 0.2, q + 0.35);
      chamber(b, 'RV', q + 0.055, q + 0.12, q + 0.2, q + 0.35);
      caption(b, q, 'Delta wave: early, slow activation through muscle. The normal impulse then fuses in.');
      const qt = 0.36;
      addComps(b, SHAPES.wpw(q).comps, true);
      addComps(b, SHAPES.T(q, qt, 0.25));
      label(b, q + 0.02, 'δ', 'ectopic');
      label(b, q + 0.06, 'QRS', 'normal');
      label(b, q + qt - 0.095, 'T', 'normal');
      interval(b, 'PR', t, q);
      interval(b, 'QRS', q, q + 0.12);
      b.qrs = q;
      b.qrsWidth = 0.12;
      s.t += 0.8;
    },
  },

  // ----------------------------------------------------------------- Paced
  {
    id: 'paced',
    name: 'Ventricular paced rhythm',
    short: 'V-paced',
    group: 'Paced',
    summary: 'A pacemaker lead in the right ventricle fires each beat. A sharp spike, then a wide QRS.',
    criteria: {
      rate: 'Set by the device, often 60–70 (shown: 70)',
      rhythm: 'Regular',
      p: 'None or unrelated in this mode',
      pr: 'None',
      qrs: 'Pacer spike, then wide QRS (0.12 s or more); T wave points the opposite way',
    },
    mechanism:
      'The pacemaker sends a small electrical pulse down a lead to the right ventricle apex (the spike). The impulse starts at the apex and spreads muscle to muscle, not through the Purkinje network, so the QRS is wide and resembles LBBB.',
    watch: 'The pulse travels down the pacing lead from the upper chest, through the right atrium, to the right ventricle apex, then spreads outward.',
    causes: ['Implanted pacemaker for sick sinus syndrome, high-grade AV block, or slow atrial fibrillation'],
    significance:
      'Look for failure to capture (spike with no QRS), failure to sense (spikes landing where they should not), and failure to pace (no spike when one is needed). Ask for the device card.',
    tip: 'Spike, then wide QRS: ventricular paced.',
    show: ['pacer'],
    expect: { vRate: [69, 71], qrs: [0.14, 0.18], regular: true },
    next(b, s) {
      const q = s.t;
      ventricularFocus(b, q, {
        at: 'pacerTip',
        first: 'RV',
        rr: 60 / 70,
        shape: 'paced',
        amp: 1.1,
        tAmp: 0.35,
        caption: 'The pacemaker fires (spike). The impulse spreads from the RV apex through muscle: wide QRS.',
      });
      s.t += 60 / 70;
    },
  },

  // ------------------------------------------------------ Monitor artifacts
  {
    id: 'art-movement',
    name: 'Artifact: patient movement',
    short: 'Movement',
    group: 'Monitor artifacts',
    artifact: 'movement',
    summary: 'Large, irregular swings from the patient moving. In bursts it can look like VF or VT.',
    criteria: { rate: 'Underlying rhythm (shown: sinus at 80)', rhythm: 'Regular underneath the bursts', p: 'Visible between bursts', pr: '0.12–0.20 s', qrs: 'Normal complexes keep marching through the artifact on time' },
    mechanism: 'Nothing is wrong with the heart. Muscle activity and electrode motion add electrical signals the monitor cannot tell apart from the heart’s.',
    watch: 'The 3D heart keeps firing normal sinus beats the whole time. Only the strip changes.',
    causes: ['Seizure, agitation, shivering hard', 'CPR, moving the patient, rough road during transport', 'Swinging or tugged cables'],
    significance: 'Look at the patient before acting on the monitor: a talking patient with a pulse is not in VF. Never shock based on the monitor alone.',
    tip: 'Look for normal QRS complexes marching through the mess at the old rate.',
    expect: { vRate: [77, 83], pr: [0.12, 0.2], qrs: [0, 0.11], regular: true },
    next(b, s) {
      sinusBeat(b, s.t, 0.16, { rr: 0.75, quiet: true });
      s.t += 0.75;
    },
  },
  {
    id: 'art-tremor',
    name: 'Artifact: muscle tremor',
    short: 'Tremor',
    group: 'Monitor artifacts',
    artifact: 'tremor',
    summary: 'Fine, fast, irregular fuzz from shivering or tremor. It can look like A-fib.',
    criteria: { rate: 'Underlying rhythm (shown: sinus at 88)', rhythm: 'Regular', p: 'Hard to see under the fuzz', pr: '0.12–0.20 s where visible', qrs: 'Normal' },
    mechanism: 'Skeletal muscle is electrically active too. Shivering or tremor adds small, rapid, irregular signals to every lead that crosses the moving muscle.',
    watch: 'The heart is in normal sinus rhythm. The fuzz comes from the arms and chest muscles, not the heart.',
    causes: ['Cold or shivering', 'Anxiety, pain', 'Parkinson disease or other tremor', 'Patient tensing or holding the arms up'],
    significance: 'A regular R-R interval with a fuzzy baseline is sinus rhythm with tremor, not A-fib. Warm and reassure the patient, support the arms, and move limb electrodes onto the torso.',
    tip: 'A-fib is irregularly irregular. Tremor usually rides on a regular rhythm.',
    expect: { vRate: [85, 91], pr: [0.12, 0.2], qrs: [0, 0.11], regular: true },
    next(b, s) {
      sinusBeat(b, s.t, 0.16, { rr: 0.68, quiet: true });
      s.t += 0.68;
    },
  },
  {
    id: 'art-60',
    name: 'Artifact: 60-cycle interference',
    short: '60-cycle',
    group: 'Monitor artifacts',
    artifact: 'ac60',
    summary: 'A thick, evenly spaced buzz on the baseline from nearby electrical equipment.',
    criteria: { rate: 'Underlying rhythm (shown: sinus at 75)', rhythm: 'Regular', p: 'Blurred by the interference', pr: 'Hard to measure', qrs: 'Normal' },
    mechanism: 'Household and vehicle power alternates 60 times a second. Poor electrode contact or nearby equipment lets that current leak into the tracing as a regular, fine oscillation.',
    watch: 'The heart is in normal sinus rhythm. The interference is added outside the body.',
    causes: ['Dried gel or poor skin contact', 'Cables near power cords, electric beds or blankets', 'Ungrounded equipment, inverters'],
    significance: 'It hides P waves and small details, so fix the signal before interpreting. Replace electrodes, move cables away from power sources, and check the monitor filter setting.',
    tip: 'Uniform, evenly spaced fuzz is electrical. Irregular fuzz is muscle.',
    expect: { vRate: [72, 78], pr: [0.12, 0.2], qrs: [0, 0.11], regular: true },
    next(b, s) {
      sinusBeat(b, s.t, 0.16, { rr: 0.8, quiet: true });
      s.t += 0.8;
    },
  },
  {
    id: 'art-loose',
    name: 'Artifact: loose lead',
    short: 'Loose lead',
    group: 'Monitor artifacts',
    artifact: 'looseLL',
    summary: 'An electrode losing contact makes the tracing drop out. On one lead it can look like asystole or a long pause.',
    criteria: { rate: 'Underlying rhythm (shown: sinus at 75)', rhythm: 'Regular, with dropouts in the affected leads', p: 'Normal where the signal is present', pr: '0.12–0.20 s', qrs: 'Normal; missing during dropouts' },
    mechanism: 'Each lead is built from specific electrodes. When the left-leg electrode loses contact, every lead that uses it (II, III, aVF, and partly aVR, aVL and the chest leads) loses the heart’s signal. Lead I uses only the two arm electrodes, so it keeps showing the rhythm.',
    watch: 'The heart never stops. Switch the strip to lead I and the rhythm is still there.',
    causes: ['Sweat, hair, dried gel', 'Patient movement, cable tension', 'Electrode placed over bone or on broken skin'],
    significance: 'A flat line on the monitor: check the patient first, then the leads, gain, and a second lead. This is why the asystole approach teaches confirming in two leads.',
    tip: 'Flat in one lead but not another is a lead problem, not asystole.',
    expect: { vRate: [72, 78], pr: [0.12, 0.2], qrs: [0, 0.11], regular: true },
    next(b, s) {
      sinusBeat(b, s.t, 0.16, { rr: 0.8, quiet: true });
      s.t += 0.8;
    },
  },
];

export const byId = Object.fromEntries(RHYTHMS.map((r) => [r.id, r]));

// Structures shown in the 3D model, with the facts a student needs about each.
export const ANATOMY = [
  {
    id: 'sa',
    name: 'SA node',
    where: 'Upper right atrium, where the superior vena cava enters',
    does: 'Primary pacemaker. Starts every normal heartbeat.',
    rate: '60–100/min',
  },
  {
    id: 'internodal',
    name: 'Internodal pathways',
    where: 'Anterior, middle and posterior tracts across the right atrium',
    does: 'Carry the impulse from the SA node to the AV node. They are preferential routes through atrial muscle rather than insulated cables.',
    rate: 'Atrial cells: 60–80/min if they must pace',
  },
  {
    id: 'bachmann',
    name: 'Bachmann’s bundle',
    where: 'Runs from the right atrium across to the left atrium',
    does: 'Lets both atria depolarize almost together.',
    rate: '—',
  },
  {
    id: 'av',
    name: 'AV node',
    where: 'Floor of the right atrium, near the septum and tricuspid valve',
    does: 'Gatekeeper. Slows conduction so the atria can empty into the ventricles, and filters out very fast atrial impulses. Its delay is most of the PR interval.',
    rate: 'AV junction: 40–60/min',
  },
  {
    id: 'his',
    name: 'Bundle of His',
    where: 'From the AV node through the fibrous skeleton into the top of the septum',
    does: 'The only normal electrical connection between the atria and the ventricles.',
    rate: 'Junction: 40–60/min',
  },
  {
    id: 'rbb',
    name: 'Right bundle branch',
    where: 'Down the right side of the septum toward the right ventricle apex',
    does: 'Carries the impulse to the right ventricle.',
    rate: 'Ventricular: 20–40/min',
  },
  {
    id: 'lbb',
    name: 'Left bundle branch',
    where: 'Left side of the septum; divides almost immediately',
    does: 'Carries the impulse to the larger left ventricle through its fascicles.',
    rate: 'Ventricular: 20–40/min',
  },
  {
    id: 'laf',
    name: 'Left anterior fascicle',
    where: 'Front and upper wall of the left ventricle',
    does: 'Thin and easily damaged. Its block is the most common fascicular block.',
    rate: 'Ventricular: 20–40/min',
  },
  {
    id: 'lpf',
    name: 'Left posterior fascicle',
    where: 'Back and lower wall of the left ventricle',
    does: 'Thick, with a double blood supply, so it is rarely blocked on its own.',
    rate: 'Ventricular: 20–40/min',
  },
  {
    id: 'purk',
    name: 'Purkinje fibers',
    where: 'Network under the inner lining of both ventricles',
    does: 'Fastest conduction in the heart (about 1.5–4 m/s). Fires both ventricles within about 0.08 s, which keeps the QRS narrow.',
    rate: 'Ventricular: 20–40/min',
  },
];

// Conduction speeds (Guyton & Hall): why the ECG intervals are the length they are.
export const SPEEDS = [
  ['Atrial muscle', 'about 0.3 m/s (about 1 m/s along the preferred routes)'],
  ['AV node', 'about 0.02–0.05 m/s (the slowest)'],
  ['His-Purkinje system', 'about 1.5–4 m/s (the fastest)'],
  ['Ventricular muscle', 'about 0.3–0.5 m/s'],
];
