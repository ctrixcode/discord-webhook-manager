import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes a URL to prevent XSS attacks
 * Only allows http:, https:, and mailto: protocols
 *
 * @param url - The URL to sanitize
 * @returns Sanitized URL or '#' if invalid
 */
export function sanitizeUrl(url: string): string {
  try {
    const u = new URL(
      url,
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://example.com'
    );
    const allowed = new Set(['http:', 'https:', 'mailto:']);
    return allowed.has(u.protocol) ? u.toString() : '#';
  } catch (error) {
    // Invalid URL format - return safe fallback
    console.warn('Invalid URL provided to sanitizeUrl:', url, error);
    return '#';
  }
}
