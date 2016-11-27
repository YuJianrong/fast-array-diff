
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
    (type, oldArr, oldStart, oldEnd, newArr, newStart, newEnd) => {
      if (type === "add") {
      for (let i = newStart; i < newEnd; ++i) {
        ret.added.push(newArr[i]);
      }
      } else if (type === "remove") {
      for (let i = oldStart; i < oldEnd; ++i) {
        ret.removed.push(oldArr[i]);
      }
      }
    }
    // (arr, start, end) => {
  );
  return ret;

}
