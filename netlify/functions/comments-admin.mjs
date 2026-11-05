/**
 * /api/comments/admin — backs the moderation page at /admin/comments.html.
 *
 * Every request must carry the moderation password, set in Netlify as the
 * environment variable COMMENTS_ADMIN_PASSWORD, as "Authorization: Bearer
 * <password>". Until that variable exists, everything here answers 503.
 *
 *   GET                                   every comment (newest first) + the block list
 *   POST { action: "delete", post, id }   remove one comment
 *   POST { action: "block", post, id }    remove the comment and hide future comments
 *                                         from the same email or IP address
 *   POST { action: "unblock", id }        lift a block
 */

import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import { blockKey, commentKey, isId, isSlug, readBlocks, readComments, store } from '../lib/comments.mjs';

export default async (req) => {
  const expected = process.env.COMMENTS_ADMIN_PASSWORD;
  if (!expected) return json({ error: 'not-configured' }, 503);
  if (!passwordMatches(req, expected)) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // slow down guessing
    return json({ error: 'wrong-password' }, 401);
  }

  if (req.method === 'GET') return json(await overview());

  const body = await req.json().catch(() => ({}));
  switch (body.action) {
    case 'delete':
      if (!isSlug(body.post) || !isId(body.id)) return json({ error: 'unknown-comment' }, 400);
      await store().delete(commentKey(body.post, body.id));
      return json({ ok: true });

    case 'block': {
      if (!isSlug(body.post) || !isId(body.id)) return json({ error: 'unknown-comment' }, 400);
      const c = await store().get(commentKey(body.post, body.id), { type: 'json' });
      if (!c) return json({ error: 'not-found' }, 404);
      if (!c.ip && !c.email) return json({ error: 'nothing-to-block' }, 400);
      const blocks = await readBlocks();
      if (!blocks.some((b) => (c.ip && b.ip === c.ip) || (c.email && b.email === c.email))) {
        const id = randomUUID();
        await store().setJSON(blockKey(id), { id, name: c.name, email: c.email, ip: c.ip, blockedAt: new Date().toISOString() });
      }
      await store().delete(commentKey(body.post, body.id));
      return json({ ok: true });
    }

    case 'unblock':
      if (!isId(body.id)) return json({ error: 'unknown-block' }, 400);
      await store().delete(blockKey(body.id));
      return json({ ok: true });

    default:
      return json({ error: 'unknown-action' }, 400);
  }
};

function passwordMatches(req, expected) {
  const given = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  // Hashing first makes both sides the same length, which timingSafeEqual needs.
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

async function overview() {
  const comments = (await readComments())
    .reverse()
    .map((c) => ({
      post: c.post,
      postTitle: c.postTitle || c.post,
      id: c.id,
      name: c.name,
      email: c.email,
      comment: c.comment,
      createdAt: c.createdAt,
    }));
  const blocks = (await readBlocks())
    .sort((a, b) => (a.blockedAt < b.blockedAt ? 1 : -1))
    .map((b) => ({ id: b.id, name: b.name, email: b.email, byIp: Boolean(b.ip), blockedAt: b.blockedAt }));
  return { comments, blocks };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export const config = { path: '/api/comments/admin', method: ['GET', 'POST'] };
