const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config;
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello from database");
});
const uri =
  "mongodb+srv://MyProjects:yesicanmakeit40@cluster0.o0xk6.mongodb.net/volunteerdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  console.log("mongodb connected");
});

app.listen(process.env.PORT || port);
