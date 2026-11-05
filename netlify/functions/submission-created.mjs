/**
 * Netlify runs this automatically for every form submission it accepts (the
 * name of the file is what wires it up). Submissions its spam filter catches
 * never get here.
 *
 * Comments from the form under each blog post are saved straight away, so
 * they're live on the next page load. Everything else (the lead form) is
 * left alone: Netlify has already stored and emailed it as before.
 */

import { randomUUID } from 'node:crypto';
import { FORM_NAME, MAX, cleanEmail, cleanLine, cleanText, commentKey, findBlock, isId, isSlug, store } from '../lib/comments.mjs';

export default async (req) => {
  const { payload } = await req.json();
  if (!payload || payload.form_name !== FORM_NAME) return new Response(null, { status: 204 });

  const d = payload.data || {};
  // Netlify's submission ID, so a retried event saves over the same entry
  // instead of adding a duplicate.
  const id = isId(String(payload.id)) ? String(payload.id) : randomUUID();
  const comment = {
    id,
    post: cleanLine(d.post, 120),
    postTitle: cleanLine(d['post-title'], MAX.title),
    name: cleanLine(d.name, MAX.name),
    email: cleanEmail(d.email),
    comment: cleanText(d.comment, MAX.comment),
    ip: cleanLine(d.ip, 64),
    createdAt: payload.created_at || new Date().toISOString(),
  };

  if (!isSlug(comment.post) || !comment.name || !comment.comment) {
    console.warn(`Ignored comment ${id}: missing post, name or comment`);
    return new Response(null, { status: 204 });
  }
  if (await findBlock(comment)) {
    console.log(`Ignored comment ${id} on "${comment.post}": the commenter is blocked`);
    return new Response(null, { status: 204 });
  }

  await store().setJSON(commentKey(comment.post, id), comment);
  console.log(`Saved comment ${id} on "${comment.post}"`);
  return new Response(null, { status: 204 });
};
