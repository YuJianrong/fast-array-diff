function lcs<T, U = T>(a: T[], b: U[], compareFunc: (a: T, b: U) => boolean): number {
  const M = a.length,
    N = b.length;
  const MAX = M + N;

  interface LongestPosition {
    [index: number]: number;
  }
  const v: LongestPosition = { 1: 0 };

  for (let d = 0; d <= MAX; ++d) {
    for (let k = -d; k <= d; k += 2) {
      let x: number;
      if (k === -d || (k !== d && v[k - 1] + 1 < v[k + 1])) {
        x = v[k + 1];
      } else {
        x = v[k - 1] + 1;
      }
      let y = x - k;
      while (x < M && y < N && compareFunc(a[x], b[y])) {
        x++;
        y++;
      }
      if (x === M && y === N) {
        return d;
      }
      v[k] = x;
    }
  }
  /* istanbul ignore next */
  return -1; // never reach
}

enum Direct {
  none = 0,
  horizontal = 1,
  vertical = 1 << 1,
  diagonal = 1 << 2,
  all = horizontal | vertical | diagonal,
}

function getSolution<T, U = T>(
  a: T[],
  aStart: number,
  aEnd: number,
  b: U[],
  bStart: number,
  bEnd: number,
  d: number,
  startDirect: Direct,
  endDirect: Direct,
  compareFunc: (a: T, b: U) => boolean,
  elementsChanged: (
    type: 'add' | 'remove' | 'same',
    a: T[],
    aStart: number,
    aEnd: number,
    b: U[],
    bStart: number,
    bEnd: number,
  ) => void,
): void {
  if (d === 0) {
    elementsChanged('same', a, aStart, aEnd, b, bStart, bEnd);
    return;
  } else if (d === aEnd - aStart + (bEnd - bStart)) {
    const removeFirst =
      (startDirect & Direct.horizontal ? 1 : 0) + (endDirect & Direct.vertical ? 1 : 0);
    const addFirst =
      (startDirect & Direct.vertical ? 1 : 0) + (endDirect & Direct.horizontal ? 1 : 0);
    if (removeFirst >= addFirst) {
      if (aStart !== aEnd) {
        elementsChanged('remove', a, aStart, aEnd, b, bStart, bStart);
      }
      if (bStart !== bEnd) {
        elementsChanged('add', a, aEnd, aEnd, b, bStart, bEnd);
      }
    } else {
      if (bStart !== bEnd) {
        elementsChanged('add', a, aStart, aStart, b, bStart, bEnd);
      }
      if (aStart !== aEnd) {
        elementsChanged('remove', a, aStart, aEnd, b, bEnd, bEnd);
      }
    }
    return;
  }

  const M = aEnd - aStart;
  const N = bEnd - bStart;
  let HALF = Math.floor(N / 2);

  interface PointInfo {
    d: number;
    segments: number;
    direct: Direct;
  }

  interface PointInfoMap {
    [index: number]: PointInfo;
  }

  let now: PointInfoMap = {};
  for (let k = -d - 1; k <= d + 1; ++k) {
    now[k] = { d: Infinity, segments: 0, direct: Direct.none };
  }
  let preview: PointInfoMap = {
    [-d - 1]: { d: Infinity, segments: 0, direct: Direct.none },
    [d + 1]: { d: Infinity, segments: 0, direct: Direct.none },
  };

  for (let y = 0; y <= HALF; ++y) {
    [now, preview] = [preview, now];
    for (let k = -d; k <= d; ++k) {
      const x = y + k;

      if (y === 0 && x === 0) {
        now[k] = {
          d: 0,
          segments: 0,
          direct: startDirect,
        };
        continue;
      }

      const currentPoints: PointInfo[] = [
        {
          direct: Direct.horizontal,
          d: now[k - 1].d + 1,
          segments: now[k - 1].segments + (now[k - 1].direct & Direct.horizontal ? 0 : 1),
        },
        {
          direct: Direct.vertical,
          d: preview[k + 1].d + 1,
          segments: preview[k + 1].segments + (preview[k + 1].direct & Direct.vertical ? 0 : 1),
        },
      ];

      if (x > 0 && x <= M && y > 0 && y <= N && compareFunc(a[aStart + x - 1], b[bStart + y - 1])) {
        currentPoints.push({
          direct: Direct.diagonal,
          d: preview[k].d,
          segments: preview[k].segments + (preview[k].direct & Direct.diagonal ? 0 : 1),
        });
      }

      const bestValue = currentPoints.reduce((best, info) => {
        if (best.d > info.d) {
          return info;
        } else if (best.d === info.d && best.segments > info.segments) {
          return info;
        }
        return best;
      });

      currentPoints.forEach((info) => {
        if (bestValue.d === info.d && bestValue.segments === info.segments) {
          bestValue.direct |= info.direct;
        }
      });
      now[k] = bestValue;
    }
  }

  let now2: PointInfoMap = {};
  for (let k = -d - 1; k <= d + 1; ++k) {
    now2[k] = { d: Infinity, segments: 0, direct: Direct.none };
  }
  let preview2: PointInfoMap = {
    [-d - 1]: { d: Infinity, segments: 0, direct: Direct.none },
    [d + 1]: { d: Infinity, segments: 0, direct: Direct.none },
  };

  for (let y = N; y >= HALF; --y) {
    [now2, preview2] = [preview2, now2];
    for (let k = d; k >= -d; --k) {
      const x = y + k;

      if (y === N && x === M) {
        now2[k] = {
          d: 0,
          segments: 0,
          direct: endDirect,
        };
        continue;
      }

      const currentPoints: PointInfo[] = [
        {
          direct: Direct.horizontal,
          d: now2[k + 1].d + 1,
          segments: now2[k + 1].segments + (now2[k + 1].direct & Direct.horizontal ? 0 : 1),
        },
        {
          direct: Direct.vertical,
          d: preview2[k - 1].d + 1,
          segments: preview2[k - 1].segments + (preview2[k - 1].direct & Direct.vertical ? 0 : 1),
        },
      ];

      if (x >= 0 && x < M && y >= 0 && y < N && compareFunc(a[aStart + x], b[bStart + y])) {
        currentPoints.push({
          direct: Direct.diagonal,
          d: preview2[k].d,
          segments: preview2[k].segments + (preview2[k].direct & Direct.diagonal ? 0 : 1),
        });
      }

      const bestValue = currentPoints.reduce((best, info) => {
        if (best.d > info.d) {
          return info;
        } else if (best.d === info.d && best.segments > info.segments) {
          return info;
        }
        return best;
      });

      currentPoints.forEach((info) => {
        if (bestValue.d === info.d && bestValue.segments === info.segments) {
          bestValue.direct |= info.direct;
        }
      });
      now2[k] = bestValue;
    }
  }
  const best = {
    k: -1,
    d: Infinity,
    segments: 0,
    direct: Direct.none,
  };

  for (let k = -d; k <= d; ++k) {
    const dSum = now[k].d + now2[k].d;
    if (dSum < best.d) {
      best.k = k;
      best.d = dSum;
      best.segments =
        now[k].segments + now2[k].segments + (now[k].segments & now2[k].segments ? 0 : 1);
      best.direct = now2[k].direct;
    } else if (dSum === best.d) {
      const segments =
        now[k].segments + now2[k].segments + (now[k].segments & now2[k].segments ? 0 : 1);
      if (segments < best.segments) {
        best.k = k;
        best.d = dSum;
        best.segments = segments;
        best.direct = now2[k].direct;
      } else if (
        segments === best.segments &&
        !(best.direct & Direct.diagonal) &&
        now2[k].direct & Direct.diagonal
      ) {
        best.k = k;
        best.d = dSum;
        best.segments = segments;
        best.direct = now2[k].direct;
      }
    }
  }

  if (HALF + best.k === 0 && HALF === 0) {
    HALF++;
    now[best.k].direct = now2[best.k].direct;
    now2[best.k].direct = preview2[best.k].direct;
  }

  getSolution(
    a,
    aStart,
    aStart + HALF + best.k,
    b,
    bStart,
    bStart + HALF,
    now[best.k].d,
    startDirect,
    now2[best.k].direct,
    compareFunc,
    elementsChanged,
  );
  getSolution(
    a,
    aStart + HALF + best.k,
    aEnd,
    b,
    bStart + HALF,
    bEnd,
    now2[best.k].d,
    now[best.k].direct,
    endDirect,
    compareFunc,
    elementsChanged,
  );
}

export default function bestSubSequence<T, U = T>(
  a: T[],
  b: U[],
  compareFunc: (a: T, b: U) => boolean,
  elementsChanged: (
    type: 'add' | 'remove' | 'same',
    a: T[],
    aStart: number,
    aEnd: number,
    b: U[],
    bStart: number,
    bEnd: number,
  ) => void,
): void {
  const d = lcs(a, b, compareFunc);
  getSolution(
    a,
    0,
    a.length,
    b,
    0,
    b.length,
    d,
    Direct.diagonal,
    Direct.all,
    compareFunc,
    elementsChanged,
  );
}
