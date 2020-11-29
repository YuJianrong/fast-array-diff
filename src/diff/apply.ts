import * as patch from './patch';

export type ApplyItem<T> =
  | patch.PatchItem<T>
  | {
      type: 'remove';
      oldPos: number;
      newPos: number;
      length: number;
    };

export type Apply<T> = ApplyItem<T>[];

export function applyPatch<T>(a: T[], patch: Apply<T>): T[] {
  const segments: T[][] = [];

  let sameStart = 0;

  for (let i = 0; i < patch.length; ++i) {
    const patchItem = patch[i];
    sameStart !== patchItem.oldPos && segments.push(a.slice(sameStart, patchItem.oldPos));
    if (patchItem.type === 'add') {
      segments.push(patchItem.items);
      sameStart = patchItem.oldPos;
    } else if ((<patch.PatchItem<T>>patchItem).items) {
      sameStart = patchItem.oldPos + (<patch.PatchItem<T>>patchItem).items.length;
    } else {
      sameStart = patchItem.oldPos + (<{ length: number }>patchItem).length;
    }
  }
  sameStart !== a.length && segments.push(a.slice(sameStart));

  return ([] as T[]).concat(...segments);
}
