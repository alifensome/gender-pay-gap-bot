"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceMultiple = exports.replaceAll = void 0;
function replaceAll(str, find, replace = "") {
    const re = new RegExp(find, 'g');
    return str.replace(re, replace);
}
exports.replaceAll = replaceAll;
function replaceMultiple(str, replacements) {
    let replacedString = str;
    for (let index = 0; index < replacements.length; index++) {
        const item = replacements[index];
        replacedString = replaceAll(replacedString, item.find, item.replace);
    }
    return replacedString;
}
exports.replaceMultiple = replaceMultiple;
//# sourceMappingURL=replace.js.map