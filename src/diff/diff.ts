import bestSubSequence from './lcs';

export interface DiffData<T> {
  removed: T[];
  added: T[];
}

export function diff<T>(
  a: T[],
  b: T[],
  compareFunc: (ia: T, ib: T) => boolean = (ia: T, ib: T) => ia === ib,
): DiffData<T> {
  const ret: DiffData<T> = {
    removed: [],
    added: [],
  };
  bestSubSequence(a, b, compareFunc, (type, oldArr, oldStart, oldEnd, newArr, newStart, newEnd) => {
    if (type === 'add') {
      for (let i = newStart; i < newEnd; ++i) {
        ret.added.push(newArr[i]);
      }
    } else if (type === 'remove') {
      for (let i = oldStart; i < oldEnd; ++i) {
        ret.removed.push(oldArr[i]);
      }
    }
  });
  return ret;
}
