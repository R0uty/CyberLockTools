import DOMPurify from 'dompurify';

export function sanitizeHtml(dirtyHtml = '') {
  return DOMPurify.sanitize(dirtyHtml, {
    USE_PROFILES: { html: true },
  });
}
