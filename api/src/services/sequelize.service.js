"use strict";
const logging_service_1 = require("./logging.service");
const main_1 = require("../main");
const vConfig = main_1.config;
var vSequelize = require("sequelize");
var vFs = require('fs');
var vToday = Date.now();
var vDate = new Date(vToday);
var dbName, dbUserName, dbPassword, dbHost, dbPort;
class SequelizeService {
    constructor() {
        try {
            logging_service_1.Logging("initialize sequelize service");
            logging_service_1.Logging("Environment = " + main_1.vEnv);
            if (main_1.vEnv == 'production') {
                var postgresURL = main_1.process.env.OPENSHIFT_POSTGRESQL_DB_URL || main_1.process.env.POSTGRESQL_URL, mongoURLLabel = "";
                if (postgresURL == null && main_1.process.env.DATABASE_SERVICE_NAME) {
                    var mongoServiceName = main_1.process.env.DATABASE_SERVICE_NAME.toUpperCase(), dbHost = main_1.process.env[mongoServiceName + '_SERVICE_HOST'], dbPort = main_1.process.env[mongoServiceName + '_SERVICE_PORT'], dbName = main_1.process.env[mongoServiceName + '_DATABASE'], dbPassword = main_1.process.env[mongoServiceName + '_PASSWORD'], dbUserName = main_1.process.env[mongoServiceName + '_USER'];
                }
                console.log("mongoServiceName:" + mongoServiceName);
                console.log("dbHost:" + dbHost);
                console.log("dbPort:" + dbPort);
                console.log("dbName:" + dbName);
            }
            else {
                dbName = vConfig.db.name;
                dbUserName = vConfig.db.username;
                dbPassword = vConfig.db.password;
                dbHost = vConfig.db.host;
                dbPort = vConfig.db.port;
            }
            SequelizeService.sequelize = new vSequelize(dbName, dbUserName, dbPassword, {
                dialect: vConfig.db.dialect,
                host: dbHost,
                port: dbPort,
                timezone: vConfig.db.timezone,
                dialectOptions: vConfig.db.dialectOptions,
            });
        }
        catch (pErr) {
            logging_service_1.Logging('Error while establishing database connection with sequelize : ' + pErr);
            throw 401;
        }
    }
}
exports.SequelizeService = SequelizeService;
//# sourceMappingURL=sequelize.service.js.map