"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const risk_route_1 = __importDefault(require("./api/routes/risk_route"));
const scoring_route_1 = __importDefault(require("./api/routes/scoring_route"));
const kyc_route_1 = __importDefault(require("./api/routes/kyc_route"));
const errorHandler_1 = require("./utils/errorHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/risk', risk_route_1.default);
app.use('/api/scoring', scoring_route_1.default);
app.use('/api/kyc', kyc_route_1.default);
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
exports.default = app; // For testing
