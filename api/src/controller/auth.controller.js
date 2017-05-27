"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const error_handling_service_1 = require("../services/error-handling.service");
const logging_service_1 = require("../services/logging.service");
const data_access_service_1 = require("../services/data-access.service");
const bl_api_service_1 = require("../services/bl-api.service");
const main_1 = require("../main");
const token_model_1 = require("../model/token.model");
const token_service_1 = require("../services/token.service");
class AuthController {
    constructor() {
        logging_service_1.Logging('initialize Authentication controller');
        AuthController._httpService = new bl_api_service_1.HTTPService();
    }
    test(pRequest, pResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            pResponse.status(200).send("test success");
        });
    }
    login(pRequest, pResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            logging_service_1.Logging('calling login function: Start..');
            try {
                let vParam = pRequest.body;
                let vResult;
                let vToken;
                if (vParam.username == undefined || vParam.username == null || vParam.username == "" ||
                    vParam.password == undefined || vParam.password == null || vParam.password == "") {
                    error_handling_service_1.ErrorHandlingService.throwHTTPErrorResponse(pResponse, 400, 1001, 'Invalid Login Parameters');
                    return;
                }
                let pBL_auth_path = main_1.config.bukalapak_api.url + main_1.config.bukalapak_api.type.authentication;
                let pData = {
                    username: vParam.username,
                    password: vParam.password
                };
                logging_service_1.Logging('calling login function: Authentication to Bukalapak API..');
                let pHeader = yield AuthController._httpService.buildAuthHeaders(pData, true);
                let result = yield AuthController._httpService.post(pBL_auth_path, pHeader);
                if (result.status = "OK") {
                    logging_service_1.Logging('calling login function: Save to DB..');
                    let vUserData = {
                        username: vParam.username,
                        password: vParam.password,
                        user_id: result.user_id,
                        parent_name: result.user_name,
                        bl_token: result.token,
                        email: result.email,
                        confirmed_phone: result.confirmed_phone,
                        omnikey: result.omnikey,
                        confirmed: result.confirmed
                    };
                    let resultDB = yield data_access_service_1.DataAccessService.executeSP("user_add", vUserData, true);
                    if (!resultDB) {
                        error_handling_service_1.ErrorHandlingService.throwHTTPErrorResponse(pResponse, 400, 1002, 'Unable to save to DB');
                        return;
                    }
                    else {
                        logging_service_1.Logging('calling login function: Set to token object..');
                        vToken = new token_model_1.TokenModel();
                        let resDB = resultDB[0];
                        vToken.setUserId(resDB.user_id);
                        vToken.setBLToken(resDB.bl_token);
                        vToken.setParentName(resDB.parent_name);
                        vToken.setChildName("");
                        vToken.setChildGender("");
                        vToken.setChildBirthDate(null);
                        pResponse.header('accessToken', token_service_1.Token.encryptToken(vToken));
                        pResponse.header('created', Date.now());
                        pResponse.status(200).json(resultDB);
                        logging_service_1.Logging('calling login function: sent response successfully..');
                    }
                }
                else {
                    error_handling_service_1.ErrorHandlingService.throwHTTPErrorResponse(pResponse, 400, 1002, 'BL Auth Error: Status = ' + result.status + " Error Message = " + result.message);
                    return;
                }
            }
            catch (err) {
                logging_service_1.Logging(err);
                if (err.code)
                    error_handling_service_1.ErrorHandlingService.throwHTTPErrorResponse(pResponse, 500, err.code, err.desc);
                else
                    error_handling_service_1.ErrorHandlingService.throwHTTPErrorResponse(pResponse, 500, 1000, err);
            }
        });
    }
    updatingChildData(pRequest, pResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            logging_service_1.Logging('calling update child data function: Start..');
            try {
                let vParam = pRequest.body;
                let vResult;
                let vToken = pResponse.locals.token;
                if (vParam.child_gender == undefined || vParam.child_gender == null || vParam.child_gender == "" ||
                    vParam.child_birthdate == undefined || vParam.child_birthdate == null) {
                    error_handling_service_1.ErrorHandlingService.throwHTTPErrorResponse(pResponse, 400, 1001, 'Invalid Child Data Parameters');
                    return;
                }
                logging_service_1.Logging('calling update child data function: Update DB..');
                let vChildData = {
                    user_id: vToken.getUserId(),
                    child_name: vParam.child_name,
                    child_gender: vParam.child_gender,
                    child_birthdate: vParam.child_birthdate
                };
                logging_service_1.Logging('vChildData :' + JSON.stringify(vChildData));
                let resultDB = yield data_access_service_1.DataAccessService.executeSP("user_update", vChildData, true);
                if (resultDB) {
                    vToken.setChildName(resultDB.child_name);
                    vToken.setChildGender(resultDB.child_gender);
                    vToken.setChildBirthDate(resultDB.child_birthdate);
                    pResponse.header('accessToken', token_service_1.Token.encryptToken(vToken));
                    pResponse.header('created', Date.now());
                    pResponse.status(200).json(resultDB);
                    logging_service_1.Logging('calling update child data function: sent response successfully..');
                }
                else {
                    error_handling_service_1.ErrorHandlingService.throwHTTPErrorResponse(pResponse, 400, 1002, 'Unable save to DB');
                    return;
                }
            }
            catch (err) {
                logging_service_1.Logging(err);
                if (err.code)
                    error_handling_service_1.ErrorHandlingService.throwHTTPErrorResponse(pResponse, 500, err.code, err.desc);
                else
                    error_handling_service_1.ErrorHandlingService.throwHTTPErrorResponse(pResponse, 500, 1000, err);
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map