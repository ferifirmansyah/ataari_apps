"use strict";
const logging_service_1 = require("./logging.service");
const main_1 = require("../main");
const vConfig = main_1.config;
var vSequelize = require("sequelize");
var vFs = require('fs');
var vToday = Date.now();
var vDate = new Date(vToday);
class SequelizeService {
    constructor() {
        try {
            logging_service_1.Logging("initialize sequelize service");
            SequelizeService.sequelize = new vSequelize(vConfig.db.name, vConfig.db.username, vConfig.db.password, {
                dialect: vConfig.db.dialect,
                host: vConfig.db.host,
                port: vConfig.db.port,
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