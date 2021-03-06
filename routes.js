'use strict' ;

let express = require("express");
let router = express.Router();
let Brew = require("./models").Brew;


router.param("bID", function(req, res, next, id){
    Brew.findById(id, function(err, doc){
        if(err) return next(err);
        if(!doc) {
            err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        req.brew = doc;
        return next();
    });
});

router.param("nID", function(req, res, next, id){
    req.note = req.brew.note.id(id);
    if(!req.note) {
            err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        next();
});

//GET /brews
// Route for brews collection
router.get ("/", (req, res, next) => {
    Brew.find({})
                .sort({createdAt: -1})
                .exec(function(err, brews){
                    if(err) return next(err);
                    res.json(brews);
                });
});

//POST /brews
// Route for creating brews
router.post("/", (req, res, next) => {
    let brew = new Brew(req.body);
    brew.save(function(err, brew){
        if(err) return next(err);
        res.status(201);
        res.json(brew);
    });
});

//GET /brew/:id
// Route for specific brew
router.get("/:bID", (req, res, next) => {
    res.json(req.brew);
});

//PUT /brews/:bID
// Edit a specific answer
router.put("/:bID", (req, res) => {
    req.brew.update(req.body, (err, result) => {
        if(err) return next(err);
        res.json({"status":"updated"});
    });
});

//DELETE /brews/:bID
// Delete a specific brew
router.delete("/:bID", (req, res) => {
    req.brew.remove((err, result) => {
        if(err) return next(err);
        res.json(result);
    });
});

//POST /brews/:bID/notes
// Route for creating a note
router.post("/:bID/notes", (req, res, next) => {
    req.brew.notes.push(req.body);
    req.brew.save((err, brew) => {
        if(err) return next(err);
        res.status(201);
        res.json(brew);
    });
});

//PUT /brews/:bID/notes/:nID
// Edit a specific note
router.put("/:bID/notes/:nID", (req, res) => {
    req.note.update(req.body, (err, result) => {
        if(err) return next(err);
        res.json({"status":"updated"});
    });
});

//DELETE /brews/:bID/notes/:nID
// Delete a specific note
router.delete("/:bID/notes/:nID", (req, res) => {
    req.note.remove((err) => {
        req.brew.save((err, brew) => {
            if(err) return next(err);
            res.json(brew);
        });
    });
});


module.exports = router;