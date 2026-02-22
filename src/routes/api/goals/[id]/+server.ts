import { json, error } from '@sveltejs/kit';
import db from '$lib/db';

export function GET({ params }) {
  const goal: any = db.prepare('SELECT * FROM goals WHERE id = ?').get(params.id);
  if (!goal) throw error(404, 'Goal not found');
  
  const updates = db.prepare('SELECT * FROM updates WHERE goal_id = ? ORDER BY created_at DESC').all(params.id);
  const artifacts = db.prepare('SELECT * FROM artifacts WHERE goal_id = ? ORDER BY created_at DESC').all(params.id);
  const metrics = db.prepare('SELECT * FROM metrics WHERE goal_id = ? ORDER BY created_at DESC').all(params.id);
  
  return json({
    ...goal,
    tags: JSON.parse(goal.tags || '[]'),
    outcome_tags: JSON.parse(goal.outcome_tags || '[]'),
    updates,
    artifacts,
    metrics,
  });
}

export function PATCH({ params, request }) {
  return request.json().then((body) => {
    const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(params.id);
    if (!goal) throw error(404, 'Goal not found');
    
    const fields: string[] = [];
    const values: any[] = [];
    
    for (const [key, value] of Object.entries(body)) {
      if (['title', 'description', 'status', 'jira_url', 'narrative', 'narrative_tone', 'outcome_notes', 'total_spend'].includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
      if (key === 'tags' || key === 'outcome_tags') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(value));
      }
    }
    
    if (fields.length > 0) {
      fields.push('updated_at = ?');
      values.push(new Date().toISOString());
      values.push(params.id);
      
      db.prepare(`UPDATE goals SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    }
    
    const updated = db.prepare('SELECT * FROM goals WHERE id = ?').get(params.id);
    return json(updated);
  });
}

export function DELETE({ params }) {
  const result = db.prepare('DELETE FROM goals WHERE id = ?').run(params.id);
  if (result.changes === 0) throw error(404, 'Goal not found');
  return json({ ok: true });
}
