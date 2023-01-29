const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const dotenv = require('dotenv');
const User = require("../models/User");

dotenv.config();

beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

  return;
});

afterEach(async () => {
  await mongoose.connection.close();

  return;
});

// Deletes testUser after all tests are done
afterAll(async () => {
  await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteOne({ username: testUser.username });
  await mongoose.connection.close();

  return;
})

const testUser = {
  "username": "testUser",
  "email": "testUser@test.com",
  "password": "testUser090",
};

describe("POST /api/auth/register", () => {
  it("Should return created testUser", async () => {

    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe(testUser.username);
    expect(res.body.email).toBe(testUser.email);

    return;
  });
});


describe("POST api/auth/login", () => {
  it("Should login the testUser", async () => {

    const res = await request(app).post(`/api/auth/login`).send({
      email: testUser.email,
      password: testUser.password
    });

    expect(res.statusCode).toBe(200);

    return;
  });
});