const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

const bodyParser = require('body-parser');

const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();

app.use(cors())

const PORT = 5000

// Use body-parser middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1ojkkcd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

 
// Read all User
app.get("/user",(req,res)=>{
    //res.send("Hello World");
    async function run() {
        try {
            await client.connect();
            const db = client.db("CurdUserData");

            //user collection create
            const col = db.collection("user");
      
          // Read documents
          const document = await col.find().toArray();
          //console.log("Document Found" + JSON.stringify(document));
      
          // iterate code goes here
          //await document.forEach(console.log);
          res.send(JSON.stringify(document));
      
        } finally {
          // Ensures that the client will close when you finish/error
          await client.close();
        }
      }
      run().catch(console.dir);
})

// Delete User
app.delete("/deleteUser/:id",(req,res)=>{
    const id = req.params.id;
    console.log(id);

    async function run(){
        try{
            //await client.connect();
            // Connect to the Atlas cluster
            await client.connect();
            const db = client.db("CurdUserData");

            //user collection create
            const col = db.collection("user");
            const document = await col.deleteOne({"_id":new ObjectId(id)});
            res.send(document);

        }
        finally{
            await client.close();
        }
    }
    run().catch(console.dir);
})

// Add new User
app.post("/adduser",(req,res)=>{
    const data = req.body;
    console.log(data);
    async function run(){
        try{
            await client.connect();
            const db = client.db("CurdUserData");
            const col = db.collection("user");

            const p = await col.insertOne(data);
            res.send(p);
        }
        finally{
            await client.close();
        }
    }
    run().catch(console.dir);
})

// Update User
app.put("/edituser/:id",(req,res)=>{
    const data = req.body;
    async function run(){
        try{
            await client.connect();
            const db = client.db("CurdUserData");
            const col = db.collection("user");

            const p = await col.updateOne({_id:new ObjectId(data.id)},{$set:{name:data.name,email:data.email}});
            res.send(p);
        }
        finally{
            await client.close();
        }
    }
    run().catch(console.dir);
})

app.listen(PORT,()=>{
    console.log(`App is listening on port ${PORT}`);
})