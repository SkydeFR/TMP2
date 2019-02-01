"use strict";

var _process$env$APP, _process$env$PORT, _process$env$HOST, _process$env$DB_HOST, _process$env$DB_PORT, _process$env$DB_NAME, _process$env$DB_USER, _process$env$DB_PASSW, _process$env$JWT_ENCR, _process$env$JWT_EXPI, _process$env$PASSWORD;

require('dotenv').config();

const CONFIG = {};
CONFIG.app = (_process$env$APP = process.env.APP) !== null && _process$env$APP !== void 0 ? _process$env$APP : 'dev';
CONFIG.port = (_process$env$PORT = process.env.PORT) !== null && _process$env$PORT !== void 0 ? _process$env$PORT : '3000';
CONFIG.host = (_process$env$HOST = process.env.HOST) !== null && _process$env$HOST !== void 0 ? _process$env$HOST : 'localhost';
CONFIG.db_host = (_process$env$DB_HOST = process.env.DB_HOST) !== null && _process$env$DB_HOST !== void 0 ? _process$env$DB_HOST : 'localhost';
CONFIG.db_port = (_process$env$DB_PORT = process.env.DB_PORT) !== null && _process$env$DB_PORT !== void 0 ? _process$env$DB_PORT : '27017';
CONFIG.db_name = (_process$env$DB_NAME = process.env.DB_NAME) !== null && _process$env$DB_NAME !== void 0 ? _process$env$DB_NAME : 'temoins²';
CONFIG.db_user = (_process$env$DB_USER = process.env.DB_USER) !== null && _process$env$DB_USER !== void 0 ? _process$env$DB_USER : '';
CONFIG.db_password = (_process$env$DB_PASSW = process.env.DB_PASSWORD) !== null && _process$env$DB_PASSW !== void 0 ? _process$env$DB_PASSW : '';
CONFIG.jwt_encryption = (_process$env$JWT_ENCR = process.env.JWT_ENCRYPTION) !== null && _process$env$JWT_ENCR !== void 0 ? _process$env$JWT_ENCR : '';
CONFIG.jwt_expiration = (_process$env$JWT_EXPI = process.env.JWT_EXPIRATION) !== null && _process$env$JWT_EXPI !== void 0 ? _process$env$JWT_EXPI : '10000';
CONFIG.password_salt_rounds = parseInt((_process$env$PASSWORD = process.env.PASSWORD_SALT_ROUNDS) !== null && _process$env$PASSWORD !== void 0 ? _process$env$PASSWORD : '10');
module.exports = CONFIG;