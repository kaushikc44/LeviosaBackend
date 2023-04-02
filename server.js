const express = require('express');
const cors = require('cors');
const app = express();
const functions = require("firebase-functions");

app.use(express.json());
app.use(cors({ origin: 'https://aptos-ai-mint.vercel.app' }));

const port = 5000
app.use("/api/v0",require('./openNavigation.js'));

// app.listen(port,()=>{
//     console.log("listening on port " + port);
// })

exports.api = functions.https.onRequest(app)