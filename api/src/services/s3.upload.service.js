"use strict";
const main_1 = require("../main");
const logging_service_1 = require("./logging.service");
var vAWS = require('aws-sdk');
var vRequest = require('request');
var vFS = require('fs');
// vAWS.config.accessKeyId = 'AKIAJ6KP6NNEVOBW7RQA';
// vAWS.config.secretAccessKey = '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';
vAWS.config.accessKeyId = 'AKIAJ66LQ6BL2VQPAGEQ';
vAWS.config.secretAccessKey = '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';
class S3UploadService {
    constructor() {
    }
    getUploadedFile(pFileName, pPath) {
        let vUrl = 'https://' + main_1.config.upload.bucket + '.s3.amazonaws.com/' + main_1.config.upload.path + pPath + pFileName;
        return vUrl;
    }
    upload(pFileName, pFile) {
        return new Promise(function (pResolve, pReject) {
            var s3bucket = new vAWS.S3({ params: { Bucket: main_1.config.upload.bucket } });
            var params = {
                Key: pFileName,
                Body: pFile,
                ACL: 'public-read-write'
            };
            s3bucket.upload(params, function (err, data) {
                if (err) {
                    logging_service_1.Logging('ERROR MSG: ' + err);
                    pReject(err);
                }
                else {
                    logging_service_1.Logging('Successfully uploaded data to AWS');
                    pResolve(true);
                }
            });
        });
    }
    delete(pFileName) {
        return new Promise(function (pResolve, pReject) {
            var params = {
                Key: pFileName,
            };
            var s3 = new vAWS.S3({ params: { Bucket: main_1.config.upload.bucket } });
            s3.deleteObject(params, function (err, data) {
                if (err) {
                    logging_service_1.Logging("error aws : " + err); // an error occurred
                    pReject(err);
                }
                else {
                    logging_service_1.Logging(data); // successful response 
                    pResolve(true);
                }
            });
        });
    }
}
exports.S3UploadService = S3UploadService;
//# sourceMappingURL=s3.upload.service.js.map