const prefixCache = new Map();

export async function hashPasswordSha1(password) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Web Crypto API requires a secure HTTPS context.");
  }

  const buffer = new TextEncoder().encode(password);
  const hashBuffer = await globalThis.crypto.subtle.digest("SHA-1", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const fullHash = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  return {
    fullHash,
    prefix: fullHash.slice(0, 5),
    suffix: fullHash.slice(5),
  };
}

export async function checkBreach(password) {
  const { prefix, suffix } = await hashPasswordSha1(password);

  let dataText = prefixCache.get(prefix);
  if (dataText === undefined) {
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
    );
    if (!response.ok) {
      throw new Error(`HIBP request failed: ${response.status}`);
    }

    dataText = await response.text();
    if (dataText.trim() === "") {
      throw new Error("Empty response from HIBP");
    }

    prefixCache.set(prefix, dataText);
  }

  const lines = dataText.split(/\r?\n/);
  for (const line of lines) {
    const [lineSuffix, count] = line.split(":");
    if (lineSuffix && lineSuffix.trim() === suffix) {
      return Number.parseInt(count, 10);
    }
  }

  return 0;
}