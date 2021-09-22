import { Router } from "express";
const router = Router();
import * as passport from "passport";
import * as path from "path";
import {checkBans, sendAppealEmbed} from "../bot";
import { getFormHTML } from "./views/form";
import Appeal from "../database/Appeal";
import * as mongoose from "mongoose";
import BlockedUser from "../database/Blocked";

router.get("/discord", passport.authenticate("discord"));

router.get("/discord/redirect", passport.authenticate("discord"), async (req, res) => {
    let user: any = await req.user;
    let isBanned = await checkBans(user.ID)
    if (!isBanned) return res.redirect(req.baseUrl + '/error');
    let blockedData = await BlockedUser.find({ID: user.ID})
    if (blockedData) return res.redirect(req.baseUrl + '/blocked');

    res.redirect(req.baseUrl + '/form');

})

router.get("/error", async (req, res) => {
    return res.sendFile(path.join(__dirname, "/views/error.html"))
})

router.get("/blocked", async (req, res) => {
    return res.sendFile(path.join(__dirname, "/views/blocked.html"))
})

router.get("/form", async (req, res) => {
    if (!req.user) return res.redirect(req.baseUrl + '/discord/redirect');

    let user: any = await req.user;
    let isBanned = await checkBans(user.ID)
    if (!isBanned) return res.sendFile(path.join(__dirname, "/views/error.html"))

    let exist = await Appeal.findOne({
        UserID: user.ID,
        Unbanned: false
    })

    if (exist) return res.sendFile(path.join(__dirname, "/views/doubleForm.html"))
    let blockedData = await BlockedUser.find({ID: user.ID})
    if (blockedData) return res.redirect(req.baseUrl + '/blocked');

    res.append("Content-Type", "text/html").send(getFormHTML(req.user))
})

router.get("/form/get", async (req, res) => {

    let user:any = req.user;
    if(!req.user) return res.redirect(req.baseUrl + '/discord/redirect');

    let isBanned = await checkBans(user.ID)
    if (!isBanned) return res.sendFile(path.join(__dirname, "/views/error.html"))
    let blockedData = await BlockedUser.find({ID: user.ID})
    if (blockedData) return res.redirect(req.baseUrl + '/blocked');

    if(
        !req.query ||
        !req.query.banReason ||
        !req.query.appealText ||
        !req.query.futureActions
    ) return res.redirect(req.baseUrl + '/unknown');

    let { banReason, appealText, futureActions } = req.query;
    let AppealID = await generateToken()

    let exist = await Appeal.findOne({
        UserID: user.ID,
        Unbanned: false
    })

    if(exist) return res.sendFile(path.join(__dirname, "/views/doubleForm.html"))

    const newAppeal = new Appeal({
        _id: new mongoose.Types.ObjectId(),

        AppealID,
        MessageID: "none",
        UserID: user.ID,
        User: {
            ID: user.ID,
            Tag: user.Tag,
            Avatar: user.Avatar
        },
        Unbanned: false,

        banReason,
        appealText,
        futureActions
    })

    newAppeal.save()
        .then(async doc => {
            let appeal = await sendAppealEmbed(user, doc);
            if (!appeal) {
                console.log("Error: Ha ocurrido un error intentado mandar el embed de apelación al canal\nPor favor, comprueba la configuración")
                return res.sendFile(path.join(__dirname, "/views/unknownError.html"))
            }
        })
        .catch(e => { console.log(e); return res.sendFile(path.join(__dirname, "/views/unknownError.html"))})

    return res.sendFile(path.join(__dirname, "/views/success.html"))
})

async function generateToken() {

    const token = Math.floor(Math.random() * 50000) + 1;

    let id = await Appeal.findOne({
        AppealID: token
    })

    if(!id) return token.toString();
    await generateToken();
}


export default router