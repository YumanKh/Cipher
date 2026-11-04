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