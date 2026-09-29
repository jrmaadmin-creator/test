// Crew progress: in the shared online version, each crew member's quiz results
// are saved to the page's shared database so the officer can see who has
// practiced what. The offline file has no shared database; it says so.
//
// Storage: progress/<viewer id> = { total, correct, best, per: { rhythmId: { r, w } }, updated }
// Only ids are stored; names are resolved at render time.

export async function initCrew(panel, rhythms) {
  const note = (text) => {
    const p = panel.querySelector('#crew-status');
    p.textContent = text;
  };
  const claude = window.claude;
  if (!claude?.use) {
    note('Crew progress works in the shared online version of this page. In this offline copy, your quiz stats stay on this device.');
    return null;
  }
  const [db, user] = await Promise.all([claude.use('db'), claude.use('user')]);
  if (!db || !user) {
    note('Crew progress is unavailable in this view. Sign in to claude.ai and open the shared link to take part.');
    return null;
  }
  const uid = await user.id();
  note(
    uid
      ? 'Your quiz results are shared with the crew on this page. Everyone with access sees the table below.'
      : 'You can see the crew table, but your results are not saved here because this view has no identity.',
  );

  const tbody = panel.querySelector('#crew-rows');
  let rows = [];
  const render = async () => {
    const ids = rows.map((r) => r.id);
    const people = ids.length ? await user.profiles(ids) : {};
    tbody.replaceChildren();
    if (!rows.length) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 4;
      td.className = 'muted';
      td.textContent = 'No results yet. Answer a quiz question to start the table.';
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }
    const sorted = [...rows].sort((a, b) => (b.total || 0) - (a.total || 0));
    for (const r of sorted) {
      const p = people[r.id];
      const mastered = Object.values(r.per || {}).filter((x) => x.r >= 3 && x.r >= 2 * x.w).length;
      const tr = document.createElement('tr');
      const cells = [
        p?.isMe ? `${p.name || 'You'} (you)` : p?.name || 'Crew member',
        String(r.total || 0),
        r.total ? `${Math.round((100 * (r.correct || 0)) / r.total)}%` : '—',
        `${mastered} of ${rhythms.length}`,
      ];
      for (const c of cells) {
        const td = document.createElement('td');
        td.textContent = c;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  };

  db.collection('progress').onSnapshot(
    (snap) => {
      rows = snap.docs.filter((d) => d.exists).map((d) => ({ id: d.id, ...d.data() }));
      render();
    },
    () => note('The crew table could not load. Reload the page to try again.'),
  );

  // One write at a time; coalesce answers that arrive while a write is running.
  let writing = false;
  let pending = null;
  let refused = false;
  const flush = async () => {
    if (writing || !pending || refused) return;
    writing = true;
    const body = pending;
    pending = null;
    try {
      await db.doc(`progress/${uid}`).set(body);
    } catch (e) {
      if (e?.code === 'invalid_argument' || e?.code === 'permission_denied') {
        refused = true;
        note('You can view the crew table, but your results cannot be saved with your access level. People invited by email need Editor access to save results; ask the page owner.');
      }
    }
    writing = false;
    if (pending) flush();
  };

  return {
    save(stats) {
      if (!uid) return;
      pending = { total: stats.total, correct: stats.correct, best: stats.best, per: stats.per, updated: Date.now() };
      flush();
    },
  };
}
