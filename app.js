const express = require('express');
const app = express();
require('./db/connect')
const notFound = require('./middleware/not-found')
const cors = require("cors");

const users = require('./routes/main')

app.use(cors());
app.use(express.json());
 app.use(users);

app.use(notFound);

const port = 4000;

app.listen(port,console.log(`server is listening on port ${port}`))
