// tests/pixcell.test.ts
import request from 'supertest';
import { app } from '../src/app';
import User, { IUser } from '../src/models/userModel';
import Pixcell, { IPixcell } from '../src/models/pixcellModel';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

describe('Pixcell API Endpoints', () => {
    let user: any;
    let token: string;
    let userId: string;

    beforeEach(async () => {
        user = await User.create({
            username: 'testuser',
            email: 'test@example.com',
            password: '$2y$10$fHT9wOeac8Dg9BcXPY7d4O5wvWMN0bT4dDoAEz8C6nxdUZwaQ96.e',
        });
        await user.save();

        userId = user._id;

        token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    });

    afterEach(async () => {
        await User.deleteMany({});
        await Pixcell.deleteMany({});
    });

    describe('POST /api/pixcells/', () => {
        it('should create a new Pixcell', async () => {
            const response = await request(app)
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
        });

        it('should not create Pixcell with invalid data', async () => {
            const response = await request(app)
                .post('/api/pixcells/')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    data: "invalid data"
                });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /api/pixcells/', () => {
        it('should get all Pixcells of the user', async () => {

            for (let i: number = 0; i <= 2; i++) {
                await Pixcell.create({
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

            const response = await request(app)
                .get('/api/pixcells/')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('pixcells');
            expect(response.body.pixcells.length).toBe(3);
        });
    });

    describe('GET /api/pixcells/:id', () => {
        it('should get a specific Pixcell by ID', async () => {
            const pixcell = await Pixcell.create({
                userId,
                creationDate: Date.now(),
                data: [
                    [
                        { r: 70, g: 80, b: 90 },
                        { r: 100, g: 110, b: 120 }
                    ]
                ]
            }) as IPixcell;

            const response = await request(app)
                .get(`/api/pixcells/${pixcell._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('pixcell');
        });

        it('should return 404 for non-existent Pixcell', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .get(`/api/pixcells/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Pixcell non trouvé.');
        });

        it('should return 400 for invalid Pixcell ID', async () => {
            const response = await request(app)
                .get('/api/pixcells/invalid-id')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'ID de Pixcell invalide.');
        });
    });

    describe('PUT /api/pixcells/:id', () => {
        it('should update a Pixcell', async () => {
            const pixcell = await Pixcell.create({
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
            }) as IPixcell;

            const response = await request(app)
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
        });

        it('should not update Pixcell with invalid data', async () => {
            const pixcell = await Pixcell.create({
                userId,
                creationDate: Date.now(),
                data: [
                    [
                        { r: 5, g: 10, b: 15 },
                        { r: 20, g: 25, b: 30 }
                    ]
                ]
            }) as IPixcell;

            const response = await request(app)
                .put(`/api/pixcells/${pixcell._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    data: "invalid data"
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should return 404 for non-existent Pixcell', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
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
        });

        it('should return 403 when updating Pixcell of another user', async () => {
            // Créer un autre utilisateur
            const otherUser = await User.create({
                username: 'otheruser',
                email: 'other@example.com',
                password: 'password456',
            }) as IUser;
            const otherUserId = otherUser._id;
            jwt.sign({ id: otherUserId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
            const pixcell = await Pixcell.create({
                userId: otherUserId,
                creationDate: Date.now(),
                data: [
                    [
                        { r: 100, g: 100, b: 100 }
                    ]
                ]
            }) as IPixcell;

            const response = await request(app)
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
        });
    });

    describe('DELETE /api/pixcells/:id', () => {
        it('should delete a Pixcell', async () => {
            const pixcell = await Pixcell.create({
                userId,
                creationDate: Date.now(),
                data: [
                    [
                        { r: 10, g: 20, b: 30 }
                    ]
                ]
            }) as IPixcell;

            const response = await request(app)
                .delete(`/api/pixcells/${pixcell._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Pixcell supprimé avec succès.');

            const deletedPixcell = await Pixcell.findById(pixcell._id);
            expect(deletedPixcell).toBeNull();
        });

        it('should return 404 for non-existent Pixcell', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .delete(`/api/pixcells/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Pixcell non trouvé.');
        });

        it('should return 403 when deleting Pixcell of another user', async () => {
            const otherUser = await User.create({
                username: 'otheruser2',
                email: 'other2@example.com',
                password: 'password789',
            }) as IUser;
            const otherUserId = otherUser._id;
            jwt.sign({ id: otherUserId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
            const pixcell = await Pixcell.create({
                userId: otherUserId,
                creationDate: Date.now(),
                data: [
                    [
                        { r: 50, g: 60, b: 70 }
                    ]
                ]
            }) as IPixcell;

            const response = await request(app)
                .delete(`/api/pixcells/${pixcell._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('error', 'Accès refusé. Vous ne pouvez pas supprimer ce Pixcell.');
        });
    });

    describe('GET /api/pixcells/all', () => {
        it('should get all Pixcells', async () => {
            await Pixcell.create({
                userId,
                creationDate: Date.now(),
                data: [
                    [
                        { r: 1, g: 2, b: 3 }
                    ]
                ]
            }) as IPixcell;
            await Pixcell.create({
                userId,
                creationDate: Date.now(),
                data: [
                    [
                        { r: 4, g: 5, b: 6 }
                    ]
                ]
            }) as IPixcell;

            const response = await request(app)
                .get('/api/pixcells/all')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('pixcells');
            expect(response.body.pixcells.length).toBeGreaterThanOrEqual(2);
        });
    });
});
