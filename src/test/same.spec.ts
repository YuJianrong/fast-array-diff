import same from "../diff/same";
import * as assert from "assert";

/**
 * Test for same function
 */
describe("Same", () => {
  it("Array not modified by function", () => {
    let a: number[] = [1, 2, 3], b: number[] = [2, 3, 4];
    same(a, b);
    assert.deepStrictEqual(a, [1, 2, 3], "input array changed!");
    assert.deepStrictEqual(b, [2, 3, 4], "input array changed!");
  });

  it("Different Type Check", () => {
    assert.deepStrictEqual(same([1, 2, 3], [2, 3, 4]), [2, 3]);
    assert.deepStrictEqual(same(["1", "2", "3"], ["2", "3", "4"]), ["2", "3"]);
    assert.deepStrictEqual(same([true, false], [false, false]), [false]);
  });

  it("Functional Check", () => {
    function same_str(a: string, b: string): string {
      return same(a.split(""), b.split("")).join("");
    }
    assert.deepStrictEqual(same_str("", ""), "");
    assert.deepStrictEqual(same_str("a", ""), "");
    assert.deepStrictEqual(same_str("", "b"), "");
    assert.deepStrictEqual(same_str("abc", "abc"), "abc");
    assert.deepStrictEqual(same_str("abcd", "obce"), "bc");
    assert.deepStrictEqual(same_str("abc", "ab"), "ab");
    assert.deepStrictEqual(same_str("cab", "ab"), "ab");
    assert.deepStrictEqual(same_str("abc", "bc"), "bc");
    assert.deepStrictEqual(same_str("abcde", "zbodf"), "bd");
    assert.deepStrictEqual(same_str("bcd", "bod"), "bd");
    assert.deepStrictEqual(same_str("aa", "aaaa"), "aa");
    assert.deepStrictEqual(same_str("aaaa", "aa"), "aa");
    assert.deepStrictEqual(same_str("TGGT", "GG"), "GG");
    assert.deepStrictEqual(same_str("GTCGTTCGGAATGCCGTTGCTCTGTAAA", "ACCGGTCGAGTGCGCGGAAGCCGGCCGAA"),
     "GTCGTCGGAAGCCGGCCGAA");
    assert.deepStrictEqual(same_str("ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "ABCDEFGHIJKL12345678901234567890MNOPQRSTUVWXYZ"), "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  });

  it("Customize compare function", () => {
    interface CustomObj {
      name: string;
      age: number;
    }
    function compare(a: CustomObj, b: CustomObj) {
      return a.name === b.name && a.age === b.age;
    }
    let a: CustomObj[] = [{name: "Mike", age: 10}, {name: "Apple", age: 13}, {name: "Jack", age: 15}],
      b: CustomObj[] = [{name: "Apple", age: 13}, {name: "Mimi", age: 0}, {name: "Jack", age: 15}],
      result: CustomObj[] = [{name: "Apple", age: 13}, {name: "Jack", age: 15}];

    assert.deepStrictEqual(same(a, b, compare), result);
  });

});
