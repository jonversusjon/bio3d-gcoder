export function isWebSqlSupported(): boolean {
  return 'openDatabase' in window;
}

export function isIndexedDbSupported(): boolean {
  return 'indexedDB' in window;
}
