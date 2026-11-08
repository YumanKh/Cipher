import supertest from "supertest";
import app from "../app.js";
import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../lib/prisma.js";
import { config } from "../config.js";

if (!config.DATABASE_URL?.includes("cipher_test")) {
    throw new Error("Tests must run on the test database");
}

beforeEach(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    await prisma.note.deleteMany();
    await prisma.passwords.deleteMany();
});


describe("GET /passwords", () => {
    it("should return 401 if user ID is not provided", async () => {
        const response = await supertest(app).get("/passwords");
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 401 if user is not found", async () => {
        const response = await supertest(app).get("/passwords").set("Authorization", "Bearer invalid_token");
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 200 and passwords for a valid user", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const token = user.body.tokens.accessToken;
        const response = await supertest(app).get("/passwords").set("Authorization", `Bearer ${token}`);
        expect(user.status).toBe(201);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ passwords: [] });
    });

    it.todo("should handle server errors gracefully");
});

describe("POST /passwords", () => {
    it("should return 401 if user ID is not provided", async () => {
        const response = await supertest(app).post("/passwords").send({
            title: "Test Password",
            content: "This is a test password",
            iv: "iv123"
        });
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 400 if title, iv or content is missing", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const token = user.body.tokens.accessToken;
        const response = await supertest(app).post("/passwords").set("Authorization", `Bearer ${token}`).send({
            title: "Test Password",
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Title, IV, and content are required" });
    });

    it("should return 201 and the created password for a valid user without a link", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const token = user.body.tokens.accessToken;
        const response = await supertest(app).post("/passwords").set("Authorization", `Bearer ${token}`).send({
            title: "Test Password",
            content: "This is a test password",
            iv: "iv123"
        });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            password: {
                id: expect.any(Number),
                title: "Test Password",
                link: null,
                content: "This is a test password",
                iv: "iv123",
            },
        });
    });

    it.todo("should handle server errors gracefully");
});

describe("PATCH /passwords/:id", () => {
    it("should return 401 if user ID is not provided", async () => {
        const response = await supertest(app).patch("/passwords/1").send({noteId: 1, isFavorite: true});
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 400 if isFavorite is invalid", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const password = await supertest(app).post("/passwords").set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({
            title: "Test Passwords",
            content: "This is a test password",
            iv: "iv123"
        });

        const token = user.body.tokens.accessToken;
        const response = await supertest(app).patch(`/passwords/${password.body.password.id}`).set("Authorization", `Bearer ${token}`).send({noteId: 1, isFavorite: "true"});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Invalid update data" });
    });

    it("should return 400 for no update data provided", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const password = await supertest(app).post("/passwords").set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({
            title: "Test Password",
            content: "This is a test password",
            iv: "iv123" 
        });

        const response = await supertest(app).patch(`/passwords/${password.body.password.id}`).set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Invalid update data" });
    });

    it("should return 404 if password is not found", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        await supertest(app).post("/passwords").set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({
            title: "Test Password",
            content: "This is a test password",
            iv: "iv123"
        });

        const token = user.body.tokens.accessToken;
        const response = await supertest(app).patch(`/passwords/99999`).set("Authorization", `Bearer ${token}`).send({isFavorite: true});
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Password not found" });
    });

    it("should return 404 if a user tries to update a password that doesn't belong to them", async () => {
        const user1 = await supertest(app).post("/auth/register").send({
            name: "User One",
            email: "user1@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const user2 = await supertest(app).post("/auth/register").send({
            name: "User Two",
            email: "user2@example.com",
            authValue: "password456",
            cryptingKey: "key456",
            kdfSalt: "salt456",
        });

        const password = await supertest(app).post("/passwords").set("Authorization", `Bearer ${user1.body.tokens.accessToken}`).send({
            title: "Test Password",
            content: "This is a test password",
            iv: "iv123"
        });

        const response = await supertest(app).patch(`/passwords/${password.body.password.id}`).set("Authorization", `Bearer ${user2.body.tokens.accessToken}`).send({isFavorite: true});
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Password not found" });
    });

    it("should return 200 and the updated password for a valid password", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const password = await supertest(app).post("/passwords").set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({
            title: "Test Password",
            content: "This is a test password",
            iv: "iv123"
        });

        const response = await supertest(app).patch(`/passwords/${password.body.password.id}`).set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({title: "Updated Title", content: "Updated Content", isFavorite: true, iv: "iv456"});

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ updated: true });
    });

    it("should return 200 and the favorite status for a valid password", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const password = await supertest(app).post("/passwords").set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({
            title: "Test Password",
            content: "This is a test password",
            iv: "iv123"
        });

        const response = await supertest(app).patch(`/passwords/${password.body.password.id}`).set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({isFavorite: true});

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ updated: true });
    });

    it("should return 200 and the updated title for a valid password", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const password = await supertest(app).post("/passwords").set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({
            title: "Test Password",
            content: "This is a test password",
            iv: "iv123"
        });

        const response = await supertest(app).patch(`/passwords/${password.body.password.id}`).set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({title: "Updated Title", content: "Updated Content", iv: "iv456"});

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ updated: true });
    });

    it("should return 200 and the updated content for a valid password", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const password = await supertest(app).post("/passwords").set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({
            title: "Test Password",
            content: "This is a test password",
            iv: "iv123"
        });

        const response = await supertest(app).patch(`/passwords/${password.body.password.id}`).set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({title: "Updated Title", content: "Updated Content", iv: "iv456"});

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ updated: true });
    });

    it.todo("should handle server errors gracefully");
});