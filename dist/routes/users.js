"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_jwt_1 = __importDefault(require("fastify-jwt"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const secret_1 = __importDefault(require("../secret"));
function usersRoutes(fastify, _options) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = fastify.mongo.db.collection('users');
        fastify.register(fastify_jwt_1.default, { secret: secret_1.default });
        fastify.post('/login', (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const user = yield users.findOne({ email: req.body.email });
            if (user) {
                bcryptjs_1.default.compare(req.body.password, user.password, function (err, _res) {
                    if (err) {
                        // TODO: Improve error handling
                        return 'Invalid password';
                    }
                    else {
                        const token = fastify.jwt.sign({ email: req.body.email });
                        reply.send({ 'jwt': token });
                    }
                });
            }
            else {
                // TODO: Improve error handling
                return 'Invalid user email';
            }
        }));
        fastify.get('/users/me', (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.authorization.split('Bearer ')[1];
            const decoded = fastify.jwt.verify(token);
            if (decoded) {
                const filter = { email: decoded.email };
                const exclude = { projection: { password: 0 } };
                // TODO: See if I can avoid using projection and get away with <ClientUser> instead
                const user = yield users.findOne(filter, exclude);
                reply
                    .header('Authorization', `Bearer ${token}`)
                    .send({ user: user });
            }
            else {
                // TODO: Improve error handling
                return 'Invalid credentials';
            }
        }));
        fastify.post('/users/register', (req, reply) => {
            const newUser = req.body;
            const passwordPlain = req.body.password;
            bcryptjs_1.default.genSalt(10, function (err, salt) {
                bcryptjs_1.default.hash(passwordPlain, salt, function (err, hash) {
                    return __awaiter(this, void 0, void 0, function* () {
                        newUser.password = hash;
                        const insertionResult = yield users.insertOne(newUser);
                        reply
                            .code(201)
                            .send(insertionResult);
                    });
                });
            });
        });
    });
}
exports.default = usersRoutes;
//# sourceMappingURL=users.js.map