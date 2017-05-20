import {ErrorHandlingService} from '../services/error-handling.service';
import {Logging, insertAudit} from '../services/logging.service';
import {DataAccessService} from '../services/data-access.service';
import {HTTPService} from '../services/bl-api.service';
import {vEnv,config} from '../main';
import {TokenModel} from '../model/token.model';
import {Token} from '../services/token.service';

interface loginData{
    username:string;
    password:string;
}

interface childData{
    child_name:string;
    child_gender:string;
    child_birthdate:Date;
}

export interface ProductControllerInterface {
    // login(pRequest: any, pResponse: any): Promise<void>;
    // updatingChildData(pRequest: any, pResponse: any): Promise<void>;
}

export class ProductController implements ProductControllerInterface {
    private static _httpService: HTTPService;

    constructor() {
        Logging('initialize Product controller');
        ProductController._httpService = new HTTPService();
    }

    async productList(pRequest: any, pResponse: any): Promise<void> {
        Logging('calling product list: Start..');
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

            let pBL_auth_path:string = config.bukalapak_api.url+config.bukalapak_api.type.productList;           

            let urlParam = {
                keywords:vKeyword,
                category_id:68,
                top_seller:1,
                conditions:'new',
                // sort_by:'Termurah'
            };

            Logging("urlParam"+JSON.stringify(urlParam));
            // let pData={
            //     username:vParam.username,
            //     password:vParam.password
            // }

            Logging('calling product list: get product list API for keyword:'+vKeyword+"...");
            let pHeader:any =  await ProductController._httpService.buildAuthHeaders();
            let result:any = await ProductController._httpService.get(pBL_auth_path,pHeader,urlParam);

            if (result.status = "OK"){
                pResponse.status(200).json(result);

                Logging('calling product list: sent response successfully..');   
            }
            else {
                ErrorHandlingService.throwHTTPErrorResponse(pResponse, 400, 1002, 'BL Get Product List Error: Status = '+result.status);
                return;
            }
        }
        catch (err) {
            Logging(err);
            if (err.code)
                ErrorHandlingService.throwHTTPErrorResponse(pResponse, 500, err.code, err.desc);
            else
                ErrorHandlingService.throwHTTPErrorResponse(pResponse, 500, 1000, err);
        }
    }

    
}