const express = require("express");
const router = express.Router();
const {
    getButtons,
    getWords,
    getWord,
    searchWord,
    addWord,
    deleteWord,
    updateWord,
    getUsers
} = require("../model/index.js");


function routes(app) {
    app.use(express.json());

    router.get("/buttons", async (req, res) => {
        const limit = req.query.limit;
        const buttons = await getButtons().then(data => {
            return data
        }).catch(err => {
            console.log(err)
        })
        let btns = [];
        for (let i = 1; i <= Math.ceil(buttons.length / limit); i++) {
            btns.push(i)
        }
        res.json(btns)
    }),
    router.get("/izoh", async(req, res) => {
        const offset = req.query.page
        const limit = req.query.limit
        const words = await getWords(offset, limit)
        res.json(words)
    }),
    router.get("/izoh/:id", async(req, res) => {
        const word = await getWord(req.params.id).then(word => {
            return word
        }).catch(err => {
            console.log(err)
        })
        res.json(word)
    }),
    router.get("/izoh/search/:word", async(req, res) => {
        const words = await searchWord(req.params.word).then(words => {
            return words
        }).catch(err => {
            console.log(err)
        })
        if (words.length > 0) {
            res.json(words)
        } else {
            res.json({
                message: "Not found"
            })
        }
    }),
    router.post("/addword", (req, res) => {
        addWord(req.body.word, req.body.definition, req.body.fulldefinition).then(data => {
            res.json({ id: data })
        }).catch(err => {
            res.json({ message: err })
        })
    }),
    router.delete("/izoh/:id", (req, res) => {
        if(req.params.id == ""){
            res.sendStatus(400)
        }
        deleteWord(req.params.id);
        res.json({message: "Deleted" });
    }),
    router.put("/izoh/:id", (req, res) => {
        updateWord(req.params.id, req.body.word, req.body.definition, req.body.fulldefinition).then(data => {
            res.status(200).send({ message: "Row updated"})
        }).catch(err => {
            res.status(400).send(err)
        })
    }),
    router.get("/users", async (req, res) => {
        const users = await getUsers()
        res.json(users)
    })

    return router;
};

module.exports = routes;