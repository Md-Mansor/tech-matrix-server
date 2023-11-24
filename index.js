const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;





// middleware
app.use(cors());
app.use(express());

// user : final-project 
// pass : Q0pLr2VsR0z9oQY7



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://final-project:Q0pLr2VsR0z9oQY7@cluster0.xl4aigt.mongodb.net/?retryWrites=true&w=majority";

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
        // await client.connect();
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
    res.send('tech-project is running')

})


app.listen(port, () => {
    console.log(`tech-server is running on port ${port}`);
})