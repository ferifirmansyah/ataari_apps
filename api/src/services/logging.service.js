"use strict";
const data_access_service_1 = require("./data-access.service");
const main_1 = require("../main");
const enableLogging = main_1.config['debug'];
var ErrorConfig = require('../config/error.json');
var fs = require('fs');
var moment = require('moment');
function Logging(msg) {
    if (enableLogging) {
        var time = moment().format('DD-MMM-YYYY, hh:mm:ss a');
        console.log(`${time} | ${Object.prototype.toString.call(msg) == "[object Object]" ||
            Object.prototype.toString.call(msg) == "[object Array]" ? JSON.stringify(msg) : msg}`);
    }
}
exports.Logging = Logging;
function insertAudit(userId, action, details) {
    if (getType(details) == 'array' || getType(details) == 'object') {
        details = JSON.stringify(details, null, 4);
    }
    let vParam = {
        user_id: userId,
        action: action,
        details: details
    };
    let vPayload = data_access_service_1.DataAccessService.executeSP('audit_add', vParam, true);
}
exports.insertAudit = insertAudit;
function getType(p) {
    if (Array.isArray(p))
        return 'array';
    else if (typeof p == 'string')
        return 'string';
    else if (p != null && typeof p == 'object')
        return 'object';
    else
        return 'other';
}
//# sourceMappingURL=logging.service.js.map