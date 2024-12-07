const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connect = require("./db/db")
const rabbitMq = require("./service/rabbit");

rabbitMq.connectRabbitMQ();
connect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




app.use("/", require("./routers/user.routes")); // Use user router

module.exports = app; // Export app
