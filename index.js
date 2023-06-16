const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zr5yxev.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const userCollection = client.db("jerin-parlour").collection("users");
    const serviceCollection = client.db("jerin-parlour").collection("service");
    const adminrequestCollection = client
      .db("jerin-parlour")
      .collection("adminRequest");

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.post("/addservice", async (req, res) => {
      const service = req.body;
      console.log(service);
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/adminrequest", async (req, res) => {
      const users = req.body;
      const userAdmin = await adminrequestCollection.insertOne(users);
      res.send(userAdmin);
    });
    app.get("/adminrequest", async (req, res) => {
      const query = {};
      const userAdmin = await adminrequestCollection.find(query).toArray();
      res.send(userAdmin);
    });

    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });

    app.put("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await adminrequestCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    console.log("database connected");
  } finally {
  }
}
run().catch((error) => {
  console.log(error);
});

app.get("/", (req, res) => {
  res.send("server running");
});
app.listen(port, () => {
  console.log("server running");
});
