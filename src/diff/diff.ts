
import lcs from "./lcs";

export interface DiffData<T> {
  removed: T[];
  added: T[];
}

export function diff<T>(
  a: T[], b: T[],
  compareFunc: ((ia: T, ib: T) => boolean) = ((ia: T, ib: T) => ia === ib)
): DiffData<T> {
  let ret: DiffData<T> = {
    removed: [],
    added: [],
  };
  lcs(
    a, 0, a.length, b, 0, b.length, compareFunc,
    (arr, start, end) => {
      for (let i = start; i < end; ++i) {
        ret.added.push(arr[i]);
      }
    },
    (arr, start, end) => {
      for (let i = start; i < end; ++i) {
        ret.removed.push(arr[i]);
      }
    }
  );
  return ret;

}
