import ViteExpress from "vite-express";
import app from "./app.js";

const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;

ViteExpress.listen(app, port, () => console.log(`Server is listening on port ${port} ...`));

process.on("SIGTERM", function () {
    console.log(`SIGTERM signal received: closing HTTP server.`);
    process.exit();
});

process.on("SIGINT", function () {
    console.log(`SIGINT signal received: closing HTTP server.`);
    process.exit();
});
