# [1.1.0](https://github.com/YuJianrong/fast-array-diff/compare/v1.0.1...v1.1.0) (2023-03-21)


### Features

* expand types to allow differently typed arrays ([#156](https://github.com/YuJianrong/fast-array-diff/issues/156)) ([9da10de](https://github.com/YuJianrong/fast-array-diff/commit/9da10dedc86bcdc30b635c75473fd81f3ea6bf45))

- 1.0.1:

  - Fix for Security Vulnerability on dependencies

- 1.0.0:

  - Update Typescript to 4.x
  - Remove `browsersify`
  - Export both esm and commonjs packages

- 0.2.0:

  - Change the function `editScript` to `getPatch`
  - Add function `applyPatch`
  - Change the algorithm to get a better patch, but slower than the old implementation.

- 0.1.6:

  - Add `editScript` function
  - Fix a bug on lcs function which casue the solution not the best one.
