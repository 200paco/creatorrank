/**
 * Extract the YouTube channel identifier from a URL.
 * Supports formats like:
 *   https://www.youtube.com/channel/UC...
 *   https://www.youtube.com/@handle
 *   https://youtube.com/c/ChannelName
 */
export function extractChannelId(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length === 0) return null;
    // /channel/UC..., /c/Name, /@handle
    if (parts[0] === 'channel' || parts[0] === 'c') {
      return parts[1] || null;
    }
    if (parts[0].startsWith('@')) {
      return parts[0];
    }
    return parts[0];
  } catch {
    return null;
  }
}

/**
 * Validate that a string looks like a YouTube channel URL.
 */
export function isValidChannelUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === 'www.youtube.com' ||
      parsed.hostname === 'youtube.com' ||
      parsed.hostname === 'm.youtube.com'
    );
  } catch {
    return false;
  }
}

/**
 * Format a date string for display.
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
