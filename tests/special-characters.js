var _ = require('lodash');
var expect = require('chai').expect;
var exreg = require('../src');
var testExreg = require('./testExreg');

describe("exreg handles special characters", function () {
    "use strict";
    it('recognises octal codes', function () {
        testExreg(/\123/);
        testExreg(/\0ab/);
        testExreg(/\09b/);
        testExreg(/\129/);
        testExreg(/\192/);
    });
    it('recognises hexadecimal codes', function () {
        testExreg(/\x23/);
        testExreg(/\xab/);
        testExreg(/\x9b/);
        testExreg(/\x29/);
        testExreg(/\x00/);
        expect(_.bind(exreg, null, /\xgg/)).to.throw.Error;
        expect(_.bind(exreg, null, /\x1/)).to.throw.Error;
        expect(_.bind(exreg, null, /\x1g/)).to.throw.Error;
    });
    it('recognises unicode codes', function () {
        testExreg(/\u0023/);
        testExreg(/\uaabb/);
        testExreg(/\u1234/);
        testExreg(/\u0000/);
        expect(_.bind(exreg, null, /\uab/)).to.throw.Error;
        expect(_.bind(exreg, null, /\u3q4d/)).to.throw.Error;
        expect(_.bind(exreg, null, /\ugggg/)).to.throw.Error;
    });
    it('recognises newline characters', function () {
        testExreg(/\n/);
    });
    it('recognises NULL characters', function () {
        testExreg(/\0/);
    });
    it('recognises carriage return characters', function () {
        testExreg(/\r/);
    });
    it('recognises tab characters', function () {
        testExreg(/\t/);
    });
});
