
import lcs from "./lcs";

export interface EditItem<T> {
  type: "add" | "remove";
  oldPos: number;
  newPos: number;
  items: T[];
}

export type EditScript<T> = EditItem<T>[];

export function editScript<T>(
  a: T[], b: T[],
  compareFunc: ((ia: T, ib: T) => boolean) = ((ia: T, ib: T) => ia === ib)): EditScript<T> {
  let editScript: EditScript<T> = [];
  let lastAdd: EditItem<T> | null = null;
  let lastRemove: EditItem<T> | null = null;

  function pushChange(
    type: "add" | "remove" | "same",
    oldArr: T[], oldStart: number, oldEnd: number,
    newArr: T[], newStart: number, newEnd: number) {
    if (type === "same") {
      if (lastRemove) {
        editScript.push(lastRemove);
      }
      if (lastAdd) {
        editScript.push(lastAdd);
      }
      lastRemove = null;
      lastAdd = null;
    } else if (type === "remove") {
      if (!lastRemove) {
        lastRemove = {
          type: "remove",
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
    } else if (type === "add") {
      if (!lastAdd) {
        lastAdd = {
          type: "add",
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

  lcs(a, 0, a.length, b, 0, b.length, compareFunc, pushChange);

  pushChange("same", [], 0, 0, [], 0, 0);

  return editScript;
}
