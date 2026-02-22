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
      INSERT INTO updates (id, goal_id, source, agent_name, summary, details, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, params.id, body.source || 'manual', body.agent_name || null, body.summary, body.details || null, now);
    
    // Update goal's updated_at
    db.prepare('UPDATE goals SET updated_at = ? WHERE id = ?').run(now, params.id);
    
    return json({ id, goal_id: params.id, summary: body.summary, created_at: now }, { status: 201 });
  });
}
