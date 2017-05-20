"use strict";
const error_handling_service_1 = require("./error-handling.service");
const sequelize_service_1 = require("./sequelize.service");
const utility_1 = require("../shared/utility");
const logging_service_1 = require("./logging.service");
class DataAccessService {
    constructor() {
        logging_service_1.Logging('Initialize data access service');
    }
    static executeSP(pSPName, pParams, pIsJSONFormat) {
        logging_service_1.Logging('Executing sp : ' + pSPName);
        return new Promise(function (pResolve, pReject) {
            try {
                // build stored procedure params
                let vParams;
                // if we pass a JSON as parameter
                // make sure that the created stored procedure accept 1 param with type of JSON
                if (pIsJSONFormat) {
                    vParams = '(\'' + JSON.stringify(pParams) + '\')';
                }
                else {
                    // default params for stored procedure if null object is passed as parameter
                    // converting params object into parameter in stored procedure
                    if (pParams) {
                        vParams = '(';
                        for (let vParam in pParams) {
                            if (pParams[vParam] !== undefined && pParams[vParam] !== null && typeof pParams[vParam] === 'string' && pParams[vParam].indexOf('\'') !== -1) {
                                pParams[vParam] = utility_1.Utility.replaceAll(pParams[vParam], '\'', '\'\'');
                            }
                            vParams += "'" + pParams[vParam] + "',";
                        }
                        vParams = vParams.substring(0, vParams.lastIndexOf(',')) + ');';
                    }
                    else {
                        vParams = '();';
                    }
                }
                // build query to execute stored procedure
                let vSQL = 'SELECT ' + pSPName + vParams;
                // console.log(vSQL);
                sequelize_service_1.SequelizeService.sequelize.query(vSQL, { type: sequelize_service_1.SequelizeService.sequelize.QueryTypes.SELECT }).then(function (pResult) {
                    // stored procedure will return 0 if there is no errors
                    let vResult = pResult[0][pSPName.toLowerCase()];
                    if (vResult.status === 0) {
                        logging_service_1.Logging("success : ");
                        logging_service_1.Logging(vResult.result);
                        pResolve(vResult.result);
                    }
                    else {
                        logging_service_1.Logging('Error while executing query : ' + vSQL);
                        logging_service_1.Logging('Result : ' + JSON.stringify(vResult));
                        error_handling_service_1.ErrorHandlingService.throwPromiseError(pReject, vResult.error_code, vResult.error_msg);
                    }
                }).catch(function (pErr) {
                    logging_service_1.Logging('Error while executing query : ' + vSQL);
                    // throwing error from the sequelize
                    logging_service_1.Logging('Error ' + pErr);
                    error_handling_service_1.ErrorHandlingService.throwPromiseError(pReject, 400, pErr);
                });
            }
            catch (pErr) {
                error_handling_service_1.ErrorHandlingService.throwPromiseError(pReject, 400, pErr);
            }
        });
    }
}
exports.DataAccessService = DataAccessService;
//# sourceMappingURL=data-access.service.js.map