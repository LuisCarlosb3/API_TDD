const request = require("supertest");
const app = require("../../src/app");
const User = require("../../models/index").user;
const Account = require("../../models/index").account;
const jwt = require("jsonwebtoken");
const MAIN_ROUTE = "/accounts";
let user, secondUser;
let account;
beforeAll(async () => {
  user = await User.create({
    name: "already",
    email: `${Date.now()}toFail@email.com`,
    password: "123456"
  });
  secondUser = await User.create({
    name: "already",
    email: `${Date.now()}SecondtoFail@email.com`,
    password: "123456"
  });
  user.token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email
    },
    "secret"
  );
  secondUser.token = jwt.sign(
    {
      id: secondUser.id,
      name: secondUser.name,
      email: secondUser.email
    },
    "secret"
  );
  account = await Account.create({
    name: "new Account for update",
    user_id: user.id
  });
  await Account.create({
    name: "new Account",
    user_id: secondUser.id
  });
});
describe("Inserções", () => {
  test("Deve inserir uma conta com sucesso", async () => {
    const response = await request(app)
      .post(MAIN_ROUTE)
      .send({ name: "Acc #1" })
      .set("authorization", `Bearer ${user.token}`);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Acc #1");
  });
  test("Não deve inserir uma conta sem nome", async () => {
    const response = await request(app)
      .post(MAIN_ROUTE)
      .send()
      .set("authorization", `Bearer ${user.token}`);
    expect(response.status).toBe(400);
    expect(response.body.error).not.toBeNull();
  });
  test("Não deve inserir uma conta de nome duplicado para o mesmo usuário", async () => {
    const response = await request(app)
      .post(MAIN_ROUTE)
      .send({ name: "new Account" })
      .set("authorization", `Bearer ${secondUser.token}`);
    expect(response.status).toBe(400);
    expect(response.body.error).not.toBeNull();
  });
  test("Deve permitir que usuários diferentes tenham conta com mesmo nome", async () => {
    const response = await request(app)
      .post(MAIN_ROUTE)
      .send({ name: "new Account" })
      .set("authorization", `Bearer ${user.token}`);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe("new Account");
  });
});
describe("Consultas", () => {
  test("Deve listar todas as contas", async () => {
    const response = await request(app)
      .get(MAIN_ROUTE)
      .set("authorization", `Bearer ${user.token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("Deve retornar uma conta por id", async () => {
    const response = await request(app)
      .get(`${MAIN_ROUTE}/${account.id}`)
      .set("authorization", `Bearer ${user.token}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("new Account for update");
  });

  test("Deve listar apenas as contas do usuário", async () => {
    const response = await request(app)
      .get(MAIN_ROUTE)
      .set("authorization", `Bearer ${secondUser.token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].user_id).toBe(secondUser.id);
  });
});
describe("Alterações", () => {
  test("Deve alterar uma conta", async () => {
    const response = await request(app)
      .put(`${MAIN_ROUTE}/${account.id}`)
      .send({ name: "Acc updated" })
      .set("authorization", `Bearer ${user.token}`);
    expect(response.status).toBe(200);
    expect(response.body).toBe(1);
  });
  test("Deve alterar uma conta e falhar", async () => {
    const response = await request(app)
      .put(`${MAIN_ROUTE}/${account.id * 3}`)
      .send({ name: "Acc updated" })
      .set("authorization", `Bearer ${user.token}`);
    expect(response.status).toBe(403);
    expect(response.body.error).not.toBeNull();
  });
  test("Não deve alterar uma conta de outro usuário", async () => {
    const response = await request(app)
      .put(`${MAIN_ROUTE}/${account.id}`)
      .send({ name: "Acc updated" })
      .set("authorization", `Bearer ${secondUser.token}`);
    expect(response.status).toBe(403);
    expect(response.body.error).not.toBeNull();
  });
});
describe("Exclusão", () => {
  test("Não deve remover uma conta de outro usuário", async () => {
    const response = await request(app)
      .delete(`${MAIN_ROUTE}/${account.id}`)
      .set("authorization", `Bearer ${secondUser.token}`);
    expect(response.status).toBe(403);
    expect(response.body.error).not.toBeNull();
  });
  test("Deve remover uma conta", async () => {
    const response = await request(app)
      .delete(`${MAIN_ROUTE}/${account.id}`)
      .set("authorization", `Bearer ${user.token}`);
    expect(response.status).toBe(204);
  });
});

afterAll(() => {
  return Account.destroy({ where: {} });
});
