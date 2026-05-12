/**
 * Helpers for surfacing backend API messages in toasts/alerts.
 *
 * DRF error shapes vary — these helpers normalise them so call sites
 * don't all reinvent the same extraction logic.
 *
 * - {"detail": "..."}              → top-level error string
 * - {"message": "..."}             → top-level success/error string
 * - {"error": [...]} | "..."       → custom error field
 * - {"non_field_errors": [...]}    → DRF top-level validation array
 * - {"email": ["..."], "password": ["..."]} → per-field validation arrays
 */

type AnyObj = Record<string, unknown>;

function isStr(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function firstNonEmpty(arr: unknown): string | null {
  if (!Array.isArray(arr)) return null;
  for (const v of arr) {
    if (isStr(v)) return v;
  }
  return null;
}

/** Extract a human-readable message from an RTK Query / fetch error. */
export function formatApiError(err: unknown, fallback = "Something went wrong"): string {
  if (!err) return fallback;

  // RTK Query mutation error: { status, data: ... }
  // Pure fetch error / plain object: just the body.
  const data =
    typeof err === "object" && err !== null && "data" in err
      ? (err as { data: unknown }).data
      : err;

  if (isStr(data)) return data;
  if (!data || typeof data !== "object") return fallback;

  const body = data as AnyObj;

  // Common top-level shapes
  if (isStr(body.detail)) return body.detail as string;
  if (isStr(body.message)) return body.message as string;
  if (isStr(body.error)) return body.error as string;

  // DRF top-level non_field_errors array
  const nonField = firstNonEmpty(body.non_field_errors);
  if (nonField) return nonField;

  // Per-field validation errors — return the first non-empty array's first element.
  for (const value of Object.values(body)) {
    const first = firstNonEmpty(value);
    if (first) return first;
  }

  return fallback;
}

/**
 * Pick a backend-supplied success message off a mutation/query response,
 * falling back to a sensible default if none is present.
 */
export function formatApiMessage(resp: unknown, fallback: string): string {
  if (!resp || typeof resp !== "object") return fallback;
  const body = resp as AnyObj;
  if (isStr(body.message)) return body.message as string;
  if (isStr(body.detail)) return body.detail as string;
  return fallback;
}
