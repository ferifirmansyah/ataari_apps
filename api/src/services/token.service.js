"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const token_model_1 = require("../model/token.model");
const error_handling_service_1 = require("./error-handling.service");
const logging_service_1 = require("./logging.service");
const main_1 = require("../main");
var vNJwt = require('njwt');
var CryptoJS = require('crypto-js');
class Token {
    constructor() {
        logging_service_1.Logging('initialize token service');
    }
    static encryptToken(pObject) {
        try {
            // load sign in key from config files
            let vSigningkey = main_1.config.token.key;
            // encrypt token
            let vJwt = vNJwt.create(pObject, vSigningkey);
            // set expiration for token
            vJwt.setExpiration();
            //vJwt.setExpiration(new Date().getTime() + this.vTimeout);
            let vToken = vJwt.compact();
            return vToken;
        }
        catch (pErr) {
            error_handling_service_1.ErrorHandlingService.throwError(300, pErr.toString());
        }
    }
    static decryptToken(pToken) {
        try {
            // load sign in key from config files
            let vSigningkey = main_1.config.token.key;
            let vVerifiedJwt = vNJwt.verify(pToken, vSigningkey).body;
            let vTokenObject = new token_model_1.TokenModel();
            vTokenObject.setUserId(vVerifiedJwt.userId);
            vTokenObject.setBLToken(vVerifiedJwt.blToken);
            vTokenObject.setParentName(vVerifiedJwt.parentName);
            vTokenObject.setChildName(vVerifiedJwt.childName);
            vTokenObject.setChildGender(vVerifiedJwt.childGender);
            vTokenObject.setChildBirthDate(vVerifiedJwt.childBirthDate);
            return vTokenObject;
        }
        catch (pErr) {
            error_handling_service_1.ErrorHandlingService.throwError(300, 'Invalid Access Token');
        }
    }
    verifyToken(pRequest, pResponse, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (pRequest.method == 'OPTIONS')
                next();
            try {
                let vToken = pRequest.get('authorization').replace('Bearer ', '');
                let vTokenObject = Token.decryptToken(vToken);
                pResponse.locals.token = vTokenObject;
                // renew the accessToken every time user hit API
                let vNewAccessToken = Token.encryptToken(vTokenObject);
                pResponse.header('accessToken', vNewAccessToken);
                pResponse.header('created', Date.now());
                next();
            }
            catch (ex) {
                error_handling_service_1.ErrorHandlingService.throwHTTPErrorResponse(pResponse, 403, 300, 'Invalid Access Token');
            }
        });
    }
}
Token.vTimeout = 60 * 60 * 1000; //60 minutes
exports.Token = Token;
//# sourceMappingURL=token.service.js.map