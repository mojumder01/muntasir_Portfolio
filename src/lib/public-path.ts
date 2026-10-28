// =============================================================
// public-path.ts
// Turns an uploaded file path like "/media/photo.jpg" (as written
// by the Pages CMS admin) into "media/photo.jpg", so images work
// both at https://name.github.io/ and https://name.github.io/repo/.
// =============================================================

/** Returns a relative path to a file in public/, or '' when empty. */
export function toPublicPath(path: string | null | undefined): string {
  const trimmedPath = (path ?? '').trim();
  if (trimmedPath === '') return '';
  if (/^https:\/\//.test(trimmedPath)) return trimmedPath; // full link to an image elsewhere
  return trimmedPath.replace(/^\/+/, '').replace(/^public\//, '');
}
