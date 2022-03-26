"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const db_connector_1 = __importDefault(require("./db-connector"));
const users_1 = __importDefault(require("./routes/users"));
const fastify = (0, fastify_1.default)({
    logger: true
});
fastify.register(db_connector_1.default);
fastify.register(users_1.default);
fastify.listen(3000, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
//# sourceMappingURL=server.js.map