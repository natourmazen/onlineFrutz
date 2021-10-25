const configuration = require('../../../startup/config');
const config = require('config');

describe('Startup Config.js', () => {
    it('should throw an error if jwt private key is not defined', () => {
        jest.spyOn(config, 'get')
            .mockImplementation()
        
        expect(configuration).toThrowError();
    })
});