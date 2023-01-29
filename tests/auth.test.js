const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const dotenv = require('dotenv');

dotenv.config();

beforeEach(async () => {
  mongoose.connect(process.env.MONGO_URL);
});

afterEach(async () => {
  await mongoose.connection.close();
});

const testUser = {
  "username": "testUser",
  "email": "testUser@test.com",
  "password": "testUser",
};

describe("POST /api/auth/register", () => {
  it("Should return created testUser", async () => {

    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('testUser');
    expect(res.body.email).toBe('testUser@test.com');
  });
});


describe("POST api/auth/login", () => {
  it("Should login the testUser", async () => {

    const res = await request(app).post(`/api/auth/login`).send({
      email: testUser.email,
      password: testUser.password
    });

    expect(res.statusCode).toBe(200);
  });
});


