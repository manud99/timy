import express from "express";
import path from "path";
import Times from './controllers/TimeController';

const port = process.env.PORT || 8080;
const app = express();

app.set("port", port);

const http = require("http").Server(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/../../web')));
app.use(Times);

const server = http.listen(port, function () {
    console.log("Listening for connections ...");
});
