import "server-only";

let cached: string[] | null = null;

/** Lista calculada no servidor para que a renderização no cliente use a mesma lista. */
export function timeZoneList(current?: string): string[] {
  cached ??= Intl.supportedValuesOf("timeZone");
  return current && !cached.includes(current) ? [current, ...cached] : cached;
}
