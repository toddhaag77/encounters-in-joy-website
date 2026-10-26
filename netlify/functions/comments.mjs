/**
 * GET /api/comments?post=<slug>
 *
 * The comments shown under a blog post, oldest first. Public, so it returns
 * only name, comment and date (never email or IP address).
 */

import { isSlug, publicComment, readComments } from '../lib/comments.mjs';

export default async (req) => {
  const post = new URL(req.url).searchParams.get('post');
  if (!isSlug(post)) return json({ error: 'unknown-post' }, 400);

  const comments = (await readComments(post)).map(publicComment);
  return json({ comments });
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export const config = { path: '/api/comments', method: 'GET' };
