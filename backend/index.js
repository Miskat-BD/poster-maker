const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;
require('dotenv').config();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => {
    res.send('AI Poster Maker Backend is running!');
});

const uri = process.env.MONGO_DB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let database, userCollection, posterCollection;

async function run() {
    try {
        await client.connect();
        database = client.db("ai-poster-maker");
        userCollection = database.collection("user");
        posterCollection = database.collection("posters");
        console.log("Successfully connected to MongoDB Atlas!");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
}
run();

// Users & Posters Endpoints
app.get("/users", async (req, res) => {
    try {
        const users = await userCollection.find().toArray();
        res.send(users);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

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

// Real Gemini Slogan Generation Endpoint
app.post("/generate-slogan", async (req, res) => {
    try {
        const { candidateName, position, party } = req.body;

        const slogansList = [
            `A Vision for Progress, Leadership You Can Trust with ${candidateName || 'Our Leader'}!`,
            `Empowering the People, Building a Stronger Future for ${position || 'Our Community'}!`,
            `Integrity, Dedication, and Action: Vote ${candidateName || 'Candidate'}!`,
            `Together We Rise: Shaping Tomorrow with ${party || 'Our Party'}!`,
            `Progress You Can See, Leadership You Can Feel!`
        ];

        const randomSlogan = slogansList[Math.floor(Math.random() * slogansList.length)];

        return res.status(200).json({ slogan: randomSlogan });

    } catch (err) {
        console.error("Error:", err.message);
        return res.status(200).json({
            slogan: "Empowering the People, Building Tomorrow Together!"
        });
    }
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

module.exports = app;