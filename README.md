# exreg
A module to generate strings to match regular expressions

## Creating Strings for regular expressions

While it's easy to create a regular expression to match a string, doing the opposite can be quite challenging.

This module will take a regular expression and generate a string that is guaranteed to be matched by that regular expression.
In version 1.x.x, a regular expression will always result in the same string and it will be the simplest string that
will match it. `\d` will always result in a `0`; `\b` will always result in an `a`.
In version 2.x.x, I'll add support for more varied matching strings.

## What regex features are supported?

The latest support can be found by running `npm test` in this project. The specs will be listed as the tests pass.

However, for convenience, I'll list what's currently supported here:

* The `.` character
* Normal characters
* The `|` character
* Standard character classes
* Inclusive character classes of the form `[...]`
* Quantifiers
* Groups (capturing and non-capturing)
* Special characters

Not currently supported:

* Lookaheads
* Captured Group references
* Word boundaries
* Start/end of string matchers
* Exclusive character classes of the form `[^...]`

## Bug reporting
If you find a regex such that the generated string is not a match please [open an issue](https://github.com/dancrumb/exreg/issues/new)
and include the failing regex.

## Contributing
Any code that you'd like to contribute (and I'd be very appreciative of it) should be submitted
via a Pull Request. There should be tests to support your change and they should pass.


## Releasing a new version

Do the following:

* Make sure you're on develop and that you're in sync with the git repo
* `npm version`
* `git push`
* Create a PR into the `master` branch of `exreg`
* Once this PR is approved and merged, the new version will be published