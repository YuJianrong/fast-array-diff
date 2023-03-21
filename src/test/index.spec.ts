import * as diff from '../index';
import * as assert from 'assert';

/**
 * Test for index interface
 */
describe('Index', () => {
  it('same function in index', () => {
    assert.deepStrictEqual(diff.same([1, 2, 3], [2, 3, 4]), [2, 3]);
  });

  it('bestSubSequence function in index', () => {
    const changes: (
      | { type: 'same' | 'remove'; values: number[] }
      | { type: 'add'; values: string[] }
    )[] = [];

    diff.bestSubSequence(
      [1, 2, 3],
      ['2', '3', '4'],
      (l, r) => {
        assert.equal(typeof l, 'number');
        assert.equal(typeof r, 'string');

        return l.toString() === r;
      },
      (type, a, aStart, aEnd, b, bStart, bEnd) => {
        assert.equal(typeof a[0], 'number');
        assert.equal(typeof b[0], 'string');

        if (type === 'add') {
          changes.push({ type, values: b.slice(bStart, bEnd) });
        } else {
          changes.push({ type, values: a.slice(aStart, aEnd) });
        }
      },
    );

    assert.deepStrictEqual(changes, [
      { type: 'remove', values: [1] },
      { type: 'same', values: [2] },
      { type: 'same', values: [3] },
      { type: 'add', values: ['4'] },
    ]);
  });

  it('diff data and function in index', () => {
    const result: diff.DiffData<number> = {
      added: [1, 2],
      removed: [3, 4],
    };
    assert.deepStrictEqual(diff.diff([3, 4, 5, 6], [1, 2, 5, 6]), result);
  });

  it('getPatch function in index', () => {
    assert.deepStrictEqual(diff.getPatch([1, 2, 3], [2, 3, 4]), [
      { type: 'remove', oldPos: 0, newPos: 0, items: [1] },
      { type: 'add', oldPos: 3, newPos: 2, items: [4] },
    ]);
  });

  it('applyPatch function in index', () => {
    assert.deepStrictEqual(
      diff.applyPatch(
        [1, 2, 3],
        [
          { type: 'remove', oldPos: 0, newPos: 0, items: [1] },
          { type: 'add', oldPos: 3, newPos: 2, items: [4] },
        ],
      ),
      [2, 3, 4],
    );
  });
});
