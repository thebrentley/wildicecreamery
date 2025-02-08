# Wild Ice Creamery API

This is a simple API for Wild Ice Creamery.

# Getting Started

## Prerequisites

- Install node:
- Install npm
- Install yarn (optional)
- postgres (optional w/ docker)

### Postgres db

You can use any postgres db, but the easiest way is to use docker-compose to pull and run the postgres db.
Otherwise, you can set the `DATABASE_URL` environment variable to any onprem or cloud hosted postgres db. Just make sure to create a new db: `wildicecreamery`, for example.

### ENV

See .env.example for the required environment variables.

### docker-compose (optional)

You can use docker-compose to pull and run the postgres db by running
`docker-compose up -d`
Connect to it remotely, and create a new db called wildicecreamery. Note the user/password in the docker-compose.yml for connection. When the app starts, it will create all the tables.

### Seed db with products (optional)

You can seed the db with products by running the insert script at `./init-seed.sql`

# Run tests

`yarn test` or `npm test`

# Run the API

`yarn start` or `npm start`

# API Endpoints

Below are the api endpoints that are served by the API.

## Products

### GET /products

Returns a list of products.

## Order

### POST /orders

Creates a new order.
Example body:

```
{
  email": "thebrentley7@gmail.com",
  "products": [
    {
      "id": 1,
      "quantity": 2
    },
    {
      "id": 4,
      "quantity": 1
    }
  ]
}
```

## Email

### POST /email/order

Sends an email to the user.
This is mostly just for test purposes and to match specs for the assignment. Ideally, the products added are linked to an existing product rather than being freeform. This endpoints does not save any data to the db and acts just as a pass through to the email service. You can pass any products you want in the body.
Example body:

```
{
  "orderId":"order_1234",
  "email":"customer_email@gmail.com",
  "productDetails":[
    {
      "name":"Wireless Headphones",
      "price":"$99.99",
      "quantity":1
    },
    {
      "name":"Bluetooth Speaker",
      "price":"$49.99",
      "quantity":2
    }
  ]
}
```
