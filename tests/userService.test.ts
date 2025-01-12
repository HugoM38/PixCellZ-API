import request from 'supertest';
import { app } from '../src/app';
import User, { IUser } from '../src/models/userModel';
import Pixcell, { IPixcell } from '../src/models/pixcellModel';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

describe('User API Endpoints', () => {
    let user: any;
    let token: any;
    let userId: any;

    beforeEach(async () => {
        user = await User.create({
            username: 'testuser',
            email: 'test@example.com',
            password: '$2y$10$fHT9wOeac8Dg9BcXPY7d4O5wvWMN0bT4dDoAEz8C6nxdUZwaQ96.e',
        }) as IUser;
        await user.save();

        userId = user._id;

        token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    });

    afterEach(async () => {
        await User.deleteMany({});
        await Pixcell.deleteMany({});
    });

    describe('GET /api/users/:id', () => {
        it('should retrieve username information when ID is valid', async () => {
            const response = await request(app)
                .get(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.user).toHaveProperty('username', 'testuser');
        });

        it('should retrieve username information of another user when ID is valid', async () => {
            const otherUser = await User.create({
                username: 'otheruser',
                email: 'other@example.com',
                password: 'password456',
            }) as IUser;
            const otherUserId = otherUser._id;

            const response = await request(app)
                .get(`/api/users/${otherUserId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.user).toHaveProperty('username', 'otheruser');
        });

        it('should return 404 when user is not found', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .get(`/api/users/${fakeId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Utilisateur non trouvé.');
        });

        it('should return 400 for invalid user ID', async () => {
            const response = await request(app)
                .get('/api/users/invalid-id')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'ID de l\'utilisateur invalide.');
        });

        it('should return 401 when no token is provided', async () => {
            const response = await request(app)
                .get(`/api/users/${userId}`);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'No token, authorization denied');
        });
    });
});
