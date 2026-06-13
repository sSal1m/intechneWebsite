// Helper function to extract storage path from file URLs
export function extractStoragePath(url: string | undefined | null): string | null {
  if (!url) return null;
  
  // Decodes %20 or other characters
  const decodedUrl = decodeURIComponent(url);

  // Match standard uploads folder path
  let match = decodedUrl.match(/\/uploads\/(.+)$/);
  if (match && match[1]) {
    return `uploads/${match[1]}`;
  }

  // Match other folders (like /intechne-assets/identity/ or sliders/)
  match = decodedUrl.match(/\/intechne-assets\/(.+)$/);
  if (match && match[1]) {
    return match[1];
  }

  return null;
}
