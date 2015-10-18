var _ = require('lodash');
var expect = require('chai').expect;
var exreg = require('../src');
var testExreg = function (regex) {
    "use strict";
    expect(exreg(regex)).to.match(new RegExp('^' + regex.source + '$'));
};
describe("exreg", function () {
    "use strict";
    it('recognises \\d character classes', function () {
        expect(exreg(/\d/)).to.match(/\d/);
        expect(exreg(/\d\d/)).to.match(/\d\d/);
        expect(exreg(/d\d/)).to.match(/d\d/);
        expect(exreg(/\dd/)).to.match(/\dd/);
        expect(exreg(/\\d/)).to.match(/\\d/);
    });
    it('recognises \\D character classes', function () {
        expect(exreg(/\D/)).to.match(/\D/);
        expect(exreg(/\D\D/)).to.match(/\D\D/);
        expect(exreg(/D\D/)).to.match(/D\D/);
        expect(exreg(/\DD/)).to.match(/\DD/);
        expect(exreg(/\\D/)).to.match(/\\D/);
    });
    it('recognises \\s character classes', function () {
        expect(exreg(/\s/)).to.match(/\s/);
        expect(exreg(/\s\s/)).to.match(/\s\s/);
        expect(exreg(/s\s/)).to.match(/s\s/);
        expect(exreg(/\ss/)).to.match(/\ss/);
        expect(exreg(/\\s/)).to.match(/\\s/);
    });
    it('recognises \\S character classes', function () {
        expect(exreg(/\S/)).to.match(/\S/);
        expect(exreg(/\S\S/)).to.match(/\S\S/);
        expect(exreg(/S\S/)).to.match(/S\S/);
        expect(exreg(/\SS/)).to.match(/\SS/);
        expect(exreg(/\\S/)).to.match(/\\S/);
    });
    it('recognises \\w character classes', function () {
        expect(exreg(/\w/)).to.match(/\w/);
        expect(exreg(/\w\w/)).to.match(/\w\w/);
        expect(exreg(/w\w/)).to.match(/w\w/);
        expect(exreg(/\ww/)).to.match(/\ww/);
        expect(exreg(/\\w/)).to.match(/\\w/);
    });
    it('recognises \\W character classes', function () {
        expect(exreg(/\W/)).to.match(/\W/);
        expect(exreg(/\W\W/)).to.match(/\W\W/);
        expect(exreg(/W\W/)).to.match(/W\W/);
        expect(exreg(/\WW/)).to.match(/\WW/);
        expect(exreg(/\\W/)).to.match(/\\W/);
    });
    it('recognises octal codes', function () {
        testExreg(/\123/);
        testExreg(/\0ab/);
        testExreg(/\09b/);
        testExreg(/\129/);
        testExreg(/\192/);
    });
    it('recognises inclusive character classes', function () {
        testExreg(/[a]/);
        testExreg(/[[]/);
        testExreg(/[c-f]/);
        testExreg(/[\]]/);
    });
    it.skip('recognises exclusive character classes', function () {
        testExreg(/[^a]/);
        testExreg(/[^[]/);
        testExreg(/[^c-f]/);
        testExreg(/[^\]]/);
    });
    it('throws an error if it is passed an empty character class since, in JavaScript, this matches nothing', function () {
        expect(_.bind(exreg, null, /[]/)).to.throw(Error);
    });
});
