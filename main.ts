import { config } from "dotenv";
config()

import * as express from "express";
import * as passport from "passport";
import router from "./routes";
import "./strategies/discord";
import * as mongoose from "mongoose";
import * as session from "express-session";
import * as path from "path";
import { start } from "./bot";

const Store = require("connect-mongo")
const app = express();
const PORT = process.env.PORT || 4001;

mongoose.connect(process.env.MONGODB_URL, {
    autoIndex: false,
    connectTimeoutMS: 10000,
})

app.use(session({
    secret: process.env.APP_SECRET || "holasoyender",
    cookie: {
        maxAge: 60000 * 60 * 24,
    },
    resave: false,
    saveUninitialized: false,
    store: new Store({
        mongoUrl: process.env.MONGODB_URL,
        mongoOptions: {
            connectTimeoutMS: 10000,
        },
        client: session,
    })
}))
app.use(passport.initialize())
app.use(passport.session())

app.use("/api", router);

app.use("/", (req, res) => res.sendFile(path.join(__dirname, "/routes/views/index.html")));

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto: ${PORT}`));
start();