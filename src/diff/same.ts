import bestSubSequence from './lcs';

export default function <T>(
  a: T[],
  b: T[],
  compareFunc: (ia: T, ib: T) => boolean = (ia: T, ib: T) => ia === ib,
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
