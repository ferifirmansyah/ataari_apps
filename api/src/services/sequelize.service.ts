import {Logging} from './logging.service';
import {vEnv,config,process} from '../main'
declare var require:any;
const vConfig = config;
var vSequelize = require("sequelize");
var vFs = require('fs');
var vToday = Date.now();
var vDate = new Date(vToday);
var dbName:String, dbUserName:String, dbPassword:String, dbHost:String, dbPort:any;

export class SequelizeService {
	public static sequelize:any;

	constructor(){
		try{
			Logging("initialize sequelize service");
			Logging("Environment = "+vEnv);
			if(vEnv=='production'){
				var postgresURL = process.env.OPENSHIFT_POSTGRESQL_DB_URL || process.env.POSTGRESQL_URL,
				mongoURLLabel = "";

				if (postgresURL == null && process.env.DATABASE_SERVICE_NAME) {
				var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
					dbHost = process.env[mongoServiceName + '_SERVICE_HOST'],
					dbPort = process.env[mongoServiceName + '_SERVICE_PORT'],
					dbName = process.env[mongoServiceName + '_DATABASE'],
					dbPassword = process.env[mongoServiceName + '_PASSWORD'],
					dbUserName = process.env[mongoServiceName + '_USER'];
				}

				console.log("mongoServiceName:"+mongoServiceName);
				console.log("dbHost:"+dbHost);
				console.log("dbPort:"+dbPort);
				console.log("dbName:"+dbName);
			}
			else {
				dbName = vConfig.db.name;
				dbUserName = vConfig.db.username;
				dbPassword = vConfig.db.password;
				dbHost = vConfig.db.host;
				dbPort = vConfig.db.port;

			}
			SequelizeService.sequelize = new vSequelize(
				dbName, 
				dbUserName, 
				dbPassword,
				{
					dialect : vConfig.db.dialect,
					host    : dbHost,
					port	: dbPort,
					timezone : vConfig.db.timezone,
					dialectOptions : vConfig.db.dialectOptions,
				});
		}catch(pErr){
			Logging('Error while establishing database connection with sequelize : ' + pErr);
			throw 401;
		}
	}
}	