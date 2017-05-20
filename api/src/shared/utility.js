"use strict";
var Utility;
(function (Utility) {
    function replaceAll(pString, pSearch, pReplacement) {
        return pString.replace(new RegExp(pSearch, 'g'), pReplacement);
    }
    Utility.replaceAll = replaceAll;
    ;
    function sortJSON(pJSONObject, pSortKey, pASC) {
        let vAsc = pASC ? true : false;
        return pJSONObject.sort(function (a, b) {
            if (typeof a[pSortKey] === 'number') {
                return vAsc ? a[pSortKey] - b[pSortKey] : b[pSortKey] - a[pSortKey];
            }
            else if (typeof a[pSortKey] === 'string') {
                if (vAsc) {
                    return (a[pSortKey] > b[pSortKey]) ? 1 : ((a[pSortKey] < b[pSortKey]) ? -1 : 0);
                }
                else {
                    return (b[pSortKey] > a[pSortKey]) ? 1 : ((b[pSortKey] < a[pSortKey]) ? -1 : 0);
                }
            }
        });
    }
    Utility.sortJSON = sortJSON;
    function excludeJSON(obj, type, filter) {
        var vData = obj;
        for (let i = 0; i < vData.length; i++) {
            if (vData[i][type] == filter) {
                vData.splice(i, 1);
                i -= 1;
            }
        }
        return vData;
    }
    Utility.excludeJSON = excludeJSON;
    function findJSON(obj, type, filter) {
        var temp = [];
        for (var data in obj) {
            if (obj[data][type] == filter)
                temp.push(obj[data]);
        }
        return temp;
    }
    Utility.findJSON = findJSON;
    function cloneObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        var temp = obj.constructor(); // give temp the original obj's constructor
        for (var key in obj) {
            temp[key] = cloneObject(obj[key]);
        }
        return temp;
    }
    Utility.cloneObject = cloneObject;
})(Utility = exports.Utility || (exports.Utility = {}));
//# sourceMappingURL=utility.js.map