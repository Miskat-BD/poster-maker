const express = require('express')
const cors = require('cors');
const app = express()
const port = 8000
require('dotenv').config();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const uri = process.env.MONGO_DB_URI;

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

        const database = client.db("ai-poster-maker");
        const userCollection = database.collection("user");
        const posterCollection = database.collection("posters");

        app.get("/users", async (req, res) => {
            const users = await userCollection.find().toArray();
            res.send(users);
        });

        // Poster Endpoints
        app.get("/posters", async (req, res) => {
            try {
                const email = req.query.email;
                let query = {};
                if (email) {
                    query = { userEmail: email };
                }
                const posters = await posterCollection.find(query).sort({ createdAt: -1 }).toArray();
                res.send(posters);
            } catch (err) {
                res.status(500).send({ error: err.message });
            }
        });

        app.post("/posters", async (req, res) => {
            try {
                const posterData = req.body;
                posterData.createdAt = new Date();
                const result = await posterCollection.insertOne(posterData);
                res.status(201).send({ success: true, insertedId: result.insertedId, poster: posterData });
            } catch (err) {
                res.status(500).send({ error: err.message });
            }
        });

        app.get("/posters/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const poster = await posterCollection.findOne({ _id: new ObjectId(id) });
                if (!poster) {
                    return res.status(404).send({ error: "Poster not found" });
                }
                res.send(poster);
            } catch (err) {
                res.status(500).send({ error: err.message });
            }
        });

        app.delete("/posters/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const result = await posterCollection.deleteOne({ _id: new ObjectId(id) });
                res.send({ success: true, deletedCount: result.deletedCount });
            } catch (err) {
                res.status(500).send({ error: err.message });
            }
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app;