import { json } from '@sveltejs/kit';
import db from '$lib/db';
import { randomUUID } from 'crypto';

export function POST({ request }) {
  return request.json().then((body) => {
    const now = new Date().toISOString();
    let goalId = body.goalId;
    
    // Fuzzy match by title if no goalId
    if (!goalId && body.goalTitle) {
      const goal: any = db.prepare(
        'SELECT id FROM goals WHERE title LIKE ? ORDER BY updated_at DESC LIMIT 1'
      ).get(`%${body.goalTitle}%`);
      goalId = goal?.id;
    }
    
    if (!goalId) {
      return json({ ok: false, error: 'No matching goal found. Provide goalId or goalTitle.' }, { status: 404 });
    }
    
    // Create update
    const updateId = randomUUID();
    db.prepare(`
      INSERT INTO updates (id, goal_id, source, agent_name, summary, details, created_at)
      VALUES (?, ?, 'agent', ?, ?, ?, ?)
    `).run(updateId, goalId, body.agentName || 'unknown', body.summary, body.details || null, now);
    
    // Create artifacts if provided
    if (body.artifacts && Array.isArray(body.artifacts)) {
      const stmt = db.prepare(`
        INSERT INTO artifacts (id, goal_id, type, url, title, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      for (const a of body.artifacts) {
        stmt.run(randomUUID(), goalId, a.type || 'link', a.url || null, a.title, now);
      }
    }
    
    db.prepare('UPDATE goals SET updated_at = ? WHERE id = ?').run(now, goalId);
    
    return json({ ok: true, goalId, updateId });
  });
}
