const shopOwner = require("../../../middleware/shopOwner");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};
  
const mockRequest = (user) => {
    const req = {};
    req.user = user;
    return req;
};

describe("shopOwner middleware", ()=> {
    it("should return an error if req.user.isShopOwner is undefined", () => {
        
        const user = {
            _id: mongoose.Types.ObjectId(),
            name: "mockUser",
            email: "mockUser@example.com",
            password: "123445678"
        };
        
        const req = mockRequest(user);
        const res = mockResponse();
        const next = jest.fn();
        
        
        shopOwner(req, res, next);
    
        expect(res.status).toHaveBeenCalledWith(403);
    });
    it("should return an error if req.user.isShopOwner is false", () => {
        
        const user = {
            _id: mongoose.Types.ObjectId(),
            name: "mockUser",
            email: "mockUser@example.com",
            password: "123445678",
            isShopOwner: false
        };
        
        const req = mockRequest(user);
        const res = mockResponse();
        const next = jest.fn();
        
        
        shopOwner(req, res, next);
    
        expect(res.status).toHaveBeenCalledWith(403);
    });
    it("should pass if req.user.isShopOwner is true", () => {
        
        const user = {
            _id: mongoose.Types.ObjectId(),
            name: "mockUser",
            email: "mockUser@example.com",
            password: "123445678",
            isShopOwner: true
        };
        
        const req = mockRequest(user);
        const res = mockResponse();
        const next = jest.fn();
        
        
        shopOwner(req, res, next);
    
        expect(next).toHaveBeenCalledTimes(1);
    });
});