const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config;
const app = express();
const fileUpload = require("express-fileupload");
const fs = require("fs-extra");
const port = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("services"));
app.use(fileUpload());

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
  const allServicesCollection = client.db("awesome").collection("services");
  const adminsCollection = client.db("awesome").collection("admins");

  console.log("mongo db connected");
  app.post("/addOrder", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.post("/addReviews", (req, res) => {
    const reviews = req.body;
    reviewsCollection.insertOne(reviews).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.post("/addAdmins", (req, res) => {
    const admin = req.body;
    console.log(admin);
    adminsCollection.insertOne(admin).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/getServices", (req, res) => {
    ordersCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/getReviews", (req, res) => {
    reviewsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/getOrders", (req, res) => {
    ordersCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/getServicesByAdmin", (req, res) => {
    allServicesCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/getAllService", (req, res) => {
    allServicesCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addNewService", (req, res) => {
    const file = req.files.file;
    const title = req.body.service;
    const description = req.body.description;
    const readImg = file.data;
    const base64 = readImg.toString("base64");
    console.log(file, title, description);
    const image = {
      contentType: req.files.file.mimetype,
      size: req.files.file.size,
      img: Buffer.from(base64, "base64"),
    };

    allServicesCollection
      .insertOne({ title: title, description: description, image: image })
      .then(() => {
        res.end();
      });
  });

  app.patch("/updateStatus", (req, res) => {
    ordersCollection
      .updateOne(
        { _id: ObjectId(req.body.id) },
        {
          $set: { status: req.body.changedStatus },
        }
      )
      .then((result) => {
        res.send(result);
      });
  });

  app.get("/isAdminExist/:email", (req, res) => {
    console.log(req.params.email);
    adminsCollection
      .find({ email: req.params.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
});

app.listen(process.env.PORT || port);
