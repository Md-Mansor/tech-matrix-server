const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken')
require('dotenv').config()
const port = process.env.PORT || 5000;





// middleware
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
})
);
app.use(express.json());

// user : final-project 
// pass : Q0pLr2VsR0z9oQY7



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        const userCollection = client.db('techMatrix').collection('users')
        const deletedUserCollection = client.db('techMatrix').collection('deletedUser')
        const productCollection = client.db('techMatrix').collection('products')
        // jwt related api
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "24h"
            });
            res.send({ token });
        })

        // products post and get

        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result)
        })

        app.get('/products', async (req, res) => {

            const result = await productCollection.find().toArray();
            res.send(result)
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            // console.log(result);
            res.send(result);
        })

        app.patch('/products/featured/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    featured: "true",
                }
            }
            const result = await productCollection.updateOne(filter, updateDoc);
            res.send(result);
        })
        app.patch('/product/status/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: "verified",
                }
            }
            const result = await productCollection.updateOne(filter, updateDoc);
            res.send(result)
        })

        app.get('/product/featured', async (req, res) => {
            const query = { featured: "true" };
            const result = await productCollection.find(query).toArray();
            // console.log(result);
            res.send(result);
        })

        app.get('/product/status', async (req, res) => {
            const query = { status: "verified" };
            const result = await productCollection.find(query).toArray();
            // console.log(result);
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result)
        });

        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            // console.log(email);
            const query = { email: email };
            const result = await userCollection.findOne(query);
            // console.log(result);
            res.send(result);
        })

        // user related api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const userExist = await userCollection.findOne(query);
            if (userExist) {
                return res.send({ massage: "user Exist", insertedId: null })
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })
        app.delete('/deletedUsers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await deletedUserCollection.deleteOne(query);
            res.send(result)
        })

        app.get('/deletedUsers', async (req, res) => {
            const result = await deletedUserCollection.find().toArray();
            res.send(result)
        })

        app.post('/deletedUsers', async (req, res) => {
            const deletedUser = req.body.user;
            const result = await deletedUserCollection.insertOne(deletedUser)
            console.log('Deleted User:', deletedUser);
            res.send(result)
            // res.status(200).json({ message: 'Deleted user saved successfully' });
        });


        // make user admin
        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    role: "admin",
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        })
        // make user moderator
        app.patch('/users/moderator/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    role: "moderator",
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
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
    res.send('tech-project is running')

})


app.listen(port, () => {
    console.log(`tech-server is running on port ${port}`);
})