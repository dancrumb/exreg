var _ = require('lodash');

var basicResponse = function (response, remainder) {
    "use strict";
    return {
        candidateString: response,
        remainder: remainder
    };
};

var processControlCharacter = function (token, remainder) {
    "use strict";
    //console.log("Looking at cc token: ", token, remainder);
    var ccHandler = {
        "d": function(token, remainder) { return basicResponse(0, remainder); },
        "D": function(token, remainder) { return basicResponse('a', remainder); },
        "s": function(token, remainder) { return basicResponse(' ', remainder); },
        "S": function(token, remainder) { return basicResponse('a', remainder); },
        "w": function(token, remainder) { return basicResponse('a', remainder); },
        "W": function(token, remainder) { return basicResponse('!', remainder); },
        "]": function(token, remainder) { return basicResponse(']', remainder); },
        "\\": function (token, remainder) { return basicResponse("\\", remainder);}
    }[token];

    if(_.isUndefined(ccHandler)) {
        throw new Error("Unrecognized control character: " + token);
    }
    return ccHandler(token, remainder);
};

var charClassParser = function (token, remainder, validString) {
    "use strict";
    console.log("parse class: ", token, remainder, validString);
    if(_.isUndefined(validString)) {
        validString = "";
    }

    if(token === "]") {
        return basicResponse(validString, remainder);
    } else if (token === "\\") {
        var result = processControlCharacter(_.head(remainder), _.tail(remainder));
        return charClassParser(_.head(result.remainder), _.tail(result.remainder), result.candidateString);
    } else {
        validString = token;
        return charClassParser(_.head(remainder), _.tail(remainder), validString);
    }

};



var processRegEx = function(candidateString, token, remainder) {
    "use strict";
    var result;
    //console.log("Processing: ", candidateString, token, remainder);
    if(token === "\\") {
        result = processControlCharacter(_.head(remainder), _.tail(remainder));
        candidateString += result.candidateString;
        remainder = result.remainder;
    } else if (token === "[") {
        result = charClassParser(_.head(remainder), _.tail(remainder));
        candidateString += result.candidateString;
        remainder = result.remainder;
    } else {
        candidateString += token;
    }
    if(_.isEmpty(remainder)){
        return candidateString;
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
    return processRegEx("", _.head(regexTokens), _.tail(regexTokens));
};

module.exports = function (regex) {
    "use strict";
    var regObj = new RegExp(regex);
    var regStr = regObj.toString();

    return parse(regStr);

};