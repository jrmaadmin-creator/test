# Explanation: how the timing model maps to physiology

The ECG is the sum of electrical activity as the impulse moves through tissue. The app models that directly: it schedules when each part of the conduction system fires, then draws the waves that activity produces.

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

## Why wide means "not the normal highway"

The His-Purkinje system conducts at about 1.5–4 m/s; ventricular muscle at about 0.3–0.5 m/s. An impulse that starts in the ventricle, or is blocked in a bundle branch, travels muscle to muscle, so both ventricles take longer to depolarize: QRS 0.12 s or more. The generators encode this by giving ventricular-origin and bundle-branch beats longer chamber activation windows and wider wave components.

## Blocks

A block is an act that stops partway (`block.at`). Kind `block` is pathologic and shows a red ×. Kind `filter` is physiologic, such as the AV node refusing flutter or fibrillation impulses, or a sinus impulse arriving while the ventricles are still refractory after a PVC. Filtered impulses fade instead of flashing red, because the AV node doing its job is not a disease.

## Colors

Amber is an impulse that started in the SA node. Violet is any other origin (ectopic atrial, junctional, ventricular, pacemaker, accessory-pathway pre-excitation). Red is a pathologic block.
