const request = require("supertest");
const app = require("../../src/app");
const User = require("../../models/index").user;
const Account = require("../../models/index").account;
const Transaction = require("../../models/index").transaction;

const bcrypt = require("../../src/utils/bcrypt");
const jwt = require("jsonwebtoken");
const MAIN_ROUTE = "/transactions";
let user, secondUser;
let userAccount;
let transaction;
beforeAll(async () => {
  await User.destroy({ where: {} });
  await Account.destroy({ where: {} });
  await Transaction.destroy({ where: {} });
  const password = await bcrypt.hashPassword("123456789");
  user = await User.create({
    email: "firstUser@login.com",
    name: "firstUser",
    password
  });
  secondUser = await User.create({
    email: "secondUser@login.com",
    name: "secondUser",
    password
  });
  userAccount = await Account.create({
    name: "user Account",
    user_id: user.id
  });
  await Account.create({
    name: "secondUser Account",
    user_id: secondUser.id
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
  transaction = await Transaction.create({
    description: "T1",
    type: "I",
    date: new Date(),
    ammout: 100,
    status: false,
    account_id: userAccount.id
  });
});
test("Deve listar apenas as transações do usuário", async () => {
  const response = await request(app)
    .get(MAIN_ROUTE)
    .set("authorization", `Bearer ${user.token}`);
  expect(response.status).toBe(200);
  expect(response.body).toHaveLength(1);
  // expect(response.body[0].description).toBe("T1");
});
test("Devo inserir uma transação com sucesso", async () => {
  const response = await request(app)
    .post(MAIN_ROUTE)
    .set("authorization", `Bearer ${user.token}`)
    .send({
      newTransaction: {
        description: "new T1",
        type: "I",
        date: new Date(),
        ammout: 100,
        status: false,
        account_id: userAccount.id
      }
    });
  expect(response.status).toBe(201);
  expect(response.body.account_id).toBe(userAccount.id);
});
test("Transações de entrada devem ser positivas", async () => {
  const response = await request(app)
    .post(MAIN_ROUTE)
    .set("authorization", `Bearer ${user.token}`)
    .send({
      newTransaction: {
        description: "new T1",
        type: "I",
        date: new Date(),
        ammout: 100,
        status: false,
        account_id: userAccount.id
      }
    });
  expect(response.status).toBe(201);
  expect(response.body.account_id).toBe(userAccount.id);
  expect(response.body.ammout).toBe("100.00");
});
test("Transações de saida devem ser negativas", async () => {
  const response = await request(app)
    .post(MAIN_ROUTE)
    .set("authorization", `Bearer ${user.token}`)
    .send({
      newTransaction: {
        description: "new T1",
        type: "O",
        date: new Date(),
        ammout: 100,
        status: false,
        account_id: userAccount.id
      }
    });
  expect(response.status).toBe(201);
  expect(response.body.account_id).toBe(userAccount.id);
  expect(response.body.ammout).toBe("-100.00");
});

describe("Inserção de transação invalida", () => {
  let validTransaction;

  beforeAll(() => {
    validTransaction = {
      description: "new Account",
      type: "O",
      date: new Date(),
      ammout: 100,
      status: false,
      account_id: userAccount.id
    };
  });
  const testTemplate = async newData => {
    const response = await request(app)
      .post(`${MAIN_ROUTE}`)
      .set("authorization", `Bearer ${user.token}`)
      .send({
        newTransaction: { ...validTransaction, ...newData }
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Campos obrigatórios não preenchidos ou inválidos"
    );
    return;
  };
  test("Não deve inserir sem descrição", async () =>
    testTemplate({ description: null }));
  test("Não deve inserir sem valor", async () =>
    testTemplate({ ammout: null }));
  test("Não deve inserir sem data", async () => testTemplate({ date: null }));
  test("Não deve inserir sem tipo", async () => testTemplate({ type: null }));
  test("Não deve inserir com tipo inválido", async () =>
    testTemplate({ type: "A" }));
  test("Não deve inserir sem conta", async () =>
    testTemplate({ account_id: null }));
});

test("Deve retornar uma transação pelo id", async () => {
  const response = await request(app)
    .get(`${MAIN_ROUTE}/${transaction.id}`)
    .set("authorization", `Bearer ${user.token}`);
  expect(response.status).toBe(200);
  expect(response.body.description).toBe(transaction.description);
});
test("Deve alterar uma transação por id", async () => {
  const response = await request(app)
    .put(`${MAIN_ROUTE}/${transaction.id}`)
    .send({ description: "Updated" })
    .set("authorization", `Bearer ${user.token}`);
  expect(response.status).toBe(200);
});
describe("Remoção de transações", () => {
  test("Devo remover uma transação", async () => {
    const response = await request(app)
      .delete(`${MAIN_ROUTE}/${transaction.id}`)
      .set("authorization", `Bearer ${user.token}`);
    expect(response.status).toBe(200);
  });
  test("Não deve remover uma transação de outro usuário", async () => {
    const response = await request(app)
      .delete(`${MAIN_ROUTE}/${transaction.id}`)
      .set("authorization", `Bearer ${secondUser.token}`);
    expect(response.status).toBe(403);
    expect(response.body.error).not.toBeNull();
  });
  test("Não deve remover uma conta com transação registrada", async () => {
    const response = await request(app)
      .delete(`/accounts/${userAccount.id}`)
      .set("authorization", `Bearer ${user.token}`);
    expect(response.status).toBe(400);
    expect(response.body.error).not.toBeNull();
    expect(response.body.error).toBe("Conta possui transações registradas");
  });
});
