/* Legend of JRMA: the crew.
 *
 * Each in-game role is played by a JRMA officer. Put the officer's name in
 * `name` (it shows in dialog and buttons) and tweak `look` to match them.
 * Game text refers to roles with tokens: {chief}, {partner}, {trainer}.
 * Only add people who have said yes to being in the game.
 *
 * `placeholder: true` marks a fictional stand-in still waiting for a real
 * officer. Delete that line when you fill the slot.
 *
 * look: skin, hair, shirt, pants, accent (reflective stripe), hat, and
 * optional beard / glasses (true or false).
 */
window.JRMA = window.JRMA || {};

window.JRMA.CREW = {
  // Hands out your gloves on day one; station wisdom.
  chief: {
    name: 'Chief Barnaby', role: 'Chief', placeholder: true,
    look: { skin: '#d9a070', hair: '#dcdcdc', shirt: '#f2f2ee', pants: '#1d2744', accent: '#f2b632', hat: '#f2f2ee' },
  },
  // Rides with you on every call and gives the hints ("Ask ...").
  partner: {
    name: 'Sully', role: 'Partner and FTO', placeholder: true,
    look: { skin: '#f0c29a', hair: '#8a5a33', shirt: '#2c3f6e', pants: '#1d2744', accent: '#cfd6e0', beard: true },
  },
  // Runs the Protocol Trials that advance your license.
  trainer: {
    name: 'Lt. Hale', role: 'Training Officer', placeholder: true,
    look: { skin: '#7a4a2e', hair: '#1e1e1e', shirt: '#2c3f6e', pants: '#1d2744', accent: '#f2b632', glasses: true },
  },
};
