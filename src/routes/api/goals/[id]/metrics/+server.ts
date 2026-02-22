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
      INSERT INTO metrics (id, goal_id, name, before_val, after_val, unit, source, measured_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, params.id, body.name, body.before_val, body.after_val, body.unit || null, body.source || 'manual', body.measured_at || now, now);
    
    db.prepare('UPDATE goals SET updated_at = ? WHERE id = ?').run(now, params.id);
    return json({ id, goal_id: params.id, name: body.name, created_at: now }, { status: 201 });
  });
}
