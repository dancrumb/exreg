var _ = require('lodash');
var expect = require('chai').expect;
var testExreg = require('./testExreg');
describe("exreg handles regex basics", function () {
    "use strict";
    it('recognises the . character', function () {
        testExreg(/./);
        testExreg(/\./);
    });
    it('treats normal characters as normal characters', function () {
        testExreg(/a/);
        testExreg(/alphabetic/);
        testExreg(/8675309/);
    });
    it('supports the | character', function () {
        testExreg(/a|b/);
        testExreg(/bac|don/);
        testExreg(/|don/);
    });
});
