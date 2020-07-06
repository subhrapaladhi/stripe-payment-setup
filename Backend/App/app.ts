import express from "express";
import cors from "cors";
import stripe from "stripe";
import {v4 as uuid} from "uuid";

const app: express.Application = express();

// MIDDLEWARES
app.use(express.json());
app.use(cors());


// ROUTES
app.get("/", (req, res) => {
    res.send("Its working");
})

// START SERVER
const PORT = process.env.PORT||3000;
app.listen(PORT, () => console.log(`server started at port ${PORT}`))
