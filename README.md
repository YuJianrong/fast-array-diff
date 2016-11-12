array-diff
======================

```array-diff``` is a npm module to find the common and different parts of two array, it based on the solution of LCS (Longest common subsequence) problems, widely used in diff/patch of two arrays.

The algorithm of this module is based on the paper "An O(ND) Difference Algorithm and its Variations" by Eugene Myers, Algorithm Vol. 1 No. 2, 1986, pp. 251-266. The difference of this implementation to the implementation of npm module [diff](https://www.npmjs.com/package/diff) is: the space complexity of this implementation is O(N), while the implementation of ```diff``` is O(ND), so this implementation will cost less memory on large data sets. Note: although the time complexity of the implementations are both O(ND), this implementation run slower than the ```diff```.

Installation
---------------------

    TODO;


API
----------------------
* `same(arrayOld, arrayNew, compareFunc?)` - get the LCS of the two arrays.

     Return a list of the common subsequence. Like: ```[1,2,3]```

  Note: The parameter `compareFunc` is optional, `===` will be used if no compare function supplied.

* `diff(arrayOld, arrayNew, compareFunc?)` - get the difference the two array.

    Return an object of the difference. Like this:

```js
{
    removed: [1,2,3],
    added: [2,3,4]
}
```

Examples
----------------------

    TODO:

## License

This module is licensed under MIT.
