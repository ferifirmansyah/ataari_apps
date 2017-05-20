"use strict";
const error_handling_service_1 = require("./error-handling.service");
const logging_service_1 = require("./logging.service");
const main_1 = require("../main");
var vRequest = require('request');
var querystring = require('querystring');
//var http = require('http-request');
exports.RequestMethod = {
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE'
};
class HTTPService {
    constructor() {
        logging_service_1.Logging('Initialize HTTP service');
    }
    buildAuthHeaders(pData, isBasicAuthNeed) {
        let vReqHeaders = {
            'Content-Type': 'application/json',
        };
        if (isBasicAuthNeed) {
            vReqHeaders['Authorization'] = "Basic " + new Buffer(pData.username + ":" + pData.password).toString("base64");
        }
        return vReqHeaders;
    }
    post(pURL, pHeaders, pData) {
        return this.request(exports.RequestMethod.POST, pURL, pHeaders, pData);
    }
    get(pURL, pHeaders, pUrlParams, isBinary) {
        let fullUrl = pURL;
        // build params url from object
        if (pUrlParams) {
            fullUrl = fullUrl + '?';
            for (let vParam in pUrlParams) {
                fullUrl += vParam + "=" + pUrlParams[vParam] + "&";
            }
            fullUrl = fullUrl.substring(0, fullUrl.lastIndexOf('&'));
        }
        return this.request(exports.RequestMethod.GET, fullUrl, pHeaders, undefined, isBinary);
    }
    // Handles error caused by technical errors such as server not found, timeout etc
    handleHTTPError(pHTTPError) {
        let Error = {
            code: 0,
            desc: '' // Error Description
        };
        // format error received from request : 
        // {"code":"ECONNREFUSED","errno":"ECONNREFUSED","syscall":"connect","address":"127.0.0.1","port":5678}
        // map HTTP Error
        if (pHTTPError.code === 'ECONNREFUSED') {
            Error.code = 106;
            Error.desc = 'CONNECTION REFUSED';
        }
        else if (pHTTPError.code === 'ETIMEDOUT') {
            Error.code = 107;
            Error.desc = 'CONNECTION TIMEOUT';
        }
        else if (pHTTPError.code === 'ENOTFOUND') {
            Error.code = 108;
            Error.desc = 'SERVICE NOT FOUND';
        }
        else {
            Error.code = 109;
            Error.desc = 'UHANDLED HTTP ERROR';
            logging_service_1.Logging(JSON.stringify(pHTTPError));
        }
        return Error;
    }
    handleHTTPErrorResponse(pHTTPErrorResponse) {
        let Error = {
            code: 0,
            desc: '' // Error Description
        };
        switch (pHTTPErrorResponse.statusCode) {
            case 404:
                Error.code = 116;
                Error.desc = 'SERVICE_NOT_FOUND';
                break;
            case 403:
                Error.code = 117;
                Error.desc = 'FORBIDDEN_REQUEST';
                break;
            default:
                logging_service_1.Logging(pHTTPErrorResponse.body);
                Error.code = 120;
                Error.desc = "UNHANDLED_ERROR";
                break;
        }
        return Error;
    }
    request(pRequestMethod, pURL, pHeaders, pData, isBinary) {
        logging_service_1.Logging(pRequestMethod + ' ' + pURL);
        let vCurrentContext = this;
        return new Promise(function (pResolve, pReject) {
            try {
                let vReqHeaders;
                if (!pHeaders) {
                    vReqHeaders = vCurrentContext.buildAuthHeaders();
                }
                else {
                    vReqHeaders = pHeaders;
                }
                // build request object
                let vRequestObj = {
                    url: pURL,
                    method: pRequestMethod,
                    headers: vReqHeaders,
                    timeout: main_1.config.http["timeout"],
                    body: ''
                };
                if (isBinary)
                    vRequestObj['encoding'] = null;
                if (vRequestObj.headers['Content-Type'] == 'application/x-www-form-urlencoded') {
                    vRequestObj.body = querystring.stringify(pData);
                }
                else if (vRequestObj.headers['Content-Type'] == 'application/json') {
                    vRequest.body = JSON.stringify(pData);
                }
                vRequest(vRequestObj, function (pErr, pResponse, pBody) {
                    if (pErr) {
                        logging_service_1.Logging(pErr);
                        let vError = vCurrentContext.handleHTTPError(pErr);
                        error_handling_service_1.ErrorHandlingService.throwPromiseError(pReject, vError.code, vError.desc);
                    }
                    else {
                        if (pResponse.statusCode === 200) {
                            var contt = pResponse.headers['content-type'];
                            if (!contt)
                                contt = pResponse.headers['Content-Type'];
                            if (contt && contt.indexOf('application/json') !== -1)
                                logging_service_1.Logging('Response 200 from ' + pURL + ' : ' + JSON.parse(pBody));
                            pResolve(JSON.parse(pBody));
                        }
                        else {
                            logging_service_1.Logging('Response ' + pResponse.statusCode + ' from ' + pURL);
                            let vError = vCurrentContext.handleHTTPErrorResponse(pResponse);
                            error_handling_service_1.ErrorHandlingService.throwPromiseError(pReject, vError.code, vError.desc);
                        }
                    }
                });
            }
            catch (pErr) {
                logging_service_1.Logging(pErr);
                //timeout
                error_handling_service_1.ErrorHandlingService.throwPromiseError(pReject, 112, pErr.toString());
            }
        });
    }
}
exports.HTTPService = HTTPService;
//# sourceMappingURL=bl-api.service.js.map