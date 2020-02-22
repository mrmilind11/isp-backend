const express = require('express');
const app = express();
const cors = require('cors');
const errorMiddleware = require('./middlewares/error');

app.use(express.json());
app.use(cors());

require('./startup/server')(app);
require('./startup/db')();
require('./startup/static')(app);
require('./startup/route')(app);

app.use(errorMiddleware);