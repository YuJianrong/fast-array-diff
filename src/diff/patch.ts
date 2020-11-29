import bestSubSequence from './lcs';

export interface PatchItem<T> {
  type: 'add' | 'remove';
  oldPos: number;
  newPos: number;
  items: T[];
}

export type Patch<T> = PatchItem<T>[];

export function getPatch<T>(
  a: T[],
  b: T[],
  compareFunc: (ia: T, ib: T) => boolean = (ia: T, ib: T) => ia === ib,
): Patch<T> {
  const patch: Patch<T> = [];
  let lastAdd: PatchItem<T> | null = null;
  let lastRemove: PatchItem<T> | null = null;

  function pushChange(
    type: 'add' | 'remove' | 'same',
    oldArr: T[],
    oldStart: number,
    oldEnd: number,
    newArr: T[],
    newStart: number,
    newEnd: number,
  ) {
    if (type === 'same') {
      if (lastRemove) {
        patch.push(lastRemove);
      }
      if (lastAdd) {
        patch.push(lastAdd);
      }
      lastRemove = null;
      lastAdd = null;
    } else if (type === 'remove') {
      if (!lastRemove) {
        lastRemove = {
          type: 'remove',
          oldPos: oldStart as number,
          newPos: newStart as number,
          items: [],
        };
      }
      for (let i = oldStart; i < oldEnd; ++i) {
        lastRemove.items.push(oldArr[i]);
      }
      if (lastAdd) {
        lastAdd.oldPos += oldEnd - oldStart;
        if (lastRemove.oldPos === oldStart) {
          lastRemove.newPos -= oldEnd - oldStart;
        }
      }
    } else if (type === 'add') {
      if (!lastAdd) {
        lastAdd = {
          type: 'add',
          oldPos: oldStart,
          newPos: newStart,
          items: [],
        };
      }
      for (let i = newStart; i < newEnd; ++i) {
        lastAdd.items.push(newArr[i]);
      }
    }
  }

  bestSubSequence(a, b, compareFunc, pushChange);

  pushChange('same', [], 0, 0, [], 0, 0);

  return patch;
}
