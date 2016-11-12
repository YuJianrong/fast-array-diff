import lcs from "./lcs";

export default function <T>(
  a: T[], b: T[],
  compareFunc: ((ia: T, ib: T) => boolean) = ((ia: T, ib: T) => ia === ib)): T[] {
  let ret: T[] = [];
  lcs(
    a, 0, a.length, b, 0, b.length, compareFunc,
    () => 0,
    () => 0,
    (arr, start, end) => {
      for (let i = start; i < end; ++i) {
        ret.push(arr[i]);
      }
    }
  );
  return ret;
};
