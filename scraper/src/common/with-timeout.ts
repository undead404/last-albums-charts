export default function withTimeout<T1 extends unknown[], T2>(
  callback: (...arguments_: T1) => Promise<T2>,
  timeoutMs: number,
): (...arguments_: T1) => Promise<T2> {
  return (...arguments_: T1) =>
    Promise.race([
      callback(...arguments_),
      new Promise<T2>((resolve, reject) => {
        setTimeout(() => {
          reject(new Error(`Timeout after ${timeoutMs} ms`));
        }, timeoutMs);
      }),
    ]);
}
