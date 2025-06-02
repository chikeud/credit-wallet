"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kycHandler_1 = require("../handlers/kycHandler");
const kycRouter = (0, express_1.Router)();
kycRouter.post('/verify', kycHandler_1.verifyHandler);
exports.default = kycRouter;
