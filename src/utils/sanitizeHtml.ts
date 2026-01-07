/**
 * SECURITY UTILITY: HTML Sanitization
 * Prevents XSS attacks by sanitizing HTML content before rendering
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @param options - Optional DOMPurify configuration
 * @returns Sanitized HTML string safe for dangerouslySetInnerHTML
 */
export function sanitizeHtml(
  html: string | null | undefined,
  options?: {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
  }
): string {
  if (!html) return '';

  const defaultOptions = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'b', 'i', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id', 'style'],
    ALLOW_DATA_ATTR: false,
    ...options
  };

  return DOMPurify.sanitize(html, defaultOptions);
}

/**
 * Sanitizes HTML for email content (more restrictive)
 */
export function sanitizeEmailHtml(html: string | null | undefined): string {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'div'],
    allowedAttributes: { a: ['href', 'target'] }
  });
}

