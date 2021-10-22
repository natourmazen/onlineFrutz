const request = require('supertest');
const app = require('../../../startup/app');
const { Fruit } = require("../../../models/fruit");

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (token) => {
    const req = {};
    req.header = jest.fn().mockReturnValue(token);
    return req;
};



const strawberry = {
    name: 'strawberry',
    quantity: 4,
    price: 2.5
};
const banana = {
    name: 'banana',
    quantity: 2,
    price: 1
};
describe("GET /api/fruits ", () => {
    beforeAll(() => {
        Fruit.find = jest.fn(() => Fruit);
        Fruit.sort = jest.fn().mockResolvedValue([
            strawberry, banana
        ]);
    });
    it("should return an array of fruit objects", async () => {

        const response = await request(app).get("/api/fruits");
        expect(response.body).toEqual([strawberry, banana]);
        expect(response.statusCode).toBe(200);
    });
});

describe("GET /api/fruits/:name ", () => {
    
    it("should return the fruit object given", async () => {
        Fruit.findOne = jest.fn(() => strawberry);
        const response = await request(app).get("/api/fruits/strawberry");
        expect(response.body).toEqual(strawberry);
        expect(response.statusCode).toBe(200);
    });

    it("should return an error if fruit does not exist", async () => {
        Fruit.findOne = jest.fn();
        const response = await request(app).get("/api/fruits/strawberry");
        expect(response.statusCode).toBe(400);
    });
});