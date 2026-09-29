# Why the game works the way it does

## The core loop

1. Dispatch sends you to a call. The condition is the monster (Arterial Hemorrhage, Opioid Overdose, and so on).
2. You pick interventions from a shuffled list. The correct next move damages the monster. A harmful move costs the patient a heart. A right move at the wrong time costs time and gets a "wrong time" explanation.
3. Every choice, right or wrong, shows the reason in one or two sentences.
4. The debrief lists the priority sequence, the numbers to know, what cost you, and the NH protocol sections behind the call.
5. Each license level ends with a boss call, then a protocol trial (multiple choice) that advances your license.

## Why these choices

| Design choice | Reason | Evidence |
|---|---|---|
| Choose-the-next-action instead of reading | Recalling an answer builds memory better than rereading it | Retrieval practice ("testing effect"): Roediger & Karpicke, 2006, *Psychological Science* |
| Explanation after every choice | Feedback that says why is among the strongest drivers of learning | Hattie & Timperley, 2007, *Review of Educational Research* |
| Shuffled options, replay for 3 stars | Repeated practice spread over time beats one long session | Spacing effect: Cepeda et al., 2006, *Psychological Bulletin* |
| Game frame (levels, bosses, CEUs) | Gamification shows a small-to-medium positive effect on learning outcomes | Sailer & Homner, 2020, *Educational Psychology Review* (meta-analysis) |
| Over-the-top humor tied to the content | Humor that relates to the material helps attention and recall; unrelated or offensive humor does not | Banas et al., 2011, *Communication Education* (40-year review) |
| Priority groups, not one rigid order | Real care has steps that can happen in any order; forcing one order teaches trivia | Design judgment |

## Humor rules

- Joke about situations, myths, equipment, and the monsters. Never about patients, substance use, or mental illness.
- Every call has one harmless joke option (costs time, no hearts). It rewards reading carefully.
- Myths get named and corrected in the same breath (ice down the pants, loosening tourniquets, "silent chest means better").

## Limits

- This does not train hands-on skill. The CPR tap game trains rate only, not depth or recoil. Pair it with a feedback manikin.
- Calls are single-provider decision sequences. Real calls run in parallel across a crew.
- Scope and doses follow NH PCP v9.3. Local medical direction and agency policy still apply.
- Progress is saved per device. There is no completion record for CE credit yet (see ADR-0001, revisit trigger 3).
