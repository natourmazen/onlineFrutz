# onlineFrutz

## _NodeJS Capstone Project_

onlineFrutz is a RESTful API application written in JavaScript using NodeJS, ExpressJS and MongoDB. It is an online fruit shop that sells only strawberries and bananas.

## Features
- Sign up and login as either a shop owner, or as a client.
- List all the available fruits with their price and quantity.
- List all transactions of a client.
- List transactions of all clients, as a shop owner.
- Filter transactions by id, as a shop owner.
- Update fruit price and quantity, as a shop owner.


## Tech

onlineFrutz uses a number of open source projects to work properly:

- [Node.js](https://nodejs.org/) - back-end JavaScript runtime environment
- [Express.js](https://expressjs.com/) - fast node.js network app framework
- [MongoDB](https://www.mongodb.com/) - document-oriented database program
- [mongoose](https://mongoosejs.com/) - MongoDB object modeling tool for node.js
- [Joi](https://joi.dev/api/?v=17.4.2) - JavaScript data validators
- [Jest](https://jestjs.io/) - JavaScript testing framework

## Installation

onlineFrutz requires [Node.js](https://nodejs.org/) and [mongoDB](https://www.mongodb.com/) to run.

Clone repository to your device.

```
git clone https://github.com/natourmazen/onlineFrutz.git
```

Install the dependencies and devDependencies.

```
cd onlineFrutz
npm install
```

Set environment variable.

```
set/export NODE_ENV=development
set/export onlineFrutz_jwtPrivateKey=JWT-KEY-GOES-HERE
set/export onlineFrutz_DB=CONNECTION-STRING
set/export PORT=PORT-GOES-HERE
```

## Start the application

```
npm start
```

## Unit test the application

```
npm test
```

## Postman Collection

[onlineFrutz Postman Collection](https://www.getpostman.com/collections/f5ddc4c530c45362559a)
