import * as express from "express";
import * as path from "path";

const port = process.env.PORT || 8080;
const app = express();

app.set("port", port);

const http = require("http").Server(app);

app.use(express.static(path.join(`${__dirname}/../web`)))

app.get("/hello", (req, res) => {
  res.json({
      data: 'World'
  });
});

const server = http.listen(port, function() {
  console.log("Listening for connections ...");
});
