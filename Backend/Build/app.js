"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = express_1.default();
// MIDDLEWARES
app.use(express_1.default.json());
app.use(cors_1.default());
// ROUTES
app.get("/", (req, res) => {
    res.send("Its working");
});
// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server started at port ${PORT}`));
