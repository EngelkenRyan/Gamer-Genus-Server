const Express = require("express");
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");

const { SavedgameModel } = require("../models")

router.get('/practice', (req,res) => {
    res.send('Hey!! This is a practice route! does it')
})

// Savedgame Create
router.post("/createsaved", validateJWT, async (req,res) => {
    const { gametitle, genre, description, platform } = req.body.savedgame;
    const { id } = req.user;
    const savedEntry = {
        gametitle,
        genre,
        description,
        platform,
        owner: id
    }
    try {
        const newSaved = await SavedgameModel.create(savedEntry);
        res.status(200).json(newSaved);
    } catch (err) {
        res.status(500).json({error: err});
    }
})

// Savedgame Update

router.put("/updatesaved/:descriptionId", validateJWT, async (req, res) => {
    const { gametitle, genre, description, platform } = req.body.savedgame;
    const descriptionId = req.params.descriptionId;
    const userId = req.user.id;

    const query = {
        where: {
            id: descriptionId,
            owner: userId
        }
    }

    const updatedSaved = {
        gametitle: gametitle,
        genre: genre,
        description: description,
        platform: platform
    }

    try {
        const update = await SavedgameModel.update(updatedSaved, query)
        res.status(200).json(update)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

// Saved Game Delete

router.delete("/saveddelete/:id", validateJWT, async (req, res) => {
    const userId = req.user.id
    const descriptionId = req.params.id;

    try {
        const query ={
            where: {
                id: descriptionId,
                owner: userId
            }
        };
        await SavedgameModel.destroy(query);
        res.status(200).json({ message: "Saved Game Delete" });
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

// Saved Game Mine

router.get("/savedmine", validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const savedGames = await SavedgameModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(savedGames);
    } catch (err) {
        res.status(500).json({ error: err })
    }
})


module.exports = router