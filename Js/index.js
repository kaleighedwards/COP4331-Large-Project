const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

require('dotenv').config();
const uri = process.env.MONGODB_URI;
mongoose.connect(uri).then(() => console.log("Mongo DB connected")).catch(err => console.log(err));

var api = require('./api');
api.setApp( app, mongoose );

const PORT = process.env.PORT || 3000;
app.listen(
    // Lets us know that the server is running
    PORT,
    () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    }
);

