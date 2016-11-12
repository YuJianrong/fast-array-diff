export default function lcs<T>(
  a: T[], aStart: number, aEnd: number,
  b: T[], bStart: number, bEnd: number,
  compareFunc: (a: T, b: T) => boolean,
  addElements: (arr: T[], start: number, end: number) => void,
  removeElements: (arr: T[], start: number, end: number) => void,
  sameElements: ((arr: T[], start: number, end: number) => void) = () => 0
): void {
  // console.log(`${a.slice(aStart, aEnd).join("")} - ${b.slice(bStart, bEnd).join("")}`)
  const M = aEnd - aStart, N = bEnd - bStart;
  if (M === 0 || N === 0) {
    if (M !== 0) {
      removeElements(a, aStart, aEnd);
    } else if (N !== 0) {
      addElements(b, bStart, bEnd);
    }
    return;
  } else if (M === 1) {
    for (let i = bStart; i < bEnd; ++i) {
      if (compareFunc(b[i], a[aStart])) {
        bStart !== i && addElements(b, bStart, i);
        sameElements(b, i, i + 1);
        i + 1 !== bEnd && addElements(b, i + 1, bEnd);
        return;
      }
    }
    removeElements(a, aStart, aEnd);
    addElements(b, bStart, bEnd);
    return;
  } else if (N === 1) {
    for (let i = aStart; i < aEnd; ++i) {
      if (compareFunc(a[i], b[bStart])) {
        aStart !== i && removeElements(a, aStart, i);
        sameElements(a, i, i + 1);
        i + 1 !== aEnd && removeElements(a, i + 1, aEnd);
        return;
      }
    }
    removeElements(a, aStart, aEnd);
    addElements(b, bStart, bEnd);
    return;
  }

  const EVEN = (M + N) % 2 === 0, MAX = Math.ceil((M + N) / 2), K2START = M - N;

  interface LongestPosition {
    [index: number]: number;
  }
  let v1: LongestPosition = { 1: 0 }, v2: LongestPosition = { [K2START - 1]: M };

  for (let d = 0; d <= MAX; ++d) {
    for (let k = -d; k <= d; k += 2) {
      let x: number, deltaX = 0;
      if (k === -d || k !== d && v1[k - 1] < v1[k + 1]) {
        x = v1[k + 1];
      } else {
        x = v1[k - 1] + 1;
        deltaX = 1;
      }
      let y = x - k;
      // check if reach v2
      if (!EVEN && x >= v2[k]) {
        // return [2*d -1];
        if (d === 1 && x === M && y === N) {
          x -= deltaX;
          y -= 1 - deltaX;
        }
        let u = x, v = y;
        while (u < M && v < N && compareFunc(a[aStart + u] , b[bStart + v])) {
          u++;
          v++;
        }
        lcs(a, aStart, aStart + x, b, bStart, bStart + y, compareFunc, addElements, removeElements, sameElements);
        sameElements(a, aStart + x, aStart + u);
        lcs(a, aStart + u, aEnd, b, bStart + v, bEnd, compareFunc, addElements, removeElements, sameElements);
        return;
      }
      // goto linked node
      while (x < M && y < N && compareFunc(a[aStart + x] , b[bStart + y])) {
        x++;
        y++;
      }
      v1[k] = x;
    }
    for (let k = K2START - d; k <= K2START + d; k += 2) {
      let x: number;
      if (k === K2START + d || v2[k - 1] > v2[k + 1] && k !== K2START - d) {
        x = v2[k - 1];
      } else {
        x = v2[k + 1] - 1;
      }

      let y = x - k;
      // check
      if (EVEN && x <= v1[k]) {
        // return [2*d];
        if (d === 0) {
          sameElements(a, aStart, aEnd);
        } else {
          let u = x, v = y;
          while (x > 0 && y > 0 && compareFunc(a[aStart + x - 1] , b[bStart + y - 1])) {
            x--;
            y--;
          }
          lcs(a, aStart, aStart + x, b, bStart, bStart + y, compareFunc, addElements, removeElements, sameElements);
          sameElements(a, aStart + x, aStart + u);
          lcs(a, aStart + u, aEnd, b, bStart + v, bEnd, compareFunc, addElements, removeElements, sameElements);
        }
        return;
      }
      // goto linked node
      while (x > 0 && y > 0 && compareFunc(a[aStart + x - 1] , b[bStart + y - 1])) {
        x--;
        y--;
      }
      v2[k] = x;
    }
  }
}
