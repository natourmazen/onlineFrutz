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
        jest.setTimeout(100000);
        jest.useFakeTimers('legacy')
        Fruit.find = jest.fn().mockResolvedValue([
            strawberry, banana
        ]);
        Fruit.find.sort = jest.fn().mockResolvedValue([
            strawberry, banana
        ]);
    });
    it("should return with an array of fruit objects", async () => {
        
      const response = await request(app).get("/api/fruits");
      expect(response.body).toEqual([strawberry, banana]);
    //   expect(response.statusCode).toBe(200);
    });
  });