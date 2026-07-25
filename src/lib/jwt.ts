/**
 * Decodes a JWT token (without verification) and returns the payload claims.
 * Used purely for reading claims like userId from the stored access token.
 */
export function decodeJwt(token: string): Record<string, unknown> {
  try {
    const base64Payload = token.split('.')[1];
    if (!base64Payload) return {};
    const json = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Returns the userId UUID claim from the stored JWT, or null if not available. */
export function getCurrentUserId(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const claims = decodeJwt(token);
  return (claims['userId'] as string) ?? null;
}
