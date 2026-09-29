# Explanation: how the model maps to physiology

The ECG is the sum of electrical activity as the impulse moves through tissue. The app models that directly: it schedules when each part of the conduction system fires, then derives every lead, the timeline and the pulse from that schedule.

## A normal beat, in seconds after the SA node fires

| Time | Event | Strip |
|------|-------|-------|
| 0.00 | SA node fires; atria begin depolarizing | P wave starts |
| 0.05 | Impulse reaches the AV node | P wave peaks |
| 0.05 to PR − 0.045 | AV node delay (slowest tissue, about 0.02–0.05 m/s) | PR segment (flat) |
| PR − 0.045 | His bundle | still flat |
| PR − 0.02 | Bundle branches | still flat |
| PR | Purkinje fibers and ventricular muscle | QRS starts |
| PR + 0.09 | Ventricles fully depolarized | QRS ends, ST segment |
| PR + QT | Ventricles repolarized | T wave ends |

QT shortens with rate (Bazett: QT = 0.40 × √RR), which is why the T wave crowds the next P wave in sinus tachycardia.

## How the 12 leads are made

Each wave is a vector: a direction in the chest and a size that grows and shrinks. A lead records the part of that vector pointing along its own axis. Toward the positive electrode draws up, away draws down, sideways draws little. That is the whole trick of the 12-lead: one heartbeat, twelve viewing angles.

- The normal QRS is three vectors in a row: the septum (left to right, forward), the big left ventricle (left and down), then the bases (up and back). That sequence gives the small q in I and V6, the small r in V1, and R waves that grow from V1 to V6.
- A beat that starts in a ventricle spreads away from its starting point, so its direction tells you where it came from: a right ventricular outflow PVC points down (tall in II, III, aVF); a VT circuit near the apex points up and right (the "northwest axis").
- Because the limb-lead axes are unit vectors at 0°, 60° and 120°, lead II always equals I + III (Einthoven's law). The check script proves it.

## Why wide means "not the normal highway"

The His-Purkinje system conducts at about 1.5–4 m/s; ventricular muscle at about 0.3–0.5 m/s. An impulse that starts in the ventricle, or is blocked in a bundle branch, travels muscle to muscle, so both ventricles take longer to depolarize: QRS 0.12 s or more.

## Blocks

A block is an act that stops partway (`block.at`). Kind `block` is pathologic and shows a red ×. Kind `filter` is physiologic, such as the AV node refusing flutter or fibrillation impulses, or a sinus impulse arriving while the ventricles are still refractory after a PVC. Filtered impulses fade instead of flashing red, because the AV node doing its job is not a disease.

## The timeline (ladder diagram)

Three tiers share the strip's time axis: A (atria), AV (AV node and His bundle), V (ventricles). A slanted line is an impulse crossing a tier; a longer slant is a slower crossing, so a first-degree block is a long slope and Wenckebach is slopes that lengthen until a bar. A dot marks a beat that started outside the SA node. Circles mark reentry loops. It is drawn from the same `acts` the 3D view animates.

## The pulse

Electricity is not blood flow. Each ventricular beat gets a stroke volume from how long the ventricles had to fill (the preceding R-R interval), whether the atria contracted first (atrial kick; lost in A-fib, flutter, junctional and dissociated rhythms), and whether the ventricles contracted together (ventricular-origin beats squeeze less efficiently). PEA, VF and asystole produce none. Beats at 35% or more of normal count as palpable, so a PVC or a short A-fib cycle can show on the monitor without a matching pulse: a pulse deficit.

## Colors

Amber is an impulse that started in the SA node. Violet is any other origin (ectopic atrial, junctional, ventricular, reentry loop, pacemaker, accessory-pathway pre-excitation). Red is a pathologic block.
