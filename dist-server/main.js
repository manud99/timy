"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const vite_express_1 = __importDefault(require("vite-express"));
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
vite_express_1.default.listen(app_1.default, port, () => console.log(`Server is listening on port ${port} ...`));
process.on("SIGTERM", function () {
    console.log(`SIGTERM signal received: closing HTTP server.`);
    process.exit();
});
process.on("SIGINT", function () {
    console.log(`SIGINT signal received: closing HTTP server.`);
    process.exit();
});
