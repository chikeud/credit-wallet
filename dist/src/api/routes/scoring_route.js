"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scoringHandler_1 = require("../handlers/scoringHandler");
const scoringRouter = (0, express_1.Router)();
scoringRouter.get('/:accountId', scoringHandler_1.scoringHandler);
exports.default = scoringRouter;
