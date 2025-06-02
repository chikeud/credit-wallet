"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const riskHandler_1 = require("../handlers/riskHandler");
const riskRouter = (0, express_1.Router)();
riskRouter.get('/:accountId', riskHandler_1.handleRisk);
exports.default = riskRouter;
