/* eslint-disable no-unused-vars */
const request = require("supertest");
const app = require("../../src/app");
const User = require("../../models/index").user;
const bcrypt = require("../../src/utils/bcrypt");
let userCreated;
let created;
beforeAll(async () => {
  const password = await bcrypt.hashPassword("123456789");
  [userCreated, created] = await User.findOrCreate({
    where: {
      email: "emailtologin@login.com",
      name: "toLogin",
      password
    }
  });
});
test("Deve criar usuário via signup", async () => {
  const response = await request(app)
    .post("/auth/signup")
    .send({
      name: "Walter",
      email: `${Date.now()}sinup@email.com`,
      password: "minhasenha"
    });
  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty("name");
  expect(response.body).not.toHaveProperty("password");
});
test("Deve receber token ao logar", async () => {
  const response = await request(app)
    .post("/auth/signin")
    .send({ email: "emailtologin@login.com", password: "123456789" });
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("token");
});
test("Não deve autenticar usuário com senha errada", async () => {
  const response = await request(app)
    .post("/auth/signin")
    .send({ email: "emailtologin@login.com", password: "987654321" });
  expect(response.status).toBe(400);
  expect(response.body).not.toHaveProperty("token");
  expect(response.body.error).toBe("Usuário ou senha errados");
});
test("Não deve autenticar usuário com email invalido", async () => {
  const response = await request(app)
    .post("/auth/signin")
    .send({ email: "emailtoNOTlogin@login.com", password: "987654321" });
  expect(response.status).toBe(400);
  expect(response.body).not.toHaveProperty("token");
  expect(response.body.error).toBe("Usuário ou senha errados");
});
test("Não deve acessar uma rota protegida sem toke", async () => {
  const response = await request(app).get("/users");
  expect(response.status).toBe(401);
});
