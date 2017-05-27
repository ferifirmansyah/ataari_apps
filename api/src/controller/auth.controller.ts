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

export interface AuthControllerInterface {
    login(pRequest: any, pResponse: any): Promise<void>;
    updatingChildData(pRequest: any, pResponse: any): Promise<void>;
}

export class AuthController implements AuthControllerInterface {
    private static _httpService: HTTPService;

    constructor() {
        Logging('initialize Authentication controller');
        AuthController._httpService = new HTTPService();

    }

    async test(pRequest: any, pResponse: any): Promise<void> {
        pResponse.status(200).send("test success coy");
    }
    async login(pRequest: any, pResponse: any): Promise<void> {
        Logging('calling login function: Start..');
        try {
            let vParam:loginData = pRequest.body;
            let vResult:any;
            let vToken: TokenModel;
            if (vParam.username == undefined || vParam.username == null || vParam.username == "" ||
               vParam.password == undefined || vParam.password == null || vParam.password == "") {
                ErrorHandlingService.throwHTTPErrorResponse(pResponse, 400, 1001, 'Invalid Login Parameters');
                return;
            }

            let pBL_auth_path:string = config.bukalapak_api.url+config.bukalapak_api.type.authentication;           

            let pData={
                username:vParam.username,
                password:vParam.password
            }

            Logging('calling login function: Authentication to Bukalapak API..');
            let pHeader:any =  await AuthController._httpService.buildAuthHeaders(pData,true);
            let result:any = await AuthController._httpService.post(pBL_auth_path,pHeader);

            if (result.status = "OK"){
                Logging('calling login function: Save to DB..');

                let vUserData={
                    username:vParam.username,
                    password:vParam.password,
                    user_id:result.user_id,
                    parent_name:result.user_name,
                    bl_token:result.token,
                    email:result.email,
                    confirmed_phone:result.confirmed_phone,
                    omnikey:result.omnikey,
                    confirmed:result.confirmed
                };

                let resultDB:any = await DataAccessService.executeSP("user_add",vUserData,true);

                if(!resultDB){
                    ErrorHandlingService.throwHTTPErrorResponse(pResponse, 400, 1002, 'Unable to save to DB');
                    return;
                }
                else{
                    Logging('calling login function: Set to token object..');
                    vToken = new TokenModel();
                    let resDB = resultDB[0];
                    vToken.setUserId(resDB.user_id);
                    vToken.setBLToken(resDB.bl_token);
                    vToken.setParentName(resDB.parent_name);
                    vToken.setChildName("");
                    vToken.setChildGender("");
                    vToken.setChildBirthDate(null);

                    pResponse.header('accessToken', Token.encryptToken(vToken));
                    pResponse.header('created', Date.now());
                    pResponse.status(200).json(resultDB);

                    Logging('calling login function: sent response successfully..');   
                }
            }
            else {
                ErrorHandlingService.throwHTTPErrorResponse(pResponse, 400, 1002, 'BL Auth Error: Status = '+result.status+" Error Message = "+result.message);
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

    async updatingChildData(pRequest: any, pResponse: any): Promise<void> {
        Logging('calling update child data function: Start..');
        try {
            let vParam:childData = pRequest.body;
            let vResult:any;
            let vToken: TokenModel = pResponse.locals.token;
            if (vParam.child_gender == undefined || vParam.child_gender == null || vParam.child_gender == "" ||
               vParam.child_birthdate == undefined || vParam.child_birthdate == null) {
                ErrorHandlingService.throwHTTPErrorResponse(pResponse, 400, 1001, 'Invalid Child Data Parameters');
                return;
            }

            Logging('calling update child data function: Update DB..');

            let vChildData={
                user_id:vToken.getUserId(),
                child_name:vParam.child_name,
                child_gender:vParam.child_gender,
                child_birthdate:vParam.child_birthdate
            };

            Logging('vChildData :'+JSON.stringify(vChildData));

            let resultDB:any = await DataAccessService.executeSP("user_update",vChildData,true);

            if (resultDB){
                vToken.setChildName(resultDB.child_name);
                vToken.setChildGender(resultDB.child_gender);
                vToken.setChildBirthDate(resultDB.child_birthdate);

                pResponse.header('accessToken', Token.encryptToken(vToken));
                pResponse.header('created', Date.now());
                pResponse.status(200).json(resultDB);
                Logging('calling update child data function: sent response successfully..');   
            }
            else {
                ErrorHandlingService.throwHTTPErrorResponse(pResponse, 400, 1002, 'Unable save to DB');
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