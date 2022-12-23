import type { NextApiResponse } from "next";

export default async function retryAsync<T>(
  func: () => Promise<T>,
  res: NextApiResponse,
  retriesLeft = 5,
  interval = 100,
): Promise<T | NextApiResponse> {
  try {
    return await func();
  } catch (err) {
    if (retriesLeft === 0) {
      return res.status(403).end();
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
    return retryAsync(func, res, retriesLeft - 1, interval);
  }
}
