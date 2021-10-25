const request = require("supertest");
const app = require("../../../startup/app");
let { Fruit } = require("../../../models/fruit");

const strawberry = {
    name: "strawberry",
    quantity: 4,
    price: 2.5,
};
const banana = {
    name: "banana",
    quantity: 2,
    price: 1,
};
describe("GET /api/fruits ", () => {
    beforeAll(() => {
        Fruit.find = jest.fn(() => Fruit);
        Fruit.sort = jest.fn().mockResolvedValue([strawberry, banana]);
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

// Mock MiddleWare Functions

jest.mock('../../../middleware/login', () => jest.fn((req, res, next) => next()))
jest.mock('../../../middleware/shopOwner', () => jest.fn((req, res, next) => next()))


describe("POST /api/fruits ", () => {
    it("should return an error if the request body does not have a name", async () => {
        let invalidBody = {
            quantity:1,
            price:1
        };
        const response = await request(app)
                            .post("/api/fruits")
                            .send(invalidBody);
        expect(response.statusCode).toBe(400);
    });

    // it("should return validation error if fruit name is already exists in database", async () => {
        
    //     const response = await request(app)
    //                         .post("/api/fruits")
    //                         .send(strawberry);
        
    //     expect(response.statusCode).toBe(500);
    // });

    it("should return fruit object with the provided body", async () => {
        jest.spyOn(Fruit.prototype, 'save')
        .mockReturnValue(strawberry);
        
        const response = await request(app)
                            .post("/api/fruits")
                            .send(strawberry);
    
        expect(response.body).toHaveProperty('name');
    });

    it("should return an exception error", async () => {
        
        let testObject = {
            name: 'test-object'
        }

        jest.spyOn(Fruit.prototype, 'save')
        .mockImplementation(() => {throw new Error()});
        
        const response = await request(app)
                            .post("/api/fruits")
                            .send(testObject);
        expect(response.statusCode).toBe(500);
    });
});

describe('PUT /api/fruits/updatefruit', () => {

    it('should return an error if request body is not valid', async () => {
        const response = await request(app)
        .put("/api/fruits/updatefruit");
    
    expect(response.statusCode).toBe(400);
    });

    it('should return an error if fruit name is not in the database', async () => {

        jest.spyOn(Fruit, 'findOne')
            .mockImplementation();
        
        const response = await request(app)
        .put("/api/fruits/updatefruit")
        .send(strawberry);

    
    expect(response.statusCode).toBe(400);
    });

    it('should return an exception if an error occurred while updating', async () => {

        jest.spyOn(Fruit, 'findOne')
            .mockImplementation(() => strawberry);
        
        jest.spyOn(Fruit, 'updateOne')
            .mockImplementation(() => {throw new Error()});
        
        
        const response = await request(app)
        .put("/api/fruits/updatefruit")
        .send(strawberry);

    
    expect(response.statusCode).toBe(500);
    });

    it('should return the fruit', async () => {

        jest.spyOn(Fruit, 'findOne')
            .mockImplementation(() => strawberry);
        
        jest.spyOn(Fruit, 'updateOne')
            .mockImplementation(() => strawberry);
        
        
        const response = await request(app)
        .put("/api/fruits/updatefruit")
        .send(strawberry);

    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name');

    });
});


