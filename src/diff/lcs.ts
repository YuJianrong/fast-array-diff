export default function lcs<T>(
  a: T[], aStart: number, aEnd: number,
  b: T[], bStart: number, bEnd: number,
  compareFunc: (a: T, b: T) => boolean,
  elementsChanged: (type: "add" | "remove" | "same",
                    a: T[], aStart: number, aEnd: number,
                    b: T[], bStart: number, bEnd: number
                   ) => void
): void {
  // console.log(`${a.slice(aStart, aEnd).join("")} - ${b.slice(bStart, bEnd).join("")}`)
  const M = aEnd - aStart, N = bEnd - bStart;
  if (M === 0 || N === 0) {
    if (M !== 0) {
      elementsChanged("remove", a, aStart, aEnd, b, bStart, bEnd);
    } else if (N !== 0) {
      elementsChanged("add", a, aStart, aEnd, b, bStart, bEnd);
    }
    return;
  }
  //  else if (M === 1 && N === 1) {
  //   if (M === 1) {
  //     for (let i = bStart; i < bEnd; ++i) {
  //       if (compareFunc(b[i], a[aStart])) {
  //         bStart !== i && elementsChanged("add", a, aStart, aStart, b, bStart, i);
  //         elementsChanged("same", a, aStart, aEnd, b, i, i + 1);
  //         i + 1 !== bEnd && elementsChanged("add", a, aEnd, aEnd, b, i + 1, bEnd);
  //         return;
  //       }
  //     }
  //   }
  //   if (N === 1) {
  //     for (let i = aStart; i < aEnd; ++i) {
  //       if (compareFunc(a[i], b[bStart])) {
  //         aStart !== i && elementsChanged("remove", a, aStart, i, b, bStart, bStart);
  //         elementsChanged("same", a, i, i + 1, b, bStart, bEnd);
  //         i + 1 !== bEnd && elementsChanged("remove", a, i + 1, aEnd, b, bEnd, bEnd);
  //         return;
  //       }
  //     }
  //   }
  //   elementsChanged("remove", a, aStart, aEnd, b, bStart, bStart);
  //   elementsChanged("add", a, aEnd, aEnd, b, bStart, bEnd);
  //   return;
  // }

  const EVEN = (M + N) % 2 === 0, MAX = Math.ceil((M + N) / 2), K2START = M - N;

  interface LongestPosition {
    [index: number]: number;
  }
  let v1: LongestPosition = { 1: 0 }, v2: LongestPosition = { [K2START - 1]: M };

  for (let d = 0; d <= MAX; ++d) {
    for (let k = -d; k <= d; k += 2) {
      let x: number, deltaX = 0;
      if (k === -d || k !== d && v1[k - 1] + 1 < v1[k + 1]) {
        x = v1[k + 1];
      } else {
        x = v1[k - 1] + 1;
        deltaX = 1;
      }
      let y = x - k;
      // check if reach v2
      if (!EVEN && x >= v2[k]) {

        if (d === 1 && x === M && y === N) {
          x -= deltaX;
          y -= 1 - deltaX;
        }

        lcs(a, aStart, aStart + x, b, bStart, bStart + y, compareFunc, elementsChanged);
        lcs(a, aStart + x, aEnd, b, bStart + y, bEnd, compareFunc, elementsChanged);
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
      if (k === K2START + d || v2[k - 1] < v2[k + 1] - 1 && k !== K2START - d) {
        x = v2[k - 1];
      } else {
        x = v2[k + 1] - 1;
      }

      let y = x - k;
      // check
      if (EVEN && x <= v1[k]) {
        if (d === 0) {
          elementsChanged("same", a, aStart, aEnd, b, bStart, bEnd);
        } else {

          while (x < M && y < N && compareFunc(a[aStart + x], b[bStart + y])) {
            x++;
            y++;
          }
          lcs(a, aStart, aStart + x, b, bStart, bStart + y, compareFunc, elementsChanged);
          lcs(a, aStart + x, aEnd, b, bStart + y, bEnd, compareFunc, elementsChanged);
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
