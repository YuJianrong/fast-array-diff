import * as diff from "../diff/diff";
import * as assert from "assert";

/**
 * Test for diff function
 */
describe("Diff", () => {
  it("Array should not modified by function", () => {
    let a: number[] = [1, 2, 3], b: number[] = [2, 3, 4];
    diff.diff(a, b);
    assert.deepStrictEqual(a, [1, 2, 3], "input array changed!");
    assert.deepStrictEqual(b, [2, 3, 4], "input array changed!");
  });

  it("Functional test", () => {
    function diff_str(a: string, b: string, added: string, removed: string) {
      assert.deepStrictEqual(
        diff.diff(a.split(""), b.split("")),
        {
          added: added.split(""),
          removed: removed.split(""),
        }
      );
    }

    diff_str("", "", "", "");
    diff_str("a", "", "", "a");
    diff_str("", "b", "b", "");
    diff_str("abc", "abc", "", "");
    diff_str("abcd", "obce", "oe", "ad");
    diff_str("abc", "ab", "", "c");
    diff_str("cab", "ab", "", "c");
    diff_str("abc", "bc", "", "a");
    diff_str("abcde", "zbodf", "zof", "ace");
    diff_str("bcd", "bod", "o", "c");
    diff_str("aa", "aaaa", "aa", "");
    diff_str("aaaa", "aa", "", "aa");
    diff_str("TGGT", "GG", "", "TT");
    diff_str(
      "GTCGTTCGGAATGCCGTTGCTCTGTAAA", "ACCGGTCGAGTGCGCGGAAGCCGGCCGAA",
      "ACCGAGGCG", "TTTTTTTA");
    diff_str(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "ABCDEFGHIJKL12345678901234567890MNOPQRSTUVWXYZ",
      "12345678901234567890", "");

  });

});