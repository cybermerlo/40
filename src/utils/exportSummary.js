import { BEDS, NIGHTS, DAYS, DAY_PERIODS } from '../data/beds';
import { BAITE } from '../data/baite';
import { getDisplayName } from './helpers';

/**
 * Genera HTML A4 stampabile con il riepilogo partecipazione, prenotazioni, presenze e attività.
 */
export function buildSummaryHtml({ users, bookings, dayVisits, activities, scheduledActivities }) {
  const dateGen = new Date().toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const nightLabel = (id) => NIGHTS.find((n) => n.id === id)?.label || id;
  const dayLabel = (id) => DAYS.find((d) => d.id === id)?.label || id;
  const periodLabel = (id) => DAY_PERIODS.find((p) => p.id === id)?.label || id;
  const bedLabel = (bedId) => {
    const bed = BEDS[bedId];
    if (!bed) return bedId;
    const baitaNome = BAITE[bed.baita]?.soprannome || bed.baita;
    return `${baitaNome} – ${bed.stanza} (${bed.tipo})`;
  };

  const lines = [];
  lines.push('<div class="page">');
  lines.push('<h1>Riepilogo Weekend in Montagna</h1>');
  lines.push('<p class="subtitle">20–23 Febbraio 2026 • Generato il ' + dateGen + '</p>');

  // === PARTECIPANTI ===
  lines.push('<h2>Partecipanti (' + users.length + ')</h2>');
  lines.push('<table><thead><tr><th>Nome</th><th>Contatto</th></tr></thead><tbody>');
  users.forEach((u) => {
    const name = getDisplayName(u);
    const contact = u.email || u.telefono || '–';
    lines.push('<tr><td>' + escapeHtml(name) + '</td><td>' + escapeHtml(contact) + '</td></tr>');
  });
  lines.push('</tbody></table>');

  // === PRENOTAZIONI PER NOTTE ===
  lines.push('<h2>Prenotazioni posti letto</h2>');
  NIGHTS.forEach((night) => {
    const nightBookings = bookings.filter((b) => b.night === night.id);
    if (nightBookings.length === 0) {
      lines.push('<p><strong>' + night.label + '</strong>: nessuna prenotazione.</p>');
    } else {
      lines.push('<p><strong>' + night.label + '</strong></p>');
      lines.push('<ul>');
      nightBookings.forEach((b) => {
        const user = users.find((u) => u.id === b.userId);
        const name = user ? getDisplayName(user) : b.userId;
        lines.push('<li>' + escapeHtml(name) + ' → ' + escapeHtml(bedLabel(b.bedId)) + '</li>');
      });
      lines.push('</ul>');
    }
  });

  // === PRESENZE PER GIORNO ===
  lines.push('<h2>Presenze in giornata</h2>');
  DAYS.forEach((day) => {
    const visits = dayVisits.filter((v) => v.date === day.id);
    if (visits.length === 0) {
      lines.push('<p><strong>' + day.shortLabel + '</strong>: nessuna presenza indicata.</p>');
    } else {
      const byPeriod = {};
      visits.forEach((v) => {
        if (!byPeriod[v.period]) byPeriod[v.period] = [];
        const user = users.find((u) => u.id === v.userId);
        if (user) byPeriod[v.period].push(getDisplayName(user));
      });
      lines.push('<p><strong>' + day.label + '</strong></p>');
      lines.push('<ul>');
      DAY_PERIODS.forEach((p) => {
        const names = byPeriod[p.id] || [];
        if (names.length) lines.push('<li>' + p.label + ': ' + names.map(escapeHtml).join(', ') + '</li>');
      });
      lines.push('</ul>');
    }
  });

  // === ATTIVITÀ PROPOSTE ===
  lines.push('<h2>Attività proposte (' + activities.length + ')</h2>');
  if (activities.length === 0) {
    lines.push('<p>Nessuna proposta.</p>');
  } else {
    lines.push('<ul>');
    activities.forEach((a) => {
      const user = users.find((u) => u.id === a.userId);
      const proposto = user ? getDisplayName(user) : '?';
      const likes = (a.likes || []).length;
      lines.push('<li><strong>' + escapeHtml(a.title) + '</strong>');
      if (a.description) lines.push(' – ' + escapeHtml(a.description));
      lines.push(' (proposta da ' + escapeHtml(proposto) + ', ' + likes + ' like)</li>');
    });
    lines.push('</ul>');
  }

  // === ATTIVITÀ IN CALENDARIO ===
  lines.push('<h2>Attività in calendario</h2>');
  if (scheduledActivities.length === 0) {
    lines.push('<p>Nessuna attività schedulata.</p>');
  } else {
    lines.push('<table><thead><tr><th>Giorno</th><th>Ora</th><th>Attività</th></tr></thead><tbody>');
    scheduledActivities.forEach((sa) => {
      const activity = activities.find((a) => a.id === sa.activityId);
      const title = activity ? activity.title : '(eliminata)';
      lines.push(
        '<tr><td>' +
          escapeHtml(dayLabel(sa.date)) +
          '</td><td>' +
          escapeHtml(sa.time || '–') +
          '</td><td>' +
          escapeHtml(title) +
          '</td></tr>'
      );
    });
    lines.push('</tbody></table>');
  }

  lines.push('</div>');

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Riepilogo Weekend in Montagna</title>
  <style>
    @page { size: A4; margin: 1.5cm; }
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 11pt; line-height: 1.4; color: #1f2937; margin: 0; padding: 12px; background: #f3f4f6; }
    .page { max-width: 210mm; min-height: 297mm; margin: 0 auto; padding: 14mm; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    h1 { font-size: 18pt; margin: 0 0 4px 0; color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 6px; }
    .subtitle { font-size: 10pt; color: #6b7280; margin: 0 0 16px 0; }
    h2 { font-size: 13pt; margin: 16px 0 8px 0; color: #374151; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 10pt; }
    th, td { border: 1px solid #e5e7eb; padding: 6px 8px; text-align: left; }
    th { background: #f3f4f6; font-weight: 600; }
    ul { margin: 4px 0; padding-left: 20px; }
    li { margin: 2px 0; }
    p { margin: 6px 0; }
    @media print {
      body { background: #fff; padding: 0; }
      .page { max-width: none; box-shadow: none; padding: 0; min-height: auto; }
    }
  </style>
</head>
<body>
${lines.join('\n')}
</body>
</html>`;

  return html;
}

function escapeHtml(text) {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Apre il riepilogo in una nuova scheda (A4 stampabile). Usa Blob URL per evitare blocchi su document.write.
 */
export function openSummaryPrint(data) {
  const html = buildSummaryHtml(data);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, '_blank', 'noopener,noreferrer');
  if (!w) {
    URL.revokeObjectURL(url);
    alert('Consenti i popup per aprire il riepilogo.');
    return;
  }
  // Revoca l'URL dopo che la scheda ha caricato il contenuto
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
