import * as express from "express";

const app = express();
app.set("port", process.env.PORT || 3000);

var http = require("http").Server(app);

app.get("/", (req: any, res: any) => {
  res.send("Hello world");
});

const server = http.listen(3000, function() {
  console.log("listening on *:3000");
});
