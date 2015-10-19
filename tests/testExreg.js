var exreg = require('../src');
var expect = require('chai').expect;
module.exports = function (regex) {
    "use strict";
    expect(exreg(regex)).to.match(new RegExp('^(' + regex.source + ')$'));
};