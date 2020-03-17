const request = require("supertest");
const app = require("../../src/app");
const User = require("../../models/index").user;
const email = `${Date.now()}single@email.com`;
const existingEmail = `${Date.now()}toFail@email.com`;
beforeAll(async () => {
  await User.destroy({ where: { email } });
  return User.create({
    name: "already",
    email: existingEmail,
    password: "123456"
  });
});

test("Deve listar todos os usuários", () => {
  return request(app)
    .get("/users")
    .then(res => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      // expect(res.body[0]).toHaveProperty("name", "Jhon Doe");
    });
});
describe("Teste de inserção", () => {
  test("Deve inserir o usuário com sucesso", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "Walter", email, password: "minhasenha" });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Walter");
    expect(response.body).not.toHaveProperty("password");
  });
  test.skip("Deve armazenar senha criptografada", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        name: "User crpto",
        email: `${Date.now()}crpt@email.com`,
        password: "toCrpt"
      });
    expect(response.status).toBe(201);
    const { id } = response.body;
    const user = await User.findOne({ where: { id }, raw: true });
    expect(user.password).not.toBeUndefined();
    expect(user.password).not.toBe("toCrpt");
  });
});
test("Não deve inserir usuário sem nome", () => {
  return request(app)
    .post("/users")
    .send({ email, password: "12346" })
    .then(res => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Campos obrigatórios não preenchidos");
    });
});
test("Não deve inserir usuário sem email", async () => {
  const result = await request(app)
    .post("/users")
    .send({ name: "Luis Carlos", password: "12346" });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe("Campos obrigatórios não preenchidos");
});
test("Não deve inserir usuário sem senha", async () => {
  const result = await request(app)
    .post("/users")
    .send({ name: "Luis Carlos", email });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe("Campos obrigatórios não preenchidos");
});
test("Não deve inserir usuário com email existente", () => {
  return request(app)
    .post("/users")
    .send({ name: "Walter test", email: existingEmail, password: "minhasenha" })
    .then(res => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Usuário já existente");
    });
});
