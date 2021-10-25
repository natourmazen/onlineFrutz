const request = require("supertest");
const app = require("../../../startup/app");
const { Transaction } = require("../../../models/transaction");
const { Fruit } = require("../../../models/fruit");

jest.mock("../../../middleware/login", () =>
  jest.fn((req, res, next) => next())
);
jest.mock("../../../middleware/shopOwner", () =>
  jest.fn((req, res, next) => next())
);
jest.mock("../../../helperFunctions/validateQuantity", () =>
  jest.fn(fruit).mockResolvedValue(true)
);

const fruit = {
  name: "strawberry",
  quantity: 1,
  price: 3,
};

const user2 = {
  user: {
    email: "example@example.com",
    password: "12345678",
    isShopOwner: true,
  },
};

let transaction1 = {
  userId: "1234",
  fruitInfo: [{ name: "strawberry", quantity: 2 }],
  totalPrice: 6,
  date: Date.now(),
};

let transaction2 = {
  userId: "1234",
  totalPrice: 6,
  date: Date.now(),
};

// describe("GET /api/transactions", () => {
//   it("should return all transactions if user is shop owner", async () => {
//     Transaction.find = jest.fn(() => Transaction);
//     Transaction.sort = jest.fn().mockResolvedValue(transaction1);

//     const response = await request(app).get("/api/transactions").send(user2);
//     console.log(response.text);

//     expect(response.statusCode).toBe(200);
//   });
// });

describe("GET /api/transactions/:id", () => {
  it("should return an error if user has no transactions", async () => {
    Transaction.find = jest.fn(() => []);
    const response = await request(app).get("/api/transactions/123");
    expect(response.statusCode).toBe(404);
  });

  it("should return all transactions of user", async () => {
    Transaction.find = jest.fn(() => transaction1);
    const response = await request(app).get("/api/transactions/1234");
    expect(response.statusCode).toBe(200);
  });
});

describe("POST /api/transactions", () => {
  let fruitInfo = [{ name: "strawberry" }];
  it("should return an error if request is not valid", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .send(fruitInfo);
    expect(response.statusCode).toBe(400);
  });

  it("should return not enough quantity in stock if the quantity requested is more than the quantity in stock", async () => {
    fruitInfo = { fruitInfo: [{ name: "strawberry", quantity: 2 }] };
    const response = await request(app)
      .post("/api/transactions")
      .send(fruitInfo);
    console.log(response.text);
    expect(response.statusCode).toBe(444);
  });
});
