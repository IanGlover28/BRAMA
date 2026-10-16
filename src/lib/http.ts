/**
 * Client helpers for calling our API routes. They never surface raw parser or
 * network errors (e.g. "Unexpected token '<'" when a route returns an HTML
 * page) - every failure becomes a sentence a customer can act on.
 */

type ApiBody = { error?: unknown; message?: unknown; [key: string]: unknown };

const STATUS_MESSAGES: Record<number, string> = {
  401: "Please sign in to continue.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  413: "That file is too large.",
  429: "Too many attempts. Please wait a moment and try again.",
};

const NETWORK_MESSAGE = "We can't reach BRAMA right now. Check your connection and try again.";
const SERVER_MESSAGE = "Something went wrong on our side. Please try again in a moment.";

/** Parses a JSON body, returning {} when the response isn't JSON. */
export async function readJson<T = ApiBody>(res: Response): Promise<T> {
  try {
    return (await res.json()) as T;
  } catch {
    return {} as T;
  }
}

/** Best message for a failed response: the API's own message, else one based on the status. */
export function errorMessage(res: Response, data: ApiBody, fallback: string): string {
  if (typeof data?.error === "string" && data.error) return data.error;
  if (typeof data?.message === "string" && data.message) return data.message;
  if (res.status >= 500) return SERVER_MESSAGE;
  return STATUS_MESSAGES[res.status] ?? fallback;
}

/** Reads the body and throws a friendly Error when the response failed. */
export async function parseResponse<T = ApiBody>(res: Response, fallback: string): Promise<T> {
  const data = await readJson<T>(res);
  if (!res.ok) throw new Error(errorMessage(res, data as ApiBody, fallback));
  return data;
}

/** Message to show for anything caught around a fetch - including network failures. */
export function friendlyError(err: unknown, fallback: string): string {
  // fetch() rejects with a TypeError ("Failed to fetch", "Load failed") when offline.
  if (err instanceof TypeError) return NETWORK_MESSAGE;
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
