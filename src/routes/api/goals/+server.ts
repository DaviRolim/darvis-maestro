import { json } from '@sveltejs/kit';
import db from '$lib/db';
import { randomUUID } from 'crypto';

export function GET({ url }) {
  const status = url.searchParams.get('status');
  const tags = url.searchParams.get('tags');
  
  let query = 'SELECT * FROM goals WHERE 1=1';
  const params: any[] = [];
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (tags) {
    query += ' AND tags LIKE ?';
    params.push(`%${tags}%`);
  }
  
  query += ' ORDER BY updated_at DESC';
  
  const goals = db.prepare(query).all(...params);
  return json(goals.map((g: any) => ({
    ...g,
    tags: JSON.parse(g.tags || '[]'),
    outcome_tags: JSON.parse(g.outcome_tags || '[]'),
  })));
}

export function POST({ request }) {
  return request.json().then((body) => {
    const id = randomUUID();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO goals (id, title, description, status, tags, jira_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      body.title,
      body.description || null,
      body.status || 'planning',
      JSON.stringify(body.tags || []),
      body.jira_url || null,
      now,
      now
    );
    
    const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(id);
    return json(goal, { status: 201 });
  });
}
