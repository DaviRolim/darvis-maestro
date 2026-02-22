import { json, error } from '@sveltejs/kit';
import db from '$lib/db';
import { randomUUID } from 'crypto';

export function POST({ params, request }) {
  return request.json().then((body) => {
    const goal = db.prepare('SELECT id FROM goals WHERE id = ?').get(params.id);
    if (!goal) throw error(404, 'Goal not found');
    
    const id = randomUUID();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO artifacts (id, goal_id, type, url, title, files_changed, lines_added, lines_removed, merged_at, ci_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, params.id, body.type, body.url || null, body.title,
      body.files_changed || null, body.lines_added || null, body.lines_removed || null,
      body.merged_at || null, body.ci_status || null, now
    );
    
    db.prepare('UPDATE goals SET updated_at = ? WHERE id = ?').run(now, params.id);
    return json({ id, goal_id: params.id, title: body.title, created_at: now }, { status: 201 });
  });
}
