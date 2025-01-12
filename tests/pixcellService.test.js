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
// tests/pixcell.test.ts
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const userModel_1 = __importDefault(require("../src/models/userModel"));
const pixcellModel_1 = __importDefault(require("../src/models/pixcellModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
describe('Pixcell API Endpoints', () => {
    let user;
    let token;
    let userId;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        user = yield userModel_1.default.create({
            username: 'testuser',
            email: 'test@example.com',
            password: '$2y$10$fHT9wOeac8Dg9BcXPY7d4O5wvWMN0bT4dDoAEz8C6nxdUZwaQ96.e',
        });
        yield user.save();
        userId = user._id;
        token = jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield userModel_1.default.deleteMany({});
        yield pixcellModel_1.default.deleteMany({});
    }));
    describe('POST /api/pixcells/', () => {
        it('should create a new Pixcell', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/pixcells/')
                .set('Authorization', `Bearer ${token}`)
                .send({
                data: [
                    [
                        { r: 255, g: 255, b: 255 },
                        { r: 0, g: 0, b: 0 }
                    ],
                    [
                        { r: 128, g: 128, b: 128 },
                        { r: 64, g: 64, b: 64 }
                    ]
                ]
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('pixcell');
            expect(response.body.pixcell).toHaveProperty('data');
            expect(response.body.pixcell.data.length).toBe(2);
        }));
        it('should not create Pixcell with invalid data', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .post('/api/pixcells/')
                .set('Authorization', `Bearer ${token}`)
                .send({
                data: "invalid data"
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        }));
    });
    describe('GET /api/pixcells/', () => {
        it('should get all Pixcells of the user', () => __awaiter(void 0, void 0, void 0, function* () {
            for (let i = 0; i <= 2; i++) {
                yield pixcellModel_1.default.create({
                    userId,
                    creationDate: Date.now(),
                    data: [
                        [
                            { r: 10, g: 20, b: 30 },
                            { r: 40, g: 50, b: 60 }
                        ]
                    ]
                });
            }
            const response = yield (0, supertest_1.default)(app_1.app)
                .get('/api/pixcells/')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('pixcells');
            expect(response.body.pixcells.length).toBe(3);
        }));
    });
    describe('GET /api/pixcells/:id', () => {
        it('should get a specific Pixcell by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const pixcell = yield pixcellModel_1.default.create({
                userId,
                creationDate: Date.now(),
                data: [
                    [
                        { r: 70, g: 80, b: 90 },
                        { r: 100, g: 110, b: 120 }
                    ]
                ]
            });
            const response = yield (0, supertest_1.default)(app_1.app)
                .get(`/api/pixcells/${pixcell._id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('pixcell');
        }));
        it('should return 404 for non-existent Pixcell', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeId = new mongoose_1.default.Types.ObjectId();
            const response = yield (0, supertest_1.default)(app_1.app)
                .get(`/api/pixcells/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Pixcell non trouvé.');
        }));
        it('should return 400 for invalid Pixcell ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app)
                .get('/api/pixcells/invalid-id')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'ID de Pixcell invalide.');
        }));
    });
    describe('PUT /api/pixcells/:id', () => {
        it('should update a Pixcell', () => __awaiter(void 0, void 0, void 0, function* () {
            const pixcell = yield pixcellModel_1.default.create({
                userId,
                creationDate: Date.now(),
                data: [
                    [
                        { r: 5, g: 10, b: 15 },
                        { r: 20, g: 25, b: 30 }
                    ],
                    [
                        { r: 35, g: 40, b: 45 },
                        { r: 50, g: 55, b: 60 }
                    ]
                ]
            });
            const response = yield (0, supertest_1.default)(app_1.app)
                .put(`/api/pixcells/${pixcell._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                data: [
                    [
                        { r: 255, g: 0, b: 0 },
                        { r: 0, g: 255, b: 0 }
                    ],
                    [
                        { r: 0, g: 0, b: 255 },
                        { r: 255, g: 255, b: 0 }
                    ]
                ]
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('pixcell');
            expect(response.body.pixcell.data[0][0]).toMatchObject({ r: 255, g: 0, b: 0 });
        }));
        it('should not update Pixcell with invalid data', () => __awaiter(void 0, void 0, void 0, function* () {
            const pixcell = yield pixcellModel_1.default.create({
                userId,
                creationDate: Date.now(),
                data: [
                    [
                        { r: 5, g: 10, b: 15 },
                        { r: 20, g: 25, b: 30 }
                    ]
                ]
            });
            const response = yield (0, supertest_1.default)(app_1.app)
                .put(`/api/pixcells/${pixcell._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                data: "invalid data"
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        }));
        it('should return 404 for non-existent Pixcell', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeId = new mongoose_1.default.Types.ObjectId();
            const response = yield (0, supertest_1.default)(app_1.app)
                .put(`/api/pixcells/${fakeId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                data: [
                    [
                        { r: 255, g: 255, b: 255 }
                    ]
                ]
            });
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Pixcell non trouvé.');
        }));
        it('should return 403 when updating Pixcell of another user', () => __awaiter(void 0, void 0, void 0, function* () {
            // Créer un autre utilisateur
            const otherUser = yield userModel_1.default.create({
                username: 'otheruser',
                email: 'other@example.com',
                password: 'password456',
            });
            const otherUserId = otherUser._id;
            jsonwebtoken_1.default.sign({ id: otherUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const pixcell = yield pixcellModel_1.default.create({
                userId: otherUserId,
                creationDate: Date.now(),
                data: [
                    [
                        { r: 100, g: 100, b: 100 }
                    ]
                ]
            });
            const response = yield (0, supertest_1.default)(app_1.app)
                .put(`/api/pixcells/${pixcell._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                data: [
                    [
                        { r: 0, g: 0, b: 0 }
                    ]
                ]
            });
            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('error', 'Accès refusé. Vous ne pouvez pas modifier ce Pixcell.');
        }));
    });
    describe('DELETE /api/pixcells/:id', () => {
        it('should delete a Pixcell', () => __awaiter(void 0, void 0, void 0, function* () {
            const pixcell = yield pixcellModel_1.default.create({
                userId,
                creationDate: Date.now(),
                data: [
                    [
                        { r: 10, g: 20, b: 30 }
                    ]
                ]
            });
            const response = yield (0, supertest_1.default)(app_1.app)
                .delete(`/api/pixcells/${pixcell._id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Pixcell supprimé avec succès.');
            const deletedPixcell = yield pixcellModel_1.default.findById(pixcell._id);
            expect(deletedPixcell).toBeNull();
        }));
        it('should return 404 for non-existent Pixcell', () => __awaiter(void 0, void 0, void 0, function* () {
            const fakeId = new mongoose_1.default.Types.ObjectId();
            const response = yield (0, supertest_1.default)(app_1.app)
                .delete(`/api/pixcells/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Pixcell non trouvé.');
        }));
        it('should return 403 when deleting Pixcell of another user', () => __awaiter(void 0, void 0, void 0, function* () {
            const otherUser = yield userModel_1.default.create({
                username: 'otheruser2',
                email: 'other2@example.com',
                password: 'password789',
            });
            const otherUserId = otherUser._id;
            jsonwebtoken_1.default.sign({ id: otherUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const pixcell = yield pixcellModel_1.default.create({
                userId: otherUserId,
                creationDate: Date.now(),
                data: [
                    [
                        { r: 50, g: 60, b: 70 }
                    ]
                ]
            });
            const response = yield (0, supertest_1.default)(app_1.app)
                .delete(`/api/pixcells/${pixcell._id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('error', 'Accès refusé. Vous ne pouvez pas supprimer ce Pixcell.');
        }));
    });
    describe('GET /api/pixcells/all', () => {
        it('should get all Pixcells', () => __awaiter(void 0, void 0, void 0, function* () {
            // Créer quelques Pixcells
            yield pixcellModel_1.default.create({
                userId,
                creationDate: Date.now(),
                data: [
                    [
                        { r: 1, g: 2, b: 3 }
                    ]
                ]
            });
            yield pixcellModel_1.default.create({
                userId,
                creationDate: Date.now(),
                data: [
                    [
                        { r: 4, g: 5, b: 6 }
                    ]
                ]
            });
            const response = yield (0, supertest_1.default)(app_1.app)
                .get('/api/pixcells/all')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('pixcells');
            expect(response.body.pixcells.length).toBeGreaterThanOrEqual(2);
        }));
    });
});
