var testExreg = require('./testExreg');
describe("exreg handles regex groups", function () {
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
