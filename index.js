const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config;
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());
// app.use(express.static("services"));
// app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("hello from database");
});
const uri =
  "mongodb+srv://CreativeAgency:Project11@cluster0.o0xk6.mongodb.net/awesome?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const ordersCollection = client.db("awesome").collection("orders");
  const reviewsCollection = client.db("awesome").collection("reviews");
  const servicesCollection = client.db("awesome").collection("services");
  const adminCollection = client.db("awesome").collection("admins");

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order).then((result) => {
      res.send(result.insertCount > 0);
    });
  });
});

app.listen(process.env.PORT || port);
