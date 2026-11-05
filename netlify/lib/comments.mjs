/**
 * Shared storage for blog comments, used by the functions in
 * netlify/functions/. Everything lives in one Netlify Blobs store
 * ("blog-comments", visible in the Netlify UI under Blobs):
 *
 *   post/<slug>/<id>   one comment: { id, post, postTitle, name, email, comment, ip, createdAt }
 *   block/<id>         one blocked commenter: { id, name, email, ip, blockedAt }
 *
 * Each comment is its own entry, so two comments arriving at the same moment
 * never write to the same place and neither can overwrite the other.
 *
 * A comment is public as soon as it's stored. Email is only ever sent to the
 * password-protected moderation page; the IP address is never sent anywhere,
 * it's kept only so a block can match it.
 */

import { getStore } from '@netlify/blobs';

export const FORM_NAME = 'blog-comment';
export const MAX = { name: 60, email: 120, comment: 3000, title: 200 };

export function store() {
  return getStore({ name: 'blog-comments', consistency: 'strong' });
}

/** Blog URLs are /blog/<slug>/ — see slugFromFile() in tools/build-blog.js. */
export function isSlug(value) {
  return typeof value === 'string' && value.length <= 120 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

/** Comment and block IDs end up in storage keys, so only plain characters. */
export function isId(value) {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(value);
}

export const commentKey = (post, id) => `post/${post}/${id}`;
export const blockKey = (id) => `block/${id}`;

// Control characters other than tab and newline.
const CONTROL_CHARS = /[\u0000-\u0008\u000B-\u001F\u007F]/g;

/** One line of text: whitespace collapsed, trimmed, cut to `max`. */
export function cleanLine(value, max) {
  return String(value == null ? '' : value)
    .replace(/\r\n?/g, '\n')
    .replace(CONTROL_CHARS, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/** A comment body: keeps paragraphs, drops runs of blank lines, cut to `max`. */
export function cleanText(value, max) {
  return String(value == null ? '' : value)
    .replace(/\r\n?/g, '\n')
    .replace(CONTROL_CHARS, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max);
}

export function cleanEmail(value) {
  const email = cleanLine(value, MAX.email).toLowerCase();
  return /^[^\s@]+@[^\s@]+$/.test(email) ? email : '';
}

/** The fields anyone may see. */
export function publicComment(c) {
  return { id: c.id, name: c.name, comment: c.comment, createdAt: c.createdAt };
}

async function readAll(prefix) {
  const s = store();
  const { blobs } = await s.list({ prefix });
  const entries = await Promise.all(blobs.map((b) => s.get(b.key, { type: 'json' })));
  return entries.filter(Boolean);
}

/** Comments on one post, oldest first; or every comment if no post is given. */
export async function readComments(post) {
  const comments = await readAll(post ? `post/${post}/` : 'post/');
  const order = (c) => `${c.createdAt} ${c.id}`;
  return comments.sort((a, b) => (order(a) < order(b) ? -1 : 1));
}

export function readBlocks() {
  return readAll('block/');
}

/** The block that matches this IP address or email, if any. */
export async function findBlock({ ip, email }) {
  return (await readBlocks()).find((b) => (ip && b.ip === ip) || (email && b.email === email)) || null;
}
