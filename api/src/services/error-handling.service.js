"use strict";
const main_1 = require("../main");
var ErrorConfig = require('../config/error.json');
class ErrorHandlingService {
    static buildErrorObject(errorCode, errorDescription, inputError) {
        // build error object
        // get error message in the config file if error description exists
        // if not, just use the passed errorDescription parameter
        if (ErrorConfig[errorCode]) {
            errorDescription = ErrorConfig[errorCode];
        }
        let Error = {
            code: errorCode,
            desc: errorDescription,
            inputError: inputError
        };
        // if input errors (errors generated from class validator that is used in model) is passed
        if (!inputError) {
            delete Error.inputError;
        }
        return Error;
    }
    static throwPromiseError(RejectFunction, errorCode, errorDescription, inputError) {
        RejectFunction(ErrorHandlingService.buildErrorObject(errorCode, errorDescription, inputError));
    }
    static throwError(errorCode, errorDescription, inputError) {
        throw ErrorHandlingService.buildErrorObject(errorCode, errorDescription, inputError);
    }
    static throwHTTPErrorResponse(HTTPResponseObject, HTTPResponseStatus, errorCode, errorDescription, inputError) {
        /**************************************************/
        /* HTTPResponseStatus Possible value :            */
        /* 	 -- 400: System Error / Technical Error       */
        /*   -- 500: Non System Error / Functional Error  */
        /**************************************************/
        HTTPResponseObject.status(HTTPResponseStatus).json(ErrorHandlingService.buildErrorObject(errorCode, errorDescription, inputError));
    }
    static throwHTTPErrorResponseNoEncrypt(HTTPResponseObject, HTTPResponseStatus, errorCode, errorDescription, inputError) {
        /**************************************************/
        /* HTTPResponseStatus Possible value :            */
        /* 	 -- 400: System Error / Technical Error       */
        /*   -- 500: Non System Error / Functional Error  */
        /**************************************************/
        if (main_1.config.encryption)
            HTTPResponseObject.status(HTTPResponseStatus).oldJson(ErrorHandlingService.buildErrorObject(errorCode, errorDescription, inputError));
        else
            HTTPResponseObject.status(HTTPResponseStatus).json(ErrorHandlingService.buildErrorObject(errorCode, errorDescription, inputError));
    }
}
exports.ErrorHandlingService = ErrorHandlingService;
//# sourceMappingURL=error-handling.service.js.map