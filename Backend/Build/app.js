"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const stripe_1 = __importDefault(require("stripe"));
const uuid_1 = require("uuid");
const app = express_1.default();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2020-03-02"
});
// MIDDLEWARES
app.use(express_1.default.json());
app.use(cors_1.default());
// ROUTES
app.get("/", (req, res) => {
    res.send("Its working");
});
app.post("/payment", (req, res) => {
    const { product, token } = req.body;
    console.log("product = ", product);
    console.log("price = ", product.price);
    const idempotencyKey = uuid_1.v4();
    return stripe.customers.create({
        email: token.email,
        source: token.id
    })
        .then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: customer.email,
            description: product.name,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_coutry,
                    line1: token.card.address_line1
                }
            }
        }, { idempotencyKey });
    })
        .then(result => res.status(200).json(result))
        .catch(err => {
        console.log(err);
        res.status(500).json({ err });
    });
});
// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server started at port ${PORT}`));
