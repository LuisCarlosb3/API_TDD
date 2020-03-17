const request = require("supertest");
const app = require("../../src/app");
const User = require("../../models/index").user;
const Account = require("../../models/index").account;
const MAIN_ROUTE = "/accounts";
let user;
let account;
beforeAll(async () => {
  user = await User.create({
    name: "already",
    email: `${Date.now()}toFail@email.com`,
    password: "123456"
  });
  account = await Account.create({
    name: "new Account",
    user_id: user.id
  });
});
describe("Inserções", () => {
  test("Deve inserir uma conta com sucesso", async () => {
    const response = await request(app)
      .post(MAIN_ROUTE)
      .send({ name: "Acc #1", user_id: user.id });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Acc #1");
  });
  test("Não deve inserir uma conta sem nome", async () => {
    const response = await request(app)
      .post(MAIN_ROUTE)
      .send({ user_id: user.id });
    expect(response.status).toBe(400);
    expect(response.body.error).not.toBeNull();
  });
  test.skip("Não deve inserir uma conta de nome duplicado para o mesmo usuário", async () => {});
});
describe("Consultas", () => {
  test("Deve listar todas as contas", async () => {
    const response = await request(app).get(MAIN_ROUTE);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("Deve retornar uma conta por id", async () => {
    const response = await request(app).get(`${MAIN_ROUTE}/${account.id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("new Account");
  });
  test.skip("Deve listar apenas as contas do usuário", async () => {});
});
describe("Alterações", () => {
  test("Deve alterar uma conta", async () => {
    const response = await request(app)
      .put(`${MAIN_ROUTE}/${account.id}`)
      .send({ name: "Acc updated" });
    expect(response.status).toBe(200);
    expect(response.body).toBe(1);
  });
  test("Deve alterar uma conta e falhar", async () => {
    const response = await request(app)
      .put(`${MAIN_ROUTE}/${account.id * 3}`)
      .send({ name: "Acc updated" });
    expect(response.status).toBe(200);
    expect(response.body).toBe(0);
  });
  test.skip("Não deve alterar uma conta de outro usuário", async () => {});
});

test("Deve remover uma conta", async () => {
  const response = await request(app).delete(`${MAIN_ROUTE}/${account.id}`);
  expect(response.status).toBe(204);
});
