import bestSubSequence from './lcs';

export interface DiffData<T, U = T> {
  removed: T[];
  added: U[];
}

export function diff<T, U = T>(
  a: T[],
  b: U[],
  compareFunc: (ia: T, ib: U) => boolean = (ia: T, ib: U) => ia === (ib as unknown as T),
): DiffData<T, U> {
  const ret: DiffData<T, U> = {
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
