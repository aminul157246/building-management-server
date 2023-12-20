// building_management
// yrVRkFjdFzgVas8v


const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASS}@cluster0.6v8amsy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {


      
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      
      
      
      const appartmentCollections = client.db("appartment").collection("appartmentCollection");
      const agreementCollection = client.db("agreement").collection("agreementDB")
      const detailsCollection = client.db('details').collection('detailsDB')


      app.get('/appartment', async(req, res) => {
        console.log(req.query);
        const page = parseInt(req.query.page)
        const size = parseInt(req.query.size)
        const result = await appartmentCollections.find()
        .skip(page * size)
        .limit(size)
        .toArray()
        res.send(result)
       })


      app.get('/details', async(req, res) => {
        const result = await detailsCollection.find().toArray()
        res.send(result)
       })

       app.get('/details/:id', async(req, res) => {
        const id = req.params.id
        const query = {_id : new ObjectId(id)}
        const result = await detailsCollection.findOne(query)
        res.send(result)
       })



    //    agreement add to cart 
       app.post('/agreement', async(req, res) => {
        const cartItem = req.body;
        const result = await agreementCollection.insertOne(cartItem)
        res.send(result)
       })

       app.get('/agreement' , async(req, res) => {
        const result = await agreementCollection.find().toArray()
        res.send(result)
       })









    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('CRUD  is running ......!')
})

app.listen(port, () => {
  console.log(`App is  listening on port ${port}`)
})
