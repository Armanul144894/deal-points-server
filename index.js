const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.g6tcnhj.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productsCollection = client.db("dealPoints").collection("products");
    const usersCollection = client.db("dealPoints").collection("users");
    const bookingsCollection = client.db("dealPoints").collection("bookings");
    const addedProductsCollection = client
      .db("dealPoints")
      .collection("addedProducts");

    app.get("/products", async (req, res) => {
      const query = {};
      const products = await productsCollection.find(query).toArray();
      res.send(products);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.find(query).toArray();
      res.send(product);
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const bookings = await bookingsCollection.find(query).toArray();
      res.send(bookings);
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const booked = await bookingsCollection.insertOne(booking);
      res.send(booked);
    });

    app.get("/addedProducts", async (req, res) => {
      const query = {};
      const products = await addedProductsCollection.find(query).toArray();
      res.send(products);
    });
    app.post("/products", async (req, res) => {
      const product = req.body;
      const products = await addedProductsCollection.insertOne(product);
      res.send(products);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("deal point server running");
});
app.listen(port, () => {
  console.log(`deal point server running on port: ${port}`);
});
