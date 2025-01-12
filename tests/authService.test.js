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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const userModel_1 = __importDefault(require("../src/models/userModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
describe('Auth Services', () => {
    let user;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        user = yield userModel_1.default.create({
            username: 'testuser',
            email: 'test@example.com',
            password: '$2y$10$fHT9wOeac8Dg9BcXPY7d4O5wvWMN0bT4dDoAEz8C6nxdUZwaQ96.e',
        });
        yield user.save();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield userModel_1.default.deleteMany({});
    }));
    describe('POST /api/auth/signup', () => {
        it('should register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/auth/signup')
                .send({
                username: 'jane_doe',
                email: 'jane.doe@example.com',
                password: 'Password123',
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user.email).toBe('jane.doe@example.com');
        }));
        it('should not register an existing user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/auth/signup')
                .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'Password123',
            });
            expect(response.status).toBe(409);
            expect(response.body.error).toBe('Utilisateur déjà existant');
        }));
    });
    describe('POST /api/auth/signin', () => {
        it('should login a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/auth/signin')
                .send({
                email: 'test@example.com',
                password: 'Password123',
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        }));
        it('should not login a non-registered user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/auth/signin')
                .send({
                email: 'nonexistent@myges.fr',
                password: 'Password123',
            });
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Utilisateur non trouvé');
        }));
        it('should not login with invalid password', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/auth/signin')
                .send({
                email: 'test@example.com',
                password: 'wrongpassword',
            });
            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Identifiants invalides');
        }));
    });
});
