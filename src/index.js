var _ = require('lodash');

var basicResponse = function (response, remainder) {
    "use strict";
    return {
        candidateString: response,
        remainder: remainder
    };
};

var isNumericString = function (string) {
    "use strict";
    return _.isFinite(parseInt(string,10));
};

var isOctalDigit = function (string) {
    "use strict";
    return _.isFinite(parseInt(string,8));
};

var parseNDigitOctalString = function (length, list) {
    "use strict";
    //console.log("Octal: " + length + ", " + list);
    return basicResponse(
        String.fromCharCode(
            parseInt( _.slice(list,0,length).join(""), 8)
        ), _.slice(list,length))    ;
};

var createHexParser = function (length) {
    "use strict";
    return function (token, remainder) {
        var digitsToParse = _.slice(remainder, 0, length);
        if(digitsToParse.length !== length) {
            throw new Error("Not enough characters in hex string. Expected " + length + ", got " + digitsToParse.length);
        }
        var stringToParse = digitsToParse.join("").replace(/^0+(?!$)/, "");
        var string = String.fromCharCode(
            parseInt(stringToParse, 16)
        );
        if(parseInt(stringToParse, 16).toString(16) !== stringToParse) {
            throw new Error("Invalid characters in hexadecimal string: " + stringToParse);
        }
        if(string === "\0" && stringToParse !== "0") {
            throw new Error("Cannot generate a string for an invalid hex character class: " + stringToParse);
        } else {
            return basicResponse(
                string, _.slice(remainder,length))    ;
        }
    };
};

var parseOctal = function (token, remainder) {
    "use strict";
    if(!(isOctalDigit(remainder[0]))) {
        if(token === "0") {
            return basicResponse("\0", remainder);
        } else {
            return parseNDigitOctalString(1, [token].concat(remainder));
        }
    } if(!(isOctalDigit(remainder[1]))) {
        return parseNDigitOctalString(2, [token].concat(remainder));
    } else {

        return parseNDigitOctalString(3, [token].concat(remainder));
    }
};
var processControlCharacter = function (token, remainder) {
    "use strict";
    //console.log("Looking at cc token: ", token, remainder);
    var basicHandler = function(response) {
        return function (token, remainder) {
             return basicResponse(response, remainder);
        };
    };
    var ccHandler = {
        "d": basicHandler(0),
        "D": basicHandler('a'),
        "s": basicHandler(' '),
        "S": basicHandler('a'),
        "w": basicHandler('a'),
        "W": basicHandler('!'),
        "]": basicHandler(']'),
        "\\": basicHandler('\\'),
        "*": basicHandler('*'),
        "+": basicHandler('+'),
        "n": basicHandler('\n'),
        "r": basicHandler('\r'),
        "t": basicHandler('\t'),
        ".": basicHandler('.'),
        "x": createHexParser(2),
        "u": createHexParser(4)
    }[token];

    if(isNumericString(token) && token < 9) {
        ccHandler = parseOctal;
    }

    if(_.isUndefined(ccHandler)) {
        throw new Error("Unrecognized control character: " + token);
    }
    return ccHandler(token, remainder);
};

var charClassParser = function (token, remainder, validString) {
    "use strict";
    //console.log("parse class: ", token, remainder, validString);
    if(_.isUndefined(validString)) {
        validString = "";
    }

    if(token === "]") {
        if(_.isEmpty(validString)) {
            throw new Error("Character class did not lead to a valid string");
        }

        return basicResponse(validString, remainder);
    } else if (token === "\\") {
        var result = processControlCharacter(_.head(remainder), _.tail(remainder));
        return charClassParser(_.head(result.remainder), _.tail(result.remainder), result.candidateString);
    } else {
        validString = token;
        return charClassParser(_.head(remainder), _.tail(remainder), validString);
    }

};

var arrayToNumber = function (digitArray, defaultValue) {
    "use strict";
    if(_.isEmpty(digitArray)) {
        return defaultValue || Number.NaN;
    } else {
        return parseInt(digitArray.join(""), 10);
    }
};

var processQuantifier = function (token, remainder, string) {
    "use strict";
    var quantity = _.takeWhile(remainder, function(token) {
        return token !== "}";
    });
    var start = arrayToNumber(_.takeWhile(quantity, function(value) {
        return value !== ",";
    }));
    var end = arrayToNumber(_.takeRightWhile(quantity, function(value) {
        return value !== ",";
    }), start);

    //console.log(start, end);
    if(_.isNaN(start)) {
        throw new Error("Invalid quantifier: {" + quantity.join("") +"}");
    }

    var duplicated = _.times(start, function () {
        return string;
    });

    return basicResponse(duplicated.join(""), _.slice(remainder, quantity.length+1));
};

var processRegEx = function(candidateString, token, remainder) {
    "use strict";
    var result;
    //console.log("Processing: ", candidateString, token, remainder);
    if(token === "\\") {
        result = processControlCharacter(_.head(remainder), _.tail(remainder));
        candidateString.push(result.candidateString);
        remainder = result.remainder;
    } else if (token === "[") {
        result = charClassParser(_.head(remainder), _.tail(remainder));
        candidateString.push(result.candidateString);
        remainder = result.remainder;
    } else if(token === "|") {
        return candidateString.join("");
    } else if(token === "*") {

    } else if(token === "+") {

    } else if(token === "{") {
        var quantity = processQuantifier(token, remainder, candidateString.pop());
        candidateString.push(quantity.candidateString);
        remainder = quantity.remainder;

    } else {
        candidateString.push(token);
    }
    if(_.isEmpty(remainder)){
        return candidateString.join("");
    } else {
        return processRegEx(candidateString, _.head(remainder), _.tail(remainder));
    }

};

var parse = function (regexString) {
    "use strict";
    var regexTokens = regexString.split('');
    regexTokens.pop();
    regexTokens.shift();
    //console.log("evaluating: " + regexTokens);
    return processRegEx([], _.head(regexTokens), _.tail(regexTokens));
};

module.exports = function (regex) {
    "use strict";
    var regObj = new RegExp(regex);
    var regStr = regObj.toString();

    return parse(regStr);

};