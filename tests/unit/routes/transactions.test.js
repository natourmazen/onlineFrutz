const request = require("supertest");
const app = require("../../../startup/app");
const { Transaction } = require("../../../models/transaction");
const { Fruit } = require("../../../models/fruit");
let { validateQuantity } = require("../../../helperFunctions/validateQuantity");
let login = require("../../../middleware/login");

jest.mock("../../../middleware/login", () =>
  jest.fn((req, res, next) => {
    req.user = {
      _id: "12323424",
      name: "example",
      email: "example@example.com",
      isShopOwner: false,
      iat: 1634914680,
    };
    next();
  })
);
jest.mock("../../../middleware/shopOwner", () =>
  jest.fn((req, res, next) => next())
);
jest.mock("../../../helperFunctions/validateQuantity", () => ({
  validateQuantity: jest.fn(() => false),
}));


let transaction1 = {
  userId: "1234",
  fruitInfo: [{ name: "strawberry", quantity: 2 }],
  totalPrice: 6,
  date: Date.now(),
};


let transaction2 = {
  userId: "1234",
  fruitInfo: [{ name: "banana", quantity: 2 }],
  totalPrice: 7,
  date: Date.now(),
};

describe("GET /api/transactions", () => {
  it("should return all transactions of all users if user is a shop owner", async () => {
    Transaction.find = jest.fn(() => Transaction);
    Transaction.sort = jest.fn().mockResolvedValue(transaction1);

    login.mockImplementation((req, res, next) => {
      req.user = { isShopOwner: true };
      next();
    });
    const response = await request(app).get("/api/transactions");

    expect(response.statusCode).toBe(200);
  });
  it("should return all transactions of user if user is not shop owner", async () => {
    Transaction.find = jest.fn(() => Transaction);
    Transaction.sort = jest.fn().mockResolvedValue(transaction1);

    login.mockImplementation((req, res, next) => {
      req.user = { isShopOwner: false };
      next();
    });

    const response = await request(app).get("/api/transactions");

    expect(response.statusCode).toBe(200);
  });
});

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

  it("should return an exception occurred with database", async () => {
    Transaction.find = jest.fn(() => {
      throw new Error();
    });
    const response = await request(app).get("/api/transactions/1234");
    expect(response.statusCode).toBe(500);
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

    validateQuantity.mockImplementation(() => true);

    const response = await request(app)
      .post("/api/transactions")
      .send(fruitInfo);
    expect(response.statusCode).toBe(400);
  });

  it("should return an error if error occurred in try block ", async () => {
    fruitInfo = { fruitInfo: [{ name: "strawberry", quantity: 2 }] };

    validateQuantity.mockImplementation(() => false);

    jest.spyOn(Transaction, "find").mockImplementation(() => {
      throw new Error();
    });

    const response = await request(app)
      .post("/api/transactions")
      .send(fruitInfo);
    expect(response.error);
  });

  it("should return an error if total amount of a fruit bought and to buy is more than 2 in the last 24 hours", async () => {
    fruitInfo = {
      fruitInfo: [
        { name: "strawberry", quantity: 2 },
        { name: "banana", quantity: 2 },
      ],
    };

    validateQuantity.mockImplementation(() => false);

    let transactions = [transaction1, transaction2];
    jest.spyOn(Transaction, "find").mockImplementation(() => {
      return transactions;
    });

    const response = await request(app)
      .post("/api/transactions")
      .send(fruitInfo);

    expect(response.statusCode).toBe(400);
  });

  it("should return an exception if a database error occurred while getting the object of banana", async () => {
    fruitInfo = {
      fruitInfo: [
        { name: "strawberry", quantity: 2 },
        { name: "banana", quantity: 2 },
      ],
    };

    validateQuantity.mockImplementation(() => false);

    jest.spyOn(Transaction, "find").mockImplementation(() => {
      return [];
    });

    jest.spyOn(Fruit, "findOne").mockImplementation(() => {
      throw new Error();
    });

    const response = await request(app)
      .post("/api/transactions")
      .send(fruitInfo);

    expect(response.statusCode).toBe(500);
  });

  it("should return an exception if a database error occurred while getting the object of strawberry", async () => {
    fruitInfo = {
      fruitInfo: [
        { name: "strawberry", quantity: 2 },
        { name: "banana", quantity: 2 },
      ],
    };

    validateQuantity.mockImplementation(() => false);

    jest.spyOn(Transaction, "find").mockImplementation(() => {
      return [];
    });

    jest.spyOn(Fruit, "findOne").mockImplementation((fruit) => {
      if (fruit.name == "strawberry") throw new Error();
    });

    const response = await request(app)
      .post("/api/transactions")
      .send(fruitInfo);

    expect(response.statusCode).toBe(500);
  });
  it("should return an exception if a database error occurred while getting the price of strawberry", async () => {
    fruitInfo = {
      fruitInfo: [
        { name: "strawberry", quantity: 2 },
        { name: "banana", quantity: 2 },
      ],
    };

    validateQuantity.mockImplementation(() => false);

    jest.spyOn(Transaction, "find").mockImplementation(() => {
      return [];
    });

    jest.spyOn(Fruit, "findOne").mockImplementation((fruit) => {
      return;
    });

    const response = await request(app)
      .post("/api/transactions")
      .send(fruitInfo);

    expect(response.statusCode).toBe(500);
  });

  it("should return an exception if a database error occurred while getting the price of banana", async () => {
    fruitInfo = {
      fruitInfo: [
        { name: "strawberry", quantity: 2 },
        { name: "banana", quantity: 2 },
      ],
    };

    validateQuantity.mockImplementation(() => false);

    jest.spyOn(Transaction, "find").mockImplementation(() => {
      return [];
    });

    jest.spyOn(Fruit, "findOne").mockImplementation((fruit) => {
      if (fruit.name == "strawberry") return {};
    });

    const response = await request(app)
      .post("/api/transactions")
      .send(fruitInfo);

    expect(response.statusCode).toBe(500);
  });

  it("should return transaction", async () => {
    fruitInfo = {
      fruitInfo: [
        { name: "strawberry", quantity: 2 },
        { name: "banana", quantity: 2 },
      ],
    };

    validateQuantity.mockImplementation(() => false);

    jest.spyOn(Transaction, "find").mockImplementation(() => {
      return [];
    });

    jest.spyOn(Fruit, "findOne").mockImplementation(() => {
      return { price: 2 };
    });

    jest
      .spyOn(Transaction.prototype, "save")
      .mockImplementation(() => [{ transaction: "Test" }]);

    jest.spyOn(Fruit, "updateOne").mockImplementation();

    const response = await request(app)
      .post("/api/transactions")
      .send(fruitInfo);

    expect(response.statusCode).toBe(200);
  });

  it("should return an exception if an error occurred while saving or updating", async () => {
    fruitInfo = {
      fruitInfo: [
        { name: "strawberry", quantity: 2 },
        { name: "banana", quantity: 2 },
      ],
    };

    validateQuantity.mockImplementation(() => false);

    jest.spyOn(Transaction, "find").mockImplementation(() => {
      return [];
    });

    jest.spyOn(Fruit, "findOne").mockImplementation(() => {
      return { price: 2 };
    });

    jest.spyOn(Transaction.prototype, "save").mockImplementation(() => {
      throw new Error();
    });

    const response = await request(app)
      .post("/api/transactions")
      .send(fruitInfo);

    expect(response.statusCode).toBe(500);
  });
});
