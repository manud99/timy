"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const timeEntries_1 = require("../controllers/timeEntries");
const router = (0, express_1.Router)();
router.get("/", timeEntries_1.get);
exports.default = router;
