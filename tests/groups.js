var _ = require('lodash');
var expect = require('chai').expect;
var exreg = require('../src');
var testExreg = require('./testExreg');
describe("exreg handles regex quantifiers", function () {
    "use strict";
    it('recognises capturing groups bound by parantheses', function () {
        testExreg(/(a)/);
        testExreg(/(abc)/);
        testExreg(/a(a)a/);
    });
    it('recognises non-capturing groups bound by parantheses', function () {
        testExreg(/(?:a)/);
        testExreg(/(?:abc)/);
        testExreg(/a(?:a)a/);
    });
    it('recognises nested groups', function () {
        testExreg(/(a(b))/);
        testExreg(/(aa(bb))/);
        testExreg(/(a(b(c)))/);
        testExreg(/(((a)b)c)/);
    });
});
