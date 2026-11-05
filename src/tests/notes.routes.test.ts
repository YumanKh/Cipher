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
});

describe("GET /notes", () => {
    it("should return 401 if user ID is not provided", async () => {
        const response = await supertest(app).get("/notes");
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 401 if user is not found", async () => {
        const response = await supertest(app).get("/notes").set("Authorization", "Bearer invalid_token");
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 200 and notes for a valid user", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const token = user.body.tokens.accessToken;
        const response = await supertest(app).get("/notes").set("Authorization", `Bearer ${token}`);
        expect(user.status).toBe(201);
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it.todo("should handle server errors gracefully");
});

describe("POST /notes", () => {
    it("should return 401 if user ID is not provided", async () => {
        const response = await supertest(app).post("/notes").send({
            title: "Test Note",
            content: "This is a test note",
        });
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 400 if title or content is missing", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const token = user.body.tokens.accessToken;
        const response = await supertest(app).post("/notes").set("Authorization", `Bearer ${token}`).send({
            title: "Test Note",
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Title and content are required" });
    });

    it("should return 201 and the created note for a valid user", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const token = user.body.tokens.accessToken;
        const response = await supertest(app).post("/notes").set("Authorization", `Bearer ${token}`).send({
            title: "Test Note",
            content: "This is a test note",
        });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            note: {
                id: expect.any(Number),
                title: "Test Note",
                content: "This is a test note",
            },
        });
    });

    it.todo("should handle server errors gracefully");
});

describe("PATCH /notes/:id", () => {
    it("should return 401 if user ID is not provided", async () => {
        const response = await supertest(app).patch("/notes/1").send({noteId: 1, isFavorite: true});
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

        const note = await supertest(app).post("/notes").set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({
            title: "Test Note",
            content: "This is a test note",
        });

        const token = user.body.tokens.accessToken;
        const response = await supertest(app).patch(`/notes/${note.body.note.id}`).set("Authorization", `Bearer ${token}`).send({noteId: 1, isFavorite: "true"});
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

        const note = await supertest(app).post("/notes").set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({
            title: "Test Note",
            content: "This is a test note",
        });

        const response = await supertest(app).patch(`/notes/${note.body.note.id}`).set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Invalid update data" });
    });

    it("should return 404 if note is not found", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        await supertest(app).post("/notes").set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({
            title: "Test Note",
            content: "This is a test note",
        });

        const token = user.body.tokens.accessToken;
        const response = await supertest(app).patch(`/notes/99999`).set("Authorization", `Bearer ${token}`).send({isFavorite: true});
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Note not found" });
    });

    it("should return 404 if a user tries to update a note that doesn't belong to them", async () => {
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

        const note = await supertest(app).post("/notes").set("Authorization", `Bearer ${user1.body.tokens.accessToken}`).send({
            title: "Test Note",
            content: "This is a test note",
        });

        const response = await supertest(app).patch(`/notes/${note.body.note.id}`).set("Authorization", `Bearer ${user2.body.tokens.accessToken}`).send({isFavorite: true});
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Note not found" });
    });

    it("should return 200 and the updated note for a valid note", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const note = await supertest(app).post("/notes").set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({
            title: "Test Note",
            content: "This is a test note",
        });

        const response = await supertest(app).patch(`/notes/${note.body.note.id}`).set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({title: "Updated Title", content: "Updated Content", isFavorite: true});

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ updated: true });
    });

    it("should return 200 and the favorite status for a valid note", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const note = await supertest(app).post("/notes").set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({
            title: "Test Note",
            content: "This is a test note",
        });

        const response = await supertest(app).patch(`/notes/${note.body.note.id}`).set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({isFavorite: true});

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ updated: true });
    });

    it("should return 200 and the updated title for a valid note", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const note = await supertest(app).post("/notes").set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({
            title: "Test Note",
            content: "This is a test note",
        });

        const response = await supertest(app).patch(`/notes/${note.body.note.id}`).set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({title: "Updated Title"});

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ updated: true });
    });

    it("should return 200 and the updated content for a valid note", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const note = await supertest(app).post("/notes").set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({
            title: "Test Note",
            content: "This is a test note",
        });

        const response = await supertest(app).patch(`/notes/${note.body.note.id}`).set("Authorization", `Bearer ${user.body.tokens.accessToken}`).send({content: "Updated Content"});

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ updated: true });
    });

    it.todo("should handle server errors gracefully");
});