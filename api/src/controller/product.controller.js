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
const bl_api_service_1 = require("../services/bl-api.service");
const main_1 = require("../main");
class ProductController {
    constructor() {
        logging_service_1.Logging('initialize Product controller');
        ProductController._httpService = new bl_api_service_1.HTTPService();
    }
    productList(pRequest, pResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            logging_service_1.Logging('calling product list: Start..');
            try {
                // let vParam:loginData = pRequest.body;
                // let vResult:any;
                let vKeyword = pRequest.query.keyword;
                // let vToken: TokenModel;
                // if (vParam.username == undefined || vParam.username == null || vParam.username == "" ||
                //    vParam.password == undefined || vParam.password == null || vParam.password == "") {
                //     ErrorHandlingService.throwHTTPErrorResponse(pResponse, 400, 1001, 'Invalid Login Parameters');
                //     return;
                // }
                let pBL_auth_path = main_1.config.bukalapak_api.url + main_1.config.bukalapak_api.type.productList;
                let urlParam = {
                    keywords: vKeyword,
                    category_id: 68,
                    top_seller: 1,
                    conditions: 'new',
                };
                logging_service_1.Logging("urlParam" + JSON.stringify(urlParam));
                // let pData={
                //     username:vParam.username,
                //     password:vParam.password
                // }
                logging_service_1.Logging('calling product list: get product list API for keyword:' + vKeyword + "...");
                let pHeader = yield ProductController._httpService.buildAuthHeaders();
                let result = yield ProductController._httpService.get(pBL_auth_path, pHeader, urlParam);
                if (result.status = "OK") {
                    pResponse.status(200).json(result);
                    logging_service_1.Logging('calling product list: sent response successfully..');
                }
                else {
                    error_handling_service_1.ErrorHandlingService.throwHTTPErrorResponse(pResponse, 400, 1002, 'BL Get Product List Error: Status = ' + result.status);
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
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map