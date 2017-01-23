'use strict';

let mongoose = require("mongoose");

let Schema = mongoose.Schema;

const NoteSchema = Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

NoteSchema.method("update", (updates, callback) => {
    Object.assign(this, updates, {updatedAt: new Date()});
    this.parent().save(callback);
});

const BrewSchema = new Schema({
    title: { type: String, required: true },
    ingredients: { type: String, required: true },
    specificGravityInitial: { type: Number, required: true },
    specificGravityFinal: {type: Number, default: 0},
    estimatedABV: {type: Number, default: 0},
    state: {type: String, default: "Initial Fermentation"},
    createdAt: {type: Date, default: Date.now},
    notes: [NoteSchema]
});

BrewSchema.pre("save", function(next){
    this.notes.sort({createdAt: -1});
    next();
});

let Brew = mongoose.model("Brew", BrewSchema);

module.exports.Brew = Brew;




