'use strict';
exports.process = require('process');
var vPath = require("path");
exports.vEnv = exports.process.env.NODE_ENV || require(vPath.join(__dirname, 'config', 'mode.json'))['mode'];
exports.config = require(vPath.join(__dirname, 'config', 'config.json'))[exports.vEnv];
const route_1 = require("./route");
const logging_service_1 = require("./services/logging.service");
const sequelize_service_1 = require("./services/sequelize.service");
var multipart = require('connect-multiparty');
var express = require('express');
var bodyParser = require('body-parser');
var vValidator = require('validator');
const app = express();
const router = express.Router();
const port = exports.process.env.OPENSHIFT_NODEJS_PORT || 8080;
const ip = exports.process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
let seq = new sequelize_service_1.SequelizeService();
let allow;
var multipartMiddleware = multipart({ uploadDir: exports.config.storage });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    //update
    let origin = req.get('origin');
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, X-Requested-With, Content-Type, Accept,authorization,Proxy-Authorization,X-session");
    res.header("Access-Control-Expose-Headers", "accessToken,created,Content-Disposition");
    res.header("Access-Control-Allow-Methods", "GET,PUT,DELETE,POST");
    res.header("X-XSS-Protection", "1");
    res.header("X-Content-Type-Options", "nosniff");
    res.header("Content-Security-Policy", "object-src 'none';img-src 'self';media-src 'self';frame-src 'none';font-src 'self' data:;connect-src 'self';style-src 'self'");
    logging_service_1.Logging('incoming request host : ' + req.headers.host);
    logging_service_1.Logging('Incoming request method : ' + req.method);
    logging_service_1.Logging('Incoming request path : ' + req.path);
    // Logging('cookies : ' + JSON.stringify(req.cookies));
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        // ---------------------------------------------------------------
        for (let param in req.body) {
            if (typeof req.body[param] === 'string')
                req.body[param] = vValidator.escape(req.body[param]);
        }
    }
    else if (req.method === 'GET') {
        for (let param in req.query) {
            if (typeof req.query[param] === 'string' && param != 'filepath')
                req.query[param] = vValidator.escape(req.query[param]);
        }
        for (let param in req.params) {
            if (typeof req.params[param] === 'string')
                req.params[param] = vValidator.escape(req.params[param]);
        }
    }
    next();
});
route_1.Routing(router);
app.use('/api', router);
app.listen(port, ip);
logging_service_1.Logging('listening : ' + ip + ":" + port);
//# sourceMappingURL=main.js.map