require("dotenv").config();
const express = require("express");
const app = express();
const msgRouter = require("./api/msgs/msg.router");
const cors = require("cors");
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use("/faq", msgRouter);

app.listen(process.env.APP_PORT, () => {

    console.log("Server up and running ON port : ", process.env.APP_PORT);
});
