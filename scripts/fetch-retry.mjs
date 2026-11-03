// fetch() with a per-attempt timeout and retries, so a transient network blip
// (ETIMEDOUT, ECONNRESET) or a Spotify 429/5xx doesn't fail the whole workflow run.
export async function fetchRetry(url, options = {}, { attempts = 4, timeoutMs = 15000 } = {}) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, { ...options, signal: AbortSignal.timeout(timeoutMs) });
      if ((response.status === 429 || response.status >= 500) && attempt < attempts) {
        const retryAfter = Number(response.headers.get('retry-after'));
        await wait(retryAfter > 0 ? retryAfter * 1000 : backoff(attempt));
        continue;
      }
      return response;
    } catch (error) {
      if (attempt >= attempts) throw error;
      console.warn(`fetch ${new URL(url).host} failed (attempt ${attempt}/${attempts}): ${error.cause?.code || error.name}`);
      await wait(backoff(attempt));
    }
  }
}

const backoff = (attempt) => 2000 * 2 ** (attempt - 1);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
