import bestSubSequence from './lcs';

export default function <T, U = T>(
  a: T[],
  b: U[],
  compareFunc: (ia: T, ib: U) => boolean = (ia: T, ib: U) => ia === (ib as unknown as T),
): T[] {
  const ret: T[] = [];
  bestSubSequence(a, b, compareFunc, (type, oldArr, oldStart, oldEnd) => {
    if (type === 'same') {
      for (let i = oldStart; i < oldEnd; ++i) {
        ret.push(oldArr[i]);
      }
    }
  });
  return ret;
}
