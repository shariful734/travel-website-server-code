const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

require('dotenv').config();



const app = express();
const port = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a21d7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("GlobePlus");
        const countriesCollection = database.collection("countries");

        const userDataCollection = database.collection("userdata")

        // Getting the API 

        app.get('/countries', async (req, res) => {
            const cursor = countriesCollection.find({});
            const countries = await cursor.toArray();
            res.send(countries);
        })

        // Get A Single SErvice 
        app.get('/countries/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific one', id);
            const query = { _id: ObjectId(id) };
            const specificOne = await countriesCollection.findOne(query);
            res.json(specificOne);
        })


        // Posting The API 
        app.post('/countries', async (req, res) => {
            const country = req.body;
            console.log('hit the post api');
            const result = await countriesCollection.insertOne(country);
            console.log(result);
            res.json(result);
        })

        // user data post Api 

        app.post('/userdata', async (req, res) => {
            const userData = req.body;
            console.log(userData);
            console.log('hitting user data post');
            const data = await userDataCollection.insertOne(userData, country);
            res.json(data);
        })

        // getting user api 

        app.get('/userdata', async (req, res) => {
            const findUsers = userDataCollection.find({});
            const users = await findUsers.toArray();
            res.send(users);
        })

        // get single user booking
        app.get('/userdata/:bookingId', async (req, res) => {
            const bookingId = req.params.id;
            const queryTwo = { _id: ObjectId(bookingId) };
            const specificBooking = await userDataCollection.findOne(queryTwo);
            res.json(specificBooking);
        })
    }
    finally {
        // await client.close()
    }
}

app.get('/', (req, res) => {
    res.send('running Globe Plus server test server')
});

app.listen(port, () => {
    console.log('running server on port', port);
})

run().catch(console.dir);