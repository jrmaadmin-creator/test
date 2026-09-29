# ADR 0003: Generate every lead from one 3D cardiac vector

- Status: Accepted
- Date: 2026-09-29
- Supersedes: the per-lead hand-drawn shapes in ADR 0002's first version

## Context

The app needs a 12-lead view, a selectable monitor lead, and an explanation of how the 12-lead "decides" what each rhythm looks like. Hand-drawing each rhythm in each of 12 leads would be 300+ shapes that could contradict each other and teach nothing about why leads differ.

## Decision

Each wave component is an electrical vector: a direction in the heart's 3D frame (x = patient's left, y = up, z = anterior) and a size that rises and falls over time. A lead's voltage is the dot product of that vector with the lead's axis (limb leads on the hexaxial wheel, chest leads in the horizontal plane, chest gain 1.2). Vector directions follow anatomy: septum left-to-right, main left ventricle left-inferior, late basal forces superior-posterior; ventricular foci spread away from their origin; bundle branch blocks add a late vector toward the late-activating ventricle.

`npm run check` verifies the physics and the textbook patterns: Einthoven's law (II = I + III) to machine precision, normal axis and R-wave progression for sinus, rsR' in V1 for RBBB with a normal axis, QS in V1 for LBBB, inferior-axis LBBB-morphology RVOT PVCs, northwest-axis VT, superior-axis RV pacing, left-lateral WPW delta polarity, retrograde junctional P waves, and flutter polarity (inverted in II, upright in V1).

## Consequences

- All 12 leads, the monitor lead, the frontal and horizontal axis diagrams and the 3D vector arrow come from the same numbers, so they cannot disagree.
- The model has no proximity effect, no ST-segment physiology and no infarct patterns. STEMI teaching would need an injury-current component per wall.
- Amplitudes are approximate. The check enforces signs, axes and patterns, not millivolt accuracy.
