/* Legend of JRMA: scenes for hands-on simulations.
 *
 * Each scene is SVG art (viewBox 240 x 200) plus hotspot `zones`. A `place`
 * stage in content/calls.js names the zones that are right (`targets`) and
 * the tempting wrong ones (`decoys`). Zone `why` is the default feedback when
 * a player drops something on the wrong spot; a stage can override it.
 *
 * Coordinates: x 0-240 left to right, y 0-200 top to bottom. The patient's
 * right side is on the viewer's left (patient faces up or toward you).
 * Art inside an element with data-show="name" stays hidden until a stage
 * lists that name in `show`; data-hide="name" hides art when it is listed.
 */
window.JRMA = window.JRMA || {};

(() => {
  const SKIN = '#e2a77a', SKIN_LO = '#d99a6c', CREASE = '#c98f63', INK = '#000';
  const txt = (x, y, s, size = 8, fill = '#cfd6e0') => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" font-family="Silkscreen, monospace" fill="${fill}">${s}</text>`;
  let tiles = '';
  for (let y = 0; y < 200; y += 20) for (let x = 0; x < 240; x += 20) tiles += `<rect x="${x + 1}" y="${y + 1}" width="18" height="18" fill="${(x + y) % 40 ? '#d7dde3' : '#c9d0d8'}"/>`;
  let pink = '';
  for (let y = 0; y < 200; y += 14) for (let x = 0; x < 100; x += 14) pink += `<rect x="${x + 1}" y="${y + 1}" width="12" height="12" fill="${(x + y) % 28 ? '#f4c6d6' : '#efb6ca'}"/>`;
  let grid = '';
  for (let x = 0; x <= 240; x += 12) grid += `<line x1="${x}" y1="0" x2="${x}" y2="200" stroke="#fff" stroke-opacity=".04"/>`;
  const ribs = [44, 56, 68, 80, 92].map((y) => `<path d="M112 ${y} Q88 ${y + 6} 62 ${y + 22}" stroke="#c98f63" stroke-opacity=".5" fill="none"/><path d="M128 ${y} Q152 ${y + 6} 178 ${y + 22}" stroke="#c98f63" stroke-opacity=".5" fill="none"/>`).join('');

  window.JRMA.SCENES = {
    face: {
      label: 'The patient\'s face and neck, seen from the front.',
      tok: [206, 184],
      art: `
        <rect x="94" y="120" width="52" height="80" fill="${SKIN_LO}"/>
        <rect x="114" y="162" width="12" height="38" rx="5" fill="${CREASE}"/>
        <ellipse cx="66" cy="92" rx="9" ry="17" fill="${SKIN_LO}" stroke="${INK}"/>
        <ellipse cx="174" cy="92" rx="9" ry="17" fill="${SKIN_LO}" stroke="${INK}"/>
        <ellipse cx="120" cy="86" rx="52" ry="62" fill="${SKIN}" stroke="${INK}" stroke-width="2"/>
        <path d="M70 72 Q70 22 120 22 Q170 22 170 72 Q160 44 120 42 Q80 44 70 72 Z" fill="#5a3a22"/>
        <path data-hide="awake" d="M92 80 q8 5 16 0 M132 80 q8 5 16 0" stroke="${INK}" stroke-width="2" fill="none"/>
        <g data-show="awake"><ellipse cx="100" cy="80" rx="8" ry="4.5" fill="#fff" stroke="${INK}"/><ellipse cx="140" cy="80" rx="8" ry="4.5" fill="#fff" stroke="${INK}"/><circle cx="101" cy="80" r="2.6" fill="#3a2a1a"/><circle cx="139" cy="80" r="2.6" fill="#3a2a1a"/></g>
        <path d="M120 80 L112 104 Q120 111 128 104" stroke="#8a5a3a" stroke-width="2" fill="none"/>
        <ellipse cx="114" cy="107" rx="3.5" ry="2" fill="#4a2a1a"/>
        <ellipse cx="126" cy="107" rx="3.5" ry="2" fill="#4a2a1a"/>
        <path d="M104 126 Q120 120 136 126 Q120 134 104 126 Z" fill="#8a4a58" stroke="${INK}"/>
        <path d="M108 142 Q120 148 132 142" stroke="${CREASE}" stroke-width="2" fill="none"/>
        <g data-show="mask">
          <path d="M120 92 L98 134 Q120 146 142 134 Z" fill="#bfe3ff" fill-opacity=".45" stroke="#9fd3ff" stroke-width="2"/>
          <rect x="142" y="112" width="18" height="10" fill="#9fd3ff"/>
          <ellipse id="bvm-bag" cx="196" cy="117" rx="36" ry="17" fill="#2f6fb0" stroke="${INK}" stroke-width="2"/>
        </g>`,
      zones: {
        forehead: { x: 120, y: 50, r: 14, name: 'Forehead', why: 'That is the forehead.' },
        chin: { x: 120, y: 142, r: 8, name: 'Bony point of the chin', why: 'That is the bony chin.' },
        underChin: { x: 120, y: 156, r: 6, name: 'Soft tissue under the chin', why: 'That is soft tissue. Pressing there pushes the tongue back into the airway. Lift the bony part of the chin.' },
        trachea: { x: 120, y: 182, r: 7, name: 'Windpipe', why: 'That is the windpipe. Slide your fingers off it, into the groove beside it.' },
        carotidR: { x: 104, y: 180, r: 8, name: 'Groove beside the windpipe, patient\'s right', why: 'That is the carotid groove.' },
        carotidL: { x: 136, y: 180, r: 8, name: 'Groove beside the windpipe, patient\'s left', why: 'That is the carotid groove.' },
        nareR: { x: 114, y: 107, r: 5, name: 'Right nostril', why: 'That is a nostril.' },
        nareL: { x: 126, y: 107, r: 5, name: 'Left nostril', why: 'That is a nostril.' },
        noseTip: { x: 120, y: 97, r: 5, name: 'Tip of the nose', why: 'Tip of the nose to the earlobe is how you size an NPA, not an OPA.' },
        mouth: { x: 120, y: 127, r: 7, name: 'Middle of the mouth, on the tongue', why: 'A glob on the tongue can slide back and choke him.' },
        mouthCorner: { x: 104, y: 126, r: 5, name: 'Corner of the mouth', why: 'Corner of the mouth to the earlobe is how you size an OPA, not an NPA.' },
        cheek: { x: 95, y: 122, r: 7, name: 'Inside the cheek, beside the gum', why: 'That is the cheek.' },
        earlobeR: { x: 66, y: 106, r: 7, name: 'Right earlobe', why: 'That is the earlobe.' },
        earlobeL: { x: 174, y: 106, r: 7, name: 'Left earlobe', why: 'That is the earlobe.' },
        jawR: { x: 86, y: 126, r: 7, name: 'Angle of the jaw, right', why: 'That is the angle of the jaw.' },
        jawL: { x: 154, y: 126, r: 7, name: 'Angle of the jaw, left', why: 'That is the angle of the jaw.' },
      },
    },

    hand: {
      label: 'A fingertip, palm side up, close up.',
      tok: [206, 184],
      art: `
        <rect x="0" y="160" width="240" height="40" fill="#1b2233"/>
        <path d="M88 200 L88 60 Q88 22 120 22 Q152 22 152 60 L152 200 Z" fill="${SKIN}" stroke="${INK}" stroke-width="2"/>
        <circle cx="120" cy="68" r="6" fill="none" stroke="${CREASE}" stroke-opacity=".6"/>
        <circle cx="120" cy="68" r="11" fill="none" stroke="${CREASE}" stroke-opacity=".6"/>
        <circle cx="120" cy="68" r="16" fill="none" stroke="${CREASE}" stroke-opacity=".6"/>
        <path d="M92 118 Q120 124 148 118" stroke="${CREASE}" stroke-width="2" fill="none"/>
        <path d="M92 176 Q120 182 148 176" stroke="${CREASE}" stroke-width="2" fill="none"/>`,
      zones: {
        pad: { x: 120, y: 68, r: 12, name: 'Center of the fingertip pad', why: 'The center of the pad has the most nerve endings. Lance the side of the fingertip.' },
        tip: { x: 120, y: 30, r: 7, name: 'Very tip of the finger', why: 'The very tip hurts the most. Lance the side of the fingertip.' },
        sideR: { x: 94, y: 74, r: 7, name: 'Side of the fingertip (left edge)', why: 'That is the side of the fingertip.' },
        sideL: { x: 146, y: 74, r: 7, name: 'Side of the fingertip (right edge)', why: 'That is the side of the fingertip.' },
      },
    },

    legs: {
      label: 'Both legs from the front, patient lying on his back.',
      tok: [206, 184],
      art: `
        <path d="M44 0 H196 V32 Q120 42 44 32 Z" fill="#2c3f6e"/>
        <path d="M46 30 L114 34 L106 116 L60 116 Z" fill="${SKIN}" stroke="${INK}" stroke-width="2"/>
        <path d="M194 30 L126 34 L134 116 L180 116 Z" fill="${SKIN}" stroke="${INK}" stroke-width="2"/>
        <ellipse cx="83" cy="120" rx="24" ry="10" fill="${SKIN_LO}" stroke="${INK}"/>
        <ellipse cx="157" cy="120" rx="24" ry="10" fill="${SKIN_LO}" stroke="${INK}"/>
        <circle cx="83" cy="118" r="6" fill="#efb88c"/><circle cx="157" cy="118" r="6" fill="#efb88c"/>
        <path d="M62 124 L104 124 L98 200 L68 200 Z" fill="${SKIN}" stroke="${INK}" stroke-width="2"/>
        <path d="M178 124 L136 124 L142 200 L172 200 Z" fill="${SKIN}" stroke="${INK}" stroke-width="2"/>
        <path d="M83 130 L83 196 M157 130 L157 196" stroke="${CREASE}" stroke-opacity=".6"/>
        <g data-show="wound">
          <ellipse cx="80" cy="84" rx="12" ry="5" fill="#7a0f14"/>
          <ellipse cx="80" cy="83" rx="8" ry="2.5" fill="#c8232a"/>
          <path d="M84 89 q2 10 -1 18" stroke="#c8232a" stroke-width="3" fill="none"/>
        </g>`,
      zones: {
        outerThighR: { x: 60, y: 70, r: 9, name: 'Outer thigh, right leg', why: 'That is the outer thigh.' },
        outerThighL: { x: 180, y: 70, r: 9, name: 'Outer thigh, left leg', why: 'That is the outer thigh.' },
        innerThighR: { x: 102, y: 70, r: 8, name: 'Inner thigh, right leg', why: 'The inner thigh has big blood vessels and nerves. Use the outer thigh.' },
        innerThighL: { x: 138, y: 70, r: 8, name: 'Inner thigh, left leg', why: 'The inner thigh has big blood vessels and nerves. Use the outer thigh.' },
        kneeR: { x: 83, y: 120, r: 10, name: 'Right knee', why: 'That is a joint. Never over, into, or through a joint.' },
        kneeL: { x: 157, y: 120, r: 10, name: 'Left knee', why: 'That is a joint. Never over, into, or through a joint.' },
        tibiaR: { x: 91, y: 140, r: 7, name: 'Flat inner face of the right shin, just below the knee', why: 'That is the proximal tibia.' },
        tibiaL: { x: 149, y: 140, r: 7, name: 'Flat inner face of the left shin, just below the knee', why: 'That is the proximal tibia.' },
        tqHigh: { x: 80, y: 42, r: 8, name: 'High on the thigh, at the groin crease', why: '"High and tight" is for an unsafe scene or a wound you cannot see. This scene is safe: NH wants bare skin, 2-3 inches above the wound.' },
        tqAbove: { x: 80, y: 69, r: 6, name: 'On the thigh, 2-3 inches above the wound', why: 'That is 2-3 inches above the wound.' },
        tqOver: { x: 80, y: 84, r: 7, name: 'Right on the wound', why: 'A tourniquet on the wound itself does not squeeze the artery that feeds it. Go 2-3 inches above.' },
        tqBelow: { x: 80, y: 101, r: 7, name: 'Below the wound', why: 'Arterial blood comes from the heart, above the wound. A tourniquet below it does nothing.' },
      },
    },

    chest: {
      label: 'The patient\'s bare chest from the front, lying on his back. His right side is on your left. For lead placement, numbers mark the intercostal spaces (ICS) beside the sternum; dashed lines mark the midclavicular (MCL), anterior axillary (AAL), and midaxillary (MAL) lines.',
      tok: [206, 190],
      art: `
        <rect x="104" y="0" width="32" height="26" fill="${SKIN_LO}"/>
        <path d="M34 26 L10 40 L14 124 L36 112 Z" fill="${SKIN_LO}" stroke="${INK}"/>
        <path d="M206 26 L230 40 L226 124 L204 112 Z" fill="${SKIN_LO}" stroke="${INK}"/>
        <path d="M40 22 Q120 14 200 22 L206 60 Q196 110 186 150 L192 200 H48 L54 150 Q44 110 34 60 Z" fill="${SKIN}" stroke="${INK}" stroke-width="2"/>
        ${ribs}
        <path d="M118 26 Q90 20 58 28 M122 26 Q150 20 182 28" stroke="${CREASE}" stroke-width="3" fill="none"/>
        <rect x="114" y="30" width="12" height="76" rx="4" fill="${SKIN_LO}"/>
        <path d="M114 106 L120 116 L126 106 Z" fill="${SKIN_LO}"/>
        <circle cx="86" cy="80" r="3" fill="#a0624a"/><circle cx="154" cy="80" r="3" fill="#a0624a"/>
        <ellipse cx="120" cy="160" rx="2" ry="3" fill="#a0624a"/>
        <path d="M70 186 Q96 180 110 200 M170 186 Q144 180 130 200" stroke="${CREASE}" stroke-width="2" fill="none"/>
        <g data-show="ics">
          ${[['2', 50], ['3', 62], ['4', 74], ['5', 86]].map(([n, y]) => txt(100, y + 3, n, 7, '#6b3a1a')).join('')}
          ${[[88, 'MCL'], [152, 'MCL'], [174, 'AAL'], [192, 'MAL']].map(([x, l]) => `<line x1="${x}" y1="40" x2="${x}" y2="130" stroke="#6b3a1a" stroke-opacity=".45" stroke-dasharray="3 3"/>${txt(x, 37, l, 6, '#6b3a1a')}`).join('')}
        </g>`,
      zones: {
        sternumLower: { x: 120, y: 90, r: 8, name: 'Center of the chest, lower half of the breastbone', why: 'That is the lower half of the breastbone.' },
        sternumUpper: { x: 120, y: 44, r: 8, name: 'Upper breastbone', why: 'Too high. Center of the chest, on the lower half of the breastbone.' },
        xiphoid: { x: 120, y: 113, r: 6, name: 'Tip of the breastbone (xiphoid)', why: 'Too low. Pushing on the tip of the breastbone can injure the liver. Move up onto the lower half of the breastbone.' },
        heartL: { x: 150, y: 94, r: 9, name: 'Left chest, over the heart', why: 'Compressions go in the center of the chest, not over the heart on the left.' },
        belly: { x: 120, y: 145, r: 12, name: 'Upper belly', why: 'That is the belly. Compressions go on the breastbone.' },
        padR: { x: 82, y: 44, r: 12, name: 'Right upper chest, below the collarbone', why: 'That is the right upper chest.' },
        padLat: { x: 184, y: 108, r: 12, name: 'Left side of the chest, below the armpit', why: 'That is the left side, below the armpit.' },
        padLUp: { x: 158, y: 44, r: 11, name: 'Left upper chest', why: 'That is the left upper chest. The pads go right upper chest and left side, so the current crosses the heart.' },
        V1: { x: 110, y: 74, r: 5, name: 'V1 spot', why: 'That is the V1 spot: 4th intercostal space, right edge of the sternum.' },
        V2: { x: 130, y: 74, r: 5, name: 'V2 spot', why: 'That is the V2 spot: 4th intercostal space, left edge of the sternum.' },
        V3: { x: 141, y: 83, r: 5, name: 'V3 spot', why: 'That is the V3 spot: halfway between V2 and V4.' },
        V4: { x: 152, y: 92, r: 6, name: 'V4 spot', why: 'That is the V4 spot: 5th intercostal space, left midclavicular line.' },
        V5: { x: 174, y: 92, r: 6, name: 'V5 spot', why: 'That is the V5 spot: left anterior axillary line, level with V4.' },
        V6: { x: 192, y: 92, r: 6, name: 'V6 spot', why: 'That is the V6 spot: left midaxillary line, level with V4.' },
        V4R: { x: 88, y: 92, r: 6, name: 'V4R spot', why: 'That is V4R: 5th intercostal space, right midclavicular line.' },
        carotidR: { x: 112, y: 10, r: 6, name: 'Neck, right side', why: 'That is the carotid.' },
        carotidL: { x: 128, y: 10, r: 6, name: 'Neck, left side', why: 'That is the carotid.' },
        femoralR: { x: 92, y: 186, r: 8, name: 'Right groin', why: 'That is the femoral pulse.' },
        femoralL: { x: 148, y: 186, r: 8, name: 'Left groin', why: 'That is the femoral pulse.' },
      },
    },

    arm: {
      label: 'The patient\'s right arm, palm up. Shoulder on the left, hand on the right.',
      tok: [40, 180],
      art: `
        <rect x="0" y="146" width="240" height="54" fill="#1b2233"/>
        <path d="M0 78 L96 84 Q108 86 120 88 L200 94 L212 96 L212 118 L200 120 L120 124 Q108 126 96 128 L0 134 Z" fill="${SKIN}" stroke="${INK}" stroke-width="2"/>
        <path d="M210 94 Q240 90 240 104 L240 120 Q232 124 210 120 Z" fill="${SKIN}" stroke="${INK}" stroke-width="2"/>
        <path d="M0 90 Q60 92 100 96 Q150 98 205 100" stroke="#5a78b8" stroke-width="3" stroke-opacity=".7" fill="none"/>
        <path d="M0 124 Q60 122 98 118 Q150 116 205 114" stroke="#5a78b8" stroke-width="3" stroke-opacity=".7" fill="none"/>
        <path d="M97 98 Q106 108 114 117" stroke="#4a68a8" stroke-width="4" stroke-opacity=".85" fill="none"/>
        <path d="M104 90 Q109 106 104 124" stroke="${CREASE}" stroke-width="2" fill="none" stroke-dasharray="3 3"/>
        <path d="M200 96 L200 120" stroke="${CREASE}" stroke-width="2"/>
        <circle class="beat" cx="96" cy="124" r="3" fill="none" stroke="#c8232a" stroke-opacity=".5"/>`,
      zones: {
        upperArm: { x: 50, y: 106, r: 16, name: 'Upper arm, above the elbow', why: 'That is the upper arm.' },
        forearmBand: { x: 160, y: 108, r: 12, name: 'Forearm', why: 'The band goes above the vein you want, on the upper arm, so the veins at the elbow fill.' },
        acVein: { x: 106, y: 108, r: 7, name: 'Vein in the crook of the elbow', why: 'That is the antecubital vein.' },
        brachial: { x: 96, y: 124, r: 6, name: 'Pulsing spot at the inner elbow', why: 'That one pulses: it is the brachial artery. Veins do not pulse.' },
        wrist: { x: 204, y: 108, r: 8, name: 'Inner wrist', why: 'The inner wrist packs nerves, tendons, and the radial artery close together. Pick the straight, bouncy vein at the elbow.' },
      },
    },

    floor: {
      label: 'A gas station restroom floor. A used syringe lies by the patient\'s arm.',
      tok: [112, 164],
      art: `
        ${tiles}
        <path d="M0 150 Q30 146 64 152 L64 164 Q30 160 0 166 Z" fill="${SKIN}" stroke="${INK}"/>
        <ellipse cx="60" cy="50" rx="24" ry="30" fill="#f2f2ee" stroke="${INK}" stroke-width="2"/>
        <ellipse cx="60" cy="56" rx="14" ry="18" fill="#9fc3d9"/>
        <rect x="40" y="12" width="40" height="12" fill="#f2f2ee" stroke="${INK}"/>
        <rect x="170" y="36" width="44" height="50" rx="4" fill="#c8232a" stroke="${INK}" stroke-width="2"/>
        <rect x="176" y="30" width="32" height="10" fill="#f2f2ee" stroke="${INK}"/>
        ${txt(192, 66, 'SHARPS', 8, '#fff')}
        <rect x="172" y="120" width="40" height="52" rx="3" fill="#6b7280" stroke="${INK}" stroke-width="2"/>
        <rect x="168" y="116" width="48" height="8" fill="#4b5563" stroke="${INK}"/>
        ${txt(192, 150, 'TRASH', 8, '#fff')}`,
      zones: {
        sharps: { x: 192, y: 60, r: 26, name: 'Sharps container', why: 'That is the sharps container.' },
        trash: { x: 192, y: 146, r: 24, name: 'Trash can', why: 'A loose needle in the trash sticks whoever empties it next.' },
        toilet: { x: 60, y: 50, r: 26, name: 'Toilet', why: 'Flushed needles clog pipes and stick plumbers. Sharps container only.' },
      },
    },

    bathroom: {
      label: 'Top-down view: a narrow pink bathroom on the left, a hallway on the right. The patient is on the toilet.',
      tok: [40, 46],
      art: `
        <rect x="104" y="0" width="136" height="200" fill="#7a6146"/>
        ${[16, 40, 64, 88, 112, 136, 160, 184].map((y) => `<line x1="104" y1="${y}" x2="240" y2="${y}" stroke="#5d4934"/>`).join('')}
        ${pink}
        <rect x="100" y="0" width="6" height="78" fill="#2a2a2a"/><rect x="100" y="132" width="6" height="68" fill="#2a2a2a"/>
        <rect x="22" y="10" width="36" height="10" fill="#f2f2ee" stroke="${INK}"/>
        <ellipse cx="40" cy="42" rx="18" ry="22" fill="#f2f2ee" stroke="${INK}" stroke-width="2"/>
        <ellipse cx="40" cy="46" rx="10" ry="13" fill="#9fc3d9"/>
        <rect x="8" y="130" width="84" height="62" rx="16" fill="#f2f2ee" stroke="${INK}" stroke-width="2"/>
        <rect x="16" y="138" width="68" height="46" rx="12" fill="#bfe0ef"/>
        <rect x="66" y="96" width="16" height="12" fill="#f2b632" stroke="${INK}" transform="rotate(-18 74 102)"/>
        <rect x="176" y="8" width="58" height="80" rx="4" fill="#8fa6d8" stroke="${INK}" stroke-width="2"/>
        <rect x="184" y="14" width="42" height="16" rx="4" fill="#f2f2ee"/>
        ${txt(170, 190, 'HALLWAY', 8, '#e8d8c0')}`,
      zones: {
        hallway: { x: 164, y: 140, r: 30, name: 'Hallway floor', why: 'That is the hallway floor.' },
        toilet: { x: 40, y: 44, r: 22, name: 'Toilet', why: 'A toilet is not a firm, flat surface. CPR there is useless.' },
        bathFloor: { x: 52, y: 100, r: 14, name: 'Bathroom floor', why: 'Four feet wide. Nobody can kneel on both sides of him in there. Get him out.' },
        tub: { x: 50, y: 160, r: 26, name: 'Bathtub', why: 'A curved, slippery tub is no place for CPR, and you cannot reach him.' },
        bed: { x: 205, y: 48, r: 30, name: 'Bed', why: 'A mattress absorbs your compressions. The floor, every time.' },
      },
    },

    lz: {
      label: 'Map of the crash on Route 124: road across the middle, trees top left, power lines top right, a hillside bottom left, an open field bottom right.',
      tok: [116, 140],
      art: `
        <rect width="240" height="200" fill="#2f5d34"/>
        <rect x="130" y="130" width="106" height="64" fill="#3f7c46"/>
        <rect x="0" y="86" width="240" height="26" fill="#3a3a3a"/>
        ${[8, 40, 72, 104, 136, 168, 200, 232].map((x) => `<rect x="${x}" y="98" width="16" height="2" fill="#f2b632"/>`).join('')}
        <rect x="38" y="116" width="30" height="16" fill="#8a8f98" stroke="${INK}" transform="rotate(22 53 124)"/>
        ${[[24, 26], [46, 16], [16, 52], [52, 46], [34, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#1d3f22" stroke="#12301a"/>`).join('')}
        <line x1="120" y1="30" x2="240" y2="26" stroke="#111" stroke-width="1.5"/><line x1="120" y1="36" x2="240" y2="32" stroke="#111" stroke-width="1.5"/>
        ${[120, 180, 236].map((x) => `<rect x="${x - 2}" y="24" width="5" height="16" fill="#6b4a2a"/>`).join('')}
        ${[160, 172, 184].map((r) => `<path d="M0 ${r} Q40 ${r - 22} 80 ${r}" stroke="#244a2a" fill="none"/>`).join('')}
        ${txt(186, 192, 'OPEN FIELD', 7, '#d8f0d8')}
        ${txt(40, 196, 'HILLSIDE', 7, '#d8f0d8')}`,
      zones: {
        field: { x: 182, y: 162, r: 28, name: 'Open, flat field', why: 'That is the open field.' },
        wires: { x: 180, y: 52, r: 22, name: 'Field under the power lines', why: 'Wires are nearly invisible from the air and a known killer of helicopter crews. Pick open ground and report every wire.' },
        trees: { x: 36, y: 36, r: 24, name: 'Tree line', why: 'Rotor wash and a tree line do not mix. The pilot needs clear approach and departure paths.' },
        slope: { x: 42, y: 168, r: 22, name: 'Hillside', why: 'Too steep. The aircraft needs flat, level ground.' },
      },
    },

    heli: {
      label: 'Top-down view of the helicopter on the ground, nose pointing up, rotors turning.',
      tok: [214, 188],
      art: `
        <rect width="240" height="200" fill="#3f7c46"/>
        <circle cx="120" cy="92" r="68" fill="#fff" fill-opacity=".06" stroke="#cfd6e0" stroke-dasharray="4 6"/>
        <rect x="116" y="124" width="8" height="58" fill="#e8e8e8" stroke="${INK}"/>
        <circle cx="120" cy="182" r="12" fill="none" stroke="#cfd6e0" stroke-dasharray="2 3"/>
        <ellipse cx="120" cy="90" rx="22" ry="38" fill="#e8e8e8" stroke="${INK}" stroke-width="2"/>
        <path d="M104 66 Q120 50 136 66 L132 76 Q120 70 108 76 Z" fill="#6aa8d8" stroke="${INK}"/>
        <g class="spin"><line x1="52" y1="92" x2="188" y2="92" stroke="#1b1d22" stroke-width="3"/><line x1="120" y1="24" x2="120" y2="160" stroke="#1b1d22" stroke-width="3"/></g>
        ${txt(120, 12, 'NOSE', 7)}
        ${txt(146, 196, 'TAIL ROTOR', 7)}`,
      zones: {
        front: { x: 120, y: 30, r: 16, name: 'In front of the nose, in the pilot\'s view', why: 'That is the front.' },
        tail: { x: 120, y: 178, r: 16, name: 'Behind the aircraft, by the tail', why: 'The tail rotor spins so fast it is nearly invisible. It does not forgive. Front only.' },
        rearL: { x: 60, y: 146, r: 16, name: 'Rear left side', why: 'Behind the doors you are out of the pilot\'s view and closer to the tail rotor. Approach from the front.' },
        rearR: { x: 180, y: 146, r: 16, name: 'Rear right side', why: 'Behind the doors you are out of the pilot\'s view and closer to the tail rotor. Approach from the front.' },
      },
    },

    staging: {
      label: 'Street map: Pine Hollow Apartments at the top, its parking lot to the right, a street in front, a side street around a corner at the bottom left, a dead-end street at the bottom right.',
      tok: [150, 160],
      art: `
        <rect width="240" height="200" fill="#2f5d34"/>
        <rect x="0" y="96" width="240" height="24" fill="#3a3a3a"/>
        <rect x="20" y="120" width="24" height="80" fill="#3a3a3a"/>
        <rect x="190" y="120" width="24" height="60" fill="#3a3a3a"/><circle cx="202" cy="180" r="16" fill="#3a3a3a"/>
        <rect x="92" y="22" width="72" height="58" fill="#8a6a4a" stroke="${INK}" stroke-width="2"/>
        ${[100, 118, 136, 152].map((x) => `<rect x="${x}" y="32" width="8" height="8" fill="#f2d98a"/><rect x="${x}" y="52" width="8" height="8" fill="#f2d98a"/>`).join('')}
        ${txt(128, 76, 'PINE HOLLOW', 6, '#fff')}
        <rect x="172" y="30" width="62" height="54" fill="#4b4b4b"/>
        ${txt(203, 60, 'LOT', 7, '#ddd')}
        <rect x="54" y="128" width="58" height="60" fill="#6a5a6a" stroke="${INK}" stroke-width="2"/>
        ${txt(83, 162, 'STORE', 7, '#fff')}
        ${txt(202, 196, 'DEAD END', 6, '#ddd')}`,
      zones: {
        corner: { x: 32, y: 168, r: 16, name: 'Side street, around the corner behind the store', why: 'That is around the corner.' },
        front: { x: 128, y: 108, r: 16, name: 'Street right in front of the building', why: 'In full view of the building. A lit-up ambulance can escalate a crisis and puts you in the line of danger.' },
        lot: { x: 203, y: 57, r: 20, name: 'The building\'s parking lot', why: 'Too close: in view of the windows, and you can get boxed in.' },
        deadEnd: { x: 202, y: 178, r: 16, name: 'Dead-end street', why: 'Out of sight, but it is a dead end. If things go bad you cannot drive out. Pick a spot with an exit route.' },
      },
    },

    room: {
      label: 'Top-down view of the apartment: the only door is at the bottom left, the patient sits on a couch at the top right, a kitchen counter is on the right.',
      tok: [32, 188],
      art: `
        <rect width="240" height="200" fill="#5a4a3a"/>
        <rect x="4" y="4" width="232" height="192" fill="none" stroke="#2a2a2a" stroke-width="8"/>
        <rect x="8" y="190" width="48" height="10" fill="#5a4a3a"/>
        <path d="M8 192 Q52 190 56 150" stroke="#cfd6e0" stroke-dasharray="3 3" fill="none"/>
        ${txt(32, 184, 'DOOR', 7, '#e8d8c0')}
        <rect x="140" y="18" width="80" height="36" rx="6" fill="#6a4a8a" stroke="${INK}" stroke-width="2"/>
        <circle cx="178" cy="40" r="9" fill="${SKIN}" stroke="${INK}" stroke-width="2"/>
        <rect x="196" y="110" width="36" height="76" fill="#9a8a7a" stroke="${INK}" stroke-width="2"/>
        <rect x="208" y="126" width="12" height="10" fill="#3a2a1a"/>
        ${txt(214, 104, 'KITCHEN', 6, '#e8d8c0')}`,
      zones: {
        nearDoor: { x: 44, y: 150, r: 18, name: 'Near the door, with the door behind you', why: 'That keeps the exit behind you.' },
        farCorner: { x: 32, y: 36, r: 18, name: 'Far corner of the room', why: 'Now he is between you and the only door.' },
        kitchen: { x: 214, y: 156, r: 18, name: 'By the kitchen counter', why: 'Kitchens hold knives. Keep him and yourself away from them.' },
        closeToHim: { x: 156, y: 76, r: 16, name: 'Right next to him', why: 'Too close. Stay beyond arm\'s reach, with room to move.' },
      },
    },

    neb: {
      label: 'A hand-held nebulizer: mouthpiece on the left, medicine cup below, oxygen tubing at the bottom.',
      tok: [200, 150],
      art: `
        <rect x="40" y="48" width="58" height="12" rx="5" fill="#dfe8f0" stroke="${INK}"/>
        <rect x="96" y="46" width="48" height="16" rx="6" fill="#dfe8f0" stroke="${INK}"/>
        <rect x="142" y="48" width="70" height="12" rx="5" fill="#dfe8f0" stroke="${INK}"/>
        <path d="M100 64 H140 L136 120 Q120 132 104 120 Z" fill="#dfe8f0" fill-opacity=".85" stroke="${INK}" stroke-width="2"/>
        <path d="M120 128 Q120 170 60 192" stroke="#8fd0ff" stroke-width="5" fill="none"/>
        ${txt(62, 44, 'MOUTHPIECE', 6)}
        ${txt(120, 146, 'CUP', 7)}`,
      zones: {
        cup: { x: 120, y: 96, r: 18, name: 'Medicine cup', why: 'That is the cup.' },
        mouthpiece: { x: 64, y: 54, r: 14, name: 'Mouthpiece', why: 'The medicine goes in the cup below. Unscrew the cup and squeeze the vial in.' },
        tubing: { x: 82, y: 180, r: 12, name: 'Oxygen tubing', why: 'That is the oxygen line. The medicine goes in the cup.' },
      },
    },

    injector: {
      label: 'An epinephrine auto-injector: blue safety release on the left end, orange needle end on the right.',
      tok: [206, 184],
      art: `
        <rect x="60" y="86" width="120" height="28" rx="10" fill="#f2f2ee" stroke="${INK}" stroke-width="2"/>
        <rect x="92" y="90" width="56" height="20" fill="#f2b632"/>
        ${txt(120, 104, 'EPI 0.3', 8, '#000')}
        <rect x="36" y="90" width="28" height="20" rx="5" fill="#2f6fb0" stroke="${INK}" stroke-width="2"/>
        <rect x="176" y="90" width="26" height="20" rx="8" fill="#f28c28" stroke="${INK}" stroke-width="2"/>`,
      zones: {
        blueCap: { x: 50, y: 100, r: 14, name: 'Blue safety release', why: 'That is the safety release.' },
        orangeTip: { x: 190, y: 100, r: 14, name: 'Orange needle end', why: 'A thumb over the orange end is how people inject their own thumb. Grip it in your fist, orange end toward the thigh.' },
      },
    },
  };
})();
