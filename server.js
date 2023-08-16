const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 4000;
const app = express();
require("dotenv").config();

//MIDDLEWARE SETUP

app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://zahid:191002002@e-med.aykkb3z.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
    const database = client.db("e-med-database");
    const users = database.collection("users");
    const products = database.collection("products");
    const medicine = database.collection("medicine");

    app.get("/users", async (req, res) => {
      res.send(await users.find({}).toArray());
    });

    app.post("/users", async (req, res) => {
      res.json(await users.insertOne(req.body));
    });

    // app.put("/users/:id", async (req, res) => {
    //   const result = await users.update(
    //     { _id: ObjectId(req.params.id) },
    //     { $set: req.body }
    //   );
    //   res.send({ result });
    // });

    app.get("/products", async (req, res) => {
      res.send(await products.find({}).toArray());
    });

    app.post("/products", async (req, res) => {
      res.json(await products.insertOne(req.body));
    });

    app.delete("/products/:id", async (req, res) => {
      res.json(await products.deleteOne({ _id: ObjectId(req.params.id) }));
    });

    app.delete("/products/remove/all", async (req, res) => {
      res.json(await products.deleteMany({}));
    });

    app.get("/medicine", async (req, res) => {
      res.send(await medicine.find({}).toArray());
    });

    app.put("/medicine/:id", async (req, res) => {
      try {
        const productId = req.params.id;
        const updateFields = {};
    
        if (req.body.med_name) {
          updateFields.med_name = req.body.med_name;
        }
    
        if (req.body.gen_name) {
          updateFields.gen_name = req.body.gen_name;
        }
    
        if (req.body.comp_name) {
          updateFields.comp_name = req.body.comp_name;
        }
    
        if (req.body.mgml) {
          updateFields.mgml = req.body.mgml;
        }
    
        if (req.body.indication) {
          updateFields.indication = req.body.indication;
        }
    
        if (req.body.pharma) {
          updateFields.pharma = req.body.pharma;
        }
    
        if (req.body.dosage) {
          updateFields.dosage = req.body.dosage;
        }
    
        if (req.body.side_effect) {
          updateFields.side_effect = req.body.side_effect;
        }
    
        if (req.body.available) {
          updateFields.available = req.body.available;
        }
    
        if (req.body.ppp) {
          updateFields.ppp = req.body.ppp;
        }
    
        if (req.body.med_img) {
          updateFields.med_img = req.body.med_img;
        }
    
        // Add more fields here...
    
        const result = await users.updateOne(
          { _id: new ObjectId(productId) },
          { $set: updateFields }
        );
    
        if (result.matchedCount > 0 && result.modifiedCount > 0) {
          res.json({ message: "Product updated successfully" });
        } else {
          res.status(404).json({ error: "Product not found or not updated" });
        }
      } catch (error) {
        res.status(500).json({ error: "An error occurred while updating the product" });
      }
    });
    

    app.delete("/medicine/:id", async (req, res) => {
      res.json(await medicine.deleteOne({ _id: new ObjectId(req.params.id) }));
    });

    app.post("/medicine", async (req, res) => {
      res.json(await medicine.insertOne(req.body));
    });

    app.delete("/users/:id", async (req, res) => {
      res.json(await users.deleteOne({ _id: ObjectId(req.params.id) }));
    });

    app.delete("/users/delete/all", async (req, res) => {
      res.json(await users.deleteMany({}));
    });

    app.put("/users/:email", async (req, res) => {
      const result = await users.updateOne(
        { email: req.params.email },
        { $set: { role: "admin" } }
      );
      res.send({ result });
    });

    app.get("/users/:email", async (req, res) => {
      const user = await users.findOne({ email: req.params.email });
      let admin = false;
      let log_user = false;
      if (user?.role === "admin") {
        admin = true;
      } else if (user?.role === "user") {
        log_user = true;
      }
      res.json({ admin: admin, user: log_user });
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.status(200).send("Server Running [OK]");
});
app.listen(port, () => {
  console.log("[*] Listening to port ", port);
});
