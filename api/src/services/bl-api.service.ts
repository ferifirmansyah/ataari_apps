import { ErrorHandlingService } from './error-handling.service';
import {Logging} from './logging.service';
import {vEnv,config} from '../main';
var vRequest = require('request'); 
var querystring = require('querystring');
//var http = require('http-request');

export var RequestMethod = {
	POST : 'POST',
	GET : 'GET',
	PUT : 'PUT',
	DELETE : 'DELETE'
}

export interface HTTPServiceInterface {
	// buildAuthHeaders(pMethod:any): any;
}

export class HTTPService implements HTTPServiceInterface{

	constructor() {
		Logging('Initialize HTTP service');
	}

	buildAuthHeaders(pData?:any, isBasicAuthNeed?:boolean) {
		let vReqHeaders:any = {
			'Content-Type' : 'application/json', // default request header
		}
		if(isBasicAuthNeed){
			vReqHeaders['Authorization']= "Basic " + new Buffer(pData.username + ":" + pData.password).toString("base64");
		}
		return vReqHeaders;
	}

	post(pURL:string, pHeaders:any, pData?:any) {
		return this.request(RequestMethod.POST, pURL, pHeaders, pData);
	}

	get(pURL:string, pHeaders?:any, pUrlParams?:any, isBinary?:any) {
		let fullUrl = pURL;
		// build params url from object
		if(pUrlParams) {
			fullUrl = fullUrl + '?'
			for(let vParam in pUrlParams) {
				fullUrl += vParam + "=" + pUrlParams[vParam] + "&";
			}
			fullUrl = fullUrl.substring(0,fullUrl.lastIndexOf('&'));
		}
		return this.request(RequestMethod.GET, fullUrl, pHeaders,undefined,isBinary);
	}
	
	// Handles error caused by technical errors such as server not found, timeout etc
	handleHTTPError(pHTTPError:any) {
		let Error = {
			code: 0, // Error Code
			desc:'' // Error Description
		};
		// format error received from request : 
		// {"code":"ECONNREFUSED","errno":"ECONNREFUSED","syscall":"connect","address":"127.0.0.1","port":5678}
		// map HTTP Error
		if(pHTTPError.code === 'ECONNREFUSED') {// Interface server could not be reached
			Error.code = 106;
			Error.desc = 'CONNECTION REFUSED';
		}else if(pHTTPError.code === 'ETIMEDOUT') {
			Error.code = 107;
			Error.desc = 'CONNECTION TIMEOUT'
		}else if(pHTTPError.code === 'ENOTFOUND') {
			Error.code = 108;
			Error.desc = 'SERVICE NOT FOUND';
		}else {
			Error.code = 109;
			Error.desc = 'UHANDLED HTTP ERROR';
			Logging(JSON.stringify(pHTTPError));
		}
		return Error;
	}

	handleHTTPErrorResponse(pHTTPErrorResponse:any) {
		let Error = {
			code: 0, // Error Code
			desc:'' // Error Description
		};

		switch(pHTTPErrorResponse.statusCode) {
			case 404:
				Error.code = 116;
				Error.desc = 'SERVICE_NOT_FOUND';
				break;
			case 403:
				Error.code = 117;
				Error.desc = 'FORBIDDEN_REQUEST';
				break;
			default :	
				Logging(pHTTPErrorResponse.body);
				Error.code = 120;
				Error.desc = "UNHANDLED_ERROR";
				break;
		}
		return Error;
	}

	request(pRequestMethod:string, pURL:string, pHeaders:any, pData?:any,isBinary?:any){
		Logging(pRequestMethod + ' ' + pURL);
		let vCurrentContext = this;
		return new Promise<any>(
			function(pResolve, pReject){
				try{
					let vReqHeaders;
					if(!pHeaders) {
						vReqHeaders = vCurrentContext.buildAuthHeaders();
					}else {
						vReqHeaders = pHeaders;
					}
					// build request object
					let vRequestObj:any = {
						url : pURL,
						method : pRequestMethod,
						headers : vReqHeaders,
						timeout : config.http["timeout"],
						body : ''
					};
					if(isBinary)
						vRequestObj['encoding'] = null;
					if(vRequestObj.headers['Content-Type'] == 'application/x-www-form-urlencoded'){
						vRequestObj.body = querystring.stringify(pData);
					}
					else if(vRequestObj.headers['Content-Type'] == 'application/json'){
						vRequest.body = JSON.stringify(pData);
					}
					vRequest(vRequestObj, function(pErr:any, pResponse:any, pBody:any){
						if(pErr) {
							Logging(pErr);
							let vError = vCurrentContext.handleHTTPError(pErr);
							ErrorHandlingService.throwPromiseError(pReject, vError.code, vError.desc);
						}else {
							if(pResponse.statusCode === 200) { // HTTP Success ResponsehandleHTTPError
								var contt = pResponse.headers['content-type'];
								
								if(!contt)
									contt = pResponse.headers['Content-Type']
								if(contt && contt.indexOf('application/json') !== -1)
									Logging('Response 200 from '+pURL+' : '+JSON.parse(pBody));

								pResolve(JSON.parse(pBody));
							}else { // API server found but not returning response 200
								Logging('Response ' + pResponse.statusCode + ' from '+pURL);
								let vError = vCurrentContext.handleHTTPErrorResponse(pResponse);
								ErrorHandlingService.throwPromiseError(pReject, vError.code, vError.desc);
							}
						}
					});
				}catch(pErr) {
					Logging(pErr);
					//timeout
					ErrorHandlingService.throwPromiseError(pReject, 112, pErr.toString());
				}
			}
		)
	}

}