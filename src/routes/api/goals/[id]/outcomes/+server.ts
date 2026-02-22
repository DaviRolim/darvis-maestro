import { json, error } from '@sveltejs/kit';
import db from '$lib/db';

export function PATCH({ params, request }) {
  return request.json().then((body) => {
    const goal = db.prepare('SELECT id FROM goals WHERE id = ?').get(params.id);
    if (!goal) throw error(404, 'Goal not found');
    
    const now = new Date().toISOString();
    
    db.prepare(`
      UPDATE goals SET outcome_tags = ?, outcome_notes = ?, updated_at = ? WHERE id = ?
    `).run(
      JSON.stringify(body.outcome_tags || []),
      body.outcome_notes || '',
      now,
      params.id
    );
    
    return json({ ok: true });
  });
}
