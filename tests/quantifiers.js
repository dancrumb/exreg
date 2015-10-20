var _ = require('lodash');
var expect = require('chai').expect;
var exreg = require('../src');
var testExreg = require('./testExreg');
describe("exreg handles regex quantifiers", function () {
    "use strict";
    it('recognises the * character', function () {
        testExreg(/a*/);
        testExreg(/a*b/);
        testExreg(/a*b*/);
        testExreg(/aa*b/);
    });
    it('treats \\* as a simple *', function() {
        testExreg(/\*/);
    });
    it('recognises the + character', function () {
        testExreg(/a+/);
        testExreg(/a+b/);
        testExreg(/a+b+/);
        testExreg(/aa+b/);
    });
    it('treats \\+ as a simple +', function() {
        testExreg(/\+/);
    });
    it('supports {x} quantifiers', function () {
        testExreg(/a{3}/);
        testExreg(/a{0}/);
        testExreg(/ab{2}/);
        testExreg(/.{2}/);
        testExreg(/\d{2}/);
        testExreg(/g|d{2}/);
    });
    it('supports {x,} quantifiers', function () {
        testExreg(/a{3,}/);
        testExreg(/a{0,}/);
        testExreg(/ab{2,}/);
        testExreg(/.{2,}/);
        testExreg(/\d{2,}/);
        testExreg(/g|d{2,}/);
    });
    it('supports {x,y} quantifiers', function () {
        testExreg(/a{3,5}/);
        testExreg(/a{0,3}/);
        testExreg(/ab{2,2}/);
        testExreg(/.{2,5}/);
        testExreg(/\d{2,2}/);
        testExreg(/g|d{2,3}/);
    });
    it('rejects {,x} quantifiers', function () {
        expect(_.bind(exreg, null, /a{,2}/)).to.throw(Error);
    });
});
