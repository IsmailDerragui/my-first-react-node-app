const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

// initialize express app
const app = express();

const port = 8080;
const hostname = "0.0.0.0";
const dbUrl = 'mongodb+srv://IsmailDerragui:Liamsi345@cluster0-1cloa.mongodb.net/test?retryWrites=true&w=majority';

// Set up mongoose connection (source : https://codeburst.io/writing-a-crud-app-with-node-js-and-mongodb-e0827cbbdafb)

let dev_db_url = dbUrl;
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200);
    res.send("First node api rest of Ismail Derragui")
});

const userRoute = require('./api/routes/userRoute');
userRoute(app);

app.listen(port, hostname);

