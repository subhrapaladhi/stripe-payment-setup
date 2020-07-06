import express from "express";
import cors from "cors";
import Stripe from "stripe";
import {v4 as uuid} from "uuid";

const app: express.Application = express();
const stripe = new Stripe("sk_test_51H1uk0BtWMWqSvhsTRvmM8BhXv2VzpWdCrdIlUlG1KQPgdzL1MkQBrPMqXx8pLHooWyKS1LksNsPtOVU6vZF9ltC00SdqycDNs",{
    apiVersion: "2020-03-02"
})


// MIDDLEWARES
app.use(express.json());
app.use(cors());


// ROUTES
app.get("/", (req, res) => {
    res.send("Its working");
})

app.post("/payment", (req,res) => {
    const {product, token} = req.body;
    console.log("product = ", product);
    console.log("price = ", product.price );
    
    const idempotencyKey = uuid();

    return stripe.customers.create({
        email: token.email,
        source: token.id
    })
    .then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: <string>customer.email,
            description: product.name,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_coutry,
                    line1: token.card.address_line1
                }
            }
        },{idempotencyKey})
    })
    .then(result => res.status(200).json(result))
    .catch(err => {
        console.log(err);
        res.status(500).json({err});
    })
})

// START SERVER
const PORT = process.env.PORT||3000;
app.listen(PORT, () => console.log(`server started at port ${PORT}`))
